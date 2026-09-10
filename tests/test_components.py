"""Auto-add + hide-after accessory model (3.19.91).

  * A new device auto-creates all its entities (incl. Light 2 / Fan) — no
    confirmation prompt, matching the smoother pre-confirm-first behaviour.
  * Hiding an accessory is opt-in: components[mac][block] = False suppresses it.
  * The migration carries a prior card-driven Hide Light 2 into that decision.
  * Environment entities are created for AC5/AC10 strips too, labelled by the
    strip (not "Display Panel").
"""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf import _seed_component_decisions
from custom_components.sf.const import DOMAIN, DATA_BUS

MAC = "0A1B2C3D4E09"
MAC_LC = "0a1b2c3d4e09"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def _setup(hass: HomeAssistant, options=None) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18974, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        options=options or {},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _uids(hass, entry):
    reg = er.async_get(hass)
    return {
        e.unique_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)
    }


async def test_new_device_auto_adds_all_entities(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light", "light2", "fan"}, cfg)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    # Everything auto-created — no confirmation needed.
    assert f"ggs_{MAC_LC}_light_1" in uids
    assert f"ggs_{MAC_LC}_light_2" in uids
    assert f"ggs_{MAC_LC}_fan" in uids


async def test_hidden_accessory_not_created(hass: HomeAssistant):
    entry = await _setup(hass, options={
        "components": {MAC_LC: {"light2": False}},
    })
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light", "light2", "fan"}, cfg)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{MAC_LC}_light_2" not in uids   # hidden
    assert f"ggs_{MAC_LC}_fan" in uids           # still auto-created
    assert f"ggs_{MAC_LC}_light_1" in uids


async def test_strip_gets_environment_entities(hass: HomeAssistant):
    """AC5/AC10 carry the same env target block as the panel — but only once an
    air sensor is actually attached (v3.19.251). Without temp/humi evidence the
    Environment device is a phantom and must not be created."""
    PS10, PS10_LC = "0A1B2C3D4E10", "0a1b2c3d4e10"
    entry = await _setup(hass, options={"device_slots": {PS10_LC: "ac10"}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": PS10, "type": "ps10"}
    bus.register_device(cfg)
    await hass.async_block_till_done()

    # No air sensor reported yet -> no Environment entities.
    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_env_temp_day" not in uids

    # Air sensor evidence arrives -> Environment target device is created.
    bus.blocks_seen(PS10, {"sensor:temp", "sensor:humi"}, cfg)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_env_temp_day" in uids
    assert f"ggs_{PS10_LC}_env_humi_night" in uids


async def test_outlet_seen_creates_indicator_light(hass: HomeAssistant):
    """v3.19.252: a pure-outlet strip reports outlets but no sensor blocks, so
    blocks_seen never runs — the device-level Indicator Light must be created by
    outlet_seen, else its old registry entry shows unavailable (greyed out)."""
    PS10, PS10_LC = "0A1B2C3D4E13", "0a1b2c3d4e13"
    entry = await _setup(hass, options={"device_slots": {PS10_LC: "ac10"}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": PS10, "type": "ps10"}
    bus.register_device(cfg)
    bus.outlet_seen(PS10, 1, cfg)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_indicator_light" in uids
    assert f"ggs_{PS10_LC}_outlet_1" in uids


async def test_s_station_has_no_indicator_light(hass: HomeAssistant):
    """v3.19.259: the single-plug S-Station (st) has no status LED — its built-in
    display shows mode/on — so it must NOT get an Indicator Light. It does get the
    Display Off (Auto Screen Off) control."""
    ST, ST_LC = "0A1B2C3D4E19", "0a1b2c3d4e19"
    entry = await _setup(hass, options={"device_slots": {ST_LC: "st1"}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": ST, "type": "st"}
    bus.register_device(cfg)
    bus.outlet_seen(ST, 1, cfg)
    bus.blocks_seen(ST, {"sys"}, cfg)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{ST_LC}_indicator_light" not in uids
    assert f"ggs_{ST_LC}_outlet_1" in uids
    assert f"ggs_{ST_LC}_display_off" in uids


async def test_outlet_only_strip_skips_plan_and_calibration(hass: HomeAssistant):
    """v3.19.252: a strip with no air sensor must not get grow-plan or air
    calibration entities — they're meaningless and showed up as phantoms.
    Once an air sensor is reported, they may be created."""
    PS10, PS10_LC = "0A1B2C3D4E14", "0a1b2c3d4e14"
    entry = await _setup(hass, options={"device_slots": {PS10_LC: "ac10"}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": PS10, "type": "ps10"}
    bus.register_device(cfg)
    bus.apply_air_calibration(PS10, {"temp": 0, "humi": 0, "co2": 0, "ppfd": 0})
    bus.apply_plan(PS10, active=False, stages=[], present=True)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_cal_air_temp" not in uids
    assert f"ggs_{PS10_LC}_plan" not in uids
    assert f"ggs_{PS10_LC}_plan_enabled" not in uids

    # Air sensor now attached -> the gate opens.
    bus.blocks_seen(PS10, {"sensor:temp", "sensor:humi"}, cfg)
    bus.apply_air_calibration(PS10, {"temp": 0, "humi": 0, "co2": 0, "ppfd": 0})
    bus.apply_plan(PS10, active=False, stages=[], present=True)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_cal_air_temp" in uids
    assert f"ggs_{PS10_LC}_plan" in uids


async def test_external_sensor_mirror(hass: HomeAssistant):
    """v3.19.253: an outlet-only strip can borrow a 3rd-party HA temp/humidity
    entity. The integration creates the strip's temperature/humidity/vpd sensors
    and mirrors the external state (humidity passes through unchanged; VPD is
    derived)."""
    hass.states.async_set(
        "sensor.room_temp", "25.0",
        {"unit_of_measurement": "°C", "device_class": "temperature"})
    hass.states.async_set(
        "sensor.room_humi", "50.0",
        {"unit_of_measurement": "%", "device_class": "humidity"})
    PS10, PS10_LC = "0A1B2C3D4E15", "0a1b2c3d4e15"
    entry = await _setup(hass, options={
        "device_slots": {PS10_LC: "ac10"},
        "strip_sensors": {PS10_LC: {
            "source": "external",
            "temp": "sensor.room_temp",
            "humi": "sensor.room_humi"}},
    })
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_temperature" in uids
    assert f"ggs_{PS10_LC}_humidity" in uids
    assert f"ggs_{PS10_LC}_vpd" in uids

    humi = hass.states.get("sensor.sf_ac10_humidity")
    assert humi is not None and abs(float(humi.state) - 50.0) < 0.1
    vpd = hass.states.get("sensor.sf_ac10_vpd")
    assert vpd is not None and float(vpd.state) > 0

    # A live change on the external sensor flows through.
    hass.states.async_set(
        "sensor.room_humi", "70.0",
        {"unit_of_measurement": "%", "device_class": "humidity"})
    await hass.async_block_till_done()
    humi = hass.states.get("sensor.sf_ac10_humidity")
    assert abs(float(humi.state) - 70.0) < 0.1


async def test_external_mirror_fahrenheit_conversion(hass: HomeAssistant):
    """v3.19.266: an external sensor reporting °F is converted to wire °C with
    (F-32)/1.8, so the round-trip through the SF temperature sensor shows the
    right value (not the old F/1.8 double-conversion bug)."""
    hass.states.async_set("sensor.ftemp", "68.0",
                          {"unit_of_measurement": "°F", "device_class": "temperature"})
    hass.states.async_set("sensor.fhumi", "50.0",
                          {"unit_of_measurement": "%", "device_class": "humidity"})
    PS10 = "0A1B2C3D4E1C"
    entry = await _setup(hass, options={
        "device_slots": {PS10.lower(): "ac10"},
        "strip_sensors": {PS10.lower(): {"source": "external", "temp": "sensor.ftemp", "humi": "sensor.fhumi"}},
    })
    await hass.async_block_till_done()
    t = hass.states.get("sensor.sf_ac10_temperature")
    assert t is not None
    v = float(t.state)
    # 68°F -> 20°C. Displayed as either 20 (°C) or 68 (°F) — never ~37.8/100.
    assert abs(v - 20.0) < 0.6 or abs(v - 68.0) < 0.6


async def test_external_mirror_survives_prune_blocks(hass: HomeAssistant):
    """v3.19.264: with keep-offline OFF, prune_blocks must NOT delete an external
    strip's mirrored temperature/humidity — they aren't in the device's own
    evidence (it reports no SF air sensor)."""
    hass.states.async_set("sensor.rt", "22.0",
                          {"unit_of_measurement": "°C", "device_class": "temperature"})
    hass.states.async_set("sensor.rh", "60.0",
                          {"unit_of_measurement": "%", "device_class": "humidity"})
    PS10, PS10_LC = "0A1B2C3D4E1A", "0a1b2c3d4e1a"
    entry = await _setup(hass, options={
        "keep_offline_entities": False,
        "device_slots": {PS10_LC: "ac10"},
        "strip_sensors": {PS10_LC: {"source": "external", "temp": "sensor.rt", "humi": "sensor.rh"}},
    })
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": PS10, "type": "ps10"}
    assert hass.states.get("sensor.sf_ac10_temperature") is not None
    # A report with NO air-sensor evidence would normally prune temp/humi.
    bus.prune_blocks(PS10, {"heater"}, cfg)
    await hass.async_block_till_done()
    assert f"ggs_{PS10_LC}_temperature" in _uids(hass, entry)
    assert f"ggs_{PS10_LC}_humidity" in _uids(hass, entry)


async def test_external_switch_back_returns_to_outlet_only(hass: HomeAssistant):
    """v3.19.264: switching a strip from External back to SF (keep-offline off)
    removes the mirrored temp/humidity AND the Environment targets, so the card
    returns to outlet-only."""
    hass.states.async_set("sensor.rt2", "22.0",
                          {"unit_of_measurement": "°C", "device_class": "temperature"})
    hass.states.async_set("sensor.rh2", "60.0",
                          {"unit_of_measurement": "%", "device_class": "humidity"})
    PS10, PS10_LC = "0A1B2C3D4E1B", "0a1b2c3d4e1b"
    entry = await _setup(hass, options={
        "keep_offline_entities": False,
        "device_slots": {PS10_LC: "ac10"},
        "strip_sensors": {PS10_LC: {"source": "external", "temp": "sensor.rt2", "humi": "sensor.rh2"}},
    })
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    assert f"ggs_{PS10_LC}_temperature" in _uids(hass, entry)
    assert f"ggs_{PS10_LC}_env_temp_day" in _uids(hass, entry)

    bus.apply_strip_sensors({})   # switched back to SF (no external)
    await hass.async_block_till_done()
    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_temperature" not in uids
    assert f"ggs_{PS10_LC}_humidity" not in uids
    assert f"ggs_{PS10_LC}_env_temp_day" not in uids


async def test_external_strip_gets_environment_targets_back(hass: HomeAssistant):
    """v3.19.256: once a strip is on an external sensor it regains its
    Environment target entities (for planting-plan targets) — but still no air
    calibration (there's no SF probe to trim)."""
    hass.states.async_set("sensor.room_t2", "24.0",
                          {"unit_of_measurement": "°C", "device_class": "temperature"})
    hass.states.async_set("sensor.room_h2", "55.0",
                          {"unit_of_measurement": "%", "device_class": "humidity"})
    PS10, PS10_LC = "0A1B2C3D4E16", "0a1b2c3d4e16"
    entry = await _setup(hass, options={
        "device_slots": {PS10_LC: "ac10"},
        "strip_sensors": {PS10_LC: {
            "source": "external", "temp": "sensor.room_t2", "humi": "sensor.room_h2"}},
    })
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_env_temp_day" in uids
    assert f"ggs_{PS10_LC}_env_humi_day" in uids
    assert f"ggs_{PS10_LC}_cal_air_temp" not in uids   # no SF probe -> no calibration
    # No CO2 sensor on an external 3-in-1 -> no CO2 targets (v3.19.257).
    assert f"ggs_{PS10_LC}_env_co2_day" not in uids
    assert f"ggs_{PS10_LC}_env_co2_deadband" not in uids

    # v3.19.260: a strip on an external sensor DOES get the Planting Plan (its
    # targets drive smart control) — unlike a truly sensorless outlet-only strip.
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.register_device({"mac": PS10, "type": "ps10"})
    bus.apply_plan(PS10, active=False, stages=[], present=True)
    await hass.async_block_till_done()
    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_plan" in uids
    assert f"ggs_{PS10_LC}_plan_enabled" in uids


async def test_strip_misslotted_as_dp_is_healed(hass: HomeAssistant):
    """3.19.91: a strip wrongly stored on a panel (dp) slot by the confirm-first
    bug is re-slotted to a correct ac5/ac10 slot on next sight."""
    PS10, PS10_LC = "0A1B2C3D4E11", "0a1b2c3d4e11"
    entry = await _setup(hass, options={"device_slots": {PS10_LC: "dp3"}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    slot = bus.get_slot(PS10, "ps10")
    assert slot.startswith("ac10")
    assert slot != "dp3"
    assert entry.options["device_slots"][PS10_LC].startswith("ac10")

    # A correctly-slotted strip is left alone.
    PS5, PS5_LC = "0A1B2C3D4E12", "0a1b2c3d4e12"
    bus.hass.config_entries.async_update_entry(
        entry, options={**entry.options,
                        "device_slots": {**entry.options["device_slots"], PS5_LC: "ac5"}},
    )
    assert bus.get_slot(PS5, "ps5") == "ac5"


async def test_indicator_light_survives_prune_blocks(hass: HomeAssistant):
    """3.19.97: with keep-offline OFF, prune_blocks must not delete the strip's
    device-level Indicator Light (it isn't tied to a reported block)."""
    PS5, PS5_LC = "0A1B2C3D4E20", "0a1b2c3d4e20"
    entry = await _setup(hass, options={
        "keep_offline_entities": False,
        "device_slots": {PS5_LC: "ac5"},
    })
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": PS5, "type": "ps5"}
    bus.register_device(cfg)
    evidence = {"sensor:temp", "sensor:humi"}
    bus.blocks_seen(PS5, evidence, cfg)
    await hass.async_block_till_done()
    assert f"ggs_{PS5_LC}_indicator_light" in _uids(hass, entry)

    # Prune leftovers for never-reported blocks — must keep the LED, but still
    # remove a genuine phantom (light_1, since no light block was reported).
    bus.prune_blocks(PS5, evidence, cfg)
    await hass.async_block_till_done()
    uids = _uids(hass, entry)
    assert f"ggs_{PS5_LC}_indicator_light" in uids
    assert f"ggs_{PS5_LC}_light_1" not in uids


async def test_device_toggle_blocks_all_three(hass: HomeAssistant):
    """A CB reporting light/light2/fan offers all three tree checkboxes."""
    from custom_components.sf.config_flow import device_toggle_blocks
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light", "light2", "fan"}, cfg)
    await hass.async_block_till_done()
    assert device_toggle_blocks(hass, entry, MAC_LC) == ["light", "light2", "fan"]


async def test_device_toggle_blocks_hides_unreported(hass: HomeAssistant):
    """A device that never reports Light 2 does not show that checkbox."""
    from custom_components.sf.config_flow import device_toggle_blocks
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light", "fan"}, cfg)   # no light2 reported
    await hass.async_block_till_done()
    assert device_toggle_blocks(hass, entry, MAC_LC) == ["light", "fan"]


async def test_device_toggle_blocks_keeps_hidden_decision(hass: HomeAssistant):
    """An accessory turned off (entities torn down) still shows so it can be
    turned back on — the explicit decision keeps it in the tree."""
    from custom_components.sf.config_flow import device_toggle_blocks
    entry = await _setup(hass, options={"components": {MAC_LC: {"light2": False}}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light", "light2", "fan"}, cfg)
    await hass.async_block_till_done()
    blocks = device_toggle_blocks(hass, entry, MAC_LC)
    assert "light2" in blocks                              # kept via decision
    assert f"ggs_{MAC_LC}_light_2" not in _uids(hass, entry)  # but not created


async def test_migration_carries_card_hide_light2(hass: HomeAssistant):
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=DOMAIN, data={"listen_port": 18975},
        options={"card_options": {"beefbeefbe02": {"hide_light2": "1"}}},
    )
    entry.add_to_hass(hass)
    _seed_component_decisions(hass, entry)
    assert entry.options["components"]["beefbeefbe02"]["light2"] is False
