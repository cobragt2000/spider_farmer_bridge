"""Standalone SE-series light detection (v3.10.0).

Ground truth: a user's SE4500 diagnostic capture, 2026-07-11. The device
(pcode 1005, hwver S-TG-A-PCB-V3.2) reports a FLAT getDevSta schema —
top-level mode/brightness/pwm/lightModel, no CB-style blocks — so the
evidence classifier never typed it and no entities were created.

Read-only support: detection is immediate and conclusive on the
lightModel marker; entities are Brightness / Mode / Active. Control is
deferred until the app-side write format is captured.
"""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

SE_MAC = "0A1B2C3D4E06"
SE_MAC_LC = "0a1b2c3d4e06"

# Verbatim from the diagnostic log (brightness varied for the live test)
SE_DATA_OFF = {
    "mode": 2, "brightness": 0, "isScreenOn": 0, "isIoTx": 0, "isIoRx": 1,
    "adcLedDim": 0, "adcUpDim": 0, "adcDownDim": 0, "pwm": 0, "isUp": 1,
    "isForceSlaveMode": 1, "AutoModeCheck": -1,
    "lastOnBrightness": 0, "lastManualBrightness": 0, "lightModel": 3,
}
SE_DATA_ON = {**SE_DATA_OFF, "brightness": 55, "pwm": 55, "mode": 1}


