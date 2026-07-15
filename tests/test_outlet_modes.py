"""Per-outlet modes + dynamic visibility (v3.11.1a alpha).

Layout under test: each outlet gets a Mode selector; only the active mode's
config entities are present in HA (full add/remove). Mode switching writes a
real modeType through the hosting CB; sub-settings are layout-only.
"""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.proxy.command_handler import translate_command
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import (
    MQTTPacket, MQTT_PUBLISH, parse_packets,
)

PS10_MAC = "0A1B2C3D4E05"
PS10_MAC_LC = "0a1b2c3d4e05"
PS10_DATA = {"outlet": {"psmode": 2, **{f"O{n}": {"on": 0} for n in range(1, 11)}}}


def _devsta(mac, data):
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{mac}",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
    )


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18904, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _make_ps10(hass, entry):
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(PS10_MAC, bus)
    for _ in range(3):
        _process_publish(session, _devsta(PS10_MAC, PS10_DATA), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()
    return bus


async def test_manual_shows_only_switch_and_mode(hass: HomeAssistant):
    entry = await _setup(hass)
    await _make_ps10(hass, entry)

    # Base on/off + Mode selector, defaulting to Manual → no extra entities
    assert hass.states.get("switch.sf_ac10_outlet_1") is not None
    assert hass.states.get("select.sf_ac10_outlet_1_mode") is not None
    assert hass.states.get("select.sf_ac10_outlet_1_mode").state == "Manual"
    # None of the other modes' entities exist
    for eid in (
        "select.sf_ac10_outlet_1_temp_device",
        "text.sf_ac10_outlet_1_cycle_start",
        "select.sf_ac10_outlet_1_ts_type",
    ):
        assert hass.states.get(eid) is None, eid

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_mode_switch_shows_only_that_modes_entities(hass: HomeAssistant):
    entry = await _setup(hass)
    await _make_ps10(hass, entry)

    # Switch outlet 1 to Cycle
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_ac10_outlet_1_mode", "option": "Cycle"},
        blocking=True,
    )
    await hass.async_block_till_done()

    # Cycle entities present
    for eid in (
        "text.sf_ac10_outlet_1_cycle_start",
        "number.sf_ac10_outlet_1_cycle_run",
        "number.sf_ac10_outlet_1_cycle_off",
        "number.sf_ac10_outlet_1_cycle_times",
    ):
        assert hass.states.get(eid) is not None, f"missing {eid}"
    # Temperature entity NOT present
    assert hass.states.get("select.sf_ac10_outlet_1_temp_device") is None

    # Now switch to Temperature → cycle entities vanish, temp appears
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_ac10_outlet_1_mode", "option": "Temperature"},
        blocking=True,
    )
    await hass.async_block_till_done()

    assert hass.states.get("select.sf_ac10_outlet_1_temp_device") is not None
    assert hass.states.get("select.sf_ac10_outlet_1_temp_device").attributes[
        "options"] == ["Cooling", "Heating"]
    for eid in (
        "text.sf_ac10_outlet_1_cycle_start",
        "number.sf_ac10_outlet_1_cycle_run",
    ):
        assert hass.states.get(eid) is None, f"{eid} should be gone"

    # Back to Manual → temp entity gone too
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_ac10_outlet_1_mode", "option": "Manual"},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert hass.states.get("select.sf_ac10_outlet_1_temp_device") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_mode_write_is_real_modetype():
    """Mode selector writes a real device-rooted modeType (block-preserving)."""
    cmd = translate_command(
        "outlet_1_mode", "Cycle", "0A1B2C3D4EA4", "u1",
        outlet_num=1, outlet_block="ps10", outlet_subfield="mode",
    )
    assert cmd["params"]["keyPath"] == ["device", "ps10", "O1"]
    assert cmd["params"]["O1"]["modeType"] == 2   # Cycle

    temp = translate_command(
        "outlet_1_mode", "Temperature", "0A1B2C3D4EA4", "u1",
        outlet_num=1, outlet_block="ps10", outlet_subfield="mode",
    )
    assert temp["params"]["O1"]["modeType"] == 3


