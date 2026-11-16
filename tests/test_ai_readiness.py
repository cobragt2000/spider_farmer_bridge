"""Control-readiness analyses: step responses, forecast self-test (grouping removed, v3.20.41)."""
import numpy as np

from custom_components.sf.ai_climate import Sample, fit_models
from custom_components.sf.ai_readiness import (
    forecast_selftest, penalised_confidence, step_responses,
)


def _toggle(i, period):
    return 100.0 if (i // period) % 2 else 0.0


def test_step_response_measures_gain_delay_and_settling():
    # Heater on for 30 min every hour; temperature eases toward +2 °F above base with a
    # ~3-minute dead time and a ~5-minute time constant, and back down when off.
    samples, temp, target = [], 70.0, 70.0
    on_since = None
    for i in range(24 * 60):
        heater = 100.0 if (i % 60) < 30 else 0.0
        if heater and on_since is None:
            on_since = i
        if not heater:
            on_since = None
        target = 72.0 if (on_since is not None and i - on_since >= 3) else 70.0
        temp += (target - temp) / 5.0
        samples.append(Sample(i * 60.0, {"temperature": temp}, {"heater": heater}))
    r = step_responses(samples, ["temperature"], ["heater"])["temperature"]["heater"]
    assert r["events"] >= 20
    assert 1.5 < r["change"] < 2.3                 # ≈ +2 °F
    assert r["start_min"] is not None and 2 <= r["start_min"] <= 5   # dead time shows up
    assert r["t63_min"] is not None and r["t63_min"] >= r["start_min"]


def _heater_series(hours, gain_sign_flip_after=None, noise=0.01, seed=1, drift=-0.05, gain=0.001):
    rng = np.random.default_rng(seed)
    samples, temp = [], 75.0
    for i in range(hours * 60):
        heater = _toggle(i, 20)
        g = gain if (gain_sign_flip_after is None or i < gain_sign_flip_after) else -gain
        temp += (drift + g * heater) + rng.normal(0, noise)
        samples.append(Sample(i * 60.0, {"temperature": temp}, {"heater": heater}))
    return samples


def _fit(s, m, d):
    return fit_models(s, m, d)


def test_selftest_passes_when_the_model_forecasts_well():
    res = forecast_selftest(_heater_series(24), ["temperature"], ["heater"], _fit)
    t = res["temperature"]
    assert t["status"] == "passed" and t["skill"] > 0.5 and t["windows"] >= 10


def test_selftest_fails_when_behaviour_changes_and_penalty_halves():
    # The heater's effect reverses for the held-back stretch → forecasts point the wrong way.
    samples = _heater_series(24, gain_sign_flip_after=int(24 * 60 * 0.78), drift=0.0, gain=0.002)
    t = forecast_selftest(samples, ["temperature"], ["heater"], _fit)["temperature"]
    assert t["status"] == "failed" and t["skill"] < 0
    assert penalised_confidence(0.8, t) == 0.4
    assert penalised_confidence(0.8, {"status": "passed"}) == 0.8
    assert penalised_confidence(0.8, {"status": "pending"}) == 0.8


def test_selftest_pending_with_too_little_data():
    t = forecast_selftest(_heater_series(3), ["temperature"], ["heater"], _fit)["temperature"]
    assert t["status"] == "pending" and t["skill"] is None


def test_result_keeps_devices_separate_attaches_forecast_and_caches_slow():
    # Devices are learned SEPARATELY (no grouping, v3.20.41). The result carries no
    # "groups" key; the forecast test and slow-analysis cache still work.
    from custom_components.sf.ai_learn import learn_samples
    samples = []
    temp = 75.0
    for i in range(24 * 60):
        a = _toggle(i, 20)
        b = _toggle(i, 33)
        temp += -0.05 + 0.001 * a + 0.0008 * b
        samples.append(Sample(i * 60.0, {"temperature": temp}, {"a": a, "b": b}))
    res = learn_samples(samples, ["temperature"], ["a", "b"])
    assert "groups" not in res
    assert list(res["models"]["temperature"]["gains"]) == ["a", "b"]   # kept separate
    assert res["models"]["temperature"]["forecast"]["status"] == "passed"
    assert "a" in res["steps"]["temperature"] and "b" in res["steps"]["temperature"]
    slow = res.pop("_slow")
    # Re-using cached slow results: no "_slow" returned, forecast still attached.
    again = learn_samples(samples, ["temperature"], ["a", "b"], slow=slow)
    assert "_slow" not in again and again["models"]["temperature"]["forecast"]["status"] == "passed"
    # A failed test halves the learning %.
    failed = {"steps": {}, "selftest": {"all": {"temperature": {"status": "failed", "skill": -0.3,
                                                                "windows": 20, "horizon_min": 15}}}}
    pen = learn_samples(samples, ["temperature"], ["a", "b"], slow=failed)
    assert abs(pen["models"]["temperature"]["confidence"]
               - res["models"]["temperature"]["confidence"] * 0.5) < 1e-3
