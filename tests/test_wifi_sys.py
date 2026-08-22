"""getSysSta 'sys' block decode → wifi_rssi / wifi_connected state topics.

These values are cached on the bus (no entity subscribes) and surfaced as
attributes on the alarm_settings sensor for the card header — so no new
diagnostic entities are created. Guard the decode here.
"""
from custom_components.sf.proxy.normalizer import _decode_sys


def test_decode_sys_wifi_rssi_and_connected():
    out: dict = {}
    _decode_sys(out, "b43a4505fb30", {
        "ver": "3.20", "upTime": 12345,
        "wifi": {"isConnect": 1, "rssi": -59},
    })
    assert out["ggs/ha/b43a4505fb30/wifi_rssi/state"] == "-59"
    assert out["ggs/ha/b43a4505fb30/wifi_connected/state"] == "ON"
    assert out["ggs/ha/b43a4505fb30/fw_version/state"] == "3.20"
    assert out["ggs/ha/b43a4505fb30/uptime/state"] == "12345"


def test_decode_sys_offline_and_missing_rssi():
    out: dict = {}
    _decode_sys(out, "mac", {"wifi": {"isConnect": 0}})
    assert out["ggs/ha/mac/wifi_connected/state"] == "OFF"
    assert "ggs/ha/mac/wifi_rssi/state" not in out


def test_decode_sys_empty_noop():
    out: dict = {}
    _decode_sys(out, "mac", {})
    assert out == {}
