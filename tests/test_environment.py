"""Environment target device (per display panel)."""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.proxy.command_handler import translate_command
from custom_components.sf.proxy.normalizer import normalize_target
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import (
    MQTTPacket, MQTT_PUBLISH, parse_packets,
)

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"

CB_FRAME = {
    "sensor": {"temp": 27, "humi": 55.5},
    "light": {"mOnOff": 1, "mLevel": 80},
}
# Verbatim from the 2026-07-13 capture
TARGET = {
    "dayTime": {"startTime": 27000, "endTime": 70200},
    "temp": {"targetDay": 17.2222, "targetNight": 17.2222, "deadband": 0.5556},
    "humi": {"targetDay": 55, "targetNight": 55, "deadband": 2},
    "co2": {"targetDay": 1200, "targetNight": 500, "deadband": 250},
}


def _pkt(method, data):
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": method, "uid": "u1", "data": data}).encode(),
    )


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18909, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def test_normalize_target_c_to_f():
    out = normalize_target(CB_MAC, TARGET)
    e = CB_MAC_LC
    assert out[f"ggs/ha/{e}/env_day_start/state"] == "07:30"
    assert out[f"ggs/ha/{e}/env_day_end/state"] == "19:30"
    assert out[f"ggs/ha/{e}/env_temp_day/state"] == "63"      # 17.2222C -> 63F
    assert out[f"ggs/ha/{e}/env_temp_night/state"] == "63"
    assert out[f"ggs/ha/{e}/env_temp_deadband/state"] == "1"  # 0.5556C -> 1F
    assert out[f"ggs/ha/{e}/env_humi_day/state"] == "55"
    assert out[f"ggs/ha/{e}/env_co2_day/state"] == "1200"
    assert out[f"ggs/ha/{e}/env_co2_night/state"] == "500"
    assert out[f"ggs/ha/{e}/env_co2_deadband/state"] == "250"


def test_env_write_f_to_c_block_preserving():
    # Temp day 64F -> ~17.7778C, other fields preserved
    cmd = translate_command("env_temp_day", "64", CB_MAC, "u1", env_cfg=TARGET)
    assert cmd["params"]["keyPath"] == ["target"]
    t = cmd["params"]["target"]
    assert abs(t["temp"]["targetDay"] - 17.7778) < 0.01
    assert t["temp"]["targetNight"] == 17.2222          # preserved
    assert t["humi"]["targetDay"] == 55                 # preserved
    assert t["co2"]["targetDay"] == 1200                # preserved

    # Deadband 2F -> ~1.1111C
    cmd = translate_command("env_temp_deadband", "2", CB_MAC, "u1", env_cfg=TARGET)
    assert abs(cmd["params"]["target"]["temp"]["deadband"] - 1.1111) < 0.01

    # CO2 day is a plain int passthrough
    cmd = translate_command("env_co2_day", "1500", CB_MAC, "u1", env_cfg=TARGET)
    assert cmd["params"]["target"]["co2"]["targetDay"] == 1500

    # Day start HH:MM -> seconds
    cmd = translate_command("env_day_start", "06:00", CB_MAC, "u1", env_cfg=TARGET)
    assert cmd["params"]["target"]["dayTime"]["startTime"] == 21600


