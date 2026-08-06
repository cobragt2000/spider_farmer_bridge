"""
HA command -> device payload translation.

Given a target field/value from Home Assistant, build the JSON control message
the GGS controller expects. Two payload shapes exist in the protocol:

  * ``setConfigField`` with a ``keyPath`` into the device config tree, used for
    lights, fans, blowers, climate accessories, and outlets.
  * flat ``setOnOff`` / ``setLight`` / ``setMode`` / ``setConfigFile`` messages
    used by the standalone SE-series lights.

Field encodings (modeType numbers, cycle/timePeriod layouts, device-type
selectors, the 11% panel floor) come from this project's own packet captures,
documented in docs/OUTLET_MODES_WIRE.md.
"""
import copy
import json
import logging
import re
import time
import uuid
from typing import Optional

from ..tempunits import disp_to_c, dispdelta_to_c

logger = logging.getLogger(__name__)

# Default single-entry weekmask for payloads that need a timePeriod present.
_TIME_PERIOD = [{"weekmask": 127}]

# LED panels won't dim below 11% (hardware floor across all models). On-levels
# below the floor are raised to it; a true 0 (off) is left alone.
LIGHT_MIN_PCT = 11

# ── Enumerated selectors ─────────────────────────────────────────────────────
# Fan preset mode label -> modeType (listed in SF-app order).
_FAN_MODE_TO_TYPE = {
    "Manual": 0,
    "Schedule": 1,
    "Cycle": 2,
    "Environment: Prioritize temperature": 7,
    "Environment: Prioritize humidity": 8,
    "Environment: Temperature only": 3,
    "Environment: Humidity only": 4,
    "Environment: Temperature & humidity": 13,
}
# Environment sub-mode label -> modeType (same numbers, no prefix).
_FAN_ENV_SUBMODE_TO_TYPE = {
    "Prioritize temperature": 7,
    "Prioritize humidity": 8,
    "Temperature only": 3,
    "Humidity only": 4,
    "Temperature & humidity": 13,
}
# Direct light control -> modeType. Mode 0 (Manual) is required for HA to
# override a stored schedule; the legacy alias is kept for old HA selects.
_LIGHT_EFFECT_TO_MODE = {
    "Manual": 0,
    "Schedule": 1,
    "PPFD": 12,
    "Modus: Manual / Timer": 0,
}
# Outlet mode name -> modeType.
_OUTLET_MODE_TO_TYPE = {
    "Manual": 0, "Time Slot": 1, "Cycle": 2, "Temperature": 3,
    "Humidity": 4, "CO2": 5, "Drip Irrigation": 14,
}
# Outlet device-type dropdowns -> field value.
_OUTLET_TEMP_DEVICE = {"Heating": 1, "Cooling": 2}
_OUTLET_HUMI_DEVICE = {"Humidifying": 1, "Dehumidifying": 2}
_OUTLET_CO2_DEVICE = {"Aeration": 1, "Exhaust": 2}

# Manual level ranges per climate accessory.
_CLIMATE_LEVEL_RANGE = {
    "heater": (1, 10), "humidifier": (1, 4), "dehumidifier": (0, 1),
}
# Climate accessory setting subfields handled by the climate-config write path.
_CLIMATE_SUBFIELDS = {
    "mode", "gear", "wind", "level",
    "schedule_start", "schedule_end",
    "cycle_start", "cycle_run", "cycle_off", "cycle_times",
    "apply_bundle",
}
# Climate Mode label -> modeType. Manual/Time Slot/Cycle are the universal GGS
# enums (confirmed from device config blocks). Temperature (heater) and Humidity
# (dehumidifier) are the device-specific env modes — best-guess (temp-only 3 /
# humidity-only 4, mirroring the fan) pending a confirmed packet capture.
_CLIMATE_MODE_TO_TYPE = {
    "Manual": 0, "Time Slot": 1, "Cycle": 2, "Temperature": 3, "Humidity": 4,
}
_CLIMATE_MODE_FROM_TYPE = {0: "Manual", 1: "Time Slot", 2: "Cycle",
                           3: "Temperature", 4: "Humidity"}

# Light setting subfields handled by the light-config write path.
_LIGHT_SUBFIELDS = {
    "mode",
    "dim_threshold", "off_threshold",
    "schedule_brightness", "schedule_start", "schedule_end", "fade_minutes",
    "ppfd_target", "ppfd_start", "ppfd_end", "ppfd_fade_minutes",
    "ppfd_min", "ppfd_max",
    "apply_bundle",
}
# Light Mode select label -> modeType (panel Light 1/2). 12 == PPFD.
_LIGHT_MODE_LABEL_TO_TYPE = {"Manual": 0, "Time Slot": 1, "PPFD": 12}
# Fan/blower setting subfields handled by the fan-config write path.
_FAN_SUBFIELDS = {
    "mode", "preset_mode", "env_submode",
    "schedule_start", "schedule_end",
    "schedule_speed", "standby_speed",
    "cycle_start", "cycle_run", "cycle_off",
    "cycle_run_minutes", "cycle_off_minutes",  # legacy aliases (minutes)
    "cycle_times",
    "oscillation_level", "natural_wind",
    "close_co2",                               # blower only
    "apply_bundle",
}
# Simplified Fan Mode select (card) -> modeType. "Environment" defaults to
# Prioritize-temperature (7); the Run Mode select refines the exact variant.
_FAN_SIMPLE_MODE_TO_TYPE = {"Manual": 0, "Time Slot": 1, "Cycle": 2, "Environment": 7}
_FAN_ENV_MODETYPES = (3, 4, 7, 8, 13)
# SE light schedule subfields (write via setConfigFile).
_SE_SCHED_SUBFIELDS = {
    "schedule_start", "schedule_end", "schedule_brightness", "sunrise_minutes",
}

