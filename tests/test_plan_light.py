"""Plan-stage light write helper (_apply_plan_light).

v3.19.315: 20 µmol is the PPFD target floor — 0 isn't a valid target (a light is
turned off with its on/off toggle, not a 0 target). A PPFD-mode plan light must
never be written with a target below the floor, or the stage runs "on" but dark
(and the overview then disagreed with the editor, which shows the 20 floor)."""

import json

from custom_components.sf.proxy.command_handler import (
    _apply_plan_light, _floor_ppfd_light, _cmd_light_into_plan, translate_command)
from custom_components.sf.proxy.normalizer import _decode_light


# ── v3.19.317: device light block must not clobber the plan's schedule ─────────

# A live frame carries only {level}; the schedule falls back to the cached device
# block, which holds a stale standalone ppfdPeriod. While a plan runs those config
# fields must be suppressed so the plan's schedule (via _publish_plan_light) wins.
_STALE_CACHE = {"modeType": 1, "ppfdPeriod": [{"startTime": 19800}]}  # 05:30


def test_decode_light_suppresses_schedule_during_plan():
    out = {}
    _decode_light(out, "MAC", 1, {"level": 50, "mOnOff": 1},
                  cache=_STALE_CACHE, plan_active=True)
    # Live state + brightness still publish; the stale schedule does NOT.
    assert "ggs/ha/MAC/light_1/state" in out
    assert "ggs/ha/MAC/light_1_brightness/state" in out
    assert "ggs/ha/MAC/light_1_ppfd_start/state" not in out
    assert "ggs/ha/MAC/light_1_ppfd_stop/state" not in out
    assert "ggs/ha/MAC/light_1_schedule_start/state" not in out


def test_decode_light_publishes_schedule_without_plan():
    out = {}
    _decode_light(out, "MAC", 1, {"level": 50, "mOnOff": 1},
                  cache=_STALE_CACHE, plan_active=False)
    # No plan -> the standalone schedule is decoded as before (05:30).
    assert out.get("ggs/ha/MAC/light_1_ppfd_start/state") == "05:30"


def test_ppfd_target_floored_to_20_when_zero():
    out = _apply_plan_light({}, {"mode": "PPFD", "ppfd_target": 0})
    assert out["ppfdPeriod"][0]["brightness"] == 20
    assert out["ppfdPeriod"][0]["enabled"] == 1
    assert out["modeType"] == 12


def test_ppfd_target_floored_when_missing():
    # No ppfd_target in the edit and no base value -> still floored, not left 0.
    out = _apply_plan_light({}, {"mode": "PPFD"})
    assert out["ppfdPeriod"][0]["brightness"] == 20


def test_ppfd_target_real_value_preserved():
    out = _apply_plan_light({}, {"mode": "PPFD", "ppfd_target": 300})
    assert out["ppfdPeriod"][0]["brightness"] == 300


def test_ppfd_below_floor_clamped():
    out = _apply_plan_light({}, {"mode": "PPFD", "ppfd_target": 5})
    assert out["ppfdPeriod"][0]["brightness"] == 20


def test_time_slot_not_affected_by_ppfd_floor():
    # A Time Slot light keeps its ppfdPeriod disabled and its brightness untouched
    # (the floor only guards an active PPFD target).
    out = _apply_plan_light({}, {"mode": "Time Slot", "ts_bri": 0, "ppfd_target": 0})
    assert out["ppfdPeriod"][0]["enabled"] == 0
    assert out["ppfdPeriod"][0]["brightness"] == 0
    assert out["timePeriod"][0]["enabled"] == 1


# ── v3.19.316: dimming-range floor ────────────────────────────────────────────

def test_dimming_range_floored_from_zero():
    out = _apply_plan_light({}, {"mode": "PPFD", "ppfd_target": 300,
                                 "ppfd_min": 0, "ppfd_max": 0})
    assert out["ppfdMinBrightness"] == 11          # min floored to 11
    assert out["ppfdMaxBrightness"] == 100         # max 0 -> default 100


def test_floor_ppfd_light_noop_when_not_ppfd():
    bl = {"modeType": 0, "ppfdPeriod": [{"brightness": 0}],
          "ppfdMinBrightness": 0, "ppfdMaxBrightness": 0}
    before = json.loads(json.dumps(bl))
    assert _floor_ppfd_light(bl) == before          # Manual light untouched


