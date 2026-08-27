"""Manual on/off switches for climate accessories (v3.5.0).

Heater / Humidifier / Dehumidifier each get a switch entity:
- created only on block evidence (same gating as their sensors)
- state mirrors the accessory's _active topic
- ON/OFF commands reach the device as manual mOnOff writes, with a
  last-running-level fallback so heater/humidifier ON is never a no-op
- commands are refused while control is disabled
"""
import asyncio
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import (
    MQTTPacket, MQTT_PUBLISH, parse_packets,
)

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"


def test_blower_power_toggle_preserves_env_config():
    """v3.19.125: toggling a fan/blower that is in a config mode (Environment)
    must preserve modeType/maxSpeed/minSpeed. The bug (from the device log): the
    power write sent a bare manual block that wiped the speed settings set 1ms
    earlier, so Running/Standby Speed reverted to blank/Off after Apply."""
    from custom_components.sf.proxy.command_handler import translate_command

    # Cache carries live-only keys (level/on) that must be stripped from writes.
    env = {"blower": {"modeType": 4, "mOnOff": 0, "mLevel": 90,
                      "maxSpeed": 90, "minSpeed": 40, "closeCO2": 0,
                      "level": 5, "on": 1,
                      "timePeriod": [{"weekmask": 127}]}}

    # Power toggle preserves modeType/speeds.
    blk = translate_command("blower", "ON", CB_MAC, "u1",
                            fan_state=env)["params"]["blower"]
    assert blk["mOnOff"] == 1 and blk["maxSpeed"] == 90
    assert blk["minSpeed"] == 40 and blk["modeType"] == 4
    assert "level" not in blk and "on" not in blk   # live keys stripped

    # Percentage change ALSO preserves modeType/speeds (the path 3.19.125 missed).
    b2 = translate_command("blower", "50", CB_MAC, "u1",
                           subfield="percentage", fan_state=env)["params"]["blower"]
    assert b2["mLevel"] == 50 and b2["modeType"] == 4
    assert b2["maxSpeed"] == 90 and b2["minSpeed"] == 40

    # No cache → still a valid minimal manual block.
    cmd3 = translate_command("blower", "OFF", CB_MAC, "u1", fan_state={})
    assert cmd3["params"]["blower"]["mOnOff"] == 0
    assert "maxSpeed" not in cmd3["params"]["blower"]

CB_DATA = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "humidifier": {"on": 1, "mLevel": 2, "modeType": 0},
    "dehumidifier": {"mLevel": 1, "modeType": 0, "mOnOff": 0},
    "heater": {"mLevel": 0, "modeType": 0},
}

# Same CB but without any climate blocks — evidence gating check
CB_DATA_BARE = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
}


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


async def _setup(hass: HomeAssistant, allow_control: bool = True) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Spider Farmer Bridge",
        data={
            "listen_port": 18893,
            "upstream_host": "sf.mqtt.spider-farmer.com",
            "upstream_port": 8883,
            "allow_control": allow_control,
        },
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _simulate_cb(bus, data=CB_DATA):
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):  # CB typing is tentative — needs the window
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    return session


class _FakeWriter:
    def __init__(self, sink: bytearray):
        self._sink = sink

    def write(self, data):
        self._sink.extend(data)

    async def drain(self):
        pass


def _injected(captured: bytes) -> list[dict]:
    pkts, _ = parse_packets(bytes(captured))
    return [json.loads(p.message) for p in pkts if p.message]


