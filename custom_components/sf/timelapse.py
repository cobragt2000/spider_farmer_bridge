"""Time-lapse capture engine + authenticated HTTP endpoints for Spider Farmer Bridge.

Captures a camera.* entity on an interval into a SECURE, user-chosen folder (never a
web-served /www path), with retention. The card scrubs/plays frames through an
authenticated HTTP endpoint using short-lived signed URLs. ffmpeg export is Phase 2.

Design: _backlog_private/TIMELAPSE_DESIGN.md
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import shutil
from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    CONF_TIMELAPSE_INSTANCES,
    DEFAULT_TIMELAPSE_DIR,
    DEFAULT_TIMELAPSE_INTERVAL,
    DEFAULT_TIMELAPSE_RETENTION,
    DEFAULT_TIMELAPSE_OVERLAY_FIELDS,
    TL_NAME,
    TL_LABEL,
    TL_CAMERA,
    TL_DIR,
    TL_INTERVAL,
    TL_RETENTION,
    TL_ENABLED,
    TL_OVERLAY,
    TL_OVERLAY_BURN,
    TL_OVERLAY_PANEL,
    TL_OVERLAY_FIELDS,
    TL_OVERLAY_COLOR,
    TL_OVERLAY_GROUPED,
    TL_OVERLAY_POS,
    TL_OVERLAY_ORIENT,
    TL_OVERLAY_LABELS,
    TL_OVERLAY_FONT,
    TL_ALIGN,
    TL_DAILY_AT,
    DEFAULT_TIMELAPSE_OVERLAY_COLOR,
    slug_timelapse_id,
)

_LOGGER = logging.getLogger(__name__)

# Per-instance status signal: .format(f"{entry_id}_{tl_id}") so each card's status
# sensor only re-renders for its own time-lapse.
SIGNAL_TIMELAPSE_UPDATE = "sf_timelapse_update_{}"
# Fired (per entry) when the set of instances changes, so the sensor platform can
# add/remove status sensors. .format(entry_id)
SIGNAL_TIMELAPSE_INSTANCES = "sf_timelapse_instances_{}"
FRAME_EXT = ".jpg"
_SESSION_FMT = "%Y%m%d-%H%M%S"
# Our session folders are named by the capture timestamp (_SESSION_FMT). Used to
# tell OUR folders apart from anything else that may live in the storage root.
_SESSION_RE = re.compile(r"^\d{8}-\d{6}$")


def _safe_segment(name: str) -> bool:
    """A single path segment is safe when it has no separators or traversal."""
    return bool(name) and name not in (".", "..") and "/" not in name and "\\" not in name


class TimelapseController:
    """One capture controller per time-lapse INSTANCE (tl_id). A config entry can
    hold many — one per camera/card. Server-side so capture keeps running whether or
    not a dashboard is open. Config is read live from the entry's instances dict."""

    def __init__(self, hass: HomeAssistant, entry, tl_id: str) -> None:
        self.hass = hass
        self.entry = entry
        self.tl_id = tl_id
        self._unsub = None
        self._interval_override: int | None = None
        self._next_when: datetime | None = None   # next scheduled capture time
        self._capturing = False
        self._session: str | None = None
        self._frame_count = 0
        self._last_capture: datetime | None = None
        self._last_error: str | None = None
        self._fail_count = 0           # consecutive capture failures (drives retry backoff)
        self._busy = False
        self._export_running = False
        self._last_export: dict | None = None     # {session, name}
        self._last_export_error: str | None = None
        # Persist the capture INTENT + active session so a reboot resumes the SAME
        # time-lapse instead of stopping or starting a fresh session. Keyed per
        # instance so each camera resumes independently. (v3.19.362)
        self._store = Store(hass, 1, f"sf_timelapse_{entry.entry_id}_{tl_id}")

    # ── config (read live from this instance's options dict) ──────────────────
    def _cfg(self) -> dict:
        merged = {**self.entry.data, **(self.entry.options or {})}
        insts = merged.get(CONF_TIMELAPSE_INSTANCES) or {}
        c = insts.get(self.tl_id)
        return dict(c) if isinstance(c, dict) else {}

    def _opt(self, key, default):
        v = self._cfg().get(key)
        return default if v is None else v

    @property
    def name(self) -> str:
        return str(self._opt(TL_NAME, "") or self.tl_id)

    @property
    def label(self) -> str:
        # Optional display name for the card header. Blank by default — the card
        # falls back to the camera's friendly name so the header stays uncluttered.
        return str(self._opt(TL_LABEL, "") or "")

    @property
    def camera(self) -> str:
        return str(self._opt(TL_CAMERA, "") or "")

    @property
    def root(self) -> str:
        d = self._opt(TL_DIR, "")
        if d:
            return str(d)
        # Per-instance default so two cameras never share a folder.
        return os.path.join(DEFAULT_TIMELAPSE_DIR, self.tl_id)

    @property
    def interval(self) -> int:
        try:
            return max(5, int(self._opt(TL_INTERVAL, DEFAULT_TIMELAPSE_INTERVAL)))
        except (TypeError, ValueError):
            return DEFAULT_TIMELAPSE_INTERVAL

    @property
    def retention_days(self) -> int:
        try:
            return max(1, int(self._opt(TL_RETENTION, DEFAULT_TIMELAPSE_RETENTION)))
        except (TypeError, ValueError):
            return DEFAULT_TIMELAPSE_RETENTION

    @property
    def enabled(self) -> bool:
        return bool(self._opt(TL_ENABLED, False))

    @property
    def overlay(self) -> bool:
        return bool(self._opt(TL_OVERLAY, False))

    @property
    def overlay_burn(self) -> bool:
        return bool(self._opt(TL_OVERLAY_BURN, False))

    @property
    def overlay_panel(self) -> str:
        return str(self._opt(TL_OVERLAY_PANEL, "") or "")

    @property
    def overlay_fields(self) -> list:
        v = self._opt(TL_OVERLAY_FIELDS, DEFAULT_TIMELAPSE_OVERLAY_FIELDS)
        return list(v) if isinstance(v, (list, tuple)) else DEFAULT_TIMELAPSE_OVERLAY_FIELDS

    @property
    def overlay_color(self) -> str:
        return str(self._opt(TL_OVERLAY_COLOR, DEFAULT_TIMELAPSE_OVERLAY_COLOR)
                   or DEFAULT_TIMELAPSE_OVERLAY_COLOR)

    @property
    def overlay_grouped(self) -> bool:
        # Default True: all readings in one stacked box, in selected order.
        return bool(self._opt(TL_OVERLAY_GROUPED, True))

    @property
    def overlay_pos(self) -> dict:
        v = self._opt(TL_OVERLAY_POS, {})
        return dict(v) if isinstance(v, dict) else {}

    @property
    def overlay_orient(self) -> str:
        return "h" if str(self._opt(TL_OVERLAY_ORIENT, "v")).lower().startswith("h") else "v"

    @property
    def overlay_labels(self) -> bool:
        return bool(self._opt(TL_OVERLAY_LABELS, True))

    @property
    def overlay_font(self) -> float:
        # Overlay text size in px as shown ON THE CARD (default 12 ≈ the old .8em). The
        # burn scales this up to the image resolution so it reads the same on the card.
        try:
            return max(5.0, min(96.0, float(self._opt(TL_OVERLAY_FONT, 12.0))))
        except (TypeError, ValueError):
            return 12.0

    @property
    def align(self) -> bool:
        # Default True: start the first frame on the next wall-clock mark.
        return bool(self._opt(TL_ALIGN, True))

    @property
    def daily_at(self) -> str:
        return str(self._opt(TL_DAILY_AT, "00:00") or "00:00")

    def _daily_at_seconds(self) -> int:
        try:
            hh, mm = str(self.daily_at).split(":")[:2]
            return (int(hh) * 3600 + int(mm) * 60) % 86400
        except Exception:  # noqa: BLE001
            return 0

    def _align_offset(self) -> int:
        # A 1-day (or longer) interval anchors to the chosen time-of-day instead of
        # local midnight; shorter intervals align to the clock from midnight (offset 0).
        return self._daily_at_seconds() if self._effective_interval() >= 86400 else 0

    async def async_delete_store(self) -> None:
        """Forget the persisted intent/session (used when the instance is removed)."""
        try:
            await self._store.async_remove()
        except Exception:  # noqa: BLE001 - best-effort
            pass

    async def async_apply_config(self) -> None:
        """Apply the current options: start/stop/restart capture to match. Called
        after the card (or options flow) changes settings. Keeps the same session."""
        if self.enabled and self.camera:
            await self.async_start(resume=True)
        else:
            await self.async_stop()

    def _env_readings(self) -> dict:
        """Formatted env readings from the chosen panel, for the overlay/sidecar."""
        p = self.overlay_panel
        if not p:
            return {}
        st = self.hass.states
        out: dict = {}
        for key, suffix in (("temp", "temperature"), ("humidity", "humidity"),
                            ("vpd", "vpd"), ("co2", "co2"), ("ppfd", "ppfd")):
            s = st.get(f"sensor.sf_{p}_{suffix}")
            if not s or s.state in ("unknown", "unavailable", None, ""):
                continue
            unit = (s.attributes.get("unit_of_measurement") or "")
            # Drop the "/m²/s" from PPFD — keep "µmol". The ² renders as a stray glyph
            # in burned frames and it's noise on the small overlay. (v3.19.385)
            val = f"{s.state}{unit}".replace("/m²/s", "").replace("/m2/s", "")
            out[key] = val
        return out

    # ── lifecycle ────────────────────────────────────────────────────────────
    async def async_start(self, session: str | None = None, interval: int | None = None,
                          resume: bool = False):
        """Begin (or resume) a capture session. With resume=True and no explicit
        session, continues the most recent existing session so a reboot keeps one
        continuous time-lapse instead of fragmenting."""
        # A caller-supplied session MUST be our timestamp format — it feeds
        # os.path.join(self.root, session) in the capture loop, so an absolute path
        # or traversal ("/config/www/x", "../../x") would write frames OUTSIDE the
        # storage root. Reject anything else and fall back to a fresh timestamp.
        if session is not None and not _SESSION_RE.match(session):
            _LOGGER.warning(
                "Time-lapse: ignoring invalid session %r (expected YYYYMMDD-HHMMSS)",
                session)
            session = None
        if not self.camera:
            self._last_error = "no_camera"
            self._notify()
            return False
        if self._unsub:                 # cancel any running timer (no persist here)
            self._unsub()
            self._unsub = None
        if resume and not session:
            try:
                sessions = await self.hass.async_add_executor_job(list_sessions, self.root)
            except Exception:  # noqa: BLE001
                sessions = []
            session = sessions[0]["session"] if sessions else None
        self._session = session or datetime.now().strftime(_SESSION_FMT)
        # Seed the counter from frames already on disk so a resumed session shows
        # the accumulated total, not 0.
        try:
            existing = await self.hass.async_add_executor_job(
                list_frames, self.root, self._session)
            self._frame_count = len(existing)
        except Exception:  # noqa: BLE001
            self._frame_count = 0
        self._last_error = None
        self._interval_override = int(interval) if interval else None
        secs = int(self._interval_override or self.interval)
        self._capturing = True
        # Align captures to the wall clock (measured from local midnight): a 5-min
        # interval fires at :00/:05/:10…, 15-min at :00/:15/:30/:45, hourly on the
        # hour, daily at midnight. (v3.19.364) When align is OFF, capture immediately
        # on an explicit start and then run every interval from now. On a reboot resume
        # we never grab an extra immediate frame. (v3.19.369)
        if not self.align and not resume:
            self.hass.async_create_task(self._tick(dt_util.now()))
        nxt = self._schedule()
        _LOGGER.info("Time-lapse %s: cam=%s dir=%s every %ss session=%s first=%s",
                     "resumed" if resume else "started",
                     self.camera, self.root, secs, self._session,
                     nxt.isoformat() if nxt else "?")
        await self._persist()
        self._notify()
        return True

    def _effective_interval(self) -> int:
        return int(self._interval_override or self.interval)

    def _next_aligned(self, now: datetime, interval: int, offset: int = 0) -> datetime:
        """Next wall-clock boundary strictly after `now`, where boundaries are
        multiples of `interval` seconds counted from LOCAL midnight + `offset` (used to
        pin a daily interval to a chosen time-of-day). Exactly on a boundary → the
        following one (never double-fire)."""
        interval = max(1, int(interval))
        midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elapsed = (now - midnight).total_seconds() - offset
        k = int(elapsed // interval) + 1
        return midnight + timedelta(seconds=offset + k * interval)

    @callback
    def _schedule(self, retry: bool = False):
        """(Re)arm the one-shot timer for the next capture. Normally the next aligned
        boundary; with retry=True, soon (gentle backoff) so a camera hiccup doesn't lose
        the whole interval — a 1-day lapse recovers in ~a minute, not a day. The next
        SUCCESS returns to the aligned cadence."""
        if self._unsub:
            self._unsub()
            self._unsub = None
        if not self._capturing:
            return None
        now = dt_util.now()
        secs = self._effective_interval()
        if retry:
            # 30s, 60, 120, 240, 480, 960… capped at the normal interval (min 15s).
            delay = min(secs, 30 * (2 ** min(max(self._fail_count - 1, 0), 5)))
            when = now + timedelta(seconds=max(15, delay))
        elif self.align:
            when = self._next_aligned(now, secs, self._align_offset())
        else:
            when = now + timedelta(seconds=secs)
        self._next_when = when
        self._unsub = async_track_point_in_time(self.hass, self._fire, when)
        return when

    async def _fire(self, now):
        """Timer callback: capture, then re-arm. ALWAYS reschedules (even if the tick
        raises/crashes) so the loop can never die — a failed capture retries soon, a good
        one returns to the aligned cadence."""
        self._unsub = None
        try:
            await self._tick(now)
        except Exception:  # noqa: BLE001 - defensive; a tick must never kill the loop
            self._last_error = "tick crashed"
            _LOGGER.exception("Time-lapse tick crashed (%s)", self.tl_id)
        finally:
            if self._capturing:
                self._schedule(retry=bool(self._last_error))

    async def async_stop(self, _notify: bool = True):
        """Explicit user stop: cancels the timer AND clears the persisted intent,
        so a reboot does NOT resume."""
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._capturing = False
        self._next_when = None
        await self._persist()
        if _notify:
            self._notify()

    async def async_set_interval(self, interval: int):
        if self._capturing:
            await self.async_start(session=self._session, interval=interval)

    async def async_clear(self) -> int:
        """Delete ALL captured images/sessions/exports for this instance. Keeps the
        instance itself. If capture was running, it continues into a fresh, empty
        session so you don't have to restart it. Returns the frame count removed."""
        was = self._capturing
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._capturing = False
        self._next_when = None
        removed = 0
        try:
            removed = await self.hass.async_add_executor_job(_clear_frames, self.root)
        except Exception as err:  # noqa: BLE001 - surface on the entity
            self._last_error = str(err)[:200]
            _LOGGER.warning("Time-lapse clear failed (%s): %s", self.tl_id, err)
        self._session = None
        self._frame_count = 0
        self._last_capture = None
        self._last_export = None
        self._last_export_error = None
        await self._persist()
        if was:
            # Resume capture into a brand-new session.
            await self.async_start()
        else:
            self._notify()
        _LOGGER.info("Time-lapse %s: cleared %d frame(s)", self.tl_id, removed)
        return removed

    async def async_shutdown(self):
        """Teardown on unload/reboot. Must NOT persist (leaves the intent intact so
        the next boot resumes)."""
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._capturing = False
        self._next_when = None

    async def _persist(self) -> None:
        try:
            await self._store.async_save(
                {"capturing": self._capturing, "session": self._session})
        except Exception:  # noqa: BLE001 - persistence is best-effort
            pass

    async def async_restore(self) -> None:
        """Called on boot. Resumes the persisted session if capture was intended.
        Falls back to the options 'enabled' toggle the first time (no saved state)."""
        data = {}
        try:
            data = (await self._store.async_load()) or {}
        except Exception:  # noqa: BLE001
            data = {}
        want = data["capturing"] if "capturing" in data else self.enabled
        if want and self.camera:
            await self.async_start(session=data.get("session"), resume=True)

    @callback
    def cancel(self) -> None:
        """Synchronous teardown for entry unload (no coroutine returned)."""
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._capturing = False
        self._next_when = None

    # ── capture ──────────────────────────────────────────────────────────────
    async def _tick(self, _now):
        if self._busy or not self._capturing:
            return
        self._busy = True
        try:
            from homeassistant.components.camera import async_get_image
            # Hard outer bound: async_get_image's own timeout can hang on a broken stream
            # (e.g. an RTSP worker erroring), which would freeze the loop. wait_for makes a
            # hang a normal failure that retries. (v3.19.380)
            image = await asyncio.wait_for(
                async_get_image(self.hass, self.camera, timeout=15), timeout=20)
            content = image.content
            if not content:
                raise ValueError("empty image")
            session_dir = os.path.join(self.root, self._session or "session")
            stamp = datetime.now().strftime(_SESSION_FMT)
            fname = stamp + FRAME_EXT
            # Phase 3 overlay: read the chosen panel's env at capture time. Burn it
            # into the pixels now (so the exported video carries it) when the user
            # picked "burn"; always record it to a sidecar so the card can overlay
            # the matching per-frame data when NOT burning.
            readings = self._env_readings() if self.overlay else {}
            if self.overlay:
                _day = _day_number(self._session, stamp)
                if _day:
                    readings = {**readings, "day": str(_day)}
            if self.overlay and self.overlay_burn:
                items = _overlay_items(readings, stamp, self.overlay_fields,
                                       self.overlay_grouped, self.overlay_pos,
                                       self.overlay_orient, self.overlay_labels)
                if items:
                    content = await self.hass.async_add_executor_job(
                        _burn_items, content, items, self.overlay_color, self.overlay_font)
            await self.hass.async_add_executor_job(
                _write_frame, session_dir, fname, content)
            if self.overlay and readings:
                await self.hass.async_add_executor_job(
                    _write_env, session_dir, stamp, readings)
            self._frame_count += 1
            self._last_capture = datetime.now()
            self._last_error = None
            self._fail_count = 0
        except Exception as err:  # noqa: BLE001 - surface any capture failure on the entity
            self._fail_count += 1
            self._last_error = str(err)[:200] or err.__class__.__name__
            _LOGGER.warning("Time-lapse capture failed (cam=%s, attempt %d): %s",
                            self.camera, self._fail_count, err)
        finally:
            self._busy = False
            # Retention sweep is cheap relative to the interval; run opportunistically.
            try:
                await self.hass.async_add_executor_job(
                    _sweep_retention, self.root, self.retention_days)
            except Exception:  # pragma: no cover - never let cleanup break capture
                pass
            self._notify()

    # ── mp4 export (Phase 2, ffmpeg) ─────────────────────────────────────────
    async def async_export(self, session: str | None = None,
                           fps: int | None = None, name: str | None = None) -> bool:
        """Kick off an ffmpeg export of a session's frames to an .mp4 in the same
        secure folder. Runs in the background; progress shows on the entity."""
        if self._export_running:
            return False
        sess = session or self._session
        if not sess:
            sessions = await self.hass.async_add_executor_job(list_sessions, self.root)
            sess = sessions[0]["session"] if sessions else None
        if not sess or not _safe_segment(sess):
            self._last_export_error = "no_session"
            self._notify()
            return False
        self._export_running = True
        self._last_export_error = None
        self._notify()
        self.hass.async_create_task(self._run_export(sess, int(fps or 15), name))
        return True

    async def _run_export(self, session: str, fps: int, name: str | None):
        try:
            ffmpeg = shutil.which("ffmpeg") or "ffmpeg"
            sdir = os.path.join(self.root, session)
            frames = await self.hass.async_add_executor_job(list_frames, self.root, session)
            if not frames:
                raise ValueError("no frames to export")
            out_name = _safe_mp4_name(name) or f"timelapse_{session}.mp4"
            out_path = os.path.join(sdir, out_name)
            args = [
                ffmpeg, "-y",
                "-framerate", str(max(1, min(60, fps))),
                "-pattern_type", "glob", "-i", os.path.join(sdir, "*.jpg"),
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
                "-movflags", "+faststart",
                out_path,
            ]
            proc = await asyncio.create_subprocess_exec(
                *args, stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.PIPE)
            _, stderr = await proc.communicate()
            if proc.returncode != 0:
                tail = (stderr or b"").decode("utf-8", "replace")[-300:]
                raise RuntimeError(f"ffmpeg exited {proc.returncode}: {tail}")
            if not os.path.isfile(out_path):
                raise RuntimeError("ffmpeg produced no output file")
            self._last_export = {"session": session, "name": out_name}
            self._last_export_error = None
            _LOGGER.info("Time-lapse export done: %s", out_path)
        except Exception as err:  # noqa: BLE001 - surface on the entity
            self._last_export_error = str(err)[:300]
            _LOGGER.warning("Time-lapse export failed: %s", err)
        finally:
            self._export_running = False
            self._notify()

    # ── status ───────────────────────────────────────────────────────────────
    def status(self) -> dict:
        return {
            "tl_id": self.tl_id,
            "name": self.name,
            "label": self.label,
            "capturing": self._capturing,
            "camera": self.camera,
            "storage_dir": self.root,
            "session": self._session,
            "interval_s": self.interval,
            "retention_days": self.retention_days,
            "frame_count": self._frame_count,
            "last_capture": self._last_capture.isoformat() if self._last_capture else None,
            "last_error": self._last_error,
            "export_running": self._export_running,
            "last_export": self._last_export,
            "last_export_error": self._last_export_error,
            "overlay": self.overlay,
            "overlay_burn": self.overlay_burn,
            "overlay_panel": self.overlay_panel,
            "overlay_fields": self.overlay_fields,
            "overlay_color": self.overlay_color,
            "overlay_grouped": self.overlay_grouped,
            "overlay_pos": self.overlay_pos,
            "overlay_orient": self.overlay_orient,
            "overlay_labels": self.overlay_labels,
            "overlay_font": self.overlay_font,
            "align": self.align,
            "daily_at": self.daily_at,
            "next_capture": self._next_when.isoformat() if self._next_when else None,
        }

    @callback
    def _notify(self):
        async_dispatcher_send(
            self.hass,
            SIGNAL_TIMELAPSE_UPDATE.format(f"{self.entry.entry_id}_{self.tl_id}"))


class TimelapseManager:
    """Owns the per-instance controllers for one config entry and keeps them in
    sync with the entry's instances dict. One card = one instance (tl_id)."""

    def __init__(self, hass: HomeAssistant, entry) -> None:
        self.hass = hass
        self.entry = entry
        self.controllers: dict[str, TimelapseController] = {}

    def _instance_ids(self) -> list[str]:
        merged = {**self.entry.data, **(self.entry.options or {})}
        insts = merged.get(CONF_TIMELAPSE_INSTANCES) or {}
        return list(insts.keys()) if isinstance(insts, dict) else []

    def ids(self) -> list[str]:
        return list(self.controllers.keys())

    def get(self, tl_id: str | None) -> TimelapseController | None:
        if tl_id:
            return self.controllers.get(tl_id)
        return self.first()

    def first(self) -> TimelapseController | None:
        for tl_id in sorted(self.controllers):
            return self.controllers[tl_id]
        return None

    @callback
    def sync(self) -> bool:
        """Reconcile controllers to the current instances dict. Creates controllers
        for new ids and drops controllers for removed ids (tearing down their timers
        + forgetting their persisted session). Returns True if the set changed, so
        callers can fire SIGNAL_TIMELAPSE_INSTANCES for the sensor platform."""
        want = set(self._instance_ids())
        have = set(self.controllers)
        changed = False
        for tl_id in want - have:
            self.controllers[tl_id] = TimelapseController(self.hass, self.entry, tl_id)
            changed = True
        for tl_id in have - want:
            ctrl = self.controllers.pop(tl_id)
            ctrl.cancel()
            self.hass.async_create_task(ctrl.async_delete_store())
            changed = True
        return changed

    def notify_instances(self) -> None:
        async_dispatcher_send(
            self.hass, SIGNAL_TIMELAPSE_INSTANCES.format(self.entry.entry_id))

    async def async_restore_all(self) -> None:
        """On boot: make sure a controller exists for every instance, then resume
        any that were capturing before the reboot."""
        self.sync()
        for ctrl in list(self.controllers.values()):
            try:
                await ctrl.async_restore()
            except Exception:  # noqa: BLE001 - one bad instance mustn't block the rest
                _LOGGER.exception("Time-lapse restore failed for %s", ctrl.tl_id)

    @callback
    def cancel_all(self) -> None:
        """Synchronous teardown for entry unload (leaves persisted intent intact)."""
        for ctrl in self.controllers.values():
            ctrl.cancel()


# ── filesystem helpers (run in executor) ─────────────────────────────────────
_OVERLAY_LABELS = {"temp": "Temp", "humidity": "RH", "vpd": "VPD",
                   "co2": "CO2", "ppfd": "PPFD"}


def _fmt_stamp(stamp: str) -> str:
    m = (stamp or "")
    if len(m) == 15 and m[8] == "-":
        return f"{m[0:4]}-{m[4:6]}-{m[6:8]} {m[9:11]}:{m[11:13]}:{m[13:15]}"
    return m


def _overlay_lines(readings: dict, stamp: str, fields) -> list:
    """Text lines for the overlay: env readings on one line, timestamp below."""
    parts = []
    for f in (fields or []):
        if f == "timestamp":
            continue
        r = readings.get(f)
        if r:
            parts.append(f"{_OVERLAY_LABELS.get(f, f)} {r}")
    lines = []
    if parts:
        lines.append("   ".join(parts))
    if "timestamp" in (fields or []):
        lines.append(_fmt_stamp(stamp))
    return lines


def _day_number(session: str, stamp: str) -> int | None:
    """Grow-day number for a frame: calendar days since the session started, 1-based
    (the first day is 'Day 1'). session + stamp are 'YYYYMMDD-HHMMSS'."""
    try:
        s = datetime.strptime(str(session)[:15], "%Y%m%d-%H%M%S")
        t = datetime.strptime(str(stamp)[:15], "%Y%m%d-%H%M%S")
        return (t.date() - s.date()).days + 1
    except Exception:  # noqa: BLE001
        return None


def _render_field(field: str, readings: dict, stamp: str, labels: bool = True) -> str | None:
    """The on-screen string for one overlay field (or None if it has no value).
    With labels=False the reading shows just its value (e.g. '72°F'), no 'Temp'."""
    if field == "timestamp":
        return _fmt_stamp(stamp)
    if field == "day":
        d = readings.get("day")
        return f"Day {d}" if d else None
    r = readings.get(field)
    if not r:
        return None
    return f"{_OVERLAY_LABELS.get(field, field)} {r}" if labels else f"{r}"


def _overlay_items(readings: dict, stamp: str, fields, grouped: bool, pos,
                   orient: str = "v", labels: bool = True) -> list:
    """Positioned overlay items to draw. Grouped → ONE item (all selected readings in
    selection order) at the group anchor, laid out vertically (stacked) or horizontally
    (one row) per `orient`; otherwise ONE item per field at its own anchor. Anchors are
    [xPct, yPct] of the image (top-left of the text box); a field with no saved position
    falls back to a tidy top-left stack. Mirrors the card's _overlayItems() so burned
    frames and the card overlay match."""
    pos = pos if isinstance(pos, dict) else {}
    rendered = []  # [(field, text)] in selection order
    for f in (fields or []):
        t = _render_field(f, readings, stamp, labels)
        if t:
            rendered.append((f, t))
    if not rendered:
        return []
    if grouped:
        gp = pos.get("group")
        gx, gy = (float(gp[0]), float(gp[1])) if _is_xy(gp) else (2.0, 70.0)
        sep = "   " if str(orient).lower().startswith("h") else "\n"
        return [{"text": sep.join(t for _, t in rendered), "x": gx, "y": gy}]
    items = []
    for i, (f, t) in enumerate(rendered):
        p = pos.get(f)
        x, y = (float(p[0]), float(p[1])) if _is_xy(p) else (2.0, min(4.0 + i * 12.0, 88.0))
        items.append({"text": t, "x": x, "y": y})
    return items


def _is_xy(p) -> bool:
    return isinstance(p, (list, tuple)) and len(p) == 2


def _hex_rgb(c: str) -> tuple:
    s = str(c or "#ffffff").lstrip("#")
    if len(s) == 3:
        s = "".join(ch * 2 for ch in s)
    try:
        return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16))
    except ValueError:
        return (255, 255, 255)


