"""Regression: outlet Mode select must survive a keep-offline restart.

The restore re-registers the outlet switch (build_device_entities) but not the
dynamically-built Mode select. outlet_seen used to skip the Mode select when
the switch was already registered, leaving it "no longer provided" after a
restart. It must now be created independently of the switch.
"""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant
from custom_components.sf.const import DOMAIN, DATA_BUS

PS5_MAC = "0A1B2C3D4E04"
PS5_MAC_LC = "0a1b2c3d4e04"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18971, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_mode_select_recreated_when_switch_already_registered(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": PS5_MAC, "type": "ps5"}
    # Simulate the keep-offline restore: switch already registered, Mode not.
    bus._registered.add(f"ggs_{PS5_MAC_LC}_outlet_1")

    bus.outlet_seen(PS5_MAC, 1, cfg)
    await hass.async_block_till_done()

    assert hass.states.get("select.sf_ac5_outlet_1_mode") is not None, \
        "Mode select was not recreated after the switch was already registered"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_first_time_creates_switch_and_mode(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.outlet_seen(PS5_MAC, 2, {"mac": PS5_MAC, "type": "ps5"})
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_ac5_outlet_2") is not None
    assert hass.states.get("select.sf_ac5_outlet_2_mode") is not None
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
