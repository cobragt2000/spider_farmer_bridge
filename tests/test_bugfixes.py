"""Tests for the v3.0.3 bug-fix batch (dead sensors + display precision)."""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH
from custom_components.sf.proxy.normalizer import (
    normalize_status,
    normalize_config_response,
)

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"


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
            "listen_port": 18885,
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


def _pkt(method: str, data: dict) -> MQTTPacket:
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": method, "uid": "u1", "data": data}).encode(),
    )


FULL_CB = {
    "sensor": {"temp": 24.53, "humi": 60.9, "co2": 850, "vpd": 1.13, "ppfd": 400},
    "light": {"mOnOff": 1, "mLevel": 80},
    "light2": {"mOnOff": 1, "mLevel": 40},
    "fan": {"mOnOff": 1, "mLevel": 7},          # NO shakeLevel/natural (realistic)
    "blower": {"mOnOff": 1, "mLevel": 65},
    "humidifier": {"on": 1, "mLevel": 2},        # no alarm field
    "dehumidifier": {"mLevel": 1, "alarm": 1},   # tank full alarm
    "heater": {"mLevel": 3},                     # no alarm
}


def test_normalizer_tank_status_topics():
    """Bug #2/#6: tank/water/status topics must actually publish now."""
    r = normalize_status(CB_MAC_LC, {"data": FULL_CB}, mac=CB_MAC)
    assert r[f"ggs/ha/{CB_MAC_LC}/humidifier_water/state"] == "Full"
    assert r[f"ggs/ha/{CB_MAC_LC}/dehumidifier_tank/state"] == "Full"   # alarm=1
    assert r[f"ggs/ha/{CB_MAC_LC}/heater_status/state"] == "OK"

    alarmed = {
        "humidifier": {"on": 0, "alarm": 2},
        "heater": {"mLevel": 0, "alarm": 1},
        "dehumidifier": {"mLevel": 0},
    }
    r = normalize_status(CB_MAC_LC, {"data": alarmed}, mac=CB_MAC)
    assert r[f"ggs/ha/{CB_MAC_LC}/humidifier_water/state"] == "Empty"
    assert r[f"ggs/ha/{CB_MAC_LC}/heater_status/state"] == "Alarm"
    assert r[f"ggs/ha/{CB_MAC_LC}/dehumidifier_tank/state"] == "Empty"


def test_normalizer_fan_cache_fallback():
    """Bug #3/#4: shakeLevel/natural absent from getDevSta must fall back
    to the session fan cache instead of leaving the sensors unknown."""
    cache = {"fan": {"shakeLevel": 4, "natural": 1}}
    r = normalize_status(
        CB_MAC_LC, {"data": {"fan": {"mOnOff": 1, "mLevel": 7}}},
        mac=CB_MAC, fan_cache=cache,
    )
    assert r[f"ggs/ha/{CB_MAC_LC}/fan_oscillation/state"] == "4"
    assert r[f"ggs/ha/{CB_MAC_LC}/fan_natural_wind/state"] == "ON"
    fan_state = json.loads(r[f"ggs/ha/{CB_MAC_LC}/fan/state"])
    assert fan_state["oscillating"] is True
    assert fan_state["natural_wind"] is True

    # No frame data AND no cache → topics simply absent (still unknown)
    r = normalize_status(
        CB_MAC_LC, {"data": {"fan": {"mOnOff": 1, "mLevel": 7}}}, mac=CB_MAC,
    )
    assert f"ggs/ha/{CB_MAC_LC}/fan_oscillation/state" not in r


