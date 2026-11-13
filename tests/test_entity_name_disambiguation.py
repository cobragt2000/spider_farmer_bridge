"""Duplicate-/confusable-named accessory entities are disambiguated (v3.19.421,
extended v3.19.422).

Each accessory exposes a read-only sensor and a settable control for the same
quantity. They used to share an identical display name (impossible to tell apart
in the entity/automation pickers), or the control used an inconsistent " Set"
suffix. Every settable control is now suffixed "(set)"; the read-only sensor keeps
the plain name. Crucially the entity_id (object_id) must NOT move — it is pinned to
the original slug so dashboards, automations and the card keep working.
"""

from custom_components.sf.entity_defs import build_device_entities

MAC = "0A1B2C3D4E18"
_BLOCKS = {"blower", "fan", "humidifier", "dehumidifier", "heater", "selight"}

# control field -> (sensor field, control object_id stem, sensor object_id stem)
# For speed/level/natural-wind pairs the sensor and control share one stem; for
# the mode pairs they differ (fan_mode vs fan_mode_set).
_PAIRS = {
    "blower_speed_set": ("blower_speed", "blower_speed", "blower_speed"),
    "fan_gear_set": ("fan_gear", "fan_speed", "fan_speed"),
    "fan_oscillation_set": ("fan_oscillation", "fan_oscillation", "fan_oscillation"),
    "fan_natural_wind_set": ("fan_natural_wind", "fan_natural_wind", "fan_natural_wind"),
    "humidifier_level_set": ("humidifier_level", "humidifier_level", "humidifier_level"),
    "dehumidifier_level_set": ("dehumidifier_level", "dehumidifier_level", "dehumidifier_level"),
    "heater_level_set": ("heater_level", "heater_level", "heater_level"),
    "se_mode_set": ("se_mode", "mode", "mode"),
    "fan_mode_set": ("fan_mode", "fan_mode_set", "fan_mode"),
    "blower_mode_set": ("blower_mode", "blower_mode_set", "blower_mode"),
    "heater_mode_set": ("heater_mode", "heater_mode_set", "heater_mode"),
    "humidifier_mode_set": ("humidifier_mode", "humidifier_mode_set", "humidifier_mode"),
    "dehumidifier_mode_set": ("dehumidifier_mode", "dehumidifier_mode_set", "dehumidifier_mode"),
}


def _collect():
    found = {}
    for dtype, slot in (("ps5", "ac5"), ("cb", "dp1"), ("se", "se1")):
        for d in build_device_entities({"mac": MAC, "type": dtype},
                                       blocks=_BLOCKS, slot=slot):
            found.setdefault(d.field, (d.name, d.expected_object_id, slot))
    return found


def test_controls_suffixed_set_and_entity_id_pinned():
    found = _collect()
    for ctrl, (_sensor, ctrl_stem, _sensor_stem) in _PAIRS.items():
        assert ctrl in found, f"{ctrl} not built"
        name, oid, slot = found[ctrl]
        assert name.endswith("(set)"), f"{ctrl} name not suffixed: {name!r}"
        assert oid == f"sf_{slot}_{ctrl_stem}", (
            f"{ctrl} entity_id moved: {oid} != sf_{slot}_{ctrl_stem}")


def test_read_only_sensors_keep_plain_name_and_id():
    found = _collect()
    for _ctrl, (sensor, _ctrl_stem, sensor_stem) in _PAIRS.items():
        assert sensor in found, f"{sensor} not built"
        name, oid, slot = found[sensor]
        assert "(set)" not in name, f"{sensor} should stay plain: {name!r}"
        assert oid == f"sf_{slot}_{sensor_stem}", (
            f"{sensor} entity_id moved: {oid} != sf_{slot}_{sensor_stem}")
