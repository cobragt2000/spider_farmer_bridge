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

from dataclasses import dataclass, field
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
# Event-driven capture (v3.20.32) stores anywhere from a row per 6 s (a swing) to one per
# 300 s (steady), so a ROW count no longer says how much history there is: 7200 rows can be
# half a day of swings or 25 days of a steady tent. The durable-store path therefore scores
# volume by the TIME its usable intervals cover against this span — the same ~10 days the
# 7200-row bar meant for 2-min capture. (v3.20.52)
FULL_SPAN_S = 10 * 86400.0


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
    # Ventilation gains (v3.20.36): device -> Δmetric/min per (output-% × intake-gap),
    # where intake-gap = intake(ambient) metric − tent metric. Captures how the blower's
    # effect scales with how far the incoming air sits from the tent (a cold-dry intake
    # cools/dries faster than a warm-humid one). Empty when no intake reference is set or
    # the term couldn't be identified. NOT in predict_rate yet (needs the live gap).
    vent: Mapping[str, float] = field(default_factory=dict)

    def predict_rate(self, outputs: Mapping[str, float]) -> float:
        """Predicted Δmetric/min for a given set of device outputs (ventilation excluded —
        it needs the live intake gap, supplied by the caller in P1 control)."""
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
          smooth_sec: float = 0.0, vent_devices: Sequence[str] = ()):
    """(X, y, vdevs) — see `_rows_dt`, which also returns each row's interval length."""
    X, y, _dt, vdevs = _rows_dt(samples, metric, devices, smooth_sec, vent_devices)
    return X, y, vdevs


def _rows_dt(samples: Sequence[Sample], metric: str, devices: Sequence[str],
             smooth_sec: float = 0.0, vent_devices: Sequence[str] = ()):
    """Build the regression rows from consecutive usable sample pairs.
    y = per-minute rate of `metric`; X columns are [each device's output], then [a
    ventilation column output × (intake − tent) for each device in `vent_devices` that has
    an intake reference captured], then an intercept (drift). When `smooth_sec` > 0 the
    metric, device and intake channels are run through the same centered time-window
    average. Returns (X, y, dt, vdevs): dt is each row's interval length in seconds; vdevs is
    the ordered list of devices that actually got a ventilation column (empty when no intake
    reference is present / coverage too thin)."""
    ordered = sorted(samples, key=lambda s: s.t)
    amb_key = f"ambient_{metric}"
    n = len(ordered)
    have = sum(1 for s in ordered if s.outputs.get(amb_key) is not None)
    coverage = (have / n) if n else 0.0
    vdevs = [d for d in vent_devices if d in devices] if coverage >= 0.5 else []
    X, y, dt, _ns, _na, _seed = _rows_core(ordered, metric, devices, smooth_sec, vdevs)
    return X, y, dt, vdevs


