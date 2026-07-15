"""Outlet command wire format (v3.10.7).

Regression: PS5/PS10 outlet toggles did nothing. The command handler built
keyPath ["outlet","O{n}"] — missing the "device" root every other command
uses. Authoritative app capture (2026-07-11):
    keyPath = ["device","ps10","O10"]
    params  = {"keyPath":[...], "O10":{...,"modeType":0,"mOnOff":1}}
These assert the REAL injected payload (the old test mocked handle_command
and never exercised translate_command, which is how the bug slipped by).
"""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.proxy.command_handler import translate_command
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import (
    MQTTPacket, MQTT_PUBLISH, parse_packets,
)

PS10_MAC = "10003B49ABCD"
PS10_MAC_LC = "10003b49abcd"

PS10_DATA = {"outlet": {
    "psmode": 2, "hostType": 0,
    **{f"O{n}": {"on": 0} for n in range(1, 11)},
}}


def test_outlet_command_is_device_rooted():
    """keyPath must be ["device","outlet","O{n}"] — the confirmed app shape."""
    cmd = translate_command(
        "outlet_3", "ON", PS10_MAC, "u1", outlet_num=3,
    )
    assert cmd["method"] == "setConfigField"
    assert cmd["params"]["keyPath"] == ["device", "outlet", "O3"]
    assert cmd["params"]["O3"]["mOnOff"] == 1
    assert cmd["params"]["O3"]["modeType"] == 0   # forces manual over schedule

    off = translate_command("outlet_10", "OFF", PS10_MAC, "u1", outlet_num=10)
    assert off["params"]["keyPath"] == ["device", "outlet", "O10"]
    assert off["params"]["O10"]["mOnOff"] == 0


def test_outlet_command_preserves_cached_config():
    """A cached outlet config (schedule/watering) is merged, not wiped —
    only mOnOff/modeType are overwritten."""
    state = {"outlet": {"O2": {
        "on": 1, "cycleTime": {"openDur": 3600, "closeDur": 3600},
        "tempAdd": 1, "humiAdd": 2,
    }}}
    cmd = translate_command(
        "outlet_2", "OFF", PS10_MAC, "u1", outlet_num=2, device_state=state,
    )
    o2 = cmd["params"]["O2"]
    assert o2["mOnOff"] == 0
    assert o2["cycleTime"] == {"openDur": 3600, "closeDur": 3600}   # preserved
    assert o2["tempAdd"] == 1 and o2["humiAdd"] == 2                 # preserved
    assert "on" not in o2   # transient runtime field dropped


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


class _FakeWriter:
    def __init__(self, sink): self._sink = sink
    def write(self, data): self._sink.extend(data)
    async def drain(self): pass


async def test_outlet_toggle_reaches_wire(hass: HomeAssistant):
    """End-to-end: toggling switch.sf_ac10_outlet_10 injects a real
    device-rooted setConfigField."""
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18902, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.allow_control = True

    session = ProxySession(PS10_MAC, bus)
    captured = bytearray()
    session._client_writer = _FakeWriter(captured)
    session.confirm_delay = 0.01
    proxy._sessions[PS10_MAC_LC] = session
    for _ in range(3):
        _process_publish(session, MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{PS10_MAC}",
            message=json.dumps({"method": "getDevSta", "uid": "u1",
                                "data": PS10_DATA}).encode(),
        ), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    assert hass.states.get("switch.sf_ac10_outlet_10") is not None

    captured.clear()
    await hass.services.async_call(
        "switch", "turn_off",
        {"entity_id": "switch.sf_ac10_outlet_10"}, blocking=True,
    )
    pkts, _ = parse_packets(bytes(captured))
    cmds = [json.loads(p.message) for p in pkts if p.message
            and json.loads(p.message).get("method") == "setConfigField"]
    assert cmds, "outlet toggle produced no device payload"
    assert cmds[-1]["params"]["keyPath"] == ["device", "outlet", "O10"]
    assert cmds[-1]["params"]["O10"]["mOnOff"] == 0

    # the toggle scheduled a confirm-poll — let it drain before teardown
    import asyncio
    await asyncio.sleep(0.05)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


CB_MAC = "0A1B2C3D4EA4"
CB_MAC_LC = "0a1b2c3d4ea4"

# CB hosting a PS10 (mirrors the real setup: CB reports ps5/ps10 blocks;
# ps10.O10 on, matching the standalone strip's outlet.O10)
CB_HOST_DATA = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "ps5": {"psmode": 0, **{f"O{n}": {"on": 0} for n in range(1, 6)}},
    "ps10": {"psmode": 0, **{f"O{n}": {"on": 0} for n in range(1, 11)}},
}


def _devsta(mac, data):
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{mac}",
        message=json.dumps({"method": "getDevSta", "uid": "u1",
                            "data": data}).encode(),
    )


async def test_outlet_routes_via_cb_when_hosted(hass: HomeAssistant):
    """When a CB hosting the strip is connected, the outlet command goes to
    the CB's MAC with the ps10 block keyPath (confirmed app format)."""
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18903, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.allow_control = True

    # CB connects and reports ps5/ps10 (becomes the host)
    cb = ProxySession(CB_MAC, bus)
    cb_cap = bytearray()
    cb._client_writer = _FakeWriter(cb_cap)
    cb.confirm_delay = 0.01
    proxy._sessions[CB_MAC_LC] = cb
    for _ in range(3):
        _process_publish(cb, _devsta(CB_MAC, CB_HOST_DATA), bus)

    # PS10 strip connects independently (its outlet entities are what HA shows)
    strip = ProxySession(PS10_MAC, bus)
    strip_cap = bytearray()
    strip._client_writer = _FakeWriter(strip_cap)
    strip.confirm_delay = 0.01
    proxy._sessions[PS10_MAC_LC] = strip
    for _ in range(3):
        _process_publish(strip, _devsta(PS10_MAC, PS10_DATA), bus)
    for s in (cb, strip):
        if s.initial_poll_task:
            s.initial_poll_task.cancel()
    await hass.async_block_till_done()

    # Toggle the strip's outlet in HA → must go out on the CB's connection
    cb_cap.clear()
    strip_cap.clear()
    await hass.services.async_call(
        "switch", "turn_on",
        {"entity_id": "switch.sf_ac10_outlet_5"}, blocking=True,
    )
    import asyncio
    await asyncio.sleep(0.05)

    cb_cmds = [json.loads(p.message) for p in parse_packets(bytes(cb_cap))[0]
               if p.message and json.loads(p.message).get("method") == "setConfigField"]
    strip_cmds = [json.loads(p.message) for p in parse_packets(bytes(strip_cap))[0]
                  if p.message and json.loads(p.message).get("method") == "setConfigField"]
    assert cb_cmds, "command did not route through the CB host"
    assert cb_cmds[-1]["params"]["keyPath"] == ["device", "ps10", "O5"]
    assert cb_cmds[-1]["params"]["O5"]["mOnOff"] == 1
    assert cb_cmds[-1]["pid"] == CB_MAC          # sent to the CB, not the strip
    assert not strip_cmds, "should not also command the strip directly"

    for s in (cb, strip):
        if s.initial_poll_task:
            s.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_routing_helper_direct_when_no_cb():
    """Bare helper: no CB session → route direct (block stays 'outlet')."""
    from custom_components.sf.proxy.mitm_proxy import MITMProxy
    # No sessions at all
    cmd = translate_command("outlet_1", "ON", PS10_MAC, "u1", outlet_num=1,
                            outlet_block="outlet")
    assert cmd["params"]["keyPath"] == ["device", "outlet", "O1"]