# Full valid outlet object, used only when no cached config exists, so a
# write never sends a partial the controller would reject.
_OUTLET_DEFAULT = {
    "modeType": 0,
    "cycleTime": {"weekmask": 127, "startTime": 43200,
                  "openDur": 3600, "closeDur": 3600, "times": 1},
    "timePeriod": [{"enabled": 1, "weekmask": 127,
                    "startTime": 28800, "endTime": 72000}]
                  + [{"enabled": 0, "weekmask": 127} for _ in range(11)],
    "tempAdd": 1, "humiAdd": 1, "co2Add": 1, "mOnOff": 0,
    "addWater": {"time": 60},
}
# Full valid environment target block (captured default), used when the env
# cache is empty so a partial write can't send an invalid block.
_ENV_DEFAULT = {
    "dayTime": {"startTime": 27000, "endTime": 70200},
    "temp": {"targetDay": 22.2222, "targetNight": 22.2222, "deadband": 0.5556},
    "humi": {"targetDay": 55.0, "targetNight": 55.0, "deadband": 2.0},
    "co2": {"targetDay": 1200.0, "targetNight": 500.0, "deadband": 250.0},
}


def _f_to_c(f):
    # Absolute display-unit value -> °C wire value (identity when metric).
    return disp_to_c(f)


def _temp_threshold_c(value):
    """Go-dark / turn-off temperature threshold in °C. The card sends 0 (or
    'off') for the disabled state, which the device stores as darkTemp/offTemp
    == 0 — not a real 0 °F. Any other value is a °F temperature."""
    s = str(value).strip().lower()
    if s in ("", "off", "0", "0.0"):
        return 0
    return _f_to_c(value)


def _fdelta_to_c(f):
    # Display-unit difference -> °C wire delta (identity when metric).
    return dispdelta_to_c(f)


# Full valid SE light config, used when the SE config cache is empty.
_SE_DEFAULT_CONFIG = {
    "label": "light", "scroff": 0, "modeType": 1,
    "timePeriod": [{"enabled": 1, "weekmask": 127,
                    "startTime": 28800, "endTime": 72000,
                    "brightness": 50, "fadeTime": 0}],
}


# ── Small helpers ────────────────────────────────────────────────────────────
def _msg_id() -> str:
    """Unique message id: ms timestamp prefix (chronological in logs) plus
    random hex so two commands in the same millisecond can't collide."""
    return f"{int(time.time() * 1000)}{uuid.uuid4().hex[:8]}"


def _onoff(v) -> int:
    return 1 if str(v).upper() in ("ON", "1", "TRUE") else 0


def _light_pct(v, on_floor: bool = True) -> Optional[int]:
    """Clamp a light level to the panel's real range (11-100). Returns None
    on a non-numeric value."""
    try:
        v = int(float(v))
    except (ValueError, TypeError):
        return None
    v = min(100, v)
    return max(LIGHT_MIN_PCT, v) if on_floor else max(0, v)


def _hhmm_to_seconds(s) -> int:
    """'HH:MM' -> seconds since midnight; 0 on parse error."""
    try:
        parts = str(s).split(":")
        h = int(parts[0])
        m = int(parts[1]) if len(parts) > 1 else 0
        return (h * 3600 + m * 60) % 86400
    except (ValueError, IndexError):
        return 0


def _hms_to_seconds(value) -> int:
    """Duration to seconds. Accepts 'HH:MM:SS', 'HH:MM' (=> :00), or a bare
    number (already seconds). Raises ValueError on garbage so a bad value
    rejects the write rather than silently sending 0."""
    s = str(value).strip()
    if ":" in s:
        parts = [int(p) for p in s.split(":")]
        while len(parts) < 3:
            parts.append(0)
        h, m, sec = parts[0], parts[1], parts[2]
        return max(0, h * 3600 + m * 60 + sec)
    return max(0, int(float(s)))


def _field_of(block: dict, *keys, default=0):
    """First present key among ``keys`` (mOnOff/on, mLevel/level pairs)."""
    for k in keys:
        if k in block:
            return block[k]
    return default


# Device-reported *live* fields. They mirror the running state, not the stored
# setpoint (``on`` shadows ``mOnOff``; ``level`` shadows ``mLevel``). They leak
# into the read-modify-write cache from device echoes — and if we send them back
# in a setConfigField, ``on:1`` commands the accessory ON regardless of the
# manual setpoint. So a mode/settings change would spin the fan up. Strip them
# from every outgoing config block: only setpoints belong in a write.
_LIVE_FIELDS = ("on", "level")


def _strip_live(block: dict) -> dict:
    for k in _LIVE_FIELDS:
        block.pop(k, None)
    return block


def _config_field(mac: str, uid: str, root: str, module: str, obj: dict) -> dict:
    """A setConfigField message with a 2-level keyPath (root, module)."""
    return {
        "method": "setConfigField",
        "pid": mac,
        "params": {"keyPath": [root, module], module: obj},
        "msgId": _msg_id(),
        "uid": uid,
    }


def _flat(method: str, params: dict, mac: str, uid: str) -> dict:
    """A flat SE-light message (no keyPath)."""
    return {"method": method, "params": params, "msgId": _msg_id(),
            "pid": mac, "uid": uid}


# ── Public entry point ───────────────────────────────────────────────────────
def translate_command(
    field: str,
    value: str,
    mac: str,
    uid: str,
    outlet_num: Optional[int] = None,
    device_state: Optional[dict] = None,
    subfield: Optional[str] = None,
    last_nonzero_level: Optional[dict] = None,
    fan_state: Optional[dict] = None,
    light_state: Optional[dict] = None,
    se_config: Optional[dict] = None,
    outlet_block: str = "outlet",
    outlet_subfield: Optional[str] = None,
    outlet_cfg: Optional[dict] = None,
    env_cfg: Optional[dict] = None,
    cal_cfg: Optional[dict] = None,
    senconfig: Optional[list] = None,
) -> Optional[dict]:
    """Translate one HA command into a device message, or None if it maps to
    nothing sendable."""
    state = device_state or {}
    last = last_nonzero_level or {}

    if field == "se_light":
        return _cmd_se_light(mac, uid, value, subfield, se_config)
    if field == "se_mode":
        return _cmd_se_mode(mac, uid, value)

    if field == "indicator_light":
        # Strip status LED — top-level ["outlet","led"] = 0/1 (matches the app).
        return {"method": "setConfigField", "pid": mac,
                "params": {"keyPath": ["outlet", "led"], "led": _onoff(value)},
                "msgId": _msg_id(), "uid": uid}

    if outlet_num is not None:
        return _cmd_outlet(mac, uid, value, outlet_num, outlet_block,
                           outlet_subfield, outlet_cfg, state)

    if field in ("light", "light2"):
        return _cmd_light(mac, uid, field, value, subfield, state,
                          light_state or {}, last)

    if field in ("fan", "blower"):
        return _cmd_fan(mac, uid, field, value, subfield, state,
                        fan_state or {}, last)

    if field.startswith("env_"):
        return _cmd_env(mac, uid, field, value, env_cfg)

    if field.startswith("cal_"):
        return _cmd_air_cal(mac, uid, field, value, cal_cfg)
    if field.startswith("soil_") and ("_cal_" in field or field.endswith("_substrate")):
        return _cmd_soil_cfg(mac, uid, field, value, senconfig)

    if field in ("heater", "humidifier", "dehumidifier"):
        if subfield in _CLIMATE_SUBFIELDS:
            return _cmd_climate_config(mac, uid, field, value, subfield, state)
        if subfield is None:                     # plain on/off toggle
            return _cmd_climate_onoff(mac, uid, field, value, state, last)

    logger.warning("Unknown command field: %s subfield: %s", field, subfield)
    return None


