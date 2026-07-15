"""Tests for device deletion, migration, and the staleness grace window."""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from custom_components.sf import async_remove_config_entry_device
from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.migrate import migrate_device
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

OLD_MAC_RAW, OLD_MAC = "0A1B2C3D4E01", "0a1b2c3d4e01"
NEW_MAC_RAW, NEW_MAC = "0A1B2C3FF9AB", "0a1b2c3ff9ab"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture(autouse=True)
def enable_sockets(socket_enabled):
    yield


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Spider Farmer Bridge",
        data={
            "listen_port": 18886,
            "upstream_host": "sf.mqtt.spider-farmer.com",
            "upstream_port": 8883,
            "allow_control": False,
        },
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _frame(session, bus, mac_raw, data, times=3):
    """Send the frame `times` times — CB typing is tentative (v3.4.0) and
    needs the 3-frame window; repeats are harmless (dedupe everywhere)."""
    for _ in range(times):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{mac_raw}",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
        )
        _process_publish(session, pkt, bus)


CB_DATA = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "fan": {"mOnOff": 1, "mLevel": 7},
}


async def test_migrate_device_moves_identity(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    # Old device lived a full life
    old_session = ProxySession(OLD_MAC_RAW, bus)
    _frame(old_session, bus, OLD_MAC_RAW, CB_DATA)
    # New replacement device connects (auto-creates its own twin entities)
    new_session = ProxySession(NEW_MAC_RAW, bus)
    _frame(new_session, bus, NEW_MAC_RAW, CB_DATA)
    await hass.async_block_till_done()

    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    old_dev = dev_reg.async_get_device({(DOMAIN, f"ggs_{OLD_MAC}")})
    new_dev = dev_reg.async_get_device({(DOMAIN, f"ggs_{NEW_MAC}")})
    assert old_dev and new_dev

    # Sanity: both twins exist pre-migration
    assert ent_reg.async_get("sensor.sf_dp1_temperature") is not None
    assert ent_reg.async_get("sensor.sf_dp2_temperature") is not None

    # Pre-migration slots: old=cb1, new=cb2
    slots = entry.options.get("device_slots", {})
    assert slots.get(OLD_MAC) == "dp1" and slots.get(NEW_MAC) == "dp2"

    migrated, errors = migrate_device(hass, old_dev.id, new_dev.id, entry=entry)
    assert errors == []
    assert migrated > 0

    # Slot transferred: the replacement inherits cb1, old mac gone
    slots = entry.options.get("device_slots", {})
    assert slots.get(NEW_MAC) == "dp1"
    assert OLD_MAC not in slots

    # Old entity_id lives on, now carrying the NEW device's unique_id and device
    ent = ent_reg.async_get("sensor.sf_dp1_temperature")
    assert ent is not None
    assert ent.unique_id == f"ggs_{NEW_MAC}_temperature"
    assert ent.device_id == new_dev.id

    # The new device's auto-created twin was consumed
    assert ent_reg.async_get("sensor.sf_dp2_temperature") is None
    # Old device gone from the registry
    assert dev_reg.async_get_device({(DOMAIN, f"ggs_{OLD_MAC}")}) is None

    # Guard: migrating a device onto itself refuses
    migrated, errors = migrate_device(hass, new_dev.id, new_dev.id)
    assert migrated == 0 and errors

    # Guard: cross-type migration refuses (CB -> PS5), nothing removed
    ps_session = ProxySession("0A1B2C3D4E04", bus)
    ps_frame = {"outlet": {f"O{n}": {"mOnOff": 0} for n in range(1, 6)}}
    for _ in range(3):
        _frame(ps_session, bus, "0A1B2C3D4E04", ps_frame)
    await hass.async_block_till_done()
    ps_dev = dev_reg.async_get_device({(DOMAIN, "ggs_0a1b2c3d4e04")})
    assert ps_dev is not None
    migrated, errors = migrate_device(hass, new_dev.id, ps_dev.id)
    assert migrated == 0
    assert any("type mismatch" in e for e in errors)
    # Both devices untouched
    assert dev_reg.async_get(new_dev.id) is not None
    assert dev_reg.async_get(ps_dev.id) is not None
    if ps_session.initial_poll_task:
        ps_session.initial_poll_task.cancel()

    for s in (old_session, new_session):
        if s.initial_poll_task:
            s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_delete_device_gating(hass: HomeAssistant):
    """HA's delete button: allowed for offline devices, refused for live."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]

    session = ProxySession(OLD_MAC_RAW, bus)
    _frame(session, bus, OLD_MAC_RAW, CB_DATA)
    await hass.async_block_till_done()

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_device({(DOMAIN, f"ggs_{OLD_MAC}")})

    # Active session → deletion ALLOWED with reset semantics (v3.2.4):
    # session severed, runtime state forgotten
    closed = []
    class W:
        def close(self): closed.append(True)
    session._client_writer = W()
    proxy._sessions[OLD_MAC] = session
    assert f"ggs_{OLD_MAC}_temperature" in bus._registered
    assert await async_remove_config_entry_device(hass, entry, device) is True
    assert closed, "live session was not severed"
    assert OLD_MAC not in proxy._sessions
    assert not any(u.startswith(f"ggs_{OLD_MAC}_") for u in bus._registered)

    # Offline device → deletion allowed, nothing to sever
    assert await async_remove_config_entry_device(hass, entry, device) is True

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_staleness_grace_window(hass: HomeAssistant):
    """Devices unseen after the grace window show unavailable instead of
    presenting restored months-old values as live."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    # Entity exists from registration but device hasn't spoken this boot
    cb_cfg = {"mac": OLD_MAC_RAW, "type": "CB"}
    from custom_components.sf.ha.discovery import publish_discovery_for_device
    publish_discovery_for_device(bus, OLD_MAC, cb_cfg)
    bus.blocks_seen(OLD_MAC_RAW, {"sensor:temp"}, cb_cfg)
    await hass.async_block_till_done()

    # Within grace: assumed online
    assert bus.device_online(OLD_MAC) is True
    state = hass.states.get("sensor.sf_dp1_temperature")
    assert state.state != "unavailable"

    # Grace expires, device still silent → unavailable
    bus._grace_over = True
    from homeassistant.helpers.dispatcher import async_dispatcher_send
    async_dispatcher_send(hass, "sf_availability")
    await hass.async_block_till_done()
    assert bus.device_online(OLD_MAC) is False
    assert hass.states.get("sensor.sf_dp1_temperature").state == "unavailable"

    # Device finally connects → available again
    bus.publish(f"ggs/ha/{OLD_MAC}/availability", "online")
    await hass.async_block_till_done()
    assert bus.device_online(OLD_MAC) is True
    assert hass.states.get("sensor.sf_dp1_temperature").state != "unavailable"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_slot_swap_reconcile(hass: HomeAssistant):
    """cb1<->cb2 swap in one edit must actually move entity_ids (the bug:
    direct rename failed on the still-occupied target)."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    # Two CBs connect → cb1 (M4E01), cb2 (M4E02)
    s1 = ProxySession(OLD_MAC_RAW, bus)
    _frame(s1, bus, OLD_MAC_RAW, CB_DATA)
    M4E02_RAW = "0A1B2C3D4E02"
    s2 = ProxySession(M4E02_RAW, bus)
    _frame(s2, bus, M4E02_RAW, CB_DATA)
    await hass.async_block_till_done()

    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    assert reg.async_get("sensor.sf_dp1_temperature").unique_id == f"ggs_{OLD_MAC}_temperature"
    assert reg.async_get("sensor.sf_dp2_temperature").unique_id == "ggs_0a1b2c3d4e02_temperature"

    # User swaps the slots in one submit
    slots = dict(entry.options["device_slots"])
    slots[OLD_MAC] = "dp2"
    slots["0a1b2c3d4e02"] = "dp1"
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, "device_slots": slots}
    )
    bus._slot_cache.update(slots)

    bus.reconcile_all_entity_ids()
    await hass.async_block_till_done()

    # IDs actually swapped, unique_ids (identity/history) intact
    assert reg.async_get("sensor.sf_dp1_temperature").unique_id == "ggs_0a1b2c3d4e02_temperature"
    assert reg.async_get("sensor.sf_dp2_temperature").unique_id == f"ggs_{OLD_MAC}_temperature"
    # No temp ids left behind
    leftover = [e for e in reg.entities if "migtmp" in e]
    assert not leftover

    for s in (s1, s2):
        if s.initial_poll_task:
            s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_swap_with_asymmetric_entity_sets(hass: HomeAssistant):
    """The reported scenario: a full CB and a lights+fan-only CB swap slots.
    Overlapping entities (fan, light) must swap too — not deadlock —
    and exclusive entities (climate) must land on the right device."""
    from custom_components.sf.bus import reconcile_registry_to_slots
    from homeassistant.helpers import entity_registry as er

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    # M4E02 (lights+fan only) connects FIRST → cb1
    M4E02_RAW, M4E02 = "0A1B2C3D4E02", "0a1b2c3d4e02"
    s1 = ProxySession(M4E02_RAW, bus)
    _frame(s1, bus, M4E02_RAW, {
        "light": {"mOnOff": 1, "mLevel": 100},
        "fan": {"mOnOff": 0, "mLevel": 0},
    })
    # M4E01 (full CB) connects second → cb2
    s2 = ProxySession(OLD_MAC_RAW, bus)
    _frame(s2, bus, OLD_MAC_RAW, {
        **CB_DATA,
        "humidifier": {"on": 0, "mLevel": 0},
        "heater": {"mLevel": 0},
    })
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    assert reg.async_get("fan.sf_dp1_fan").unique_id == f"ggs_{M4E02}_fan"
    assert reg.async_get("fan.sf_dp2_fan").unique_id == f"ggs_{OLD_MAC}_fan"
    assert reg.async_get("binary_sensor.sf_dp2_humidifier_active") is not None

    # User swaps: M4E01=cb1, M4E02=cb2 — apply exactly as the options flow does
    slots = {OLD_MAC: "dp1", M4E02: "dp2"}
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, "device_slots": slots}
    )
    renamed = reconcile_registry_to_slots(hass, slots)
    assert renamed > 0
    await hass.async_block_till_done()

    # Overlapping set swapped correctly
    assert reg.async_get("fan.sf_dp1_fan").unique_id == f"ggs_{OLD_MAC}_fan"
    assert reg.async_get("fan.sf_dp2_fan").unique_id == f"ggs_{M4E02}_fan"
    assert reg.async_get("light.sf_dp1_light_1").unique_id == f"ggs_{OLD_MAC}_light_1"
    assert reg.async_get("light.sf_dp2_light_1").unique_id == f"ggs_{M4E02}_light_1"
    # Exclusive set followed its device
    assert reg.async_get("binary_sensor.sf_dp1_humidifier_active").unique_id \
        == f"ggs_{OLD_MAC}_humidifier_active"
    assert reg.async_get("binary_sensor.sf_dp2_humidifier_active") is None
    # No temp ids left
    assert not [e for e in reg.entities if "migtmp" in e]

    for s in (s1, s2):
        if s.initial_poll_task:
            s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_reload_severs_sessions(hass: HomeAssistant):
    """Config-entry reload must close device sockets (zombie-session fix):
    otherwise devices stay attached to the unloaded instance and the
    reloaded one never receives data until a full HA reboot."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][
        __import__("custom_components.sf.const", fromlist=["DATA_PROXY"]).DATA_PROXY
    ]

    closed = []

    class FakeWriter:
        def close(self):
            closed.append(True)
        def write(self, data): pass
        async def drain(self): pass

    session = ProxySession(OLD_MAC_RAW, bus)
    session._client_writer = FakeWriter()
    _frame(session, bus, OLD_MAC_RAW, CB_DATA)
    proxy._sessions[OLD_MAC] = session
    await hass.async_block_till_done()

    # Unload (the first half of a reload)
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()

    assert closed, "device socket was not closed on unload"
    assert not proxy._sessions
    assert session.initial_poll_task is None or session.initial_poll_task.cancelled() \
        or session.initial_poll_task.done()


