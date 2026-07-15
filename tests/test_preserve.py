"""Tests for customization preservation across removal/reinstall."""
import json
import os

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf import preserve
from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

CB_MAC_RAW, CB_MAC = "0A1B2C3D4E01", "0a1b2c3d4e01"
CB_DATA = {"sensor": {"temp": 24.5, "humi": 61.0}, "light": {"mOnOff": 1, "mLevel": 80}}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture(autouse=True)
def enable_sockets(socket_enabled):
    yield


async def _setup(hass) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18887, "upstream_host": "h", "upstream_port": 8883,
              "allow_control": False, "preserve_on_remove": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _connect_cb(hass, bus):
    s = ProxySession(CB_MAC_RAW, bus)
    for _ in range(3):   # CB typing is tentative (v3.4.0)
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{CB_MAC_RAW}",
            message=json.dumps({"method": "getDevSta", "uid": "u", "data": CB_DATA}).encode(),
        )
        _process_publish(s, pkt, bus)
    return s


async def test_snapshot_and_restore_fills_empties(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    s = _connect_cb(hass, bus)
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    eid = "sensor.sf_dp1_temperature"
    assert reg.async_get(eid) is not None

    # User customizes: rename + icon
    reg.async_update_entity(eid, name="Tent Temp", icon="mdi:sprout")

    # Snapshot (as unload would do)
    await hass.async_add_executor_job(preserve.write_snapshot, hass, entry.entry_id)
    assert os.path.isfile(hass.config.path("sf", "preserved_registry.json"))

    # Simulate removal+reinstall wiping the customization (not the entity)
    reg.async_update_entity(eid, name=None, icon=None)
    assert reg.async_get(eid).name is None

    applied = preserve.restore_customizations(hass, entry.entry_id)
    assert applied >= 1
    restored = reg.async_get(eid)
    assert restored.name == "Tent Temp"
    assert restored.icon == "mdi:sprout"

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_restore_never_overwrites_current(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    s = _connect_cb(hass, bus)
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    eid = "sensor.sf_dp1_temperature"
    reg.async_update_entity(eid, name="Old Name")
    await hass.async_add_executor_job(preserve.write_snapshot, hass, entry.entry_id)

    # User has since set a NEW name — restore must not clobber it
    reg.async_update_entity(eid, name="New Name")
    preserve.restore_customizations(hass, entry.entry_id)
    assert reg.async_get(eid).name == "New Name"

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_clean_removal_deletes_snapshot(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    s = _connect_cb(hass, bus)
    await hass.async_block_till_done()
    er.async_get(hass).async_update_entity("sensor.sf_dp1_temperature", name="X")
    await hass.async_add_executor_job(preserve.write_snapshot, hass, entry.entry_id)
    path = hass.config.path("sf", "preserved_registry.json")
    assert os.path.isfile(path)

    # preserve=False → snapshot deleted; config/sf/ folder now also holds
    # generated certs, so it legitimately remains
    await preserve.handle_removal(hass, entry, preserve=False)
    assert not os.path.isfile(path)

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_preserve_removal_keeps_snapshot(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    s = _connect_cb(hass, bus)
    await hass.async_block_till_done()
    er.async_get(hass).async_update_entity("sensor.sf_dp1_temperature", name="X")
    await hass.async_add_executor_job(preserve.write_snapshot, hass, entry.entry_id)
    path = hass.config.path("sf", "preserved_registry.json")

    await preserve.handle_removal(hass, entry, preserve=True)
    assert os.path.isfile(path)   # kept for the next install

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