# ── SE-series standalone light ───────────────────────────────────────────────
def _cmd_se_light(mac, uid, value, subfield, se_config):
    if subfield is None:
        return _flat("setOnOff", {"on": _onoff(value)}, mac, uid)
    if subfield == "brightness":
        v = _light_pct(value)            # 11% panel floor
        return _flat("setLight", {"brightness": v}, mac, uid) if v is not None else None
    if subfield in _SE_SCHED_SUBFIELDS:
        block = copy.deepcopy(se_config if se_config else _SE_DEFAULT_CONFIG)
        tp = block.setdefault("timePeriod", [])
        if not tp or not isinstance(tp[0], dict):
            tp.insert(0, dict(_SE_DEFAULT_CONFIG["timePeriod"][0]))
        tp0 = tp[0]
        if subfield == "schedule_start":
            tp0["startTime"] = _hhmm_to_seconds(value)
        elif subfield == "schedule_end":
            tp0["endTime"] = _hhmm_to_seconds(value)
        elif subfield == "schedule_brightness":
            lv = _light_pct(value)
            if lv is None:
                return None
            tp0["brightness"] = lv
        elif subfield == "sunrise_minutes":
            # One fadeTime drives both the sunrise and sunset ramp.
            try:
                tp0["fadeTime"] = max(0, min(30, int(float(value)))) * 60
            except (ValueError, TypeError):
                return None
        tp0.setdefault("enabled", 1)
        tp0.setdefault("weekmask", 127)
        return _flat("setConfigFile", {"configFile": {"light": block}}, mac, uid)
    logger.warning("Unknown se_light subfield: %s", subfield)
    return None


# day index (0=Sun … 6=Sat) -> weekmask bit (confirmed from app logs).
def _days_to_weekmask(days) -> int:
    wm = 0
    for d in days or []:
        try:
            i = int(d)
        except (ValueError, TypeError):
            continue
        if 0 <= i <= 6:
            wm |= 1 << i
    return wm or 127   # no days -> every day, so the period isn't a no-op


def build_se_schedule(mac, uid, periods, se_config):
    """Build a setConfigFile write for the SE light's FULL timePeriod array
    from the card's decoded period dicts
    ({enabled, days:[0-6], start:"HH:MM", end:"HH:MM", brightness, fade(min)}).
    Preserves label/scroff/modeType from the cached config."""
    if not isinstance(periods, list) or not periods:
        return None
    block = copy.deepcopy(se_config) if isinstance(se_config, dict) and se_config \
        else copy.deepcopy(_SE_DEFAULT_CONFIG)
    tp = []
    for p in periods:
        if not isinstance(p, dict):
            continue
        bri = _light_pct(p.get("brightness", 50))
        if bri is None:
            bri = 50
        try:
            fade = max(0, min(30, int(float(p.get("fade", 0))))) * 60
        except (ValueError, TypeError):
            fade = 0
        tp.append({
            "enabled": 1 if p.get("enabled", 1) else 0,
            "weekmask": _days_to_weekmask(p.get("days")),
            "startTime": _hhmm_to_seconds(p.get("start", "00:00")),
            "endTime": _hhmm_to_seconds(p.get("end", "00:00")),
            "brightness": bri,
            "fadeTime": fade,
        })
    if not tp:
        return None
    block["timePeriod"] = tp
    return _flat("setConfigFile", {"configFile": {"light": block}}, mac, uid)


def build_outlet_schedule(mac, uid, n, block, periods, outlet_cfg):
    """Build a setConfigField write for an outlet's Time Slot schedule — a
    fixed 12-slot, weekday-aware timePeriod array (on/off only, no brightness).
    Read-modify-write: the outlet's other settings (mode, device dropdowns,
    cycleTime …) are preserved. ``block`` is the routing block (ps5/ps10 for a
    CB-hosted strip, else "outlet")."""
    ok = f"O{n}"
    obj = copy.deepcopy(outlet_cfg) if isinstance(outlet_cfg, dict) and outlet_cfg \
        else copy.deepcopy(_OUTLET_DEFAULT)
    obj.pop("on", None)
    tp = []
    for p in (periods or [])[:12]:
        if not isinstance(p, dict):
            continue
        tp.append({
            "enabled": 1,
            "weekmask": _days_to_weekmask(p.get("days")),
            "startTime": _hhmm_to_seconds(p.get("start", "00:00")),
            "endTime": _hhmm_to_seconds(p.get("end", "00:00")),
        })
    while len(tp) < 12:            # device keeps a fixed 12-slot array
        tp.append({"enabled": 0, "weekmask": 127})
    obj["timePeriod"] = tp
    obj["modeType"] = 1           # Time Slot
    keypath = ["outlet", ok] if block == "outlet" else ["device", block, ok]
    return {"method": "setConfigField", "pid": mac,
            "params": {"keyPath": keypath, ok: obj},
            "msgId": _msg_id(), "uid": uid}


_ALARM_TEMP_KEYS = {"temp", "tempSoil"}
_ALARM_OTHER_KEYS = {"devOffline", "dehumiWaterFull", "lightTemp", "humiWaterLess"}