# Unit characters our sensors use (µmol, °F, /m²) that a bare bitmap font may lack —
# PIL then draws a missing-glyph box (the "X" users saw for µ). When we can't load a
# real Unicode font, swap these for ASCII stand-ins so burned text never shows a box.
# (v3.19.386)
_GLYPH_FALLBACK = {"\u00b5": "u", "\u03bc": "u", "\u00b0": "", "\u00b2": "2", "\u00b3": "3"}

# Real Unicode TrueType fonts commonly present on Linux/HA hosts; any one renders µ/°/²
# properly so the burn matches the live card overlay.
_OVERLAY_FONT_PATHS = (
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    "/usr/share/fonts/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
)


# The font we bundle with the integration (a renamed subset of DejaVu Sans) so the
# burned overlay renders µ/°/² identically on every host, independent of installed
# system fonts. (v3.19.387)
_BUNDLED_FONT = os.path.join(os.path.dirname(__file__), "fonts", "sf-overlay.ttf")


def _overlay_font(size: int):
    """Return (font, unicode_ok). Prefer the bundled Unicode font so µ/°/² render
    exactly like the live overlay; then any real system TTF; finally fall back to
    Pillow's built-in font (unicode_ok=False -> caller must ASCII-sanitize to avoid
    tofu boxes)."""
    from PIL import ImageFont
    for path in (_BUNDLED_FONT, *_OVERLAY_FONT_PATHS):
        try:
            return ImageFont.truetype(path, size), True
        except Exception:  # noqa: BLE001 - font not present/loadable, try the next
            continue
    try:
        return ImageFont.load_default(size=size), False   # Pillow 10+
    except TypeError:                                      # older Pillow
        return ImageFont.load_default(), False


