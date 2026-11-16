"""Adaptive climate — control-readiness analyses (pure, no HA, no actuation).

Three things the plain per-metric fit (ai_climate.fit_models) can't tell on its own, all
computed from the same captured Samples (v3.20.38):

1. LINKED DEVICES. Devices that almost always switch together (e.g. a small humidifier that
   an HA automation always pairs with a big one, or a light and the light bars on the same
   schedule) can't be told apart by any fit — it can only learn what they do together, and
   trying to split them produces contradictory numbers (one positive, one negative). We
   detect such groups and fit ONE combined device per group.

2. STEP RESPONSES. Each time a device (or group) switches on, how far does each metric move,
   how soon does it start, and how long until it gets most of the way? Measured directly
   from the switch-on events — the clean, physically meaningful signal a future controller
   needs (gain, delay, settling time).

3. FORECAST SELF-TEST. Hold back the most recent stretch, learn from everything before it,
   then replay the held-back stretch: predict each metric 15 minutes ahead from the real
   device schedule and compare with simply assuming "no change". A model that can't beat
   "no change" isn't ready to drive anything, so its learning % is halved until a later test
   passes.

Everything here is a PURE function so it unit-tests without Home Assistant.
"""

from __future__ import annotations

import bisect
from typing import Callable, Mapping, Optional, Sequence

from .ai_climate import MetricModel, Sample

# ── step responses ───────────────────────────────────────────────────────────

ON_LEVEL = 1.0                                   # output above this counts as "on"
STEP_LAGS_MIN = (1, 2, 3, 5, 8, 10, 15, 20, 30)
STEP_MIN_EVENTS = 5
STEP_MAX_GAP_S = 600.0     # an "off → on" edge only counts if the off sample is this recent


def _value_at(times: Sequence[float], vals: Sequence[float], t: float,
              tol_s: float) -> Optional[float]:
    """Latest value at or before t, if a sample exists within tol_s before t."""
    j = bisect.bisect_right(times, t) - 1
    if j < 0 or t - times[j] > tol_s:
        return None
    v = vals[j]
    return v if v == v else None


