"""Adaptive climate control — pure learning core (P0, no HA, no actuation).

See `_backlog_private/AI_CLIMATE_DESIGN.md`. This module is the "brain": given a
time series of environment readings + device outputs, it learns how each device
moves each metric (direct effects) and how one device's action moves OTHER
metrics (cross-effects), modelled per metric as a linear response:

    d(metric)/dt  ≈  drift + Σ_device gain[device] * output[device]

`output` is the device's commanded level on a 0..100 scale (0 when off). One
multivariate fit per metric captures both the direct effect (blower → temperature)
and the cross-effects (blower → humidity) as separate coefficients; `drift` is the
idle trend with everything off (the tent's own thermal / RH leak). `gain` is in
metric-units per minute per output-percent — e.g. a blower→temperature gain of
-0.02 means 50 % blower pulls temperature down about 1.0 °/min faster than idle.

Everything here is a PURE function so it unit-tests without Home Assistant — the
recorder loader, model store and entities are thin glue built on top in later P0
slices. **No device is ever actuated from this module.** P0 is observe + learn
only; the learned gains are what a future controller (P1+) will use to pick the
output that reaches a target fastest and to pre-act on predicted cross-effects.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping, Sequence

import numpy as np

# A consecutive pair of readings is only usable as a training row when the gap
# between them is "normal" — long enough that the rate isn't dominated by sensor
# quantisation, short enough that the output didn't change much mid-interval.
# Event-driven capture (v3.20.32) stores at the SF hardware frame rate (~6 s) during a
# swing, so the floor is set just below that to admit those real fast pairs; quantisation
# noise at 6 s is negligible against a real seconds-scale swing and averages out in OLS.
MIN_DT_S = 5.0
# 65 min. Admits the hourly rows of the long-term-statistics backfill (3600 s
# apart) as training intervals, while still dropping multi-hour gaps (restarts,
# outages). The full-resolution forward capture is ~120 s; a brief HA/device
# hiccup up to this long still yields one usable interval instead of a dropped row.
MAX_DT_S = 3900.0
# Confidence calibration (v3.20.24). "How trained am I" blends data VOLUME and fit
# QUALITY, each scaled to a realistic goal instead of an impossible one.
#   - FULL_SAMPLES: samples at which the volume half saturates. Capture is every 2 min
#     (CAPTURE_STEP_S=120 → 720/day), so ~7200 ≈ 10 days of data — a fresh setup fills
#     the volume curve over ~7–12 days rather than the old 200 (a few hours).
#   - R2_FULL: the R² treated as a fully-trained fit. R²=1.0 is unreachable for a
#     rate-of-change model of a noisy, living tent; a genuinely good fit here lands
#     ~0.25, so quality is scored against that ceiling (the old code used 1.0, which
#     made every real model read as near-untrained). (John, 2026-11-12)
FULL_SAMPLES = 7200
R2_FULL = 0.25


@dataclass(frozen=True)
class Sample:
    """One moment in the history: a timestamp, the metric readings, and the
    device outputs in effect then. `outputs` is device -> 0..100 (0 = off)."""
    t: float                         # epoch seconds
    metrics: Mapping[str, float]     # e.g. {"temperature": 72.1, "humidity": 55.0}
    outputs: Mapping[str, float]     # e.g. {"blower": 46.0, "heater": 0.0}


@dataclass(frozen=True)
class MetricModel:
    """Learned linear response for one metric. `gains` is device -> Δmetric/min
    per output-%; `drift` is Δmetric/min with everything off. `confidence` is
    0..1 (data volume × fit quality) — the gate a future controller checks before
    trusting this model."""
    metric: str
    drift: float
    gains: Mapping[str, float]
    n: int                           # training rows used
    r2: float                        # fit quality on those rows
    confidence: float                # 0..1

    def predict_rate(self, outputs: Mapping[str, float]) -> float:
        """Predicted Δmetric/min for a given set of device outputs."""
        return self.drift + sum(g * float(outputs.get(d, 0.0)) for d, g in self.gains.items())


# Denoising (v3.20.25, cadence-aware v3.20.32). The model fits d(metric)/dt; the derivative
# of a slightly jittery sensor is mostly noise, which caps R². A centered time-window average
# of the metric AND the device channels (same filter on both, so gains are preserved for a
# linear system) de-jitters it — measured to roughly DOUBLE temperature R² (0.14→0.31) on
# 2-min samples. Applied ONLY to slow, noise-limited metrics: HUMIDITY is fast-dynamics-
# limited and the same smoothing DESTROYS it (0.12→0.01, measured — the signal IS the fast
# humidifier transients), so humidity/vpd are never denoised.
#   The window MUST track the capture cadence. A big fixed window (the old flat 300 s) is
# right for slow 2-min capture but WRONG for fast capture in a small tent, where temperature
# genuinely swings in seconds (cold dry winter intake into an 80 °F 4x2x6 tent) — a 300 s
# window would average across the whole swing and flatten the real signal. So the learn path
# passes denoise_sec = DENOISE_FRAMES × capture_interval (capped at DENOISE_HALF_SEC): a few
# frames wide. A centered mean preserves a locally-linear ramp's slope, so a small window
# removes per-frame jitter without biasing a fast swing; it only softens the sharp corners.
# The window is in TIME, so it also auto-noops where samples are spaced wider than it.
DENOISE_METRICS = ("temperature",)
DENOISE_FRAMES = 2.0                # smoothing half-window = this many capture intervals
DENOISE_HALF_SEC = 300.0            # CAP / slow-capture default (≈ the validated 10-min span)


def _time_smooth(times: Sequence[float], vals: Sequence[float], half_sec: float) -> list[float]:
    """Centered time-window mean aligned to `times` (sorted asc). NaN entries are skipped;
    a point with no valid neighbour stays NaN. A no-op where samples are spaced > the
    window (e.g. hourly statistics rows)."""
    n = len(vals)
    out = [float("nan")] * n
    lo = hi = 0
    for i in range(n):
        t = times[i]
        while times[lo] < t - half_sec:
            lo += 1
        if hi < i:
            hi = i
        while hi + 1 < n and times[hi + 1] <= t + half_sec:
            hi += 1
        s = 0.0
        c = 0
        for j in range(lo, hi + 1):
            v = vals[j]
            if v == v:                 # not NaN
                s += v
                c += 1
        out[i] = s / c if c else float("nan")
    return out


def _rows(samples: Sequence[Sample], metric: str, devices: Sequence[str],
          smooth_sec: float = 0.0):
    """Build the regression rows (X, y) from consecutive usable sample pairs.
    y = per-minute rate of `metric`; X = each device's output during the interval
    plus an intercept column (for drift). When `smooth_sec` > 0, the metric and device
    channels are first run through the same centered time-window average (denoising a
    noise-limited metric without biasing its gains). Returns (X, y) as float arrays."""
    ordered = sorted(samples, key=lambda s: s.t)
    n = len(ordered)
    times = [s.t for s in ordered]
    mv = [float(s.metrics[metric]) if s.metrics.get(metric) is not None else float("nan")
          for s in ordered]
    dv = {d: [float(s.outputs.get(d, 0.0)) for s in ordered] for d in devices}
    if smooth_sec > 0 and n:
        mv = _time_smooth(times, mv, smooth_sec)
        dv = {d: _time_smooth(times, dv[d], smooth_sec) for d in devices}
    xs: list[list[float]] = []
    ys: list[float] = []
    for i in range(n - 1):
        dt = times[i + 1] - times[i]
        if not (MIN_DT_S <= dt <= MAX_DT_S):
            continue
        pv, cv = mv[i], mv[i + 1]
        if pv != pv or cv != cv:        # NaN (missing metric, or smoothing edge)
            continue
        row = [dv[d][i] for d in devices]
        if any(x != x for x in row):    # NaN device at a smoothing edge
            continue
        ys.append((cv - pv) / (dt / 60.0))
        xs.append(row + [1.0])          # output in effect = level at interval start
    return np.asarray(xs, dtype=float), np.asarray(ys, dtype=float)


def _confidence(n: int, r2: float, full_samples: float = FULL_SAMPLES) -> float:
    """Blend data volume and fit quality into 0..1. Lots of data with a poor fit
    (or little data) stays low; it only climbs with both. Each half is scored against
    an ACHIEVABLE goal (R2_FULL ≈ a good climate fit, and `full_samples` = the sample
    count that counts as 'enough' — the learning-speed level sets this to its own window
    so a fast level reaches full confidence when ITS window fills, not only after 10 days).
    So a real, well-trained model reaches ~1.0 instead of being capped by an impossible
    R²=1 ceiling."""
    vol = min(1.0, n / max(1.0, full_samples))
    quality = max(0.0, min(1.0, r2 / R2_FULL))
    return round(vol * quality, 4)


# A device whose output barely varies across the training rows carries no
# information about its effect — fitting it anyway just absorbs noise into a
# spurious gain (e.g. the grow light in the NIGHT model, where it's always off).
# Below this variance (on the 0..100 effort scale) a device is treated as constant
# and dropped from the fit, with its gain pinned to 0.
MIN_OUTPUT_VAR = 1.0


def fit_metric_model(
    samples: Sequence[Sample], metric: str, devices: Sequence[str],
    full_samples: float = FULL_SAMPLES, denoise_sec: float = DENOISE_HALF_SEC,
) -> MetricModel:
    """Fit the per-metric response model via ordinary least squares. Devices that
    don't vary across the rows are dropped (gain 0) so their coefficient can't pick
    up noise. Degenerate inputs resolve to low/zero confidence rather than raising.
    `full_samples` is the 'enough data' bar for confidence (set by the learning speed).
    `denoise_sec` is the smoothing half-window for noise-limited metrics (the learn path
    scales it to the capture cadence so it never flattens fast swings)."""
    devices = list(devices)
    smooth = denoise_sec if metric in DENOISE_METRICS else 0.0
    X, y = _rows(samples, metric, devices, smooth_sec=smooth)
    if X.shape[0] < 2:
        return MetricModel(metric, 0.0, {d: 0.0 for d in devices}, int(X.shape[0]), 0.0, 0.0)

    # Keep only device columns with real variance; always keep the intercept (last).
    dev_cols = X[:, :len(devices)]
    keep = [i for i in range(len(devices)) if float(dev_cols[:, i].var()) > MIN_OUTPUT_VAR]
    Xk = np.column_stack([dev_cols[:, keep], np.ones(X.shape[0])]) if keep else np.ones((X.shape[0], 1))
    if Xk.shape[0] <= Xk.shape[1]:
        return MetricModel(metric, 0.0, {d: 0.0 for d in devices}, int(X.shape[0]), 0.0, 0.0)

    beta, *_ = np.linalg.lstsq(Xk, y, rcond=None)
    pred = Xk @ beta
    ss_res = float(np.sum((y - pred) ** 2))
    ss_tot = float(np.sum((y - np.mean(y)) ** 2))
    r2 = 1.0 - ss_res / ss_tot if ss_tot > 1e-12 else 0.0
    gains = {d: 0.0 for d in devices}            # dropped (constant) devices → 0
    for j, i in enumerate(keep):
        gains[devices[i]] = float(beta[j])
    drift = float(beta[-1])
    n = int(X.shape[0])
    return MetricModel(metric, drift, gains, n, round(r2, 4), _confidence(n, r2, full_samples))


def fit_models(
    samples: Sequence[Sample], metrics: Sequence[str], devices: Sequence[str],
    full_samples: float = FULL_SAMPLES, denoise_sec: float = DENOISE_HALF_SEC,
) -> dict[str, MetricModel]:
    """Fit a model for every metric. Keyed by metric name. `full_samples` = the confidence
    'enough data' bar (set by the learning-speed window); `denoise_sec` = the cadence-scaled
    smoothing half-window for noise-limited metrics."""
    return {m: fit_metric_model(samples, m, devices, full_samples, denoise_sec) for m in metrics}


def split_day_night(samples: Sequence[Sample], light_keys: Sequence[str],
                    threshold: float = 5.0) -> tuple[list, list]:
    """Partition samples into (day, night) by whether any grow light is on. Day and
    night are different thermal/transpiration regimes (lights add heat + drive plant
    transpiration; targets differ), so they're learned separately — otherwise night
    data biases the daytime model and vice-versa. A sample is 'day' when any light's
    output exceeds `threshold` %."""
    day: list = []
    night: list = []
    for s in samples:
        lit = any(float(s.outputs.get(k, 0.0)) > threshold for k in light_keys)
        (day if lit else night).append(s)
    return day, night


def overall_confidence(models: Mapping[str, MetricModel]) -> float:
    """Aggregate confidence across all metric models, as a 0..100 percentage —
    the headline "how trained am I" number for the AI Stats card's meter. The
    weakest model drags it down (a chain is only as strong as its weakest link),
    blended with the mean so one strong model still shows some progress."""
    if not models:
        return 0.0
    vals = [m.confidence for m in models.values()]
    worst = min(vals)
    mean = sum(vals) / len(vals)
    return round(100.0 * (0.5 * worst + 0.5 * mean), 1)
