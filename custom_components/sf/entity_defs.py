"""
entity_defs.py — Spider Farmer Bridge (native entities)
========================================================
Every definition maps a device data block to its HA entities:

  • unique_id stems:  ggs_{mac}_{field}
  • entity names:     "Temperature", "Outlet 3", "Fan Speed", ...
  • device names:     "SF Display Panel 4E01", ...
  • entity_ids:       sensor.sf_dp1_temperature (slot-based)

The state "topics" (ggs/ha/{mac}/{field}/state) are internal state-bus keys
shared with proxy/normalizer.py.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field as dc_field
from typing import Optional

# ── Protocol constants ───────────────────────────────────────────────────────
HA_STATUS_TOPIC = "ggs/ha/status"

# Display labels shown in HA (device model / name). Distinct from the wire
# type codes (cb/ps5/ps10) the protocol uses, which never change.
_TYPE_LABELS = {
    "ps5":  "Power Strip AC5",
    "ps10": "Power Strip AC10",
    "cb":   "Display Panel",
    "lc":   "Light Controller",
    "se":   "SE Light",
}

# HA entity-id slot prefix per wire type. Also decoupled from the wire codes:
# a Display Panel's entities are sf_dp1_*, a strip's are sf_ac5_* / sf_ac10_*.
_SLOT_PREFIX = {"cb": "dp", "ps5": "ac5", "ps10": "ac10"}

_PRIMARY_TYPE = "cb"

_FAN_MODE_OPTIONS = [
    "Manual", "Schedule", "Cycle",
    "Environment: Temp only", "Environment: Humi only",
    "Environment: Prioritize Temp", "Environment: Prioritize Humi",
    "Environment: Temp & Humi",
]

_CLIMATE_MODE_OPTIONS = ["Manual", "Time/Cycle", "Environment"]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _mac(mac_raw: str) -> str:
    """Lowercase MAC without separators."""
    return mac_raw.replace(":", "").replace("-", "").lower()


def _mac_suffix(mac_raw: str) -> str:
    """Last 4 hex chars uppercase."""
    return re.sub(r"[^a-fA-F0-9]", "", mac_raw)[-4:].upper()


def _did(mac_raw: str) -> str:
    return f"ggs_{_mac(mac_raw)}"


def _device_name(device_cfg: dict) -> str:
    """'SF {Type Label} {last4MAC}' unless a custom/friendly name is set."""
    name = device_cfg.get("custom_name", "") or device_cfg.get("friendly_name", "")
    if name.strip():
        return name.strip()
    dtype = (device_cfg.get("type", "") or "").lower()
    label = _TYPE_LABELS.get(dtype, dtype.upper() or "Spider Farmer")
    return f"SF {label} {_mac_suffix(device_cfg.get('mac', '000000000000'))}"


def _device_model(device_cfg: dict) -> str:
    dtype = (device_cfg.get("type", "") or "").lower()
    return _TYPE_LABELS.get(dtype, dtype.upper())


# Types that can host the full accessory set (v3.4.0: the AC5/AC10
# strips take lights, climate gear, air sensors, and soil probes too)
_FULL_TYPES = ("cb", "ps5", "ps10")


def _capabilities(dtype: str) -> dict:
    dtype = dtype.lower()
    return {
        "hasOutlets": dtype in ("ps5", "ps10"),   # outlets = strips only
        "hasFan":     dtype in _FULL_TYPES,
        "hasLight2":  dtype in ("cb", "ps5", "ps10", "lc"),
    }


def _outlet_count(dtype: str) -> int:
    return 10 if dtype.lower() in ("ps10", "cb") else 5


# ── Entity descriptor ─────────────────────────────────────────────────────────

@dataclass
class SfDef:
    """One HA entity definition, carried from the bus to a platform."""
    platform: str                 # "sensor" | "binary_sensor" | "switch" | "light" | "fan"
    field: str                    # topic field: "temperature", "outlet_3", "light_1", ...
    name: str                     # entity display name
    mac: str                      # lowercase MAC, no separators
    mac_raw: str                  # raw MAC as seen in CONNECT
    device_name: str              # "SF Display Panel 4E01"
    device_model: str             # "Display Panel"
    unit: Optional[str] = None
    icon: Optional[str] = None
    device_class: Optional[str] = None
    state_class: Optional[str] = None
    options: Optional[list] = dc_field(default=None)
    kind: Optional[str] = None    # fan: "blower"|"fan"; light: "light_1"|"light_2"
    precision: Optional[int] = None  # suggested display precision (UI rounding)
    slot: Optional[str] = None    # logical slot (cb1, ps5, ...) for entity_ids
    object_id: Optional[str] = None  # explicit object_id override (soil probes)
    command_field: Optional[str] = None     # wire field for commands when it
                                            # differs from `field` (level
                                            # controls: field heater_level_set
                                            # commands the heater block)
    command_subfield: Optional[str] = None  # subfield for commands ("level",
                                            # "oscillation_level", ...)
    device_key: Optional[str] = None        # groups this entity under a
                                            # separate HA device: identifier
                                            # ggs_{mac}_{device_key} (e.g.
                                            # "env" -> the Environment device)
    min_value: Optional[float] = None       # number entities
    max_value: Optional[float] = None       # number entities
    num_mode: Optional[str] = None          # number UI: "box" | "slider" | "auto"
    step: Optional[float] = None            # number entities: step (default 1)
    mode_group: Optional[str] = None        # outlet mode this entity belongs
                                            # to (dynamic visibility); None =
                                            # always visible
    entity_category: Optional[str] = None   # HA entity_category: "diagnostic"

    @property
    def unique_id(self) -> str:
        return f"ggs_{self.mac}_{self.field}"

    @property
    def state_topic(self) -> str:
        return f"ggs/ha/{self.mac}/{self.field}/state"

    @property
    def command_topic(self) -> str:
        return f"ggs/ha/{self.mac}/{self.field}/set"

    @property
    def expected_object_id(self) -> str:
        """Slot-based object id (v3.1.0): sf_dp1_temperature. Soil probes
        use an explicit override (sf_soil1_temperature). Falls back to the
        legacy device-name slug when no slot is assigned."""
        from homeassistant.util import slugify
        if self.object_id:
            return slugify(self.object_id)
        if self.slot:
            return slugify(f"sf_{self.slot}_{self.name}")
        return slugify(f"{self.device_name} {self.name}")


# ── Definition builders — mirror publish_discovery_for_device() ──────────────

# Blocks/fields whose entity groups are created from live evidence.
# Air sensors are FIELD-level (v3.2.3): the CB reports the "sensor" block
# whenever any probe is attached, but e.g. co2 only appears as a field when
# a CO2 sensor is physically hooked up — so each air sensor is gated on its
# own field token instead of the whole block.
EVIDENCE_BLOCKS = (
    "sensor:temp", "sensor:humi", "sensor:co2", "sensor:vpd", "sensor:ppfd",
    "light", "light2", "fan", "blower",
    "humidifier", "dehumidifier", "heater",
    "selight",
)


def build_device_entities(
    device_cfg: dict,
    include_outlets: bool = True,
    blocks: Optional[set] = None,
    slot: Optional[str] = None,
) -> list[SfDef]:
    """Return entities for one GGS device.

    blocks=None returns the full capability set (used for repair/rename
    bookkeeping). blocks={...} returns only the entity groups sourced from
    those data blocks — the evidence-based creation path (v3.0.12): a
    device gets exactly the entities for the blocks it actually reports.
    include_outlets=False omits outlet switches; those are created
    per-number via SfBus.outlet_seen()."""
    mac_raw = device_cfg.get("mac", "")
    mac     = _mac(mac_raw)
    dtype   = (device_cfg.get("type", "") or "").lower()
    dname   = _device_name(device_cfg)
    dmodel  = _device_model(device_cfg)
    caps    = _capabilities(dtype)

    def want(block: str) -> bool:
        return blocks is None or block in blocks

    def d(platform, field, name, **kw) -> SfDef:
        return SfDef(
            platform=platform, field=field, name=name,
            mac=mac, mac_raw=mac_raw,
            device_name=dname, device_model=dmodel, slot=slot, **kw,
        )

    defs: list[SfDef] = []

    # ── Air sensors — per-field evidence (v3.2.3); strips too (v3.4.0) ────
    if dtype in _FULL_TYPES:
        if want("sensor:temp"):
            defs.append(d("sensor", "temperature", "Temperature",
              unit="°C", device_class="temperature", state_class="measurement",
              icon="mdi:thermometer", precision=2))
        if want("sensor:humi"):
            defs.append(d("sensor", "humidity", "Humidity",
              unit="%", device_class="humidity", state_class="measurement",
              icon="mdi:water-percent", precision=2))
        if want("sensor:co2"):
            defs.append(d("sensor", "co2", "CO2",
              unit="ppm", device_class="carbon_dioxide", state_class="measurement",
              icon="mdi:molecule-co2"))
        if want("sensor:vpd"):
            defs.append(d("sensor", "vpd", "VPD",
              unit="kPa", state_class="measurement", icon="mdi:gauge",
              precision=2))
        if want("sensor:ppfd"):
            defs.append(d("sensor", "ppfd", "PPFD",
              unit="µmol/m²/s", state_class="measurement",
              icon="mdi:white-balance-sunny"))

    # ── Outlets ───────────────────────────────────────────────────────────
    if caps["hasOutlets"] and include_outlets:
        for n in range(1, _outlet_count(dtype) + 1):
            defs.append(
                d("switch", f"outlet_{n}", f"Outlet {n}", device_class="outlet")
            )

    # ── Light 1 — all device types ────────────────────────────────────────
    if want("light"):
        defs.append(d("light", "light_1", "Light 1", icon="mdi:lightbulb", kind="light_1"))

    # ── Light 2 ───────────────────────────────────────────────────────────
    if caps["hasLight2"] and want("light2"):
        defs.append(d("light", "light_2", "Light 2", icon="mdi:lightbulb", kind="light_2"))

    # ── Fan / Blower + related sensors — CB only, per block ──────────────
    if caps["hasFan"] and want("blower"):
        defs += [
            d("fan", "blower", "Blower", icon="mdi:fan", kind="blower"),
            d("sensor", "blower_speed", "Blower Speed",
              unit="%", state_class="measurement", icon="mdi:speedometer"),
            # Inline speed slider (0 = Off, else 25-100 % hardware floor).
            # Mirrors the blower_speed report; command routes to the blower
            # block's percentage subfield. kind="blower" selects the
            # off/floor-aware number entity in number.py.
            d("number", "blower_speed_set", "Blower Speed",
              unit="%", icon="mdi:speedometer", kind="blower",
              command_field="blower", command_subfield="percentage",
              min_value=0, max_value=100, step=5),
            d("sensor", "blower_mode", "Blower Mode",
              device_class="enum", options=list(_FAN_MODE_OPTIONS), icon="mdi:cog"),
        ]
    if caps["hasFan"] and want("fan"):
        defs += [
            d("fan", "fan", "Fan", icon="mdi:fan", kind="fan"),
            # unique_id stays *_fan_gear; display name is "Fan Speed"
            d("sensor", "fan_gear", "Fan Speed",
              state_class="measurement", icon="mdi:speedometer"),
            # Inline speed slider in % (0 = Off, 10-100 in 10s) mapped to the
            # fan's 10 gears. kind="fan" selects the gear<->percent number in
            # number.py; reads fan_gear (0-10) and shows it as a percentage.
            d("number", "fan_gear_set", "Fan Speed",
              unit="%", icon="mdi:speedometer", kind="fan",
              command_field="fan", command_subfield="percentage",
              min_value=0, max_value=100, step=10),
            d("sensor", "fan_oscillation", "Fan Oscillation",
              state_class="measurement", icon="mdi:rotate-3d-variant"),
            d("binary_sensor", "fan_natural_wind", "Fan Natural Wind",
              icon="mdi:weather-windy"),
            d("number", "fan_oscillation_set", "Fan Oscillation",
              icon="mdi:rotate-3d-variant", command_field="fan",
              command_subfield="oscillation_level",
              min_value=0, max_value=10),
            d("switch", "fan_natural_wind_set", "Fan Natural Wind",
              icon="mdi:weather-windy", command_field="fan",
              command_subfield="natural_wind", kind="toggle"),
            d("sensor", "fan_mode", "Fan Mode",
              device_class="enum", options=list(_FAN_MODE_OPTIONS), icon="mdi:cog"),
        ]

    # ── Light brightness sensors (tied to their light blocks) ────────────
    if want("light"):
        defs.append(d("sensor", "light_1_brightness", "Light 1 Brightness",
                      unit="%", state_class="measurement", icon="mdi:brightness-percent"))
    if caps["hasLight2"] and want("light2"):
        defs.append(d("sensor", "light_2_brightness", "Light 2 Brightness",
                      unit="%", state_class="measurement", icon="mdi:brightness-percent"))

    # ── Climate accessories — per block; strips too (v3.4.0) ─────────────
    if dtype in _FULL_TYPES and want("humidifier"):
        defs += [
            d("switch", "humidifier", "Humidifier",
              icon="mdi:air-humidifier", kind="climate"),
            d("number", "humidifier_level_set", "Humidifier Level",
              icon="mdi:water-percent", command_field="humidifier",
              command_subfield="level", min_value=1, max_value=4),
            d("binary_sensor", "humidifier_active", "Humidifier Active", icon="mdi:water"),
            d("sensor", "humidifier_level", "Humidifier Level", icon="mdi:water-percent"),
            d("sensor", "humidifier_mode", "Humidifier Mode",
              device_class="enum", options=list(_CLIMATE_MODE_OPTIONS), icon="mdi:cog"),
            d("sensor", "humidifier_water", "Humidifier Tank",
              device_class="enum", options=["Full", "Empty"], icon="mdi:water"),
        ]
    if dtype in _FULL_TYPES and want("dehumidifier"):
        defs += [
            d("switch", "dehumidifier", "Dehumidifier",
              icon="mdi:air-humidifier-off", kind="climate"),
            d("select", "dehumidifier_level_set", "Dehumidifier Level",
              icon="mdi:air-humidifier-off", command_field="dehumidifier",
              command_subfield="level", options=["Low", "High"]),
            d("binary_sensor", "dehumidifier_active", "Dehumidifier Active", icon="mdi:air-humidifier-off"),
            d("sensor", "dehumidifier_level", "Dehumidifier Level",
              device_class="enum", options=["Off", "Low", "High"],
              icon="mdi:air-humidifier-off"),
            d("sensor", "dehumidifier_mode", "Dehumidifier Mode",
              device_class="enum", options=list(_CLIMATE_MODE_OPTIONS), icon="mdi:cog"),
            d("sensor", "dehumidifier_tank", "Dehumidifier Tank",
              device_class="enum", options=["Empty", "Full"], icon="mdi:cup-water"),
        ]
    if dtype in _FULL_TYPES and want("heater"):
        defs += [
            d("switch", "heater", "Heater",
              icon="mdi:radiator", kind="climate"),
            d("number", "heater_level_set", "Heater Level",
              icon="mdi:radiator", command_field="heater",
              command_subfield="level", min_value=1, max_value=10),
            d("binary_sensor", "heater_active", "Heater Active", icon="mdi:radiator"),
            d("sensor", "heater_level", "Heater Level", icon="mdi:radiator"),
            d("sensor", "heater_mode", "Heater Mode",
              device_class="enum", options=list(_CLIMATE_MODE_OPTIONS), icon="mdi:cog"),
            d("sensor", "heater_status", "Heater Status",
              device_class="enum", options=["OK", "Alarm"], icon="mdi:fire"),
        ]

    # ── Standalone SE-series light (v3.10.0) — read-only until the write
    # format is captured from the SF app ─────────────────────────────────
    if dtype == "se" and want("selight"):
        defs += [
            d("light", "se_light", "Light", kind="se"),
            d("select", "se_mode_set", "Mode", icon="mdi:cog",
              options=["Manual", "Automatic"], command_field="se_mode"),
            d("text", "se_schedule_start_set", "Schedule Start",
              icon="mdi:clock-start", command_field="se_light",
              command_subfield="schedule_start"),
            # "Stop" not "End": HA sorts entities alphabetically by name,
            # and Start < Stop keeps start above stop on the device page.
            d("text", "se_schedule_end_set", "Schedule Stop",
              icon="mdi:clock-end", command_field="se_light",
              command_subfield="schedule_end"),
            d("number", "se_schedule_brightness_set", "Schedule Brightness",
              unit="%", icon="mdi:brightness-percent",
              command_field="se_light", command_subfield="schedule_brightness",
              min_value=11, max_value=100),   # panels can't dim below 11%
            # One fadeTime drives BOTH ends of the schedule: sunrise
            # fade-in at start, sunset fade-out at end (user-confirmed).
            d("number", "se_sunrise_minutes_set", "Sunrise/Sunset Fade",
              unit="min", icon="mdi:weather-sunset",
              command_field="se_light", command_subfield="sunrise_minutes",
              min_value=0, max_value=30),
            d("sensor", "se_brightness", "Brightness",
              unit="%", state_class="measurement",
              icon="mdi:brightness-percent"),
            d("sensor", "se_mode", "Mode", icon="mdi:cog"),
            d("binary_sensor", "se_active", "Active",
              icon="mdi:lightbulb-on"),
        ]

    return defs


def soil_display_label(soil_slot: str) -> str:
    """soil1 -> 'Soil 1'; a custom slot like veg_left -> 'Soil veg_left'."""
    tail = soil_slot[4:] if soil_slot.startswith("soil") and soil_slot[4:] else soil_slot
    return f"Soil {tail}"


def build_soil_entities(
    mac_raw: str,
    sensor_id: str,
    device_cfg: dict,
    slot: Optional[str] = None,        # the CB's slot (unused for ids)
    soil_slot: Optional[str] = None,   # the probe's logical slot (soil1...)
    name_label: Optional[str] = None,  # app-set probe name (senConfig label)
) -> list[SfDef]:
    """3 sensors per soil probe. With a soil slot (v3.3.0) entity_ids are
    sf_{soil_slot}_{temperature|moisture|ec}; unique_ids stay serial-based
    (ggs_{mac}_soil_{serial}_*) so identity/history survive slot edits."""
    mac    = _mac(mac_raw)
    cfg    = dict(device_cfg or {})
    cfg.setdefault("mac", mac_raw)
    dname  = _device_name(cfg)
    dmodel = _TYPE_LABELS.get((cfg.get("type", "") or "").lower(), "Display Panel")
    safe   = re.sub(r"[^a-zA-Z0-9_]", "_", str(sensor_id))
    label  = (name_label or "").strip() or (
        soil_display_label(soil_slot) if soil_slot else f"Soil {sensor_id}"
    )

    out: list[SfDef] = []
    for suffix, name, unit, device_class, icon in [
        ("temperature", f"{label} Temperature", "°C",    "temperature", "mdi:thermometer"),
        ("moisture",    f"{label} Moisture",    "%",     "moisture",    "mdi:water-percent"),
        ("ec",          f"{label} EC",          "mS/cm", None,          "mdi:flash"),
    ]:
        out.append(SfDef(
            platform="sensor",
            field=f"soil_{safe}_{suffix}",
            name=name,
            mac=mac, mac_raw=mac_raw,
            device_name=dname, device_model=dmodel,
            unit=unit, icon=icon,
            device_class=device_class, state_class="measurement",
            precision=2, slot=slot,
            object_id=(
                f"sf_{slot}_{soil_slot}_{suffix}"
                if (soil_slot and slot) else
                (f"sf_{soil_slot}_{suffix}" if soil_slot else None)
            ),
        ))
    return out


def build_soil_avg_entities(mac_raw, device_cfg, slot=None):
    """Per-device average soil sensors (v3.11.2b0) — the app's aggregate
    'avg' reading across a controller's probes. Created once when any soil
    probe is seen; entity_ids sf_{slot}_soil_avg_{temperature|moisture|ec}."""
    mac = _mac(mac_raw)
    cfg = dict(device_cfg or {})
    cfg.setdefault("mac", mac_raw)
    dname = _device_name(cfg)
    dmodel = _TYPE_LABELS.get((cfg.get("type", "") or "").lower(), "Display Panel")
    out = []
    for suffix, name, unit, device_class, icon in [
        ("temperature", "Soil Avg Temperature", "\u00b0C", "temperature", "mdi:thermometer"),
        ("moisture",    "Soil Avg Moisture",    "%",        "moisture",    "mdi:water-percent"),
        ("ec",          "Soil Avg EC",          "mS/cm",    None,          "mdi:flash"),
    ]:
        out.append(SfDef(
            platform="sensor", field=f"soil_avg_{suffix}", name=name,
            mac=mac, mac_raw=mac_raw, device_name=dname, device_model=dmodel,
            unit=unit, icon=icon, device_class=device_class,
            state_class="measurement", precision=2, slot=slot,
            object_id=f"sf_{slot}_soil_avg_{suffix}" if slot else None,
        ))
    return out


# ══ Outlet modes (v3.11.1a alpha) ════════════════════════════════════════════
# modeType numbers confirmed from an app capture (2026-07-11), routed through
# the hosting CB: 0 Manual, 1 Time Slot, 3 Temperature, 4 Humidity, 5 CO2,
# 14 Drip Irrigation. Cycle = 2 is inferred (not toggled in the capture).
OUTLET_MODES = [
    ("Manual", 0),
    ("Time Slot", 1),
    ("Cycle", 2),
    ("Temperature", 3),
    ("Humidity", 4),
    ("CO2", 5),
    ("Drip Irrigation", 14),
]
OUTLET_MODE_TO_TYPE = {name: mt for name, mt in OUTLET_MODES}
OUTLET_TYPE_TO_MODE = {mt: name for name, mt in OUTLET_MODES}
OUTLET_MODE_NAMES = [name for name, _ in OUTLET_MODES]

# Substrate options for the 3-in-1 soil probe (senConfig.soilType index).
SUBSTRATE_OPTIONS = ["Clay", "Coco", "Peat"]


def build_air_calibration_entities(device_cfg, slot=None):
    """Read-only diagnostic sensors for a panel's air-sensor calibration
    offsets, from the config file's top-level ``calibration`` block
    {temp,humi,co2,ppfd}. Air-temp is shown in degF (app convention); the rest
    are direct units."""
    mac_raw = device_cfg.get("mac", "")
    mac = _mac(mac_raw)
    dname = _device_name(device_cfg)
    dmodel = _device_model(device_cfg)

    def n(field, name, unit, icon, prec=1):
        return SfDef(
            platform="sensor", field=field, name=name, mac=mac, mac_raw=mac_raw,
            device_name=dname, device_model=dmodel, unit=unit, slot=slot,
            state_class="measurement", precision=prec,
            entity_category="diagnostic", icon=icon,
            object_id=(f"sf_{slot}_{field}" if slot else None),
        )
    return [
        n("cal_air_temp", "Air Temp Calibration", "°F", "mdi:thermometer"),
        n("cal_air_humidity", "Air Humidity Calibration", "%", "mdi:water-percent"),
        n("cal_ppfd", "PPFD Calibration", "µmol/m²/s", "mdi:white-balance-sunny"),
        n("cal_co2", "CO2 Calibration", "ppm", "mdi:molecule-co2", prec=0),
    ]


def build_soil_calibration_entities(mac_raw, sensor_id, device_cfg, slot=None, soil_slot=None, include_substrate=True):
    """Per-probe editable diagnostic entities: 3 calibration offsets
    (senConfig[].calibration tempSoil/humiSoil/ECSoil) + a Substrate select
    (senConfig[].soilType). Soil-temp is shown in degF (app convention)."""
    mac = _mac(mac_raw)
    dname = _device_name({**(device_cfg or {}), "mac": mac_raw})
    dmodel = _TYPE_LABELS.get((device_cfg or {}).get("type", "").lower(), "Display Panel")
    safe = re.sub(r"[^a-zA-Z0-9_]", "_", str(sensor_id))
    base = soil_display_label(soil_slot) if soil_slot else f"Soil {sensor_id}"
    oid = (lambda suff: f"sf_{slot}_{soil_slot}_{suff}") if (slot and soil_slot) else (lambda suff: None)

    def num(suff, label, unit, icon):
        return SfDef(
            platform="sensor", field=f"soil_{safe}_{suff}", name=f"{base} {label}",
            mac=mac, mac_raw=mac_raw, device_name=dname, device_model=dmodel,
            unit=unit, slot=slot, state_class="measurement", precision=1,
            entity_category="diagnostic", icon=icon, object_id=oid(suff),
        )
    out = [
        num("cal_temp", "Temp Calibration", "°F", "mdi:thermometer"),
        num("cal_moisture", "Moisture Calibration", "%", "mdi:water-percent"),
        num("cal_ec", "EC Calibration", "mS/cm", "mdi:flash"),
    ]
    if include_substrate:  # Pro probes only — Basic probes have no substrate type
        out.append(SfDef(
            platform="sensor", field=f"soil_{safe}_substrate", name=f"{base} Substrate",
            mac=mac, mac_raw=mac_raw, device_name=dname, device_model=dmodel, slot=slot,
            entity_category="diagnostic", icon="mdi:layers-outline", object_id=oid("substrate"),
        ))
    return out


def build_outlet_mode_select(mac_raw, n, slot, device_name, device_model):
    """The always-visible per-outlet Mode selector."""
    mac = _mac(mac_raw)
    return SfDef(
        platform="select", field=f"outlet_{n}_mode", name=f"Outlet {n} Mode",
        mac=mac, mac_raw=mac_raw, device_name=device_name,
        device_model=device_model, slot=slot,
        options=list(OUTLET_MODE_NAMES), icon="mdi:tune-variant",
    )


def build_outlet_mode_config(mac_raw, n, slot, device_name, device_model, mode,
                             soil_options=None):
    """Per-mode config entities for one outlet — only these show while the
    outlet is in `mode` (dropdown-only per the approved alpha layout).
    Manual has none (just the base On/Off switch + Mode select remain)."""
    mac = _mac(mac_raw)

    def e(platform, suffix, label, **kw):
        field = f"outlet_{n}_{suffix}"
        return SfDef(
            platform=platform, field=field,
            name=f"Outlet {n} {label}", mac=mac, mac_raw=mac_raw,
            device_name=device_name, device_model=device_model, slot=slot,
            # Pin the entity_id to the field so it is unique and predictable
            # (two modes both have a "Start" — without this they'd collide).
            object_id=f"sf_{slot}_{field}" if slot else None,
            mode_group=mode, **kw,
        )

    if mode == "Time Slot":
        return [
            e("select", "ts_type", "Week",
              options=["Daily", "Custom"], icon="mdi:calendar-clock"),
            e("text", "ts_start", "Start", icon="mdi:clock-start"),
            e("text", "ts_stop", "Stop", icon="mdi:clock-end"),
        ]
    if mode == "Cycle":
        return [
            e("text", "cycle_start", "Start", icon="mdi:clock-start"),
            e("number", "cycle_run", "Run Duration Min", unit="min",
              min_value=0, max_value=1440, icon="mdi:timer-play"),
            e("number", "cycle_off", "Off Duration Min", unit="min",
              min_value=0, max_value=1440, icon="mdi:timer-off"),
            e("number", "cycle_times", "Execution Times", min_value=1, max_value=100,
              icon="mdi:repeat"),
        ]
    if mode == "Temperature":
        return [e("select", "temp_device", "Device Type",
                  options=["Cooling", "Heating"], icon="mdi:thermometer")]
    if mode == "Humidity":
        return [e("select", "humidity_device", "Device Type",
                  options=["Dehumidifying", "Humidifying"],
                  icon="mdi:water-percent")]
    if mode == "CO2":
        return [e("select", "co2_device", "Device Type",
                  options=["Aeration", "Exhaust"], icon="mdi:molecule-co2")]
    if mode == "Drip Irrigation":
        return [
            e("select", "drip_soil", "Sensor",
              # Reflects the soil probes actually detected (no hard cap:
              # up to 6 pro probes per device, or 1 non-pro). Falls back to
              # just "Average" until probes are seen.
              options=list(soil_options) if soil_options else ["Average"],
              icon="mdi:water"),
            e("number", "drip_avg", "Average Target", unit="%",
              min_value=0, max_value=100, icon="mdi:water-percent"),
        ]
    return []   # Manual and anything else: no extra entities


def build_env_entities(device_cfg, slot):
    """Environment target entities for a display panel, grouped on their own
    HA device (SF Environment {last4}). Temperatures are shown in degF to
    match the SF app (the wire is degC; the command layer converts).
    One env target block exists per display panel."""
    mac_raw = device_cfg.get("mac", "")
    mac = _mac(mac_raw)
    last4 = mac[-4:].upper()
    # last4 before "Environment" so the flat device list sorts each env
    # right after its panel (…{last4} < …{last4} Environment < next panel).
    dname = f"SF Display Panel {last4} Environment"
    dmodel = "Environment"

    def e(platform, field, name, **kw):
        return SfDef(
            platform=platform, field=field, name=name, mac=mac, mac_raw=mac_raw,
            device_name=dname, device_model=dmodel, slot=slot,
            object_id=f"sf_{slot}_{field}" if slot else None,
            device_key="env", **kw,
        )

    defs = [
        e("text", "env_day_start", "Day Cycle Start", icon="mdi:weather-sunny"),
        e("text", "env_day_end", "Day Cycle Stop", icon="mdi:weather-night"),
        # Targets: manual-entry boxes, whole numbers (step 1, CO2 step 10).
        e("number", "env_temp_day", "Temp Target Day", unit="\u00b0F",
          min_value=32, max_value=122, num_mode="box", icon="mdi:thermometer"),
        e("number", "env_temp_night", "Temp Target Night", unit="\u00b0F",
          min_value=32, max_value=122, num_mode="box", icon="mdi:thermometer"),
        # Dead zones: sliders.
        e("number", "env_temp_deadband", "Temp Dead Zone", unit="\u00b0F",
          min_value=1, max_value=18, num_mode="slider",
          icon="mdi:arrow-expand-vertical"),
        e("number", "env_humi_day", "Humidity Target Day", unit="%",
          min_value=0, max_value=100, num_mode="box", icon="mdi:water-percent"),
        e("number", "env_humi_night", "Humidity Target Night", unit="%",
          min_value=0, max_value=100, num_mode="box", icon="mdi:water-percent"),
        e("number", "env_humi_deadband", "Humidity Dead Zone", unit="%",
          min_value=1, max_value=10, num_mode="slider",
          icon="mdi:arrow-expand-vertical"),
        e("number", "env_co2_day", "CO2 Target Day", unit="ppm",
          min_value=300, max_value=2500, step=10, num_mode="box",
          icon="mdi:molecule-co2"),
        e("number", "env_co2_night", "CO2 Target Night", unit="ppm",
          min_value=300, max_value=2500, step=10, num_mode="box",
          icon="mdi:molecule-co2"),
        e("number", "env_co2_deadband", "CO2 Dead Zone", unit="ppm",
          min_value=10, max_value=250, step=10, num_mode="slider",
          icon="mdi:arrow-expand-vertical"),
    ]
    return defs
