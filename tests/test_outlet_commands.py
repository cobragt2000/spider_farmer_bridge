"""Outlet command wire format.

Two shapes, confirmed from SF-app captures:
  * STANDALONE strip  -> keyPath ["outlet","O{n}"]              (top-level)
  * CB-HOSTED strip   -> keyPath ["device","ps5"/"ps10","O{n}"] (device tree)
Only the standalone (top-level) write actually flips the live outlet on a
strip with no host panel — writing it under ["device",...] saved the config
but the outlet never switched (app capture 2026-07-31, v3.19.93).
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

PS10_MAC = "0A1B2C3D4E30"
PS10_MAC_LC = "0a1b2c3d4e30"

PS10_DATA = {"outlet": {
    "psmode": 2, "hostType": 0,
    **{f"O{n}": {"on": 0} for n in range(1, 11)},
}}


def test_standalone_outlet_is_top_level():
    """A standalone strip (default block "outlet") writes the TOP-LEVEL
    ["outlet","O{n}"] keyPath — the only shape the firmware acts on."""
    cmd = translate_command(
        "outlet_3", "ON", PS10_MAC, "u1", outlet_num=3,
    )
    assert cmd["method"] == "setConfigField"
    assert cmd["params"]["keyPath"] == ["outlet", "O3"]
    assert cmd["params"]["O3"]["mOnOff"] == 1
    assert cmd["params"]["O3"]["modeType"] == 0

    off = translate_command("outlet_10", "OFF", PS10_MAC, "u1", outlet_num=10)
    assert off["params"]["keyPath"] == ["outlet", "O10"]
    assert off["params"]["O10"]["mOnOff"] == 0


def test_outlet_mode_switch_sends_full_config_block():
    """Switching an outlet to Cycle from a minimal cache (a Manual outlet reports
    just {modeType,mOnOff}) must still send a complete block with a valid cycleTime
    + 12-slot timePeriod — the firmware rejects a bare {modeType:2,mOnOff:0} and
    reverts to Manual. (v3.19.131)"""
    cmd = translate_command(
        "outlet_4", "Cycle", PS10_MAC, "u1", outlet_num=4,
        outlet_block="outlet", outlet_subfield="mode",
        outlet_cfg={"modeType": 0, "mOnOff": 1},   # minimal Manual cache
    )
    blk = cmd["params"]["O4"]
    assert cmd["params"]["keyPath"] == ["outlet", "O4"]
    assert blk["modeType"] == 2                     # Cycle
    assert isinstance(blk.get("cycleTime"), dict)
    assert blk["cycleTime"].get("openDur")          # a real (non-zero) duration
    assert isinstance(blk.get("timePeriod"), list) and len(blk["timePeriod"]) == 12


def test_build_outlet_config_atomic_mode_plus_settings():
    """set_outlet_config commits an outlet's mode + its config in ONE block, so
    picking a mode and configuring it lands together (v3.19.132)."""
    from custom_components.sf.proxy.command_handler import build_outlet_config
    cmd = build_outlet_config(
        PS10_MAC, "u1", 4, "outlet", "Cycle",
        {"cycle_run": 5, "cycle_off": 7, "cycle_times": 3},
        {"modeType": 0, "mOnOff": 1},        # minimal Manual cache
    )
    blk = cmd["params"]["O4"]
    assert cmd["params"]["keyPath"] == ["outlet", "O4"]
    assert blk["modeType"] == 2                       # Cycle
    assert blk["cycleTime"]["openDur"] == 300         # run 5 min
    assert blk["cycleTime"]["closeDur"] == 420        # off 7 min
    assert blk["cycleTime"]["times"] == 3
    assert len(blk["timePeriod"]) == 12

    # A device-dropdown mode (Temperature) carries its selection too.
    t = build_outlet_config(PS10_MAC, "u1", 2, "outlet", "Temperature",
                            {"temp_device": "Cooling"}, {})
    assert t["params"]["O2"]["modeType"] == 3
    assert t["params"]["O2"]["tempAdd"] == 2


def test_build_outlet_config_cb_hosted_routes_via_device_tree():
    """When an AC5/AC10 is driven through a Display Panel (CB-hosted), the outlet
    write must use ["device", ps5/ps10, "O{n}"] — NOT the standalone ["outlet"]
    keyPath. The mode + config still lands atomically. (block == "ps10" here.)"""
    from custom_components.sf.proxy.command_handler import build_outlet_config
    cmd = build_outlet_config(
        PS10_MAC, "u1", 4, "ps10", "Cycle",
        {"cycle_run": 5, "cycle_times": 2}, {"modeType": 0, "mOnOff": 1},
    )
    assert cmd["params"]["keyPath"] == ["device", "ps10", "O4"]
    blk = cmd["params"]["O4"]
    assert blk["modeType"] == 2
    assert blk["cycleTime"]["openDur"] == 300 and blk["cycleTime"]["times"] == 2


def test_indicator_light_command():
    """The strip status LED writes top-level ["outlet","led"], inverted vs on/off
    to match the SF app: LED lit (HA "on") = led 0, off = led 1. (3.19.173)"""
    on = translate_command("indicator_light", "ON", PS10_MAC, "u1")
    assert on["method"] == "setConfigField"
    assert on["params"]["keyPath"] == ["outlet", "led"]
    assert on["params"]["led"] == 0
    off = translate_command("indicator_light", "OFF", PS10_MAC, "u1")
    assert off["params"]["led"] == 1


def test_cb_hosted_outlet_is_device_rooted():
    """A CB-hosted strip addresses its outlets under the panel's device tree."""
    cmd = translate_command(
        "outlet_10", "ON", PS10_MAC, "u1", outlet_num=10, outlet_block="ps10",
    )
    assert cmd["params"]["keyPath"] == ["device", "ps10", "O10"]
    assert cmd["params"]["O10"]["mOnOff"] == 1


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
    setConfigField. v3.19.93: a STANDALONE strip writes the TOP-LEVEL
    ["outlet","O10"] keyPath (what the SF app sends and the firmware acts on)."""
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
    assert cmds[-1]["params"]["keyPath"] == ["outlet", "O10"]
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


async def test_indicator_led_confirm_updates_state(hass: HomeAssistant):
    """The LED confirm poll is a *targeted* getConfigField ["outlet","led"], so
    the device answers with a bare {"led": N} (no "outlet" wrapper). That must
    still drive the Indicator Light switch — otherwise it stays stale after a
    toggle even though the device applied it (v3.19.112)."""
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

    session = ProxySession(PS10_MAC, bus)
    session._client_writer = _FakeWriter(bytearray())
    proxy._sessions[PS10_MAC_LC] = session
    for _ in range(3):
        _process_publish(session, MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{PS10_MAC}",
            message=json.dumps({"method": "getDevSta", "uid": "u1",
                                "data": PS10_DATA}).encode()), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()
    assert session.device_type == "ps10"

    topic = f"ggs/ha/{PS10_MAC_LC}/indicator_light/state"

    def _led_confirm(v):
        return MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{PS10_MAC}",
            message=json.dumps({"method": "getConfigField", "uid": "u1",
                                "data": {"led": v}}).encode())

    # A bare {"led": N} confirm response must publish the Indicator Light state.
    # led is inverted vs on/off to match the SF app: led 1 = off, led 0 = on.
    _process_publish(session, _led_confirm(1), bus)
    await hass.async_block_till_done()
    assert bus.cached(topic) == "OFF"

    _process_publish(session, _led_confirm(0), bus)
    await hass.async_block_till_done()
    assert bus.cached(topic) == "ON"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


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
    """No CB host → standalone route: top-level ["outlet","O1"] keyPath."""
    cmd = translate_command("outlet_1", "ON", PS10_MAC, "u1", outlet_num=1,
                            outlet_block="outlet")
    assert cmd["params"]["keyPath"] == ["outlet", "O1"]