async def test_climate_switch_entities_and_state(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()

    # Exact slot-based entity ids, state mirrors the _active topics:
    # humidifier on=1 → on; dehumidifier mOnOff=0 → off (its live `level` is the
    # gear, not a running output, so on/off comes from mOnOff/op log);
    # heater level 0 → off.
    hum = hass.states.get("switch.sf_dp1_humidifier")
    deh = hass.states.get("switch.sf_dp1_dehumidifier")
    heat = hass.states.get("switch.sf_dp1_heater")
    assert hum is not None and hum.state == "on"
    assert deh is not None and deh.state == "off"
    assert heat is not None and heat.state == "off"

    # Identity: unique_ids keep the ggs_{mac}_{field} scheme
    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    assert reg.async_get("switch.sf_dp1_heater").unique_id == f"ggs_{CB_MAC_LC}_heater"
    assert reg.async_get("switch.sf_dp1_humidifier").unique_id == f"ggs_{CB_MAC_LC}_humidifier"
    assert reg.async_get("switch.sf_dp1_dehumidifier").unique_id == f"ggs_{CB_MAC_LC}_dehumidifier"

    # State follows the device: humidifier reports off on the next frame
    session = ProxySession(CB_MAC, bus)
    data = dict(CB_DATA)
    data["humidifier"] = {"mLevel": 2, "modeType": 0}  # no "on" → not running
    for _ in range(3):
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "off"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_climate_switches_evidence_gated(hass: HomeAssistant):
    """No climate blocks in the frames → no climate switches."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus, CB_DATA_BARE)
    await hass.async_block_till_done()

    assert hass.states.get("switch.sf_dp1_heater") is None
    assert hass.states.get("switch.sf_dp1_humidifier") is None
    assert hass.states.get("switch.sf_dp1_dehumidifier") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_climate_switch_commands_produce_device_payload(hass: HomeAssistant):
    """ON/OFF through the REAL handler lands on the device as a manual
    mOnOff write with a sane level."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.allow_control = True

    session = ProxySession(CB_MAC, bus)
    captured = bytearray()
    session._client_writer = _FakeWriter(captured)
    session.confirm_delay = 0.01
    proxy._sessions[CB_MAC_LC] = session
    for _ in range(3):
        _process_publish(session, _pkt(CB_DATA), bus)
    await hass.async_block_till_done()

    # Heater ON — cached level is 0, no run history → falls back to 1
    captured.clear()
    await hass.services.async_call(
        "switch", "turn_on",
        {"entity_id": "switch.sf_dp1_heater"}, blocking=True,
    )
    cmds = [m for m in _injected(captured)
            if m.get("method") == "setConfigField"
            and "heater" in (m.get("params") or {})]
    assert cmds, "heater ON produced no device payload"
    assert cmds[-1]["params"]["heater"]["mOnOff"] == 1
    assert cmds[-1]["params"]["heater"]["mLevel"] == 1

    # Humidifier OFF — keeps the current level, mOnOff 0
    captured.clear()
    await hass.services.async_call(
        "switch", "turn_off",
        {"entity_id": "switch.sf_dp1_humidifier"}, blocking=True,
    )
    cmds = [m for m in _injected(captured)
            if m.get("method") == "setConfigField"
            and "humidifier" in (m.get("params") or {})]
    assert cmds, "humidifier OFF produced no device payload"
    assert cmds[-1]["params"]["humidifier"]["mOnOff"] == 0
    assert cmds[-1]["params"]["humidifier"]["mLevel"] == 2

    # Humidifier ON — ran at level 2, so the last-nonzero fallback isn't
    # needed; the cached level rides along
    captured.clear()
    await hass.services.async_call(
        "switch", "turn_on",
        {"entity_id": "switch.sf_dp1_humidifier"}, blocking=True,
    )
    cmds = [m for m in _injected(captured)
            if "humidifier" in (m.get("params") or {})]
    assert cmds and cmds[-1]["params"]["humidifier"]["mLevel"] == 2

    # Dehumidifier ON — level 0 would be a REAL setting (Low); it must
    # NOT be bumped by the fallback. Wipe cache to force level 0.
    session.device_state["dehumidifier"] = {}
    captured.clear()
    await hass.services.async_call(
        "switch", "turn_on",
        {"entity_id": "switch.sf_dp1_dehumidifier"}, blocking=True,
    )
    cmds = [m for m in _injected(captured)
            if "dehumidifier" in (m.get("params") or {})]
    assert cmds and cmds[-1]["params"]["dehumidifier"]["mOnOff"] == 1
    assert cmds[-1]["params"]["dehumidifier"]["mLevel"] == 0

    # Let echo-triggered confirm polls settle
    await asyncio.sleep(0.1)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_climate_switch_control_gate(hass: HomeAssistant):
    """With control disabled, a switch command raises a visible error."""
    entry = await _setup(hass, allow_control=False)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()

    assert hass.states.get("switch.sf_dp1_heater") is not None
    with pytest.raises(HomeAssistantError):
        await hass.services.async_call(
            "switch", "turn_on",
            {"entity_id": "switch.sf_dp1_heater"}, blocking=True,
        )

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_humidifier_auto_gear_writes_level_field():
    """v3.19.138: the Humidity-mode gear (Automatic / 1-4) writes the device
    `level` field (Automatic -> 0), which is normally stripped from writes, while
    mLevel stays the real setpoint — matching the SF app exactly."""
    import json
    from custom_components.sf.proxy.command_handler import _cmd_climate_config

    state = {"humidifier": {"modeType": 4, "mOnOff": 0, "mLevel": 1, "level": 1,
                            "timePeriod": [{"enabled": 1, "weekmask": 127}],
                            "cycleTime": {"weekmask": 127, "startTime": 0,
                                          "openDur": 0, "closeDur": 0, "times": 1}}}

    msg = _cmd_climate_config(
        "MAC", "UID", "humidifier",
        json.dumps({"mode": "Humidity", "auto_gear": "Automatic"}),
        "apply_bundle", state)
    blk = msg["params"]["humidifier"]
    assert blk["level"] == 0        # Automatic
    assert blk["mLevel"] == 1       # real setpoint preserved, not the gear
    assert blk["modeType"] == 4     # Humidity

    msg2 = _cmd_climate_config(
        "MAC", "UID", "humidifier", json.dumps({"auto_gear": "4"}),
        "apply_bundle", state)
    blk2 = msg2["params"]["humidifier"]
    assert blk2["level"] == 4       # fixed level 4
    assert blk2["mLevel"] == 1


def test_manual_gear_and_power_apply_in_one_write():
    """v3.19.245: a Manual heater's gear + power are committed in ONE apply_bundle
    (mLevel + mOnOff in the same config write) so they never race as two writes —
    which previously applied the STALE level and turned the accessory on
    unexpectedly. `onoff` -> mOnOff, `gear` -> mLevel, both in one block."""
    import json
    from custom_components.sf.proxy.command_handler import _cmd_climate_config
    state = {"heater": {"modeType": 0, "mOnOff": 0, "mLevel": 8,
                        "timePeriod": [{"enabled": 1, "weekmask": 127}],
                        "cycleTime": {"weekmask": 127}}}
    m = _cmd_climate_config(
        "MAC", "UID", "heater",
        json.dumps({"mode": "Manual", "gear": "9", "onoff": "on"}),
        "apply_bundle", state)
    blk = m["params"]["heater"]
    assert blk["modeType"] == 0        # Manual
    assert blk["mLevel"] == 9          # the level the user PICKED (not the stale 8)
    assert blk["mOnOff"] == 1          # power on, same write
    # power-off only, gear untouched -> mOnOff 0, level preserved (no auto-anything)
    m2 = _cmd_climate_config(
        "MAC", "UID", "heater", json.dumps({"onoff": "off"}), "apply_bundle", state)
    blk2 = m2["params"]["heater"]
    assert blk2["mOnOff"] == 0
    assert blk2["mLevel"] == 8
    # gear-only change must NOT turn the (off) heater on
    m3 = _cmd_climate_config(
        "MAC", "UID", "heater", json.dumps({"gear": "3"}), "apply_bundle", state)
    blk3 = m3["params"]["heater"]
    assert blk3["mLevel"] == 3
    assert blk3["mOnOff"] == 0         # stayed off


def test_humidifier_gear_decoded_from_config_response():
    """v3.19.143: the gear is decoded from CONFIG responses (config `level`,
    0 -> Automatic, 1-4), not the live decoder — a live getDevSta frame's `level`
    is the running output, not the gear."""
    from custom_components.sf.proxy.normalizer import (
        normalize_config_response, _decode_humidifier)

    r = normalize_config_response(
        "0A1B2C3D4E01", {"data": {"humidifier": {"modeType": 4, "level": 0}}})
    assert r["ggs/ha/0a1b2c3d4e01/humidifier_gear/state"] == "Automatic"
    r = normalize_config_response(
        "0A1B2C3D4E01", {"data": {"humidifier": {"modeType": 4, "level": 4}}})
    assert r["ggs/ha/0a1b2c3d4e01/humidifier_gear/state"] == "4"

    # The live decoder must NOT publish a gear (its `level` is the running level).
    out = {}
    _decode_humidifier(out, "0a1b2c3d4e01", {"modeType": 4, "mOnOff": 0, "level": 3})
    assert "ggs/ha/0a1b2c3d4e01/humidifier_gear/state" not in out


def test_heater_and_dehumidifier_auto_gear_write_level():
    """v3.19.139: heater gear = level (0=Automatic, 1-10); dehumidifier gear =
    level (0=Low, 1=High, no Automatic). Both via the auto_gear subfield."""
    import json
    from custom_components.sf.proxy.command_handler import _cmd_climate_config

    hstate = {"heater": {"modeType": 3, "mOnOff": 0, "mLevel": 1, "level": 1,
                         "timePeriod": [{"enabled": 1, "weekmask": 127}],
                         "cycleTime": {"weekmask": 127, "startTime": 0,
                                       "openDur": 0, "closeDur": 0, "times": 1}}}
    m = _cmd_climate_config("MAC", "UID", "heater",
                            json.dumps({"auto_gear": "Automatic"}), "apply_bundle", hstate)
    assert m["params"]["heater"]["level"] == 0
    m = _cmd_climate_config("MAC", "UID", "heater",
                            json.dumps({"auto_gear": "5"}), "apply_bundle", hstate)
    assert m["params"]["heater"]["level"] == 5

    dstate = {"dehumidifier": {"modeType": 4, "mOnOff": 0, "mLevel": 0, "level": 0,
                               "timePeriod": [{"weekmask": 127}],
                               "cycleTime": {"weekmask": 127, "startTime": 0,
                                             "openDur": 0, "closeDur": 0, "times": 1}}}
    m = _cmd_climate_config("MAC", "UID", "dehumidifier",
                            json.dumps({"auto_gear": "Low"}), "apply_bundle", dstate)
    assert m["params"]["dehumidifier"]["level"] == 0
    m = _cmd_climate_config("MAC", "UID", "dehumidifier",
                            json.dumps({"auto_gear": "High"}), "apply_bundle", dstate)
    assert m["params"]["dehumidifier"]["level"] == 1


def test_fan_environment_running_speed_automatic():
    """v3.19.139: fan/blower Environment running gear/speed accepts Automatic
    (maxSpeed 0 = the controller picks it)."""
    import json
    from custom_components.sf.proxy.command_handler import _cmd_fan_config

    fan_state = {"fan": {"modeType": 3, "mOnOff": 1, "mLevel": 1, "maxSpeed": 5,
                         "minSpeed": 0, "natural": 0, "shakeLevel": 0,
                         "timePeriod": [{"enabled": 1, "weekmask": 127}],
                         "cycleTime": {"weekmask": 127}}}
    # The card sends "0" for Automatic (via autoOpts) AND the string form; both
    # must resolve to maxSpeed 0 — and must NOT zero mLevel (0 reads as OFF).
    for auto in ("Automatic", "0"):
        m = _cmd_fan_config("MAC", "UID", "fan",
                            json.dumps({"schedule_speed": auto}), "apply_bundle", {}, fan_state)
        assert m["params"]["fan"]["maxSpeed"] == 0, auto
        assert m["params"]["fan"]["mLevel"] == 1, auto   # preserved, not zeroed
    m = _cmd_fan_config("MAC", "UID", "fan",
                        json.dumps({"schedule_speed": "5"}), "apply_bundle", {}, fan_state)
    assert m["params"]["fan"]["maxSpeed"] == 5
    assert m["params"]["fan"]["mLevel"] == 5


def test_heater_dehumidifier_gear_decode_from_config_response():
    """v3.19.143: heater/dehumidifier gears decode from CONFIG responses."""
    from custom_components.sf.proxy.normalizer import normalize_config_response
    M, m = "0A1B2C3D4E01", "0a1b2c3d4e01"
    r = normalize_config_response(M, {"data": {"heater": {"modeType": 3, "level": 0}}})
    assert r[f"ggs/ha/{m}/heater_gear/state"] == "Automatic"
    r = normalize_config_response(M, {"data": {"heater": {"modeType": 3, "level": 5}}})
    assert r[f"ggs/ha/{m}/heater_gear/state"] == "5"
    r = normalize_config_response(M, {"data": {"dehumidifier": {"modeType": 4, "level": 0}}})
    assert r[f"ggs/ha/{m}/dehumidifier_gear/state"] == "Low"
    r = normalize_config_response(M, {"data": {"dehumidifier": {"modeType": 4, "level": 1}}})
    assert r[f"ggs/ha/{m}/dehumidifier_gear/state"] == "High"


def test_climate_on_prefers_running_level():
    """v3.19.145: an auto-mode accessory reports on:1 while idle, so the running
    output `level` is the real on/off (level 0 = off), not `on`."""
    from custom_components.sf.proxy.normalizer import _climate_on
    assert _climate_on({"on": 1, "level": 0}) is False   # enabled but idle
    assert _climate_on({"on": 1, "level": 3}) is True     # running
    assert _climate_on({"mOnOff": 0}) is False            # config: disabled
    assert _climate_on({"mOnOff": 1}) is True             # config: no level


def test_climate_config_frame_turns_tile_off_when_disabled():
    """A config frame with mOnOff 0 turns the tile off promptly. For the
    heater/humidifier, mOnOff 1 must NOT force it on — their running state stays
    with the live `level`. The dehumidifier is the exception (v3.19.237): its live
    `level` is the Low/High GEAR, not a running output, so `mOnOff` is its
    authoritative on/off and drives the tile BOTH ways."""
    from custom_components.sf.proxy.normalizer import normalize_config_response
    M, m = "0A1B2C3D4E01", "0a1b2c3d4e01"
    # heater: disable turns off, but enable must not force on
    r = normalize_config_response(
        M, {"data": {"heater": {"modeType": 3, "mOnOff": 0, "level": 1}}})
    assert r[f"ggs/ha/{m}/heater_active/state"] == "OFF"
    r = normalize_config_response(
        M, {"data": {"heater": {"modeType": 3, "mOnOff": 1, "level": 1}}})
    assert f"ggs/ha/{m}/heater_active/state" not in r
    # dehumidifier: mOnOff is authoritative both ways
    r = normalize_config_response(
        M, {"data": {"dehumidifier": {"modeType": 4, "mOnOff": 0, "mLevel": 1}}})
    assert r[f"ggs/ha/{m}/dehumidifier_active/state"] == "OFF"
    r = normalize_config_response(
        M, {"data": {"dehumidifier": {"modeType": 4, "mOnOff": 1, "mLevel": 1}}})
    assert r[f"ggs/ha/{m}/dehumidifier_active/state"] == "ON"


def test_dehumidifier_live_gear_does_not_force_off():
    """v3.19.237: the dehumidifier's live `level` is the Low/High GEAR, not a
    running output (a unit running at Low reports level:0). A bare live status
    block carrying only the gear must NOT publish dehumidifier_active — otherwise
    it forced the tile OFF while the unit was switched ON. On/off comes from the
    config `mOnOff` + the op log. An explicit on/mOnOff signal is still honored."""
    from custom_components.sf.proxy.normalizer import _decode_dehumidifier
    m = "0a1b2c3d4e01"
    out = {}
    _decode_dehumidifier(out, m, {"level": 0})          # gear only
    assert f"ggs/ha/{m}/dehumidifier_active/state" not in out
    out = {}
    _decode_dehumidifier(out, m, {"mOnOff": 1, "level": 0})   # explicit on
    assert out[f"ggs/ha/{m}/dehumidifier_active/state"] == "ON"
    out = {}
    _decode_dehumidifier(out, m, {"mOnOff": 0, "level": 1})   # explicit off
    assert out[f"ggs/ha/{m}/dehumidifier_active/state"] == "OFF"


def _cfg(data: dict) -> MQTTPacket:
    """A getConfigField frame (config response) for the CB, mirroring _pkt."""
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps(
            {"method": "getConfigField", "uid": "u1", "data": data}
        ).encode(),
    )