def test_normalize_config_response():
    """Bug #3/#4/#5: config responses now publish oscillation, natural
    wind, and fan/climate modes — without touching live on/off state."""
    cfg_data = {
        "fan": {"modeType": 2, "shakeLevel": 5, "natural": 0, "mOnOff": 0},
        "blower": {"modeType": 13},
        "heater": {"modeType": 4, "mLevel": 3},
        "humidifier": {"modeType": 1},
    }
    r = normalize_config_response(CB_MAC, {"data": cfg_data})
    assert r[f"ggs/ha/{CB_MAC_LC}/fan_mode/state"] == "Cycle"
    assert r[f"ggs/ha/{CB_MAC_LC}/fan_oscillation/state"] == "5"
    assert r[f"ggs/ha/{CB_MAC_LC}/fan_natural_wind/state"] == "OFF"
    assert r[f"ggs/ha/{CB_MAC_LC}/blower_mode/state"] == "Environment: Temp & Humi"
    assert r[f"ggs/ha/{CB_MAC_LC}/heater_mode/state"] == "Environment"
    assert r[f"ggs/ha/{CB_MAC_LC}/humidifier_mode/state"] == "Time/Cycle"
    # v3.19.133: the command selects (mode_set) + Environment run-mode must ALSO
    # sync from config responses, so the card reads the controller's real mode
    # instead of a stale echo (the mode/settings "revert" bug).
    assert r[f"ggs/ha/{CB_MAC_LC}/fan_mode_set/state"] == "Cycle"
    assert f"ggs/ha/{CB_MAC_LC}/fan_run_mode/state" not in r  # Cycle has no run-mode
    assert r[f"ggs/ha/{CB_MAC_LC}/blower_mode_set/state"] == "Environment"
    assert r[f"ggs/ha/{CB_MAC_LC}/blower_run_mode/state"] == "Temperature & humidity"
    assert r[f"ggs/ha/{CB_MAC_LC}/humidifier_mode_set/state"] == "Time Slot"
    # Live state topics must NOT appear (stale mOnOff must not fight getDevSta)
    assert f"ggs/ha/{CB_MAC_LC}/fan/state" not in r
    assert f"ggs/ha/{CB_MAC_LC}/heater_active/state" not in r


def test_mode_set_select_syncs_from_own_topic():
    """v3.19.133 root cause: the fan/blower/climate *_mode_set selects stripped
    the trailing '_set' and subscribed to the read-only sensor topic
    (blower_mode/state = 'Environment: Prioritize Humi'), whose verbose label
    never matches a select option — so the select stayed stuck on 'Manual' and
    the card's mode appeared to revert. The select must ALSO listen to its own
    collapsed topic (blower_mode_set/state = 'Environment')."""
    from custom_components.sf.select import SfLevelSelect
    from custom_components.sf.entity_defs import SfDef

    d = SfDef(
        platform="select", field="blower_mode_set", name="Blower Mode Set",
        mac=CB_MAC_LC, mac_raw=CB_MAC, device_name="SF", device_model="AC5",
        options=["Manual", "Time Slot", "Cycle", "Environment"],
        command_field="blower", command_subfield="mode",
    )
    sel = object.__new__(SfLevelSelect)      # bypass __init__ (needs a live bus)
    sel.d = d
    sel._attr_options = list(d.options)
    sel._attr_current_option = "Manual"
    sel._outlet_mode_n = None

    topics = sel.state_topics
    assert f"ggs/ha/{CB_MAC_LC}/blower_mode_set/state" in topics   # own topic
    assert f"ggs/ha/{CB_MAC_LC}/blower_mode/state" in topics       # fallback

    # The verbose read-only value doesn't match an option -> ignored, keep last.
    sel._handle_payload(
        f"ggs/ha/{CB_MAC_LC}/blower_mode/state", "Environment: Prioritize Humi")
    assert sel._attr_current_option == "Manual"
    # The select's own collapsed topic matches an option -> the select tracks it.
    sel._handle_payload(
        f"ggs/ha/{CB_MAC_LC}/blower_mode_set/state", "Environment")
    assert sel._attr_current_option == "Environment"


def test_tz_sync_from_ha_timezone():
    """v3.19.137: the proxy builds setDevTimezone straight from Home Assistant's
    configured timezone (no app interaction), with a current UTC and the correct
    POSIX TZ rule, so controller clocks stay synced to HA."""
    from custom_components.sf.proxy.mitm_proxy import MITMProxy

    # The POSIX TZ rule is extracted from the tz database.
    assert MITMProxy._posix_tz_string("America/Chicago") == "CST6CDT,M3.2.0,M11.1.0"
    assert MITMProxy._posix_tz_string("America/New_York") == "EST5EDT,M3.2.0,M11.1.0"

    class _Cfg:
        time_zone = "America/Chicago"

    class _Hass:
        config = _Cfg()

    class _Bus:
        hass = _Hass()

    class _S:
        mac_raw = "0A1B2C3D4E01"
        uid = "12345"

    prox = MITMProxy(config={}, mqtt_client=_Bus())
    cmd = prox.build_tz_sync_command(_S())
    assert cmd["method"] == "setDevTimezone"
    assert cmd["pid"] == "0A1B2C3D4E01"
    assert cmd["uid"] == "12345"
    assert cmd["params"]["timezone"] == "America/Chicago"
    assert cmd["params"]["TZ"] == "CST6CDT,M3.2.0,M11.1.0"
    assert cmd["params"]["gmtoff"] == 0
    assert cmd["params"]["UTC"] > 1_760_000_000  # a current epoch, not stale

    # No timezone available -> no command (nothing to send).
    class _Bus2:
        hass = None

    assert MITMProxy(config={}, mqtt_client=_Bus2()).build_tz_sync_command(_S()) is None


