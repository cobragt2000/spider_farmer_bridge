"""
diag.py — Spider Farmer Bridge dedicated diagnostic log (v3.0.7)
================================================================
A self-contained, integration-owned log file, separate from HA's main log:

  • Toggle + path configurable in the integration's options (live, no reload)
  • Rotates daily at midnight; retention selectable 1-30 days in options
  • Writes happen on a QueueListener thread — never blocks the event loop

What it captures (the feature-hunting / debugging feed):
  • Session lifecycle: connects, CONNECT identity, detection evidence and
    decisions, retypes, disconnects
  • Per-frame summaries (method + blocks), full JSON for config responses
    and for any getDevSta whose block *structure* changed
  • NOVEL FIELDS: every field the controllers send that the normalizer does
    not currently consume, flagged once per (block, field) — this is the
    literal to-do list for feature additions
  • Observed app→device setConfigField commands (full params) — how new
    controls get reverse-engineered
  • Our own injects and echo-confirm polls
  • Contained frame-processing exceptions, with traceback

Access anywhere via the module singleton:  from ..diag import DIAG
Every hook is a no-op when disabled.
"""
from __future__ import annotations

import json
import logging
import logging.handlers
import os
import queue
import time
from datetime import datetime
from typing import Any, Optional

# Computed once per HA process (module import) — stable across config-entry
# reloads within one boot, fresh on a full HA restart. This is what gives
# one diagnostic file per running instance.
_BOOT_STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")


def per_boot_path(path: str, version: str) -> str:
    """Insert -{version}-{boot timestamp} before the extension:
    /config/sf/logs/diagnostic.log -> .../diagnostic-3.11.2b0-20260713-142530.log"""
    root, ext = os.path.splitext(path)
    ver = str(version or "dev").replace("/", "_").replace(" ", "")
    return f"{root}-{ver}-{_BOOT_STAMP}{ext or '.log'}"

_LOGGER = logging.getLogger(__name__)

# ── Known-schema table ────────────────────────────────────────────────────────
# Every field the normalizer/proxy currently consumes or knowingly ignores.
# Anything outside this table is NOVEL and gets flagged.
_KNOWN_FIELDS: dict[str, set] = {
    "sensor": {"temp", "humi", "co2", "vpd", "ppfd"},
    "light":  {"mOnOff", "on", "mLevel", "level", "modeType", "lastAutoModeType",
               "timePeriod", "alarm"},
    "light2": {"mOnOff", "on", "mLevel", "level", "modeType", "lastAutoModeType",
               "timePeriod", "alarm"},
    "fan":    {"mOnOff", "on", "mLevel", "level", "modeType", "shakeLevel",
               "natural", "timePeriod", "alarm", "maxSpeed", "minSpeed"},
    "blower": {"mOnOff", "on", "mLevel", "level", "modeType", "timePeriod",
               "alarm", "maxSpeed", "minSpeed"},
    "humidifier":   {"on", "mOnOff", "mLevel", "level", "modeType", "alarm"},
    "dehumidifier": {"on", "mOnOff", "mLevel", "level", "modeType", "alarm"},
    "heater":       {"on", "mOnOff", "mLevel", "level", "modeType", "alarm"},
    "_soil":  {"id", "tempSoil", "humiSoil", "ECSoil"},   # items of "sensors"
    "_outlet": {"mOnOff", "on", "modeType", "alarm"},     # values of outlet.O*
}
# Standalone SE-series lights report these as flat top-level fields
_SE_TOP_LEVEL = {
    "mode", "brightness", "isScreenOn", "isIoTx", "isIoRx",
    "adcLedDim", "adcUpDim", "adcDownDim", "pwm", "isUp",
    "isForceSlaveMode", "AutoModeCheck", "lastOnBrightness",
    "lastManualBrightness", "lightModel",
}
_KNOWN_BLOCKS = set(_KNOWN_FIELDS) | {"outlet", "sensors"} | _SE_TOP_LEVEL