def test_device_type_dropdowns_real_writes():
    """Temperature/Humidity/CO2 device dropdowns write confirmed encodings,
    block-preserving from the cached outlet config."""
    cfg = {"modeType": 3, "tempAdd": 1, "humiAdd": 1, "co2Add": 1,
           "mOnOff": 0, "cycleTime": {"weekmask": 127, "times": 5}}
    # Cooling -> tempAdd 2, rest preserved
    c = translate_command("outlet_1_temp_device", "Cooling", "0A1B2C3D4EA4",
                          "u1", outlet_num=1, outlet_block="ps10",
                          outlet_subfield="temp_device", outlet_cfg=cfg)
    assert c["params"]["O1"]["tempAdd"] == 2
    assert c["params"]["O1"]["cycleTime"]["times"] == 5   # preserved
    assert c["params"]["keyPath"] == ["device", "ps10", "O1"]
    # Dehumidifying -> humiAdd 2 ; Exhaust -> co2Add 2
    assert translate_command("outlet_1_humidity_device", "Dehumidifying",
        "0A1B2C3D4EA4", "u1", outlet_num=1, outlet_block="ps10",
        outlet_subfield="humidity_device", outlet_cfg=cfg
        )["params"]["O1"]["humiAdd"] == 2
    assert translate_command("outlet_1_co2_device", "Exhaust",
        "0A1B2C3D4EA4", "u1", outlet_num=1, outlet_block="ps10",
        outlet_subfield="co2_device", outlet_cfg=cfg
        )["params"]["O1"]["co2Add"] == 2


def test_cycle_settings_real_writes():
    """Cycle run/off minutes -> seconds; times clamps; start HH:MM->seconds."""
    cfg = {"modeType": 2, "cycleTime": {"weekmask": 127, "startTime": 0,
           "openDur": 0, "closeDur": 0, "times": 1}}
    run = translate_command("outlet_1_cycle_run", "20", "0A1B2C3D4EA4", "u1",
        outlet_num=1, outlet_block="ps10", outlet_subfield="cycle_run",
        outlet_cfg=cfg)
    assert run["params"]["O1"]["cycleTime"]["openDur"] == 1200   # 20 min
    off = translate_command("outlet_1_cycle_off", "30", "0A1B2C3D4EA4", "u1",
        outlet_num=1, outlet_block="ps10", outlet_subfield="cycle_off",
        outlet_cfg=cfg)
    assert off["params"]["O1"]["cycleTime"]["closeDur"] == 1800  # 30 min
    st = translate_command("outlet_1_cycle_start", "12:00", "0A1B2C3D4EA4",
        "u1", outlet_num=1, outlet_block="ps10", outlet_subfield="cycle_start",
        outlet_cfg=cfg)
    assert st["params"]["O1"]["cycleTime"]["startTime"] == 43200


def test_timeslot_real_writes():
    cfg = {"modeType": 1, "timePeriod": [{"enabled": 1, "weekmask": 127,
           "startTime": 0, "endTime": 0}]}
    a = translate_command("outlet_1_ts_start", "08:00", "0A1B2C3D4EA4", "u1",
        outlet_num=1, outlet_block="ps10", outlet_subfield="ts_start",
        outlet_cfg=cfg)
    assert a["params"]["O1"]["timePeriod"][0]["startTime"] == 28800
    b = translate_command("outlet_1_ts_stop", "20:00", "0A1B2C3D4EA4", "u1",
        outlet_num=1, outlet_block="ps10", outlet_subfield="ts_stop",
        outlet_cfg=cfg)
    assert b["params"]["O1"]["timePeriod"][0]["endTime"] == 72000


def test_write_uses_default_when_no_cache():
    """No cached config -> a full valid default object is sent, never a
    broken partial."""
    c = translate_command("outlet_1_temp_device", "Cooling", "0A1B2C3D4EA4",
        "u1", outlet_num=1, outlet_block="ps10",
        outlet_subfield="temp_device", outlet_cfg=None)
    o = c["params"]["O1"]
    assert o["tempAdd"] == 2
    assert "cycleTime" in o and "timePeriod" in o and len(o["timePeriod"]) == 12


def test_drip_advanced_still_layout_only():
    assert translate_command("outlet_1_drip_avg", "35", "0A1B2C3D4EA4", "u1",
        outlet_num=1, outlet_block="ps10", outlet_subfield="drip_avg",
        outlet_cfg={"modeType": 14}) is None


