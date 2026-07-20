"""SE-light full schedule: weekmask decode, multi-period parse, and the
setConfigFile write built from the card's period dicts."""
from custom_components.sf.proxy.normalizer import (
    _weekmask_to_days, _decode_se_periods,
)
from custom_components.sf.proxy.command_handler import (
    _days_to_weekmask, build_se_schedule,
)

# Decoded from the app logs: Mon/Wed/Fri = 42, Sun/Tue/Thu/Sat = 85.
MON_WED_FRI = 42
SUN_TUE_THU_SAT = 85


def test_weekmask_decode_matches_app():
    assert _weekmask_to_days(MON_WED_FRI) == [1, 3, 5]
    assert _weekmask_to_days(SUN_TUE_THU_SAT) == [0, 2, 4, 6]
    assert _weekmask_to_days(127) == [0, 1, 2, 3, 4, 5, 6]
    assert _weekmask_to_days(1) == [0]        # Sunday only


def test_days_to_weekmask_matches_app():
    assert _days_to_weekmask([1, 3, 5]) == MON_WED_FRI
    assert _days_to_weekmask([0, 2, 4, 6]) == SUN_TUE_THU_SAT
    assert _days_to_weekmask([0, 1, 2, 3, 4, 5, 6]) == 127
    assert _days_to_weekmask([]) == 127        # empty -> all days (not a no-op)
    assert _days_to_weekmask([9, -1, "x"]) == 127  # junk ignored -> all days


def test_decode_multi_period():
    tp = [
        {"enabled": 1, "weekmask": 127, "startTime": 28800, "endTime": 32400,
         "brightness": 50, "fadeTime": 900},
        {"enabled": 1, "weekmask": 42, "startTime": 32400, "endTime": 36000,
         "brightness": 75, "fadeTime": 0},
    ]
    got = _decode_se_periods(tp)
    assert got[0] == {"enabled": 1, "days": list(range(7)), "start": "08:00",
                      "end": "09:00", "brightness": 50, "fade": 15}
    assert got[1]["days"] == [1, 3, 5] and got[1]["fade"] == 0


def test_build_se_schedule_roundtrips_and_preserves_meta():
    periods = [
        {"enabled": 1, "days": [1, 3, 5], "start": "08:00", "end": "09:00",
         "brightness": 50, "fade": 15},
        {"enabled": 1, "days": [0, 2, 4, 6], "start": "09:00", "end": "22:00",
         "brightness": 100, "fade": 0},
    ]
    se_cfg = {"label": "light", "scroff": 0, "modeType": 1,
              "timePeriod": [{"enabled": 1, "weekmask": 127}]}
    msg = build_se_schedule("80F1B2C07CEC", "u1", periods, se_cfg)
    assert msg["method"] == "setConfigFile"
    light = msg["params"]["configFile"]["light"]
    # label/scroff/modeType preserved from the cached config
    assert light["label"] == "light" and light["modeType"] == 1
    tp = light["timePeriod"]
    assert [p["weekmask"] for p in tp] == [42, 85]
    assert [(p["startTime"], p["endTime"]) for p in tp] == [(28800, 32400), (32400, 79200)]
    assert [(p["brightness"], p["fadeTime"]) for p in tp] == [(50, 900), (100, 0)]
    # exact decode round-trip
    assert _decode_se_periods(tp) == periods


def test_build_se_schedule_clamps_and_guards():
    # brightness below the 11% floor is raised; empty list -> no write
    assert build_se_schedule("m", "u", [], {}) is None
    msg = build_se_schedule("m", "u", [{"days": [0], "start": "01:00",
        "end": "02:00", "brightness": 5, "fade": 99}], {})
    p = msg["params"]["configFile"]["light"]["timePeriod"][0]
    assert p["brightness"] == 11          # 11% panel floor
    assert p["fadeTime"] == 30 * 60       # fade clamped to 30 min