async def test_env_device_created_and_synced(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", CB_FRAME), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    # env target arrives via a getConfigField ["target"] response
    _process_publish(session, _pkt("getConfigField", {"target": TARGET}), bus)
    await hass.async_block_till_done()

    # Entities exist, on their own Environment device, with synced values
    assert hass.states.get("number.sf_dp1_env_temp_day").state == "63.0"
    assert hass.states.get("text.sf_dp1_env_day_start").state == "07:30"
    assert hass.states.get("number.sf_dp1_env_co2_night").state == "500.0"
    # units are shown on the sliders
    assert hass.states.get("number.sf_dp1_env_co2_day").attributes[
        "unit_of_measurement"] == "ppm"
    assert hass.states.get("number.sf_dp1_env_humi_day").attributes[
        "unit_of_measurement"] == "%"
    assert hass.states.get("number.sf_dp1_env_temp_day").attributes[
        "unit_of_measurement"] == "\u00b0F"
    # AUTO mode (HA picks slider/box per range) + corrected dead-zone ranges
    # Targets = manual-entry boxes; dead zones = sliders
    for t in ("temp_day", "temp_night", "humi_day", "humi_night",
              "co2_day", "co2_night"):
        assert hass.states.get(f"number.sf_dp1_env_{t}").attributes["mode"] == "box"
    for dz in ("temp_deadband", "humi_deadband", "co2_deadband"):
        assert hass.states.get(f"number.sf_dp1_env_{dz}").attributes["mode"] == "slider"
    cd = hass.states.get("number.sf_dp1_env_co2_day").attributes
    assert cd["min"] == 300 and cd["max"] == 2500 and cd["step"] == 10
    td = hass.states.get("number.sf_dp1_env_temp_day").attributes
    assert td["min"] == 32 and td["max"] == 122 and td["step"] == 1
    dz = hass.states.get("number.sf_dp1_env_temp_deadband").attributes
    assert dz["min"] == 1 and dz["max"] == 18
    hz = hass.states.get("number.sf_dp1_env_humi_deadband").attributes
    assert hz["min"] == 1 and hz["max"] == 10
    cz = hass.states.get("number.sf_dp1_env_co2_deadband").attributes
    assert cz["min"] == 10 and cz["max"] == 250 and cz["step"] == 10

    from homeassistant.helpers import device_registry as dr
    reg = dr.async_get(hass)
    env_dev = reg.async_get_device({(DOMAIN, f"ggs_{CB_MAC_LC}_env")})
    assert env_dev is not None and env_dev.name == "SF Display Panel 4E01 Environment"
    # Separate from the display panel device
    panel = reg.async_get_device({(DOMAIN, f"ggs_{CB_MAC_LC}")})
    assert panel is not None and panel.id != env_dev.id
    # env nests under the panel via via_device
    assert env_dev.via_device_id == panel.id

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_env_write_reaches_wire(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.allow_control = True

    session = ProxySession(CB_MAC, bus)
    captured = bytearray()
    class _W:
        def write(self, d): captured.extend(d)
        async def drain(self): pass
    session._client_writer = _W()
    session.confirm_delay = 0.01
    proxy._sessions[CB_MAC_LC] = session
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", CB_FRAME), bus)
    _process_publish(session, _pkt("getConfigField", {"target": TARGET}), bus)
    await hass.async_block_till_done()

    captured.clear()
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_env_temp_day", "value": 70}, blocking=True,
    )
    import asyncio
    await asyncio.sleep(0.05)
    pkts, _ = parse_packets(bytes(captured))
    cmds = [json.loads(p.message) for p in pkts if p.message
            and json.loads(p.message).get("method") == "setConfigField"
            and json.loads(p.message)["params"].get("keyPath") == ["target"]]
    assert cmds, "env write did not reach the wire"
    assert abs(cmds[-1]["params"]["target"]["temp"]["targetDay"] - 21.1111) < 0.01

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_env_entities_disabled_option(hass: HomeAssistant):
    """With the Environment option off, no env device/entities are created."""
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18910, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True,
              "environment_entities": False},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", CB_FRAME), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    _process_publish(session, _pkt("getConfigField", {"target": TARGET}), bus)
    await hass.async_block_till_done()

    assert hass.states.get("number.sf_dp1_env_temp_day") is None
    from homeassistant.helpers import device_registry as dr
    assert dr.async_get(hass).async_get_device(
        {(DOMAIN, f"ggs_{CB_MAC_LC}_env")}) is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_day_stop_label(hass: HomeAssistant):
    """Day Cycle End is now 'Day Cycle Stop' (Start sorts before Stop)."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", CB_FRAME), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    _process_publish(session, _pkt("getConfigField", {"target": TARGET}), bus)
    await hass.async_block_till_done()

    st = hass.states.get("text.sf_dp1_env_day_end")
    assert st is not None
    assert st.attributes.get("friendly_name", "").endswith("Day Cycle Stop")

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
