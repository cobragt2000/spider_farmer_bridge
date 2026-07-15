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