def build_alarm_settings(mac, uid, settings, alarm_cfg):
    """Read-modify-write the controller ``alarm`` threshold block from the
    card's decoded settings ({climate, substrate, other}). Temps are entered
    in °F and converted back to °C on the wire. keyPath ["alarm"]."""
    if not isinstance(settings, dict):
        return None
    obj = copy.deepcopy(alarm_cfg) if isinstance(alarm_cfg, dict) and alarm_cfg else {}
    for grp in ("climate", "substrate"):
        for m in (settings.get(grp) or []):
            if not isinstance(m, dict) or not m.get("key"):
                continue
            key = m["key"]
            b = obj.get(key)
            if not isinstance(b, dict):
                b = {}
                obj[key] = b
            conv = (lambda x: round(disp_to_c(x), 4)) \
                if key in _ALARM_TEMP_KEYS else (lambda x: x)
            if "enabled" in m:
                b["enabled"] = 1 if m["enabled"] else 0
            for src, dst in (("max", "vmax"), ("min", "vmin")):
                if src in m and m[src] is not None:
                    try:
                        b[dst] = conv(m[src])
                    except (ValueError, TypeError):
                        pass
    for m in (settings.get("other") or []):
        if isinstance(m, dict) and m.get("key") in _ALARM_OTHER_KEYS:
            obj[m["key"]] = 1 if m.get("enabled") else 0
    return {"method": "setConfigField", "pid": mac,
            "params": {"keyPath": ["alarm"], "alarm": obj},
            "msgId": _msg_id(), "uid": uid}


def _cmd_se_mode(mac, uid, value):
    mode = {"manual": 0, "automatic": 1, "0": 0, "1": 1}.get(
        str(value).strip().lower()
    )
    if mode is None:
        logger.warning("Unknown SE mode: %s", value)
        return None
    return _flat("setMode", {"mode": mode}, mac, uid)


# ── Outlets (PS5/PS10) ───────────────────────────────────────────────────────
def _cmd_outlet(mac, uid, value, n, block, sub, outlet_cfg, state):
    ok = f"O{n}"
    # A STANDALONE strip stores/controls its outlets under the TOP-LEVEL
    # "outlet" block — keyPath ["outlet","O{n}"] — which is what the SF app
    # sends and what the device actually acts on. A CB-HOSTED strip is driven
    # through the panel's device tree — keyPath ["device","ps5"/"ps10","O{n}"].
    # (v3.19.93: writing a standalone strip under ["device",...] saved the
    # config but never flipped the live outlet — confirmed from an app capture.)
    keypath = ["outlet", ok] if block == "outlet" else ["device", block, ok]

    def emit(obj):
        return {"method": "setConfigField", "pid": mac,
                "params": {"keyPath": keypath, ok: obj},
                "msgId": _msg_id(), "uid": uid}

    if sub is None:
        # Plain on/off: preserve cached config, force manual mode so a
        # scheduled outlet still obeys the toggle.
        obj = {}
        cached = state.get(block, {})
        if isinstance(cached, dict) and isinstance(cached.get(ok), dict):
            obj = {k: v for k, v in cached[ok].items() if k != "on"}
        obj["modeType"] = 0
        obj["mOnOff"] = _onoff(value)
        return emit(obj)

    # Sub-setting: read-modify-write the full outlet object. Start from the full
    # default (valid cycleTime + 12-slot timePeriod) and overlay the cached values,
    # so switching to a config mode ALWAYS sends a complete block. A minimal cache
    # (a Manual outlet reports just {modeType,mOnOff}) otherwise produced e.g.
    # {"modeType":2,"mOnOff":0} for a Cycle switch — no cycleTime — which the
    # firmware rejects, reverting the outlet to Manual. (v3.19.131)
    obj = copy.deepcopy(_OUTLET_DEFAULT)
    if isinstance(outlet_cfg, dict):
        obj.update(copy.deepcopy(outlet_cfg))
    obj.pop("on", None)

    if sub == "mode":
        mt = _OUTLET_MODE_TO_TYPE.get(str(value))
        if mt is None:
            logger.warning("Unknown outlet mode: %s", value)
            return None
        obj["modeType"] = mt
        # Force the outlet's manual setpoint off on a mode change so it stays
        # idle until the new mode's settings are configured and saved (the user
        # can turn it on / the schedule can take over afterward). Prevents a
        # stale schedule/level from activating the outlet the moment you switch.
        obj["mOnOff"] = 0
        return emit(obj)
    if _apply_outlet_subfield(obj, sub, value):
        return emit(obj)

    # Drip advanced config (sensor bind, periods, emergency) not yet modeled
    # as entities — stored in HA only.
    logger.info("outlet %s %s=%s stored in HA only (not yet modeled)",
                ok, sub, value)
    return None


def _apply_outlet_subfield(obj, sub, value) -> bool:
    """Apply one outlet config subfield into ``obj`` in place. Returns True when
    the field was recognised and applied, False for an unknown subfield or a bad
    value. Shared by the per-field write path and the atomic mode+config write."""
    try:
        if sub == "temp_device":
            v = _OUTLET_TEMP_DEVICE.get(str(value))
            if v is None:
                return False
            obj["tempAdd"] = v
            return True
        if sub == "humidity_device":
            v = _OUTLET_HUMI_DEVICE.get(str(value))
            if v is None:
                return False
            obj["humiAdd"] = v
            return True
        if sub == "co2_device":
            v = _OUTLET_CO2_DEVICE.get(str(value))
            if v is None:
                return False
            obj["co2Add"] = v
            return True
        if sub in ("cycle_start", "cycle_run", "cycle_off", "cycle_times"):
            ct = obj.setdefault("cycleTime", dict(_OUTLET_DEFAULT["cycleTime"]))
            ct.setdefault("weekmask", 127)
            if sub == "cycle_start":
                ct["startTime"] = _hhmm_to_seconds(value)
            elif sub == "cycle_run":
                ct["openDur"] = max(0, int(float(value))) * 60
            elif sub == "cycle_off":
                ct["closeDur"] = max(0, int(float(value))) * 60
            elif sub == "cycle_times":
                ct["times"] = max(1, min(100, int(float(value))))
            return True
        if sub in ("ts_start", "ts_stop", "ts_type"):
            tp = obj.setdefault("timePeriod", [])
            if not tp or not isinstance(tp[0], dict):
                tp.insert(0, {"enabled": 1, "weekmask": 127})
            tp0 = tp[0]
            tp0["enabled"] = 1
            tp0.setdefault("weekmask", 127)
            if sub == "ts_start":
                tp0["startTime"] = _hhmm_to_seconds(value)
            elif sub == "ts_stop":
                tp0["endTime"] = _hhmm_to_seconds(value)
            elif sub == "ts_type" and str(value) == "Daily":
                tp0["weekmask"] = 127        # Custom keeps the existing mask
            return True
    except (ValueError, TypeError):
        return False
    return False


