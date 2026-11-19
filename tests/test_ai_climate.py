"""Adaptive climate control — pure learning core (P0). No HA; no actuation.

Proves the learner recovers known device→metric relationships from a synthetic
time series, separates direct from cross effects, and reports low confidence when
starved of data. See `_backlog_private/AI_CLIMATE_DESIGN.md`.
"""

import numpy as np

from custom_components.sf.ai_climate import (
    Sample, fit_metric_model, fit_models, overall_confidence, MAX_DT_S, split_day_night,
    FULL_SAMPLES,
)


def test_split_day_night_by_light():
    day_s = Sample(0.0, {"t": 1.0}, {"light_1": 80.0, "blower": 0.0})
    night_s = Sample(60.0, {"t": 1.0}, {"light_1": 0.0, "blower": 50.0})
    dim_s = Sample(120.0, {"t": 1.0}, {"light_1": 3.0})      # below threshold → night
    zone_day = Sample(180.0, {"t": 1.0}, {"ac5:light_2": 60.0})   # prefixed light counts
    day, night = split_day_night([day_s, night_s, dim_s, zone_day], ["light_1", "ac5:light_2"])
    assert [s.t for s in day] == [0.0, 180.0]
    assert [s.t for s in night] == [60.0, 120.0]


def test_hourly_intervals_are_usable_multihour_gaps_dropped():
    # The statistics backfill is hourly (3600 s pairs). The usable-interval cap must
    # admit those while still dropping multi-hour gaps (restarts/outages).
    assert MAX_DT_S >= 3600.0
    hourly = [Sample(i * 3600.0, {"temperature": 70.0 + i}, {"heater": 0.0}) for i in range(5)]
    m = fit_metric_model(hourly, "temperature", ["heater"])
    assert m.n == 4                      # all four hourly pairs used
    gap = [Sample(0.0, {"temperature": 70.0}, {"heater": 0.0}),
           Sample(3 * 3600.0, {"temperature": 73.0}, {"heater": 0.0})]  # 3 h gap
    assert fit_metric_model(gap, "temperature", ["heater"]).n == 0      # dropped

DEVICES = ["blower", "heater"]
# Ground-truth response (Δmetric/min): blower cools + dries; heater warms.
TRUE = {
    "temperature": {"drift": 0.08, "blower": -0.02, "heater": 0.05},
    "humidity":    {"drift": 0.05, "blower": -0.015, "heater": 0.0},
}


def _synth(n=400, noise=0.01, seed=0):
    """A self-consistent history: each step advances the metrics by the TRUE
    model given independently-varied device outputs (so the fit is identifiable),
    plus a little measurement noise."""
    rng = np.random.default_rng(seed)
    t, temp, humi = 0.0, 72.0, 55.0
    out = []
    for _ in range(n):
        blower = float(rng.choice([0, 25, 40, 55, 70, 100]))
        heater = float(rng.choice([0, 100]))
        outs = {"blower": blower, "heater": heater}
        out.append(Sample(t, {"temperature": temp, "humidity": humi}, outs))
        tr = (TRUE["temperature"]["drift"] + TRUE["temperature"]["blower"] * blower
              + TRUE["temperature"]["heater"] * heater)
        hr = (TRUE["humidity"]["drift"] + TRUE["humidity"]["blower"] * blower
              + TRUE["humidity"]["heater"] * heater)
        temp += tr + rng.normal(0, noise)      # dt = 60 s = 1 min, so rate == delta
        humi += hr + rng.normal(0, noise)
        t += 60.0
    return out


