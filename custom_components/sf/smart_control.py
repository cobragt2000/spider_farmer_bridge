"""Card-configured "smart control" engine — pure decision logic (v3.19.256).

The card lets a user turn the integration into a closed-loop environment
controller: assign a humidity sensor + a dehumidifier and a target, and this
engine drives the gear to hold that target — smarter than the controller's own
coarse Humidity mode. The logic here is a PURE function so it can be unit-tested
without Home Assistant; the thin async loop in bus.py calls it and issues the
resulting command through the normal apply_bundle path.

Humidity -> dehumidifier loop (the first loop; temp->fan and PPFD->light reuse
the same shape later):

  * off, RH climbs above target+deadband  -> turn ON at Low gear.
  * on Low but RH isn't falling fast enough (dropped < escalate_drop over
    escalate_after seconds) and still above target+deadband -> switch to High.
  * on High and RH eases to within ease_band of target -> drop back to Low
    (anti-overshoot: back off before we blow past the target).
  * RH at/below target -> turn OFF.
  * min_on / min_off dwell timers stop rapid cycling.
  * sensor unavailable (rh is None) -> HOLD the last command (v1 fallback #3:
    full Manual, hold last state; SF does NOT resume until HA drives it again).

Fallback behaviour on HA restart is "hold last state" for v1 — the device keeps
whatever gear it was last commanded to until HA is back and the loop resumes.
(Alternate fallbacks — rest in SF mode, restore SF on graceful shutdown — are a
backlogged integration option.)
"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Optional

# Commanded gear states.
OFF = "off"
LOW = "low"
HIGH = "high"


@dataclass(frozen=True)
class DehumConfig:
    target: float = 55.0          # RH % to hold
    deadband: float = 5.0         # turn ON above target+deadband
    escalate_after_s: float = 300.0   # time on Low before an escalation check
    escalate_drop: float = 1.0    # min RH drop over that window to count as "falling"
    ease_band: float = 3.0        # on High, ease to Low within this of target
    min_on_s: float = 120.0       # min time ON before allowed to turn OFF
    min_off_s: float = 120.0      # min time OFF before allowed to turn ON


@dataclass(frozen=True)
class DehumState:
    cmd: str = OFF                # last commanded gear (off/low/high)
    since: float = 0.0            # when cmd last changed (for min on/off dwell)
    low_since: float = 0.0        # when the current Low window started (escalation)
    rh_base: float = 0.0          # RH at low_since (to measure the drop)


def decide(
    state: DehumState, rh: Optional[float], cfg: DehumConfig, now: float
) -> DehumState:
    """Return the next state. If the returned ``cmd`` differs from ``state.cmd``
    the caller issues that gear command; timer/baseline-only changes keep the
    same cmd (no command issued). ``rh is None`` holds the last state."""
    if rh is None:
        return state  # sensor unavailable — hold last commanded gear

    on = state.cmd in (LOW, HIGH)

    if not on:
        # OFF -> turn on at Low once RH climbs past the deadband and we've been
        # off long enough.
        if rh > cfg.target + cfg.deadband and (now - state.since) >= cfg.min_off_s:
            return DehumState(cmd=LOW, since=now, low_since=now, rh_base=rh)
        return state

    # Currently ON.
    if rh <= cfg.target and (now - state.since) >= cfg.min_on_s:
        return DehumState(cmd=OFF, since=now, low_since=now, rh_base=rh)

    if state.cmd == LOW:
        if (now - state.low_since) >= cfg.escalate_after_s:
            drop = state.rh_base - rh
            if drop < cfg.escalate_drop and rh > cfg.target + cfg.deadband:
                # Not falling fast enough and still high -> escalate to High.
                return DehumState(cmd=HIGH, since=now, low_since=now, rh_base=rh)
            # Falling fine (or already near target) — stay Low, re-arm the window.
            return replace(state, low_since=now, rh_base=rh)
        return state  # still within the Low observation window

    # state.cmd == HIGH
    if rh <= cfg.target + cfg.ease_band:
        # Close to target — back off to Low before we overshoot.
        return DehumState(cmd=LOW, since=now, low_since=now, rh_base=rh)
    return state


# ── Temperature -> outlet loop (v3.19.268) ───────────────────────────────────
# A sensorless power strip (AC5/AC10 on an external temp source) can't run its
# own Temperature-mode outlet control — the device has no sensor to compare, so
# its firmware never switches the outlet. This drives that outlet from the
# mirrored/external temperature: a plain hysteresis on/off with min on/off dwell
# to stop rapid cycling. Cooling turns ON when it's too warm; Heating when it's
# too cold. ``direction`` is "cool" or "heat". Units are whatever the caller
# feeds in (target and temp must share a unit); the caller normalises to °C.

# Commanded outlet states.
ON = "on"


@dataclass(frozen=True)
class TempConfig:
    target: float = 22.2222       # setpoint (same unit as the reading)
    deadband: float = 1.1111      # switch ON this far past target
    direction: str = "cool"       # "cool" (on when hot) or "heat" (on when cold)
    min_on_s: float = 120.0       # min time ON before allowed to turn OFF
    min_off_s: float = 120.0      # min time OFF before allowed to turn ON


@dataclass(frozen=True)
class TempState:
    cmd: str = OFF                # last commanded outlet state (off/on)
    since: float = 0.0           # when cmd last changed (for min on/off dwell)


def decide_temp(
    state: TempState, temp: Optional[float], cfg: TempConfig, now: float
) -> TempState:
    """Return the next outlet state. A changed ``cmd`` means the caller issues
    that on/off command. ``temp is None`` holds the last commanded state (sensor
    unavailable — the outlet keeps whatever it was last driven to)."""
    if temp is None:
        return state  # sensor unavailable — hold last commanded state

    on = state.cmd == ON
    cool = cfg.direction != "heat"
    # "Too far" one way turns ON; reaching the target turns OFF (hysteresis).
    want_on = (temp > cfg.target + cfg.deadband) if cool else (temp < cfg.target - cfg.deadband)
    want_off = (temp <= cfg.target) if cool else (temp >= cfg.target)

    if not on:
        if want_on and (now - state.since) >= cfg.min_off_s:
            return TempState(cmd=ON, since=now)
        return state
    # Currently ON.
    if want_off and (now - state.since) >= cfg.min_on_s:
        return TempState(cmd=OFF, since=now)
    return state
