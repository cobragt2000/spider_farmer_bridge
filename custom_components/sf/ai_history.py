"""Adaptive climate control — history → samples pipeline (P0, pure).

Turns raw recorder-style history (per-entity series of (epoch, value)) into the
evenly-spaced `Sample`s the learner wants. Recorder history is irregular — each
entity records only when it changes — so we lay a fixed time grid over the window
and **forward-fill** each series (its value at a grid point is the last value
recorded at or before it). That gives aligned rows at a steady cadence, which is
what rate estimation needs.

Also here: device-output **encoding** onto the 0..100 "effort" scale the learner
uses — a continuous speed passes through; a gear device (off / Low / High, or
1..N) maps to 0 / evenly-spaced steps / 100.

Pure and HA-free (it takes plain numbers), so it unit-tests without Home
Assistant. The async recorder query, model store, service and sensor are the thin
HA glue built on top (next slice). No device is actuated here.
"""

from __future__ import annotations

import bisect
from typing import Mapping, Optional, Sequence

from .ai_climate import Sample

# Default grid spacing for the backfill. Wider than MIN_DT_S so each row is a
# real change, not sensor jitter; narrow enough to catch device responses.
DEFAULT_STEP_S = 120.0

Series = Sequence[tuple[float, Optional[float]]]   # [(epoch, value|None), ...] asc by t


def speed_effort(value: Optional[float]) -> float:
    """A continuous 0..100 speed (blower/fan %) → effort, clamped. None/off → 0."""
    if value is None:
        return 0.0
    return max(0.0, min(100.0, float(value)))


def gear_effort(on: bool, level: int, max_level: int) -> float:
    """A gear device → 0..100 effort. Off → 0; otherwise the gear maps onto an
    evenly-spaced scale that tops out at 100 (Low/High with max_level=2 → 50/100;
    1..4 → 25/50/75/100). `level` is 1-based (clamped to >=1)."""
    if not on or max_level <= 0:
        return 0.0
    lvl = max(1, min(int(level), int(max_level)))
    return round(100.0 * lvl / max_level, 2)


def _value_at(series: Series, t: float) -> Optional[float]:
    """Forward-filled value of `series` at time `t`: the last recorded value at or
    before `t`, or None if the series hasn't started yet. One-off lookup — it builds
    the timestamp list, so loops over many `t` use a `_Cursor` instead."""
    if not series:
        return None
    times = [p[0] for p in series]
    i = bisect.bisect_right(times, t) - 1
    if i < 0:
        return None
    return series[i][1]


class _Cursor:
    """Forward-fill reader for ONE ascending series queried at non-decreasing times.
    Each step only walks forward, so a whole grid costs O(len(series) + grid points)
    instead of rebuilding the timestamp list per lookup (which made a 10-day recorder
    window quadratic: ~22 s per pass at 436k states). Same result as `_value_at`."""

    __slots__ = ("_s", "_i", "_n")

    def __init__(self, series: Series):
        self._s = series
        self._i = -1
        self._n = len(series)

    def at(self, t: float):
        s, i, n = self._s, self._i, self._n
        while i + 1 < n and s[i + 1][0] <= t:
            i += 1
        self._i = i
        return s[i][1] if i >= 0 else None


def build_samples(
    metric_series: Mapping[str, Series],
    output_series: Mapping[str, Series],
    *,
    step_s: float = DEFAULT_STEP_S,
    t0: Optional[float] = None,
    t1: Optional[float] = None,
) -> list[Sample]:
    """Align many per-entity series into evenly-spaced `Sample`s by forward-fill.

    - The grid starts once *every* series has at least one reading (so no sample
      is built from not-yet-started data) and runs to the last reading, every
      `step_s` seconds.
    - A metric with no value yet at a grid point is omitted from that sample (the
      fitter skips missing metrics); a device output with no value is treated as
      0 (off / no effort).
    """
    all_series = list(metric_series.values()) + list(output_series.values())
    present = [s for s in all_series if s]
    if not present:
        return []
    grid_lo = max(s[0][0] for s in present) if t0 is None else t0
    grid_hi = max(s[-1][0] for s in present) if t1 is None else t1
    if grid_hi < grid_lo:
        return []

    samples: list[Sample] = []
    mcur = [(name, _Cursor(series)) for name, series in metric_series.items()]
    ocur = [(name, _Cursor(series)) for name, series in output_series.items()]
    t = grid_lo
    while t <= grid_hi + 1e-9:
        metrics: dict[str, float] = {}
        for name, cur in mcur:
            v = cur.at(t)
            if v is not None:
                metrics[name] = float(v)
        outputs: dict[str, float] = {}
        for name, cur in ocur:
            v = cur.at(t)
            outputs[name] = float(v) if v is not None else 0.0
        if metrics:
            samples.append(Sample(t, metrics, outputs))
        t += step_s
    return samples