async def test_end_to_end_previously_dead_sensors(hass: HomeAssistant):
    """Full pipeline: getDevSta then a config response — every previously
    dead entity has a real state, and precision is set on air sensors."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FULL_CB), bus)
    await hass.async_block_till_done()

    # State preserves full resolution (#1: rounding is display-side only)
    assert hass.states.get("sensor.sf_dp1_humidity").state == "60.9"
    assert hass.states.get("sensor.sf_dp1_temperature").state == "24.53"
    assert hass.states.get("sensor.sf_dp1_vpd").state == "1.13"

    # Display precision registered (#1)
    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    for eid in (
        "sensor.sf_dp1_temperature",
        "sensor.sf_dp1_humidity",
        "sensor.sf_dp1_vpd",
    ):
        opts = reg.async_get(eid).options.get("sensor", {})
        assert opts.get("suggested_display_precision") == 2, eid

    # #2/#6 live from getDevSta
    assert hass.states.get("sensor.sf_dp1_humidifier_tank").state == "Full"
    assert hass.states.get("sensor.sf_dp1_dehumidifier_tank").state == "Full"
    assert hass.states.get("sensor.sf_dp1_heater_status").state == "OK"

    # #3/#4 unknown so far (no config data yet) — then the config response lands
    assert hass.states.get("sensor.sf_dp1_fan_oscillation").state == "unknown"
    _process_publish(
        session,
        _pkt("getConfigField", {"fan": {"modeType": 1, "shakeLevel": 3, "natural": 1}}),
        bus,
    )
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_fan_oscillation").state == "3"
    assert hass.states.get("binary_sensor.sf_dp1_fan_natural_wind").state == "on"
    assert hass.states.get("sensor.sf_dp1_fan_mode").state == "Schedule"

    # #3/#4 continued: the NEXT getDevSta (still no shakeLevel in frame)
    # keeps oscillation via the session cache instead of regressing
    _process_publish(session, _pkt("getDevSta", FULL_CB), bus)
    await hass.async_block_till_done()
    fan = hass.states.get("fan.sf_dp1_fan")
    assert fan.attributes["oscillating"] is True

    # #5: heater mode from a climate config response
    _process_publish(
        session, _pkt("getConfigField", {"heater": {"modeType": 4, "mLevel": 3}}), bus
    )
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_heater_mode").state == "Environment"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_outlet_unprune_when_device_added_later(hass: HomeAssistant):
    """An outlet pruned as unused comes back when it starts reporting."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    ps_raw = "0A1B2C3D4E05"
    session = ProxySession(ps_raw, bus)
    frame = {"outlet": {"O1": {"mOnOff": 1}, "O7": {"mOnOff": 0}}}

    def send(data):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{ps_raw}",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
        )
        _process_publish(session, pkt, bus)

    for _ in range(3):
        send(frame)
    await hass.async_block_till_done()

    assert session.device_type == "ps10"
    assert session._outlet_discovery_pruned is True
    assert hass.states.get("switch.sf_ac10_outlet_1") is not None
    assert hass.states.get("switch.sf_ac10_outlet_6") is None

    # Something new gets plugged into outlet 6
    send({"outlet": {"O1": {"mOnOff": 1}, "O6": {"mOnOff": 1}, "O7": {"mOnOff": 0}}})
    await hass.async_block_till_done()

    o6 = hass.states.get("switch.sf_ac10_outlet_6")
    assert o6 is not None and o6.state == "on"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_per_device_availability(hass: HomeAssistant):
    """One device going offline must not touch other devices' entities."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FULL_CB), bus)

    from custom_components.sf.ha.discovery import publish_discovery_for_device
    ps5_cfg = {"mac": "0A1B2C3D4E04", "type": "PS5"}
    publish_discovery_for_device(bus, "0a1b2c3d4e04", ps5_cfg)
    bus.blocks_seen("0A1B2C3D4E04", {"light"}, ps5_cfg)
    await hass.async_block_till_done()

    # CB session drops → only CB entities unavailable
    bus.publish(f"ggs/ha/{CB_MAC_LC}/availability", "offline")
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_temperature").state == "unavailable"
    assert hass.states.get("light.sf_ac5_light_1").state != "unavailable"

    # CB reconnects → back with its last state
    bus.publish(f"ggs/ha/{CB_MAC_LC}/availability", "online")
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_temperature").state == "24.53"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_confirm_poll_after_set_config(hass: HomeAssistant):
    """A setConfigField inject triggers a follow-up getConfigField for the
    module, so config-only fields update in seconds."""
    import asyncio
    from custom_components.sf.proxy.mqtt_parser import parse_packets

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    session.confirm_delay = 0.01

    captured = bytearray()

    class FakeWriter:
        def write(self, data): captured.extend(data)
        async def drain(self): pass

    session.attach_writer(FakeWriter()) if hasattr(session, "attach_writer") else None
    if session._client_writer is None:
        session._client_writer = FakeWriter()

    await session.inject({
        "method": "setConfigField",
        "pid": CB_MAC,
        "params": {"keyPath": ["device", "fan", "shakeLevel"], "value": 4},
        "msgId": "1", "uid": "u1",
    })
    await asyncio.sleep(0.1)

    pkts, _ = parse_packets(bytes(captured))
    methods = [json.loads(p.message) for p in pkts if p.message]
    assert methods[0]["method"] == "setConfigField"
    confirms = [m for m in methods if m["method"] == "getConfigField"]
    assert len(confirms) == 1
    # Confirm poll targets the whole module, not the leaf field
    assert confirms[0]["params"]["keyPath"] == ["device", "fan"]

    # Dedupe: a burst of sets to the same module → still one pending confirm
    session.confirm_delay = 0.05
    for _ in range(5):
        await session.inject({
            "method": "setConfigField",
            "pid": CB_MAC,
            "params": {"keyPath": ["device", "fan", "shakeLevel"], "value": 2},
            "msgId": "2", "uid": "u1",
        })
    await asyncio.sleep(0.15)
    pkts, _ = parse_packets(bytes(captured))
    all_confirms = [
        p for p in pkts if p.message
        and json.loads(p.message).get("method") == "getConfigField"
    ]
    assert len(all_confirms) == 2  # the first one + exactly one for the burst

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_outlet_confirm_polls_whole_block(hass: HomeAssistant):
    """A standalone-strip outlet write ["outlet","O<n>"] must confirm-poll the
    whole ["outlet"] block, not the single ["outlet","O<n>"] leaf. A targeted
    single-outlet read answers with a bare {"O<n>": …} (no "outlet" wrapper) that
    the config parser drops, so the mode select never updated after a non-Manual
    mode change made in the SF app or on the card. (regression: 3.19.172)"""
    import asyncio
    from custom_components.sf.proxy.mqtt_parser import parse_packets

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    session.confirm_delay = 0.01
    captured = bytearray()

    class FakeWriter:
        def write(self, data): captured.extend(data)
        async def drain(self): pass

    if session._client_writer is None:
        session._client_writer = FakeWriter()

    await session.inject({
        "method": "setConfigField",
        "pid": CB_MAC,
        "params": {"keyPath": ["outlet", "O1"], "O1": {"modeType": 3}},
        "msgId": "1", "uid": "u1",
    })
    await asyncio.sleep(0.1)

    pkts, _ = parse_packets(bytes(captured))
    methods = [json.loads(p.message) for p in pkts if p.message]
    confirms = [m for m in methods if m["method"] == "getConfigField"]
    assert len(confirms) == 1
    # Whole block, so the response is wrapped {"outlet": {...}} and gets parsed —
    # NOT ["outlet","O1"], which returns a bare {"O1": ...} the parser drops.
    assert confirms[0]["params"]["keyPath"] == ["outlet"]

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_light_commands_produce_device_payload(hass: HomeAssistant):
    """Regression: HA light commands must survive the light_1→light field
    mapping and reach the device as a real setConfigField inject."""
    import asyncio
    from unittest.mock import MagicMock
    from custom_components.sf.const import DATA_PROXY
    from custom_components.sf.proxy.mqtt_parser import parse_packets

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.allow_control = True

    session = ProxySession(CB_MAC, bus)
    captured = bytearray()

    class FakeWriter:
        def write(self, data): captured.extend(data)
        async def drain(self): pass

    session._client_writer = FakeWriter()
    session.confirm_delay = 0.01
    proxy._sessions[CB_MAC_LC] = session
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FULL_CB), bus)
    await hass.async_block_till_done()

    # Both light entities exist on the CB now
    assert hass.states.get("light.sf_dp1_light_1") is not None
    assert hass.states.get("light.sf_dp1_light_2") is not None

    # Command through the REAL handler (not mocked)
    await proxy.handle_command(
        f"ggs/ha/{CB_MAC_LC}/light_1/set", '{"state": "ON", "brightness": 55}'
    )
    pkts, _ = parse_packets(bytes(captured))
    injected = [json.loads(p.message) for p in pkts if p.message]
    light_cmds = [
        m for m in injected
        if m.get("method") == "setConfigField"
        and "light" in (m.get("params") or {})
    ]
    assert light_cmds, "light_1 command produced no device payload"
    assert light_cmds[-1]["params"]["light"]["mLevel"] == 55

    # light_2 maps to the light2 block
    captured.clear()
    await proxy.handle_command(
        f"ggs/ha/{CB_MAC_LC}/light_2/set", '{"state": "OFF"}'
    )
    pkts, _ = parse_packets(bytes(captured))
    injected = [json.loads(p.message) for p in pkts if p.message]
    assert any(
        "light2" in (m.get("params") or {}) for m in injected
    ), "light_2 command produced no device payload"

    # Let the echo-triggered confirm polls fire and finish
    await asyncio.sleep(0.1)

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_air_sensors_field_level_evidence(hass: HomeAssistant):
    """A CB with temp/humi probes but no CO2/PPFD gets ONLY those entities;
    late-attached probes create theirs on arrival; phantom co2 from earlier
    versions is pruned."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.keep_offline = False  # this test exercises the pruning path (option off)

    # Pre-existing phantom co2 from a pre-3.2.3 install
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{CB_MAC_LC}")},
        name="SF Display Panel 4E01", manufacturer="Spider Farmer",
        model="Display Panel",
    )
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{CB_MAC_LC}_co2",
        suggested_object_id="sf_dp1_co2",
        device_id=device.id, config_entry=entry,
    )

    session = ProxySession(CB_MAC, bus)
    frame = {
        "sensor": {"temp": 24.5, "humi": 61.0},   # no co2/vpd/ppfd fields
        "fan": {"mOnOff": 1, "mLevel": 7},
    }
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", frame), bus)
    await hass.async_block_till_done()

    assert hass.states.get("sensor.sf_dp1_temperature").state == "24.5"
    assert hass.states.get("sensor.sf_dp1_humidity").state == "61.0"
    # No co2/vpd/ppfd — including the phantom, pruned
    assert hass.states.get("sensor.sf_dp1_co2") is None
    assert hass.states.get("sensor.sf_dp1_vpd") is None
    assert hass.states.get("sensor.sf_dp1_ppfd") is None
    assert ent_reg.async_get_entity_id("sensor", DOMAIN, f"ggs_{CB_MAC_LC}_co2") is None

    # CO2 probe plugged in later → field appears → entity appears
    frame["sensor"]["co2"] = 850
    _process_publish(session, _pkt("getDevSta", frame), bus)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_co2").state == "850"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_restore_rejects_foreign_device_state(hass: HomeAssistant):
    """After a slot swap, an entity_id's cached state may belong to the
    OTHER device — restore must reject it (the cb2 co2 bleed)."""
    from pytest_homeassistant_custom_component.common import mock_restore_cache
    from homeassistant.core import State

    OTHER_MAC = "0a1b2c3d4e02"
    mock_restore_cache(hass, [
        # sf_dp1_temperature's cached state was written by M4E02 (pre-swap)
        State("sensor.sf_dp1_temperature", "19.9", {"sf_device": OTHER_MAC}),
        # sf_dp1_humidity's cache is legitimately 4E01's
        State("sensor.sf_dp1_humidity", "55.5", {"sf_device": CB_MAC_LC}),
    ])

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    # M4E01 registered as cb1 but hasn't reported yet
    from custom_components.sf.ha.discovery import publish_discovery_for_device
    cb_cfg = {"mac": CB_MAC, "type": "CB"}
    publish_discovery_for_device(bus, CB_MAC_LC, cb_cfg)
    bus.blocks_seen(CB_MAC, {"sensor:temp", "sensor:humi"}, cb_cfg)
    await hass.async_block_till_done()

    # Foreign state NOT restored; own state restored
    assert hass.states.get("sensor.sf_dp1_temperature").state == "unknown"
    assert hass.states.get("sensor.sf_dp1_humidity").state == "55.5"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_parse_plan_surfaces_stages_when_active():
    """v3.19.149: a running grow plan is surfaced as (active, stages) with each
    stage's day/night targets, so the card's Planting Plan view can show it. The
    base configFile.target is left untouched (it drives the manual Environment
    view when no plan is active)."""
    from custom_components.sf.proxy.mitm_proxy import _parse_plan
    cf = {"configFile": {
        "target": {"temp": {"targetDay": 24, "targetNight": 22}},
        "plan": {"enabled": 1, "stage": [
            {"label": "Vegetative", "alarmDate": 1787239133,
             "startDate": 132777473, "endDate": 132778527,
             "target": {"temp": {"targetDay": 26, "targetNight": 22, "deadband": 5},
                        "humi": {"targetDay": 55, "targetNight": 60},
                        "co2": {"targetDay": 600, "targetNight": 400}}},
            {"label": "Flowering",
             "target": {"temp": {"targetDay": 25, "targetNight": 20}}}]}}}
    active, stages = _parse_plan(cf)
    assert active is True
    assert len(stages) == 2
    assert stages[0]["label"] == "Vegetative"
    # Raw date codes are passed through for the card to decode (v3.19.155).
    assert stages[0]["start"] == 132777473 and stages[0]["end"] == 132778527
    assert stages[0]["temp_day"] == 26 and stages[0]["temp_night"] == 22
    assert stages[0]["humi_day"] == 55 and stages[0]["humi_night"] == 60
    assert stages[0]["temp_dz"] == 5
    assert stages[1]["label"] == "Flowering"

    # plan disabled -> inactive, no stages
    assert _parse_plan({"configFile": {"plan": {"enabled": 0, "stage": []}}}) == (False, [])
    # no plan block at all -> inactive
    assert _parse_plan({"configFile": {"target": {}}}) == (False, [])

    # v3.19.151: a STOPPED plan still keeps its stages (the app shows them under a
    # stopped plan) — only ``active`` reflects enabled. Previously the stages were
    # dropped, leaving the card's Stages list empty after Stop.
    stopped = {"configFile": {"plan": {"enabled": 0, "stage": [
        {"label": "Veg", "target": {"temp": {"targetDay": 26}}}]}}}
    act, stgs = _parse_plan(stopped)
    assert act is False
    assert len(stgs) == 1 and stgs[0]["label"] == "Veg"


