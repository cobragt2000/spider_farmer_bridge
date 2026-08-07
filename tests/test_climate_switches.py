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
    "dehumidifier": {"mLevel": 1, "modeType": 0},
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
    # humidifier on=1 → on; dehumidifier has no "on" field → off;
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
    """A config frame with mOnOff 0 turns the tile off promptly; mOnOff 1 must
    NOT force it on (the running state stays with live frames)."""
    from custom_components.sf.proxy.normalizer import normalize_config_response
    M, m = "0A1B2C3D4E01", "0a1b2c3d4e01"
    r = normalize_config_response(
        M, {"data": {"dehumidifier": {"modeType": 4, "mOnOff": 0, "mLevel": 1}}})
    assert r[f"ggs/ha/{m}/dehumidifier_active/state"] == "OFF"
    r = normalize_config_response(
        M, {"data": {"dehumidifier": {"modeType": 4, "mOnOff": 1, "mLevel": 1}}})
    assert f"ggs/ha/{m}/dehumidifier_active/state" not in r


async def test_oplog_drives_climate_onoff(hass: HomeAssistant):
    """v3.19.146: the controller reports an auto-mode dehumidifier/humidifier
    turning ON in getDevSta but never the OFF — only the operation log records
    the stop (opType 1 = on, absent = off). The switch follows the op log."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "off"

    # op log: dehumidifier (devType 26) turned ON
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 26, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "on"

    # newer op-log entry: turned OFF (no opType) — the signal getDevSta misses
    bus.apply_oplog(CB_MAC, [
        {"id": 2, "epoch": 200, "devType": 26, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "off"

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


async def test_oplog_drives_heater_onoff(hass: HomeAssistant):
    """Heater (devType 25) on/off is driven by the op log too."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"
    bus.apply_oplog(CB_MAC, [{"id": 1, "epoch": 100, "devType": 25, "opType": 1, "modeType": 3}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "on"
    bus.apply_oplog(CB_MAC, [{"id": 2, "epoch": 200, "devType": 25, "modeType": 3}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
