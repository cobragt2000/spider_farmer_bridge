"""Sensor self-clean (temp/humidity probe heating) status — 3.19.188.

The controller sends a `sensorHeating` {phase, remainTime} block only while the
probe's clean cycle runs, and drops air temp/humi/vpd from the report meanwhile.
The integration exposes an on/off flag + remaining seconds so the card can badge
the Air tiles like the SF app.
"""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.normalizer import normalize_status

MAC = "0A1B2C3D4E09"
MAC_LC = "0a1b2c3d4e09"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


def test_decode_cleaning_active():
    out = normalize_status("dev", {"data": {
        "sensor": {"co2": 623, "tempSoil": 23.1, "humiSoil": 0, "ECSoil": 0},
        "sensorHeating": {"remainTime": 7088, "phase": 1}}}, mac=MAC)
    assert out[f"ggs/ha/{MAC_LC}/sensor_cleaning/state"] == "ON"
    assert out[f"ggs/ha/{MAC_LC}/sensor_cleaning_remaining/state"] == "7088"


def test_decode_cleaning_off_on_full_air_frame():
    out = normalize_status("dev", {"data": {
        "sensor": {"temp": 26.1, "humi": 36, "vpd": 1.1}}}, mac=MAC)
    assert out[f"ggs/ha/{MAC_LC}/sensor_cleaning/state"] == "OFF"
    assert out[f"ggs/ha/{MAC_LC}/sensor_cleaning_remaining/state"] == "0"


def test_decode_cleaning_absent_when_no_sensor_block():
    # A partial frame with no sensor block must not touch the cleaning flag.
    out = normalize_status("dev", {"data": {"fan": {"on": 1}}}, mac=MAC)
    assert f"ggs/ha/{MAC_LC}/sensor_cleaning/state" not in out


def test_decode_cleaning_phase_cooling():
    out = normalize_status("dev", {"data": {
        "sensor": {"co2": 623},
        "sensorHeating": {"remainTime": 274, "phase": 2}}}, mac=MAC)
    assert out[f"ggs/ha/{MAC_LC}/sensor_cleaning/state"] == "ON"
    assert out[f"ggs/ha/{MAC_LC}/sensor_cleaning_remaining/state"] == "274"
    assert out[f"ggs/ha/{MAC_LC}/sensor_cleaning_phase/state"] == "2"


def test_decode_cleaning_midcycle_holds_flag():
    # sensor block present but temp/humi still absent (mid-cycle, no sensorHeating
    # in this frame) -> must NOT flip the flag off.
    out = normalize_status("dev", {"data": {
        "sensor": {"co2": 623, "tempSoil": 23.1}}}, mac=MAC)
    assert f"ggs/ha/{MAC_LC}/sensor_cleaning/state" not in out


async def test_cleaning_entities_created_mid_clean(hass: HomeAssistant):
    # A controller that is already cleaning at detection withholds temp/humi, so
    # the cleaning entities must still be created from the sensorHeating evidence.
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"sensorHeating"}, cfg)
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    uids = {e.unique_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)}
    assert f"ggs_{MAC_LC}_sensor_cleaning" in uids
    assert f"ggs_{MAC_LC}_sensor_cleaning_remaining" in uids


async def test_set_sensor_heating_command_payload():
    from custom_components.sf.proxy.mitm_proxy import MITMProxy, _mac
    prox = MITMProxy.__new__(MITMProxy)
    prox._sessions = {}
    captured = []

    class FakeSess:
        mac_raw = "0a1b2c3d4e07"
        uid = "12345"
        async def inject(self, payload):
            captured.append(payload)

    prox._sessions[_mac("0a1b2c3d4e07")] = FakeSess()
    assert await prox.set_sensor_heating("0a1b2c3d4e07", True)
    assert captured[0]["method"] == "setSensorHeating"
    assert captured[0]["params"] == {"on": 1}
    assert captured[0]["pid"] == "0A1B2C3D4E07"
    assert captured[0]["uid"] == "12345"
    await prox.set_sensor_heating("0a1b2c3d4e07", False)
    assert captured[1]["params"] == {"on": 0}


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge", unique_id=DOMAIN,
        data={"listen_port": 18981, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True}, options={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_cleaning_entities_created_with_air_sensor(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"sensor:temp", "sensor:humi"}, cfg)
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    uids = {e.unique_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)}
    assert f"ggs_{MAC_LC}_sensor_cleaning" in uids
    assert f"ggs_{MAC_LC}_sensor_cleaning_remaining" in uids