def test_plan_sensor_decodes_payload():
    """The plan sensor turns the published JSON into a stage-label state plus
    active/stages attributes for the card."""
    from custom_components.sf.sensor import SfPlanSensor
    from custom_components.sf.entity_defs import build_plan_entity
    import json
    d = build_plan_entity({"mac": CB_MAC, "type": "ps10"}, slot="1")
    sen = object.__new__(SfPlanSensor)
    sen.d = d
    sen._attr_extra_state_attributes = {}
    sen._handle_payload(
        f"ggs/ha/{CB_MAC_LC}/plan/state",
        json.dumps({"active": True, "stages": [{"label": "Veg", "temp_day": 26}]}),
    )
    assert sen._attr_native_value == "Veg"
    assert sen._attr_extra_state_attributes["active"] is True
    assert sen._attr_extra_state_attributes["stages"][0]["temp_day"] == 26
    # inactive payload
    sen._handle_payload(f"ggs/ha/{CB_MAC_LC}/plan/state",
                        json.dumps({"active": False, "stages": []}))
    assert sen._attr_native_value == "inactive"


def test_plan_sensor_current_stage_and_progress():
    """v3.19.150: the plan sensor picks the running stage by stageId (from the
    getDevSta progress) and exposes the progress block for the card's bar."""
    from custom_components.sf.sensor import SfPlanSensor
    from custom_components.sf.entity_defs import build_plan_entity
    import json
    d = build_plan_entity({"mac": CB_MAC, "type": "ps10"}, slot="1")
    sen = object.__new__(SfPlanSensor)
    sen.d = d
    sen._attr_extra_state_attributes = {}
    sen._handle_payload(f"ggs/ha/{CB_MAC_LC}/plan/state", json.dumps({
        "active": True,
        "stages": [{"stageId": 1, "label": "Veg"}, {"stageId": 2, "label": "Flower"}],
        "progress": {"running": True, "stageId": 2, "totalDays": 154,
                     "planted": 115, "remain": 39, "progress": 74},
    }))
    assert sen._attr_native_value == "Flower"   # matched by stageId, not first
    assert sen._attr_extra_state_attributes["progress"]["progress"] == 74