def test_floor_ppfd_light_keeps_valid_values():
    bl = {"modeType": 12, "ppfdPeriod": [{"brightness": 450}],
          "ppfdMinBrightness": 20, "ppfdMaxBrightness": 80}
    _floor_ppfd_light(bl)
    assert bl["ppfdPeriod"][0]["brightness"] == 450
    assert bl["ppfdMinBrightness"] == 20 and bl["ppfdMaxBrightness"] == 80


# ── v3.19.316: edit the running plan stage via a light entity ─────────────────

def _plan_cfg():
    return {"enabled": 1, "stage": [
        {"stageId": 111, "label": "Seedling",
         "light1": {"modeType": 12, "ppfdPeriod": [{"brightness": 20}],
                    "ppfdMinBrightness": 11, "ppfdMaxBrightness": 100},
         "light2": {"modeType": 0, "ppfdPeriod": [{"brightness": 0}]}},
        {"stageId": 222, "label": "Veg",
         "light1": {"modeType": 12, "ppfdPeriod": [{"brightness": 500}],
                    "ppfdMinBrightness": 11, "ppfdMaxBrightness": 100}},
    ]}


def test_cmd_light_into_plan_edits_current_stage_only():
    out = _cmd_light_into_plan("MAC", "u", "light", "300", "ppfd_target",
                               _plan_cfg(), 111)
    assert out["params"]["keyPath"] == ["plan"]
    stages = out["params"]["plan"]["stage"]
    assert stages[0]["light1"]["ppfdPeriod"][0]["brightness"] == 300   # current
    assert stages[1]["light1"]["ppfdPeriod"][0]["brightness"] == 500   # other untouched


def test_cmd_light_into_plan_falls_back_to_first_stage():
    out = _cmd_light_into_plan("MAC", "u", "light", "300", "ppfd_target",
                               _plan_cfg(), None)
    assert out["params"]["plan"]["stage"][0]["light1"]["ppfdPeriod"][0]["brightness"] == 300


def test_translate_command_routes_light_into_plan_when_active():
    out = translate_command(
        "light_1" if False else "light", "300", "MAC", "u", subfield="ppfd_target",
        plan_active=True, plan_cfg=_plan_cfg(), plan_stage_id=111)
    assert out["params"]["keyPath"] == ["plan"]


def test_translate_command_light_standalone_when_no_plan():
    out = translate_command(
        "light", "300", "MAC", "u", subfield="ppfd_target",
        device_state={}, light_state={}, plan_active=False)
    # No plan running -> writes the standalone device light block, not the plan.
    assert out["params"]["keyPath"] == ["device", "light"]


import pytest


@pytest.mark.parametrize("mode_label", ["PPFD - Plan", "Planting Plan", "Manual"])
def test_plan_lifecycle_mode_not_routed_into_plan(mode_label):
    """v3.19.318/319: the card's plan-lifecycle mode writes — 'PPFD - Plan' on
    start and 'Manual' on stop (setPlanLights) — must NOT be routed into the plan.
    Routing 'PPFD - Plan' would clobber a just-saved edit; routing 'Manual' would
    rewrite the plan with the cached enabled:1 and un-stop it. They go to the
    standalone device.light block instead."""
    out = translate_command(
        "light", mode_label, "MAC", "u", subfield="mode",
        device_state={}, light_state={},
        plan_active=True, plan_cfg=_plan_cfg(), plan_stage_id=111)
    assert out["params"]["keyPath"] == ["device", "light"]   # NOT ["plan"]


def test_real_light_mode_edit_still_routes_into_plan():
    # A genuine mode edit (e.g. to PPFD) during a plan still edits the stage.
    out = translate_command(
        "light", "PPFD", "MAC", "u", subfield="mode",
        plan_active=True, plan_cfg=_plan_cfg(), plan_stage_id=111)
    assert out["params"]["keyPath"] == ["plan"]


def test_translate_command_light_power_still_standalone_during_plan():
    # A power on/off (subfield None) always goes to the live device block, even
    # during a plan — only config subfields are routed into the plan.
    out = translate_command(
        "light", "ON", "MAC", "u", subfield=None,
        device_state={}, light_state={}, plan_active=True, plan_cfg=_plan_cfg(),
        plan_stage_id=111)
    assert out["params"]["keyPath"] == ["device", "light"]
