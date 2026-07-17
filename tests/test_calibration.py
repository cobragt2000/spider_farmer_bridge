"""Editable diagnostic entities: air + soil calibration offsets + substrate
(number/select), plus their reported values from senConfig/calibration."""
import json
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH
from custom_components.sf.ha.discovery import publish_soil_sensor_discovery

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"
CB_SOIL = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "sensors": [{"id": "AA01", "type": 2, "tempSoil": 22.1, "humiSoil": 45.0, "ECSoil": 1.2, "mst_fw_ver": 4}],
}


def _pkt(data):
    return MQTTPacket(packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode())


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18991, "upstream_host": "h", "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_calibration_and_substrate_read(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(CB_SOIL), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    publish_soil_sensor_discovery(bus, CB_MAC, "AA01", {"mac": CB_MAC, "type": "CB"})
    await hass.async_block_till_done()

    # Soil calibration + substrate from senConfig (tempSoil degC -> degF display)
    bus.apply_soil_labels(CB_MAC, [{
        "id": "AA01", "type": 2,
        "calibration": {"tempSoil": -0.2778, "humiSoil": -0.5, "ECSoil": -0.5},
        "soilType": 1, "label": "Front Left",
    }])
    await hass.async_block_till_done()
    assert hass.states.get("number.sf_dp1_soil1_cal_temp").state == "-0.5"      # -0.2778 C -> -0.5 F
    assert hass.states.get("number.sf_dp1_soil1_cal_moisture").state == "-0.5"
    assert hass.states.get("number.sf_dp1_soil1_cal_ec").state == "-0.5"
    assert hass.states.get("select.sf_dp1_soil1_substrate").state == "Coco coir"  # soilType 1

    # Air calibration (top-level block)
    bus.apply_air_calibration(CB_MAC, {"temp": -0.0556, "humi": -0.1, "co2": -10.0, "ppfd": -0.1})
    await hass.async_block_till_done()
    assert hass.states.get("number.sf_dp1_cal_air_temp").state == "-0.1"        # -0.0556 C -> -0.1 F
    assert hass.states.get("number.sf_dp1_cal_air_humidity").state == "-0.1"
    assert hass.states.get("number.sf_dp1_cal_co2").state == "-10.0"
    assert hass.states.get("number.sf_dp1_cal_ppfd").state == "-0.1"
    # cached for the (future) write path
    assert bus._air_cal[CB_MAC_LC]["co2"] == -10.0

    # Absent calibration -> defaults to 0 (so it shows without an app change).
    bus.apply_soil_labels(CB_MAC, [{"id": "AA01", "type": 2, "label": "Front Left"}])
    await hass.async_block_till_done()
    assert hass.states.get("number.sf_dp1_soil1_cal_temp").state == "0.0"
    assert hass.states.get("number.sf_dp1_soil1_cal_ec").state == "0.0"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