def _rows_core(ordered: Sequence[Sample], metric: str, devices: Sequence[str],
               smooth_sec: float, vcols: Sequence[str], row_from: float = float("-inf"),
               row_to: float = float("inf"), seed: float = float("nan"),
               seed_from: float = float("-inf")):
    """The row builder behind `_rows_dt`, also usable on a SLICE of a longer stream.

    `ordered` (time-sorted) supplies the smoothing context; only rows whose interval STARTS
    in [row_from, row_to) are returned, and only samples in that range are counted
    (returns ns = samples, na = samples with an intake reading). `vcols` get a ventilation
    column each. The intake value is carried forward over gaps starting from `seed` (the
    last smoothed intake value before the slice), updated only from samples at or after
    `seed_from`; the value in effect at `row_to` comes back as the new seed.
    Returns (X, y, dt, ns, na, seed)."""
    n = len(ordered)
    times = [s.t for s in ordered]
    mv = [float(s.metrics[metric]) if s.metrics.get(metric) is not None else float("nan")
          for s in ordered]
    dv = {d: [float(s.outputs.get(d, 0.0)) for s in ordered] for d in devices}
    # Intake (ambient) reference for THIS metric, stored alongside the tent sample as an
    # ambient_<metric> "output". Ventilation needs it; enable only with decent coverage.
    amb_key = f"ambient_{metric}"
    av = [float(s.outputs[amb_key]) if s.outputs.get(amb_key) is not None else float("nan")
          for s in ordered]
    ns = na = 0
    for t, v in zip(times, av, strict=True):
        if row_from <= t < row_to:
            ns += 1
            na += v == v
    if smooth_sec > 0 and n:
        mv = _time_smooth(times, mv, smooth_sec)
        dv = {d: _time_smooth(times, dv[d], smooth_sec) for d in devices}
        if vcols:
            av = _time_smooth(times, av, smooth_sec)
    if vcols:                            # one value per row once intake has started
        last = seed
        for i in range(n):
            v = av[i]
            if v == v:
                if times[i] >= seed_from:
                    last = v
            else:
                av[i] = last
            if times[i] < row_to:
                seed = last
    xs: list[list[float]] = []
    ys: list[float] = []
    dts: list[float] = []
    for i in range(n - 1):
        if not (row_from <= times[i] < row_to):
            continue
        dt = times[i + 1] - times[i]
        if not (MIN_DT_S <= dt <= MAX_DT_S):
            continue
        pv, cv = mv[i], mv[i + 1]
        if pv != pv or cv != cv:        # NaN (missing metric, or smoothing edge)
            continue
        row = [dv[d][i] for d in devices]
        if any(x != x for x in row):    # NaN device at a smoothing edge
            continue
        vent: list[float] = []
        if vcols:
            gap = av[i] - mv[i]         # intake − tent at interval start
            if gap != gap:              # intake not yet reporting at this (old) row → no exchange info
                gap = 0.0
            vent = [dv[d][i] * gap for d in vcols]
        ys.append((cv - pv) / (dt / 60.0))
        xs.append(row + vent + [1.0])   # output in effect = level at interval start
        dts.append(dt)
    k = len(devices) + len(vcols) + 1
    return (np.asarray(xs, dtype=float).reshape(-1, k), np.asarray(ys, dtype=float),
            np.asarray(dts, dtype=float), ns, na, seed)


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


def _confidence_span(covered_s: float, r2: float, full_span_s: float) -> float:
    """`_confidence` with the volume scored by covered TIME (see FULL_SPAN_S)."""
    vol = min(1.0, covered_s / max(1.0, full_span_s))
    quality = max(0.0, min(1.0, r2 / R2_FULL))
    return round(vol * quality, 4)


# A device whose output barely varies across the training rows carries no
# information about its effect — fitting it anyway just absorbs noise into a
# spurious gain (e.g. the grow light in the NIGHT model, where it's always off).
# Below this variance (on the 0..100 effort scale) a device is treated as constant
# and dropped from the fit, with its gain pinned to 0.
MIN_OUTPUT_VAR = 1.0

# Ventilation term (v3.20.36). An air-exchange device driven at `output` pulls intake
# (lung-room / outside) air through the tent; its effect on a metric scales with how far
# the intake sits from the tent — the gradient (intake − tent). For each of these devices,
# when an intake reference (ambient_<metric>) is captured, the fit adds a feature column
# output × (intake − tent), so the blower's learned effect separates into a constant part
# (its plain gain) and this gradient-driven exchange part. Only the blower exchanges with
# outside air; the internal circulation fan is already excluded entirely.
VENT_DEVICES = ("blower",)
# A ventilation column (output × gap, so its scale is ~output×degrees) needs more raw
# variance than a plain 0..100 effort column before it's trusted, else it's dropped.
MIN_VENT_VAR = 25.0