def _font_safe(text: str, unicode_ok: bool) -> str:
    """Leave text as-is for a real Unicode font; otherwise replace the unit glyphs the
    built-in bitmap font can't draw so burned frames never show a missing-glyph box."""
    if unicode_ok:
        return text
    return "".join(_GLYPH_FALLBACK.get(ch, ch) for ch in text)


def _burn_items(content: bytes, items: list, color: str = "#ffffff", font_px: float = 12.0) -> bytes:
    """Draw positioned overlay items (each a translucent box + text in `color`) onto a
    JPEG. Boxes are clamped to stay on the image. Returns the original bytes unchanged
    if Pillow is unavailable or anything goes wrong."""
    try:
        from io import BytesIO
        from PIL import Image, ImageDraw, ImageFont
    except Exception:  # pragma: no cover - Pillow missing
        return content
    try:
        img = Image.open(BytesIO(content)).convert("RGB")
        w, h = img.size
        draw = ImageDraw.Draw(img, "RGBA")
        # font_px is the overlay text size as shown ON THE CARD; scale it up to the image
        # so burned text reads the same once the frame is displayed at the card's size.
        # Reference card image is ~480px wide → ~270px tall, so fs = font_px * h / 270.
        # (v3.19.384)
        try:
            fpx = max(5.0, min(96.0, float(font_px)))
        except (TypeError, ValueError):
            fpx = 12.0
        fs = max(10, int(round(fpx * h / 270.0)))
        font, uni_ok = _overlay_font(fs)
        r, g, b = _hex_rgb(color)
        pad = max(6, int(fs * 0.4))
        line_h = fs + max(2, int(fs * 0.3))
        # First pass: measure every box (remember per-line widths for right-alignment).
        placed = []
        for it in items:
            lines = [_font_safe(ln, uni_ok) for ln in str(it.get("text", "")).split("\n")]
            if not any(lines):
                continue
            lws = []
            text_w = 0
            for ln in lines:
                try:
                    bb = draw.textbbox((0, 0), ln, font=font)
                    lw = bb[2] - bb[0]
                except Exception:
                    lw = len(ln) * fs // 2
                lws.append(lw)
                text_w = max(text_w, lw)
            box_w = text_w + pad * 2
            box_h = line_h * len(lines) + pad * 2
            xpct = float(it.get("x", 2.0))
            # Snap to the nearer side (match the card): an item on the right half anchors
            # its RIGHT edge at x% (box grows left, text right-aligned) so long readings
            # don't run off the edge; the left half anchors its left edge.
            right_side = xpct > 50.0
            if right_side:
                x0 = int(xpct / 100.0 * w) - box_w
            else:
                x0 = int(xpct / 100.0 * w)
            y0 = int(float(it.get("y", 70.0)) / 100.0 * h)
            x0 = max(0, min(x0, w - box_w))
            placed.append({"lines": lines, "lws": lws, "x0": x0, "y0": y0,
                           "w": box_w, "h": box_h, "right": right_side})
        # De-overlap (v3.19.393): the burn draws each label at its stored y%, but burned boxes
        # are taller (relative to the frame) than the card's boxes, so a stack that looks flush
        # on the card can overlap once burned — the translucent fills then double into dark
        # bands. Group boxes into columns (overlapping x-ranges), stack them flush in y-order,
        # and if a column runs past the image bottom shift the whole column up so it stays on
        # the frame. This guarantees burned labels never overlap, at any text size.
        columns: list = []
        for bx in sorted(placed, key=lambda p: p["y0"]):
            col = next((c for c in columns
                        if any(bx["x0"] < m["x0"] + m["w"] and bx["x0"] + bx["w"] > m["x0"]
                               for m in c)), None)
            if col is None:
                columns.append([bx])
            else:
                col.append(bx)
        for col in columns:
            col.sort(key=lambda p: p["y0"])
            for i in range(1, len(col)):
                floor = col[i - 1]["y0"] + col[i - 1]["h"]
                if col[i]["y0"] < floor:
                    col[i]["y0"] = floor
            overflow = (col[-1]["y0"] + col[-1]["h"]) - h
            if overflow > 0:
                for bx in col:
                    bx["y0"] = max(0, bx["y0"] - overflow)
        # Second pass: draw (note: r, g, b above is the text colour — don't shadow b here).
        for bx in placed:
            x0, y0, box_w = bx["x0"], bx["y0"], bx["w"]
            draw.rectangle([x0, y0, x0 + box_w, y0 + bx["h"]], fill=(0, 0, 0, 140))
            y = y0 + pad
            for ln, lw in zip(bx["lines"], bx["lws"]):
                lx = (x0 + box_w - pad - lw) if bx["right"] else (x0 + pad)
                draw.text((lx, y), ln, font=font, fill=(r, g, b, 255))
                y += line_h
        out = BytesIO()
        img.save(out, format="JPEG", quality=88)
        return out.getvalue()
    except Exception:  # pragma: no cover - never fail capture over the overlay
        return content