def build_outlet_config(mac, uid, n, block, mode, config, outlet_cfg):
    """One atomic setConfigField that sets an outlet's mode AND its config fields
    (Cycle timings / device dropdown) together — so picking a mode and configuring
    it in the card commits in a single write instead of the two-step
    apply-then-configure. ``config`` maps card subfields -> values."""
    mt = _OUTLET_MODE_TO_TYPE.get(str(mode))
    if mt is None:
        return None
    ok = f"O{n}"
    obj = copy.deepcopy(_OUTLET_DEFAULT)
    if isinstance(outlet_cfg, dict) and outlet_cfg:
        obj.update(copy.deepcopy(outlet_cfg))
    obj.pop("on", None)
    obj["modeType"] = mt
    obj["mOnOff"] = 0
    for subf, val in (config or {}).items():
        _apply_outlet_subfield(obj, str(subf), val)
    keypath = ["outlet", ok] if block == "outlet" else ["device", block, ok]
    return {"method": "setConfigField", "pid": mac,
            "params": {"keyPath": keypath, ok: obj},
            "msgId": _msg_id(), "uid": uid}


# ── Lights ───────────────────────────────────────────────────────────────────
def _cmd_light(mac, uid, field, value, subfield, state, light_state, last):
    if subfield in _LIGHT_SUBFIELDS:
        return _cmd_light_config(mac, uid, field, value, subfield, state, light_state)

    # Direct on/off + brightness (+ optional mode effect).
    cur = state.get(field, {})
    try:
        cmd = json.loads(value)
    except (ValueError, TypeError):
        cmd = {"state": value}
    on = _onoff(cmd.get("state", "ON"))
    # A mode-only pick while the light is off would briefly flash it on;
    # keep it off and just record the mode.
    if ("effect" in cmd and "brightness" not in cmd
            and int(_field_of(cur, "on", "mOnOff")) == 0):
        on = 0
    if "brightness" in cmd:
        level = int(cmd["brightness"])
    else:
        level = int(_field_of(cur, "level", "mLevel"))
        if on == 1 and level == 0:       # OFF->ON restores last brightness
            level = int(last.get(field, 100))
    level = _light_pct(level, on_floor=(on == 1)) or 0
    # RMW the cached config block so a brightness/power change never drops the
    # light's PPFD / Time-Slot config set in the same Apply. (v3.19.126)
    cached = light_state.get(field)
    if cached:
        blk = _strip_live(dict(cached))
        blk["mOnOff"] = on
        blk["mLevel"] = level
        if "effect" in cmd:
            blk["modeType"] = _LIGHT_EFFECT_TO_MODE.get(
                cmd.get("effect"), blk.get("modeType", 0))
        return _config_field(mac, uid, "device", field, blk)
    return _config_field(mac, uid, "device", field, {
        "modeType": _LIGHT_EFFECT_TO_MODE.get(cmd.get("effect"), 0),
        "lastAutoModeType": cur.get("lastAutoModeType", 0),
        "mOnOff": on,
        "mLevel": level,
        "timePeriod": cur.get("timePeriod", _TIME_PERIOD),
    })


def _cmd_light_config(mac, uid, field, value, subfield, state, light_state):
    cached = light_state.get(field)
    if cached:
        block = dict(cached)
    else:
        cur = state.get(field, {})
        block = {
            "modeType": cur.get("modeType", 0),
            "lastAutoModeType": cur.get("lastAutoModeType", 0),
            "mOnOff": int(_field_of(cur, "on", "mOnOff")),
            "mLevel": int(_field_of(cur, "level", "mLevel")),
            "darkTemp": 0, "offTemp": 0,
            "timePeriod": [{"enabled": 1, "weekmask": 127, "startTime": 0,
                            "endTime": 0, "brightness": 0, "fadeTime": 0}],
            "ppfdPeriod": [{"enabled": 0, "weekmask": 127, "startTime": 0,
                            "endTime": 0, "brightness": 0, "fadeTime": 0}],
            "ppfdMinBrightness": 0, "ppfdMaxBrightness": 100,
        }

    try:
        if subfield == "apply_bundle":
            # Atomic multi-field commit from the card's Save button.
            payload = json.loads(value)
            if not isinstance(payload, dict):
                return None
            for k, v in payload.items():
                _apply_light_subfield(block, str(k), v)
        else:
            _apply_light_subfield(block, subfield, value)
    except (ValueError, TypeError):
        return None
    return _config_field(mac, uid, "device", field, _strip_live(block))


def _apply_light_subfield(block, subfield, value):
    """Apply one panel-light setting into ``block`` in place. Raises
    ValueError/TypeError on an unparseable value; unknown/invalid entries are
    ignored so a bundle tolerates stray keys."""
    def tp0():
        tp = block.setdefault("timePeriod", [{}])
        if not tp:
            tp.append({})
        return tp[0]

    def pp0():
        pp = block.setdefault("ppfdPeriod", [{}])
        if not pp:
            pp.append({})
        return pp[0]

    if subfield == "mode":
        mt = _LIGHT_MODE_LABEL_TO_TYPE.get(str(value), 0)
        block["modeType"] = mt
        if mt != 0:                       # remember the last non-manual mode
            block["lastAutoModeType"] = mt
    elif subfield == "dim_threshold":     # "Go dark" temp, wire is °C
        block["darkTemp"] = _temp_threshold_c(value)
    elif subfield == "off_threshold":     # "Turn off" temp, wire is °C
        block["offTemp"] = _temp_threshold_c(value)
    elif subfield == "schedule_brightness":
        lv = _light_pct(value)
        if lv is None:
            return
        tp0()["brightness"] = lv
    elif subfield == "schedule_start":
        tp0()["startTime"] = _hhmm_to_seconds(value)
    elif subfield == "schedule_end":
        tp0()["endTime"] = _hhmm_to_seconds(value)
    elif subfield == "fade_minutes":
        tp0()["fadeTime"] = max(0, int(float(value))) * 60
    elif subfield == "ppfd_target":
        pp0()["brightness"] = max(0, min(2000, int(float(value))))
    elif subfield == "ppfd_start":
        pp0()["startTime"] = _hhmm_to_seconds(value)
    elif subfield == "ppfd_end":
        pp0()["endTime"] = _hhmm_to_seconds(value)
    elif subfield == "ppfd_fade_minutes":
        pp0()["fadeTime"] = max(0, int(float(value))) * 60
    elif subfield == "ppfd_min":
        block["ppfdMinBrightness"] = max(0, min(100, int(float(value))))
    elif subfield == "ppfd_max":
        block["ppfdMaxBrightness"] = max(0, min(100, int(float(value))))