def step_responses(samples: Sequence[Sample], metrics: Sequence[str],
                   devices: Sequence[str]) -> dict:
    """{metric: {device: {events, change, start_min, t63_min}}} measured from every
    off→on switch of each device. `change` is the largest mean move (signed, metric units)
    over the lags, net of the typical drift over the same span; `start_min` is when the
    response first reaches 25 % of that and `t63_min` when it reaches 63 % (a settling-time
    proxy). Devices with fewer than STEP_MIN_EVENTS switch-ons are omitted."""
    ordered = sorted(samples, key=lambda s: s.t)
    if len(ordered) < 3:
        return {}
    times = [s.t for s in ordered]
    out: dict = {}
    for m in metrics:
        vals = [float(s.metrics[m]) if s.metrics.get(m) is not None else float("nan")
                for s in ordered]
        # Typical (drift) change over each lag, from a stride of start points.
        base = {}
        stride = max(1, len(ordered) // 2000)
        for L in STEP_LAGS_MIN:
            tot, n = 0.0, 0
            for i in range(0, len(ordered), stride):
                a = vals[i]
                b = _value_at(times, vals, times[i] + L * 60.0, max(180.0, L * 30.0))
                if a == a and b is not None:
                    tot += b - a
                    n += 1
            base[L] = tot / n if n else 0.0
        per_dev: dict = {}
        for d in devices:
            outs = [float(s.outputs.get(d, 0.0) or 0.0) for s in ordered]
            events = [i for i in range(1, len(ordered))
                      if outs[i] > ON_LEVEL >= outs[i - 1]
                      and times[i] - times[i - 1] <= STEP_MAX_GAP_S]
            if len(events) < STEP_MIN_EVENTS:
                continue
            by_lag = {}
            for L in STEP_LAGS_MIN:
                tot, n = 0.0, 0
                for i in events:
                    a = vals[i]
                    b = _value_at(times, vals, times[i] + L * 60.0, max(180.0, L * 30.0))
                    if a == a and b is not None:
                        tot += b - a
                        n += 1
                if n:
                    by_lag[L] = tot / n - base[L]
            if not by_lag:
                continue
            peak_lag = max(by_lag, key=lambda k: abs(by_lag[k]))
            peak = by_lag[peak_lag]
            start = next((L for L in sorted(by_lag) if abs(by_lag[L]) >= 0.25 * abs(peak)), None)
            t63 = next((L for L in sorted(by_lag) if abs(by_lag[L]) >= 0.63 * abs(peak)), None)
            # Summary only — the per-lag curve stays internal to keep the sensor's
            # attributes small (HA's recorder skips attributes over 16 KB).
            per_dev[d] = {"events": len(events), "change": round(peak, 3),
                          "start_min": start, "t63_min": t63}
        if per_dev:
            out[m] = per_dev
    return out


# ── 3. forecast self-test ─────────────────────────────────────────────────────

SELFTEST_HORIZON_S = 900.0          # 15-minute-ahead forecast (a controller's planning span)
SELFTEST_HOLDOUT_FRAC = 0.2         # most recent 20 % of the span is held back …
SELFTEST_MIN_HOLDOUT_S = 2 * 3600.0  # … but at least 2 hours
SELFTEST_MIN_SPAN_S = 6 * 3600.0    # need ≥ 6 h of data before testing at all
SELFTEST_WINDOW_STEP_S = 300.0      # start a forecast every 5 minutes of the held-back stretch
SELFTEST_MIN_WINDOWS = 10
SELFTEST_MAX_STEP_S = 600.0         # a gap longer than this inside a window voids that window
SELFTEST_PENALTY = 0.5              # learning % multiplier when the test fails


def _simulate(model: MetricModel, ordered: Sequence[Sample], metric: str,
              i0: int, horizon_s: float) -> Optional[tuple[float, float, float]]:
    """Roll `model` forward from sample i0 for horizon_s using the real device outputs and
    its OWN predicted level (so the intake-gap term uses the prediction). Returns
    (start, predicted, actual) or None if the window has a gap or missing data."""
    s0 = ordered[i0]
    x0 = s0.metrics.get(metric)
    if x0 is None:
        return None
    x = float(x0)
    t_end = s0.t + horizon_s
    amb_key = f"ambient_{metric}"
    j = i0
    while j + 1 < len(ordered) and ordered[j + 1].t <= t_end:
        a, b = ordered[j], ordered[j + 1]
        dt = b.t - a.t
        if dt > SELFTEST_MAX_STEP_S:
            return None
        rate = model.drift + sum(g * float(a.outputs.get(d, 0.0) or 0.0)
                                 for d, g in model.gains.items())
        for d, g in (model.vent or {}).items():
            amb = a.outputs.get(amb_key)
            if amb is not None:
                rate += g * float(a.outputs.get(d, 0.0) or 0.0) * (float(amb) - x)
        x += rate * dt / 60.0
        j += 1
    end = ordered[j]
    if t_end - end.t > 120.0 or end.metrics.get(metric) is None:
        return None
    return float(x0), x, float(end.metrics[metric])


def forecast_selftest(samples: Sequence[Sample], metrics: Sequence[str],
                      devices: Sequence[str],
                      fit: Callable[[Sequence[Sample], Sequence[str], Sequence[str]],
                                    Mapping[str, MetricModel]]) -> dict:
    """{metric: {status, skill, windows, horizon_min}} — status is "passed", "failed" or
    "pending" (not enough data yet; no penalty). skill = 1 − (model error / no-change
    error) over the held-back stretch: > 0 means the model beats "no change"."""
    ordered = sorted(samples, key=lambda s: s.t)
    pending = {m: {"status": "pending", "skill": None, "windows": 0,
                   "horizon_min": int(SELFTEST_HORIZON_S // 60)} for m in metrics}
    if len(ordered) < 50:
        return pending
    span = ordered[-1].t - ordered[0].t
    if span < SELFTEST_MIN_SPAN_S:
        return pending
    hold = max(SELFTEST_MIN_HOLDOUT_S, SELFTEST_HOLDOUT_FRAC * span)
    t_split = ordered[-1].t - hold
    train = [s for s in ordered if s.t < t_split]
    test_i0 = next((i for i, s in enumerate(ordered) if s.t >= t_split), len(ordered))
    if len(train) < 50:
        return pending
    models = fit(train, list(metrics), list(devices))
    out = {}
    for m in metrics:
        md = models.get(m)
        if md is None:
            out[m] = pending[m]
            continue
        err = naive = 0.0
        n = 0
        next_start = -1.0
        for i in range(test_i0, len(ordered)):
            if ordered[i].t < next_start or ordered[i].t + SELFTEST_HORIZON_S > ordered[-1].t:
                continue
            r = _simulate(md, ordered, m, i, SELFTEST_HORIZON_S)
            if r is None:
                continue
            x0, pred, actual = r
            err += abs(actual - pred)
            naive += abs(actual - x0)
            n += 1
            next_start = ordered[i].t + SELFTEST_WINDOW_STEP_S
        if n < SELFTEST_MIN_WINDOWS or naive <= 1e-9:
            out[m] = dict(pending[m], windows=n)
            continue
        skill = 1.0 - err / naive
        out[m] = {"status": "passed" if skill > 0 else "failed", "skill": round(skill, 3),
                  "windows": n, "horizon_min": int(SELFTEST_HORIZON_S // 60)}
    return out


def penalised_confidence(confidence: float, test: Optional[Mapping]) -> float:
    """The learning % after the self-test: halved when the test FAILED, unchanged when it
    passed or is still pending."""
    if test and test.get("status") == "failed":
        return round(confidence * SELFTEST_PENALTY, 4)
    return confidence
