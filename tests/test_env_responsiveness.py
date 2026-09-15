"""Env-outlet responsiveness (v3.19.300).

Two changes make an env-driven outlet (Temperature Heating/Cooling, or Humidity)
react to a threshold crossing promptly instead of after up to ~2 minutes:

1. Event-driven control pass — the bus watches the input sensor + env target/
   deadband entities and runs a pass at once on change (tested via the bus).
2. Setpoint-change dwell reset — when the target/deadband/direction changes, the
   anti-cycle dwell is pre-dated so the new threshold acts immediately. The pure
   mechanism (a pre-dated `since` bypasses the dwell) is tested here."""

from custom_components.sf.smart_control import (
    TempConfig, TempState, decide_temp, ON, OFF)


def test_dwell_blocks_a_recent_toggle():
    # Cooling outlet, currently ON, temp fell to/below target so it WANTS off —
    # but it only turned on 10s ago, so the 120s min-on dwell holds it ON.
    cfg = TempConfig(target=25, deadband=1, direction="cool",
                     min_on_s=120, min_off_s=120)
    now = 1000.0
    st = TempState(cmd=ON, since=now - 10)
    assert decide_temp(st, 24.0, cfg, now).cmd == ON      # blocked by dwell


def test_setpoint_reset_bypasses_dwell():
    # Same situation, but a setpoint change pre-dates `since` (what the bus does
    # when the target/deadband/direction changes) -> the outlet acts immediately.
    cfg = TempConfig(target=25, deadband=1, direction="cool",
                     min_on_s=120, min_off_s=120)
    now = 1000.0
    st = TempState(cmd=ON, since=now - max(cfg.min_on_s, cfg.min_off_s))
    assert decide_temp(st, 24.0, cfg, now).cmd == OFF      # dwell bypassed


def test_setpoint_reset_lets_a_new_target_turn_on():
    # Heating outlet OFF; the user raises the day target above the current temp so
    # it should turn ON now. Pre-dated dwell lets it fire without the min-off wait.
    cfg = TempConfig(target=26, deadband=1, direction="heat",
                     min_on_s=120, min_off_s=120)
    now = 5000.0
    st = TempState(cmd=OFF, since=now - max(cfg.min_on_s, cfg.min_off_s))
    # temp 24 < target-deadband (25) -> heat wants on
    assert decide_temp(st, 24.0, cfg, now).cmd == ON