# ── Fans / blowers ───────────────────────────────────────────────────────────
def _cmd_fan(mac, uid, field, value, subfield, state, fan_state, last):
    if subfield in _FAN_SUBFIELDS:
        return _cmd_fan_config(mac, uid, field, value, subfield, state, fan_state)

    cur = state.get(field, {})
    # A bare power/percentage change must NOT drop the config-mode fields
    # (modeType/maxSpeed/minSpeed/closeCO2/schedule) set by the same Apply, so
    # read-modify-write the cached config block when we have one. _strip_live
    # removes live-only keys (on/level) so they never leak into the write.
    # Falls back to a minimal manual block only when nothing is cached. (v3.19.126)
    cached = fan_state.get(field)
    base = _strip_live(dict(cached)) if cached else None

    if subfield is None:
        on = _onoff(value)
        if base is not None:
            base["mOnOff"] = on
            if on == 1 and int(_field_of(base, "level", "mLevel", default=0)) == 0:
                base["mLevel"] = int(last.get(field, 50 if field == "blower" else 5))
            return _config_field(mac, uid, "device", field, base)
        level = int(_field_of(cur, "level", "mLevel"))
        if on == 1 and level == 0:
            level = int(last.get(field, 50 if field == "blower" else 5))
        obj = {"mOnOff": on, "mLevel": level, "natural": 0,
               "timePeriod": _TIME_PERIOD}
        if field == "fan":
            obj["shakeLevel"] = cur.get("shakeLevel", 0)
        return _config_field(mac, uid, "device", field, obj)

    if subfield == "percentage":
        hi = 100 if field == "blower" else 10
        try:
            level = max(1, min(hi, int(value)))
        except ValueError:
            return None
        if base is not None:
            base["mLevel"] = level
            base.setdefault("mOnOff", int(_field_of(cur, "on", "mOnOff", default=1)))
            return _config_field(mac, uid, "device", field, base)
        obj = {"mOnOff": _field_of(cur, "on", "mOnOff", default=1),
               "mLevel": level, "natural": 0, "timePeriod": _TIME_PERIOD}
        if field == "fan":
            obj["shakeLevel"] = cur.get("shakeLevel", 0)
        return _config_field(mac, uid, "device", field, obj)
    return None


def _cmd_fan_config(mac, uid, field, value, subfield, state, fan_state):
    cached = fan_state.get(field)
    if cached:
        block = dict(cached)
    else:
        cur = state.get(field, {})
        block = {
            "modeType": cur.get("modeType", 0),
            "mOnOff": int(_field_of(cur, "on", "mOnOff")),
            "mLevel": int(_field_of(cur, "level", "mLevel", default=1)),
            "shakeLevel": int(cur.get("shakeLevel", 0)),
            "natural": 0, "minSpeed": 0, "maxSpeed": 1,
            "timePeriod": [{"enabled": 1, "weekmask": 127,
                            "startTime": 0, "endTime": 0}],
            "cycleTime": {"weekmask": 127, "startTime": 0,
                          "openDur": 0, "closeDur": 0, "times": 1},
        }

    speed_max = 100 if field == "blower" else 10
    try:
        if subfield == "apply_bundle":
            # Atomic multi-field commit from the card's Save button: apply every
            # staged field into one block -> one setConfigField (no partial or
            # racy per-field writes).
            payload = json.loads(value)
            if not isinstance(payload, dict):
                return None
            for k, v in payload.items():
                _apply_fan_subfield(block, str(k), v, speed_max)
        else:
            _apply_fan_subfield(block, subfield, value, speed_max)
    except (ValueError, TypeError):
        return None

    # Every fan write must keep timePeriod[0].enabled = 1, else a schedule
    # seeded without it is treated as disabled until re-saved in the app.
    tp = block.get("timePeriod")
    if isinstance(tp, list) and tp and isinstance(tp[0], dict):
        tp[0].setdefault("enabled", 1)
        tp[0].setdefault("weekmask", 127)
    return _config_field(mac, uid, "device", field, _strip_live(block))


def _apply_fan_subfield(block, subfield, value, speed_max):
    """Apply one fan/blower setting into ``block`` in place. Raises
    ValueError/TypeError on an unparseable value; unknown subfields and unknown
    enum values are ignored (so a bundle tolerates stray keys)."""
    if subfield == "mode":
        if value == "Environment":
            # keep the current env submode if already environmental
            cur_mt = int(block.get("modeType", 0) or 0)
            block["modeType"] = cur_mt if cur_mt in _FAN_ENV_MODETYPES else 7
        else:
            block["modeType"] = _FAN_SIMPLE_MODE_TO_TYPE.get(value, 0)
    elif subfield == "preset_mode":
        mt = _FAN_MODE_TO_TYPE.get(value)
        if mt is None:
            logger.warning("Unknown fan preset_mode: %s", value)
            return
        block["modeType"] = mt
    elif subfield == "env_submode":
        mt = _FAN_ENV_SUBMODE_TO_TYPE.get(value)
        if mt is None:
            logger.warning("Unknown fan env_submode: %s", value)
            return
        block["modeType"] = mt
    elif subfield == "schedule_start":
        _fan_tp0(block)["startTime"] = _hhmm_to_seconds(value)
    elif subfield == "schedule_end":
        _fan_tp0(block)["endTime"] = _hhmm_to_seconds(value)
    elif subfield == "schedule_speed":
        # Active speed lives in different fields by mode; write both.
        v = max(1, min(speed_max, int(float(value))))
        block["maxSpeed"] = v
        block["mLevel"] = v
    elif subfield == "standby_speed":
        block["minSpeed"] = max(0, min(speed_max, int(float(value))))
    elif subfield == "cycle_start":
        block.setdefault("cycleTime", {"weekmask": 127})["startTime"] = \
            _hhmm_to_seconds(value)
    elif subfield == "cycle_run":            # HH:MM:SS duration -> seconds
        block.setdefault("cycleTime", {"weekmask": 127})["openDur"] = \
            _hms_to_seconds(value)
    elif subfield == "cycle_off":
        block.setdefault("cycleTime", {"weekmask": 127})["closeDur"] = \
            _hms_to_seconds(value)
    elif subfield == "cycle_run_minutes":    # legacy (minutes)
        block.setdefault("cycleTime", {"weekmask": 127})["openDur"] = \
            max(0, int(float(value))) * 60
    elif subfield == "cycle_off_minutes":
        block.setdefault("cycleTime", {"weekmask": 127})["closeDur"] = \
            max(0, int(float(value))) * 60
    elif subfield == "cycle_times":
        block.setdefault("cycleTime", {"weekmask": 127})["times"] = \
            max(1, min(100, int(float(value))))
    elif subfield == "oscillation_level":
        block["shakeLevel"] = max(0, min(10, int(float(value))))
    elif subfield == "natural_wind":
        block["natural"] = _onoff(value)
    elif subfield == "close_co2":         # blower: close CO2 device when running
        block["closeCO2"] = _onoff(value)