def _pkt(data: dict) -> MQTTPacket:
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{SE_MAC}",
        message=json.dumps({
            "method": "getDevSta", "pid": SE_MAC, "pcode": 1005,
            "uid": "u1", "code": 200, "msg": "ok", "data": data,
        }).encode(),
    )


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Spider Farmer Bridge",
        data={
            "listen_port": 18901,
            "upstream_host": "sf.mqtt.spider-farmer.com",
            "upstream_port": 8883,
            "allow_control": True,
        },
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_se_light_detected_and_entities(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    # ONE frame must be enough — the lightModel marker is conclusive
    session = ProxySession(SE_MAC, bus)
    _process_publish(session, _pkt(SE_DATA_OFF), bus)
    await hass.async_block_till_done()

    assert session.device_type == "se"
    assert session.type_conclusive

    # Entities under the se1 slot, light currently off
    br = hass.states.get("sensor.sf_se1_brightness")
    assert br is not None and br.state == "0"
    assert hass.states.get("binary_sensor.sf_se1_active").state == "off"
    assert hass.states.get("sensor.sf_se1_mode").state == "Automatic (Standby)"

    # Device registered with the SE label
    from homeassistant.helpers import device_registry as dr
    dev = dr.async_get(hass).async_get_device({(DOMAIN, f"ggs_{SE_MAC_LC}")})
    assert dev is not None
    assert dev.name == "SF SE Light 4E06"
    assert dev.model == "SE Light"

    # No CB-style entities leaked from the flat schema
    assert hass.states.get("light.sf_se1_light_1") is None
    assert hass.states.get("sensor.sf_se1_temperature") is None

    # Light turned on at 55% → sensors follow
    _process_publish(session, _pkt(SE_DATA_ON), bus)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_se1_brightness").state == "55"
    assert hass.states.get("binary_sensor.sf_se1_active").state == "on"
    assert hass.states.get("sensor.sf_se1_mode").state == "Automatic"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_se_light_survives_restart(hass: HomeAssistant):
    """Keep-offline restore also covers the SE type (model_to_type map)."""
    from homeassistant.helpers import entity_registry as er

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(SE_MAC, bus)
    _process_publish(session, _pkt(SE_DATA_OFF), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Restored as live objects before the light reports again
    assert hass.states.get("sensor.sf_se1_brightness") is not None
    assert hass.states.get("binary_sensor.sf_se1_active") is not None
    reg = er.async_get(hass)
    assert reg.async_get("sensor.sf_se1_brightness").unique_id == \
        f"ggs_{SE_MAC_LC}_se_brightness"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


SE_CONFIGFILE = {
    "label": "light", "scroff": 0, "modeType": 1,
    "timePeriod": [{"enabled": 1, "weekmask": 127, "startTime": 28800,
                    "endTime": 72000, "brightness": 50, "fadeTime": 1800}],
}


def _cfg_pkt() -> MQTTPacket:
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{SE_MAC}",
        message=json.dumps({
            "method": "getConfigFile", "pid": SE_MAC, "pcode": 1005,
            "uid": "u1", "code": 200, "msg": "ok",
            "data": {"configFile": {"light": dict(SE_CONFIGFILE)}},
        }).encode(),
    )


class _FakeWriter:
    def __init__(self, sink: bytearray):
        self._sink = sink

    def write(self, data):
        self._sink.extend(data)

    async def drain(self):
        pass


def _injected(captured: bytes) -> list[dict]:
    from custom_components.sf.proxy.mqtt_parser import parse_packets
    pkts, _ = parse_packets(bytes(captured))
    return [json.loads(p.message) for p in pkts if p.message]


async def test_se_light_control(hass: HomeAssistant):
    """Captured app command formats: setOnOff / setLight / setMode /
    setConfigFile — driven from the HA entities through the REAL handler."""
    import asyncio
    from custom_components.sf.const import DATA_PROXY

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.allow_control = True

    session = ProxySession(SE_MAC, bus)
    captured = bytearray()
    session._client_writer = _FakeWriter(captured)
    session.confirm_delay = 0.01
    proxy._sessions[SE_MAC_LC] = session
    _process_publish(session, _pkt(SE_DATA_ON), bus)
    _process_publish(session, _cfg_pkt(), bus)   # seeds se_config cache
    await hass.async_block_till_done()

    # Schedule entities reflect the config file
    assert hass.states.get("text.sf_se1_schedule_start").state == "08:00"
    assert hass.states.get("text.sf_se1_schedule_stop").state == "20:00"
    assert hass.states.get("number.sf_se1_schedule_brightness").state == "50.0"
    assert hass.states.get("number.sf_se1_sunrise_sunset_fade").state == "30.0"
    # Light + mode entities live
    light = hass.states.get("light.sf_se1_light")
    assert light is not None and light.state == "on"
    assert hass.states.get("select.sf_se1_mode").state == "Automatic"

    # Light ON at 55% → setOnOff then setLight (brightness 140/255 ≈ 55%)
    captured.clear()
    await hass.services.async_call(
        "light", "turn_on",
        {"entity_id": "light.sf_se1_light", "brightness_pct": 55},
        blocking=True,
    )
    cmds = _injected(captured)
    assert any(c.get("method") == "setOnOff" and c["params"]["on"] == 1 for c in cmds)
    setlights = [c for c in cmds if c.get("method") == "setLight"]
    assert setlights and setlights[-1]["params"]["brightness"] == 55

    # Light OFF → setOnOff on:0
    captured.clear()
    await hass.services.async_call(
        "light", "turn_off", {"entity_id": "light.sf_se1_light"}, blocking=True,
    )
    cmds = _injected(captured)
    assert any(c.get("method") == "setOnOff" and c["params"]["on"] == 0 for c in cmds)

    # Mode: Manual → setMode 0, Automatic → setMode 1
    captured.clear()
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_se1_mode", "option": "Manual"}, blocking=True,
    )
    cmds = _injected(captured)
    assert any(c.get("method") == "setMode" and c["params"]["mode"] == 0 for c in cmds)

    captured.clear()
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_se1_mode", "option": "Automatic"}, blocking=True,
    )
    cmds = _injected(captured)
    assert any(c.get("method") == "setMode" and c["params"]["mode"] == 1 for c in cmds)

    # Sunrise 15 min → setConfigFile, block preserved from the cache
    captured.clear()
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_se1_sunrise_sunset_fade", "value": 15},
        blocking=True,
    )
    cmds = [c for c in _injected(captured) if c.get("method") == "setConfigFile"]
    assert cmds, "sunrise write produced no setConfigFile"
    tp0 = cmds[-1]["params"]["configFile"]["light"]["timePeriod"][0]
    assert tp0["fadeTime"] == 900
    assert tp0["startTime"] == 28800      # preserved
    assert tp0["endTime"] == 72000        # preserved
    assert tp0["brightness"] == 50        # preserved

    # Schedule start 06:30 → startTime 23400
    captured.clear()
    await hass.services.async_call(
        "text", "set_value",
        {"entity_id": "text.sf_se1_schedule_start", "value": "06:30"},
        blocking=True,
    )
    cmds = [c for c in _injected(captured) if c.get("method") == "setConfigFile"]
    assert cmds and cmds[-1]["params"]["configFile"]["light"]["timePeriod"][0]["startTime"] == 23400

    await asyncio.sleep(0.1)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_light_11pct_hardware_floor():
    """All SF panels bottom out at 11% — commands below it are raised,
    for SE standalone and CB-connected lights alike."""
    from custom_components.sf.proxy.command_handler import translate_command

    # SE direct brightness: 5 → 11
    cmd = translate_command("se_light", "5", "0A1B2C3D4E06", "u1",
                            subfield="brightness")
    assert cmd["params"]["brightness"] == 11

    # SE schedule brightness: 5 → 11
    cmd = translate_command("se_light", "5", "0A1B2C3D4E06", "u1",
                            subfield="schedule_brightness")
    assert cmd["params"]["configFile"]["light"]["timePeriod"][0]["brightness"] == 11

    # CB light block: ON at 5% → mLevel 11 (OFF keeps level untouched)
    cmd = translate_command(
        "light", '{"state": "ON", "brightness": 5}', "0A1B2C3D4E01", "u1",
        device_state={"light": {"on": 1, "mLevel": 50}},
    )
    assert cmd["params"]["light"]["mLevel"] == 11

    # CB light schedule_brightness subfield: 5 → 11
    cmd = translate_command(
        "light", "5", "0A1B2C3D4E01", "u1", subfield="schedule_brightness",
        device_state={"light": {"on": 1, "mLevel": 50}},
    )
    assert cmd["params"]["light"]["timePeriod"][0]["brightness"] == 11

    # 100 stays 100; valid mid-range passes through
    cmd = translate_command("se_light", "100", "0A1B2C3D4E06", "u1",
                            subfield="brightness")
    assert cmd["params"]["brightness"] == 100
    cmd = translate_command("se_light", "55", "0A1B2C3D4E06", "u1",
                            subfield="brightness")
    assert cmd["params"]["brightness"] == 55
