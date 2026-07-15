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
    # Live state topics must NOT appear (stale mOnOff must not fight getDevSta)
    assert f"ggs/ha/{CB_MAC_LC}/fan/state" not in r
    assert f"ggs/ha/{CB_MAC_LC}/heater_active/state" not in r


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
