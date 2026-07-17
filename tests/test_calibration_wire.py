"""End-to-end: editing an air-cal number / substrate select in HA reaches the
wire as the right setConfigField message (RMW from the cached config file)."""
import asyncio
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH, parse_packets
from custom_components.sf.ha.discovery import publish_soil_sensor_discovery

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"

FRAME = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "sensors": [{"id": "AA01", "type": 2, "tempSoil": 22.1, "humiSoil": 45.0,
                 "ECSoil": 1.2, "mst_fw_ver": 4}],   # mst_fw_ver != 65535 -> Pro
}
CFGFILE = {"configFile": {
    "calibration": {"temp": 0.0, "humi": 0.0, "co2": 0, "ppfd": 0.0},
    "device": {"senConfig": [
        {"id": "AA01", "type": 2, "soilType": 1,
         "calibration": {"tempSoil": 0.0, "humiSoil": 0.0, "ECSoil": 0.0}},
        {"id": "BB02", "type": 2, "soilType": 0,
         "calibration": {"tempSoil": 9.9, "humiSoil": 8.8, "ECSoil": 1.1}},
    ]},
}}


def _pkt(method, data):
    return MQTTPacket(packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": method, "uid": "u1", "data": data}).encode())


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18997, "upstream_host": "h", "upstream_port": 8883,
              "allow_control": True}, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _cmds(captured, keypath):
    pkts, _ = parse_packets(bytes(captured))
    out = []
    for p in pkts:
        if not p.message:
            continue
        m = json.loads(p.message)
        if m.get("method") == "setConfigField" and m["params"].get("keyPath") == keypath:
            out.append(m)
    return out


async def test_air_and_substrate_writes_reach_wire(hass: HomeAssistant):
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
        _process_publish(session, _pkt("getDevSta", FRAME), bus)
    _process_publish(session, _pkt("getConfigFile", CFGFILE), bus)
    publish_soil_sensor_discovery(bus, CB_MAC, "AA01", {"mac": CB_MAC, "type": "CB"})
    await hass.async_block_till_done()

    # caches populated from the config file
    assert session.cal_cfg and isinstance(session.senconfig, list)

    # 1) Air-temp offset: 0.5 degF -> degC on the wire, RMW whole block
    captured.clear()
    await hass.services.async_call("number", "set_value",
        {"entity_id": "number.sf_dp1_cal_air_temp", "value": 0.5}, blocking=True)
    await asyncio.sleep(0.05)
    cmds = _cmds(captured, ["calibration"])
    assert cmds, "air-cal write did not reach the wire"
    assert abs(cmds[-1]["params"]["calibration"]["temp"] - 0.5 * 5 / 9) < 1e-3

    # 2) Substrate select: label -> soilType index, other probe preserved
    captured.clear()
    await hass.services.async_call("select", "select_option",
        {"entity_id": "select.sf_dp1_soil1_substrate", "option": "Peat soil"},
        blocking=True)
    await asyncio.sleep(0.05)
    cmds = _cmds(captured, ["device", "senConfig"])
    assert cmds, "substrate write did not reach the wire"
    arr = cmds[-1]["params"]["senConfig"]
    assert next(e for e in arr if e["id"] == "AA01")["soilType"] == 2
    assert next(e for e in arr if e["id"] == "BB02")["calibration"]["tempSoil"] == 9.9

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
