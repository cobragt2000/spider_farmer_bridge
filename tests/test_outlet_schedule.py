"""Outlet Time Slot: multi-slot decode and the fixed-12-slot setConfigField
write built from the card's period dicts (read-modify-write + CB routing)."""
from custom_components.sf.proxy.normalizer import (
    _decode_outlet_periods, normalize_outlet_config,
)
from custom_components.sf.proxy.command_handler import build_outlet_schedule


def test_decode_outlet_only_enabled_slots():
    tp = [
        {"enabled": 1, "weekmask": 127, "startTime": 28800, "endTime": 72000},
        {"enabled": 1, "weekmask": 42, "startTime": 75600, "endTime": 82800},
        {"weekmask": 127},                      # padding / disabled
        {"enabled": 0, "weekmask": 127},
    ]
    got = _decode_outlet_periods(tp)
    assert got == [
        {"days": [0, 1, 2, 3, 4, 5, 6], "start": "08:00", "end": "20:00"},
        {"days": [1, 3, 5], "start": "21:00", "end": "23:00"},
    ]


def test_normalize_exposes_ts_schedule_attribute():
    block = {"O5": {"modeType": 1, "timePeriod": [
        {"enabled": 1, "weekmask": 85, "startTime": 3600, "endTime": 7200}]}}
    topics = normalize_outlet_config("0A1B2C3D4E01", block)
    key = "ggs/ha/0a1b2c3d4e01/outlet_5_ts_schedule/state"
    assert key in topics
    import json
    assert json.loads(topics[key]) == [
        {"days": [0, 2, 4, 6], "start": "01:00", "end": "02:00"}]


def test_build_outlet_schedule_pads_to_12_and_preserves_settings():
    periods = [
        {"days": [1, 3, 5], "start": "08:00", "end": "20:00"},
        {"days": [0, 2, 4, 6], "start": "21:00", "end": "23:00"},
    ]
    outlet_cfg = {"modeType": 1, "tempAdd": 2, "humiAdd": 1, "mOnOff": 0,
                  "cycleTime": {"weekmask": 127, "startTime": 43200}}
    msg = build_outlet_schedule("m", "u", 3, "ps5", periods, outlet_cfg)
    assert msg["params"]["keyPath"] == ["device", "ps5", "O3"]
    obj = msg["params"]["O3"]
    # RMW preserved the other settings
    assert obj["tempAdd"] == 2 and obj["humiAdd"] == 1
    assert obj["cycleTime"]["startTime"] == 43200
    assert obj["modeType"] == 1                 # Time Slot
    tp = obj["timePeriod"]
    assert len(tp) == 12                         # fixed-length array
    enabled = [p for p in tp if p.get("enabled")]
    assert [p["weekmask"] for p in enabled] == [42, 85]
    assert [(p["startTime"], p["endTime"]) for p in enabled] == [(28800, 72000), (75600, 82800)]
    # padding slots are disabled
    assert all(p.get("enabled", 0) == 0 for p in tp[2:])


def test_build_outlet_schedule_standalone_block_and_empty():
    # standalone outlet uses the "outlet" block
    msg = build_outlet_schedule("m", "u", 1, "outlet", [{"days": [0],
        "start": "01:00", "end": "02:00"}], None)
    assert msg["params"]["keyPath"] == ["device", "outlet", "O1"]
    # empty -> all 12 slots disabled (clears the schedule)
    msg2 = build_outlet_schedule("m", "u", 1, "outlet", [], {})
    tp = msg2["params"]["O1"]["timePeriod"]
    assert len(tp) == 12 and all(p.get("enabled", 0) == 0 for p in tp)
