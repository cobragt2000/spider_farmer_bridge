"""Leaf VPD sensor + Leaf Offset number (v3.19.101).

Leaf VPD is derived in HA from the panel's air temperature, humidity, and a
local leaf-temperature offset. It is not a device reading, so these tests drive
a getDevSta frame to create the air sensors, then check the computed sensor and
the offset control.
"""
import json
import math

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

CB_MAC = "0A1B2C3D4E01"
FULL_CB = {"sensor": {"temp": 24.53, "humi": 60.9, "co2": 850, "vpd": 1.13, "ppfd": 400}}


@pytest.fixture(autouse=True)
def _enable(enable_custom_integrations):
    yield


@pytest.fixture(autouse=True)
def _sockets(socket_enabled):
    yield


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18992, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
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


def _svp(tc: float) -> float:
    return 0.6108 * math.exp(17.27 * tc / (tc + 237.3))


def _to_c(v: float, unit: str) -> float:
    return (v - 32) / 1.8 if ("F" in unit or "℉" in unit) else v


def _delta_c(v: float, unit: str) -> float:
    return v / 1.8 if ("F" in unit or "℉" in unit) else v


async def test_leaf_vpd_computed_and_offset_control(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FULL_CB), bus)
    await hass.async_block_till_done()

    # Both new entities exist (entity ids pinned across the display-name change).
    leaf = hass.states.get("sensor.sf_dp1_leaf_vpd")
    off = hass.states.get("number.sf_dp1_leaf_offset")
    assert leaf is not None and leaf.state not in ("unknown", "unavailable")
    assert off is not None and float(off.state) == -2.0

    # Display names sort together: "VPD Air" / "VPD Leaf".
    air_e = hass.states.get("sensor.sf_dp1_vpd")
    assert "VPD Air" in air_e.attributes["friendly_name"]
    assert "VPD Leaf" in leaf.attributes["friendly_name"]

    # Leaf VPD target bounds exist with their defaults.
    mn = hass.states.get("number.sf_dp1_leaf_vpd_min")
    mx = hass.states.get("number.sf_dp1_leaf_vpd_max")
    assert mn is not None and float(mn.state) == 0.8
    assert mx is not None and float(mx.state) == 1.2

    # Recompute the expectation from the temp entity's *displayed* value/unit,
    # so the test is correct under either an °C or °F HA unit system.
    t = hass.states.get("sensor.sf_dp1_temperature")
    unit = t.attributes.get("unit_of_measurement") or "°C"
    air_c = _to_c(float(t.state), unit)
    rh = 60.9
    expect = _svp(air_c + _delta_c(-2.0, unit)) - (rh / 100.0) * _svp(air_c)
    assert abs(float(leaf.state) - round(max(0.0, expect), 2)) < 0.02

    # Leaf is cooler than air, so leaf VPD sits below the device's air VPD.
    air_vpd = hass.states.get("sensor.sf_dp1_vpd")
    assert float(leaf.state) < float(air_vpd.state)

    # Setting the offset to 0 makes leaf temp == air temp, so leaf VPD collapses
    # to the standard air VPD and the sensor recomputes live.
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_leaf_offset", "value": 0}, blocking=True,
    )
    await hass.async_block_till_done()
    leaf0 = float(hass.states.get("sensor.sf_dp1_leaf_vpd").state)
    assert abs(leaf0 - round(_svp(air_c) * (1 - rh / 100.0), 2)) < 0.02

    if session.initial_poll_task and not session.initial_poll_task.done():
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_leaf_vpd_day_night_offset(hass: HomeAssistant):
    """The leaf-VPD sensor uses the Day offset during the day cycle and the
    Night offset at night, switching the instant the schedule flag flips."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FULL_CB), bus)
    await hass.async_block_till_done()

    # The night offset entity exists alongside the day one, default 0.0.
    offn = hass.states.get("number.sf_dp1_leaf_offset_night")
    assert offn is not None and float(offn.state) == 0.0

    # Give day and night clearly different offsets.
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_leaf_offset", "value": -2.0}, blocking=True)
    await hass.services.async_call(
        "number", "set_value",
        {"entity_id": "number.sf_dp1_leaf_offset_night", "value": -6.0},
        blocking=True)
    await hass.async_block_till_done()

    t = hass.states.get("sensor.sf_dp1_temperature")
    unit = t.attributes.get("unit_of_measurement") or "°C"
    air_c = _to_c(float(t.state), unit)
    rh = 60.9

    # Day cycle → day offset (−2.0).
    hass.states.async_set("binary_sensor.sf_dp1_daytime_schedule", "on")
    await hass.async_block_till_done()
    leaf_day = float(hass.states.get("sensor.sf_dp1_leaf_vpd").state)
    exp_day = _svp(air_c + _delta_c(-2.0, unit)) - (rh / 100.0) * _svp(air_c)
    assert abs(leaf_day - round(max(0.0, exp_day), 2)) < 0.02

    # Night cycle → night offset (−6.0): cooler leaf → lower leaf VPD.
    hass.states.async_set("binary_sensor.sf_dp1_daytime_schedule", "off")
    await hass.async_block_till_done()
    leaf_night = float(hass.states.get("sensor.sf_dp1_leaf_vpd").state)
    exp_night = _svp(air_c + _delta_c(-6.0, unit)) - (rh / 100.0) * _svp(air_c)
    assert abs(leaf_night - round(max(0.0, exp_night), 2)) < 0.02
    assert leaf_night < leaf_day

    if session.initial_poll_task and not session.initial_poll_task.done():
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
