"""
Device frame normalizer.

Turns a controller's reported JSON (getDevSta / getConfigField / getConfigFile)
into a flat map of ``ggs/ha/{mac}/{field}/state`` -> value strings that the HA
entity layer consumes. Every mapping here reflects an observed field meaning in
the Spider Farmer GGS protocol (documented in docs/OUTLET_MODES_WIRE.md and the
project's own packet captures); the topic strings are this integration's
internal entity interface.
"""
from __future__ import annotations

import json
import re
from typing import Any, Dict, Optional

from ..tempunits import (
    abs_bound,
    c_to_disp,
    cdelta_to_disp,
    unit as _temp_unit,
)

# Truthy encodings the controllers use for on/off style fields.
_TRUE = {1, True, "1", "true", "on"}


def _on(val) -> bool:
    return val in _TRUE


def _mac(mac_raw: str) -> str:
    """Canonical MAC: lowercase, no separators."""
    return mac_raw.replace(":", "").replace("-", "").lower()


def _num(block: dict, *keys, default=0):
    """First present key among ``keys`` (handles the mOnOff/on and
    mLevel/level naming pairs the firmware uses interchangeably)."""
    for k in keys:
        if k in block:
            return block[k]
    return default


def _sec_to_hhmm(sec: Any) -> str:
    try:
        sec = int(sec) % 86400
    except (ValueError, TypeError):
        sec = 0
    return f"{sec // 3600:02d}:{(sec % 3600) // 60:02d}"


def _sec_to_hhmmss(sec: Any) -> str:
    """Duration as HH:MM:SS (fan cycle run/off durations, not a clock time)."""
    try:
        sec = max(0, int(sec))
    except (ValueError, TypeError):
        sec = 0
    return f"{sec // 3600:02d}:{(sec % 3600) // 60:02d}:{sec % 60:02d}"


# weekmask bit -> day: bit0=Sun, bit1=Mon, … bit6=Sat (confirmed from app logs:
# Mon/Wed/Fri = 42 = bits 1,3,5; Sun/Tue/Thu/Sat = 85 = bits 0,2,4,6).
def _weekmask_to_days(wm: Any) -> list:
    try:
        wm = int(wm)
    except (ValueError, TypeError):
        wm = 127
    return [i for i in range(7) if wm & (1 << i)]


