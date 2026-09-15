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


SE_MAC_LC = "0a1b2c3d4e02"    # an SE light removed from service (never reports)
CONN_MAC_LC = "0a1b2c3d4e03"  # a controller that DID connect this session


async def test_offline_whole_device_pruned_when_option_off(hass: HomeAssistant):
    """OFF: a WHOLE device that never connects this session is removed
    (prune_offline_devices), while a device that DID check in is kept. This is
    the gap prune_blocks can't cover — it only cleans per-block phantoms on a
    device that is reporting. (v3.19.304)"""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = _entry(18901, keep_offline_entities=False)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)

    # A removed SE light: device + entity in the registry, never reported.
    gone_dev = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{SE_MAC_LC}")},
        name="SF SE4500", manufacturer="Spider Farmer", model="SE Light",
    )
    ent_reg.async_get_or_create(
        "light", DOMAIN, f"ggs_{SE_MAC_LC}_light_1",
        suggested_object_id="sf_se1_light_1",
        device_id=gone_dev.id, config_entry=entry,
    )
    # A controller that connected this session (published availability).
    live_dev = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{CONN_MAC_LC}")},
        name="SF Display Panel 4E03", manufacturer="Spider Farmer", model="Display Panel",
    )
    ent_reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{CONN_MAC_LC}_temperature",
        suggested_object_id="sf_dp5_temperature",
        device_id=live_dev.id, config_entry=entry,
    )

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.device_available[CONN_MAC_LC] = True     # it checked in this session

    removed = bus.prune_offline_devices()
    await hass.async_block_till_done()

    assert removed == 1
    # The gone SE device and its entity are removed…
    assert dev_reg.async_get_device(identifiers={(DOMAIN, f"ggs_{SE_MAC_LC}")}) is None
    assert ent_reg.async_get_entity_id("light", DOMAIN, f"ggs_{SE_MAC_LC}_light_1") is None
    # …while the connected controller is untouched.
    assert dev_reg.async_get_device(identifiers={(DOMAIN, f"ggs_{CONN_MAC_LC}")}) is not None
    assert ent_reg.async_get_entity_id(
        "sensor", DOMAIN, f"ggs_{CONN_MAC_LC}_temperature") is not None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_offline_whole_device_kept_when_option_on(hass: HomeAssistant):
    """Default ON: prune_offline_devices is a no-op — dormant gear is preserved."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = _entry(18902)   # keep_offline defaults ON
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)
    dev = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{SE_MAC_LC}")},
        name="SF SE4500", manufacturer="Spider Farmer", model="SE Light",
    )
    ent_reg.async_get_or_create(
        "light", DOMAIN, f"ggs_{SE_MAC_LC}_light_1",
        suggested_object_id="sf_se1_light_1",
        device_id=dev.id, config_entry=entry,
    )

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    assert bus.prune_offline_devices() == 0
    await hass.async_block_till_done()
    assert dev_reg.async_get_device(identifiers={(DOMAIN, f"ggs_{SE_MAC_LC}")}) is not None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_prune_removes_all_option_traces(hass: HomeAssistant):
    """OFF: pruning removes ALL stored traces (device_slots, components, per-mac
    runtime dicts), for a device pruned now AND for an older orphan whose registry
    entry was deleted earlier but whose slot lingered — so nothing shows as
    'unknown device' in the config screens. Connected devices keep theirs.
    (v3.19.306)"""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    ORPHAN = "0a1b2c3d4e04"   # in device_slots, NO registry device (old delete)
    GONE = "0a1b2c3d4e05"     # registry device+entity, never connected -> pruned
    CONN = "0a1b2c3d4e06"     # connected this session -> kept

    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18903, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        options={
            "keep_offline_entities": False,
            "device_slots": {ORPHAN: "dp1", GONE: "se1", CONN: "dp2"},
            "components": {GONE: {"light2": False}, CONN: {"fan": True}},
            "outlet_env": {GONE: {"1": {"mode": "Humidity"}},
                           CONN: {"1": {"mode": "Temperature"}}},
        },
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)
    for mac, model in ((GONE, "SE Light"), (CONN, "Display Panel")):
        d = dev_reg.async_get_or_create(
            config_entry_id=entry.entry_id,
            identifiers={(DOMAIN, f"ggs_{mac}")},
            name=f"dev {mac}", manufacturer="Spider Farmer", model=model,
        )
        ent_reg.async_get_or_create(
            "sensor", DOMAIN, f"ggs_{mac}_temperature",
            suggested_object_id=f"sf_{mac}_temperature",
            device_id=d.id, config_entry=entry,
        )

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.device_available[CONN] = True

    bus.prune_offline_devices()
    await hass.async_block_till_done()

    opts = entry.options
    # GONE (pruned) and ORPHAN (stale slot) wiped from every dict…
    assert ORPHAN not in opts["device_slots"]
    assert GONE not in opts["device_slots"]
    assert GONE not in opts["components"]
    assert GONE not in opts["outlet_env"]
    # …connected device keeps all of its traces.
    assert opts["device_slots"].get(CONN) == "dp2"
    assert CONN in opts["components"]
    assert CONN in opts["outlet_env"]

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_prune_removes_orphaned_soil_mappings(hass: HomeAssistant):
    """v3.19.309: a soil probe whose parent controller was removed has no
    surviving soil entity, so its soil_slots/soil_types mapping (keyed by serial,
    not MAC — missed by purge_device_slots) is purged. A probe with live entities
    is kept."""
    from homeassistant.helpers import entity_registry as er

    LIVE_MAC = "0a1b2c3d4e07"
    LIVE_SERIAL = "aa01"
    ORPHAN_SERIAL = "deadbeef1234"

    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=DOMAIN, title="SF",
        data={"listen_port": 18904, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883},
        options={
            "keep_offline_entities": False,
            "soil_slots": {LIVE_SERIAL: "soil1", ORPHAN_SERIAL: "soil2"},
            "soil_types": {LIVE_SERIAL: "Basic", ORPHAN_SERIAL: "Pro"},
        },
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # The live probe has a real soil entity; the orphan has none.
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{LIVE_MAC}_soil_{LIVE_SERIAL}_temperature",
        suggested_object_id="sf_dp1_soil1_temperature", config_entry=entry)

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    assert bus.purge_orphan_soil() == 1
    await hass.async_block_till_done()

    opts = entry.options
    assert LIVE_SERIAL in opts["soil_slots"]
    assert LIVE_SERIAL in opts["soil_types"]
    assert ORPHAN_SERIAL not in opts["soil_slots"]
    assert ORPHAN_SERIAL not in opts["soil_types"]

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
