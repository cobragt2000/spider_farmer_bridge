"""
TLS man-in-the-middle proxy for GGS controllers.

Sits between each Spider Farmer GGS controller and the vendor cloud: it
terminates the controller's TLS connection with a locally-trusted server
certificate, opens its own verified TLS connection onward to the cloud, and
pumps bytes in both directions unchanged so the controller keeps working
normally. While relaying, it decodes the MQTT PUBLISH frames it sees and hands
them to the normalizer/entity layer, and it can inject its own control messages
into the controller connection.

Auto-detection: a controller's MQTT CONNECT client-id is its MAC address, so a
session is created per MAC on connect. The device type (CB / PS5 / PS10 / LC /
SE light) is inferred from the data blocks in the first few status frames, and
entities are created from that evidence rather than any pre-configured list.
"""

from __future__ import annotations

import asyncio
import json
import logging
import ssl
import time
from typing import Dict, Optional, Any


from .mqtt_parser import (
    parse_packets, build_publish,
    MQTT_PUBLISH, MQTT_CONNECT, MQTT_SUBSCRIBE,
)
from .normalizer import normalize_status
from ..diag import DIAG
from ..ha.discovery import (
    publish_discovery_for_device,
    publish_soil_sensor_discovery,
    unpublish_outlet_discovery,
    cleanup_stale_discovery,
    HA_STATUS_TOPIC,
    _mac, _capabilities,
)

_LOGGER = logging.getLogger(__name__)


# v3.4.0: NO accessory block is CB-exclusive — the AC5/AC10 power strips
# host lights, fans, blowers, heaters, humidifiers, dehumidifiers, air
# sensors, and soil probes just like a CB. The one wire-level
# discriminator is OUTLETS: only power strips have them (confirmed on real
# hardware — CBs never report an outlet block). Accessory blocks without
# outlets suggest a CB, tentatively; the retype path corrects a loaded
# strip whose outlet block arrives late.
_ACCESSORY_MARKERS = frozenset(
    ("fan", "blower", "sensor", "heater", "humidifier", "dehumidifier")
)


def _air_sensor_live(sensor_block: dict) -> bool:
    """True only when a real ambient probe is present. Sensor-less controllers
    (AC5/AC10 run direct) still emit the air-sensor block, but every field reads
    zero; a real probe always reports a non-zero temperature or humidity."""
    for k in ("temp", "humi"):
        try:
            if float(sensor_block.get(k, 0) or 0) != 0.0:
                return True
        except (TypeError, ValueError):
            continue
    return False

# Ambiguous evidence (outlets/lights only) is not trusted until this many
# getDevSta frames have been merged, or this much time has passed since the
# first frame — GGS controllers report every few seconds, so a partial
# first frame (the CB 4E01 misdetection) gets corrected before any
# entities are created.
_DETECT_MIN_FRAMES = 3
_DETECT_MAX_WAIT_SEC = 8.0

# Local-only fallback (3.19.96): how long to wait for the cloud on connect
# before serving a controller locally, and how often to re-check the cloud
# while in local mode so we can hand back to full relay when it returns.
_UPSTREAM_CONNECT_TIMEOUT = 8.0
_UPSTREAM_PROBE_INTERVAL = 20.0


def _classify_evidence(evidence: set, max_outlet: int) -> tuple[Optional[str], bool]:
    """
    Classify accumulated getDevSta evidence.
    Returns (device_type, conclusive). Conclusive types are final; others
    are tentative and may be upgraded by later frames.

    v3.4.0 ordering: outlets first — they're the only strip-exclusive
    signal and win over any accessory blocks a loaded strip also reports.
    """
    if "selight" in evidence:
        return "se", True       # flat SE-light schema — nothing else has it
    if max_outlet > 5:
        return "ps10", True     # nothing else has >5 outlets
    if max_outlet > 1:
        return "ps5", False     # 2–5 outlets: tentative, may grow into a ps10
    if max_outlet == 1:
        # A single outlet is the S-Station smart plug. Tentative: if a strip
        # reports its first outlet before the rest, later frames revealing O2+
        # retype this to ps5/ps10 via the standard tentative-retype path.
        return "st", False
    if evidence & _ACCESSORY_MARKERS:
        return "cb", False      # tentative: a strip's outlets may be late
    if "light" in evidence or "light2" in evidence:
        return "lc", False
    return None, False


def _senconfig_from(d):
    """Locate the senConfig list in a getConfigField / getConfigFile payload:
    getConfigField ["device","senConfig"] -> data.senConfig; getConfigFile ->
    data.configFile.senConfig (or .configFile.device.senConfig)."""
    if not isinstance(d, dict):
        return None
    if isinstance(d.get("senConfig"), list):
        return d["senConfig"]
    cf = d.get("configFile")
    if isinstance(cf, dict):
        if isinstance(cf.get("senConfig"), list):
            return cf["senConfig"]
        dev = cf.get("device")
        if isinstance(dev, dict) and isinstance(dev.get("senConfig"), list):
            return dev["senConfig"]
    return None


def _calibration_from(d):
    """Air-sensor calibration block: getConfigField ["calibration"] ->
    data.calibration; getConfigFile -> data.configFile.calibration."""
    if not isinstance(d, dict):
        return None
    c = d.get("calibration")
    if isinstance(c, dict):
        return c
    cf = d.get("configFile")
    if isinstance(cf, dict) and isinstance(cf.get("calibration"), dict):
        return cf["calibration"]
    return None


def _alarm_from(d):
    """Alarm-threshold block: getConfigField ["alarm"] -> data.alarm;
    getConfigFile -> data.configFile.alarm."""
    if not isinstance(d, dict):
        return None
    a = d.get("alarm")
    if isinstance(a, dict):
        return a
    cf = d.get("configFile")
    if isinstance(cf, dict) and isinstance(cf.get("alarm"), dict):
        return cf["alarm"]
    return None


def _target_from(d):
    """Environment 'target' block: getConfigField ["target"] -> data.target;
    getConfigFile -> data.configFile.target."""
    if not isinstance(d, dict):
        return None
    t = d.get("target")
    if isinstance(t, dict):
        return t
    cf = d.get("configFile")
    if isinstance(cf, dict) and isinstance(cf.get("target"), dict):
        return cf["target"]
    return None


def _plan_light(block):
    """Decode a plan stage's light1/light2 block into the card-editable fields
    (mode + Time Slot + PPFD schedules), mirroring the device light tiles. Times
    are 'HH:MM'. None when absent. (v3.19.157)"""
    if not isinstance(block, dict):
        return None

    def hhmm(s):
        try:
            s = int(s)
        except (TypeError, ValueError):
            return "00:00"
        return f"{s // 3600:02d}:{(s % 3600) // 60:02d}"

    tp = block.get("timePeriod")
    tp0 = tp[0] if isinstance(tp, list) and tp and isinstance(tp[0], dict) else {}
    pp = block.get("ppfdPeriod")
    pp0 = pp[0] if isinstance(pp, list) and pp and isinstance(pp[0], dict) else {}
    mode = {0: "Manual", 1: "Time Slot", 12: "PPFD"}.get(block.get("modeType"), "Time Slot")
    return {
        "mode": mode,
        "go_dark": block.get("darkTemp") or 0,   # °C threshold (0 = off)
        "turn_off": block.get("offTemp") or 0,    # °C threshold (0 = off)
        "ts_start": hhmm(tp0.get("startTime", 0)), "ts_stop": hhmm(tp0.get("endTime", 0)),
        "ts_bri": int(tp0.get("brightness", 0) or 0),
        "ts_fade": int(tp0.get("fadeTime", 0) or 0) // 60,
        "ppfd_target": int(pp0.get("brightness", 0) or 0),
        "ppfd_start": hhmm(pp0.get("startTime", 0)), "ppfd_stop": hhmm(pp0.get("endTime", 0)),
        "ppfd_fade": int(pp0.get("fadeTime", 0) or 0) // 60,
        "ppfd_min": int(block.get("ppfdMinBrightness", 0) or 0),
        "ppfd_max": int(block.get("ppfdMaxBrightness", 0) or 0),
    }


def _parse_plan(d):
    """Parse a grow plan from a getConfigFile document. Returns (active, stages):
    ``active`` is True when configFile.plan.enabled is set, and ``stages`` is a
    list of normalized stage dicts {label, temp_day/night/dz, humi_day/night/dz,
    co2_day/night, alarm}. The stage list is ALWAYS parsed when a plan block
    exists — even when the plan is stopped (enabled 0) — because the app keeps the
    stages and shows them under a stopped plan; ``active`` alone reflects enabled.
    (v3.19.151: previously the stages were dropped when stopped, leaving the card's
    Stages list empty after Stop.)

    When a plan is active the controller drives the environment from the plan
    schedule, NOT configFile.target — so the manual day/night targets on the card
    are inactive while a plan runs. Rather than trying to guess a single "current"
    target (the app doesn't expose one during a plan, and the stage window dates
    are an opaque non-epoch code), we surface the plan itself (active flag + stage
    list) so the card's Planting Plan view can show it instead of stale manual
    targets. The base configFile.target is still published as-is for the manual
    Environment view used when no plan is active. (v3.19.149)"""
    if not isinstance(d, dict):
        return False, []
    cf = d.get("configFile")
    if not isinstance(cf, dict):
        return False, []
    plan = cf.get("plan")
    if not isinstance(plan, dict):
        return False, []
    active = bool(plan.get("enabled"))
    stages = []
    for s in plan.get("stage") or []:
        if not isinstance(s, dict):
            continue
        t = s.get("target") if isinstance(s.get("target"), dict) else {}
        tt = t.get("temp") if isinstance(t.get("temp"), dict) else {}
        th = t.get("humi") if isinstance(t.get("humi"), dict) else {}
        tc = t.get("co2") if isinstance(t.get("co2"), dict) else {}
        stages.append({
            "stageId": s.get("stageId"),
            "label": s.get("label") or "",
            "start": s.get("startDate"), "end": s.get("endDate"),
            "temp_day": tt.get("targetDay"), "temp_night": tt.get("targetNight"),
            "temp_dz": tt.get("deadband"),
            "humi_day": th.get("targetDay"), "humi_night": th.get("targetNight"),
            "humi_dz": th.get("deadband"),
            "co2_day": tc.get("targetDay"), "co2_night": tc.get("targetNight"),
            "co2_dz": tc.get("deadband"),
            "alarm": s.get("alarmDate"),
            "light1": _plan_light(s.get("light1")),
            "light2": _plan_light(s.get("light2")),
        })
    return active, stages