@dataclass
class FitStats:
    """Additive sufficient statistics of the duration-weighted least-squares fit (raw
    interval-length weights): Σw·x·xᵀ, Σw·x·y, Σw·y², Σw (= seconds covered), the row count,
    and the sample counts behind the intake-coverage check. Stats of disjoint row sets add
    up (and subtract), so a long history can be folded once and only new rows added — the
    fit from the sum is the fit over all rows."""
    G: np.ndarray
    b: np.ndarray
    yy: float = 0.0
    sw: float = 0.0
    n: int = 0
    ns: int = 0
    na: int = 0

    @classmethod
    def empty(cls, k: int) -> "FitStats":
        return cls(np.zeros((k, k)), np.zeros(k))

    @classmethod
    def from_rows(cls, X, y, dt, ns: int = 0, na: int = 0) -> "FitStats":
        w = np.asarray(dt, dtype=float)
        Xw = X * w[:, None]
        return cls(X.T @ Xw, Xw.T @ y, float(np.dot(w * y, y)), float(w.sum()),
                   int(X.shape[0]), int(ns), int(na))

    def __add__(self, o: "FitStats") -> "FitStats":
        return FitStats(self.G + o.G, self.b + o.b, self.yy + o.yy, self.sw + o.sw,
                        self.n + o.n, self.ns + o.ns, self.na + o.na)

    def __sub__(self, o: "FitStats") -> "FitStats":
        return FitStats(self.G - o.G, self.b - o.b, self.yy - o.yy, self.sw - o.sw,
                        self.n - o.n, self.ns - o.ns, self.na - o.na)


def model_from_stats(st: FitStats, metric: str, devices: Sequence[str],
                     vcols: Sequence[str] = (), use_vent: bool = True,
                     full_samples: float = FULL_SAMPLES,
                     full_span_s: float | None = None) -> MetricModel:
    """Solve the per-metric model from FitStats whose columns are [devices…, a ventilation
    column per `vcols`…, intercept]. `use_vent` False ignores the ventilation columns (too
    little intake data). Volume for the confidence: row count against `full_samples`, or —
    when `full_span_s` is given — covered time against that span."""
    devices = list(devices)
    nd, nv = len(devices), len(vcols)
    k = nd + nv + 1
    n = int(st.n)

    def _zero():
        return MetricModel(metric, 0.0, {d: 0.0 for d in devices}, n, 0.0, 0.0)

    if n < 2 or st.sw <= 0:
        return _zero()
    # Weights normalised to mean 1, so evenly spaced rows give exactly plain OLS numbers.
    scale = n / st.sw
    G, bvec, yy = st.G * scale, st.b * scale, st.yy * scale
    wsum = float(n)
    mean = G[:, k - 1] / wsum
    var = np.diag(G) / wsum - mean ** 2
    # Keep only columns with real variance (a constant column just absorbs noise); the
    # ventilation columns use their own, larger threshold since they're on an output×gap
    # scale. The intercept (drift) is always kept.
    keep = [i for i in range(nd) if float(var[i]) > MIN_OUTPUT_VAR]
    keep_v = [j for j in range(nv) if use_vent and float(var[nd + j]) > MIN_VENT_VAR]
    idx = keep + [nd + j for j in keep_v] + [k - 1]
    if n <= len(idx):
        return _zero()
    Gs = G[np.ix_(idx, idx)]
    bs = bvec[idx]
    beta, *_ = np.linalg.lstsq(Gs, bs, rcond=None)
    ss_res = max(0.0, float(yy - 2.0 * beta @ bs + beta @ Gs @ beta))
    ybar = float(bvec[k - 1]) / wsum
    ss_tot = float(yy - wsum * ybar * ybar)
    r2 = 1.0 - ss_res / ss_tot if ss_tot > 1e-12 else 0.0
    gains = {d: 0.0 for d in devices}            # dropped (constant) devices → 0
    for j, i in enumerate(keep):
        gains[devices[i]] = float(beta[j])
    vent = {}                                    # device -> ventilation gain (gradient effect)
    for j, jj in enumerate(keep_v):
        vent[vcols[jj]] = float(beta[len(keep) + j])
    conf = (_confidence_span(st.sw, r2, full_span_s) if full_span_s
            else _confidence(n, r2, full_samples))
    return MetricModel(metric, float(beta[-1]), gains, n, round(r2, 4), conf, vent)


