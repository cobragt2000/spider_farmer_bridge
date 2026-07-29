"""Central temperature-unit handling (v3.19.80).

The controller always stores temperatures in °C on the wire. Historically this
integration converted every temperature to °F for display (and back on write),
matching the Spider Farmer app's default. To support both °C and °F users, the
target display unit now follows the Home Assistant instance's configured unit
(``hass.config.units.temperature_unit``), set once at setup via ``set_unit``.

Design goals:
  * Pure Python, no Home Assistant imports — the proxy layer imports this and
    must stay unit-testable in isolation.
  * Default is °F, so an install that never calls ``set_unit`` (or any °F user)
    behaves exactly as before — the imperial path is byte-for-byte unchanged.
  * The metric path is pure identity (no conversion), which is inherently safe.

Absolute temperatures (targets, thresholds, go-dark/turn-off) use
``c_to_disp`` / ``disp_to_c``. Temperature *differences* (dead zone, calibration
offsets) use ``cdelta_to_disp`` / ``dispdelta_to_c`` — a delta scales by 9/5 with
no +32 offset.
"""
from __future__ import annotations

_UNIT = "°F"   # "°F" default (historical behaviour); set from HA at setup.


def set_unit(u) -> None:
    """Set the display unit from HA's configured temperature unit ("°C"/"°F")."""
    global _UNIT
    _UNIT = "°C" if str(u).strip().upper().endswith("C") else "°F"


def unit() -> str:
    return _UNIT


def is_metric() -> bool:
    return _UNIT == "°C"


# ── wire °C -> display ──────────────────────────────────────────────────────
def c_to_disp(c):
    """Absolute °C -> display unit (whole number, as the app shows setpoints)."""
    try:
        c = float(c)
    except (TypeError, ValueError):
        return None
    return round(c) if is_metric() else round(c * 9 / 5 + 32)


def cdelta_to_disp(c, ndigits: int = 0):
    """Temperature *difference* °C -> display unit (no +32 offset)."""
    try:
        c = float(c)
    except (TypeError, ValueError):
        return None
    return round(c, ndigits) if is_metric() else round(c * 9 / 5, ndigits)


# ── display -> wire °C ──────────────────────────────────────────────────────
def disp_to_c(v):
    """Absolute display-unit value -> °C wire value."""
    return float(v) if is_metric() else (float(v) - 32) * 5 / 9


def dispdelta_to_c(v):
    """Display-unit *difference* -> °C wire delta (no offset)."""
    return float(v) if is_metric() else float(v) * 5 / 9


# ── entity-def bounds (a °F bound literal -> the current unit) ──────────────
def abs_bound(f):
    """Convert an absolute °F bound literal to the current unit (whole)."""
    return f if not is_metric() else round((float(f) - 32) * 5 / 9)


def delta_bound(f):
    """Convert a °F delta bound literal to the current unit (whole)."""
    return f if not is_metric() else round(float(f) * 5 / 9)