async def test_mode_selector_holds_value(hass: HomeAssistant):
    """Selecting a mode must stick in HA (optimistic), not revert to Manual."""
    entry = await _setup(hass)
    await _make_ps10(hass, entry)

    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_ac10_outlet_1_mode", "option": "Drip Irrigation"},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert hass.states.get("select.sf_ac10_outlet_1_mode").state == "Drip Irrigation"

    # Drip soil dropdown exists; with no probes detected it's just Average
    soil = hass.states.get("select.sf_ac10_outlet_1_drip_soil")
    assert soil is not None
    assert soil.attributes["options"] == ["Average"]

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_drip_soil_options_reflect_detected_probes(hass: HomeAssistant):
    """No hard cap: the drip soil list mirrors the soil probes actually
    seen (6 pro probes -> 6 entries; would be 1 for a non-pro device)."""
    entry = await _setup(hass)
    bus = await _make_ps10(hass, entry)

    # Simulate six pro soil probes registering on a controller
    for i in range(1, 7):
        bus._soil_cache[f"serial{i}"] = f"soil{i}"

    opts = bus.soil_options()
    assert opts == ["Average", "Soil 1", "Soil 2", "Soil 3",
                    "Soil 4", "Soil 5", "Soil 6"]

    # Entering drip mode now surfaces all six
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_ac10_outlet_2_mode", "option": "Drip Irrigation"},
        blocking=True,
    )
    await hass.async_block_till_done()
    soil = hass.states.get("select.sf_ac10_outlet_2_drip_soil")
    assert soil.attributes["options"] == opts

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_normalize_outlet_config_to_state():
    """App->HA: a config block decodes to the mode entity state topics."""
    from custom_components.sf.proxy.normalizer import normalize_outlet_config
    block = {"O1": {
        "modeType": 3, "tempAdd": 2, "humiAdd": 1, "co2Add": 1,
        "cycleTime": {"startTime": 43200, "openDur": 1200, "closeDur": 1800, "times": 28},
        "timePeriod": [{"enabled": 1, "weekmask": 127, "startTime": 28800, "endTime": 72000}],
    }}
    out = normalize_outlet_config("0A1B2C3D4E05", block)
    e = "0a1b2c3d4e05"
    assert out[f"ggs/ha/{e}/outlet_1_mode/state"] == "Temperature"
    assert out[f"ggs/ha/{e}/outlet_1_temp_device/state"] == "Cooling"
    assert out[f"ggs/ha/{e}/outlet_1_cycle_run/state"] == "20"
    assert out[f"ggs/ha/{e}/outlet_1_cycle_off/state"] == "30"
    assert out[f"ggs/ha/{e}/outlet_1_cycle_times/state"] == "28"
    assert out[f"ggs/ha/{e}/outlet_1_ts_start/state"] == "08:00"
    assert out[f"ggs/ha/{e}/outlet_1_ts_stop/state"] == "20:00"
    assert out[f"ggs/ha/{e}/outlet_1_ts_type/state"] == "Daily"


async def test_app_change_updates_ha_via_cb_block(hass: HomeAssistant):
    """End-to-end app->HA: a CB reports its ps10 block with O1 in Temperature/
    Cooling; the strip's HA entities update and the temp dropdown appears."""
    entry = await _setup(hass)
    bus = await _make_ps10(hass, entry)
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]

    # Register the strip session so the CB's ps10 block resolves to its mac
    strip = ProxySession(PS10_MAC, bus)
    strip.device_type = "ps10"   # the strip is a connected PS10
    class _W:
        def write(self, d): pass
        async def drain(self): pass
    strip._client_writer = _W()
    proxy._sessions[PS10_MAC_LC] = strip

    # A CB connects, hosting the strip, and reports O1 in Temperature/Cooling
    CB = "0A1B2C3D4EA4"
    cb = ProxySession(CB, bus)
    proxy._sessions[cb.mac] = cb
    cb.device_type = "cb"
    cb.evidence = {"ps10"}
    _process_publish(cb, MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB}",
        message=json.dumps({"method": "getConfigField", "uid": "u1", "data": {
            "ps10": {"O1": {"modeType": 3, "tempAdd": 2,
                            "cycleTime": {"startTime": 43200, "openDur": 3600,
                                          "closeDur": 3600, "times": 1},
                            "timePeriod": [{"enabled": 1, "weekmask": 127,
                                            "startTime": 28800, "endTime": 72000}]}}
        }}).encode(),
    ), bus)
    await hass.async_block_till_done()

    # HA reflects the app-set mode + device type, and only temp entities show
    assert hass.states.get("select.sf_ac10_outlet_1_mode").state == "Temperature"
    assert hass.states.get("select.sf_ac10_outlet_1_temp_device").state == "Cooling"
    assert hass.states.get("text.sf_ac10_outlet_1_cycle_start") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()



async def test_base_switch_stays_visible_in_all_modes(hass: HomeAssistant):
    """Decision (backlog #3): the base outlet On/Off switch remains visible in
    every mode — it's how you apply Manual mode (the device only acts on the
    mode change once on/off is toggled)."""
    entry = await _setup(hass)
    await _make_ps10(hass, entry)

    assert hass.states.get("switch.sf_ac10_outlet_1") is not None
    for mode in ("Cycle", "Temperature", "Drip Irrigation", "Manual"):
        await hass.services.async_call(
            "select", "select_option",
            {"entity_id": "select.sf_ac10_outlet_1_mode", "option": mode},
            blocking=True,
        )
        await hass.async_block_till_done()
        assert hass.states.get("switch.sf_ac10_outlet_1") is not None, \
            f"base switch vanished in {mode} mode"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