async def test_plan_stages_not_wiped_by_getconfigfield(hass: HomeAssistant):
    """v3.19.152: a targeted getConfigField must NOT clear the plan stages that a
    full getConfigFile populated. The plan block only exists in getConfigFile, so
    parsing the (constant) targeted reads returned empty and wiped the stages a
    second later — the 'stages drop off the card without a reboot' bug."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FULL_CB), bus)
    await hass.async_block_till_done()

    cfgfile = {"configFile": {
        "target": {"temp": {"targetDay": 24, "targetNight": 20}},
        "plan": {"enabled": 0, "stage": [
            {"stageId": 1, "label": "Veg", "target": {"temp": {"targetDay": 26}}},
            {"stageId": 2, "label": "Flower", "target": {"temp": {"targetDay": 25}}}]}}}
    _process_publish(session, _pkt("getConfigFile", cfgfile), bus)
    await hass.async_block_till_done()
    st = hass.states.get("sensor.sf_dp1_plan")
    assert st is not None and len(st.attributes["stages"]) == 2

    # A targeted getConfigField (no configFile block) must leave the stages intact.
    _process_publish(
        session, _pkt("getConfigField", {"target": {"temp": {"targetDay": 23}}}), bus)
    await hass.async_block_till_done()
    st2 = hass.states.get("sensor.sf_dp1_plan")
    assert len(st2.attributes["stages"]) == 2, "getConfigField wiped the plan stages"

    if session.initial_poll_task is not None:
        session.initial_poll_task.cancel()


def test_plan_sensor_restores_stages_after_reboot():
    """v3.19.152: after a restart the plan sensor restores its last-known stages
    from the attribute cache, so the card's Stages list isn't empty until the
    next getConfigFile (which the app triggers on open)."""
    from custom_components.sf.sensor import SfPlanSensor
    from custom_components.sf.entity_defs import build_plan_entity
    d = build_plan_entity({"mac": CB_MAC, "type": "ps10"}, slot="1")
    sen = object.__new__(SfPlanSensor)
    sen.d = d
    sen._attr_extra_state_attributes = {"sf_device": CB_MAC_LC}

    class _Last:
        state = "Veg"
        attributes = {"sf_device": CB_MAC_LC, "active": False,
                      "stages": [{"stageId": 1, "label": "Veg", "temp_day": 26}],
                      "progress": {}}

    sen._restore(_Last())
    assert sen._attr_extra_state_attributes["stages"][0]["label"] == "Veg"
    assert sen._attr_extra_state_attributes["active"] is False
    assert sen._attr_native_value == "Veg"


def test_plan_enable_command():
    """v3.19.150: the plan switch writes setConfigField ["plan","enabled"] 0/1 —
    the app's Start/Stop Plan, leaving the stage list intact."""
    from custom_components.sf.proxy.command_handler import translate_command
    on = translate_command("plan_enabled", "ON", CB_MAC, "u1")
    assert on["method"] == "setConfigField"
    assert on["params"]["keyPath"] == ["plan", "enabled"]
    assert on["params"]["enabled"] == 1
    off = translate_command("plan_enabled", "OFF", CB_MAC, "u1")
    assert off["params"]["enabled"] == 0


