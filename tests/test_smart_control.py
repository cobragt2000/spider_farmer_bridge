"""Unit tests for the smart-control humidity->dehumidifier decision engine.
Pure logic, no Home Assistant — drives synthetic RH sequences through decide()."""

from custom_components.sf.smart_control import (
    DehumConfig, DehumState, decide, OFF, LOW, HIGH,
)

CFG = DehumConfig(
    target=55.0, deadband=5.0, escalate_after_s=300.0, escalate_drop=1.0,
    ease_band=3.0, min_on_s=120.0, min_off_s=120.0,
)


def test_off_turns_on_low_when_humid():
    s = DehumState(cmd=OFF, since=0.0)
    out = decide(s, rh=65.0, cfg=CFG, now=200.0)   # >target+deadband, off long enough
    assert out.cmd == LOW
    assert out.low_since == 200.0 and out.rh_base == 65.0


def test_min_off_blocks_immediate_on():
    s = DehumState(cmd=OFF, since=100.0)
    out = decide(s, rh=70.0, cfg=CFG, now=150.0)   # only 50s off < min_off 120
    assert out.cmd == OFF


def test_low_escalates_to_high_when_not_falling():
    s = DehumState(cmd=LOW, since=200.0, low_since=200.0, rh_base=65.0)
    out = decide(s, rh=64.5, cfg=CFG, now=501.0)   # drop 0.5 < 1.0, still humid
    assert out.cmd == HIGH


def test_low_stays_when_falling_and_rearms_window():
    s = DehumState(cmd=LOW, since=200.0, low_since=200.0, rh_base=65.0)
    out = decide(s, rh=63.0, cfg=CFG, now=501.0)   # drop 2.0 >= 1.0 -> falling fine
    assert out.cmd == LOW
    assert out.low_since == 501.0 and out.rh_base == 63.0   # re-armed


def test_low_holds_within_observation_window():
    s = DehumState(cmd=LOW, since=200.0, low_since=200.0, rh_base=65.0)
    out = decide(s, rh=64.0, cfg=CFG, now=400.0)   # only 200s < escalate_after 300
    assert out.cmd == LOW and out.low_since == 200.0


def test_high_eases_to_low_near_target():
    s = DehumState(cmd=HIGH, since=501.0, low_since=501.0, rh_base=64.5)
    out = decide(s, rh=57.5, cfg=CFG, now=700.0)   # <= target+ease_band (58)
    assert out.cmd == LOW


def test_high_stays_when_still_far_from_target():
    s = DehumState(cmd=HIGH, since=501.0, low_since=501.0, rh_base=64.5)
    out = decide(s, rh=62.0, cfg=CFG, now=700.0)   # 62 > 58
    assert out.cmd == HIGH


def test_turns_off_at_target_after_min_on():
    s = DehumState(cmd=LOW, since=100.0, low_since=100.0, rh_base=60.0)
    out = decide(s, rh=54.0, cfg=CFG, now=300.0)   # <= target, on 200s >= min_on
    assert out.cmd == OFF


def test_min_on_blocks_immediate_off():
    # min_on prevents an OFF this soon, but easing High->Low (less output near
    # target) is still allowed — so it must NOT be OFF, and here eases to Low.
    s = DehumState(cmd=HIGH, since=250.0, low_since=250.0, rh_base=60.0)
    out = decide(s, rh=54.0, cfg=CFG, now=300.0)   # only 50s on < min_on 120
    assert out.cmd != OFF
    assert out.cmd == LOW


def test_sensor_unavailable_holds_last_state():
    s = DehumState(cmd=HIGH, since=250.0, low_since=250.0, rh_base=60.0)
    out = decide(s, rh=None, cfg=CFG, now=999.0)
    assert out == s   # unchanged — hold


def test_full_sequence_no_overshoot():
    """A full run: humid -> Low -> High (not falling) -> ease to Low -> off."""
    s = DehumState(cmd=OFF, since=0.0)
    t = 200.0
    s = decide(s, 66.0, CFG, t); assert s.cmd == LOW
    t += 301
    s = decide(s, 65.5, CFG, t); assert s.cmd == HIGH      # barely moved -> escalate
    t += 200
    s = decide(s, 58.0, CFG, t); assert s.cmd == LOW       # eased near target
    t += 200
    s = decide(s, 54.0, CFG, t); assert s.cmd == OFF       # hit target


# ── Temperature -> outlet loop (v3.19.268) ───────────────────────────────────
from custom_components.sf.smart_control import (
    TempConfig, TempState, decide_temp, ON,
)

# Cooling: on when temp > target+deadband; off when temp <= target.
TCOOL = TempConfig(target=72.0, deadband=2.0, direction="cool",
                   min_on_s=120.0, min_off_s=120.0)
THEAT = TempConfig(target=72.0, deadband=2.0, direction="heat",
                   min_on_s=120.0, min_off_s=120.0)


def test_cool_turns_on_when_hot():
    s = TempState(cmd=OFF, since=0.0)
    out = decide_temp(s, temp=74.84, cfg=TCOOL, now=200.0)  # >72+2, off long enough
    assert out.cmd == ON and out.since == 200.0


def test_cool_stays_off_within_deadband():
    s = TempState(cmd=OFF, since=0.0)
    out = decide_temp(s, temp=73.5, cfg=TCOOL, now=200.0)   # 73.5 < 74 -> no
    assert out.cmd == OFF


def test_cool_min_off_blocks_immediate_on():
    s = TempState(cmd=OFF, since=100.0)
    out = decide_temp(s, temp=80.0, cfg=TCOOL, now=150.0)   # only 50s off < 120
    assert out.cmd == OFF


def test_cool_turns_off_at_target():
    s = TempState(cmd=ON, since=0.0)
    out = decide_temp(s, temp=72.0, cfg=TCOOL, now=200.0)   # reached target
    assert out.cmd == OFF


def test_cool_min_on_blocks_immediate_off():
    s = TempState(cmd=ON, since=100.0)
    out = decide_temp(s, temp=71.0, cfg=TCOOL, now=150.0)   # only 50s on < 120
    assert out.cmd == ON


def test_cool_holds_on_between_target_and_deadband():
    s = TempState(cmd=ON, since=0.0)
    out = decide_temp(s, temp=73.0, cfg=TCOOL, now=500.0)   # 72 < 73 <= 74 -> hold
    assert out.cmd == ON


def test_heat_turns_on_when_cold():
    s = TempState(cmd=OFF, since=0.0)
    out = decide_temp(s, temp=69.0, cfg=THEAT, now=200.0)   # <72-2
    assert out.cmd == ON


def test_heat_turns_off_at_target():
    s = TempState(cmd=ON, since=0.0)
    out = decide_temp(s, temp=72.0, cfg=THEAT, now=200.0)
    assert out.cmd == OFF


def test_temp_none_holds_last_state():
    on = TempState(cmd=ON, since=0.0)
    assert decide_temp(on, temp=None, cfg=TCOOL, now=999.0).cmd == ON
    off = TempState(cmd=OFF, since=0.0)
    assert decide_temp(off, temp=None, cfg=TCOOL, now=999.0).cmd == OFF