def fit_metric_model(
    samples: Sequence[Sample], metric: str, devices: Sequence[str],
    full_samples: float = FULL_SAMPLES, denoise_sec: float = DENOISE_HALF_SEC,
    full_span_s: float | None = None,
) -> MetricModel:
    """Fit the per-metric response model via least squares, each row WEIGHTED BY ITS
    INTERVAL LENGTH. Devices that don't vary across the rows are dropped (gain 0) so their
    coefficient can't pick up noise. Degenerate inputs resolve to low/zero confidence rather
    than raising. `full_samples` is the 'enough data' bar for confidence (set by the learning
    speed); `full_span_s`, when given, replaces it with a covered-time bar. `denoise_sec` is
    the smoothing half-window for noise-limited metrics (the learn path scales it to the
    capture cadence so it never flattens fast swings).

    Why weighted (v3.20.52): event-driven capture stores a row exactly when a reading
    moved past its jitter epsilon, so between device changes the stored intervals are short
    precisely when sensor noise pushed the reading over the edge. With every row counted
    equally those noise-picked rates dominate and pull every gain toward zero (simulated:
    blower −0.0005 vs a true −0.001 at 0.05 ° sensor noise). Weighting each rate by its
    duration makes the fit regress the TOTAL change over each stretch on the inputs held
    during it — the intermediate, noise-triggered rows telescope away — and recovers the true
    gains at every noise level. With evenly spaced rows (the recorder grid, the old 2-min
    capture) all weights are equal and the result is exactly the plain least-squares fit."""
    devices = list(devices)
    smooth = denoise_sec if metric in DENOISE_METRICS else 0.0
    X, y, dt, vdevs = _rows_dt(samples, metric, devices, smooth_sec=smooth,
                               vent_devices=VENT_DEVICES)
    return model_from_stats(FitStats.from_rows(X, y, dt), metric, devices, vdevs, True,
                            full_samples, full_span_s)


def fit_models(
    samples: Sequence[Sample], metrics: Sequence[str], devices: Sequence[str],
    full_samples: float = FULL_SAMPLES, denoise_sec: float = DENOISE_HALF_SEC,
    full_span_s: float | None = None,
) -> dict[str, MetricModel]:
    """Fit a model for every metric. Keyed by metric name. `full_samples` = the confidence
    'enough data' bar (set by the learning-speed window), or `full_span_s` as a covered-time
    bar; `denoise_sec` = the cadence-scaled smoothing half-window for noise-limited metrics."""
    return {m: fit_metric_model(samples, m, devices, full_samples, denoise_sec, full_span_s)
            for m in metrics}


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


def regime_samples(samples: Sequence[Sample], light_keys: Sequence[str]) -> dict:
    """{"all": samples} plus "day"/"night" subsets when there are grow lights."""
    if not light_keys:
        return {"all": list(samples)}
    day, night = split_day_night(samples, light_keys)
    return {"all": list(samples), "day": day, "night": night}


