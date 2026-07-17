"""3.19.0 migration: old read-only calibration/substrate SENSORS are removed
so the new editable number/select entities (same unique_ids) take over."""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf.const import DOMAIN
from custom_components.sf import _migrate_cal_to_editable

MAC = "0a1b2c3d4e01"
SER = "3835323810308714"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def test_old_sensor_cal_removed_new_kept(hass: HomeAssistant):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18996, "upstream_host": "h", "upstream_port": 8883},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    reg = er.async_get(hass)

    # Old read-only sensors (3.18.x) that must be swept.
    for uid in (f"ggs_{MAC}_cal_air_temp", f"ggs_{MAC}_cal_co2",
                f"ggs_{MAC}_soil_{SER}_cal_temp", f"ggs_{MAC}_soil_{SER}_cal_ec",
                f"ggs_{MAC}_soil_{SER}_substrate"):
        reg.async_get_or_create("sensor", DOMAIN, uid, config_entry=entry)
    # New editable entities already present (idempotency): must survive.
    reg.async_get_or_create("number", DOMAIN, f"ggs_{MAC}_cal_air_temp", config_entry=entry)
    reg.async_get_or_create("select", DOMAIN, f"ggs_{MAC}_soil_{SER}_substrate", config_entry=entry)
    # An unrelated sensor must not be touched.
    reg.async_get_or_create("sensor", DOMAIN, f"ggs_{MAC}_temperature", config_entry=entry)

    _migrate_cal_to_editable(hass, entry)
    await hass.async_block_till_done()

    # Every old sensor-domain cal/substrate entity is gone.
    for uid in (f"ggs_{MAC}_cal_air_temp", f"ggs_{MAC}_cal_co2",
                f"ggs_{MAC}_soil_{SER}_cal_temp", f"ggs_{MAC}_soil_{SER}_cal_ec",
                f"ggs_{MAC}_soil_{SER}_substrate"):
        assert reg.async_get_entity_id("sensor", DOMAIN, uid) is None
    # Editable replacements + the unrelated sensor remain.
    assert reg.async_get_entity_id("number", DOMAIN, f"ggs_{MAC}_cal_air_temp") is not None
    assert reg.async_get_entity_id("select", DOMAIN, f"ggs_{MAC}_soil_{SER}_substrate") is not None
    assert reg.async_get_entity_id("sensor", DOMAIN, f"ggs_{MAC}_temperature") is not None

    # Idempotent second run is a no-op.
    _migrate_cal_to_editable(hass, entry)
    await hass.async_block_till_done()
    assert reg.async_get_entity_id("number", DOMAIN, f"ggs_{MAC}_cal_air_temp") is not None