def _burn_overlay(content: bytes, lines: list) -> bytes:
    """Draw the overlay lines onto a JPEG (bottom-left, translucent box). Returns the
    original bytes unchanged if Pillow is unavailable or anything goes wrong."""
    try:
        from io import BytesIO
        from PIL import Image, ImageDraw, ImageFont
    except Exception:  # pragma: no cover - Pillow missing
        return content
    try:
        img = Image.open(BytesIO(content)).convert("RGB")
        w, h = img.size
        draw = ImageDraw.Draw(img, "RGBA")
        # Sized so the burned-in text, once the frame is scaled down to the card width,
        # reads about the same as the live card overlay (~.8em). h/28 came out noticeably
        # smaller than the on-card overlay. (v3.19.383)
        fs = max(16, int(h / 24))
        font, uni_ok = _overlay_font(fs)
        lines = [_font_safe(str(ln), uni_ok) for ln in lines]
        pad = max(6, int(fs * 0.4))
        line_h = fs + max(2, int(fs * 0.3))
        text_w = 0
        for ln in lines:
            try:
                bb = draw.textbbox((0, 0), ln, font=font)
                text_w = max(text_w, bb[2] - bb[0])
            except Exception:
                text_w = max(text_w, len(ln) * fs // 2)
        box_w = text_w + pad * 2
        box_h = line_h * len(lines) + pad * 2
        x0, y0 = pad, h - box_h - pad
        draw.rectangle([x0, y0, x0 + box_w, y0 + box_h], fill=(0, 0, 0, 140))
        y = y0 + pad
        for ln in lines:
            draw.text((x0 + pad, y), ln, font=font, fill=(255, 255, 255, 255))
            y += line_h
        out = BytesIO()
        img.save(out, format="JPEG", quality=88)
        return out.getvalue()
    except Exception:  # pragma: no cover - never fail capture over the overlay
        return content


def _write_env(session_dir: str, stamp: str, readings: dict) -> None:
    """Append this frame's env readings to the session sidecar (for the card overlay)."""
    try:
        os.makedirs(session_dir, exist_ok=True)
        with open(os.path.join(session_dir, "_env.jsonl"), "a", encoding="utf-8") as f:
            f.write(json.dumps({"stamp": stamp, **readings}) + "\n")
    except OSError:
        pass


def read_env(root: str, session: str) -> dict:
    """stamp -> readings dict from the session sidecar (executor-safe)."""
    if not _safe_segment(session):
        return {}
    out: dict = {}
    try:
        with open(os.path.join(root, session, "_env.jsonl"), encoding="utf-8") as f:
            for line in f:
                try:
                    d = json.loads(line)
                    s = d.pop("stamp", None)
                    if s:
                        out[s] = d
                except Exception:
                    continue
    except OSError:
        pass
    return out


def _is_sf_artifact(name: str) -> bool:
    """A file the integration wrote inside a session folder: a .jpg frame (or its
    .part temp while writing), the _env.jsonl sidecar, or an exported .mp4."""
    return (
        name.endswith(FRAME_EXT)
        or name.endswith(FRAME_EXT + ".part")
        or name == "_env.jsonl"
        or name.endswith(".mp4")
    )


def _clear_frames(root: str) -> int:
    """Remove ONLY what the integration created under `root`: its own timestamp-named
    session folders and, inside them, the .jpg frames, _env.jsonl sidecars and
    exported .mp4 files. Anything else a user keeps in this folder — other files,
    other subfolders, or non-SF files inside a session folder — is left untouched
    (a session folder is removed only once it's empty of everything else). Returns
    the number of .jpg frames removed. (v3.19.401: scoped — never a blanket rmtree.)"""
    if not os.path.isdir(root):
        return 0
    removed = 0
    try:
        entries = os.listdir(root)
    except OSError:
        return 0
    for name in entries:
        sdir = os.path.join(root, name)
        # Only touch our own session folders (named by the capture timestamp).
        if not (_SESSION_RE.match(name) and os.path.isdir(sdir)):
            continue
        try:
            files = os.listdir(sdir)
        except OSError:
            continue
        for fn in files:
            if not _is_sf_artifact(fn):
                continue
            try:
                os.remove(os.path.join(sdir, fn))
                if fn.endswith(FRAME_EXT):
                    removed += 1
            except OSError:
                pass
        # Drop the session folder only if nothing non-SF remains in it.
        try:
            if not os.listdir(sdir):
                os.rmdir(sdir)
        except OSError:
            pass
    return removed


def _write_frame(session_dir: str, fname: str, content: bytes) -> None:
    os.makedirs(session_dir, exist_ok=True)
    path = os.path.join(session_dir, fname)
    tmp = path + ".part"
    with open(tmp, "wb") as f:
        f.write(content)
    os.replace(tmp, path)


def _sweep_retention(root: str, retention_days: int) -> None:
    """Delete frames older than retention; remove empty session dirs."""
    if not os.path.isdir(root):
        return
    cutoff = datetime.now().timestamp() - retention_days * 86400
    for session in os.listdir(root):
        # Only OUR own timestamp-named session folders — never touch other files or
        # folders a user keeps in the storage root (e.g. their own /media/* JPEGs).
        if not _SESSION_RE.match(session):
            continue
        sdir = os.path.join(root, session)
        if not os.path.isdir(sdir):
            continue
        for fn in os.listdir(sdir):
            if not fn.endswith(FRAME_EXT):
                continue
            fp = os.path.join(sdir, fn)
            try:
                if os.path.getmtime(fp) < cutoff:
                    os.remove(fp)
            except OSError:
                pass
        try:
            if not os.listdir(sdir):
                os.rmdir(sdir)
        except OSError:
            pass


def list_sessions(root: str) -> list[dict]:
    """Sessions newest-first with frame counts + time span (executor-safe)."""
    out: list[dict] = []
    if not os.path.isdir(root):
        return out
    for session in sorted(os.listdir(root), reverse=True):
        sdir = os.path.join(root, session)
        if not os.path.isdir(sdir):
            continue
        frames = sorted(fn for fn in os.listdir(sdir) if fn.endswith(FRAME_EXT))
        if not frames:
            continue
        total = 0
        for fn in frames:
            try:
                total += os.path.getsize(os.path.join(sdir, fn))
            except OSError:
                pass
        out.append({
            "session": session,
            "frames": len(frames),
            "bytes": total,
            "first": frames[0][: -len(FRAME_EXT)],
            "last": frames[-1][: -len(FRAME_EXT)],
        })
    return out


def list_frames(root: str, session: str) -> list[str]:
    """Sorted frame file names for a session (executor-safe)."""
    if not _safe_segment(session):
        return []
    sdir = os.path.join(root, session)
    if not os.path.isdir(sdir):
        return []
    return sorted(fn for fn in os.listdir(sdir) if fn.endswith(FRAME_EXT))


def resolve_media(root: str, session: str, name: str, exts: tuple) -> str | None:
    """Absolute path of a frame/video, guarded against traversal; None if invalid."""
    if not (_safe_segment(session) and _safe_segment(name)):
        return None
    if not any(name.endswith(e) for e in exts):
        return None
    path = os.path.join(root, session, name)
    real_root = os.path.realpath(root)
    real_path = os.path.realpath(path)
    if not (real_path == real_root or real_path.startswith(real_root + os.sep)):
        return None
    return real_path if os.path.isfile(real_path) else None


def resolve_frame(root: str, session: str, name: str) -> str | None:
    return resolve_media(root, session, name, (FRAME_EXT,))


def resolve_video(root: str, session: str, name: str) -> str | None:
    return resolve_media(root, session, name, (".mp4",))


def _safe_mp4_name(name: str | None) -> str | None:
    """Sanitize a user-supplied export name to a single safe .mp4 file name."""
    if not name:
        return None
    import re
    base = re.sub(r"[^A-Za-z0-9._-]", "_", str(name)).strip("._") or "timelapse"
    if not base.lower().endswith(".mp4"):
        base += ".mp4"
    return base if _safe_segment(base) else None