class IncrementalFit:
    """Exact running fit over an append-only, time-ordered sample stream — the durable store
    on the 'all data' (Slow) learning level, where refitting everything every 15 s grew
    without bound (a year of 60-s capture: 4 s and ~600 MB per pass).

    A row (one interval) can no longer change once the samples after it — its end point and
    the smoothing window around both ends — are stored. Such rows are folded into FitStats
    per (regime, metric) exactly once; each update reads only the recent tail of the stream
    (about an hour) and adds the tail's rows on top. The models solved from the sum are the
    models a full refit over all data gives. A first update (or one after a long gap) folds
    the history in day-sized pieces, so memory stays bounded too.

    `load(since, until)` returns the stream's samples with since <= t < until (until None =
    open end), time-ordered. Anything that changes stored rows other than appending newer
    ones (purge, clean, profile load) needs a fresh IncrementalFit."""

    CHUNK_S = 86400.0

    def __init__(self, metrics: Sequence[str], devices: Sequence[str],
                 light_keys: Sequence[str] = (), denoise_sec: float = DENOISE_HALF_SEC):
        self.metrics = list(metrics)
        self.devices = list(devices)
        self.lights = [d for d in light_keys if d in self.devices]
        self.denoise = float(denoise_sec)
        self.vcols = [d for d in VENT_DEVICES if d in self.devices]
        self.regimes = ["all"] + (["day", "night"] if self.lights else [])
        k = len(self.devices) + len(self.vcols) + 1
        self.folded = {(r, m): FitStats.empty(k) for r in self.regimes for m in self.metrics}
        self.seed = {(r, m): float("nan") for r in self.regimes for m in self.metrics}
        self.h = max([self._smooth(m) for m in self.metrics] or [0.0])
        self.t_cut: float | None = None          # rows starting before this are folded
        self.loaded = 0                          # samples read by the last update (for tests)

    def _smooth(self, metric: str) -> float:
        return self.denoise if metric in DENOISE_METRICS else 0.0

    def scan(self, samples: Sequence[Sample], row_from: float, row_to: float,
             seeds: Mapping | None = None, seed_from: float | None = None,
             only_regime: str | None = None) -> dict:
        """FitStats per (regime, metric) of the rows starting in [row_from, row_to), with
        the new intake seeds under key "_seed"."""
        out: dict = {"_seed": {}}
        k = len(self.devices) + len(self.vcols) + 1
        for reg, rs in regime_samples(samples, self.lights).items():
            if only_regime is not None and reg != only_regime:
                continue
            for m in self.metrics:
                seed = (seeds or {}).get((reg, m), float("nan"))
                X, y, dt, ns, na, seed2 = _rows_core(
                    rs, m, self.devices, self._smooth(m), self.vcols, row_from, row_to, seed,
                    row_from if seed_from is None else seed_from)
                out[(reg, m)] = (FitStats.from_rows(X, y, dt, ns, na) if len(y)
                                 else FitStats(np.zeros((k, k)), np.zeros(k), ns=ns, na=na))
                out["_seed"][(reg, m)] = seed2
        return out

    def _fold(self, samples: Sequence[Sample], end: float) -> None:
        st = self.scan(samples, self.t_cut, end, self.seed)
        for key in self.folded:
            self.folded[key] = self.folded[key] + st[key]
        self.seed = st["_seed"]
        self.t_cut = end

    def update(self, load, first_ts: float | None, newest_ts: float | None) -> dict:
        """Bring the fold up to date and return the totals: {(regime, metric): FitStats}."""
        self.loaded = 0
        if first_ts is None or newest_ts is None:
            return dict(self.folded)
        ctx = self.h + 1.0                              # smoothing context before a slice
        lag = MAX_DT_S + 2.0 * self.h + 60.0            # rows older than this are final
        if self.t_cut is None:
            self.t_cut = float(first_ts)
        target = float(newest_ts) - lag
        while target - self.t_cut > self.CHUNK_S:       # catch up in bounded pieces
            end = self.t_cut + self.CHUNK_S
            ss = load(self.t_cut - ctx, end + MAX_DT_S + self.h + 1.0)
            self.loaded += len(ss)
            self._fold(ss, end)
        tail = load(self.t_cut - ctx, None)
        self.loaded += len(tail)
        if target > self.t_cut:
            self._fold(tail, target)
        st = self.scan(tail, self.t_cut, float("inf"), self.seed)
        return {key: self.folded[key] + st[key] for key in self.folded}

    def model(self, st: FitStats, metric: str, full_span_s: float | None = FULL_SPAN_S,
              full_samples: float = FULL_SAMPLES) -> MetricModel:
        """Solve one metric's model from (summed) stats of this fit's column layout; the
        ventilation term is used when at least half the samples carry an intake reading."""
        use_vent = bool(st.ns) and st.na / st.ns >= 0.5
        return model_from_stats(st, metric, self.devices, self.vcols, use_vent,
                                full_samples, full_span_s)