def test_constant_regressor_gets_zero_gain():
    # A device that never varies (e.g. the grow light in the night model, always off)
    # must be dropped — its gain pinned to 0, not fitted to noise. The varying device
    # is still recovered. (v3.20.19 model-quality fix.)
    rng = np.random.default_rng(5)
    t, temp, samples = 0.0, 70.0, []
    for _ in range(300):
        heater = float(rng.choice([0, 100]))
        samples.append(Sample(t, {"temperature": temp}, {"heater": heater, "light_1": 0.0}))
        temp += (-0.02 + 0.0005 * heater) + rng.normal(0, 0.004)
        t += 60.0
    m = fit_metric_model(samples, "temperature", ["heater", "light_1"])
    assert m.gains["light_1"] == 0.0                      # constant → pinned to 0
    assert abs(m.gains["heater"] - 0.0005) < 0.0004       # varying device recovered


def test_recovers_direct_gains_and_drift():
    # Full-volume (≈10 days) clean data → well-trained: high confidence under the
    # v3.20.24 calibration (volume + quality each scored against an achievable goal).
    m = fit_metric_model(_synth(n=FULL_SAMPLES), "temperature", DEVICES)
    assert abs(m.gains["blower"] - TRUE["temperature"]["blower"]) < 0.005
    assert abs(m.gains["heater"] - TRUE["temperature"]["heater"]) < 0.005
    assert abs(m.drift - TRUE["temperature"]["drift"]) < 0.02
    assert m.confidence > 0.7


def test_separates_cross_effect_from_direct():
    # Humidity is driven by the blower only — the heater coefficient must be ~0,
    # and the blower cross-effect must be recovered.
    m = fit_metric_model(_synth(), "humidity", DEVICES)
    assert abs(m.gains["blower"] - TRUE["humidity"]["blower"]) < 0.005
    assert abs(m.gains["heater"]) < 0.005


def test_predict_rate_matches_model():
    m = fit_metric_model(_synth(), "temperature", DEVICES)
    outs = {"blower": 50.0, "heater": 0.0}
    expected = m.drift + m.gains["blower"] * 50.0
    assert abs(m.predict_rate(outs) - expected) < 1e-9


def test_thin_data_is_low_confidence():
    thin = _synth(n=3)
    m = fit_metric_model(thin, "temperature", DEVICES)
    assert m.confidence == 0.0          # rows <= features+intercept → no trust


def test_temperature_denoising_lifts_r2_and_keeps_gain():
    # Temperature responds slowly; add heavy sensor noise so the raw 2-min derivative is
    # mostly noise. The temperature path is denoised (smooth both signal + devices), which
    # should lift R² well above the raw-noise fit while recovering the true gain.
    from custom_components.sf.ai_climate import _rows, DENOISE_HALF_SEC, DENOISE_METRICS
    assert "temperature" in DENOISE_METRICS and "humidity" not in DENOISE_METRICS
    rng = np.random.default_rng(9)
    t, temp, samples = 0.0, 70.0, []
    for _ in range(4000):
        heater = float(rng.choice([0, 100]))
        temp += (-0.003 + 0.01 * heater)                 # slow true response
        noisy = temp + rng.normal(0, 0.25)               # heavy sensor noise on the reading
        samples.append(Sample(t, {"temperature": noisy}, {"heater": heater}))
        t += 120.0                                       # 2-min cadence

    def _r2(X, y):
        beta, *_ = np.linalg.lstsq(X, y, rcond=None)
        pred = X @ beta
        return 1 - float(np.sum((y - pred) ** 2)) / float(np.sum((y - np.mean(y)) ** 2))

    Xr, yr, _ = _rows(samples, "temperature", ["heater"], smooth_sec=0.0)
    Xs, ys, _ = _rows(samples, "temperature", ["heater"], smooth_sec=DENOISE_HALF_SEC)
    assert _r2(Xs, ys) > _r2(Xr, yr) + 0.05              # denoising measurably lifts R²
    m = fit_metric_model(samples, "temperature", ["heater"])   # real path is denoised
    assert m.gains["heater"] > 0                         # true warming gain preserved


