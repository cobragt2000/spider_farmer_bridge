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
    # Display panels AND the S-Station have a screen-off setting. The panels report
    # it as configFile.system.scroff; the S-Station answers a targeted
    # getConfigField ["system","scroff"] with a bare data.scroff (v3.19.412).
    for dtype in ("cb", "st"):
        fields = {d.field for d in build_device_entities(
            {"mac": MAC, "type": dtype}, blocks={"sys"}, slot="x")}
        assert "display_off" in fields, f"{dtype} missing display_off"


def test_display_off_entity_not_on_strips():
    fields = {d.field for d in build_device_entities(
        {"mac": MAC, "type": "ps10"}, blocks={"power"}, slot="ac10")}
    assert "display_off" not in fields


def test_firmware_hardware_sensors_on_all_controllers():
    # v3.19.411: fw_version/hw_version are created per controller type (not gated
    # on the sys evidence block, which never fires), populated from getSysSta.
    for dtype, slot in (("cb", "dp1"), ("ps5", "ac5"), ("ps10", "ac10"),
                        ("st", "st"), ("se", "se1")):
        fields = {d.field for d in build_device_entities(
            {"mac": MAC, "type": dtype}, blocks={"light"}, slot=slot)}
        assert "fw_version" in fields, f"{dtype} missing fw_version"
        assert "hw_version" in fields, f"{dtype} missing hw_version"


import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from ha_compat import MockConfigEntry
from custom_components.sf.const import DOMAIN


@pytest.fixture(autouse=True)
def _enable(enable_custom_integrations):
    yield


async def test_migrate_removes_stale_select_display_off(hass: HomeAssistant):
    """v3.19.416: display_off is a number again (0 = off, 1-10 min) so it renders
    like the other Configuration rows. A device adopted while it was a select
    (3.19.307-3.19.415) keeps a stale select.<slot>_display_off ghost showing
    'unavailable'. Setup's migration removes the non-number entity; a number
    entity is unaffected."""
    mac_lc = "0a1b2c3d4e19"
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=DOMAIN, title="SF",
        data={"listen_port": 18988, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883})
    entry.add_to_hass(hass)
    reg = er.async_get(hass)
    stale = reg.async_get_or_create(
        "select", DOMAIN, f"ggs_{mac_lc}_display_off",
        suggested_object_id="sf_dp9_display_off", config_entry=entry)
    assert reg.async_get(stale.entity_id) is not None

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert reg.async_get_entity_id(
        "select", DOMAIN, f"ggs_{mac_lc}_display_off") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_migrate_removes_retired_oplog_sensor(hass: HomeAssistant):
    """v3.19.392: the 'Operations' (oplog) diagnostic sensor was retired (nothing
    consumed it). Setup's migration removes any existing ggs_<mac>_oplog sensor so
    it doesn't linger on the device page as an unavailable ghost."""
    mac_lc = "0a1b2c3d4e1a"
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=DOMAIN, title="SF",
        data={"listen_port": 18989, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883})
    entry.add_to_hass(hass)
    reg = er.async_get(hass)
    stale = reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{mac_lc}_oplog",
        suggested_object_id="sf_dp9_oplog", config_entry=entry)
    assert reg.async_get(stale.entity_id) is not None

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert reg.async_get_entity_id("sensor", DOMAIN, f"ggs_{mac_lc}_oplog") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_migrate_removes_retired_dehumidifier_gear(hass: HomeAssistant):
    """v3.19.419: the duplicate 'Dehumidifier Gear' select was retired. Setup's
    migration removes any existing ggs_<mac>_dehumidifier_gear select so it doesn't
    linger as a disabled 'no longer provided' ghost the user can't delete."""
    mac_lc = "0a1b2c3d4e1b"
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=DOMAIN, title="SF",
        data={"listen_port": 18990, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883})
    entry.add_to_hass(hass)
    reg = er.async_get(hass)
    stale = reg.async_get_or_create(
        "select", DOMAIN, f"ggs_{mac_lc}_dehumidifier_gear",
        suggested_object_id="sf_dp9_dehumidifier_gear", config_entry=entry)
    assert reg.async_get(stale.entity_id) is not None

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert reg.async_get_entity_id(
        "select", DOMAIN, f"ggs_{mac_lc}_dehumidifier_gear") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
