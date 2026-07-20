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
# Climate accessory operating mode.
_CLIMATE_MODE_MAP = {None: "Manual", 1: "Time/Cycle", 4: "Environment"}
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
    for module, num in (("light", 1), ("light2", 2)):
        _decode_light(out, e, num, d.get(module, {}))
    _decode_blower(out, e, d.get("blower", {}))
    _decode_fan(out, e, d.get("fan", {}), (fan_cache or {}).get("fan", {}))
    _decode_outlets(out, e, d.get("outlet", {}))
    _decode_soil(out, e, d.get("sensors", []))
    _decode_humidifier(out, e, d.get("humidifier", {}))
    _decode_dehumidifier(out, e, d.get("dehumidifier", {}))
    _decode_heater(out, e, d.get("heater", {}))
    return out


def _decode_air(out, e, sensor):
    for src, field in (("temp", "temperature"), ("humi", "humidity"),
                       ("co2", "co2"), ("vpd", "vpd"), ("ppfd", "ppfd")):
        if src in sensor:
            out[f"ggs/ha/{e}/{field}/state"] = str(sensor[src])


def _decode_light(out, e, num, block):
    if not block:
        return
    is_on = _on(_num(block, "mOnOff", "on"))
    level = _num(block, "mLevel", "level")
    out[f"ggs/ha/{e}/light_{num}/state"] = json.dumps(
        {"state": "ON" if is_on else "OFF", "brightness": level}
    )
    # Brightness sensor reads 0 while the light is off.
    out[f"ggs/ha/{e}/light_{num}_brightness/state"] = str(level if is_on else 0)


def _decode_blower(out, e, block):
    if not block:
        return
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
    if natural_raw is not None:
        out[f"ggs/ha/{e}/fan_natural_wind/state"] = "ON" if _on(natural) else "OFF"


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


def _decode_humidifier(out, e, mod):
    if not mod:
        return
    active = _on(mod["on"]) if "on" in mod else False
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
    active = _on(mod["on"]) if "on" in mod else False
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
    level = int(_num(mod, "mLevel", "level") or 0)
    active = level > 0
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
    try:
        return round(float(c) * 9 / 5 + 32)
    except (ValueError, TypeError):
        return None


def _cdelta_to_f(c):
    try:
        return round(float(c) * 9 / 5)
    except (ValueError, TypeError):
        return None


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
        if isinstance(tp, list) and tp and isinstance(tp[0], dict):
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