def test_denoise_window_is_tunable_and_preserves_fast_ramp():
    # Cadence-aware denoising (v3.20.32): the smoothing half-window is a parameter the learn
    # path scales to the capture interval (DENOISE_FRAMES × interval, capped). A window sized
    # to the cadence de-jitters without flattening a fast swing; the old flat 300 s window
    # over-smooths a fast transient. Both must still recover the true response sign.
    from custom_components.sf.ai_climate import _rows, fit_metric_model as fmm
    rng = np.random.default_rng(3)
    t, temp, samples = 0.0, 80.0, []
    for i in range(800):
        # Blower pulls cold air: a fast swing, sampled at the 30 s selectable floor.
        blower = float(100 if (i // 6) % 2 else 0)            # 0/100 %, toggles every ~180 s
        temp += (0.1 - 0.02 * blower) + rng.normal(0, 0.08)   # strong cooling while on
        samples.append(Sample(t, {"temperature": temp}, {"blower": blower}))
        t += 30.0
    # The cadence-scaled window (2×30 s = 60 s) and the old flat 300 s both recover cooling.
    m_fast = fmm(samples, "temperature", ["blower"], denoise_sec=60.0)
    m_slow = fmm(samples, "temperature", ["blower"], denoise_sec=300.0)
    assert m_fast.gains["blower"] < 0 and m_slow.gains["blower"] < 0
    # denoise_sec is actually honoured: the big window flattens the swing's derivative more.
    _, y60, _ = _rows(samples, "temperature", ["blower"], smooth_sec=60.0)
    _, y300, _ = _rows(samples, "temperature", ["blower"], smooth_sec=300.0)
    assert float(np.var(y60)) > float(np.var(y300))


def test_ventilation_term_recovers_intake_gradient_effect():
    # v3.20.36: when an intake (ambient) reference is captured, the blower's effect on a
    # metric is modelled as output × (intake − tent). Synthesize a tent where the ONLY
    # dynamics are a gentle warm drift plus blower-driven exchange with a varying intake;
    # the fit should recover a positive ventilation gain (cooler intake + blower → cooling).
    import math
    rng = np.random.default_rng(11)
    K_TRUE = 0.0008
    t, temp, samples = 0.0, 72.0, []
    for i in range(1600):
        blower = 100.0 if (i // 5) % 2 else 0.0              # 0/100 %, toggles
        amb = 60.0 + 8.0 * math.sin(i / 20.0)               # intake 52..68, below the tent
        rate = 0.1 + K_TRUE * blower * (amb - temp)          # °/min: warm drift + exchange
        temp += rate * 0.5 + rng.normal(0, 0.03)            # 30 s step
        samples.append(Sample(t, {"temperature": temp},
                              {"blower": blower, "ambient_temperature": amb}))
        t += 30.0
    m = fit_metric_model(samples, "temperature", ["blower"])
    assert "blower" in m.vent                                # term identified
    assert m.vent["blower"] > 0                              # cooler intake + blower = cooling
    assert abs(m.vent["blower"] - K_TRUE) < 0.0006          # roughly the true exchange rate

    # No intake reference captured → no ventilation term at all.
    bare = [Sample(s.t, s.metrics, {"blower": s.outputs["blower"]}) for s in samples]
    assert fit_metric_model(bare, "temperature", ["blower"]).vent == {}


def test_confidence_calibration_volume_and_quality():
    # v3.20.24: confidence = min(1,n/FULL_SAMPLES) × min(1, R²/R2_FULL). Half the data
    # caps it near half even with a perfect fit; full data with a good fit reaches ~1.
    from custom_components.sf.ai_climate import _confidence, R2_FULL
    assert _confidence(FULL_SAMPLES, R2_FULL) == 1.0          # full volume + goal R² → maxed
    assert _confidence(FULL_SAMPLES, R2_FULL * 2) == 1.0      # better-than-goal still caps at 1
    assert abs(_confidence(FULL_SAMPLES // 2, R2_FULL) - 0.5) < 0.01   # half data → ~half
    assert abs(_confidence(FULL_SAMPLES, R2_FULL / 2) - 0.5) < 0.01    # half quality → ~half
    assert _confidence(FULL_SAMPLES, 0.0) == 0.0             # no explanatory power → 0


def test_overall_confidence_is_a_percentage():
    models = fit_models(_synth(n=FULL_SAMPLES), ["temperature", "humidity"], DEVICES)
    oc = overall_confidence(models)
    assert 0.0 <= oc <= 100.0
    assert oc > 50.0                     # clean, full-volume data → well-trained
    assert overall_confidence({}) == 0.0


# The core is device-agnostic: humidifier and dehumidifier are just more devices.
# Here both drive humidity (humidifier up, dehumidifier down), the dehumidifier
# also warms slightly (a real cross-effect), and the humidifier is thermally
# neutral. `output` is a 0..100 "effort" scale — a Low/High gear device maps to
# e.g. 50/100 in the recorder loader (P0 slice 2); the learner just sees numbers.
HUMID_DEVICES = ["humidifier", "dehumidifier"]
HUMID_TRUE = {
    "humidity":    {"drift": -0.04, "humidifier": 0.03, "dehumidifier": -0.025},
    "temperature": {"drift": 0.05, "humidifier": 0.0, "dehumidifier": 0.008},
}


def _synth_humid(n=400, noise=0.01, seed=1):
    rng = np.random.default_rng(seed)
    t, humi, temp = 0.0, 55.0, 72.0
    out = []
    for _ in range(n):
        hum = float(rng.choice([0, 50, 100]))       # off / Low / High
        deh = float(rng.choice([0, 50, 100]))
        outs = {"humidifier": hum, "dehumidifier": deh}
        out.append(Sample(t, {"humidity": humi, "temperature": temp}, outs))
        hr = (HUMID_TRUE["humidity"]["drift"] + HUMID_TRUE["humidity"]["humidifier"] * hum
              + HUMID_TRUE["humidity"]["dehumidifier"] * deh)
        tr = (HUMID_TRUE["temperature"]["drift"] + HUMID_TRUE["temperature"]["dehumidifier"] * deh)
        humi += hr + rng.normal(0, noise)
        temp += tr + rng.normal(0, noise)
        t += 60.0
    return out


def test_humidifier_and_dehumidifier_gains():
    samples = _synth_humid(n=FULL_SAMPLES)
    hum_model = fit_metric_model(samples, "humidity", HUMID_DEVICES)
    # Humidifier raises RH, dehumidifier lowers it — opposite signs, both recovered.
    assert hum_model.gains["humidifier"] > 0
    assert hum_model.gains["dehumidifier"] < 0
    assert abs(hum_model.gains["humidifier"] - HUMID_TRUE["humidity"]["humidifier"]) < 0.005
    assert abs(hum_model.gains["dehumidifier"] - HUMID_TRUE["humidity"]["dehumidifier"]) < 0.005
    assert hum_model.confidence > 0.7
    # The dehumidifier's warming cross-effect on temperature is learned too, and
    # the humidifier reads ~thermally-neutral.
    temp_model = fit_metric_model(samples, "temperature", HUMID_DEVICES)
    assert abs(temp_model.gains["dehumidifier"] - HUMID_TRUE["temperature"]["dehumidifier"]) < 0.005
    assert abs(temp_model.gains["humidifier"]) < 0.005


def _event_capture_sim(jitter, days=3.0, seed=5):
    """A tent with KNOWN dynamics (dT/dt = 0.03 − 0.001·blower% + 0.0004·light% °/min),
    read every 6 s with sensor jitter, and stored by the real event-driven capture gate
    (5-s poll, store on a device change / a move past CAPTURE_EPS / the 300-s idle floor)."""
    import random
    from custom_components.sf.ai_learn import snapshot_changed, CAPTURE_IDLE_S
    rnd = random.Random(seed)
    frames, t, temp, blower = [], 0.0, 24.0, 40.0
    while t < days * 86400:
        light = 100.0 if 5.5 <= (t / 3600) % 24 < 20 else 0.0
        if temp > 26:
            blower = 80.0
        elif temp < 24:
            blower = 20.0
        elif rnd.random() < 6.0 / 1800:
            blower = rnd.choice([20.0, 50.0, 80.0])
        temp += (0.03 - 0.001 * blower + 0.0004 * light) * 0.1 + rnd.gauss(0, 0.002)
        frames.append((t, round(temp + rnd.gauss(0, jitter), 2), blower, light))
        t += 6.0
    out, last, last_w, fi, tp = [], None, -1e9, 0, 0.0
    while tp < frames[-1][0]:
        while fi + 1 < len(frames) and frames[fi + 1][0] <= tp:
            fi += 1
        _, x, b, li = frames[fi]
        vals = {"temperature": x, "blower": b, "light_1": li}
        if tp - last_w >= CAPTURE_IDLE_S or snapshot_changed(last, vals, ["temperature"]):
            out.append(Sample(tp, {"temperature": x}, {"blower": b, "light_1": li}))
            last, last_w = vals, tp
        tp += 5.0
    return out


def test_event_driven_capture_does_not_bias_gains_toward_zero():
    # v3.20.52 fix: with sensor noise ≥ 0.05 °, event-driven capture stores short intervals
    # exactly when noise crossed the epsilon; an equal-weight fit of their rates shrank the
    # blower gain to about half (−0.0005 vs −0.001). Duration-weighted rows recover it.
    for jitter in (0.0, 0.05, 0.1):
        m = fit_metric_model(_event_capture_sim(jitter), "temperature", ["blower", "light_1"],
                             denoise_sec=12.0)
        assert abs(m.gains["blower"] - (-0.001)) < 0.00015, (jitter, m.gains)
        assert abs(m.gains["light_1"] - 0.0004) < 0.00008, (jitter, m.gains)
        assert abs(m.drift - 0.03) < 0.004, (jitter, m.drift)


def test_even_spacing_weighted_fit_equals_plain_least_squares():
    # Even spacing → equal weights → exactly the old plain OLS (recorder grid, 2-min capture).
    from custom_components.sf.ai_climate import _rows
    samples = _synth(n=600, noise=0.02, seed=3)
    X, y, _ = _rows(samples, "humidity", DEVICES)
    beta, *_ = np.linalg.lstsq(X, y, rcond=None)
    m = fit_metric_model(samples, "humidity", DEVICES)
    assert abs(m.gains["blower"] - beta[0]) < 1e-9 and abs(m.gains["heater"] - beta[1]) < 1e-9
    assert abs(m.drift - beta[2]) < 1e-9


def test_fit_stats_of_parts_add_up_to_the_fit_of_the_whole():
    # The solver works on additive sufficient statistics, so a long history can be folded
    # piece by piece: stats(A) + stats(B) give exactly the fit over A + B.
    from custom_components.sf.ai_climate import FitStats, _rows, model_from_stats
    samples = _synth(n=900, noise=0.02, seed=4)
    X, y, _ = _rows(samples, "temperature", DEVICES)
    dt = np.full(len(y), 60.0)
    whole = model_from_stats(FitStats.from_rows(X, y, dt), "temperature", DEVICES)
    parts = (FitStats.from_rows(X[:300], y[:300], dt[:300])
             + FitStats.from_rows(X[300:], y[300:], dt[300:]))
    m = model_from_stats(parts, "temperature", DEVICES)
    assert m.n == whole.n and m.r2 == whole.r2 and m.confidence == whole.confidence
    assert abs(m.drift - whole.drift) < 1e-12
    assert all(abs(m.gains[d] - whole.gains[d]) < 1e-12 for d in DEVICES)
    ref = fit_metric_model(samples, "temperature", DEVICES, denoise_sec=0.0)
    assert abs(ref.gains["blower"] - m.gains["blower"]) < 1e-9


def _store_stream(seed=3, n=3000):
    """An event-driven-like stream (6 s … 300 s gaps, a few multi-hour outages), with grow
    light day/night, intake readings that come and go, appended in time order."""
    import random
    from custom_components.sf.ai_store import AiStore
    rnd = random.Random(seed)
    st = AiStore(":memory:")
    t, temp, hum = 1.7e9, 24.0, 60.0
    for step in range(n):
        t += rnd.choice([6, 6, 6, 12, 60, 300, 300, 5000]) if step % 97 else 20000
        vals = {"temperature": round(temp, 2), "humidity": round(hum, 1),
                "blower": rnd.choice([20.0, 50.0, 80.0]), "heater": rnd.choice([0.0, 100.0]),
                "light_1": 100.0 if (t / 3600) % 24 < 16 else 0.0}
        if rnd.random() < 0.7:
            vals["ambient_temperature"] = 10 + rnd.random()
        if rnd.random() < 0.6:
            vals["ambient_humidity"] = 40 + rnd.random()
        temp += rnd.gauss(0, 0.1)
        hum += rnd.gauss(0, 0.5)
        yield st, t, vals


def test_incremental_fit_equals_a_full_refit_and_reads_only_the_tail():
    # v3.20.52 fix (store on, Slow = all data): every 15-s pass loaded the whole store and
    # refitted it (a year of 60-s capture: 4 s and ~600 MB per pass). IncrementalFit folds
    # settled rows once; the models must equal a full refit over every sample.
    from custom_components.sf.ai_climate import (
        FULL_SPAN_S, IncrementalFit, regime_samples)
    metrics, devices = ["temperature", "humidity"], ["blower", "heater", "light_1"]
    inc = IncrementalFit(metrics, devices, ["light_1"], 12.0)
    store = None
    for i, (store, t, vals) in enumerate(_store_stream()):
        store.append("dp1", t, vals)
        if i % 50 == 49:
            cov = store.stats("dp1")
            totals = inc.update(lambda a, b, st=store: st.samples("dp1", metrics, a, b),
                                cov["first"], cov["last"])
    everything = store.samples("dp1", metrics)
    assert len(everything) == 3000
    assert inc.loaded < 300                       # last update read about the last hour only
    for reg, rs in regime_samples(everything, ["light_1"]).items():
        span = FULL_SPAN_S if reg == "all" else FULL_SPAN_S / 2
        ref = fit_models(rs, metrics, devices, FULL_SAMPLES, 12.0, span)
        for m in metrics:
            got = inc.model(totals[(reg, m)], m, span)
            assert got.n == ref[m].n and got.r2 == ref[m].r2, (reg, m)
            assert got.confidence == ref[m].confidence
            assert abs(got.drift - ref[m].drift) < 1e-12
            for d in devices:
                assert abs(got.gains[d] - ref[m].gains[d]) < 1e-12, (reg, m, d)
            assert got.vent.keys() == ref[m].vent.keys()
            for d in got.vent:
                assert abs(got.vent[d] - ref[m].vent[d]) < 1e-12
    store.close()


def test_confidence_volume_counts_covered_time_not_rows():
    # The 'enough data' bar (7200 rows) assumed 2-min capture. Event-driven capture stores up
    # to a row per 6 s, so one busy day already counted as "full" — 10 days in the docs.
    one_day_dense = _synth(n=14400, noise=0.0)
    for i, s in enumerate(one_day_dense):          # 6-s spacing → 14400 rows = 1 day
        one_day_dense[i] = Sample(i * 6.0, s.metrics, s.outputs)
    from custom_components.sf.ai_climate import FULL_SPAN_S
    m = fit_metric_model(one_day_dense, "temperature", DEVICES, full_span_s=FULL_SPAN_S)
    assert m.n > FULL_SAMPLES
    assert m.confidence <= 0.1 + 1e-9             # 1 of 10 days covered
