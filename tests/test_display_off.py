"""Display Off / Auto Screen Off (system.scroff) — command + entity (v3.19.259)."""

from custom_components.sf.proxy.command_handler import translate_command
from custom_components.sf.entity_defs import build_device_entities

MAC = "0A1B2C3D4E18"


def test_display_off_command_minutes_to_seconds():
    cmd = translate_command("display_off", "5", MAC, "u1")
    assert cmd["method"] == "setConfigField"
    assert cmd["params"]["keyPath"] == ["system", "scroff"]
    assert cmd["params"]["scroff"] == 300      # 5 min -> 300 s


def test_display_off_command_off():
    for v in ("0", "Off"):
        cmd = translate_command("display_off", v, MAC, "u1")
        assert cmd["params"]["scroff"] == 0


def test_display_off_entity_on_screen_devices():
    for dtype in ("cb", "st"):
        fields = {d.field for d in build_device_entities(
            {"mac": MAC, "type": dtype}, blocks={"sys"}, slot="x")}
        assert "display_off" in fields


def test_display_off_entity_not_on_strips():
    fields = {d.field for d in build_device_entities(
        {"mac": MAC, "type": "ps10"}, blocks={"power"}, slot="ac10")}
    assert "display_off" not in fields


import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry
from custom_components.sf.const import DOMAIN


@pytest.fixture(autouse=True)
def _enable(enable_custom_integrations):
    yield


async def test_migrate_removes_stale_number_display_off(hass: HomeAssistant):
    """v3.19.307: display_off was a number before it became a select (same
    unique_id, different domain). A display panel adopted before the change kept
    a stale number.<slot>_display_off ghost showing 'unavailable'. Setup's
    migration removes the number-domain entity; the select is unaffected."""
    mac_lc = "0a1b2c3d4e19"
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=DOMAIN, title="SF",
        data={"listen_port": 18988, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883})
    entry.add_to_hass(hass)
    reg = er.async_get(hass)
    stale = reg.async_get_or_create(
        "number", DOMAIN, f"ggs_{mac_lc}_display_off",
        suggested_object_id="sf_dp9_display_off", config_entry=entry)
    assert reg.async_get(stale.entity_id) is not None

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert reg.async_get_entity_id(
        "number", DOMAIN, f"ggs_{mac_lc}_display_off") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
