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
    # v3.19.330: a percentage command (level >= 1) must also power the blower ON.
    # The cache here is mOnOff=0 (blower off); before the fix set_percentage kept
    # that 0, so "set speed + turn on" from the card set the level but left the
    # blower off and needed a second toggle.
    assert b2["mOnOff"] == 1

    # Same with no cache: percentage builds an ON block (not the cached/off state).
    b3 = translate_command("blower", "50", CB_MAC, "u1",
                           subfield="percentage", fan_state={})["params"]["blower"]
    assert b3["mLevel"] == 50 and b3["mOnOff"] == 1

    # No cache → still a valid minimal manual block.
    cmd3 = translate_command("blower", "OFF", CB_MAC, "u1", fan_state={})
    assert cmd3["params"]["blower"]["mOnOff"] == 0
    assert "maxSpeed" not in cmd3["params"]["blower"]


def test_dehumidifier_onoff_preserves_gear():
    """v3.19.330: a bare dehumidifier on/off (quick-toggle or a non-bundled power
    toggle) must KEEP the configured Low/High gear. The gear is config mLevel
    (0=Low, 1=High); the dehumidifier's live `level` echoes 0 while off, so reading
    that on a power-on reset the gear to Low every time — the "High reverts to Low
    on power-on" bug. The cache here carries config mLevel=1 (High) plus a stale
    live level=0 (off echo); the on/off must emit mLevel=1."""
    from custom_components.sf.proxy.command_handler import translate_command
    state = {"dehumidifier": {"modeType": 0, "mOnOff": 0, "mLevel": 1, "level": 0,
                              "timePeriod": [{"enabled": 1, "weekmask": 127}]}}
    on = translate_command("dehumidifier", "ON", CB_MAC, "u1",
                           device_state=state)["params"]["dehumidifier"]
    assert on["mOnOff"] == 1
    assert on["mLevel"] == 1          # High preserved, NOT reset to Low
    off = translate_command("dehumidifier", "OFF", CB_MAC, "u1",
                            device_state=state)["params"]["dehumidifier"]
    assert off["mOnOff"] == 0 and off["mLevel"] == 1

    # Low (gear 0) stays Low on power-on too (not bumped like heater/humidifier).
    state_low = {"dehumidifier": {"modeType": 0, "mOnOff": 0, "mLevel": 0, "level": 0,
                                  "timePeriod": [{"enabled": 1, "weekmask": 127}]}}
    on_low = translate_command("dehumidifier", "ON", CB_MAC, "u1",
                               device_state=state_low)["params"]["dehumidifier"]
    assert on_low["mOnOff"] == 1 and on_low["mLevel"] == 0

    # Heater still bumps a 0 level to the last running level on power-on (unchanged).
    st_heat = {"heater": {"modeType": 0, "mOnOff": 0, "mLevel": 0, "level": 0}}
    h = translate_command("heater", "ON", CB_MAC, "u1", device_state=st_heat,
                          last_nonzero_level={"heater": 6})["params"]["heater"]
    assert h["mOnOff"] == 1 and h["mLevel"] == 6


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
    # Default gear is Automatic (none cached), so heater/humidifier on/off is
    # LIVE-level driven (v3.19.347, responsive): humidifier on=1 → on; heater has
    # no live-on → off. The dehumidifier is always op-log driven — seed an off.
    bus.apply_oplog(CB_MAC, [
        {"id": 3, "epoch": 100, "devType": 26, "opType": None, "modeType": 4}])
    await hass.async_block_till_done()

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

    # With an Automatic gear a live frame drives on/off: humidifier reports no
    # running (no "on", level 0) → off, instantly.
    session = ProxySession(CB_MAC, bus)
    data = dict(CB_DATA)
    data["humidifier"] = {"mLevel": 2, "modeType": 4}   # no "on"/level → not running
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