def test_build_plan_rmw_preserves_light():
    """v3.19.156: a plan write merges the card's stage edits over the cached plan,
    preserving each stage's light schedule / colour / dayTime; a new stage clones
    the template light and gets a fresh id."""
    from custom_components.sf.proxy.command_handler import build_plan
    plan_cfg = {"enabled": 0, "stage": [
        {"stageId": 7, "label": "Veg", "startDate": 100, "endDate": 200,
         "alarmDate": 1, "color": 3, "light1": {"mLevel": 85}, "light2": {"mLevel": 11},
         "target": {"dayTime": {"startTime": 7200}, "temp": {"targetDay": 26}}}]}
    stages = [{"stageId": 7, "label": "Veg2", "start": 132777473, "end": 132778527,
               "target": {"temp": {"day": 29, "night": 22, "dz": 3}, "humi": {"day": 55}}}]
    cmd = build_plan(CB_MAC, "u1", stages, True, plan_cfg)
    assert cmd["params"]["keyPath"] == ["plan"]
    p = cmd["params"]["plan"]
    assert p["enabled"] == 1
    s = p["stage"][0]
    assert s["stageId"] == 7 and s["label"] == "Veg2"
    assert s["startDate"] == 132777473 and s["endDate"] == 132778527
    assert s["light1"] == {"mLevel": 85} and s["color"] == 3          # preserved
    assert s["target"]["dayTime"] == {"startTime": 7200}              # preserved
    assert s["target"]["temp"]["targetDay"] == 29
    assert s["target"]["temp"]["deadband"] == 3
    assert s["target"]["humi"]["targetDay"] == 55

    # a NEW stage (unknown id) clones the template light + gets a fresh id
    stages2 = [{"stageId": None, "label": "New", "start": 132777473, "end": 132777503,
                "target": {"temp": {"day": 20}}}]
    ns = build_plan(CB_MAC, "u1", stages2, False, plan_cfg)["params"]["plan"]["stage"][0]
    assert ns["label"] == "New" and ns["light1"] == {"mLevel": 85} and ns["stageId"] != 7