def _fan_tp0(block):
    tp = block.setdefault("timePeriod", [{}])
    if not tp:
        tp.append({})
    return tp[0]


# ── Climate accessories ──────────────────────────────────────────────────────
def _climate_level_value(field, value):
    """Clamp a climate level to its range. Dehumidifier accepts Low/High
    labels. Returns None if unparseable."""
    sv = str(value).strip().lower()
    if field == "dehumidifier" and sv in ("low", "high"):
        level = 0 if sv == "low" else 1
    else:
        try:
            level = int(float(value))
        except (ValueError, TypeError):
            return None
    lo, hi = _CLIMATE_LEVEL_RANGE[field]
    return max(lo, min(hi, level))


def _cmd_climate_level(mac, uid, field, value, state):
    level = _climate_level_value(field, value)
    if level is None:
        return None
    cur = state.get(field, {})
    # Setting a level does not toggle the accessory: mOnOff stays put. RMW the
    # cached block so modeType/schedule/cycle survive a level change in a config
    # mode (v3.19.126); fall back to a minimal block when nothing is cached.
    if cur:
        blk = _strip_live(dict(cur))
        blk["mLevel"] = level
        blk.setdefault("mOnOff", int(_field_of(cur, "on", "mOnOff")))
        blk.setdefault("timePeriod", _TIME_PERIOD)
        return _config_field(mac, uid, "device", field, blk)
    return _config_field(mac, uid, "device", field, _strip_live({
        "mOnOff": int(_field_of(cur, "on", "mOnOff")),
        "mLevel": level,
        "timePeriod": _TIME_PERIOD,
    }))


def _apply_climate_subfield(block, subfield, value, field):
    """Apply one heater/dehumidifier/humidifier setting into ``block``.
    Gear/Wind/Level all map to mLevel; schedule -> timePeriod; cycle ->
    cycleTime; mode -> modeType. Raises on unparseable values."""
    if subfield == "mode":
        block["modeType"] = _CLIMATE_MODE_TO_TYPE.get(str(value), 0)
    elif subfield in ("gear", "wind", "level"):
        lv = _climate_level_value(field, value)
        if lv is not None:
            block["mLevel"] = lv
    elif subfield == "schedule_start":
        _fan_tp0(block)["startTime"] = _hhmm_to_seconds(value)
    elif subfield == "schedule_end":
        _fan_tp0(block)["endTime"] = _hhmm_to_seconds(value)
    elif subfield == "cycle_start":
        block.setdefault("cycleTime", {"weekmask": 127})["startTime"] = \
            _hhmm_to_seconds(value)
    elif subfield == "cycle_run":
        block.setdefault("cycleTime", {"weekmask": 127})["openDur"] = \
            _hms_to_seconds(value)
    elif subfield == "cycle_off":
        block.setdefault("cycleTime", {"weekmask": 127})["closeDur"] = \
            _hms_to_seconds(value)
    elif subfield == "cycle_times":
        block.setdefault("cycleTime", {"weekmask": 127})["times"] = \
            max(1, min(100, int(float(value))))


def _cmd_climate_config(mac, uid, field, value, subfield, state):
    """Climate accessory mode/schedule/cycle/level write. Read-modify-write of
    the whole block so on/off, level, schedule and cycle are all preserved, and
    only the touched field(s) change. ``apply_bundle`` commits several at once."""
    cur = state.get(field, {})
    cur_tp = cur.get("timePeriod")
    tp0 = dict(cur_tp[0]) if isinstance(cur_tp, list) and cur_tp and \
        isinstance(cur_tp[0], dict) else {"enabled": 1, "weekmask": 127,
                                          "startTime": 0, "endTime": 0}
    cur_ct = cur.get("cycleTime")
    ct = dict(cur_ct) if isinstance(cur_ct, dict) and cur_ct else \
        {"weekmask": 127, "startTime": 0, "openDur": 0, "closeDur": 0, "times": 1}
    block = {
        "modeType": int(cur.get("modeType", 0) or 0),
        "mOnOff": int(_field_of(cur, "on", "mOnOff")),
        "mLevel": int(_field_of(cur, "level", "mLevel") or 0),
        "timePeriod": [tp0],
        "cycleTime": ct,
    }
    try:
        if subfield == "apply_bundle":
            payload = json.loads(value)
            if not isinstance(payload, dict):
                return None
            for k, v in payload.items():
                _apply_climate_subfield(block, str(k), v, field)
        else:
            _apply_climate_subfield(block, subfield, value, field)
    except (ValueError, TypeError):
        return None
    tp = block.get("timePeriod")
    if isinstance(tp, list) and tp and isinstance(tp[0], dict):
        tp[0].setdefault("enabled", 1)
        tp[0].setdefault("weekmask", 127)
    return _config_field(mac, uid, "device", field, _strip_live(block))


