"""Adaptive climate control — history→samples pipeline (P0, pure). No HA.

Checks forward-fill alignment, device-output encoding, and that the whole pure
pipeline (irregular recorder-style history → samples → fitter) recovers a known
gain. See `_backlog_private/AI_CLIMATE_DESIGN.md`.
"""

import numpy as np

from custom_components.sf.ai_climate import fit_metric_model, FULL_SAMPLES
from custom_components.sf.ai_history import (
    build_samples, gear_effort, speed_effort,
)


def test_speed_effort_clamps():
    assert speed_effort(None) == 0.0
    assert speed_effort(46.0) == 46.0
    assert speed_effort(140.0) == 100.0
    assert speed_effort(-5.0) == 0.0


def test_gear_effort_maps_levels():
    assert gear_effort(False, 2, 2) == 0.0          # off → 0 regardless of gear
    assert gear_effort(True, 1, 2) == 50.0          # Low/High
    assert gear_effort(True, 2, 2) == 100.0
    assert gear_effort(True, 1, 4) == 25.0          # 1..4
    assert gear_effort(True, 3, 4) == 75.0
    assert gear_effort(True, 9, 4) == 100.0         # clamps to max


def test_forward_fill_alignment():
    # metric recorded every 60 s; device output only when it changes (at t=90).
    metric_series = {"m": [(0, 10.0), (60, 11.0), (120, 12.0), (180, 13.0)]}
    output_series = {"d": [(0, 0.0), (90, 50.0)]}
    s = build_samples(metric_series, output_series, step_s=60)
    assert [x.t for x in s] == [0, 60, 120, 180]
    assert [x.metrics["m"] for x in s] == [10.0, 11.0, 12.0, 13.0]
    # d holds 0 through t=60, then forward-fills 50 from t=90 onward.
    assert [x.outputs["d"] for x in s] == [0.0, 0.0, 50.0, 50.0]


def test_grid_starts_when_all_series_present_and_missing_metric_omitted():
    # metric doesn't start until t=120; grid shouldn't begin before then.
    metric_series = {"m": [(120, 5.0), (180, 6.0)]}
    output_series = {"d": [(0, 10.0)]}
    s = build_samples(metric_series, output_series, step_s=60)
    assert [x.t for x in s] == [120.0, 180.0]
    assert s[0].metrics["m"] == 5.0 and s[0].outputs["d"] == 10.0
    # a metric gap (None) is dropped from that sample (not treated as 0); the
    # sample still survives as long as another metric is present.
    gap = build_samples(
        {"a": [(0, 1.0), (60, None), (120, 3.0)], "b": [(0, 9.0), (60, 9.0), (120, 9.0)]},
        {}, step_s=60)
    assert "a" not in gap[1].metrics and gap[1].metrics["b"] == 9.0
    assert gap[2].metrics["a"] == 3.0


def test_t0_anchors_grid_despite_late_output_series():
    # Regression (3.20.15): the fine recent-window rebuild must anchor to the metrics,
    # not every series — else a gear device whose first state is recent truncates the
    # grid to near-nothing. A metric spanning 0..600 with a device that only reports
    # late (at 540) must still grid across the whole window when t0 is given.
    metric = {"m": [(float(t), 10.0) for t in range(0, 601, 60)]}
    outputs = {"d": [(540.0, 50.0)]}
    truncated = build_samples(metric, outputs, step_s=60)          # no t0 → starts at 540
    assert truncated[0].t == 540.0 and len(truncated) == 2
    full = build_samples(metric, outputs, step_s=60, t0=0.0)       # anchored → full window
    assert full[0].t == 0.0 and len(full) == 11
    assert full[0].outputs["d"] == 0.0 and full[-1].outputs["d"] == 50.0


def test_empty_history_is_no_samples():
    assert build_samples({}, {}) == []
    assert build_samples({"m": []}, {"d": []}) == []


def test_end_to_end_recovers_gain_from_irregular_history():
    # Dehumidifier effort is piecewise-constant (changes every 10 min, recorded
    # only on change); humidity is recorded each minute and responds to it.
    rng = np.random.default_rng(2)
    drift, gain = -0.03, -0.02
    t, humi, eff = 0.0, 55.0, 0.0
    mser, dser = [], []
    for i in range(FULL_SAMPLES):            # full volume → confidence clears the bar
        if i % 10 == 0:
            eff = float(rng.choice([0, 50, 100]))
            dser.append((t, eff))
        mser.append((t, humi))
        humi += (drift + gain * eff) + rng.normal(0, 0.01)
        t += 60.0
    samples = build_samples({"humidity": mser}, {"dehumidifier": dser}, step_s=60)
    m = fit_metric_model(samples, "humidity", ["dehumidifier"])
    assert abs(m.gains["dehumidifier"] - gain) < 0.005
    assert abs(m.drift - drift) < 0.02
    assert m.confidence > 0.7