async def test_oplog_off_only_for_climate(hass: HomeAssistant):
    """v3.19.243: the op log is an OFF-ONLY supplement for the heater/humidifier —
    the live getDevSta `level` owns the ON state (level>0 = on, 0 = off, and the
    controller DOES report the idle 0). An op-log opType 2 turns the tile off (the
    auto-off the live frame can miss); a null heartbeat is ignored; and an op-log
    opType 1 must NOT turn the tile on — that stale "on" (e.g. while enabled-but-idle
    in Temperature mode) would flicker against the live "off" every getDevSta frame.
    (The dehumidifier is config-mOnOff driven — see
    test_dehumidifier_onoff_from_config_not_oplog.)"""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()
    # humidifier came up ON from the live frame (on:1)
    assert hass.states.get("switch.sf_dp1_humidifier").state == "on"

    # op log OFF (opType 2) turns it off — the stop getDevSta never reports.
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 27, "opType": 2, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "off"

    # null heartbeat — not a transition; stays off.
    bus.apply_oplog(CB_MAC, [
        {"id": 2, "epoch": 200, "devType": 27, "opType": None, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "off"

    # op-log opType 1 must NOT turn it back on (no live frame says it's running).
    bus.apply_oplog(CB_MAC, [
        {"id": 3, "epoch": 300, "devType": 27, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "off"

    # a LIVE frame with the humidifier running (on:1) is what turns it on.
    _simulate_cb(bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "on"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_dehumidifier_onoff_from_config_not_oplog(hass: HomeAssistant):
    """v3.19.238: the dehumidifier's on/off is owned by the config `mOnOff` (the
    switch state), NOT the op log. The op log can miss the turn-off entirely
    (switching it off via a mode change logs no opType 2), leaving a stale
    opType-1 "on" — which must NOT override a config mOnOff:0. (User bug: the
    dehumidifier was switched off but the tile stayed on.)"""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = _simulate_cb(bus)   # CB detection registers the entities
    await hass.async_block_till_done()

    # config: dehumidifier in Humidity auto, switched ON
    _process_publish(session, _cfg(
        {"dehumidifier": {"modeType": 4, "mOnOff": 1, "mLevel": 0}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "on"

    # a stale op-log "on" arrives (and never gets a matching opType-2 off)
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 26, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()

    # config: switched OFF (mOnOff 0) — the tile must go off
    _process_publish(session, _cfg(
        {"dehumidifier": {"modeType": 0, "mOnOff": 0, "mLevel": 0}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "off"

    # re-processing the op log (still holding the stale opType-1) must NOT flip it
    # back on — the op log does not drive the dehumidifier anymore.
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 26, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "off"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_oplog_stale_on_never_flashes_heater(hass: HomeAssistant):
    """v3.19.243: a getDevOpLog fetch often holds a stale opType-1 "on" (the last
    actuation, e.g. while the heater is enabled-but-idle in Temperature mode). The
    op log is OFF-only, so replaying that stale "on" must NEVER turn the tile on —
    it would flicker against the live "off" every getDevSta frame. The heater's ON
    comes only from a live frame with level>0."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = _simulate_cb(bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"

    # op log holds a stale opType-1 "on" (newest is a null heartbeat) — must NOT
    # turn the tile on while the live level says it's idle.
    bus.apply_oplog(CB_MAC, [
        {"id": 2, "epoch": 200, "devType": 25, "opType": None, "modeType": 3},
        {"id": 1, "epoch": 100, "devType": 25, "opType": 1, "modeType": 3}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"

    # a LIVE frame with the heater actually running (level>0) turns it on.
    _process_publish(session, _pkt(
        {**CB_DATA, "heater": {"level": 3, "modeType": 3}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "on"

    # op log OFF (opType 2) is still honored — the auto-off the live frame misses.
    bus.apply_oplog(CB_MAC, [
        {"id": 3, "epoch": 300, "devType": 25, "opType": 2, "modeType": 3}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_decode_oplog_and_heater_devtype():
    """v3.19.146: decode_oplog parses the getDevOpLog list; devType 25 = heater,
    26 = dehumidifier, 27 = humidifier."""
    from custom_components.sf.proxy.normalizer import decode_oplog
    events = decode_oplog({"data": {"count": 2, "list": [
        {"id": 10, "epoch": 100, "devType": 25, "opType": 1, "modeType": 3},
        {"id": 11, "epoch": 200, "devType": 25, "modeType": 3},
    ]}})
    assert [e["id"] for e in events] == [10, 11]
    assert events[0]["opType"] == 1 and events[1]["opType"] is None


async def test_heater_onoff_from_live_level(hass: HomeAssistant):
    """v3.19.243: the heater's running state comes from the LIVE getDevSta `level`
    (level>0 = on, 0 = off — the controller DOES report the idle 0). The op log is
    an OFF-only supplement (see test_oplog_stale_on_never_flashes_heater)."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = _simulate_cb(bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"
    # live frame: heater running at level 4 -> on
    _process_publish(session, _pkt(
        {**CB_DATA, "heater": {"level": 4, "modeType": 3}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "on"
    # live frame: idle level 0 -> off (the off the controller reports directly)
    _process_publish(session, _pkt(
        {**CB_DATA, "heater": {"level": 0, "modeType": 3}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