def _cmd_climate_onoff(mac, uid, field, value, state, last):
    cur = state.get(field, {})
    on = _onoff(value)
    level = int(_field_of(cur, "level", "mLevel") or 0)
    # Heater/humidifier treat level 0 as off, so ON with no level falls back
    # to the last running level (or the minimum). Dehumidifier 0 = Low, real.
    if on and level == 0 and field in ("heater", "humidifier"):
        level = int(last.get(field, 1) or 1)
    # RMW the cached block so a power toggle in a config mode (Time Slot / Cycle /
    # Temperature) keeps modeType/schedule/cycle instead of reverting to Manual.
    if cur:
        blk = _strip_live(dict(cur))
        blk["mOnOff"] = on
        blk["mLevel"] = level
        blk.setdefault("timePeriod", _TIME_PERIOD)
        return _config_field(mac, uid, "device", field, blk)
    return _config_field(mac, uid, "device", field, {
        "mOnOff": on,
        "mLevel": level,
        "timePeriod": _TIME_PERIOD,
    })


def _cmd_env(mac, uid, field, value, env_cfg):
    """Environment target write: read-modify-write the whole ["target"] block
    (degF inputs converted back to the wire's degC)."""
    obj = copy.deepcopy(env_cfg if isinstance(env_cfg, dict) else _ENV_DEFAULT)
    try:
        if field == "env_day_start":
            obj.setdefault("dayTime", {})["startTime"] = _hhmm_to_seconds(value)
        elif field == "env_day_end":
            obj.setdefault("dayTime", {})["endTime"] = _hhmm_to_seconds(value)
        elif field == "env_temp_day":
            obj.setdefault("temp", {})["targetDay"] = round(_f_to_c(value), 4)
        elif field == "env_temp_night":
            obj.setdefault("temp", {})["targetNight"] = round(_f_to_c(value), 4)
        elif field == "env_temp_deadband":
            obj.setdefault("temp", {})["deadband"] = round(_fdelta_to_c(value), 4)
        elif field == "env_humi_day":
            obj.setdefault("humi", {})["targetDay"] = float(value)
        elif field == "env_humi_night":
            obj.setdefault("humi", {})["targetNight"] = float(value)
        elif field == "env_humi_deadband":
            obj.setdefault("humi", {})["deadband"] = float(value)
        elif field == "env_co2_day":
            obj.setdefault("co2", {})["targetDay"] = float(value)
        elif field == "env_co2_night":
            obj.setdefault("co2", {})["targetNight"] = float(value)
        elif field == "env_co2_deadband":
            obj.setdefault("co2", {})["deadband"] = float(value)
        else:
            logger.warning("Unknown env field: %s", field)
            return None
    except (ValueError, TypeError):
        return None
    return {
        "method": "setConfigField", "pid": mac,
        "params": {"keyPath": ["target"], "target": obj},
        "msgId": _msg_id(), "uid": uid,
    }


# Substrate label -> device soilType index (must match entity_defs.SUBSTRATE_OPTIONS).
_SUBSTRATE_WRITE = {"Clay soil": 0, "Coco coir": 1, "Peat soil": 2}
_AIR_CAL_DEFAULT = {"temp": 0, "humi": 0, "co2": 0, "ppfd": 0}


def _cmd_air_cal(mac, uid, field, value, cal_cfg):
    """Air-sensor calibration write: read-modify-write the whole top-level
    ["calibration"] block {temp,humi,co2,ppfd}. Air-temp is a degF offset on
    the app, stored as degC on the wire; humi/co2/ppfd are direct."""
    obj = copy.deepcopy(cal_cfg if isinstance(cal_cfg, dict) else _AIR_CAL_DEFAULT)
    for k, dflt in _AIR_CAL_DEFAULT.items():
        obj.setdefault(k, dflt)
    try:
        v = float(value)
        if field == "cal_air_temp":
            obj["temp"] = round(_fdelta_to_c(v), 4)
        elif field == "cal_air_humidity":
            obj["humi"] = round(v, 1)
        elif field == "cal_ppfd":
            obj["ppfd"] = round(v, 1)
        elif field == "cal_co2":
            obj["co2"] = round(v)
        else:
            logger.warning("Unknown air-cal field: %s", field)
            return None
    except (ValueError, TypeError):
        return None
    return {
        "method": "setConfigField", "pid": mac,
        "params": {"keyPath": ["calibration"], "calibration": obj},
        "msgId": _msg_id(), "uid": uid,
    }


def _cmd_soil_cfg(mac, uid, field, value, senconfig):
    """Per-probe soil calibration / substrate write: read-modify-write the
    whole ["device","senConfig"] array so the other probes' settings are
    preserved. Refuses to write if the array hasn't been seen yet (a partial
    array would wipe the other probes)."""
    m = re.match(r"^soil_(.+?)_(cal_temp|cal_moisture|cal_ec|substrate)$", field)
    if not m:
        logger.warning("Unrecognized soil-cfg field: %s", field)
        return None
    if not isinstance(senconfig, list) or not senconfig:
        logger.warning("soil-cfg write for %s dropped: senConfig not cached yet", field)
        return None
    serial, kind = m.group(1), m.group(2)
    arr = copy.deepcopy(senconfig)
    entry = next(
        (e for e in arr if isinstance(e, dict)
         and str(e.get("id", "")).lower() == serial.lower()),
        None,
    )
    if entry is None:
        logger.warning("soil-cfg write: probe %s not in senConfig", serial)
        return None
    try:
        if kind == "substrate":
            idx = _SUBSTRATE_WRITE.get(str(value))
            if idx is None:
                logger.warning("Unknown substrate option: %r", value)
                return None
            entry["soilType"] = idx
        else:
            v = float(value)
            cal = dict(entry.get("calibration") or {})
            if kind == "cal_temp":
                cal["tempSoil"] = round(_fdelta_to_c(v), 4)
            elif kind == "cal_moisture":
                cal["humiSoil"] = round(v, 1)
            elif kind == "cal_ec":
                cal["ECSoil"] = round(v, 1)
            entry["calibration"] = cal
    except (ValueError, TypeError):
        return None
    return {
        "method": "setConfigField", "pid": mac,
        "params": {"keyPath": ["device", "senConfig"], "senConfig": arr},
        "msgId": _msg_id(), "uid": uid,
    }
