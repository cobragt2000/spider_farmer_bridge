"""Alarm/event log: decode + the alarms sensor + the sf_alarm HA event."""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH
from custom_components.sf.proxy.normalizer import decode_alarm_log

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"


def test_decode_alarm_log():
    """devType/alarmType carry human labels since 3.19.43 (decoded from live
    correlation against the app's Notification screen)."""
    d = {"count": 1, "list": [{"id": 386, "epoch": 1784571720,
                               "devType": 8, "alarmType": 2}]}
    got = decode_alarm_log(d)
    assert got == [{
        "id": 386, "epoch": 1784571720,
        "time": "2026-07-20T18:22:00+00:00",   # 13:22 CDT
        "devType": 8, "device": "Soil WC",
        "alarmType": 2, "alarm": "Below threshold",
    }]
    assert decode_alarm_log({}) == []


def test_decode_alarm_log_restore_and_unknown():
    """No alarmType on the wire == the metric returned to normal; unrecognised
    codes still fall back to their raw form rather than dropping the entry."""
    got = decode_alarm_log({"count": 2, "list": [
        {"id": 1, "epoch": 1784571720, "devType": 1},              # restore
        {"id": 2, "epoch": 1784571800, "devType": 99, "alarmType": 7},
    ]})
    assert got[0]["device"] == "Air Temp"
    assert got[0]["alarmType"] is None
    assert got[0]["alarm"] == "Restoring normal"
    assert got[1]["device"] == "Device 99"
    assert got[1]["alarm"] == "Alarm 7"


def _alarm_pkt(events, count=None):
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": "getAlarmLog", "uid": "u1",
                            "data": {"count": count if count is not None else len(events),
                                     "list": events}}).encode())


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18993, "upstream_host": "h", "upstream_port": 8883,
              "allow_control": True}, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_alarms_sensor_and_event(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    # a couple of getDevSta frames so the CB gets a slot
    dev = {"sensor": {"temp": 24.5, "humi": 61.0}, "light": {"mOnOff": 1, "mLevel": 80}}
    for _ in range(3):
        _process_publish(session, MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": dev}).encode()), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()

    # First alarm-log response — backfill (seeds, no event fired)
    _process_publish(session, _alarm_pkt(
        [{"id": 386, "epoch": 1784571720, "devType": 8, "alarmType": 2}]), bus)
    await hass.async_block_till_done()

    st = hass.states.get("sensor.sf_dp1_alarms")
    assert st is not None
    assert st.state == "2026-07-20T18:22:00+00:00"
    assert st.attributes["count"] == 1
    assert st.attributes["events"][0]["id"] == 386

    # A NEW alarm arrives -> fires sf_alarm
    fired = []
    hass.bus.async_listen("sf_alarm", lambda e: fired.append(e.data))
    _process_publish(session, _alarm_pkt(
        [{"id": 390, "epoch": 1784575320, "devType": 8, "alarmType": 2}]), bus)
    await hass.async_block_till_done()

    assert len(fired) == 1 and fired[0]["id"] == 390
    st = hass.states.get("sensor.sf_dp1_alarms")
    assert st.attributes["count"] == 2                 # merged
    assert st.attributes["events"][0]["id"] == 390     # newest first

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
