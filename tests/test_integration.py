"""Behavioral tests for Spider Farmer Bridge v3 (native entities)."""
import asyncio
import json
from unittest.mock import AsyncMock

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.ha.discovery import (
    publish_discovery_for_device,
    publish_soil_sensor_discovery,
    unpublish_outlet_discovery,
)
from custom_components.sf.proxy.normalizer import normalize_status
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH


def _cb_pkt(data: dict) -> MQTTPacket:
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
    )

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"
PS5_MAC = "0A1B2C3D4E04"
PS5_MAC_LC = "0a1b2c3d4e04"

CB_FRAME = {
    "method": "getDevSta",
    "data": {
        "sensor": {"temp": 24.5, "humi": 61.0, "co2": 850, "vpd": 1.1, "ppfd": 400},
        "light": {"mOnOff": 1, "mLevel": 80},
        "blower": {"mOnOff": 1, "mLevel": 65, "modeType": 1},
        "fan": {"mOnOff": 1, "mLevel": 7, "shakeLevel": 3, "natural": 0, "modeType": 0},
            "sensors": [{"id": "ABC123", "tempSoil": 22.1, "humiSoil": 45.0, "ECSoil": 1.2}],
        "humidifier": {"on": 1, "mLevel": 2, "modeType": 4},
        "dehumidifier": {"mLevel": 1},
        "heater": {"mLevel": 0},
    },
}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Spider Farmer Bridge",
        data={
            "listen_port": 18883,  # avoid privileged/port  conflicts in CI
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


def _simulate_cb(hass, bus):
    """Drive one CB frame through the real proxy pipeline (detection,
    evidence-based outlets, normalization, publishing)."""
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):   # CB typing is tentative (v3.4.0) — needs the window
        _process_publish(session, _cb_pkt(CB_FRAME["data"]), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    return session


async def test_setup_and_cb_entities(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    _simulate_cb(hass, bus)
    await hass.async_block_till_done()

    # ── Exact entity IDs, exact states ────────────────────────────────────
    assert hass.states.get("sensor.sf_dp1_temperature").state == "24.5"
    assert hass.states.get("sensor.sf_dp1_humidity").state == "61.0"
    assert hass.states.get("sensor.sf_dp1_co2").state == "850"
    assert hass.states.get("sensor.sf_dp1_vpd").state == "1.1"
    assert hass.states.get("sensor.sf_dp1_ppfd").state == "400"

    # v3.4.0: CBs have NO outlets — outlets are strip-exclusive
    assert hass.states.get("switch.sf_dp1_outlet_1") is None

    # Light 1: ON at 80% → brightness 204/255
    light = hass.states.get("light.sf_dp1_light_1")
    assert light.state == "on"
    assert light.attributes["brightness"] == round(80 * 255 / 100)

    # Light brightness sensor
    assert hass.states.get("sensor.sf_dp1_light_1_brightness").state == "80"

    # Blower: on at 65%
    blower = hass.states.get("fan.sf_dp1_blower")
    assert blower.state == "on"
    assert blower.attributes["percentage"] == 65
    assert hass.states.get("sensor.sf_dp1_blower_speed").state == "65"
    assert hass.states.get("sensor.sf_dp1_blower_mode").state == "Schedule"

    # Fan: gear 7 → 70%, oscillating (shakeLevel 3)
    fan = hass.states.get("fan.sf_dp1_fan")
    assert fan.state == "on"
    assert fan.attributes["percentage"] == 70
    assert fan.attributes["oscillating"] is True
    # unique_id fan_gear, display name "Fan Speed" -> entity id fan_speed
    assert hass.states.get("sensor.sf_dp1_fan_speed").state == "7"
    assert hass.states.get("sensor.sf_dp1_fan_oscillation").state == "3"
    assert hass.states.get("binary_sensor.sf_dp1_fan_natural_wind").state == "off"
    assert hass.states.get("sensor.sf_dp1_fan_mode").state == "Manual"

    # Climate accessories
    assert hass.states.get("binary_sensor.sf_dp1_humidifier_active").state == "on"
    assert hass.states.get("sensor.sf_dp1_humidifier_level").state == "2"
    assert hass.states.get("sensor.sf_dp1_humidifier_mode").state == "Environment"
    assert hass.states.get("binary_sensor.sf_dp1_dehumidifier_active").state == "off"
    assert hass.states.get("sensor.sf_dp1_dehumidifier_level").state == "Off"
    assert hass.states.get("binary_sensor.sf_dp1_heater_active").state == "off"
    assert hass.states.get("sensor.sf_dp1_heater_level").state == "0"

    # Soil probe (registered dynamically like mitm_proxy does)
    publish_soil_sensor_discovery(bus, CB_MAC, "ABC123", {"mac": CB_MAC, "type": "CB"})
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_soil1_temperature").state == "22.1"
    assert hass.states.get("sensor.sf_dp1_soil1_moisture").state == "45.0"
    assert hass.states.get("sensor.sf_dp1_soil1_ec").state == "1.2"

    # Device registry: single device, correct name
    from homeassistant.helpers import device_registry as dr
    dev = dr.async_get(hass).async_get_device({(DOMAIN, f"ggs_{CB_MAC_LC}")})
    assert dev is not None
    assert dev.name == "SF Display Panel 4E01"
    assert dev.manufacturer == "Spider Farmer"
    assert dev.model == "Display Panel"

    # unique_id continuity: ggs_{mac}_{field}
    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    ent = reg.async_get("sensor.sf_dp1_temperature")
    assert ent.unique_id == f"ggs_{CB_MAC_LC}_temperature"
    ent = reg.async_get("sensor.sf_dp1_fan_speed")
    assert ent.unique_id == f"ggs_{CB_MAC_LC}_fan_gear"
    ent = reg.async_get("sensor.sf_dp1_humidifier_tank")
    assert ent.unique_id == f"ggs_{CB_MAC_LC}_humidifier_water"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_ps5_entities(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(PS5_MAC, bus)
    frame = {"outlet": {f"O{n}": {"mOnOff": 0} for n in range(1, 6)},
             "light": {"mOnOff": 0, "mLevel": 0}}
    for _ in range(3):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{PS5_MAC}",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": frame}).encode(),
        )
        _process_publish(session, pkt, bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    # 5 outlets + light 1 + light 2 + two brightness sensors, no air sensors
    o1 = hass.states.get("switch.sf_ac5_outlet_1")
    assert o1 is not None and o1.state == "off"
    assert o1.attributes.get("device_class") == "outlet"
    assert hass.states.get("switch.sf_ac5_outlet_5") is not None
    assert hass.states.get("switch.sf_ac5_outlet_6") is None
    # light block reported → light_1 exists; no light2 block → no light_2
    assert hass.states.get("light.sf_ac5_light_1") is not None
    assert hass.states.get("light.sf_ac5_light_2") is None
    assert hass.states.get("sensor.sf_ac5_light_2_brightness") is None
    assert hass.states.get("sensor.sf_ac5_temperature") is None
    assert hass.states.get("fan.sf_ac5_blower") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_commands(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.handle_command = AsyncMock()

    _simulate_cb(hass, bus)
    await hass.async_block_till_done()

    # Outlet — strips own outlets now; command topic + payload
    ps_raw, ps = "0A1B2C3D4E03", "0a1b2c3d4e03"
    ps_session = ProxySession(ps_raw, bus)
    for _ in range(3):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{ps_raw}",
            message=json.dumps({
                "method": "getDevSta", "uid": "u1",
                "data": {"outlet": {"O1": {"mOnOff": 1}}},
            }).encode(),
        )
        _process_publish(ps_session, pkt, bus)
    await hass.async_block_till_done()
    await hass.services.async_call(
        "switch", "turn_off",
        {"entity_id": "switch.sf_ac5_outlet_1"}, blocking=True,
    )
    proxy.handle_command.assert_awaited_with(
        f"ggs/ha/{ps}/outlet_1/set", "OFF"
    )
    if ps_session.initial_poll_task:
        ps_session.initial_poll_task.cancel()

    # Light — JSON payload with 0-100 brightness
    await hass.services.async_call(
        "light", "turn_on",
        {"entity_id": "light.sf_dp1_light_1", "brightness": 128},
        blocking=True,
    )
    topic, payload = proxy.handle_command.await_args.args
    assert topic == f"ggs/ha/{CB_MAC_LC}/light_1/set"
    assert json.loads(payload) == {"state": "ON", "brightness": 50}

    # Blower percentage — 25% floor preserved
    await hass.services.async_call(
        "fan", "set_percentage",
        {"entity_id": "fan.sf_dp1_blower", "percentage": 10},
        blocking=True,
    )
    proxy.handle_command.assert_awaited_with(
        f"ggs/ha/{CB_MAC_LC}/blower/percentage/set", "25"
    )

    # Fan percentage — HA % maps to gear 1-10
    await hass.services.async_call(
        "fan", "set_percentage",
        {"entity_id": "fan.sf_dp1_fan", "percentage": 70},
        blocking=True,
    )
    proxy.handle_command.assert_awaited_with(
        f"ggs/ha/{CB_MAC_LC}/fan/percentage/set", "7"
    )

    # Oscillation — routed to the live oscillation_level subfield
    await hass.services.async_call(
        "fan", "oscillate",
        {"entity_id": "fan.sf_dp1_fan", "oscillating": False},
        blocking=True,
    )
    proxy.handle_command.assert_awaited_with(
        f"ggs/ha/{CB_MAC_LC}/fan/oscillation_level/set", "0"
    )
    await hass.services.async_call(
        "fan", "oscillate",
        {"entity_id": "fan.sf_dp1_fan", "oscillating": True},
        blocking=True,
    )
    # restores last observed shakeLevel (3 from the CB frame)
    proxy.handle_command.assert_awaited_with(
        f"ggs/ha/{CB_MAC_LC}/fan/oscillation_level/set", "3"
    )

    # Control lock: disabled → HomeAssistantError, no proxy call
    proxy.allow_control = False
    proxy.handle_command.reset_mock()
    from homeassistant.exceptions import HomeAssistantError
    with pytest.raises(HomeAssistantError):
        await hass.services.async_call(
            "switch", "turn_on",
            {"entity_id": "switch.sf_ac5_outlet_1"}, blocking=True,
        )
    proxy.handle_command.assert_not_awaited()

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_outlet_pruning_and_availability(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    ps_mac_raw, ps_mac = "0A1B2C3D4E05", "0a1b2c3d4e05"
    session = ProxySession(ps_mac_raw, bus)
    frame = {"outlet": {"O1": {"mOnOff": 1}, "O6": {"mOnOff": 0}}}
    for _ in range(3):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{ps_mac_raw}",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": frame}).encode(),
        )
        _process_publish(session, pkt, bus)
    await hass.async_block_till_done()

    # >5 outlets → conclusive PS10; only reported outlets exist after prune
    assert session.device_type == "ps10"
    assert hass.states.get("switch.sf_ac10_outlet_1") is not None
    assert hass.states.get("switch.sf_ac10_outlet_6") is not None
    assert hass.states.get("switch.sf_ac10_outlet_3") is None
    assert hass.states.get("switch.sf_ac10_outlet_10") is None

    # Discovery republish must NOT resurrect pruned outlets
    publish_discovery_for_device(bus, ps_mac, {"mac": ps_mac_raw, "type": "PS10"})
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_ac10_outlet_3") is None

    # Availability: global offline marks everything unavailable, online restores
    bus.publish("ggs/ha/status", "offline")
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_ac10_outlet_1").state == "unavailable"
    bus.publish("ggs/ha/status", "online")
    await hass.async_block_till_done()
    assert hass.states.get("switch.sf_ac10_outlet_1").state == "on"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_lc_entities(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    lc_cfg = {"mac": "0A1B2C3E4E06", "type": "LC"}
    publish_discovery_for_device(bus, "0a1b2c3e4e06", lc_cfg)
    bus.blocks_seen("0A1B2C3E4E06", {"light", "light2"}, lc_cfg)
    await hass.async_block_till_done()

    # Lights only — no outlets, no fans, no air sensors
    assert hass.states.get("light.sf_lc1_light_1") is not None
    assert hass.states.get("light.sf_lc1_light_2") is not None
    assert hass.states.get("sensor.sf_lc1_light_1_brightness") is not None
    assert hass.states.get("switch.sf_lc1_outlet_1") is None
    assert hass.states.get("fan.sf_lc1_fan") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_restore_after_restart(hass: HomeAssistant):
    """RestoreEntity replaces MQTT retained topics across HA restarts."""
    from pytest_homeassistant_custom_component.common import mock_restore_cache
    from homeassistant.core import State

    mock_restore_cache(
        hass,
        [
            State("sensor.sf_dp1_temperature", "23.9", {"sf_device": CB_MAC_LC}),
            State(
                "light.sf_dp1_light_1", "on",
                {"brightness": 204, "sf_device": CB_MAC_LC},
            ),
            State(
                "fan.sf_dp1_fan", "on",
                {"percentage": 70, "oscillating": True, "sf_device": CB_MAC_LC},
            ),
        ],
    )

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    # Device reconnects (discovery fires) but hasn't reported data yet;
    # outlet evidence arrives with the first frame (simulated directly)
    cb_cfg = {"mac": CB_MAC, "type": "CB"}
    publish_discovery_for_device(bus, CB_MAC_LC, cb_cfg)
    bus.blocks_seen(CB_MAC, {"sensor:temp", "light", "fan"}, cb_cfg)
    await hass.async_block_till_done()

    assert hass.states.get("sensor.sf_dp1_temperature").state == "23.9"
    light = hass.states.get("light.sf_dp1_light_1")
    assert light.state == "on" and light.attributes["brightness"] == 204
    fan = hass.states.get("fan.sf_dp1_fan")
    assert fan.state == "on" and fan.attributes["percentage"] == 70

    # Fresh device data overrides restored state
    for topic, value in normalize_status(CB_MAC_LC, CB_FRAME, mac=CB_MAC).items():
        bus.publish(topic, value, retain=True, qos=0)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sf_dp1_temperature").state == "24.5"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
