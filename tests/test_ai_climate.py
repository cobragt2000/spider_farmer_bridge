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

    Xr, yr = _rows(samples, "temperature", ["heater"], smooth_sec=0.0)
    Xs, ys = _rows(samples, "temperature", ["heater"], smooth_sec=DENOISE_HALF_SEC)
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
    _, y60 = _rows(samples, "temperature", ["blower"], smooth_sec=60.0)
    _, y300 = _rows(samples, "temperature", ["blower"], smooth_sec=300.0)
    assert float(np.var(y60)) > float(np.var(y300))


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