async def test_settings_save_preserves_device_slots(hass: HomeAssistant):
    """Regression: saving the Settings form must not wipe device_slots
    (options-flow create_entry replaces options wholesale)."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    s = ProxySession(OLD_MAC_RAW, bus)
    _frame(s, bus, OLD_MAC_RAW, CB_DATA)
    await hass.async_block_till_done()
    assert entry.options.get("device_slots", {}).get(OLD_MAC) == "dp1"

    # Drive the real options flow: menu -> settings -> submit
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"next_step_id": "settings"}
    )
    result = await hass.config_entries.options.async_configure(
        flow["flow_id"],
        {
            "listen_port": 18887,
            "upstream_host": "h",
            "upstream_port": 8883,
            "allow_control": False,
            "preserve_on_remove": True,
            "diagnostic_log": False,
            "diagnostic_log_path": "custom_components/sf/logs/diagnostic.log",
            "diagnostic_log_days": 7,
        },
    )
    assert result["type"] == "create_entry"
    await hass.async_block_till_done()

    # device_slots survived the settings save
    assert entry.options.get("device_slots", {}).get(OLD_MAC) == "dp1"

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_slot_self_heal_after_wipe(hass: HomeAssistant):
    """A wiped stored mapping (pre-3.2.5 bug) re-persists from cache."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    s = ProxySession(OLD_MAC_RAW, bus)
    _frame(s, bus, OLD_MAC_RAW, CB_DATA)
    await hass.async_block_till_done()

    # Simulate the pre-3.2.5 wipe
    opts = {k: v for k, v in entry.options.items() if k != "device_slots"}
    hass.config_entries.async_update_entry(entry, options=opts)
    assert "device_slots" not in entry.options

    # Any slot lookup heals the stored mapping from cache
    slot = bus.get_slot(OLD_MAC_RAW, "cb")
    assert slot == "dp1"
    assert entry.options.get("device_slots", {}).get(OLD_MAC) == "dp1"

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_soil_slots_and_replacement(hass: HomeAssistant):
    """Soil probes get soil1/soil2 slots with sf_soilN_* entity ids;
    replacement = retire old serial + give new serial the old slot."""
    from custom_components.sf.bus import reconcile_registry_to_slots
    from homeassistant.helpers import entity_registry as er

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    OLD_SERIAL = "a1b2c3d4e5f60002"
    NEW_SERIAL = "9999888877776666"
    s = ProxySession(OLD_MAC_RAW, bus)
    frame = {
        **CB_DATA,
        "sensors": [
            {"id": OLD_SERIAL, "tempSoil": 22.1, "humiSoil": 45.0, "ECSoil": 1.2},
            {"id": "aaaabbbbccccdddd", "tempSoil": 21.0, "humiSoil": 40.0, "ECSoil": 1.0},
        ],
    }
    _frame(s, bus, OLD_MAC_RAW, frame)
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    # Slot ids, serial-based unique ids
    e = reg.async_get("sensor.sf_dp1_soil1_temperature")
    assert e is not None
    assert e.unique_id == f"ggs_{OLD_MAC}_soil_{OLD_SERIAL}_temperature"
    assert hass.states.get("sensor.sf_dp1_soil1_temperature").state == "22.1"
    assert hass.states.get("sensor.sf_dp1_soil2_moisture").state == "40.0"
    assert entry.options["soil_slots"][OLD_SERIAL] == "soil1"

    # Friendly naming under the CB
    st = hass.states.get("sensor.sf_dp1_soil1_temperature")
    assert "Soil 1 Temperature" in st.attributes.get("friendly_name", "")

    # ── Replacement: old probe dies, new probe appears (gets soil3) ──
    frame["sensors"] = [
        {"id": "aaaabbbbccccdddd", "tempSoil": 21.0, "humiSoil": 40.0, "ECSoil": 1.0},
        {"id": NEW_SERIAL, "tempSoil": 23.3, "humiSoil": 50.0, "ECSoil": 1.4},
    ]
    _frame(s, bus, OLD_MAC_RAW, frame)
    await hass.async_block_till_done()
    assert entry.options["soil_slots"][NEW_SERIAL] == "soil3"
    assert hass.states.get("sensor.sf_dp1_soil3_temperature").state == "23.3"

    # User (as the mappings screen does): retire old serial, new serial -> soil1
    bus.retire_soil(OLD_SERIAL)
    soil = dict(entry.options["soil_slots"])
    soil[NEW_SERIAL] = "soil1"
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, "soil_slots": soil}
    )
    bus._soil_cache.update(soil)
    reconcile_registry_to_slots(
        hass, dict(entry.options["device_slots"]), soil
    )
    await hass.async_block_till_done()

    # sf_soil1_* now carries the NEW probe's identity; old probe gone
    e = reg.async_get("sensor.sf_dp1_soil1_temperature")
    assert e is not None
    assert e.unique_id == f"ggs_{OLD_MAC}_soil_{NEW_SERIAL}_temperature"
    assert reg.async_get_entity_id(
        "sensor", DOMAIN, f"ggs_{OLD_MAC}_soil_{OLD_SERIAL}_temperature"
    ) is None
    assert not [x for x in reg.entities if "migtmp" in x]

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_soil_numbering_is_per_cb(hass: HomeAssistant):
    """cb1 and cb2 each number their own probes — both get a soil1."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    M4E02_RAW = "0A1B2C3D4E02"
    s1 = ProxySession(OLD_MAC_RAW, bus)
    _frame(s1, bus, OLD_MAC_RAW, {
        **CB_DATA,
        "sensors": [{"id": "aaaa000011112222", "tempSoil": 20.0, "humiSoil": 30.0, "ECSoil": 0.9}],
    })
    s2 = ProxySession(M4E02_RAW, bus)
    _frame(s2, bus, M4E02_RAW, {
        "light": {"mOnOff": 1, "mLevel": 50},
        "fan": {"mOnOff": 0, "mLevel": 0},
        "sensors": [{"id": "bbbb333344445555", "tempSoil": 21.5, "humiSoil": 35.0, "ECSoil": 1.1}],
    })
    await hass.async_block_till_done()

    # Both CBs have their own soil1
    assert hass.states.get("sensor.sf_dp1_soil1_temperature").state == "20.0"
    assert hass.states.get("sensor.sf_dp2_soil1_temperature").state == "21.5"
    soil = entry.options["soil_slots"]
    assert soil["aaaa000011112222"] == "soil1"
    assert soil["bbbb333344445555"] == "soil1"

    for s in (s1, s2):
        if s.initial_poll_task:
            s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_mappings_flow_cb_scoped_soil(hass: HomeAssistant):
    """The mappings form displays cb-scoped soil values (dp1_soil1), accepts
    both scoped and bare input, allows soil1 on BOTH CBs, and rejects a
    foreign CB prefix."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    M4E02_RAW, M4E02 = "0A1B2C3D4E02", "0a1b2c3d4e02"
    s1 = ProxySession(OLD_MAC_RAW, bus)
    _frame(s1, bus, OLD_MAC_RAW, {
        **CB_DATA,
        "sensors": [
            {"id": "aaaa1111", "tempSoil": 20.0, "humiSoil": 30.0, "ECSoil": 0.9},
            {"id": "bbbb2222", "tempSoil": 20.5, "humiSoil": 31.0, "ECSoil": 0.8},
        ],
    })
    s2 = ProxySession(M4E02_RAW, bus)
    _frame(s2, bus, M4E02_RAW, {
        "light": {"mOnOff": 1, "mLevel": 50},
        "fan": {"mOnOff": 0, "mLevel": 0},
        "sensors": [{"id": "cccc3333", "tempSoil": 21.5, "humiSoil": 35.0, "ECSoil": 1.1}],
    })
    await hass.async_block_till_done()

    flow = await hass.config_entries.options.async_init(entry.entry_id)
    form = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"next_step_id": "mappings"}
    )
    # Defaults are cb-scoped
    defaults = {
        str(k): k.default() for k in form["data_schema"].schema
    }
    assert defaults["soil:aaaa1111"] == "dp1_soil1"
    assert defaults["soil:cccc3333"] == "dp2_soil1"   # both CBs have a soil1

    # Foreign prefix rejected
    bad = dict(defaults)
    bad["soil:aaaa1111"] = "dp2_soil5"
    result = await hass.config_entries.options.async_configure(
        form["flow_id"], bad
    )
    assert result["errors"]["base"] == "wrong_cb_prefix"

    # Swap cb1's two probes using MIXED input styles (scoped + bare)
    good = dict(defaults)
    good["soil:aaaa1111"] = "dp1_soil2"
    good["soil:bbbb2222"] = "soil1"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], good
    )
    assert result["type"] == "create_entry"
    await hass.async_block_till_done()

    soil = entry.options["soil_slots"]
    assert soil["aaaa1111"] == "soil2"
    assert soil["bbbb2222"] == "soil1"
    assert soil["cccc3333"] == "soil1"   # cb2's soil1 untouched

    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    assert reg.async_get("sensor.sf_dp1_soil2_temperature").unique_id \
        == f"ggs_{OLD_MAC}_soil_aaaa1111_temperature"
    assert reg.async_get("sensor.sf_dp1_soil1_temperature").unique_id \
        == f"ggs_{OLD_MAC}_soil_bbbb2222_temperature"
    assert reg.async_get("sensor.sf_dp2_soil1_temperature").unique_id \
        == f"ggs_{M4E02}_soil_cccc3333_temperature"

    for s in (s1, s2):
        if s.initial_poll_task:
            s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_soil_probes_on_power_strip(hass: HomeAssistant):
    """A PS5 with a soil probe: stays a PS5 (soil is NOT a CB marker), and
    the probe's entities appear as sf_ac5_soil1_* after the window."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    PS_RAW, PS = "0A1B2C3D4E03", "0a1b2c3d4e03"
    s = ProxySession(PS_RAW, bus)
    frame = {
        "outlet": {f"O{n}": {"mOnOff": 0} for n in range(1, 6)},
        "sensors": [
            {"id": "ffff0000aaaa1111", "tempSoil": 19.5, "humiSoil": 42.0, "ECSoil": 1.3},
        ],
    }
    for _ in range(3):
        _frame(s, bus, PS_RAW, frame)
    # One more frame after typing so soil discovery (gated on device_cfg) runs
    _frame(s, bus, PS_RAW, frame)
    await hass.async_block_till_done()

    # Typed PS5, not CB
    assert s.device_type == "ps5"
    from homeassistant.helpers import device_registry as dr
    dev = dr.async_get(hass).async_get_device({(DOMAIN, f"ggs_{PS}")})
    assert dev.model == "Power Strip AC5"

    # Probe entities scoped to the strip's slot
    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    e = reg.async_get("sensor.sf_ac5_soil1_temperature")
    assert e is not None
    assert e.unique_id == f"ggs_{PS}_soil_ffff0000aaaa1111_temperature"
    assert hass.states.get("sensor.sf_ac5_soil1_temperature").state == "19.5"
    assert hass.states.get("sensor.sf_ac5_soil1_moisture").state == "42.0"
    assert hass.states.get("sensor.sf_ac5_soil1_ec").state == "1.3"
    assert entry.options["soil_slots"]["ffff0000aaaa1111"] == "soil1"

    if s.initial_poll_task:
        s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