class ProxySession:
    """One active GGS Controller connection."""

    def __init__(self, mac_raw: str, mqtt_client: Any):
        self.mac_raw        = mac_raw           # raw MAC from CONNECT client_id
        self.mac            = _mac(mac_raw)     # lowercase, no colons
        self.uid            = ""
        self.device_type    = None              # detected on first data frame
        self.device_cfg: dict = {}              # populated once type is known
        self.mqtt_client    = mqtt_client
        self.down_topic_prefix = "CB"
        self._upstream_writer: Optional[asyncio.StreamWriter] = None
        self._client_writer:   Optional[asyncio.StreamWriter] = None
        self._discovery_published = False
        self._outlet_discovery_pruned = False
        self._known_soil_ids: set = set()
        # Type-detection evidence, merged across getDevSta frames
        self.evidence: set = set()
        self.outlets_seen: set = set()
        self.max_outlet_seen: int = 0
        self.frames_seen: int = 0
        self.first_frame_at: float = 0.0
        self.type_conclusive: bool = False
        self._created_at: float = time.monotonic()
        self._last_discovery_at: float = 0.0
        self.device_state: Dict[str, dict] = {}
        self.se_config: Dict[str, Any] = {}          # SE light configFile.light cache
        self.outlet_cfg: Dict[str, dict] = {}        # "{block}/O{n}" -> full outlet config
        self.env_cfg: dict = {}                      # environment "target" block cache
        self.cal_cfg: dict = {}                      # top-level ["calibration"] block cache
        self.senconfig: list = []                    # full ["device","senConfig"] array cache
        self.alarm_cfg: dict = {}                    # top-level ["alarm"] block cache
        self.plan_cfg: dict = {}                     # configFile.plan block cache (RMW plan writes)
        self.last_nonzero_level: Dict[str, int] = {}
        self.fan_state:   Dict[str, dict] = {}
        self.light_state: Dict[str, dict] = {}
        # Echo-triggered config confirm polling (v3.0.5)
        self.confirm_delay: float = 2.0
        self._pending_confirms: set = set()
        self.initial_poll_task: Optional[asyncio.Task] = None
        # Alarm-log cursor paging (v3.19.50). The controller pages its alarm
        # history with {"limit":N,"id":cursor}, returning entries with id >
        # cursor. alarm_hw is the highest alarm id we've ingested; we seed each
        # poll with it (id:0 on a fresh session backfills the whole buffer) and
        # walk forward one page at a time until a short page means we're caught
        # up. alarm_pages bounds a single backfill walk.
        self.alarm_hw: int = 0
        self.alarm_pages: int = 0
        # Operation-log cursor paging (v3.19.146) — same scheme as the alarm log.
        self.oplog_hw: int = 0
        self.oplog_pages: int = 0
        # A grow plan is running (configFile.plan.enabled): the env target comes
        # from the active plan stage, so ignore the base ["target"] poll. (v3.19.147)
        self.plan_active: bool = False

    def set_upstream(self, writer: asyncio.StreamWriter) -> None:
        self._upstream_writer = writer

    def set_client(self, writer: asyncio.StreamWriter) -> None:
        self._client_writer = writer

    @property
    def has_client(self) -> bool:
        return self._client_writer is not None

    async def inject(self, payload: dict) -> None:
        """Inject a command directly into the device's TLS connection."""
        if self._client_writer is None:
            _LOGGER.warning("[%s] inject: no device connection", self.mac)
            return
        topic = (
            f"SF/GGS/{self.down_topic_prefix}/API/DOWN/"
            f"{self.mac_raw.upper().replace(':', '')}"
        )
        raw = build_publish(
            topic=topic,
            message=json.dumps(payload, separators=(",", ":")).encode(),
        )
        try:
            self._client_writer.write(raw)
            await self._client_writer.drain()
            _LOGGER.info("[%s] injected: %s", self.mac, payload.get("params", {}))
            DIAG.inject(self.mac, payload)
            if payload.get("method") == "setConfigField":
                self.schedule_confirm_for(
                    (payload.get("params") or {}).get("keyPath")
                )
            elif payload.get("method") == "setConfigFile":
                self.schedule_configfile_confirm()
        except Exception as exc:
            _LOGGER.error("[%s] inject error: %s", self.mac, exc)

    def schedule_confirm_for(self, keypath) -> None:
        """Route a post-write confirm poll. A grow-plan write (keyPath ["plan"…])
        only reflects in a full getConfigFile (configFile.plan), not a targeted
        field read, so re-read the whole file; everything else confirms with the
        cheaper targeted module read. (v3.19.151)"""
        if (isinstance(keypath, (list, tuple)) and keypath
                and str(keypath[0]) == "plan"):
            self.schedule_configfile_confirm()
        else:
            self.schedule_config_confirm(keypath)

    def schedule_config_confirm(self, keypath, delay: Optional[float] = None) -> None:
        """A setConfigField just went to the device (from the SF app via the
        cloud, or from HA via inject). Poll that module's config shortly
        after so shakeLevel/natural/modeType update in seconds instead of
        waiting for the 10-minute poll."""
        if not keypath or not isinstance(keypath, (list, tuple)):
            return
        kp = [str(x) for x in list(keypath)]
        # Standalone-strip outlets are addressed as ["outlet","O<n>"] (and the LED
        # as ["outlet","led"]). A targeted read of that single key answers with a
        # BARE {"O<n>": …} / {"led": …} — no "outlet" wrapper — which the config
        # parser's block loop drops (the same shape bug the LED confirm hit in
        # 3.19.112). Poll the whole ["outlet"] block instead so the response is
        # wrapped and every outlet's mode/LED gets published. CB-attached strips
        # use ["device","ps5"|"ps10", …] and already read a wrapped module. (v3.19.172)
        module_path = ["outlet"] if kp[:1] == ["outlet"] else kp[:2]
        key = tuple(module_path)
        if key in self._pending_confirms:
            return
        self._pending_confirms.add(key)

        async def _confirm() -> None:
            try:
                await asyncio.sleep(self.confirm_delay if delay is None else delay)
                await self.inject({
                    "method": "getConfigField",
                    "pid":    self.mac_raw,
                    "params": {"keyPath": module_path},
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    self.uid,
                })
                _LOGGER.debug("[%s] confirm poll sent for %s", self.mac, module_path)
            except Exception as exc:
                _LOGGER.debug("[%s] confirm poll failed: %s", self.mac, exc)
            finally:
                self._pending_confirms.discard(key)

        asyncio.create_task(_confirm())

    def schedule_configfile_confirm(self, delay: Optional[float] = None) -> None:
        """A setConfigFile (SE-light schedule write) just went to the device
        — from the app via the cloud or from HA. Re-read the config file
        shortly after so HA's schedule entities update in seconds."""
        key = ("configFile",)
        if key in self._pending_confirms:
            return
        self._pending_confirms.add(key)

        async def _confirm() -> None:
            try:
                await asyncio.sleep(self.confirm_delay if delay is None else delay)
                await self.inject({
                    "method": "getConfigFile",
                    "pid":    self.mac_raw,
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    self.uid,
                })
            except Exception as exc:
                _LOGGER.debug("[%s] configFile confirm failed: %s", self.mac, exc)
            finally:
                self._pending_confirms.discard(key)

        asyncio.create_task(_confirm())

    def ensure_discovery(self) -> None:
        """Publish HA discovery — immediately on first connect, then every 60s.
        This ensures new entities appear after integration updates without
        requiring device reconnection."""
        if not self.device_type:
            return
        now = time.monotonic()
        if not self._discovery_published or (now - self._last_discovery_at) > 60.0:
            publish_discovery_for_device(
                self.mqtt_client, self.mac, self.device_cfg
            )
            cleanup_stale_discovery(self.mqtt_client, self.mac_raw)
            self._discovery_published = True
            self._last_discovery_at = now

    def publish_availability(self, status: str) -> None:
        # Per-device availability: one topic per MAC, rather than a single
        # meant a single device disconnecting (or crash-looping) marked
        # EVERY entity of every device unavailable.
        self.mqtt_client.publish(
            f"ggs/ha/{self.mac}/availability", status, retain=True, qos=1
        )