def test_dehumidifier_level_syncs_config_level():
    """v3.19.419: the dedicated "Dehumidifier Gear" select was removed; the single
    "Dehumidifier Level" (Low/High) now keeps config `level` (the Humidity-mode gear)
    in sync with `mLevel`, so the one control drives Humidity mode too. A level/wind
    write must set BOTH fields."""
    import json
    from custom_components.sf.proxy.command_handler import _cmd_climate_config
    dstate = {"dehumidifier": {"modeType": 4, "mOnOff": 1, "mLevel": 0, "level": 0,
                               "timePeriod": [{"weekmask": 127}],
                               "cycleTime": {"weekmask": 127, "startTime": 0,
                                             "openDur": 0, "closeDur": 0, "times": 1}}}
    m = _cmd_climate_config("MAC", "UID", "dehumidifier", "High", "level", dstate)
    assert m["params"]["dehumidifier"]["mLevel"] == 1
    assert m["params"]["dehumidifier"]["level"] == 1          # synced
    m = _cmd_climate_config("MAC", "UID", "dehumidifier",
                            json.dumps({"wind": "Low"}), "apply_bundle", dstate)
    assert m["params"]["dehumidifier"]["mLevel"] == 0
    assert m["params"]["dehumidifier"]["level"] == 0          # synced
    # A non-dehumidifier (heater) must NOT get the sync (it has a real Automatic gear).
    hstate = {"heater": {"modeType": 3, "mOnOff": 1, "mLevel": 2, "level": 5,
                         "timePeriod": [{"weekmask": 127}], "cycleTime": {"weekmask": 127}}}
    m = _cmd_climate_config("MAC", "UID", "heater", "3", "level", hstate)
    assert m["params"]["heater"]["mLevel"] == 3
    assert "level" not in m["params"]["heater"]               # stripped, not synced


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


def test_climate_config_frame_never_publishes_active():
    """v3.19.346: on/off for ALL three accessories is op-log driven, so a config
    frame NEVER publishes `{field}_active` — not even mOnOff 0. In Environment/auto
    mode mOnOff sits at 0 while the unit cycles (it means "enabled", not
    "running"), so publishing on/off from it fought the real state. Config still
    publishes the gear/level and the cfg_on flag."""
    from custom_components.sf.proxy.normalizer import normalize_config_response
    M, m = "0A1B2C3D4E01", "0a1b2c3d4e01"
    # heater: neither disable nor enable publishes active; cfg_on tracks mOnOff.
    r = normalize_config_response(
        M, {"data": {"heater": {"modeType": 3, "mOnOff": 0, "level": 1}}})
    assert f"ggs/ha/{m}/heater_active/state" not in r
    assert r[f"ggs/ha/{m}/heater_cfg_on/state"] == "OFF"
    r = normalize_config_response(
        M, {"data": {"heater": {"modeType": 3, "mOnOff": 1, "level": 1}}})
    assert f"ggs/ha/{m}/heater_active/state" not in r
    assert r[f"ggs/ha/{m}/heater_cfg_on/state"] == "ON"
    # humidifier: same — no active from config.
    r = normalize_config_response(
        M, {"data": {"humidifier": {"modeType": 4, "mOnOff": 0, "level": 2}}})
    assert f"ggs/ha/{m}/humidifier_active/state" not in r
    # dehumidifier: on/off is op-log driven now (v3.19.344) — config publishes the
    # GEAR (Low/High) from the `level` field (NOT `mLevel`, v3.19.349) but never
    # the active state. Both the gear SELECT and the LEVEL sensor read `level`.
    r = normalize_config_response(
        M, {"data": {"dehumidifier": {"modeType": 4, "mOnOff": 1, "mLevel": 1, "level": 0}}})
    assert f"ggs/ha/{m}/dehumidifier_active/state" not in r
    assert r[f"ggs/ha/{m}/dehumidifier_level/state"] == "Low"   # level 0 = Low (mLevel ignored)
    assert r[f"ggs/ha/{m}/dehumidifier_gear/state"] == "Low"
    r = normalize_config_response(
        M, {"data": {"dehumidifier": {"modeType": 4, "mOnOff": 1, "mLevel": 1, "level": 1}}})
    assert r[f"ggs/ha/{m}/dehumidifier_level/state"] == "High"  # level 1 = High
    assert r[f"ggs/ha/{m}/dehumidifier_gear/state"] == "High"


