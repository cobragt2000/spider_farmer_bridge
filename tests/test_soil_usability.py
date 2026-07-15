"""Soil usability: Pro/Basic detection + one-step probe replace (3.11.2b1)."""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"


def _frame(sensors):
    return {"sensor": {"temp": 24.5, "humi": 61.0}, "sensors": sensors}


def _pkt(data):
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
    )


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18906, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_pro_basic_detection(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(_frame([
            {"id": "avg", "tempSoil": 24, "humiSoil": 40, "ECSoil": 1},
            {"id": "A1B2C3D4E5F60001", "type": 2, "tempSoil": 23.8,
             "humiSoil": 44, "ECSoil": 1.1, "mst_fw_ver": 4},      # Pro
            {"id": "AA01", "type": 2, "tempSoil": 22, "humiSoil": 80,
             "ECSoil": 1.2, "mst_fw_ver": 65535},                  # Basic
        ])), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    assert bus._soil_type["a1b2c3d4e5f60001"] == "Pro"
    assert bus._soil_type["aa01"] == "Basic"
    # persisted to options
    types = entry.options.get("soil_types", {})
    assert types.get("a1b2c3d4e5f60001") == "Pro"
    assert types.get("aa01") == "Basic"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_replace_soil_transfers_slot(hass: HomeAssistant):
    """One-step replace: new probe inherits old probe's slot; old retired;
    slot-based entity_ids (and history) continue."""
    from homeassistant.helpers import entity_registry as er

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    OLD, NEW = "a1b2c3d4e5f60003", "a1b2c3d4e5f60004"
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(_frame([
            {"id": OLD, "type": 2, "tempSoil": 23, "humiSoil": 40,
             "ECSoil": 1, "mst_fw_ver": 4},
            {"id": NEW, "type": 2, "tempSoil": 24, "humiSoil": 50,
             "ECSoil": 1, "mst_fw_ver": 4},
        ])), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    old_slot = entry.options["soil_slots"][OLD]  # e.g. soil1
    reg = er.async_get(hass)
    old_eid = reg.async_get_entity_id("sensor", DOMAIN, f"ggs_{CB_MAC_LC}_soil_{OLD}_moisture")
    assert old_eid is not None

    # Drive the replace step directly on the options flow handler
    from custom_components.sf.config_flow import SfBridgeOptionsFlow
    oh = SfBridgeOptionsFlow(entry)
    oh.hass = hass
    res = await oh.async_step_replace_soil({"old_probe": OLD, "new_probe": NEW})
    assert res["type"] == "create_entry"
    await hass.async_block_till_done()

    # New probe now owns the old slot; old probe's mapping gone
    assert entry.options["soil_slots"].get(NEW) == old_slot
    assert OLD not in entry.options["soil_slots"]

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
