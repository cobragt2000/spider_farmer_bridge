"""Level controls for fan oscillation and climate accessories (v3.6.0).

- number.sf_dp1_heater_level (1-10), number.sf_dp1_humidifier_level (1-4),
  number.sf_dp1_fan_oscillation (0-10), select.sf_dp1_dehumidifier_level
  (Low/High) — SF App ground-truth ranges
- state mirrors the reporting topics; sliders show unknown while idle
- commands are block-preserving writes; setting a level never flips
  mOnOff; values clamp to the controller's real ranges
"""
import asyncio
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import (
    MQTTPacket, MQTT_PUBLISH, parse_packets,
)

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"

CB_DATA = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "fan": {"mOnOff": 1, "mLevel": 7, "shakeLevel": 3, "natural": 0, "modeType": 0},
    "humidifier": {"on": 1, "mLevel": 2, "modeType": 0},
    "dehumidifier": {"on": 1, "mLevel": 1, "modeType": 0},
    "heater": {"mOnOff": 1, "mLevel": 4, "modeType": 0},
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


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Spider Farmer Bridge",
        data={
            "listen_port": 18897,
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


class _FakeWriter:
    def __init__(self, sink: bytearray):
        self._sink = sink

    def write(self, data):
        self._sink.extend(data)

    async def drain(self):
        pass


def _cmds(captured: bytes, block: str) -> list[dict]:
    pkts, _ = parse_packets(bytes(captured))
    return [
        json.loads(p.message) for p in pkts
        if p.message
        and json.loads(p.message).get("method") == "setConfigField"
        and block in (json.loads(p.message).get("params") or {})
    ]


async def _live_session(hass, entry):
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
    return session, captured


async def test_level_entities_and_state(hass: HomeAssistant):
    entry = await _setup(hass)
    session, _ = await _live_session(hass, entry)

    # Sliders mirror the controller's reported levels
    assert hass.states.get("number.sf_dp1_heater_level").state == "4.0"
    assert hass.states.get("number.sf_dp1_humidifier_level").state == "2.0"
    assert hass.states.get("number.sf_dp1_fan_oscillation").state == "3.0"
    # Dehumidifier running at mLevel 1 → High
    assert hass.states.get("select.sf_dp1_dehumidifier_level").state == "High"

    # Identity
    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    assert reg.async_get("number.sf_dp1_heater_level").unique_id == \
        f"ggs_{CB_MAC_LC}_heater_level_set"
    assert reg.async_get("select.sf_dp1_dehumidifier_level").unique_id == \
        f"ggs_{CB_MAC_LC}_dehumidifier_level_set"

    # Ranges straight from the SF App
    heat = hass.states.get("number.sf_dp1_heater_level")
    assert heat.attributes["min"] == 1 and heat.attributes["max"] == 10
    hum = hass.states.get("number.sf_dp1_humidifier_level")
    assert hum.attributes["min"] == 1 and hum.attributes["max"] == 4
    osc = hass.states.get("number.sf_dp1_fan_oscillation")
    assert osc.attributes["min"] == 0 and osc.attributes["max"] == 10
    deh = hass.states.get("select.sf_dp1_dehumidifier_level")
    assert deh.attributes["options"] == ["Low", "High"]

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_idle_reports_show_unknown_not_invalid(hass: HomeAssistant):
    """Humidifier off reports level 0 — below the 1-4 floor → unknown."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    data = dict(CB_DATA)
    data["humidifier"] = {"mLevel": 2, "modeType": 0}   # no "on" → idle
    for _ in range(3):
        _process_publish(session, _pkt(data), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    # normalizer reports level "0" while idle → slider shows unknown
    assert hass.states.get("number.sf_dp1_humidifier_level").state == "unknown"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_level_commands_produce_device_payloads(hass: HomeAssistant):
    entry = await _setup(hass)
    session, captured = await _live_session(hass, entry)

    # Heater level 7 — mLevel changes, mOnOff rides along unchanged (1)
    captured.clear()
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_heater_level", "value": 7}, blocking=True,
    )
    cmds = _cmds(captured, "heater")
    assert cmds and cmds[-1]["params"]["heater"]["mLevel"] == 7
    assert cmds[-1]["params"]["heater"]["mOnOff"] == 1

    # Humidifier level clamps to the SF App's 1-4 manual range
    captured.clear()
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_humidifier_level", "value": 4}, blocking=True,
    )
    cmds = _cmds(captured, "humidifier")
    assert cmds and cmds[-1]["params"]["humidifier"]["mLevel"] == 4

    # Dehumidifier: Low → mLevel 0, High → mLevel 1
    captured.clear()
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_dp1_dehumidifier_level", "option": "Low"},
        blocking=True,
    )
    cmds = _cmds(captured, "dehumidifier")
    assert cmds and cmds[-1]["params"]["dehumidifier"]["mLevel"] == 0
    assert cmds[-1]["params"]["dehumidifier"]["mOnOff"] == 1

    captured.clear()
    await hass.services.async_call(
        "select", "select_option",
        {"entity_id": "select.sf_dp1_dehumidifier_level", "option": "High"},
        blocking=True,
    )
    cmds = _cmds(captured, "dehumidifier")
    assert cmds and cmds[-1]["params"]["dehumidifier"]["mLevel"] == 1

    # Oscillation level 6 — block-preserving fan write: shakeLevel set,
    # speed and mode untouched
    captured.clear()
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_fan_oscillation", "value": 6}, blocking=True,
    )
    cmds = _cmds(captured, "fan")
    assert cmds, "oscillation level produced no device payload"
    fan = cmds[-1]["params"]["fan"]
    assert fan["shakeLevel"] == 6
    assert fan["mLevel"] == 7        # untouched
    assert fan["mOnOff"] == 1        # untouched

    # Oscillation 0 = off (real setting, not clamped up)
    captured.clear()
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_fan_oscillation", "value": 0}, blocking=True,
    )
    cmds = _cmds(captured, "fan")
    assert cmds and cmds[-1]["params"]["fan"]["shakeLevel"] == 0

    await asyncio.sleep(0.1)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_level_entities_evidence_gated(hass: HomeAssistant):
    """No climate/fan blocks → no level controls."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt({
            "sensor": {"temp": 24.5, "humi": 61.0},
            "light": {"mOnOff": 1, "mLevel": 80},
        }), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    assert hass.states.get("number.sf_dp1_heater_level") is None
    assert hass.states.get("number.sf_dp1_humidifier_level") is None
    assert hass.states.get("number.sf_dp1_fan_oscillation") is None
    assert hass.states.get("select.sf_dp1_dehumidifier_level") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_natural_wind_toggle(hass: HomeAssistant):
    """switch.sf_dp1_fan_natural_wind — block-preserving natural write."""
    entry = await _setup(hass)
    session, captured = await _live_session(hass, entry)

    # CB_DATA has natural: 0 → off
    st = hass.states.get("switch.sf_dp1_fan_natural_wind")
    assert st is not None and st.state == "off"

    captured.clear()
    await hass.services.async_call(
        "switch", "turn_on",
        {"entity_id": "switch.sf_dp1_fan_natural_wind"}, blocking=True,
    )
    cmds = _cmds(captured, "fan")
    assert cmds, "natural wind ON produced no device payload"
    fan = cmds[-1]["params"]["fan"]
    assert fan["natural"] == 1
    assert fan["mLevel"] == 7 and fan["mOnOff"] == 1   # untouched
    assert fan["shakeLevel"] == 3                       # untouched

    captured.clear()
    await hass.services.async_call(
        "switch", "turn_off",
        {"entity_id": "switch.sf_dp1_fan_natural_wind"}, blocking=True,
    )
    cmds = _cmds(captured, "fan")
    assert cmds and cmds[-1]["params"]["fan"]["natural"] == 0

    # State follows the controller's next report
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    for _ in range(3):
        _process_publish(session, _pkt({**CB_DATA, "fan": {
            "mOnOff": 1, "mLevel": 7, "shakeLevel": 3,
            "natural": 1, "modeType": 0,
        }}), bus)
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_dp1_fan_natural_wind").state == "on"

    await asyncio.sleep(0.1)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