def test_dehumidifier_live_never_publishes_active():
    """v3.19.344: the dehumidifier's on/off is owned by the op log (bus.apply_oplog),
    so neither the live nor the config decoder publishes dehumidifier_active."""
    from custom_components.sf.proxy.normalizer import _decode_dehumidifier
    m = "0a1b2c3d4e01"
    # The live decoder never publishes active (op log owns on/off).
    for mod in ({"level": 0}, {"mOnOff": 1, "level": 0}, {"mOnOff": 0, "mLevel": 1},
                {"on": 1, "level": 1}):
        out = {}
        _decode_dehumidifier(out, m, mod)
        assert f"ggs/ha/{m}/dehumidifier_active/state" not in out
    # Manual-mode level: the live `mLevel` drives the Low/High display (v3.19.349).
    out = {}
    _decode_dehumidifier(out, m, {"mOnOff": 1, "mLevel": 1})
    assert out[f"ggs/ha/{m}/dehumidifier_level/state"] == "High"
    out = {}
    _decode_dehumidifier(out, m, {"mOnOff": 1, "mLevel": 0})
    assert out[f"ggs/ha/{m}/dehumidifier_level/state"] == "Low"


def test_dehumidifier_gear_not_flickered_by_running_level():
    """v3.19.348/349: in Humidity/auto mode the RUNNING live block is {on:1, level:0}
    and that `level` pulses 0↔1 with the compressor — it is NOT the gear. The live
    decoder must NOT publish `dehumidifier_level` from the live `level` (that made the
    tile flicker Low/High). A Humidity live frame carries no `mLevel`, so nothing is
    published — the auto gear comes only from config `level`."""
    from custom_components.sf.proxy.normalizer import _decode_dehumidifier
    m = "0a1b2c3d4e01"
    for mod in ({"on": 1, "level": 0}, {"on": 1, "level": 1}, {"mOnOff": 1, "level": 0}):
        out = {}
        _decode_dehumidifier(out, m, mod)
        assert f"ggs/ha/{m}/dehumidifier_level/state" not in out, mod


def _cfg(data: dict) -> MQTTPacket:
    """A getConfigField frame (config response) for the CB, mirroring _pkt."""
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps(
            {"method": "getConfigField", "uid": "u1", "data": data}
        ).encode(),
    )