def test_build_plan_light_edit():
    """v3.19.157: a stage's light edits merge onto the cached light block — the
    active mode enables the right period and times convert HH:MM -> seconds, while
    weekmask/mLevel are preserved."""
    from custom_components.sf.proxy.command_handler import build_plan
    plan_cfg = {"enabled": 0, "stage": [
        {"stageId": 7, "label": "Veg",
         "light1": {"modeType": 1, "mLevel": 85, "weekmask": 127,
                    "timePeriod": [{"enabled": 1, "weekmask": 127, "startTime": 7200,
                                    "endTime": 50400, "brightness": 85}],
                    "ppfdPeriod": [{"enabled": 0, "weekmask": 127}],
                    "ppfdMinBrightness": 11, "ppfdMaxBrightness": 100},
         "target": {}}]}
    stages = [{"stageId": 7, "label": "Veg",
               "light1": {"mode": "PPFD", "ppfd_start": "05:00", "ppfd_stop": "23:00",
                          "ppfd_target": 450, "ppfd_min": 20, "ppfd_max": 90,
                          "ppfd_fade": 30}}]
    l1 = build_plan(CB_MAC, "u1", stages, True, plan_cfg)["params"]["plan"]["stage"][0]["light1"]
    assert l1["modeType"] == 12                     # PPFD
    assert l1["mLevel"] == 85                        # preserved
    assert l1["ppfdPeriod"][0]["enabled"] == 1 and l1["timePeriod"][0]["enabled"] == 0
    assert l1["ppfdPeriod"][0]["startTime"] == 18000 and l1["ppfdPeriod"][0]["endTime"] == 82800
    assert l1["ppfdPeriod"][0]["brightness"] == 450 and l1["ppfdPeriod"][0]["fadeTime"] == 1800
    assert l1["ppfdMinBrightness"] == 20 and l1["ppfdMaxBrightness"] == 90