class SfDiag:
    """Singleton diagnostic logger. All hooks no-op unless enabled."""

    def __init__(self) -> None:
        self.enabled: bool = False
        self._logger: Optional[logging.Logger] = None
        self._listener: Optional[logging.handlers.QueueListener] = None
        self._novel_seen: set = set()          # (block, field) already flagged
        self._frame_sigs: dict = {}            # mac -> {method: block signature}
        self.path: str = ""
        self.days: int = 0

    # ── Lifecycle ──────────────────────────────────────────────────────────

    def setup(self, path: str, days: int = 7) -> None:
        """(Re)start logging to `path`, rotating daily at midnight and
        keeping `days` (1-30) dated backups. Safe to call repeatedly."""
        self.shutdown()
        days = max(1, min(30, int(days)))
        try:
            os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
            file_handler = logging.handlers.TimedRotatingFileHandler(
                path, when="midnight", backupCount=days, encoding="utf-8"
            )
            file_handler.setFormatter(
                logging.Formatter("%(asctime)s %(levelname)s %(message)s")
            )
            q: queue.SimpleQueue = queue.SimpleQueue()
            self._listener = logging.handlers.QueueListener(
                q, file_handler, respect_handler_level=True
            )
            self._listener.start()

            lg = logging.getLogger("custom_components.sf.DIAGFILE")
            lg.setLevel(logging.DEBUG)
            lg.propagate = False               # never duplicate into HA's log
            for h in list(lg.handlers):
                lg.removeHandler(h)
            lg.addHandler(logging.handlers.QueueHandler(q))
            self._logger = lg
            self.path = path
            self.days = days
            self.enabled = True
            self._log(
                "INFO",
                f"==== SF diagnostic log started (daily rotation, "
                f"keep {days} days) ====",
            )
        except Exception as exc:
            _LOGGER.error("SF diagnostic log setup failed for %s: %s", path, exc)
            self.enabled = False

    def shutdown(self) -> None:
        if self._logger is not None:
            try:
                self._log("INFO", "==== SF diagnostic log stopped ====")
            except Exception:
                pass
        self.enabled = False
        if self._listener is not None:
            try:
                self._listener.stop()
            except Exception:
                pass
            self._listener = None
        self._logger = None

    def _log(self, level: str, msg: str) -> None:
        if self._logger is not None:
            self._logger.log(getattr(logging, level, logging.INFO), msg)

    @staticmethod
    def _j(obj: Any) -> str:
        try:
            return json.dumps(obj, separators=(",", ":"), default=str)
        except Exception:
            return repr(obj)

    # ── Hooks (all no-op when disabled) ────────────────────────────────────

    def session(self, mac: str, event: str, detail: str = "") -> None:
        if not self.enabled:
            return
        self._log("INFO", f"SESSION [{mac}] {event} {detail}".rstrip())

    def detection(self, mac: str, msg: str) -> None:
        if not self.enabled:
            return
        self._log("INFO", f"DETECT  [{mac}] {msg}")

    def frame(self, mac: str, topic_mac: str, pid: str, method: str,
              data: dict) -> None:
        """Per-frame summary + novel-field scan. Full JSON logged for config
        responses and whenever a getDevSta's block structure changes."""
        if not self.enabled:
            return
        d = data.get("data", {})
        blocks = sorted(d.keys()) if isinstance(d, dict) else [type(d).__name__]
        self._log(
            "DEBUG",
            f"FRAME   [{mac}] method={method} topic_mac={topic_mac or '?'} "
            f"pid={pid or '?'} blocks={blocks}",
        )
        if isinstance(d, dict):
            self._scan_novel(mac, d)

        # Structure-change / config-response full capture. Flat SE-light
        # frames (v3.10.1) also capture on VALUE changes — their key list
        # never varies, so brightness/mode changes were invisible before.
        sig = (method, tuple(blocks))
        if isinstance(d, dict) and "lightModel" in d:
            sig = sig + tuple(
                (k, d.get(k))
                for k in ("mode", "brightness", "pwm",
                          "lastOnBrightness", "lastManualBrightness")
            )
        sigs = self._frame_sigs.setdefault(mac, set())
        if method != "getDevSta" or sig not in sigs:
            sigs.add(sig)
            self._log("INFO", f"CAPTURE [{mac}] {method} full={self._j(data)}")

    def _scan_novel(self, mac: str, d: dict) -> None:
        for block, content in d.items():
            if block not in _KNOWN_BLOCKS:
                key = (block, "*")
                if key not in self._novel_seen:
                    self._novel_seen.add(key)
                    self._log(
                        "WARNING",
                        f"NOVEL   [{mac}] unknown top-level block '{block}' "
                        f"= {self._j(content)}",
                    )
                continue
            if block == "sensors" and isinstance(content, list):
                for item in content:
                    if isinstance(item, dict):
                        self._novel_fields(mac, "_soil", item)
            elif block == "outlet" and isinstance(content, dict):
                for oval in content.values():
                    if isinstance(oval, dict):
                        self._novel_fields(mac, "_outlet", oval)
            elif isinstance(content, dict):
                self._novel_fields(mac, block, content)

    def _novel_fields(self, mac: str, block: str, content: dict) -> None:
        known = _KNOWN_FIELDS.get(block, set())
        for field, value in content.items():
            if field in known:
                continue
            key = (block, field)
            if key in self._novel_seen:
                continue
            self._novel_seen.add(key)
            self._log(
                "WARNING",
                f"NOVEL   [{mac}] {block}.{field} = {self._j(value)} "
                f"(not consumed by the integration — feature candidate)",
            )

    def app_command(self, mac: str, keypath: Any, params: dict) -> None:
        """Observed cloud/app → device setConfigField (the FAN-CAPTURE feed)."""
        if not self.enabled:
            return
        self._log(
            "INFO",
            f"APPCMD  [{mac}] keyPath={self._j(keypath)} params={self._j(params)}",
        )

    def down_command(self, mac: str, method: str, body: dict) -> None:
        """v3.10.1: EVERY cloud/app -> device command, regardless of method.
        The SE4500 hunt showed why: only setConfigField was being logged, so
        an app command using any other method (setDevSta, setLight, ...)
        passed through the relay invisibly."""
        if not self.enabled:
            return
        self._log(
            "INFO",
            f"DOWNCMD [{mac}] method={method} full={self._j(body)}",
        )

    def inject(self, mac: str, payload: dict) -> None:
        if not self.enabled:
            return
        self._log("INFO", f"INJECT  [{mac}] {self._j(payload)}")

    def error(self, mac: str, msg: str, exc: Optional[BaseException] = None) -> None:
        if not self.enabled:
            return
        if exc is not None and self._logger is not None:
            self._logger.error(f"ERROR   [{mac}] {msg}", exc_info=exc)
        else:
            self._log("ERROR", f"ERROR   [{mac}] {msg}")

    def bus_event(self, msg: str) -> None:
        if not self.enabled:
            return
        self._log("INFO", f"BUS     {msg}")


DIAG = SfDiag()