async def test_oplog_drives_heater_humidifier(hass: HomeAssistant):
    """v3.19.347: with a FIXED auto gear, heater/humidifier on/off is OP-LOG DRIVEN
    (newest non-alarm entry wins), like the dehumidifier — because the live getDevSta
    `level` is pinned to the gear value even while idle, so it can't tell running from
    off. opType 1 => ON, opType null (bare mode entry) => OFF, opType 2 => OFFLINE
    (off). A live frame's gear-pinned `level` must NOT change the tile's on/off (that
    was the "stuck On with a fixed gear" bug)."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()
    # Fixed gear 4 → op log owns on/off (not the gear-pinned live level).
    bus.publish(f"ggs/ha/{CB_MAC_LC}/humidifier_gear/state", "4")

    # op-log ON
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 27, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "on"

    # A live frame in auto mode with a FIXED gear: `level` reads the gear (4) even
    # though the unit is idle. It must NOT drive on/off — the op log owns it, so
    # the tile stays "on" here (not flipped by the gear-pinned level).
    session = ProxySession(CB_MAC, bus)
    data = dict(CB_DATA)
    data["humidifier"] = {"modeType": 4, "level": 4}   # fixed gear 4, idle
    for _ in range(3):
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "on"

    # op-log OFF (bare mode entry = null) turns it off...
    bus.apply_oplog(CB_MAC, [
        {"id": 2, "epoch": 200, "devType": 27, "opType": None, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "off"

    # ...and the SAME gear-pinned live frame (level 4) must NOT turn it back on.
    for _ in range(3):
        _process_publish(session, _pkt(data), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "off"

    # op-log ON again brings it back.
    bus.apply_oplog(CB_MAC, [
        {"id": 3, "epoch": 300, "devType": 27, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "on"

    # opType 2 = OFFLINE → off (and the offline attribute is set).
    bus.apply_oplog(CB_MAC, [
        {"id": 4, "epoch": 400, "devType": 27, "opType": 2, "modeType": 4}])
    await hass.async_block_till_done()
    h = hass.states.get("switch.sf_dp1_humidifier")
    assert h.state == "off" and h.attributes.get("offline") is True

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_humidifier_automatic_gear_offline_flips_tile(hass: HomeAssistant):
    """#82 (v3.19.370): with an AUTOMATIC gear the humidifier's on/off comes from the
    live `level`, so the op log doesn't own on/off — BUT on an unplug the controller
    sends `"humidifier": null` (the live decoder early-returns, leaving a stale "On")
    together with an op-log opType 2 (OFFLINE). opType 2 must force the tile OFF
    regardless of gear and set the offline attribute, so the card shows "Offline"
    instead of a stale "On". Confirmed from a live humidifier unplug 2026-10-21."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()
    # Automatic gear → the live level owns on/off (op log does NOT, for on/off).
    bus.publish(f"ggs/ha/{CB_MAC_LC}/humidifier_gear/state", "Automatic")
    # A live frame running (level 4) → tile ON from the live decoder.
    session = ProxySession(CB_MAC, bus)
    data = dict(CB_DATA)
    data["humidifier"] = {"modeType": 4, "on": 1, "level": 4}
    for _ in range(2):
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_humidifier").state == "on"

    # Unplug: op-log opType 2 (OFFLINE). Even though the gear is Automatic, OFFLINE
    # forces the tile off AND sets the offline attribute (the #82 fix).
    bus.apply_oplog(CB_MAC, [
        {"id": 9, "epoch": 900, "devType": 27, "opType": 2, "modeType": 4}])
    await hass.async_block_till_done()
    h = hass.states.get("switch.sf_dp1_humidifier")
    assert h.state == "off" and h.attributes.get("offline") is True

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_blower_offline_forces_fan_tile_off(hass: HomeAssistant):
    """v3.19.371: the blower is live-driven for on/off (its reported speed is a true
    running output, so the op log normally only adds the "Offline" marker). BUT on an
    unplug the controller DROPS the blower block from the live getDevSta frame entirely
    — `_decode_blower` early-returns and leaves a stale running state (same failure as
    the humidifier #82 null-block bug). op-log opType 2 (OFFLINE) must force the fan
    tile OFF and set blower_offline. It self-heals: the blower logs a recovery opType-1
    entry when it returns (confirmed from a live unplug 2026-10-21: op2 13:00:17 → op1
    13:02:53), so the newest entry stops being op2 and the live decoder repopulates."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()

    # A live frame with the blower running (manual mode 13, level 100) → tile ON.
    session = ProxySession(CB_MAC, bus)
    data = dict(CB_DATA)
    data["blower"] = {"modeType": 13, "on": 1, "level": 100}
    for _ in range(2):
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()
    st = json.loads(bus.cached(f"ggs/ha/{CB_MAC_LC}/blower/state"))
    assert st["state"] == "ON" and st["percentage"] == 100

    # Unplug: the controller drops the blower block AND logs op-log opType 2 (OFFLINE).
    # opType 2 must force the fan tile OFF (percentage 0) and mark the blower offline.
    bus.apply_oplog(CB_MAC, [
        {"id": 50, "epoch": 500, "devType": 21, "opType": 2, "modeType": 13}])
    await hass.async_block_till_done()
    st = json.loads(bus.cached(f"ggs/ha/{CB_MAC_LC}/blower/state"))
    assert st["state"] == "OFF" and st["percentage"] == 0
    assert bus.cached(f"ggs/ha/{CB_MAC_LC}/blower_speed/state") == "0"
    assert bus.cached(f"ggs/ha/{CB_MAC_LC}/blower_offline/state") == "ON"

    # Recovery: a newer opType-1 entry clears the offline marker and no longer forces
    # off, so the live decoder owns on/off again (confirmed real device behaviour).
    bus.apply_oplog(CB_MAC, [
        {"id": 51, "epoch": 560, "devType": 21, "opType": 1, "modeType": 13}])
    await hass.async_block_till_done()
    assert bus.cached(f"ggs/ha/{CB_MAC_LC}/blower_offline/state") == "OFF"
    # A fresh live frame (block back) repopulates the running state.
    for _ in range(2):
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()
    st = json.loads(bus.cached(f"ggs/ha/{CB_MAC_LC}/blower/state"))
    assert st["state"] == "ON" and st["percentage"] == 100

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_offline_survives_reboot_first_backfill(hass: HomeAssistant):
    """v3.19.371: on an HA restart the in-memory op-log store is empty, so the first
    getDevOpLog backfill re-seeds it. The offline/active publish loop in apply_oplog
    runs on EVERY backfill (it is NOT gated by `_oplog_seeded` — only the sf_oplog
    event-firing is), so if a device is still offline its newest op-log entry is still
    opType 2 (no newer entry is logged while offline) and the Offline state is restored
    on reconnect — the blower fan tile and the humidifier switch both come back OFF +
    offline, not stale ON. This guards the seeded-gating from regressing."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)   # CB re-detected from frames after reboot (registers entities)
    await hass.async_block_till_done()
    assert CB_MAC_LC not in bus._oplog_seeded  # nothing seeded yet (fresh boot)

    # First op-log backfill after reboot: older ON entries for both, then a NEWER
    # OFFLINE (opType 2) for each — exactly what the controller returns if the units
    # are still unplugged. This is the seeding call (seeded was False on entry).
    bus.apply_oplog(CB_MAC, [
        {"id": 40, "epoch": 400, "devType": 21, "opType": 1, "modeType": 13},
        {"id": 41, "epoch": 410, "devType": 27, "opType": 1, "modeType": 4},
        {"id": 50, "epoch": 500, "devType": 21, "opType": 2, "modeType": 13},
        {"id": 51, "epoch": 510, "devType": 27, "opType": 2, "modeType": 4}])
    await hass.async_block_till_done()
    assert CB_MAC_LC in bus._oplog_seeded  # this call did the seeding

    # Blower fan tile restored to OFF + offline (not a stale ON).
    st = json.loads(bus.cached(f"ggs/ha/{CB_MAC_LC}/blower/state"))
    assert st["state"] == "OFF" and st["percentage"] == 0
    assert bus.cached(f"ggs/ha/{CB_MAC_LC}/blower_offline/state") == "ON"
    # Humidifier switch restored to off + offline too.
    h = hass.states.get("switch.sf_dp1_humidifier")
    assert h.state == "off" and h.attributes.get("offline") is True

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_dehumidifier_onoff_from_oplog(hass: HomeAssistant):
    """v3.19.344: the dehumidifier's on/off is driven by its OP LOG, with the
    controller's real semantics (confirmed from a live capture): On = opType 1,
    Off = a bare mode entry (opType null, modeType present), opType 2 = "offline"
    (also off). The NEWEST on/off-relevant entry wins. Config `mOnOff` no longer
    publishes the active state — it sits at 0 in auto mode while the unit cycles,
    so it used to fight the op log and leave the tile stuck "on"."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = _simulate_cb(bus)   # CB detection registers the entities
    await hass.async_block_till_done()

    # op log: turned ON (opType 1) in Humidity mode
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 26, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "on"

    # turned OFF — logged as a bare mode entry (opType null), newer id/epoch
    bus.apply_oplog(CB_MAC, [
        {"id": 2, "epoch": 110, "devType": 26, "opType": None, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "off"

    # a config frame with mOnOff:1 (auto "enabled") must NOT force it back on
    _process_publish(session, _cfg(
        {"dehumidifier": {"modeType": 4, "mOnOff": 1, "mLevel": 0}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "off"

    # opType 2 is "offline" for the dehumidifier -> treated as off
    bus.apply_oplog(CB_MAC, [
        {"id": 3, "epoch": 120, "devType": 26, "opType": 2, "modeType": 4}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "off"

    # a water-tank alarm entry (alarmType set) must be ignored, not read as off/on
    bus.apply_oplog(CB_MAC, [
        {"id": 4, "epoch": 130, "devType": 26, "opType": 1, "modeType": 4},
        {"id": 5, "epoch": 140, "devType": 26, "alarmType": 5}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_dehumidifier").state == "on"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_oplog_offline_attribute(hass: HomeAssistant):
    """v3.19.345: the op log's opType 2 is OFFLINE (the SF app's "Offline"), not
    just "off" — confirmed for all three Environment accessories (26/27/25). The
    newest non-alarm entry per accessory drives an ``offline`` attribute on the
    active switch so the card can show "Offline" vs a plain idle "Off". It clears
    when a newer entry (op 1 / null) arrives, and a water-tank alarm is ignored."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = _simulate_cb(bus)
    await hass.async_block_till_done()

    def _off(eid):
        return hass.states.get(eid).attributes.get("offline")

    # Baseline: not offline.
    assert _off("switch.sf_dp1_dehumidifier") is False
    assert _off("switch.sf_dp1_humidifier") is False
    assert _off("switch.sf_dp1_heater") is False

    # opType 2 → OFFLINE for each accessory devType (26 dehum, 27 humid, 25 heat).
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 26, "opType": 2, "modeType": 4},
        {"id": 2, "epoch": 100, "devType": 27, "opType": 2, "modeType": 4},
        {"id": 3, "epoch": 100, "devType": 25, "opType": 2, "modeType": 3}])
    await hass.async_block_till_done()
    assert _off("switch.sf_dp1_dehumidifier") is True
    assert _off("switch.sf_dp1_humidifier") is True
    assert _off("switch.sf_dp1_heater") is True

    # A newer bare mode entry (opType null = plain off) clears offline.
    bus.apply_oplog(CB_MAC, [
        {"id": 4, "epoch": 200, "devType": 26, "opType": None, "modeType": 4},
        {"id": 5, "epoch": 200, "devType": 27, "opType": None, "modeType": 4},
        {"id": 6, "epoch": 200, "devType": 25, "opType": None, "modeType": 3}])
    await hass.async_block_till_done()
    assert _off("switch.sf_dp1_dehumidifier") is False
    assert _off("switch.sf_dp1_humidifier") is False
    assert _off("switch.sf_dp1_heater") is False

    # Offline again, then a water-tank alarm is the newest entry — it must be
    # ignored for offline (the newest NON-alarm entry, opType 2, still rules).
    bus.apply_oplog(CB_MAC, [
        {"id": 7, "epoch": 300, "devType": 26, "opType": 2, "modeType": 4},
        {"id": 8, "epoch": 310, "devType": 26, "alarmType": 5}])
    await hass.async_block_till_done()
    assert _off("switch.sf_dp1_dehumidifier") is True

    # opType 1 (on) clears offline.
    bus.apply_oplog(CB_MAC, [
        {"id": 9, "epoch": 400, "devType": 26, "opType": 1, "modeType": 4}])
    await hass.async_block_till_done()
    assert _off("switch.sf_dp1_dehumidifier") is False

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_heater_oplog_driven(hass: HomeAssistant):
    """v3.19.347: with a FIXED gear the heater is OP-LOG driven (newest non-alarm
    entry wins). opType 1 => ON, opType null (bare mode entry) => OFF, opType 2 =>
    OFFLINE (off). The newest entry is the state (pushed in every getDevSta via
    oplogLast)."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    _simulate_cb(bus)
    await hass.async_block_till_done()
    # Fixed gear → op log owns the heater's on/off.
    bus.publish(f"ggs/ha/{CB_MAC_LC}/heater_gear/state", "5")

    # op-log ON
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 25, "opType": 1, "modeType": 3}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "on"

    # newer bare mode entry (opType null) = OFF
    bus.apply_oplog(CB_MAC, [
        {"id": 2, "epoch": 200, "devType": 25, "opType": None, "modeType": 3}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"

    # opType 2 = OFFLINE → off (and the offline attribute is set)
    bus.apply_oplog(CB_MAC, [
        {"id": 3, "epoch": 300, "devType": 25, "opType": 2, "modeType": 3}])
    await hass.async_block_till_done()
    h = hass.states.get("switch.sf_dp1_heater")
    assert h.state == "off" and h.attributes.get("offline") is True

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


async def test_climate_active_hybrid_by_gear(hass: HomeAssistant):
    """v3.19.347: on/off source depends on the gear. AUTOMATIC gear → the live
    `level` is the real running output (0 idle) and drives on/off instantly. FIXED
    gear → the live `level` is pinned to the gear, so the op log owns on/off and a
    live level>0 must NOT force the tile on."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = _simulate_cb(bus)
    await hass.async_block_till_done()

    # ── AUTOMATIC gear (default, none cached): live level drives on/off ──
    # a live frame with the heater running at level 3 → on, straight from the frame
    # (no op-log entry needed).
    _process_publish(session, _pkt(
        {**CB_DATA, "heater": {"level": 3, "modeType": 3}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "on"
    # idle level 0 → off, instantly.
    _process_publish(session, _pkt(
        {**CB_DATA, "heater": {"level": 0, "modeType": 3}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"

    # ── FIXED gear: op log owns on/off; a gear-pinned live level must NOT turn on ──
    bus.publish(f"ggs/ha/{CB_MAC_LC}/heater_gear/state", "4")
    bus.apply_oplog(CB_MAC, [
        {"id": 1, "epoch": 100, "devType": 25, "opType": None, "modeType": 3}])
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"
    # live frame with level 4 (the fixed gear, idle) must NOT force it on.
    _process_publish(session, _pkt(
        {**CB_DATA, "heater": {"level": 4, "modeType": 3}}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_heater").state == "off"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