class MITMProxy:
    """
    Manages all active GGS Controller sessions and the HA MQTT bridge.
    """

    def __init__(
        self,
        config: dict,
        mqtt_client: Any,
        config_path: Optional[str] = None,
    ):
        self.config       = config
        self.mqtt_client  = mqtt_client
        self._config_path = config_path
        # Keyed by lowercase MAC (no colons)
        self._sessions: Dict[str, ProxySession] = {}
        # Cached upstream SSL context — built once in executor, not on event loop
        self._upstream_ssl_ctx: Optional[ssl.SSLContext] = None
        # Safety lock — commands are dropped unless explicitly enabled
        self.allow_control: bool = False
        # Block cloud (local-only): never relay to the Spider Farmer cloud —
        # serve every controller from the built-in local broker instead, so no
        # device data leaves the LAN. Applies to hotspot-AP and NAT'd devices
        # alike (both funnel through this proxy). HA keeps full read + control;
        # the phone app and cloud firmware updates stop working while on.
        self.block_cloud: bool = False
        # Republish discovery for this many seconds after startup
        self._start_time: float = time.monotonic()
        self._discovery_window_sec: float = 30.0

    def build_server_ssl_ctx(self) -> ssl.SSLContext:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
        ctx.load_cert_chain(
            certfile=self.config["proxy"]["cert_file"],
            keyfile=self.config["proxy"]["key_file"],
        )
        return ctx

    def _build_upstream_ssl_ctx(self) -> ssl.SSLContext:
        # Proxy -> cloud leg. The cloud serves a certificate signed by a
        # private CA that the system trust store doesn't know, so we verify
        # against that CA's public certificate, bundled with the integration.
        # Hostname verification stays enabled. This trust store is separate
        # from the device-facing certificate used on the controller leg.
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
        ctx.check_hostname = True
        ctx.verify_mode = ssl.CERT_REQUIRED
        ctx.load_verify_locations(cafile=self.config["proxy"]["upstream_ca_file"])
        return ctx

    async def async_build_upstream_ssl_ctx(self) -> ssl.SSLContext:
        """Return cached upstream SSL context, building it off the event loop if needed."""
        if self._upstream_ssl_ctx is None:
            loop = asyncio.get_event_loop()
            self._upstream_ssl_ctx = await loop.run_in_executor(
                None, self._build_upstream_ssl_ctx
            )
        return self._upstream_ssl_ctx

    async def config_poll_loop(self) -> None:
        """Periodic getConfigField poll (every 10 min by default)."""
        interval = int(
            self.config.get("proxy", {}).get("config_poll_interval_sec", 600)
        )
        if interval <= 0:
            return
        _LOGGER.info("Config poll loop started, interval=%ds", interval)
        while True:
            try:
                await asyncio.sleep(interval)
                for sess in list(self._sessions.values()):
                    await self._poll_session(sess)
            except asyncio.CancelledError:
                break
            except Exception as exc:
                _LOGGER.warning("Config poll error: %s", exc)
                await asyncio.sleep(30)

    async def _poll_session(self, sess: ProxySession) -> None:
        # Outlet config: poll the whole block(s) this device exposes so the
        # cache stays fresh for read-modify-write mode changes.
        outlet_blocks = []
        if sess.device_type in ("ps5", "ps10", "st"):
            # Standalone strip / S-Station: poll the TOP-LEVEL "outlet" block —
            # the one the firmware acts on and the app read-modify-writes (v3.19.93).
            outlet_blocks = ["outlet"]
        ev = getattr(sess, "evidence", set())
        outlet_blocks += [b for b in ("ps5", "ps10") if b in ev and b not in outlet_blocks]
        # Panels AND strips hold the environment target block (v3.19.90).
        if sess.device_type in ("cb", "ps5", "ps10", "st"):
            try:
                await sess.inject({
                    "method": "getConfigField", "pid": sess.mac_raw,
                    "params": {"keyPath": ["target"]},
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("env target poll failed: %s", exc)
        # Alarm/notification history (v3.19.41): the device only reports the
        # log when asked (the app's Notification screen). Poll it so HA's
        # Alarms sensor backfills without the app.
        if sess.device_type in ("cb", "ps5", "ps10", "st"):
            try:
                # Cursor paging (v3.19.50): seed from the high-water id. On a
                # fresh session alarm_hw is 0, so this backfills the whole
                # buffer (the response handler walks the pages forward); later
                # polls fetch only entries newer than what we already have.
                await sess.inject({
                    "method": "getAlarmLog", "pid": sess.mac_raw,
                    "params": {"limit": 50, "id": sess.alarm_hw},
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("alarm log poll failed: %s", exc)
        # Operation log (v3.19.146): the controller reports auto-mode climate
        # accessories turning ON in getDevSta but never the OFF — only the op log
        # records both. oplogLast pushes are incomplete, so poll getDevOpLog with
        # the same cursor paging as the alarm log to catch every on/off.
        if sess.device_type in ("cb", "ps5", "ps10", "st"):
            try:
                await sess.inject({
                    "method": "getDevOpLog", "pid": sess.mac_raw,
                    "params": {"limit": 50, "id": sess.oplog_hw},
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("op log poll failed: %s", exc)
        # Panels/strips: pull the whole config file so senConfig (soil names,
        # calibration, substrate) and the top-level air calibration arrive
        # reliably. The device does NOT answer targeted getConfigField reads
        # for ["calibration"] or ["device","senConfig"] — only the (app- or
        # here integration-triggered) getConfigFile returns them.
        if sess.device_type in ("cb", "ps5", "ps10", "st"):
            try:
                await sess.inject({
                    "method": "getConfigFile", "pid": sess.mac_raw,
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("config file poll failed: %s", exc)
        for block in outlet_blocks:
            # Standalone strip caches from the top-level ["outlet"] block; a
            # CB reports its hosted strips under ["device","ps5"/"ps10"].
            keypath = ["outlet"] if block == "outlet" else ["device", block]
            try:
                await sess.inject({
                    "method": "getConfigField", "pid": sess.mac_raw,
                    "params": {"keyPath": keypath},
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("outlet cfg poll failed (%s): %s", block, exc)

        if sess.device_type == "se":
            # Standalone SE lights have no CB-style config tree — their
            # entire config is one getConfigFile document.
            try:
                await sess.inject({
                    "method": "getConfigFile",
                    "pid":    sess.mac_raw,
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("SE config poll failed: %s", exc)
            return
        for keypath in (
            ["device", "light"],  ["device", "light2"],
            ["device", "fan"],    ["device", "blower"],
            ["device", "heater"], ["device", "humidifier"],
            ["device", "dehumidifier"],
        ):
            try:
                await sess.inject({
                    "method": "getConfigField",
                    "pid":    sess.mac_raw,
                    "params": {"keyPath": keypath},
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("poll inject failed for %s: %s", keypath, exc)
            await asyncio.sleep(0.5)

    def _strip_session_for_type(self, strip_type: str):
        """Reverse of _cb_host_for_strip: given a CB's ps5/ps10 block, find
        the connected standalone strip session that owns the HA entities."""
        for s in self._sessions.values():
            if getattr(s, "device_type", None) == strip_type and s.has_client:
                return s
        return None

    def _cb_host_for_strip(self, strip_type: str):
        """Return a connected CB session that is currently hosting a strip of
        this type (reports its ps5/ps10 block), or None. When present, outlet
        commands route through the CB — the confirmed app control path — using
        that block's keyPath; when absent, the strip is commanded directly.

        This is what makes routing automatic: plug the strip into a CB and
        HA commands follow the CB; run it standalone and they go direct."""
        if strip_type not in ("ps5", "ps10"):
            return None
        for s in self._sessions.values():
            if (
                getattr(s, "device_type", None) == "cb"
                and strip_type in getattr(s, "evidence", set())
                and s.has_client
            ):
                return s
        return None

    def _outlet_route(self, sess):
        """Return (command_session, config_block) for an outlet on `sess`.

        A CB-HOSTED strip is driven through the panel's device tree, so its
        outlets are addressed by the strip's TYPE block (ps5/ps10) on the
        panel's session. A STANDALONE strip acts on the bare TOP-LEVEL "outlet"
        block on its own session — the block the SF app writes and the firmware
        actually toggles (v3.19.93; writing a standalone strip under ps5/ps10 or
        device.outlet saved config but never flipped the live outlet)."""
        stype = (getattr(sess, "device_type", "") or "").lower()
        host = self._cb_host_for_strip(stype)
        if host is not None:
            return host, stype          # CB-hosted → ["device", ps5/ps10, …]
        return sess, "outlet"           # standalone → ["outlet", …]

    def host_cb_mac_for_strip(self, strip_mac: str):
        """Lowercase mac of the display panel currently hosting the power strip
        with this mac (the panel reports the strip's ps5/ps10 block), or None
        when the strip is standalone or unknown. Pairing is by strip type — the
        same signal that routes outlet commands — so it is unambiguous for one
        panel per strip type (the normal single-tent case)."""
        sess = None
        for s in self._sessions.values():
            if getattr(s, "mac", None) == strip_mac:
                sess = s
                break
        if sess is None:
            return None
        host = self._cb_host_for_strip(
            (getattr(sess, "device_type", "") or "").lower()
        )
        return host.mac if host is not None else None

    async def handle_command(self, topic: str, value: Any) -> None:
        """Handle an HA -> device command addressed by its topic."""
        # Command topics: ggs/ha/{mac}/{field}/set
        #                 or: ggs/ha/{mac}/{field}/{subfield}/set
        if isinstance(value, bytes):
            value = value.decode("utf-8", errors="replace")

        parts = topic.split("/")
        if len(parts) < 5:
            return
        mac_addr = parts[2]
        field    = parts[3]
        # ggs/ha/{mac}/{field}/set               → subfield=None
        # ggs/ha/{mac}/{field}/{subfield}/set    → subfield=parts[4]
        # ggs/ha/{mac}/{field}/{sub}/{subsub}/set → subfield="sub/subsub" (future)
        if len(parts) >= 6 and parts[-1] == "set":
            subfield = "/".join(parts[4:-1]) or None
        else:
            subfield = None

        sess = self._sessions.get(mac_addr)
        if sess is None:
            _LOGGER.warning("Command for mac=%s but no active session", mac_addr)
            return

        outlet_num = None
        outlet_subfield = None
        import re as _re
        om = _re.match(r"outlet_(\d+)(?:_(.+))?$", field)
        if om:
            n = int(om.group(1))
            if 1 <= n <= 10:
                outlet_num = n
                outlet_subfield = om.group(2)   # None | "mode" | "cycle_run" ...
            else:
                return

        # HA entity topics use light_1/light_2; the command translator uses
        # the device's own light/light2 block names, so map between them.
        if field == "light_1":
            field = "light"
        elif field == "light_2":
            field = "light2"

        # Outlet routing (v3.19.90): strips store their outlet config under
        # their own TYPE block (ps5/ps10), whether commanded via a hosting CB
        # or directly. Earlier builds wrote a standalone strip's outlets to the
        # sparse "outlet" block, which the firmware stores (200 OK) but never
        # acts on — so the outlet snapped back off. Route both cases to ps5/ps10.
        cmd_sess = sess
        outlet_block = "outlet"
        if outlet_num is not None:
            cmd_sess, outlet_block = self._outlet_route(sess)
            if cmd_sess is not sess:
                _LOGGER.debug(
                    "outlet %s on %s routed via CB host %s (block %s)",
                    outlet_num, sess.mac, cmd_sess.mac, outlet_block,
                )

        from .command_handler import translate_command
        payload = translate_command(
            field, value, cmd_sess.mac_raw, cmd_sess.uid, outlet_num,
            device_state=cmd_sess.device_state,
            subfield=subfield,
            last_nonzero_level=cmd_sess.last_nonzero_level,
            fan_state=cmd_sess.fan_state,
            light_state=cmd_sess.light_state,
            se_config=cmd_sess.se_config,
            outlet_block=outlet_block,
            outlet_subfield=outlet_subfield,
            outlet_cfg=cmd_sess.outlet_cfg.get(f"{outlet_block}/O{outlet_num}")
                       if outlet_num is not None else None,
            env_cfg=cmd_sess.env_cfg or None,
            cal_cfg=cmd_sess.cal_cfg or None,
            senconfig=cmd_sess.senconfig or None,
        )
        if payload:
            # Optimistically fold a read-modify-write block back into the session
            # cache *before* injecting. A multi-field Apply fires one write per
            # field; each rebuilds the whole block from the cached copy, so
            # without this the second write reads the pre-write cache and clobbers
            # the first (only the last field applied stuck). Updating the cache in
            # this synchronous window (no await before it) means whichever write
            # runs second builds on the first. Covers env target / air+soil
            # calibration / alarm blocks. (v3.19.111)
            params = payload.get("params") or {}
            kp = params.get("keyPath")
            if kp == ["target"] and isinstance(params.get("target"), dict):
                cmd_sess.env_cfg = params["target"]
            elif kp == ["calibration"] and isinstance(params.get("calibration"), dict):
                cmd_sess.cal_cfg = params["calibration"]
            elif kp == ["alarm"] and isinstance(params.get("alarm"), dict):
                cmd_sess.alarm_cfg = params["alarm"]
            elif kp == ["device", "senConfig"] and isinstance(params.get("senConfig"), list):
                cmd_sess.senconfig = params["senConfig"]
            elif (isinstance(kp, list) and len(kp) == 2 and kp[0] == "device"
                    and isinstance(params.get(kp[1]), dict)):
                # Any per-module device block (fan/blower/light/light2/heater/
                # humidifier/dehumidifier). Fold each write back into the caches the
                # command builder reads, so a follow-up write in the same Apply (e.g.
                # a power toggle after the config bundle) builds on the merged block
                # instead of clobbering modeType/speeds/schedule. (v3.19.125/126)
                module, blk = kp[1], params[kp[1]]
                if module in ("fan", "blower"):
                    cmd_sess.fan_state.setdefault(module, {}).update(blk)
                elif module in ("light", "light2"):
                    cmd_sess.light_state.setdefault(module, {}).update(blk)
                # Climate reads the live device_state; merge there too (optimistic
                # until the device echoes back) so mode/level/schedule persist.
                cmd_sess.device_state.setdefault(module, {}).update(blk)
            elif (isinstance(kp, list) and len(kp) in (2, 3)
                    and isinstance(kp[-1], str) and kp[-1][:1] == "O"
                    and kp[-1][1:].isdigit()
                    and isinstance(params.get(kp[-1]), dict)):
                # A single outlet block: ["outlet","O{n}"] (standalone strip) or
                # ["device",ps5/ps10,"O{n}"] (CB-hosted). Fold into outlet_cfg so
                # outlet sub-settings applied together in one Apply (mode + cycle
                # timings + device dropdowns) merge instead of clobbering. (v3.19.128)
                ok = kp[-1]
                blk_name = kp[1] if (len(kp) == 3 and kp[0] == "device") else "outlet"
                cmd_sess.outlet_cfg.setdefault(f"{blk_name}/{ok}", {}).update(params[ok])
            await cmd_sess.inject(payload)

    async def write_se_schedule(self, mac: str, periods: list) -> bool:
        """Write the full SE-light schedule (multiple weekday-aware periods)
        via setConfigFile. Returns False if the device has no live session."""
        sess = self._sessions.get(_mac(mac))
        if sess is None:
            _LOGGER.warning("set_se_schedule: no active session for mac=%s", mac)
            return False
        from .command_handler import build_se_schedule
        payload = build_se_schedule(sess.mac_raw, sess.uid, periods, sess.se_config)
        if not payload:
            _LOGGER.warning("set_se_schedule: nothing to write for mac=%s", mac)
            return False
        await sess.inject(payload)
        _LOGGER.info("set_se_schedule: wrote %d period(s) to %s", len(periods), mac)
        return True

    async def write_outlet_schedule(self, mac: str, n: int, periods: list) -> bool:
        """Write an outlet's Time Slot schedule (up to 12 weekday-aware slots),
        read-modify-write, routed via the host CB (ps5/ps10 block) when the
        strip is CB-hosted, else the strip's own outlet block."""
        sess = self._sessions.get(_mac(mac))
        if sess is None:
            _LOGGER.warning("set_outlet_schedule: no active session for mac=%s", mac)
            return False
        cmd_sess, block = self._outlet_route(sess)
        outlet_cfg = cmd_sess.outlet_cfg.get(f"{block}/O{n}")
        from .command_handler import build_outlet_schedule
        payload = build_outlet_schedule(
            cmd_sess.mac_raw, cmd_sess.uid, n, block, periods, outlet_cfg)
        if not payload:
            return False
        await cmd_sess.inject(payload)
        _LOGGER.info("set_outlet_schedule: wrote %d slot(s) to %s O%s (block %s)",
                     len(periods), mac, n, block)
        return True

    async def write_outlet_config(self, mac: str, n: int, mode: str,
                                  config: dict) -> bool:
        """Write an outlet's mode AND its config fields (Cycle timings / device
        dropdown) in one atomic setConfigField — used when the card commits a
        freshly-picked mode together with its settings, so a mode change and its
        config land in a single valid block."""
        sess = self._sessions.get(_mac(mac))
        if sess is None:
            _LOGGER.warning("set_outlet_config: no active session for mac=%s", mac)
            return False
        cmd_sess, block = self._outlet_route(sess)
        outlet_cfg = cmd_sess.outlet_cfg.get(f"{block}/O{n}")
        from .command_handler import build_outlet_config
        payload = build_outlet_config(
            cmd_sess.mac_raw, cmd_sess.uid, n, block, mode, config, outlet_cfg)
        if not payload:
            return False
        cmd_sess.outlet_cfg.setdefault(f"{block}/O{n}", {}).update(
            payload["params"][f"O{n}"])
        await cmd_sess.inject(payload)
        _LOGGER.info("set_outlet_config: wrote mode=%s (%d field(s)) to %s O%s "
                     "(block %s)", mode, len(config or {}), mac, n, block)
        return True

    async def write_alarm_settings(self, mac: str, settings: dict) -> bool:
        """Write the controller's alarm threshold block (read-modify-write)."""
        sess = self._sessions.get(_mac(mac))
        if sess is None:
            _LOGGER.warning("set_alarm_settings: no active session for mac=%s", mac)
            return False
        from .command_handler import build_alarm_settings
        payload = build_alarm_settings(sess.mac_raw, sess.uid, settings, sess.alarm_cfg)
        if not payload:
            return False
        await sess.inject(payload)
        _LOGGER.info("set_alarm_settings: wrote alarm thresholds to %s", mac)
        return True

    async def write_plan(self, mac: str, stages: list, enabled) -> bool:
        """Write the controller's grow-plan block (read-modify-write): the card's
        stage list merged over the cached plan, preserving each stage's light
        schedule/colour. keyPath ["plan"]. (v3.19.156)"""
        sess = self._sessions.get(_mac(mac))
        if sess is None:
            _LOGGER.warning("set_plan: no active session for mac=%s", mac)
            return False
        from .command_handler import build_plan
        payload = build_plan(sess.mac_raw, sess.uid, stages, enabled, sess.plan_cfg)
        if not payload:
            return False
        await sess.inject(payload)
        _LOGGER.info("set_plan: wrote %d-stage plan (enabled=%s) to %s",
                     len(stages or []), enabled, mac)
        return True

    async def set_sensor_heating(self, mac: str, on) -> bool:
        """Start (on=1) / stop (on=0) the air temp/humidity sensor's self-clean
        heat cycle — the SF app's "Sensor cleaning". Captured command:
        {"method":"setSensorHeating","params":{"on":0|1}} (device replies ok)."""
        sess = self._sessions.get(_mac(mac))
        if sess is None:
            _LOGGER.warning("set_sensor_heating: no active session for mac=%s", mac)
            return False
        payload = {
            "method": "setSensorHeating",
            "pid": sess.mac_raw.upper().replace(":", ""),
            "params": {"on": 1 if on else 0},
            "msgId": str(int(time.time() * 1000)),
            "uid": sess.uid,
        }
        await sess.inject(payload)
        _LOGGER.info("set_sensor_heating: on=%s -> %s", 1 if on else 0, mac)
        return True

    # ── Device clock / timezone sync ──────────────────────────────────────
    # Controllers keep their own real-time clock; if it drifts, schedules and
    # cycle timers fire at the wrong wall-clock time. On connect the bridge
    # re-sends Home Assistant's current time + timezone (the same setDevTimezone
    # the SF app uses), so every controller stays in step with HA. The timezone
    # comes straight from HA's configuration — no app interaction needed.
    @staticmethod
    def _posix_tz_string(tzname: str) -> Optional[str]:
        """The trailing POSIX TZ rule (e.g. 'CST6CDT,M3.2.0,M11.1.0') from the
        IANA tz database entry — what the controller's setDevTimezone expects.
        Read from the bundled `tzdata` package, falling back to the system
        zoneinfo dir. None if it can't be resolved."""
        if not tzname:
            return None
        raw = None
        try:
            import importlib.resources as ir
            res = ir.files("tzdata").joinpath("zoneinfo", *tzname.split("/"))
            raw = res.read_bytes()
        except Exception:
            raw = None
        if raw is None:
            try:
                import os
                for base in ("/usr/share/zoneinfo", "/etc/zoneinfo"):
                    p = os.path.join(base, tzname)
                    if os.path.exists(p):
                        with open(p, "rb") as f:
                            raw = f.read()
                        break
            except Exception:
                raw = None
        if not raw or raw[:4] != b"TZif":
            return None
        # TZif v2+ appends the POSIX rule as the final newline-wrapped line.
        nl = raw.rfind(b"\n")
        if nl <= 0:
            return None
        prev = raw.rfind(b"\n", 0, nl)
        if prev < 0:
            return None
        tz = raw[prev + 1:nl].decode("ascii", "ignore").strip()
        return tz or None

    def build_tz_sync_command(self, sess) -> Optional[dict]:
        """A setDevTimezone command carrying HA's timezone and the current UTC,
        or None if HA's timezone can't be resolved."""
        hass = getattr(self.mqtt_client, "hass", None)
        tzname = getattr(getattr(hass, "config", None), "time_zone", None)
        if not tzname:
            return None
        # gmtoff is sent as 0 to match the SF app exactly — the controller reads
        # the offset/DST rules from the POSIX TZ string, not gmtoff.
        params = {"timezone": tzname, "UTC": int(time.time()), "gmtoff": 0}
        posix = self._posix_tz_string(tzname)
        if posix:
            params["TZ"] = posix
        return {
            "method": "setDevTimezone",
            "params": params,
            "pid": sess.mac_raw,
            "msgId": str(int(time.time() * 1000)),
            "uid": sess.uid,
        }

    def close_session(self, mac: str) -> bool:
        """Sever one device's connection (used by device deletion). The
        device will reconnect and re-register unless it's powered off."""
        sess = self._sessions.pop(mac, None)
        if sess is None:
            return False
        task = getattr(sess, "initial_poll_task", None)
        if task is not None and not task.done():
            task.cancel()
        writer = getattr(sess, "_client_writer", None)
        if writer is not None:
            try:
                writer.close()
            except Exception:
                pass
        _LOGGER.info("Severed session for %s (device deletion)", mac)
        return True

    def close_all_sessions(self) -> None:
        """Sever every device connection (v3.2.2 reload fix). Closing the
        listener only blocks NEW connections — established device sessions
        keep relaying into the unloaded instance ("zombie sessions"), so the
        devices never reconnect to the reloaded one. Closing their sockets
        forces a reconnect to the new listener within seconds."""
        for sess in list(self._sessions.values()):
            task = getattr(sess, "initial_poll_task", None)
            if task is not None and not task.done():
                task.cancel()
            writer = getattr(sess, "_client_writer", None)
            if writer is not None:
                try:
                    writer.close()
                except Exception:
                    pass
        count = len(self._sessions)
        self._sessions.clear()
        if count:
            _LOGGER.info(
                "Closed %d device sessions for reload — devices will "
                "reconnect to the new instance", count,
            )

    def _bind_local(self, client_id: str, client_writer, peer) -> "ProxySession":
        """Bind (or reuse) a session for local-only mode — device writer only,
        no cloud upstream."""
        mac_addr = _mac(client_id)
        sess = self._sessions.get(mac_addr)
        if sess is None:
            sess = ProxySession(client_id, self.mqtt_client)
            self._sessions[mac_addr] = sess
            _LOGGER.info("[%s] new LOCAL session (cloud offline)", mac_addr)
            DIAG.session(mac_addr, "CONNECT-LOCAL", f"peer={peer}")
        sess.set_upstream(None)
        sess.set_client(client_writer)
        return sess

    async def _upstream_reachable(self) -> bool:
        """Quick TCP probe of the cloud MQTT endpoint (no TLS needed)."""
        try:
            _, w = await asyncio.wait_for(
                asyncio.open_connection(
                    self.config["proxy"]["upstream_host"],
                    self.config["proxy"]["upstream_port"],
                ),
                timeout=4,
            )
            w.close()
            try:
                await w.wait_closed()
            except Exception:
                pass
            return True
        except Exception:
            return False

    async def _serve_local(self, client_reader, client_writer, peer,
                           session_ref) -> None:
        """Act as the MQTT broker for one controller while the cloud is down.

        Answers CONNECT/SUBSCRIBE/PUBLISH/PINGREQ locally so Home Assistant
        keeps full read + control; the controller keeps self-reporting getDevSta
        on its own heartbeat, so state stays fresh with nobody polling. The app
        can't reach the cloud while it's down either, so nothing is lost.
        Periodically re-checks the cloud and, when it returns, ends local mode so
        the controller reconnects into full relay (restoring app control)."""
        from .mqtt_parser import (
            parse_packets, build_connack, build_suback, build_puback,
            build_pingresp, MQTT_CONNECT, MQTT_SUBSCRIBE, MQTT_PUBLISH,
            MQTT_PINGREQ, MQTT_DISCONNECT,
        )
        buf = b""
        last_probe = time.monotonic()
        while True:
            try:
                data = await asyncio.wait_for(client_reader.read(65536), timeout=15)
            except asyncio.TimeoutError:
                data = b""
            except Exception:
                return
            if data:
                buf += data
                packets, buf = parse_packets(buf)
                out = bytearray()
                for pkt in packets:
                    if pkt.packet_type == MQTT_CONNECT and pkt.client_id:
                        sess = self._bind_local(pkt.client_id, client_writer, peer)
                        session_ref[0] = sess
                        sess.publish_availability("online")
                        out += build_connack()
                    elif pkt.packet_type == MQTT_SUBSCRIBE:
                        sess = session_ref[0]
                        if sess is not None:
                            for t in (pkt.topics or []):
                                p = t.split("/")
                                if (len(p) >= 6 and p[0] == "SF" and p[1] == "GGS"
                                        and p[3] == "API" and p[4] == "DOWN"
                                        and p[2] and sess.down_topic_prefix != p[2]):
                                    sess.down_topic_prefix = p[2]
                        out += build_suback(pkt.packet_id or 0, pkt.sub_qos or [0])
                    elif pkt.packet_type == MQTT_PUBLISH:
                        sess = session_ref[0]
                        if sess is not None:
                            try:
                                _process_publish(sess, pkt, self.mqtt_client)
                            except Exception as exc:
                                _LOGGER.exception(
                                    "[local] frame processing failed (continues)")
                                DIAG.error(sess.mac, "local frame failed", exc)
                        if pkt.qos == 1 and pkt.packet_id is not None:
                            out += build_puback(pkt.packet_id)
                    elif pkt.packet_type == MQTT_PINGREQ:
                        out += build_pingresp()
                    elif pkt.packet_type == MQTT_DISCONNECT:
                        return
                if out:
                    client_writer.write(bytes(out))
                    await client_writer.drain()
            elif client_reader.at_eof():
                return
            # Block-cloud is a deliberate air-gap — stay local forever. Only the
            # outage-driven fallback hands back to relay when the cloud returns.
            now = time.monotonic()
            if not self.block_cloud and now - last_probe >= _UPSTREAM_PROBE_INTERVAL:
                last_probe = now
                if await self._upstream_reachable():
                    _LOGGER.info(
                        "Cloud reachable again — ending LOCAL mode for %s "
                        "(controller will reconnect to full relay)", peer)
                    return

    async def handle_client(
        self,
        client_reader: asyncio.StreamReader,
        client_writer: asyncio.StreamWriter,
    ) -> None:
        """Relay one controller TLS connection to the cloud and back."""
        peer = client_writer.get_extra_info("peername")
        _LOGGER.info("New connection from %s", peer)
        upstream_writer = None
        session_ref: list = [None]   # mutable cell shared with the inspectors

        try:
            if self.block_cloud:
                # Deliberate local-only mode — never touch the cloud.
                _LOGGER.info("Block-cloud on — serving %s locally (no relay)", peer)
                await self._serve_local(client_reader, client_writer, peer,
                                        session_ref)
                return
            ssl_ctx = await self.async_build_upstream_ssl_ctx()
            try:
                upstream_reader, upstream_writer = await asyncio.wait_for(
                    asyncio.open_connection(
                        self.config["proxy"]["upstream_host"],
                        self.config["proxy"]["upstream_port"],
                        ssl=ssl_ctx,
                        server_hostname=self.config["proxy"]["upstream_host"],
                    ),
                    timeout=_UPSTREAM_CONNECT_TIMEOUT,
                )
            except (OSError, asyncio.TimeoutError, ssl.SSLError) as exc:
                # Cloud unreachable (internet down / DNS fail): serve this
                # controller locally so HA keeps full read + control. The app
                # can't reach the cloud either while it's down, so nothing is
                # lost. Self-heals to full relay when the cloud returns.
                _LOGGER.warning(
                    "Cloud unreachable (%s) — serving %s in LOCAL-ONLY mode",
                    exc, peer,
                )
                await self._serve_local(client_reader, client_writer, peer,
                                        session_ref)
                return

            def bind_session(client_id: str) -> ProxySession:
                mac_addr = _mac(client_id)
                existing = self._sessions.get(mac_addr)
                if existing:                     # reconnect: refresh writers
                    existing.set_upstream(upstream_writer)
                    existing.set_client(client_writer)
                    _LOGGER.info("[%s] reconnected", mac_addr)
                    return existing
                sess = ProxySession(client_id, self.mqtt_client)
                sess.set_upstream(upstream_writer)
                sess.set_client(client_writer)
                self._sessions[mac_addr] = sess
                _LOGGER.info("[%s] new session (type unknown until first data)",
                             mac_addr)
                DIAG.session(mac_addr, "CONNECT", f"peer={peer}")
                return sess

            def inspect_from_controller(pkt) -> None:
                """Controller -> cloud packets: track sessions and hand
                PUBLISH frames to the entity layer."""
                if pkt.packet_type == MQTT_CONNECT and pkt.client_id:
                    sess = bind_session(pkt.client_id)
                    session_ref[0] = sess
                    sess.publish_availability("online")
                    return
                sess = session_ref[0]
                if sess is None:
                    return
                if pkt.packet_type == MQTT_SUBSCRIBE and pkt.topics:
                    for t in pkt.topics:
                        parts = t.split("/")
                        if (len(parts) >= 6 and parts[0] == "SF"
                                and parts[1] == "GGS" and parts[3] == "API"
                                and parts[4] == "DOWN" and parts[2]):
                            if sess.down_topic_prefix != parts[2]:
                                _LOGGER.info("[%s] DOWN prefix from SUBSCRIBE: %s",
                                             sess.mac, parts[2])
                                sess.down_topic_prefix = parts[2]
                elif pkt.packet_type == MQTT_PUBLISH:
                    # Isolated: a fault in entity processing must never break
                    # the byte relay the controller depends on.
                    try:
                        _process_publish(sess, pkt, self.mqtt_client)
                    except Exception as exc:
                        _LOGGER.exception(
                            "[%s] frame processing failed on %s (relay continues)",
                            sess.mac, pkt.topic,
                        )
                        DIAG.error(sess.mac,
                                   f"frame processing failed on {pkt.topic}", exc)

            def inspect_from_cloud(pkt) -> None:
                """Cloud -> controller packets: learn the DOWN topic prefix and
                capture app-originated config writes so HA can confirm-poll
                them promptly instead of waiting for the periodic refresh."""
                sess = session_ref[0]
                if (sess is None or pkt.packet_type != MQTT_PUBLISH
                        or not pkt.topic or "/API/DOWN/" not in pkt.topic
                        or not pkt.message):
                    return
                parts = pkt.topic.split("/")
                if len(parts) >= 6 and parts[2] and sess.down_topic_prefix != parts[2]:
                    _LOGGER.info("[%s] DOWN prefix from cloud: %s",
                                 sess.mac, parts[2])
                    sess.down_topic_prefix = parts[2]
                try:
                    body = json.loads(pkt.message)
                except (ValueError, TypeError):
                    return
                method = body.get("method") or "?"
                DIAG.down_command(sess.mac, method, body)
                if method == "setConfigField":
                    params = body.get("params") or {}
                    DIAG.app_command(sess.mac, params.get("keyPath"), params)
                    sess.schedule_confirm_for(params.get("keyPath"))
                elif method == "setConfigFile":
                    params = body.get("params") or {}
                    lc = (params.get("configFile") or {}).get("light")
                    if isinstance(lc, dict):
                        sess.se_config = dict(lc)
                    sess.schedule_configfile_confirm()

            up = asyncio.create_task(
                self._pump(client_reader, upstream_writer, inspect_from_controller)
            )
            down = asyncio.create_task(
                self._pump(upstream_reader, client_writer, inspect_from_cloud)
            )
            _, pending = await asyncio.wait(
                {up, down}, return_when=asyncio.FIRST_COMPLETED
            )
            for t in pending:
                t.cancel()
            for t in pending:
                try:
                    await t
                except (asyncio.CancelledError, Exception):
                    pass

        except ssl.SSLError as exc:
            _LOGGER.warning("TLS MITM failed (%s) — closing", exc)
        except Exception as exc:
            _LOGGER.error("Connection error from %s: %s", peer, exc)
        finally:
            self._teardown_session(session_ref[0], client_writer)
            for w in (upstream_writer, client_writer):
                if w is not None:
                    try:
                        w.close()
                    except Exception:
                        pass
            _LOGGER.info("Connection from %s closed", peer)

    def _teardown_session(self, sess, client_writer) -> None:
        """Release a controller connection when its relay ends.

        A reconnecting controller reuses the SAME ProxySession object —
        bind_session just refreshes its writers to the new socket — so
        ``self._sessions[mac] is sess`` stays true even after a newer connection
        has taken over. If THIS (old) connection's writer has already been
        replaced, a newer connection is live: do not evict the session or publish
        "offline". Doing so was the bug that left a device stuck **offline** in HA
        (its availability latched on the stale "offline") while getDevSta frames
        kept relaying fine on the new socket. Only the connection that still owns
        the session's client writer performs teardown."""
        if sess is None:
            return
        if sess._client_writer is not client_writer:
            return  # superseded by a newer connection — leave the live session
        if sess.initial_poll_task and not sess.initial_poll_task.done():
            sess.initial_poll_task.cancel()
        if self._sessions.get(sess.mac) is sess:
            self._sessions.pop(sess.mac, None)
            sess.publish_availability("offline")
            DIAG.session(sess.mac, "DISCONNECT")

    async def _pump(self, reader, writer, inspect) -> None:
        """Forward every byte from ``reader`` to ``writer`` unchanged, decoding
        the MQTT frames along the way and passing each to ``inspect``. The
        forward always happens; inspection is best-effort and never blocks or
        breaks the relay."""
        buf = b""
        try:
            while True:
                data = await reader.read(4096)
                if not data:
                    break
                try:
                    writer.write(data)
                    await writer.drain()
                except Exception:
                    break
                try:
                    buf += data
                    packets, buf = parse_packets(buf)
                    for pkt in packets:
                        inspect(pkt)
                except Exception as exc:
                    _LOGGER.debug("relay parse (non-fatal): %s", exc)
                    buf = b""
        except Exception as exc:
            _LOGGER.debug("relay pump ended: %r", exc)
        finally:
            try:
                writer.close()
            except Exception:
                pass


def _process_publish(
    session: ProxySession,
    pkt: Any,
    mqtt_client: Any,
) -> None:
    """
    Normalise an UP PUBLISH from the GGS Controller and republish to HA.
    Also handles device type detection and discovery publication.
    """
    if pkt.topic is None or pkt.message is None:
        return

    parts = pkt.topic.split("/")
    if (
        len(parts) < 6
        or parts[0] != "SF"
        or parts[1] != "GGS"
        or parts[3] != "API"
        or parts[4] != "UP"
    ):
        return

    try:
        data = json.loads(pkt.message)
    except Exception:
        return

    # ── DIAGNOSTIC: frame attribution check ──────────────────────────────
    # The UP topic carries the originating device MAC (parts[5]) and the
    # JSON carries a pid. Both should match the session's CONNECT identity.
    # If they don't, frames from one device are riding another device's
    # connection and state is being attributed to the wrong HA device.
    topic_mac = _mac(parts[5]) if len(parts) > 5 and parts[5] else ""
    pid_mac   = _mac(str(data.get("pid", "")))
    blocks    = sorted(data.get("data", {}).keys()) if isinstance(data.get("data"), dict) else []
    if topic_mac and topic_mac != session.mac:
        _LOGGER.warning(
            "ATTRIBUTION MISMATCH: session=%s but UP topic MAC=%s pid=%s "
            "method=%s blocks=%s",
            session.mac, topic_mac, pid_mac or "?",
            data.get("method"), blocks,
        )
    elif pid_mac and pid_mac != session.mac:
        _LOGGER.warning(
            "ATTRIBUTION MISMATCH (pid): session=%s topic MAC=%s pid=%s "
            "method=%s blocks=%s",
            session.mac, topic_mac or "?", pid_mac,
            data.get("method"), blocks,
        )
    else:
        _LOGGER.debug(
            "frame ok: session=%s topic_mac=%s pid=%s method=%s blocks=%s",
            session.mac, topic_mac or "?", pid_mac or "?",
            data.get("method"), blocks,
        )
    DIAG.frame(session.mac, topic_mac, pid_mac, str(data.get("method")), data)

    method = data.get("method")

    # ── Alarm / event log (getAlarmLog response) ─────────────────────────
    # The controller pages its alarm history with a cursor: a request of
    # {"limit":N,"id":X} returns up to N entries whose id is > X. A single
    # {"offset":0,"count":50} (the pre-3.19.50 poll) only ever handed back the
    # oldest ~10 entries, so everything between the oldest slice and whatever
    # arrived live since HA booted was invisible on the Log tab. Here we walk
    # the cursor forward — seeded from alarm_hw — one full page at a time until
    # the device returns a short page (caught up). This ingests both our own
    # injected pages and any the app happens to request.
    if method == "getAlarmLog":
        from .normalizer import decode_alarm_log
        d_alarm = data.get("data", {})
        events = decode_alarm_log(d_alarm)
        apply = getattr(mqtt_client, "apply_alarms", None)
        if apply is not None and events:
            apply(session.mac_raw, events)
        lst = d_alarm.get("list") if isinstance(d_alarm, dict) else None
        ids = [a.get("id") for a in (lst or []) if isinstance(a.get("id"), int)]
        if ids:
            mx = max(ids)
            # Only advance/page on genuine forward progress; this also stops us
            # chaining forever off the app's own repeated reads.
            if mx > session.alarm_hw:
                session.alarm_hw = mx
                full_page = len(lst or []) >= 50
                if full_page and session.alarm_pages < 80:
                    session.alarm_pages += 1
                    nxt = {
                        "method": "getAlarmLog", "pid": session.mac_raw,
                        "params": {"limit": 50, "id": mx},
                        "msgId": str(int(time.time() * 1000)), "uid": session.uid,
                    }
                    try:
                        asyncio.create_task(session.inject(nxt))
                    except RuntimeError:
                        pass
                else:
                    session.alarm_pages = 0
        return

    # ── Operation log (getDevOpLog response) — same cursor paging as alarms.
    # Drives the auto-mode climate accessories' on/off (opType 1 = on, absent =
    # off), which getDevSta never reports for the OFF. (v3.19.146)
    if method == "getDevOpLog":
        from .normalizer import decode_oplog
        d_op = data.get("data", {})
        events = decode_oplog(d_op)
        apply = getattr(mqtt_client, "apply_oplog", None)
        if apply is not None and events:
            apply(session.mac_raw, events)
        lst = d_op.get("list") if isinstance(d_op, dict) else None
        ids = [a.get("id") for a in (lst or []) if isinstance(a.get("id"), int)]
        if ids:
            mx = max(ids)
            if mx > session.oplog_hw:
                session.oplog_hw = mx
                full_page = len(lst or []) >= 50
                if full_page and session.oplog_pages < 80:
                    session.oplog_pages += 1
                    nxt = {
                        "method": "getDevOpLog", "pid": session.mac_raw,
                        "params": {"limit": 50, "id": mx},
                        "msgId": str(int(time.time() * 1000)), "uid": session.uid,
                    }
                    try:
                        asyncio.create_task(session.inject(nxt))
                    except RuntimeError:
                        pass
                else:
                    session.oplog_pages = 0
        return

    # getSysSta carries the controller's own "sys" block (firmware, uptime,
    # Wi-Fi rssi/isConnect). It's not a device-state frame, so it's excluded
    # below — but decode its sys block here and cache the values on the bus so
    # the card header can show online + signal strength WITHOUT creating any
    # diagnostic entities (no entity subscribes; the alarm_settings sensor reads
    # the cache and exposes them as attributes).
    if method == "getSysSta":
        d0 = data.get("data", {})
        sysb = d0.get("sys") if isinstance(d0, dict) else None
        if isinstance(sysb, dict) and sysb:
            from .normalizer import _decode_sys
            out: dict = {}
            _decode_sys(out, session.mac, sysb)
            for topic, val in out.items():
                mqtt_client.publish(topic, val, retain=True, qos=0)
        return

    if method not in ("getDevSta", "getConfigField", "getConfigFile"):
        return



    # Update UID from device messages
    uid = data.get("uid", "")
    if uid and session.uid != uid:
        session.uid = uid

    d = data.get("data", {})

    # ── alarmLast: latest alarm pushed passively in every getDevSta ───────
    if method == "getDevSta":
        al = d.get("alarmLast") if isinstance(d, dict) else None
        if isinstance(al, dict) and al.get("epoch") is not None:
            from .normalizer import _decode_alarm_entry
            entry = _decode_alarm_entry(al)
            apply = getattr(mqtt_client, "apply_alarms", None)
            if apply is not None and entry:
                apply(session.mac_raw, [entry])
        # oplogLast: latest device operation, pushed the same way (v3.19.42).
        ol = d.get("oplogLast") if isinstance(d, dict) else None
        if isinstance(ol, dict) and ol.get("epoch") is not None:
            from .normalizer import _decode_oplog_entry
            entry = _decode_oplog_entry(ol)
            apply = getattr(mqtt_client, "apply_oplog", None)
            if apply is not None and entry:
                apply(session.mac_raw, [entry])
        # plan: live grow-plan progress pushed in every getDevSta while a plan
        # runs (isPlanRun, current stageId, planted/remaining/total days, and
        # progress %). Feeds the card's Planting Plan view — the controller
        # computes the day counts, so no opaque stage-date decoding needed. (v3.19.150)
        pl = d.get("plan") if isinstance(d, dict) else None
        if isinstance(pl, dict):
            prog = {
                "running": bool(pl.get("isPlanRun")),
                "stageId": pl.get("stageId"),
                "totalDays": pl.get("planedTotalDays"),
                "planted": pl.get("planedDays"),
                "remain": pl.get("planRemainDays"),
                "progress": pl.get("planProgress"),
            }
            applyp = getattr(mqtt_client, "apply_plan_progress", None)
            if applyp is not None:
                applyp(session.mac_raw, prog)

    # ── Device type detection (evidence accumulated across frames) ────────
    if method == "getDevSta":
        now = time.monotonic()
        if session.frames_seen == 0:
            session.first_frame_at = now
        session.frames_seen += 1
        present = {k for k, v in d.items() if v}
        # Field-level tokens for air sensors (v3.2.3): co2 etc. exist only
        # when that probe is physically attached, so each field is its own
        # evidence token. Plain "sensor" stays for type detection.
        #
        # v3.19.28: some controllers (AC5/AC10 run direct, without a CB/DP)
        # emit a FULL air-sensor block of all zeros even with no probe attached
        # — {"temp":0,"humi":0,"co2":0,"vpd":0,"ppfd":0,...}. Presence of the
        # keys then created phantom Temperature/Humidity/CO2/VPD/PPFD entities.
        # A real ambient probe always reports a non-zero temperature or
        # humidity, so gate the whole air-sensor block on that before trusting
        # any of its fields as evidence.
        sensor_block = d.get("sensor")
        if isinstance(sensor_block, dict) and _air_sensor_live(sensor_block):
            present |= {
                f"sensor:{k}"
                for k in ("temp", "humi", "co2", "vpd", "ppfd",
                          "isDaySensor", "isDayEnvTarget")
                if k in sensor_block
            }
        # Standalone SE-series lights (pcode 1005) report a FLAT schema —
        # top-level brightness/mode/pwm plus a lightModel marker, no CB
        # blocks at all. The marker is unambiguous, so it is its own token
        # (added even when the value is 0 — presence is the signal).
        if "lightModel" in d:
            present.add("selight")
        new_blocks = present - session.evidence
        session.evidence.update(new_blocks)
        if new_blocks and session.device_type and session.device_cfg:
            blocks_cb = getattr(session.mqtt_client, "blocks_seen", None)
            if blocks_cb is not None:
                blocks_cb(session.mac_raw, new_blocks, session.device_cfg)
        outlet_block = d.get("outlet", {})
        if isinstance(outlet_block, dict):
            for k in outlet_block:
                if k.startswith("O") and k[1:].isdigit():
                    n = int(k[1:])
                    if n not in session.outlets_seen:
                        session.outlets_seen.add(n)
                        session.max_outlet_seen = max(session.max_outlet_seen, n)
                        # Evidence-based outlet creation (v3.0.11): entities
                        # exist only for outlet numbers the device actually
                        # reports. Also covers late arrivals (new device
                        # plugged in after pruning).
                        if session.device_type and session.device_cfg:
                            seen_cb = getattr(
                                session.mqtt_client, "outlet_seen", None
                            )
                            if seen_cb is not None:
                                seen_cb(session.mac_raw, n, session.device_cfg)

        detected, conclusive = _classify_evidence(
            session.evidence, session.max_outlet_seen
        )
        waited_enough = (
            session.frames_seen >= _DETECT_MIN_FRAMES
            or (now - session.first_frame_at) >= _DETECT_MAX_WAIT_SEC
        )

        if session.device_type is None:
            if detected and (conclusive or waited_enough):
                session.device_type = detected
                session.type_conclusive = conclusive
                session.device_cfg = {
                    "mac":  session.mac_raw,
                    "type": detected.upper(),
                    # No friendly_name — falls back to the "{Type} {last4}" default
                }
                _LOGGER.info(
                    "[%s] device type detected: %s (%s, %d frames)",
                    session.mac, detected.upper(),
                    "conclusive" if conclusive else "tentative",
                    session.frames_seen,
                )
                DIAG.detection(
                    session.mac,
                    f"type={detected} conclusive={conclusive} "
                    f"frames={session.frames_seen} evidence={sorted(session.evidence)} "
                    f"outlets={sorted(session.outlets_seen)}",
                )
                session.ensure_discovery()
                # Flush evidence gathered before the type was known
                blocks_cb = getattr(session.mqtt_client, "blocks_seen", None)
                if blocks_cb is not None:
                    blocks_cb(session.mac_raw, session.evidence, session.device_cfg)
                seen_cb = getattr(session.mqtt_client, "outlet_seen", None)
                if seen_cb is not None:
                    for n in sorted(session.outlets_seen):
                        seen_cb(session.mac_raw, n, session.device_cfg)
        elif (
            not session.type_conclusive
            and detected
            and detected != session.device_type
        ):
            # Tentative type contradicted by stronger evidence — retype.
            # (e.g. a light-only or outlet-only start turned out to be a CB,
            # or a PS5 revealed outlet 6+.)
            _LOGGER.warning(
                "[%s] evidence contradicts tentative type %s — retyping to %s",
                session.mac, session.device_type.upper(), detected.upper(),
            )
            DIAG.detection(
                session.mac,
                f"RETYPE {session.device_type} -> {detected} "
                f"evidence={sorted(session.evidence)}",
            )
            session.device_type = detected
            session.type_conclusive = conclusive
            session.device_cfg = {
                "mac":  session.mac_raw,
                "type": detected.upper(),
            }
            session._outlet_discovery_pruned = False
            retype = getattr(session.mqtt_client, "retype_device", None)
            if retype is not None:
                retype(session.device_cfg)
            else:
                session.ensure_discovery()
            # Re-flush evidence under the corrected type
            blocks_cb = getattr(session.mqtt_client, "blocks_seen", None)
            if blocks_cb is not None:
                blocks_cb(session.mac_raw, session.evidence, session.device_cfg)
            seen_cb = getattr(session.mqtt_client, "outlet_seen", None)
            if seen_cb is not None:
                for n in sorted(session.outlets_seen):
                    seen_cb(session.mac_raw, n, session.device_cfg)

    if session.device_type is not None and method == "getDevSta":
        session.ensure_discovery()

        if session.initial_poll_task is None:
            # Schedule initial config poll after 3s (once per session)
            async def _initial_poll():
                await asyncio.sleep(3)
                # Sync the controller clock to HA on connect so schedules and
                # cycle timers fire at the right wall-clock time. Replays the
                # timezone the app set, with a fresh UTC. It's a device write,
                # so honour the control-enable gate.
                try:
                    prox = getattr(mqtt_client, "proxy", None)
                    if prox is not None and getattr(prox, "allow_control", False):
                        tzcmd = prox.build_tz_sync_command(session)
                        if tzcmd is not None:
                            await session.inject(tzcmd)
                            await asyncio.sleep(0.5)
                except Exception:
                    pass
                if session.device_type == "se":
                    try:
                        await session.inject({
                            "method": "getConfigFile",
                            "pid":    session.mac_raw,
                            "msgId":  str(int(time.time() * 1000)),
                            "uid":    session.uid,
                        })
                    except Exception:
                        pass
                    return
                from .mitm_proxy import MITMProxy  # avoid circular at module level
                for keypath in (
                    ["device", "light"],  ["device", "light2"],
                    ["device", "fan"],    ["device", "blower"],
                    ["device", "heater"], ["device", "humidifier"],
                    ["device", "dehumidifier"], ["target"],
                ):
                    try:
                        await session.inject({
                            "method": "getConfigField",
                            "pid":    session.mac_raw,
                            "params": {"keyPath": keypath},
                            "msgId":  str(int(time.time() * 1000)),
                            "uid":    session.uid,
                        })
                    except Exception:
                        pass
                    await asyncio.sleep(0.5)
                # Pull the full config file once at connect so air/soil
                # calibration, substrate and soil names populate promptly
                # instead of waiting up to config_poll_interval (~10 min).
                if session.device_type in ("cb", "ps5", "ps10", "st"):
                    try:
                        await session.inject({
                            "method": "getConfigFile", "pid": session.mac_raw,
                            "msgId": str(int(time.time() * 1000)),
                            "uid": session.uid,
                        })
                    except Exception:
                        pass
                    # Backfill the alarm/notification history at connect. Seed
                    # the cursor from the high-water id (0 on a fresh session =
                    # full backfill); the response handler walks the pages
                    # forward until caught up (v3.19.50).
                    try:
                        await session.inject({
                            "method": "getAlarmLog", "pid": session.mac_raw,
                            "params": {"limit": 50, "id": session.alarm_hw},
                            "msgId": str(int(time.time() * 1000)),
                            "uid": session.uid,
                        })
                    except Exception:
                        pass
                    # Backfill the operation log too, so the auto-mode climate
                    # accessories' current on/off is known at connect. (v3.19.146)
                    try:
                        await session.inject({
                            "method": "getDevOpLog", "pid": session.mac_raw,
                            "params": {"limit": 50, "id": session.oplog_hw},
                            "msgId": str(int(time.time() * 1000)),
                            "uid": session.uid,
                        })
                    except Exception:
                        pass
                # Some controllers don't answer the first getConfigFile read, so
                # the Environment/Calibration/Alerts tabs showed defaults until
                # the ~10-min poll. Retry with backoff until the config caches
                # (env target / calibration / alarm thresholds) actually arrive.
                if session.device_type == "cb":
                    for delay in (8, 20, 45):
                        if session.env_cfg or session.cal_cfg or session.alarm_cfg:
                            break
                        await asyncio.sleep(delay)
                        if session.env_cfg or session.cal_cfg or session.alarm_cfg:
                            break
                        try:
                            await session.inject({
                                "method": "getConfigField", "pid": session.mac_raw,
                                "params": {"keyPath": ["target"]},
                                "msgId": str(int(time.time() * 1000)), "uid": session.uid,
                            })
                            await session.inject({
                                "method": "getConfigFile", "pid": session.mac_raw,
                                "msgId": str(int(time.time() * 1000)), "uid": session.uid,
                            })
                        except Exception:
                            pass

            session.initial_poll_task = asyncio.create_task(_initial_poll())

    # ── Cache device state ────────────────────────────────────────────────
    for module in ("light", "light2", "blower", "fan", "heater", "humidifier",
                   "dehumidifier", "outlet", "ps5", "ps10"):
        if module in d and isinstance(d[module], dict):
            session.device_state.setdefault(module, {}).update(d[module])
    for module in ("light", "light2"):
        if module in d and isinstance(d[module], dict):
            session.light_state.setdefault(module, {}).update(d[module])
    for module in ("fan", "blower"):
        if module in d and isinstance(d[module], dict):
            session.fan_state.setdefault(module, {}).update(d[module])
    for module in ("light", "light2", "fan", "blower", "heater", "humidifier"):
        if module in d and isinstance(d[module], dict):
            lvl = d[module].get("level", d[module].get("mLevel", 0))
            if isinstance(lvl, (int, float)) and lvl > 0:
                session.last_nonzero_level[module] = int(lvl)

    # ── Soil sensor discovery ─────────────────────────────────────────────
    # Only once the device type is known: tentatively-typed devices (PS
    # strips) have no device_cfg during the detection window, and consuming
    # probe ids then would permanently skip their entities (v3.3.3).
    if session.device_cfg:
        for s in d.get("sensors", []):
            sid = s.get("id")
            if sid and sid != "avg":
                note = getattr(mqtt_client, "note_soil_type", None)
                if note is not None and "mst_fw_ver" in s:
                    note(str(sid), s.get("mst_fw_ver"))
                if sid not in session._known_soil_ids:
                    session._known_soil_ids.add(sid)
                    publish_soil_sensor_discovery(
                        mqtt_client, session.mac_raw, str(sid), session.device_cfg
                    )

    # ── Outlet discovery pruning (evidence-based) ────────────────────────
    # Prune only from accumulated evidence (not the first partial frame) — a
    # partial frame would wipe real outlets. Prune only from accumulated
    # evidence, and only after the same stability window detection uses.
    if (
        not session._outlet_discovery_pruned
        and session.device_type
        and method == "getDevSta"
        and (
            session.frames_seen >= _DETECT_MIN_FRAMES
            or (time.monotonic() - session.first_frame_at) >= _DETECT_MAX_WAIT_SEC
        )
    ):
        caps = _capabilities(session.device_type)
        if caps["hasOutlets"]:
            max_outlet = (1 if session.device_type == "st"
                          else 10 if session.device_type in ("ps10", "cb") else 5)
            for n in range(1, max_outlet + 1):
                if n not in session.outlets_seen:
                    unpublish_outlet_discovery(mqtt_client, session.mac_raw, n)
            _LOGGER.info(
                "[%s] outlet discovery pruned to %s",
                session.mac, sorted(session.outlets_seen),
            )
        prune_cb = getattr(mqtt_client, "prune_blocks", None)
        if prune_cb is not None and session.device_cfg:
            prune_cb(session.mac_raw, session.evidence, session.device_cfg)
        session._outlet_discovery_pruned = True

    # ── Soil-probe app names (senConfig[].label) — read-only ──────────────
    # Gate on a known device type: these paths assign the device's logical slot
    # (via _type_for_mac), and a config/senConfig frame that arrives before
    # detection finishes would assign it from an unknown-type guess. Both PS
    # strips and CBs can carry soil probes, so there's no safe type guess —
    # wait until detection has set device_type (device_display is populated).
    if method in ("getConfigField", "getConfigFile") and session.device_type:
        _sen = _senconfig_from(d)
        if _sen:
            # Cache the full array so per-probe calibration/substrate writes
            # are read-modify-write and never wipe the other probes.
            session.senconfig = _sen
            _apply = getattr(mqtt_client, "apply_soil_labels", None)
            if _apply is not None:
                _apply(session.mac_raw, _sen)
        _cal = _calibration_from(d)
        if _cal:
            # Cache the whole calibration block for RMW air-cal writes.
            session.cal_cfg = dict(_cal)
            _acal = getattr(mqtt_client, "apply_air_calibration", None)
            if _acal is not None:
                _acal(session.mac_raw, _cal)
        _alarm = _alarm_from(d)
        if _alarm:
            # Cache the whole alarm block for RMW threshold writes.
            session.alarm_cfg = dict(_alarm)
            _aal = getattr(mqtt_client, "apply_alarm_settings", None)
            if _aal is not None:
                _aal(session.mac_raw, _alarm)
        # Grow-plan status (v3.19.149): surface plan_active + the stage list for
        # the card's Planting Plan view. ONLY from a full getConfigFile — the plan
        # block lives at configFile.plan and never appears in a targeted
        # getConfigField, so parsing those (which happen constantly: confirm polls,
        # module reads, app field reads) returned empty and wiped the cached stages
        # a second after getConfigFile populated them. (v3.19.152 fix — the stages
        # "dropping off" the card without a reboot.)
        if method == "getConfigFile":
            _cfp = d.get("configFile")
            if isinstance(_cfp, dict) and isinstance(_cfp.get("plan"), dict):
                # Cache the whole plan block so card plan edits are read-modify-
                # write (preserve each stage's light schedule / colour). (v3.19.156)
                session.plan_cfg = dict(_cfp["plan"])
            _plan_on, _plan_stages = _parse_plan(d)
            session.plan_active = _plan_on
            _pln = getattr(mqtt_client, "apply_plan", None)
            if _pln is not None:
                _cf = d.get("configFile")
                _has_plan = isinstance(_cf, dict) and ("plan" in _cf)
                # Show the Planting Plan tab on every environment-capable
                # controller (anything with a target block), even one that has
                # never had a plan, so a plan can be started from the card.
                _env_capable = isinstance(_cf, dict) and isinstance(_cf.get("target"), dict)
                _pln(session.mac_raw, _plan_on, _plan_stages, _has_plan or _env_capable)
        # Environment target block also arrives inside getConfigFile (not just a
        # targeted getConfigField ["target"]). Publish the base target as-is; it
        # is what the manual Environment editor uses when no plan is active.
        _tgt = _target_from(d)
        if _tgt:
            session.env_cfg = dict(_tgt)
            from .normalizer import normalize_target
            for topic, val in normalize_target(session.mac_raw, _tgt).items():
                mqtt_client.publish(topic, val, retain=True, qos=0)

    # ── Outlet config cache (v3.11.1a3): the whole ps5/ps10/outlet block
    # comes back from getConfigField ["device", <block>] as
    # data.<block>.O{n} = full config. Cache each so mode/sub-setting writes
    # are read-modify-write (never wipe the outlet's other settings).
    if method == "getConfigField":
        cfgd = d if isinstance(d, dict) else {}
        tgt = cfgd.get("target")
        if isinstance(tgt, dict):
            session.env_cfg = dict(tgt)
            from .normalizer import normalize_target
            for topic, val in normalize_target(session.mac_raw, tgt).items():
                mqtt_client.publish(topic, val, retain=True, qos=0)
        for block in ("ps5", "ps10", "outlet"):
            blk = cfgd.get(block)
            if not isinstance(blk, dict):
                continue
            for ok, ov in blk.items():
                if ok.startswith("O") and ok[1:].isdigit() and isinstance(ov, dict):
                    session.outlet_cfg[f"{block}/{ok}"] = dict(ov)
            # Resolve which device owns the HA entities: a CB's ps5/ps10
            # block belongs to the standalone strip of that type; a strip's
            # own "outlet" block belongs to itself.
            if block == "outlet":
                target_mac = session.mac_raw
                strip_type = session.device_type
            else:
                # ps5/ps10 block belongs to the standalone strip of that
                # type — resolve via the bus's proxy handle.
                prox = getattr(mqtt_client, "proxy", None)
                strip = prox._strip_session_for_type(block) if prox else None
                target_mac = strip.mac_raw if strip else None
                strip_type = block
            if not target_mac:
                continue
            # app -> HA: publish decoded state so the mode entities update
            from .normalizer import normalize_outlet_config
            for topic, val in normalize_outlet_config(target_mac, blk).items():
                mqtt_client.publish(topic, val, retain=True, qos=0)
            # drive dynamic visibility from the device's real modeType
            set_mode = getattr(mqtt_client, "set_outlet_mode_from_device", None)
            if set_mode is not None:
                for ok, ov in blk.items():
                    if ok.startswith("O") and ok[1:].isdigit() and isinstance(ov, dict):
                        n = int(ok[1:])
                        set_mode(target_mac, n, ov.get("modeType"),
                                 {"mac": target_mac, "type": strip_type})
        # The Indicator Light confirm poll is a *targeted* getConfigField
        # ["outlet","led"], so the device answers with a bare {"led": N} — no
        # "outlet" wrapper, so the block loop above misses it and the switch
        # stayed stale after a toggle. Drive it from the bare led here. (v3.19.112)
        if ("led" in cfgd
                and not any(k in cfgd for k in ("outlet", "ps5", "ps10"))):
            from .normalizer import normalize_outlet_config
            for topic, val in normalize_outlet_config(
                    session.mac_raw, {"led": cfgd["led"]}).items():
                mqtt_client.publish(topic, val, retain=True, qos=0)

    # ── SE light config file (schedule/sunrise) ──────────────────────────
    if method == "getConfigFile":
        cfg = d.get("configFile") if isinstance(d, dict) else None
        light_cfg = (cfg or {}).get("light")
        if isinstance(light_cfg, dict):
            session.se_config = dict(light_cfg)
            from .normalizer import normalize_se_configfile
            for topic, value in normalize_se_configfile(
                session.mac_raw, light_cfg
            ).items():
                mqtt_client.publish(topic, value, retain=True, qos=0)
        # The full config document also carries the controller's own
        # fan/blower/climate blocks (configFile.device.*) with the
        # authoritative modeType. Decode them so the mode selects sync from the
        # controller's real state on a full read (startup / reconnect), not
        # only on targeted getConfigField polls. normalize_config_response is
        # config-safe: it publishes mode / mode_set / run_mode / oscillation /
        # natural only — never on/off/level, which the live frames own. (v3.19.133)
        dev_blocks = (cfg or {}).get("device") if isinstance(cfg, dict) else None
        if isinstance(dev_blocks, dict):
            from .normalizer import normalize_config_response
            for topic, value in normalize_config_response(
                session.mac_raw, {"data": dev_blocks}
            ).items():
                mqtt_client.publish(topic, value, retain=True, qos=0)
        return

    # ── Normalise and publish state topics ────────────────────────────────
    is_config_resp = (method == "getConfigField")
    if is_config_resp:
        # Config responses carry shakeLevel/natural and the authoritative
        # modeType for fans and climate accessories (config responses were
        # these frames, leaving those sensors stale/unknown).
        from .normalizer import normalize_config_response
        for topic, value in normalize_config_response(session.mac_raw, data).items():
            mqtt_client.publish(topic, value, retain=True, qos=0)
    else:
        normalized = normalize_status(
            session.mac, data, mac=session.mac_raw, fan_cache=session.fan_state,
            light_cache=session.light_state, climate_cache=session.device_state,
        )
        for topic, value in normalized.items():
            mqtt_client.publish(topic, value, retain=True, qos=0)
