"""Power-strip device nesting under its host display panel (via_device)."""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from custom_components.sf.const import DOMAIN, DATA_BUS

CB_MAC = "0a1b2c3d4e01"
PS_MAC = "0a1b2c3d4e0a"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


class _FakeProxy:
    def __init__(self, host=None):
        self.host = host

    def host_cb_mac_for_strip(self, mac):
        return self.host


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18941, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_strip_nests_under_host_panel_and_unnest(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    reg = dr.async_get(hass)
    panel = reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{CB_MAC}")},
        name="SF Display Panel 4E01", manufacturer="Spider Farmer",
        model="Display Panel",
    )
    strip = reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{PS_MAC}")},
        name="SF Power Strip AC10 4E0A", manufacturer="Spider Farmer",
        model="Power Strip AC10",
    )
    assert strip.via_device_id is None

    # Hosted by the panel -> strip nests under it.
    bus.proxy = _FakeProxy(host=CB_MAC)
    bus._update_strip_nesting({"mac": PS_MAC, "type": "ps10"})
    strip = reg.async_get_device({(DOMAIN, f"ggs_{PS_MAC}")})
    assert strip.via_device_id == panel.id

    # Standalone (no host) -> link cleared, back to top-level.
    bus.proxy = _FakeProxy(host=None)
    bus._update_strip_nesting({"mac": PS_MAC, "type": "ps10"})
    strip = reg.async_get_device({(DOMAIN, f"ggs_{PS_MAC}")})
    assert strip.via_device_id is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_non_strip_ignored(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.proxy = _FakeProxy(host=CB_MAC)
    # A display panel is not a strip -> no-op, no error.
    bus._update_strip_nesting({"mac": CB_MAC, "type": "cb"})
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_register_device_periodic_nests_late_host(hass: HomeAssistant):
    """The periodic discovery path (register_device, ~every 60s) re-evaluates
    nesting, so a strip that connected before its host panel still nests once
    both are present — not only on the first block report."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    reg = dr.async_get(hass)
    panel = reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{CB_MAC}")},
        name="SF Display Panel 4E01", manufacturer="Spider Farmer",
        model="Display Panel",
    )
    strip = reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{PS_MAC}")},
        name="SF Power Strip AC10 4E0A", manufacturer="Spider Farmer",
        model="Power Strip AC10",
    )
    assert strip.via_device_id is None

    bus.proxy = _FakeProxy(host=CB_MAC)
    bus.register_device({"mac": PS_MAC, "type": "PS10"})
    strip = reg.async_get_device({(DOMAIN, f"ggs_{PS_MAC}")})
    assert strip.via_device_id == panel.id

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