def test_apply_plan_progress_merges():
    """getConfigFile stages + getDevSta progress merge into one plan payload."""
    import json
    from custom_components.sf.bus import SfBus
    bus = object.__new__(SfBus)
    bus._plan_state = {}
    bus._registered = {f"ggs_{CB_MAC_LC}_plan"}   # pretend already registered
    published = {}
    bus.publish = lambda topic, payload=None, **kw: published.__setitem__(topic, payload)
    bus.apply_plan(CB_MAC, True, [{"stageId": 7, "label": "Veg"}], present=True)
    bus.apply_plan_progress(CB_MAC, {"running": True, "stageId": 7, "progress": 42})
    p = json.loads(published[f"ggs/ha/{CB_MAC_LC}/plan/state"])
    assert p["active"] is True
    assert p["stages"][0]["stageId"] == 7
    assert p["progress"]["progress"] == 42
    assert published[f"ggs/ha/{CB_MAC_LC}/plan_enabled/state"] == "ON"


def test_apply_plan_keeps_stages_when_active_frame_drops_them():
    """A getConfigFile that reports the plan enabled but an empty stage list must
    not blank the cached stages — otherwise the sensor can't match the running
    stage and bounces between the stage label ("Flowering") and a bare "active".
    Stages clear only when the plan actually goes inactive. (regression 3.19.174)"""
    import json
    from custom_components.sf.bus import SfBus
    bus = object.__new__(SfBus)
    bus._plan_state = {}
    bus._registered = {f"ggs_{CB_MAC_LC}_plan"}
    published = {}
    bus.publish = lambda topic, payload=None, **kw: published.__setitem__(topic, payload)
    bus.apply_plan(CB_MAC, True, [{"stageId": 7, "label": "Veg"}], present=True)
    bus.apply_plan_progress(CB_MAC, {"running": True, "stageId": 7})
    # A frame arrives with the plan still enabled but no stages — must be ignored.
    bus.apply_plan(CB_MAC, True, [])
    p = json.loads(published[f"ggs/ha/{CB_MAC_LC}/plan/state"])
    assert p["active"] is True
    assert p["stages"] and p["stages"][0]["stageId"] == 7   # not blanked
    # Actually stopping the plan does clear the stages.
    bus.apply_plan(CB_MAC, False, [])
    p2 = json.loads(published[f"ggs/ha/{CB_MAC_LC}/plan/state"])
    assert p2["active"] is False
    assert p2["stages"] == []
