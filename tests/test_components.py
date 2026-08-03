"""Auto-add + hide-after accessory model (3.19.91).

  * A new device auto-creates all its entities (incl. Light 2 / Fan) — no
    confirmation prompt, matching the smoother pre-confirm-first behaviour.
  * Hiding an accessory is opt-in: components[mac][block] = False suppresses it.
  * The migration carries a prior card-driven Hide Light 2 into that decision.
  * Environment entities are created for AC5/AC10 strips too, labelled by the
    strip (not "Display Panel").
"""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf import _seed_component_decisions
from custom_components.sf.const import DOMAIN, DATA_BUS

MAC = "0A1B2C3D4E09"
MAC_LC = "0a1b2c3d4e09"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def _setup(hass: HomeAssistant, options=None) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18974, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        options=options or {},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _uids(hass, entry):
    reg = er.async_get(hass)
    return {
        e.unique_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)
    }


async def test_new_device_auto_adds_all_entities(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light", "light2", "fan"}, cfg)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    # Everything auto-created — no confirmation needed.
    assert f"ggs_{MAC_LC}_light_1" in uids
    assert f"ggs_{MAC_LC}_light_2" in uids
    assert f"ggs_{MAC_LC}_fan" in uids


async def test_hidden_accessory_not_created(hass: HomeAssistant):
    entry = await _setup(hass, options={
        "components": {MAC_LC: {"light2": False}},
    })
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light", "light2", "fan"}, cfg)
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{MAC_LC}_light_2" not in uids   # hidden
    assert f"ggs_{MAC_LC}_fan" in uids           # still auto-created
    assert f"ggs_{MAC_LC}_light_1" in uids


async def test_strip_gets_environment_entities(hass: HomeAssistant):
    """AC5/AC10 carry the same env target block as the panel."""
    PS10, PS10_LC = "0A1B2C3D4E10", "0a1b2c3d4e10"
    entry = await _setup(hass, options={"device_slots": {PS10_LC: "ac10"}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.register_device({"mac": PS10, "type": "ps10"})
    await hass.async_block_till_done()

    uids = _uids(hass, entry)
    assert f"ggs_{PS10_LC}_env_temp_day" in uids
    assert f"ggs_{PS10_LC}_env_humi_night" in uids


async def test_strip_misslotted_as_dp_is_healed(hass: HomeAssistant):
    """3.19.91: a strip wrongly stored on a panel (dp) slot by the confirm-first
    bug is re-slotted to a correct ac5/ac10 slot on next sight."""
    PS10, PS10_LC = "0A1B2C3D4E11", "0a1b2c3d4e11"
    entry = await _setup(hass, options={"device_slots": {PS10_LC: "dp3"}})
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    slot = bus.get_slot(PS10, "ps10")
    assert slot.startswith("ac10")
    assert slot != "dp3"
    assert entry.options["device_slots"][PS10_LC].startswith("ac10")

    # A correctly-slotted strip is left alone.
    PS5, PS5_LC = "0A1B2C3D4E12", "0a1b2c3d4e12"
    bus.hass.config_entries.async_update_entry(
        entry, options={**entry.options,
                        "device_slots": {**entry.options["device_slots"], PS5_LC: "ac5"}},
    )
    assert bus.get_slot(PS5, "ps5") == "ac5"


async def test_indicator_light_survives_prune_blocks(hass: HomeAssistant):
    """3.19.97: with keep-offline OFF, prune_blocks must not delete the strip's
    device-level Indicator Light (it isn't tied to a reported block)."""
    PS5, PS5_LC = "0A1B2C3D4E20", "0a1b2c3d4e20"
    entry = await _setup(hass, options={
        "keep_offline_entities": False,
        "device_slots": {PS5_LC: "ac5"},
    })
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": PS5, "type": "ps5"}
    bus.register_device(cfg)
    evidence = {"sensor:temp", "sensor:humi"}
    bus.blocks_seen(PS5, evidence, cfg)
    await hass.async_block_till_done()
    assert f"ggs_{PS5_LC}_indicator_light" in _uids(hass, entry)

    # Prune leftovers for never-reported blocks — must keep the LED, but still
    # remove a genuine phantom (light_1, since no light block was reported).
    bus.prune_blocks(PS5, evidence, cfg)
    await hass.async_block_till_done()
    uids = _uids(hass, entry)
    assert f"ggs_{PS5_LC}_indicator_light" in uids
    assert f"ggs_{PS5_LC}_light_1" not in uids


async def test_migration_carries_card_hide_light2(hass: HomeAssistant):
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=DOMAIN, data={"listen_port": 18975},
        options={"card_options": {"beefbeefbe02": {"hide_light2": "1"}}},
    )
    entry.add_to_hass(hass)
    _seed_component_decisions(hass, entry)
    assert entry.options["components"]["beefbeefbe02"]["light2"] is False
