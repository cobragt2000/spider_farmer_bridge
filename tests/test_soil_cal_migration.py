"""Cleanup migration for the 3.18.0-3.18.2 phantom soil-cal fallout."""
import pytest
from ha_compat import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf.const import DOMAIN
from custom_components.sf import _migrate_soil_cal_entity_ids

MAC = "0a1b2c3d4e01"
SER = "3835323810308714"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def test_phantom_removed_and_cal_rehomed(hass: HomeAssistant):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18995, "upstream_host": "h", "upstream_port": 8883},
        options={"device_slots": {MAC: "dp1"}, "soil_slots": {SER.lower(): "soil2"}},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    reg = er.async_get(hass)

    # Pure-phantom cal_temperature (parked at a phantom probe id) + churned cal_ec.
    reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_temperature",
        suggested_object_id="sf_dp1_soil5_temperature", config_entry=entry)
    reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_ec",
        suggested_object_id="sf_dp1_soil6_ec", config_entry=entry)

    _migrate_soil_cal_entity_ids(hass, entry)
    await hass.async_block_till_done()

    # Phantom cal_temperature removed entirely.
    assert reg.async_get_entity_id(
        "sensor", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_temperature") is None
    # Real cal_ec re-homed to its correct id (history preserved via unique_id).
    assert reg.async_get_entity_id(
        "sensor", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_ec"
    ) == "sensor.sf_dp1_soil2_cal_ec"


async def test_number_cal_entities_left_alone(hass: HomeAssistant):
    """Regression (3.19.1): the sensor-era cleanup must not touch the new
    editable number./select. calibration entities. They share the same
    unique_ids, and parking them under a sensor. temp id fails with
    'New entity ID should be same domain'."""
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18994, "upstream_host": "h", "upstream_port": 8883},
        options={"device_slots": {MAC: "dp1"}, "soil_slots": {SER.lower(): "soil2"}},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    reg = er.async_get(hass)

    # New editable entities, already homed correctly by their platform.
    reg.async_get_or_create(
        "number", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_ec",
        suggested_object_id="sf_dp1_soil2_cal_ec", config_entry=entry)
    reg.async_get_or_create(
        "number", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_moisture",
        suggested_object_id="sf_dp1_soil2_cal_moisture", config_entry=entry)

    _migrate_soil_cal_entity_ids(hass, entry)
    await hass.async_block_till_done()

    # Untouched — still on their number. ids.
    assert reg.async_get_entity_id(
        "number", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_ec"
    ) == "number.sf_dp1_soil2_cal_ec"
    assert reg.async_get_entity_id(
        "number", DOMAIN, f"ggs_{MAC}_soil_{SER}_cal_moisture"
    ) == "number.sf_dp1_soil2_cal_moisture"