def _decode_se_periods(tp: Any) -> list:
    """Decode an SE-light timePeriod array into card-friendly period dicts:
    {enabled, days:[0-6], start:"HH:MM", end:"HH:MM", brightness, fade(min)}."""
    out = []
    if not isinstance(tp, list):
        return out
    for p in tp:
        if not isinstance(p, dict):
            continue
        try:
            bri = max(0, min(100, int(p.get("brightness", 0))))
        except (ValueError, TypeError):
            bri = 0
        try:
            fade = max(0, int(p.get("fadeTime", 0)) // 60)
        except (ValueError, TypeError):
            fade = 0
        out.append({
            "enabled": 1 if p.get("enabled", 1) else 0,
            "days": _weekmask_to_days(p.get("weekmask", 127)),
            "start": _sec_to_hhmm(p.get("startTime", 0)),
            "end": _sec_to_hhmm(p.get("endTime", 0)),
            "brightness": bri,
            "fade": fade,
        })
    return out


# devType / alarmType are numeric enums surfaced with a best-effort label.
# All labels below are CONFIRMED by exact-timestamp correlation of the app's
# Notification screen against the wire alarm log (2026-07-25 and 2026-07-26
# captures): every metric name and the humidifier/dehumidifier water messages
# matched the app to the second.
#   dev1 Air Temp   dev2 Humidity   dev3 VPD   dev5 CO2
#   dev6 Soil Temp  dev7 WC         dev8 Soil EC
#   dev26 Dehumidification (alarmType 5 = water tank full)
#   dev27 Humidification   (alarmType 4 = out of water)
# Raise/restore entries alternate; a restore carries no alarmType and reads
# "Restoring normal". Non-threshold alarmTypes: 3 = a device-offline condition
# ("<device> Current device is offline"), 4/5 = humidifier/dehumidifier water,
# 6 = light over-temperature. Devices that go offline are named by devType:
# 16 = Temperature & Humidity Sensor, 19 = Soil Sensor (both confirmed via app).
# devType 17 & 18 are the two internal modules of the "4-in-1 Sensor": both fire
# alarmType 3 (offline) together, which the SF app logs as a single "4-in-1
# Sensor Current device is offline" (confirmed 2026-07-28, app + card at
# 18:52:50 alongside devType 19 = Soil Sensor). devType 20 = Light 1, whose
# alarmType 6 is "The light temperature is too high" (confirmed 2026-07-27).
_ALARM_DEVTYPE = {
    1: "Air Temp",                        # confirmed (app)
    2: "Humidity",                        # confirmed (app)
    3: "VPD",                             # confirmed (app)
    5: "CO2",                             # confirmed (app)
    6: "Soil Temp",                       # confirmed (app "Soil Temperature")
    7: "WC",                              # confirmed (app "WC")
    8: "Soil EC",                         # confirmed (app "Soil EC")
    16: "Temperature & Humidity Sensor",  # confirmed (app, offline alarm)
    17: "4-in-1 Sensor",                  # confirmed (app, offline alarm 2026-07-28)
    18: "4-in-1 Sensor",                  # confirmed (app, offline alarm 2026-07-28)
    19: "Soil Sensor",                    # confirmed (app, offline alarm)
    20: "Light 1",                        # confirmed (app, over-temp alarm)
    26: "Dehumidification",               # confirmed (app)
    27: "Humidification",                 # confirmed (app)
}
_ALARM_TYPE = {
    1: "Above threshold",                   # confirmed (app)
    2: "Below threshold",                   # confirmed (app)
    3: "Current device is offline",         # confirmed (app, devType 16/19)
    4: "Humidifier is out of water",        # confirmed (app, devType 27)
    5: "Dehumidifier water tank is full",   # confirmed (app, devType 26)
    6: "The light temperature is too high",  # confirmed (app, devType 20)
}


def _alarm_iso(epoch: Any) -> Optional[str]:
    try:
        from datetime import datetime, timezone
        return datetime.fromtimestamp(int(epoch), tz=timezone.utc).isoformat()
    except (ValueError, TypeError, OSError, OverflowError):
        return None


def _decode_alarm_entry(a: Any) -> Optional[dict]:
    """One alarm-log entry {id, epoch, devType, alarmType} -> card/HA dict."""
    if not isinstance(a, dict):
        return None
    dt = a.get("devType")
    at = a.get("alarmType")
    return {
        "id": a.get("id"),
        "epoch": a.get("epoch"),
        "time": _alarm_iso(a.get("epoch")),
        "devType": dt,
        "device": _ALARM_DEVTYPE.get(dt, f"Device {dt}" if dt is not None else None),
        "alarmType": at,
        # No alarmType on the wire == the metric returned to normal.
        "alarm": ("Restoring normal" if at is None
                  else _ALARM_TYPE.get(at, f"Alarm {at}")),
    }


def decode_alarm_log(data: Any) -> list:
    """getAlarmLog response data {count, list:[…]} -> list of decoded entries."""
    lst = data.get("list") if isinstance(data, dict) else None
    return [e for e in (_decode_alarm_entry(a) for a in (lst or [])) if e]


# Alarm-threshold metrics: (wire key, label, unit, kind, is_temp, step).
# kind: "range" = min+max, "max" = max only. Temp values are °C on the wire.
_ALARM_CLIMATE = [
    ("temp", "Air Temp", "°F", "range", True, 1),
    ("humi", "Air Humi", "%", "range", False, 1),
    ("vpd", "VPD", "kPa", "range", False, 0.1),
    ("co2", "CO2", "ppm", "range", False, 10),
    # PPFD carries only vmax on the wire (no vmin), but the alarm block accepts a
    # vmin in the same read-modify-write shape every other metric uses, so the
    # Alerts tab now offers a Min as well (v3.19.53). A device that doesn't act
    # on a low-PPFD alarm simply won't fire it; the value still round-trips.
    ("ppfd", "PPFD", "µmol/m²/s", "range", False, 10),
]
_ALARM_SUBSTRATE = [
    ("tempSoil", "Soil Temp", "°F", "range", True, 1),
    ("humiSoil", "WC", "%", "range", False, 1),
    ("ECSoil", "Soil EC", "mS/cm", "range", False, 0.1),
]
_ALARM_OTHER = [
    ("devOffline", "Device Offline"),
    ("dehumiWaterFull", "Dehumidifier Water Full"),
    ("lightTemp", "Light Over-Temperature"),
    ("humiWaterLess", "Humidifier Water Low"),
]


def _alarm_c2f(v: Any):
    # Absolute wire °C -> display unit; keep the original value on a bad input.
    r = c_to_disp(v)
    return r if r is not None else v


def _decode_alarm_metric(spec, alarm):
    key, label, unit, kind, is_temp, step = spec
    b = alarm.get(key)
    if not isinstance(b, dict):
        return None
    conv = _alarm_c2f if is_temp else (lambda x: x)
    # Temperature metrics carry the live display unit (°F / °C); others fixed.
    m = {"key": key, "label": label, "unit": _temp_unit() if is_temp else unit,
         "kind": kind, "step": step, "is_temp": bool(is_temp),
         "enabled": 1 if b.get("enabled") else 0}
    if "vmax" in b:
        m["max"] = conv(b["vmax"])
    if kind == "range" and "vmin" in b:
        m["min"] = conv(b["vmin"])
    return m


def decode_alarm_settings(alarm: Any) -> Optional[dict]:
    """Decode the controller ``alarm`` block into card-friendly threshold
    groups (climate/substrate ranges + other on/off flags). Temps -> °F."""
    if not isinstance(alarm, dict):
        return None
    climate = [m for m in (_decode_alarm_metric(s, alarm) for s in _ALARM_CLIMATE) if m]
    substrate = [m for m in (_decode_alarm_metric(s, alarm) for s in _ALARM_SUBSTRATE) if m]
    other = [{"key": k, "label": lbl, "kind": "bool",
              "enabled": 1 if alarm.get(k) else 0}
             for k, lbl in _ALARM_OTHER if k in alarm]
    if not (climate or substrate or other):
        return None
    return {"climate": climate, "substrate": substrate, "other": other}


def _decode_outlet_periods(tp: Any) -> list:
    """Decode an outlet Time Slot timePeriod array (fixed 12 slots, on/off only,
    no brightness) into the ENABLED periods the card edits:
    {days:[0-6], start:"HH:MM", end:"HH:MM"}."""
    out = []
    if not isinstance(tp, list):
        return out
    for p in tp:
        if not isinstance(p, dict) or not p.get("enabled"):
            continue
        out.append({
            "days": _weekmask_to_days(p.get("weekmask", 127)),
            "start": _sec_to_hhmm(p.get("startTime", 0)),
            "end": _sec_to_hhmm(p.get("endTime", 0)),
        })
    return out


def _alarm(block: dict) -> bool:
    try:
        return bool(int(block.get("alarm", 0) or 0))
    except (ValueError, TypeError):
        return False


# ── Enumerated field decodes ────────────────────────────────────────────────
# Fan / blower operating mode (modeType); the Environment variants differ by
# which sensor(s) drive the automation.
_FAN_MODE_MAP = {
    None: "Manual", 0: "Manual",
    1: "Schedule", 2: "Cycle",
    3: "Environment: Temp only", 4: "Environment: Humi only",
    7: "Environment: Prioritize Temp", 8: "Environment: Prioritize Humi",
    13: "Environment: Temp & Humi",
}
# Simplified Fan Mode (card select) + the environment Run Mode sub-select.
_FAN_SIMPLE_MODE_MAP = {
    None: "Manual", 0: "Manual", 1: "Time Slot", 2: "Cycle",
    3: "Environment", 4: "Environment", 7: "Environment",
    8: "Environment", 13: "Environment",
}
_FAN_RUN_MODE_MAP = {
    7: "Prioritize temperature", 8: "Prioritize humidity",
    3: "Temperature only", 4: "Humidity only", 13: "Temperature & humidity",
}
# Climate accessory operating mode.
_CLIMATE_MODE_MAP = {None: "Manual", 1: "Time/Cycle", 4: "Environment"}
# Mode-aware select value per modeType. Manual/Time Slot/Cycle are the confirmed
# universal enums; heater uses "Temperature" (3), dehumidifier "Humidity" (4).
_CLIMATE_MODE_SET_MAP = {0: "Manual", 1: "Time Slot", 2: "Cycle",
                         3: "Temperature", 4: "Humidity"}


def _decode_climate_config(out, e, field, mod, cache):
    """Emit the mode-aware config topics (mode_set, schedule, cycle) for a
    heater/dehumidifier. Config-only fields fall back to the cached block so
    they don't sit on 'unknown' between config frames."""
    def val(key):
        v = mod.get(key)
        return v if v is not None else (cache or {}).get(key)

    mt = val("modeType")
    if mt is not None:
        out[f"ggs/ha/{e}/{field}_mode_set/state"] = \
            _CLIMATE_MODE_SET_MAP.get(int(mt), "Manual")
    tp = val("timePeriod")
    if isinstance(tp, list) and tp:
        out[f"ggs/ha/{e}/{field}_schedule_start/state"] = _sec_to_hhmm(tp[0].get("startTime", 0))
        out[f"ggs/ha/{e}/{field}_schedule_stop/state"] = _sec_to_hhmm(tp[0].get("endTime", 0))
    ct = val("cycleTime")
    if isinstance(ct, dict) and ct:
        out[f"ggs/ha/{e}/{field}_cycle_start/state"] = _sec_to_hhmm(ct.get("startTime", 0))
        out[f"ggs/ha/{e}/{field}_cycle_run/state"] = _sec_to_hhmmss(ct.get("openDur", 0))
        out[f"ggs/ha/{e}/{field}_cycle_off/state"] = _sec_to_hhmmss(ct.get("closeDur", 0))
        out[f"ggs/ha/{e}/{field}_cycle_times/state"] = str(int(ct.get("times", 1) or 1))
# Standalone SE light mode field.
_SE_MODE_LABELS = {0: "Manual", 1: "Automatic", 2: "Automatic (Standby)"}
# Outlet mode config decodes.
_OUTLET_TYPE_TO_MODE = {
    0: "Manual", 1: "Time Slot", 2: "Cycle", 3: "Temperature",
    4: "Humidity", 5: "CO2", 14: "Drip Irrigation",
}
_OUTLET_TEMP = {1: "Heating", 2: "Cooling"}
_OUTLET_HUMI = {1: "Humidifying", 2: "Dehumidifying"}
_OUTLET_CO2 = {1: "Aeration", 2: "Exhaust"}


def normalize_status(
    device_id: str,
    data: Dict[str, Any],
    mac: str = "",
    fan_cache: Optional[Dict[str, dict]] = None,
    light_cache: Optional[Dict[str, dict]] = None,
    climate_cache: Optional[Dict[str, dict]] = None,
    **kwargs,   # tolerate extra keyword args from callers
) -> Dict[str, str]:
    """Decode one live status frame into topic -> value pairs."""
    out: Dict[str, str] = {}
    d = data.get("data", data)
    e = _mac(mac) if mac else device_id

    # Standalone SE-series light: a flat top-level schema (no CB blocks),
    # identified by the lightModel marker. Read-only decode, then done.
    if "lightModel" in d:
        try:
            br = max(0, min(100, int(d.get("brightness") or 0)))
        except (ValueError, TypeError):
            br = 0
        out[f"ggs/ha/{e}/se_brightness/state"] = str(br)
        out[f"ggs/ha/{e}/se_active/state"] = "ON" if br > 0 else "OFF"
        if "mode" in d:
            try:
                m = int(d.get("mode"))
            except (ValueError, TypeError):
                m = -1
            out[f"ggs/ha/{e}/se_mode/state"] = _SE_MODE_LABELS.get(
                m, f"Mode {d.get('mode')}"
            )
        return out

    _decode_air(out, e, d.get("sensor", {}))
    _decode_sys(out, e, d.get("sys", {}))
    for module, num in (("light", 1), ("light2", 2)):
        _decode_light(out, e, num, d.get(module, {}),
                      (light_cache or {}).get(module, {}))
    _decode_blower(out, e, d.get("blower", {}), (fan_cache or {}).get("blower", {}))
    _decode_fan(out, e, d.get("fan", {}), (fan_cache or {}).get("fan", {}))
    _decode_outlets(out, e, d.get("outlet", {}))
    _decode_soil(out, e, d.get("sensors", []))
    _decode_humidifier(out, e, d.get("humidifier", {}))
    _decode_dehumidifier(out, e, d.get("dehumidifier", {}))
    _decode_heater(out, e, d.get("heater", {}))
    cc = climate_cache or {}
    _decode_climate_config(out, e, "heater", d.get("heater", {}), cc.get("heater", {}))
    _decode_climate_config(out, e, "dehumidifier", d.get("dehumidifier", {}),
                           cc.get("dehumidifier", {}))
    _decode_climate_config(out, e, "humidifier", d.get("humidifier", {}),
                           cc.get("humidifier", {}))
    return out


def _decode_sys(out, e, sys_block):
    """System/health block (v3.19.42): firmware version, uptime, and link
    status. Reported by controllers in the ``sys`` top-level block."""
    if not isinstance(sys_block, dict) or not sys_block:
        return
    ver = sys_block.get("ver")
    if ver not in (None, ""):
        out[f"ggs/ha/{e}/fw_version/state"] = str(ver)
    if "upTime" in sys_block:
        try:
            out[f"ggs/ha/{e}/uptime/state"] = str(int(sys_block["upTime"]))
        except (ValueError, TypeError):
            pass
    wifi = sys_block.get("wifi")
    if isinstance(wifi, dict):
        if "isConnect" in wifi:
            out[f"ggs/ha/{e}/wifi_connected/state"] = (
                "ON" if wifi.get("isConnect") else "OFF")
        if wifi.get("rssi") is not None:
            try:
                out[f"ggs/ha/{e}/wifi_rssi/state"] = str(int(wifi["rssi"]))
            except (ValueError, TypeError):
                pass
    eth = sys_block.get("eth")
    if isinstance(eth, dict) and "isConnect" in eth:
        out[f"ggs/ha/{e}/eth_connected/state"] = (
            "ON" if eth.get("isConnect") else "OFF")


def _decode_oplog_entry(a: Any) -> Optional[dict]:
    """One operation-log entry {id, epoch, opType, modeType, devType, subidx,
    env} -> HA dict. Codes are raw until label tables are captured."""
    if not isinstance(a, dict):
        return None
    return {
        "id": a.get("id"),
        "epoch": a.get("epoch"),
        "time": _alarm_iso(a.get("epoch")),
        "opType": a.get("opType"),
        "modeType": a.get("modeType"),
        "devType": a.get("devType"),
        "subidx": a.get("subidx"),
        "env": a.get("env"),
    }


def _decode_air(out, e, sensor):
    for src, field in (("temp", "temperature"), ("humi", "humidity"),
                       ("co2", "co2"), ("vpd", "vpd"), ("ppfd", "ppfd")):
        if src in sensor:
            out[f"ggs/ha/{e}/{field}/state"] = str(sensor[src])
    # Day/night flags (v3.19.41): isDaySensor = day as seen by the light
    # sensor; isDayEnvTarget = inside the environment day-cycle window.
    for src, field in (("isDaySensor", "is_day_sensor"),
                       ("isDayEnvTarget", "is_day_env_target")):
        if src in sensor:
            try:
                out[f"ggs/ha/{e}/{field}/state"] = (
                    "ON" if int(sensor[src]) else "OFF")
            except (ValueError, TypeError):
                pass


# Panel light modeType -> label (12 == PPFD).
_LIGHT_MODE_MAP = {0: "Manual", 1: "Time Slot", 12: "PPFD"}


def _decode_light(out, e, num, block, cache=None):
    cache = cache or {}
    if not block and not cache:
        return
    is_on = _on(_num(block, "mOnOff", "on"))
    level = _num(block, "mLevel", "level")
    if block:
        out[f"ggs/ha/{e}/light_{num}/state"] = json.dumps(
            {"state": "ON" if is_on else "OFF", "brightness": level}
        )
        # Brightness sensor reads 0 while the light is off.
        out[f"ggs/ha/{e}/light_{num}_brightness/state"] = str(level if is_on else 0)

    # Config-only extras (Mode, Go dark, Turn off, PPFD target). These arrive in
    # config responses, so fall back to the cached block to stay off "unknown".
    def val(key):
        return block.get(key, cache.get(key))

    mt = val("modeType")
    if mt is not None:
        out[f"ggs/ha/{e}/light_{num}_mode/state"] = _LIGHT_MODE_MAP.get(
            int(mt), f"Mode {mt}"
        )
    # Go dark / Turn off temperature thresholds. The device stores 0 (== below
    # the valid 15-50 °C / 59-122 °F range) for the disabled state; surface that
    # as "0" so the card's dropdown shows "Off". Threshold follows the unit.
    _floor = abs_bound(59)
    dark = val("darkTemp")
    if dark is not None:
        v = c_to_disp(dark)
        out[f"ggs/ha/{e}/light_{num}_go_dark/state"] = \
            str(v) if v is not None and v >= _floor else "0"
    off = val("offTemp")
    if off is not None:
        v = c_to_disp(off)
        out[f"ggs/ha/{e}/light_{num}_turn_off/state"] = \
            str(v) if v is not None and v >= _floor else "0"
    # Time Slot schedule (timePeriod[0]) — start/stop, target brightness, fade.
    tp = val("timePeriod")
    if isinstance(tp, list) and tp:
        t0 = tp[0]
        out[f"ggs/ha/{e}/light_{num}_schedule_start/state"] = _sec_to_hhmm(t0.get("startTime", 0))
        out[f"ggs/ha/{e}/light_{num}_schedule_stop/state"] = _sec_to_hhmm(t0.get("endTime", 0))
        out[f"ggs/ha/{e}/light_{num}_schedule_brightness/state"] = str(int(t0.get("brightness", 0) or 0))
        out[f"ggs/ha/{e}/light_{num}_fade/state"] = str(int(t0.get("fadeTime", 0) or 0) // 60)
    # PPFD schedule (ppfdPeriod[0]) — start/stop, target PPFD, fade.
    pp = val("ppfdPeriod")
    if isinstance(pp, list) and pp:
        p0 = pp[0]
        out[f"ggs/ha/{e}/light_{num}_ppfd_target/state"] = str(int(p0.get("brightness", 0) or 0))
        out[f"ggs/ha/{e}/light_{num}_ppfd_start/state"] = _sec_to_hhmm(p0.get("startTime", 0))
        out[f"ggs/ha/{e}/light_{num}_ppfd_stop/state"] = _sec_to_hhmm(p0.get("endTime", 0))
        out[f"ggs/ha/{e}/light_{num}_ppfd_fade/state"] = str(int(p0.get("fadeTime", 0) or 0) // 60)
    # PPFD dimming range (min/max brightness the PPFD loop stays within).
    pmin = val("ppfdMinBrightness")
    if pmin is not None:
        out[f"ggs/ha/{e}/light_{num}_ppfd_min/state"] = str(int(pmin or 0))
    pmax = val("ppfdMaxBrightness")
    if pmax is not None:
        out[f"ggs/ha/{e}/light_{num}_ppfd_max/state"] = str(int(pmax or 0))


def _decode_blower(out, e, block, cache=None):
    if not block:
        return
    cache = cache or {}
    is_on = _on(_num(block, "mOnOff", "on"))
    level = _num(block, "mLevel", "level")
    pct = level if is_on else 0
    out[f"ggs/ha/{e}/blower/state"] = json.dumps(
        {"state": "ON" if is_on else "OFF", "percentage": pct}
    )
    out[f"ggs/ha/{e}/blower_speed/state"] = str(pct)
    out[f"ggs/ha/{e}/blower_mode/state"] = _FAN_MODE_MAP.get(
        block.get("modeType"), "Manual"
    )

    # ── Mode-aware config fields (arrive in config responses; fall back to the
    # cached blower block so they don't sit on "unknown" between frames) ──
    def val(key):
        return block.get(key, cache.get(key))

    mt = val("modeType")
    if mt is not None:
        out[f"ggs/ha/{e}/blower_mode_set/state"] = _FAN_SIMPLE_MODE_MAP.get(int(mt), "Manual")
        if int(mt) in _FAN_RUN_MODE_MAP:
            out[f"ggs/ha/{e}/blower_run_mode/state"] = _FAN_RUN_MODE_MAP[int(mt)]
    ms = val("maxSpeed")
    if ms is not None:
        out[f"ggs/ha/{e}/blower_running_speed/state"] = str(int(ms or 0))
    mn = val("minSpeed")
    if mn is not None:
        out[f"ggs/ha/{e}/blower_standby_speed/state"] = str(int(mn or 0))
    # Always publish a definite ON/OFF so the switch renders as a toggle. An
    # absent closeCO2 (not reported yet) would leave the state "unknown", which
    # HA draws as two flash buttons instead of a toggle. Default OFF.
    out[f"ggs/ha/{e}/blower_close_co2/state"] = "ON" if _on(val("closeCO2")) else "OFF"
    tp = val("timePeriod")
    if isinstance(tp, list) and tp:
        out[f"ggs/ha/{e}/blower_schedule_start/state"] = _sec_to_hhmm(tp[0].get("startTime", 0))
        out[f"ggs/ha/{e}/blower_schedule_stop/state"] = _sec_to_hhmm(tp[0].get("endTime", 0))
    ct = val("cycleTime")
    if isinstance(ct, dict) and ct:
        out[f"ggs/ha/{e}/blower_cycle_start/state"] = _sec_to_hhmm(ct.get("startTime", 0))
        out[f"ggs/ha/{e}/blower_cycle_run/state"] = _sec_to_hhmmss(ct.get("openDur", 0))
        out[f"ggs/ha/{e}/blower_cycle_off/state"] = _sec_to_hhmmss(ct.get("closeDur", 0))
        out[f"ggs/ha/{e}/blower_cycle_times/state"] = str(int(ct.get("times", 1) or 1))


def _decode_fan(out, e, block, cache):
    if not block:
        return
    is_on = _on(_num(block, "mOnOff", "on"))
    level = _num(block, "mLevel", "level")
    # shakeLevel / natural often arrive only in config responses, so fall
    # back to the cached values to keep those entities off "unknown".
    shake_raw = block.get("shakeLevel", cache.get("shakeLevel"))
    natural_raw = block.get("natural", cache.get("natural"))
    shake = int(shake_raw or 0)
    natural = int(natural_raw or 0)
    gear = max(0, min(10, int(level or 0))) if is_on else 0
    out[f"ggs/ha/{e}/fan/state"] = json.dumps({
        "state": "ON" if is_on else "OFF",
        "percentage": gear,
        "oscillating": shake > 0,
        "natural_wind": natural > 0,
    })
    out[f"ggs/ha/{e}/fan_gear/state"] = str(gear)
    out[f"ggs/ha/{e}/fan_mode/state"] = _FAN_MODE_MAP.get(
        block.get("modeType"), "Manual"
    )
    if shake_raw is not None:
        out[f"ggs/ha/{e}/fan_oscillation/state"] = str(shake)
    # Always publish a definite ON/OFF so the Natural Wind switch is a toggle
    # (unknown would render as flash buttons). Default OFF.
    out[f"ggs/ha/{e}/fan_natural_wind/state"] = "ON" if _on(natural) else "OFF"

    # ── Mode-aware config fields (arrive in config responses; fall back to the
    # cached fan block so they don't sit on "unknown" between config frames) ──
    def val(key):
        return block.get(key, cache.get(key))

    mt = val("modeType")
    if mt is not None:
        out[f"ggs/ha/{e}/fan_mode_set/state"] = _FAN_SIMPLE_MODE_MAP.get(int(mt), "Manual")
        if int(mt) in _FAN_RUN_MODE_MAP:
            out[f"ggs/ha/{e}/fan_run_mode/state"] = _FAN_RUN_MODE_MAP[int(mt)]
    ms = val("maxSpeed")
    if ms is not None:
        out[f"ggs/ha/{e}/fan_schedule_gear/state"] = str(int(ms or 0))
    mn = val("minSpeed")
    if mn is not None:
        out[f"ggs/ha/{e}/fan_standby_speed/state"] = str(int(mn or 0))
    tp = val("timePeriod")
    if isinstance(tp, list) and tp:
        out[f"ggs/ha/{e}/fan_schedule_start/state"] = _sec_to_hhmm(tp[0].get("startTime", 0))
        out[f"ggs/ha/{e}/fan_schedule_stop/state"] = _sec_to_hhmm(tp[0].get("endTime", 0))
    ct = val("cycleTime")
    if isinstance(ct, dict) and ct:
        out[f"ggs/ha/{e}/fan_cycle_start/state"] = _sec_to_hhmm(ct.get("startTime", 0))
        out[f"ggs/ha/{e}/fan_cycle_run/state"] = _sec_to_hhmmss(ct.get("openDur", 0))
        out[f"ggs/ha/{e}/fan_cycle_off/state"] = _sec_to_hhmmss(ct.get("closeDur", 0))
        out[f"ggs/ha/{e}/fan_cycle_times/state"] = str(int(ct.get("times", 1) or 1))


def _decode_outlets(out, e, outlet):
    for key, val in outlet.items():
        if key.startswith("O") and key[1:].isdigit():
            n = int(key[1:])
            state = "ON" if _on(_num(val, "mOnOff", "on")) else "OFF"
            out[f"ggs/ha/{e}/outlet_{n}/state"] = state


def _decode_soil(out, e, sensors):
    for s in sensors:
        sid = s.get("id")
        if sid == "avg":
            if "tempSoil" in s:
                out[f"ggs/ha/{e}/soil_avg_temperature/state"] = str(s["tempSoil"])
            if "humiSoil" in s:
                out[f"ggs/ha/{e}/soil_avg_moisture/state"] = str(s["humiSoil"])
            if "ECSoil" in s:
                out[f"ggs/ha/{e}/soil_avg_ec/state"] = str(s["ECSoil"])
            continue
        if not sid:
            continue
        tag = re.sub(r"[^a-zA-Z0-9_]", "_", str(sid))
        if s.get("tempSoil") is not None:
            out[f"ggs/ha/{e}/soil_{tag}_temperature/state"] = str(s["tempSoil"])
        if s.get("humiSoil") is not None:
            out[f"ggs/ha/{e}/soil_{tag}_moisture/state"] = str(s["humiSoil"])
        if s.get("ECSoil") is not None:
            out[f"ggs/ha/{e}/soil_{tag}_ec/state"] = str(s["ECSoil"])


def _climate_on(mod):
    """Definite on/off for a climate accessory (heater/humidifier/dehumidifier).
    These blocks never carry an ``on`` field (unlike fan/light): config frames
    carry the ``mOnOff`` setpoint, live getDevSta frames carry the running
    ``level`` (>0 = on). A bare ``mLevel`` is the remembered setpoint, not the
    on/off state, so it defaults to off. Always returns a bool — never "unknown"
    (which left the switch stuck and HA drew it as flash buttons instead of a
    toggle)."""
    if "mOnOff" in mod:
        return _on(mod.get("mOnOff"))
    if "on" in mod:
        return _on(mod.get("on"))
    if "level" in mod:
        return int(mod.get("level") or 0) > 0
    return False


def _decode_humidifier(out, e, mod):
    if not mod:
        return
    active = _climate_on(mod)
    level = int(_num(mod, "mLevel", "level") or 0)
    out[f"ggs/ha/{e}/humidifier_active/state"] = "ON" if active else "OFF"
    out[f"ggs/ha/{e}/humidifier_level/state"] = str(level) if active else "0"
    out[f"ggs/ha/{e}/humidifier_mode/state"] = _CLIMATE_MODE_MAP.get(
        mod.get("modeType"), "Manual"
    )
    # Alarm on a humidifier means the reservoir is dry.
    out[f"ggs/ha/{e}/humidifier_water/state"] = "Empty" if _alarm(mod) else "Full"


def _decode_dehumidifier(out, e, mod):
    if not mod:
        return
    active = _climate_on(mod)
    level = int(_num(mod, "mLevel", "level") or 0)
    out[f"ggs/ha/{e}/dehumidifier_active/state"] = "ON" if active else "OFF"
    out[f"ggs/ha/{e}/dehumidifier_level/state"] = (
        {0: "Low", 1: "High"}.get(level, "Off") if active else "Off"
    )
    out[f"ggs/ha/{e}/dehumidifier_mode/state"] = _CLIMATE_MODE_MAP.get(
        mod.get("modeType"), "Manual"
    )
    # Alarm on a dehumidifier means the collection tank is full.
    out[f"ggs/ha/{e}/dehumidifier_tank/state"] = "Full" if _alarm(mod) else "Empty"


def _decode_heater(out, e, mod):
    if not mod:
        return
    active = _climate_on(mod)
    level = int(_num(mod, "mLevel", "level") or 0)
    out[f"ggs/ha/{e}/heater_active/state"] = "ON" if active else "OFF"
    out[f"ggs/ha/{e}/heater_level/state"] = str(level)
    out[f"ggs/ha/{e}/heater_mode/state"] = _CLIMATE_MODE_MAP.get(
        mod.get("modeType"), "Manual"
    )
    out[f"ggs/ha/{e}/heater_status/state"] = "Alarm" if _alarm(mod) else "OK"


def normalize_config_response(mac: str, data: Dict[str, Any]) -> Dict[str, str]:
    """Decode a getConfigField response for the few fields that only appear
    there — fan shakeLevel/natural and the fan/climate modeType. Deliberately
    avoids on/off/level/brightness topics, which the live status frames own."""
    out: Dict[str, str] = {}
    e = _mac(mac)
    d = data.get("data", data)

    for module, mode_field in (("fan", "fan_mode"), ("blower", "blower_mode")):
        block = d.get(module, {})
        if not isinstance(block, dict) or not block:
            continue
        if "modeType" in block:
            out[f"ggs/ha/{e}/{mode_field}/state"] = _FAN_MODE_MAP.get(
                block.get("modeType"), "Manual"
            )
        if module == "fan":
            if "shakeLevel" in block:
                out[f"ggs/ha/{e}/fan_oscillation/state"] = str(
                    int(block.get("shakeLevel") or 0)
                )
            if "natural" in block:
                out[f"ggs/ha/{e}/fan_natural_wind/state"] = (
                    "ON" if int(block.get("natural") or 0) else "OFF"
                )

    for module in ("heater", "humidifier", "dehumidifier"):
        block = d.get(module, {})
        if isinstance(block, dict) and block and "modeType" in block:
            out[f"ggs/ha/{e}/{module}_mode/state"] = _CLIMATE_MODE_MAP.get(
                block.get("modeType"), "Manual"
            )
    return out


def normalize_se_configfile(mac: str, light_cfg: Dict[str, Any]) -> Dict[str, str]:
    """SE light getConfigFile -> schedule / fade state topics."""
    e = _mac(mac)
    out: Dict[str, str] = {}
    tp = light_cfg.get("timePeriod") or [{}]
    # Full multi-period schedule (weekday-aware) for the light card.
    out[f"ggs/ha/{e}/se_schedule/state"] = json.dumps(_decode_se_periods(tp))
    tp0 = tp[0] if isinstance(tp, list) and tp else {}
    if not isinstance(tp0, dict):
        return out
    out[f"ggs/ha/{e}/se_schedule_start/state"] = _sec_to_hhmm(tp0.get("startTime", 0))
    out[f"ggs/ha/{e}/se_schedule_end/state"] = _sec_to_hhmm(tp0.get("endTime", 0))
    try:
        out[f"ggs/ha/{e}/se_schedule_brightness/state"] = str(
            max(0, min(100, int(tp0.get("brightness", 0))))
        )
    except (ValueError, TypeError):
        pass
    try:
        out[f"ggs/ha/{e}/se_sunrise_minutes/state"] = str(
            max(0, int(tp0.get("fadeTime", 0)) // 60)
        )
    except (ValueError, TypeError):
        pass
    return out


def _c_to_f(c):
    # Absolute wire °C -> display unit (°F imperial / °C metric); name kept.
    return c_to_disp(c)


def _cdelta_to_f(c):
    # Temperature difference wire °C -> display unit (no +32 offset); name kept.
    return cdelta_to_disp(c, 0)


def normalize_target(mac: str, target: Dict[str, Any]) -> Dict[str, str]:
    """Environment 'target' block -> env entity state topics. Temperatures
    are converted degC (wire) -> degF (display, matching the SF app)."""
    e = _mac(mac)
    out: Dict[str, str] = {}
    dt = target.get("dayTime", {})
    if isinstance(dt, dict):
        if "startTime" in dt:
            out[f"ggs/ha/{e}/env_day_start/state"] = _sec_to_hhmm(dt["startTime"])
        if "endTime" in dt:
            out[f"ggs/ha/{e}/env_day_end/state"] = _sec_to_hhmm(dt["endTime"])
    tmp = target.get("temp", {})
    if isinstance(tmp, dict):
        if "targetDay" in tmp and _c_to_f(tmp["targetDay"]) is not None:
            out[f"ggs/ha/{e}/env_temp_day/state"] = str(_c_to_f(tmp["targetDay"]))
        if "targetNight" in tmp and _c_to_f(tmp["targetNight"]) is not None:
            out[f"ggs/ha/{e}/env_temp_night/state"] = str(_c_to_f(tmp["targetNight"]))
        if "deadband" in tmp and _cdelta_to_f(tmp["deadband"]) is not None:
            out[f"ggs/ha/{e}/env_temp_deadband/state"] = str(_cdelta_to_f(tmp["deadband"]))
    for blk, pfx in (("humi", "env_humi"), ("co2", "env_co2")):
        b = target.get(blk, {})
        if not isinstance(b, dict):
            continue
        for src, dst in (("targetDay", "day"), ("targetNight", "night"),
                         ("deadband", "deadband")):
            if src in b:
                try:
                    out[f"ggs/ha/{e}/{pfx}_{dst}/state"] = str(int(round(float(b[src]))))
                except (ValueError, TypeError):
                    pass
    return out


def normalize_outlet_config(mac: str, block: Dict[str, Any]) -> Dict[str, str]:
    """Decode a ps5/ps10/outlet config block into the per-outlet mode entity
    topics so app-side changes flow back into HA."""
    e = _mac(mac)
    out: Dict[str, str] = {}
    for ok, o in block.items():
        if not (ok.startswith("O") and ok[1:].isdigit()) or not isinstance(o, dict):
            continue
        n = int(ok[1:])
        base = f"ggs/ha/{e}/outlet_{n}"
        if o.get("modeType") in _OUTLET_TYPE_TO_MODE:
            out[f"{base}_mode/state"] = _OUTLET_TYPE_TO_MODE[o["modeType"]]
        if o.get("tempAdd") in _OUTLET_TEMP:
            out[f"{base}_temp_device/state"] = _OUTLET_TEMP[o["tempAdd"]]
        if o.get("humiAdd") in _OUTLET_HUMI:
            out[f"{base}_humidity_device/state"] = _OUTLET_HUMI[o["humiAdd"]]
        if o.get("co2Add") in _OUTLET_CO2:
            out[f"{base}_co2_device/state"] = _OUTLET_CO2[o["co2Add"]]
        ct = o.get("cycleTime")
        if isinstance(ct, dict):
            if "startTime" in ct:
                out[f"{base}_cycle_start/state"] = _sec_to_hhmm(ct["startTime"])
            if "openDur" in ct:
                out[f"{base}_cycle_run/state"] = str(int(ct["openDur"]) // 60)
            if "closeDur" in ct:
                out[f"{base}_cycle_off/state"] = str(int(ct["closeDur"]) // 60)
            if "times" in ct:
                out[f"{base}_cycle_times/state"] = str(int(ct["times"]))
        tp = o.get("timePeriod")
        if isinstance(tp, list):
            # Full multi-slot Time Slot schedule for the card editor.
            out[f"{base}_ts_schedule/state"] = json.dumps(_decode_outlet_periods(tp))
            if tp and isinstance(tp[0], dict):
                t0 = tp[0]
                if "startTime" in t0:
                    out[f"{base}_ts_start/state"] = _sec_to_hhmm(t0["startTime"])
                if "endTime" in t0:
                    out[f"{base}_ts_stop/state"] = _sec_to_hhmm(t0["endTime"])
                if "weekmask" in t0:
                    out[f"{base}_ts_type/state"] = (
                        "Daily" if int(t0["weekmask"]) == 127 else "Custom"
                    )
    return out


# Retained for callers that optimistically publish after a command; the flat
# topic layout has no per-field sub-topics, so these are intentional no-ops.
def light_extras_topics(device_id: str, prefix: str, block: dict) -> dict:
    return {}


def fan_extras_topics(device_id: str, prefix: str, block: dict) -> dict:
    return {}
