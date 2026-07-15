"""Keep-offline option (v3.9.0).

The reported situation: tent gear switched off → its blocks vanish from
reports → on the next HA restart the entities were pruned as phantoms,
and automations errored until the gear reported again.

Default ON: nothing is pruned for missing blocks, and at startup every
registry entry gets a live entity object again (RestoreEntity state), so
automations keep resolving. OFF restores the old phantom-cleanup.
"""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"

FULL_DATA = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "fan": {"mOnOff": 1, "mLevel": 7, "shakeLevel": 3, "natural": 0, "modeType": 0},
    "humidifier": {"on": 1, "mLevel": 2, "modeType": 0},
    "heater": {"mOnOff": 1, "mLevel": 4, "modeType": 0},
}

# Humidifier and heater switched off at the tent → blocks gone entirely
GEAR_OFF_DATA = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "fan": {"mOnOff": 1, "mLevel": 7, "shakeLevel": 3, "natural": 0, "modeType": 0},
}

CHECK_ENTITIES = (
    "switch.sf_dp1_humidifier",
    "number.sf_dp1_humidifier_level",
    "sensor.sf_dp1_humidifier_level",
    "switch.sf_dp1_heater",
    "number.sf_dp1_heater_level",
)


def _pkt(data: dict) -> MQTTPacket:
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps(
            {"method": "getDevSta", "uid": "u1", "data": data}
        ).encode(),
    )


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


def _entry(port: int, **extra) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        title="Spider Farmer Bridge",
        data={
            "listen_port": port,
            "upstream_host": "sf.mqtt.spider-farmer.com",
            "upstream_port": 8883,
            "allow_control": True,
            **extra,
        },
        unique_id=DOMAIN,
    )


def _report(bus, data):
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    return session


async def test_offline_gear_survives_restart(hass: HomeAssistant):
    """Default ON: humidifier/heater off at the tent → entities survive an
    HA restart with live objects, no pruning."""
    from homeassistant.helpers import entity_registry as er

    entry = _entry(18899)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Run 1: everything reports; full entity set exists
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _report(bus, FULL_DATA)
    await hass.async_block_till_done()
    for eid in CHECK_ENTITIES:
        assert hass.states.get(eid) is not None, f"{eid} missing on run 1"

    # "Reboot" HA: unload, then set the entry up again
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Before the device even reports: entities already restored as live
    # objects (this is what keeps automations resolving)
    for eid in CHECK_ENTITIES:
        assert hass.states.get(eid) is not None, f"{eid} not restored at startup"

    # Run 2: device reports WITH the gear off (blocks absent) → still there
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _report(bus, GEAR_OFF_DATA)
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    for eid in CHECK_ENTITIES:
        assert hass.states.get(eid) is not None, f"{eid} vanished after report"
        assert reg.async_get(eid) is not None

    # Gear turned back on → entities go live with fresh data, no dupes
    _report(bus, FULL_DATA)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_humidifier_level").state == "2"
    assert hass.states.get("switch.sf_dp1_humidifier").state == "on"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_option_off_restores_pruning(hass: HomeAssistant):
    """OFF: a registry entry whose block never reports is pruned (the
    pre-3.9.0 phantom cleanup)."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = _entry(18900, keep_offline_entities=False)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Phantom humidifier switch left in the registry
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{CB_MAC_LC}")},
        name="SF Display Panel 4E01",
        manufacturer="Spider Farmer",
        model="Display Panel",
    )
    reg = er.async_get(hass)
    reg.async_get_or_create(
        "switch", DOMAIN, f"ggs_{CB_MAC_LC}_humidifier",
        suggested_object_id="sf_dp1_humidifier",
        device_id=device.id, config_entry=entry,
    )

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _report(bus, GEAR_OFF_DATA)
    await hass.async_block_till_done()

    assert reg.async_get_entity_id(
        "switch", DOMAIN, f"ggs_{CB_MAC_LC}_humidifier"
    ) is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
