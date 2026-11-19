"""Adaptive climate control — learning orchestration (P0 slice 2b), pure parts.

Covers the HA-free glue: panel entity classification, device effort encoding
(speed / gear / enum), series building, and the learn summary. The recorder
query, Store cache, service and publish are thin HA wrappers and aren't exercised
here. See `_backlog_private/AI_CLIMATE_DESIGN.md`.
"""

import numpy as np

from custom_components.sf.ai_learn import (
    build_panel_series, classify_panel, classify_zone, resolve_panel,
    device_effort_series, learn, learn_samples, roles_for_slot,
    encode_snapshot, _row_ts, SEED_STEP_S, snapshot_changed, CAPTURE_EPS, card_opt,
)
from custom_components.sf.ai_history import build_samples
from custom_components.sf.ai_climate import Sample, FULL_SAMPLES


def test_card_opt_prefers_prod_key_and_falls_back_to_dev():
    # 3.20.37: the production AI card stores ai_<name>; the dev card dev_ai_<name>.
    assert card_opt({"dev_ai_learn_level": "fast"}, "learn_level") == "fast"          # dev only
    assert card_opt({"ai_learn_level": "now", "dev_ai_learn_level": "fast"}, "learn_level") == "now"
    # An empty prod value is an explicit choice (e.g. "" = Live re-fit) and must NOT fall back.
    assert card_opt({"ai_refit_min": "", "dev_ai_refit_min": "5"}, "refit_min") == ""
    assert card_opt({}, "refit_min") is None and card_opt(None, "refit_min") is None


def test_snapshot_changed_event_gate():
    # Event-driven capture stores a row only when something real moved. metrics = the metric
    # keys (epsilon-gated against jitter); every other key is a device channel (any change
    # is an event). v3.20.32.
    metrics = ["temperature", "humidity"]
    base = {"temperature": 80.0, "humidity": 50.0, "heater": 0.0, "blower": 0.0}
    assert snapshot_changed(None, base, metrics) is True              # first sample
    # Sub-epsilon metric jitter → NOT a change (stays sparse when steady).
    jitter = dict(base, temperature=80.0 + CAPTURE_EPS["temperature"] / 2, humidity=50.3)
    assert snapshot_changed(base, jitter, metrics) is False
    # A real swing past the epsilon → change.
    swing = dict(base, temperature=80.0 + CAPTURE_EPS["temperature"] + 0.01)
    assert snapshot_changed(base, swing, metrics) is True
    # Any device transition → change, even with metrics dead flat.
    dev = dict(base, blower=100.0)
    assert snapshot_changed(base, dev, metrics) is True
    # A channel appearing or disappearing → change.
    assert snapshot_changed(base, dict(base, dehumidifier=0.0), metrics) is True
    assert snapshot_changed(base, {"temperature": 80.0, "humidity": 50.0}, metrics) is True
    # Ambient reference is epsilon-gated by its base metric, not treated as a device.
    amb = dict(base, ambient_temperature=23.0)
    assert snapshot_changed(amb, dict(amb, ambient_temperature=23.05), metrics) is False
    assert snapshot_changed(amb, dict(amb, ambient_temperature=25.0), metrics) is True


def test_row_ts_parses_recorder_time_formats():
    from datetime import datetime, timezone
    dt = datetime(2026, 11, 1, 10, 12, 15, tzinfo=timezone.utc)
    assert _row_ts(dt) == dt.timestamp()
    assert _row_ts(1762_000_000.5) == 1762_000_000.5
    # minimal_response compressed rows give an ISO string — the 3.20.2 bug fix.
    iso = "2026-11-01T10:12:15.142799+00:00"
    assert abs(_row_ts(iso) - datetime.fromisoformat(iso).timestamp()) < 1e-6
    assert _row_ts(None) is None
    assert _row_ts("not-a-time") is None

PANEL = "dp1"
P = f"sf_{PANEL}_"


def test_classify_panel_picks_metrics_and_present_devices():
    eids = [
        f"sensor.{P}temperature", f"sensor.{P}humidity", f"sensor.{P}vpd",
        f"sensor.{P}blower_speed",
        f"sensor.{P}fan_speed",                # circulation fan — must be EXCLUDED
        f"sensor.{P}light_1_brightness",       # light = disturbance input, INCLUDED
        f"binary_sensor.{P}heater_active", f"sensor.{P}heater_level",
        f"binary_sensor.{P}dehumidifier_active", f"sensor.{P}dehumidifier_level",
        "sensor.sf_dp2_temperature",          # another panel — must be ignored
        "light.living_room",                  # unrelated
    ]
    c = classify_panel(eids, PANEL)
    assert set(c["metrics"]) == {"temperature", "humidity", "vpd"}
    # Fan is intentionally not a learnable device (circulation only); the grow
    # light is (a disturbance driver). (3.20.4)
    assert set(c["devices"]) == {"blower", "heater", "dehumidifier", "light_1"}
    assert "fan" not in c["devices"]
    assert c["devices"]["blower"]["effort"] == "speed"
    assert c["devices"]["light_1"]["effort"] == "speed"
    assert c["devices"]["heater"]["effort"] == "gear"
    assert c["devices"]["dehumidifier"]["effort"] == "enum"
    # a device missing one of its entities is not classified
    assert "humidifier" not in c["devices"]


def test_classify_includes_env_mode_outlets_only():
    eids = [
        f"sensor.{P}temperature", f"sensor.{P}humidity", f"sensor.{P}blower_speed",
        f"select.{P}outlet_1_mode", f"switch.{P}outlet_1", f"select.{P}outlet_1_temp_device",
        f"select.{P}outlet_2_mode", f"switch.{P}outlet_2",                   # Manual → skip
        f"select.{P}outlet_3_mode", f"switch.{P}outlet_3", f"select.{P}outlet_3_humidity_device",
        f"select.{P}outlet_4_mode", f"switch.{P}outlet_4",                   # Drip → skip
    ]
    state = {
        f"select.{P}outlet_1_mode": "Temperature", f"select.{P}outlet_1_temp_device": "Cooling",
        f"select.{P}outlet_2_mode": "Manual",
        f"select.{P}outlet_3_mode": "Humidity", f"select.{P}outlet_3_humidity_device": "Humidifying",
        f"select.{P}outlet_4_mode": "Drip Irrigation",
    }
    c = classify_panel(eids, PANEL, get_state=state.get)
    assert c["devices"]["outlet_1"]["effort"] == "switch"
    assert c["devices"]["outlet_1"]["mode"] == "Temperature"
    assert c["devices"]["outlet_1"]["dir"] == "Cooling"
    assert c["devices"]["outlet_3"]["dir"] == "Humidifying"
    assert "outlet_2" not in c["devices"] and "outlet_4" not in c["devices"]
    # Without get_state (pure call), outlets are not classified.
    assert "outlet_1" not in classify_panel(eids, PANEL)["devices"]


def test_roles_for_slot_narrows_panel_qualified_map():
    m = {"ac10:outlet_3": "humidifier", "ac10:4": "cooler", "dp1:outlet_1": "heater",
         "bogus": "x", "ac10:outlet_x": "y"}
    assert roles_for_slot(m, "ac10") == {3: "humidifier", 4: "cooler"}
    assert roles_for_slot(m, "dp1") == {1: "heater"}
    assert roles_for_slot(None, "ac10") == {}


def test_classify_role_tagged_manual_outlet_is_learned():
    # A Manual outlet (no env mode) with an assigned role joins the fit from its switch.
    eids = [
        f"sensor.{P}temperature", f"switch.{P}outlet_3", f"select.{P}outlet_3_mode",
        f"switch.{P}outlet_5",                 # no role, no env mode → skip
    ]
    state = {f"select.{P}outlet_3_mode": "Manual"}
    c = classify_panel(eids, PANEL, get_state=state.get, roles={3: "humidifier"})
    assert c["devices"]["outlet_3"]["effort"] == "switch"
    assert c["devices"]["outlet_3"]["role"] == "humidifier"
    assert c["devices"]["outlet_3"]["switch"] == f"switch.{P}outlet_3"
    assert "outlet_5" not in c["devices"]      # unassigned Manual outlet is ignored
    # A bogus role value is ignored.
    assert "outlet_3" not in classify_panel(
        eids, PANEL, get_state=state.get, roles={3: "banana"})["devices"]


def test_env_mode_wins_over_role_tag():
    # If an outlet is BOTH in an env mode and role-tagged, env mode keeps its SF direction.
    eids = [f"sensor.{P}temperature", f"switch.{P}outlet_3",
            f"select.{P}outlet_3_mode", f"select.{P}outlet_3_humidity_device"]
    state = {f"select.{P}outlet_3_mode": "Humidity",
             f"select.{P}outlet_3_humidity_device": "Humidifying"}
    c = classify_panel(eids, PANEL, get_state=state.get, roles={3: "cooler"})
    assert c["devices"]["outlet_3"]["mode"] == "Humidity"
    assert c["devices"]["outlet_3"]["dir"] == "Humidifying"
    assert "role" not in c["devices"]["outlet_3"]


def test_classify_zone_folds_role_tagged_outlet_on_device_panel():
    # The humidifier case: dp1 has the sensor, ac10 outlet 3 is a Manual humidifier.
    eids = [
        "sensor.sf_dp1_temperature", "sensor.sf_dp1_humidity",
        "switch.sf_ac10_outlet_3", "select.sf_ac10_outlet_3_mode",
    ]
    state = {"select.sf_ac10_outlet_3_mode": "Manual"}
    zone = {"id": "tent", "name": "Tent", "sensor_panel": "dp1", "device_panels": ["ac10"]}
    c = classify_zone(eids, zone, get_state=state.get,
                      roles={"ac10:outlet_3": "humidifier"})
    assert "ac10:outlet_3" in c["devices"]
    assert c["devices"]["ac10:outlet_3"]["role"] == "humidifier"
    assert c["meta"]["ac10:outlet_3"]["panel"] == "ac10"


def test_effort_switch_outlet_on_off():
    spec = {"effort": "switch", "switch": f"switch.{P}outlet_1"}
    raw = {f"switch.{P}outlet_1": [(0, "off"), (60, "on"), (300, "off")]}
    assert device_effort_series(spec, raw) == [(0, 0.0), (60, 100.0), (300, 0.0)]


def test_encode_snapshot_switch_outlet():
    classified = {"metrics": {"temperature": f"sensor.{P}temperature"},
                  "devices": {"outlet_1": {"effort": "switch", "switch": f"switch.{P}outlet_1"}}}
    on = encode_snapshot(classified, {f"sensor.{P}temperature": "70", f"switch.{P}outlet_1": "on"}.get)
    off = encode_snapshot(classified, {f"sensor.{P}temperature": "70", f"switch.{P}outlet_1": "off"}.get)
    assert on["outlet_1"] == 100.0 and off["outlet_1"] == 0.0


def test_resolve_panel_zone_absorbed_plain():
    zones = [{"id": "t", "sensor_panel": "dp1", "device_panels": ["ac5", "ac10"]}]
    assert resolve_panel("dp1", zones) == ("zone", zones[0])
    assert resolve_panel("ac5", zones)[0] == "absorbed"
    assert resolve_panel("ac10", zones)[0] == "absorbed"
    assert resolve_panel("dp2", zones) == ("panel", None)
    assert resolve_panel("dp1", [])[0] == "panel"


def test_classify_zone_merges_panels_and_external():
    eids = [
        "sensor.sf_dp1_temperature", "sensor.sf_dp1_humidity", "sensor.sf_dp1_blower_speed",
        "binary_sensor.sf_dp1_heater_active", "sensor.sf_dp1_heater_level",
        "select.sf_ac5_outlet_1_mode", "switch.sf_ac5_outlet_1", "select.sf_ac5_outlet_1_temp_device",
        "switch.big_humidifier",
    ]
    state = {
        "select.sf_ac5_outlet_1_mode": "Temperature", "select.sf_ac5_outlet_1_temp_device": "Cooling",
        "switch.big_humidifier": "on",
    }
    zone = {"id": "tent", "name": "Tent", "sensor_panel": "dp1", "device_panels": ["ac5"],
            "external": [{"entity_id": "switch.big_humidifier", "role": "humidifier"}]}
    c = classify_zone(eids, zone, get_state=state.get)
    assert set(c["metrics"]) == {"temperature", "humidity"}        # sensor panel only
    assert "heater" in c["devices"] and "blower" in c["devices"]   # dp1 → bare keys
    assert "ac5:outlet_1" in c["devices"]                          # other panel → prefixed
    assert c["devices"]["ac5:outlet_1"]["mode"] == "Temperature"
    assert c["devices"]["ext_1"]["switch"] == "switch.big_humidifier"
    assert c["meta"]["ac5:outlet_1"]["panel"] == "ac5"
    assert c["meta"]["ext_1"]["external"] is True and c["meta"]["ext_1"]["role"] == "humidifier"
    # Per-controller device counts for the zone badge (dp1 = blower+heater = 2, ac5 = 1).
    from collections import Counter
    pc = Counter(m["panel"] for m in c["meta"].values() if not m.get("external"))
    ext = sum(1 for m in c["meta"].values() if m.get("external"))
    assert pc["dp1"] == 2 and pc["ac5"] == 1 and ext == 1
    # The merged device set encodes + fits like any other (switch + gear + speed).
    vals = encode_snapshot(c, state.get)
    assert vals["ext_1"] == 100.0 and vals["ac5:outlet_1"] == 0.0   # humidifier on; outlet off (no switch state)


def test_effort_speed_passthrough_and_clamp():
    spec = {"effort": "speed", "speed": f"sensor.{P}blower_speed"}
    raw = {f"sensor.{P}blower_speed": [(0, "0"), (60, "46"), (120, "150"), (180, "x")]}
    assert device_effort_series(spec, raw) == [(0, 0.0), (60, 46.0), (120, 100.0)]


def test_effort_gear_combines_active_and_level():
    spec = {"effort": "gear", "active": f"binary_sensor.{P}heater_active",
            "level": f"sensor.{P}heater_level", "max": 10}
    raw = {
        f"binary_sensor.{P}heater_active": [(0, "off"), (100, "on"), (300, "off")],
        f"sensor.{P}heater_level": [(0, "5")],
    }
    # off→0, on@level5/10→50, off→0
    assert device_effort_series(spec, raw) == [(0, 0.0), (100, 50.0), (300, 0.0)]


def test_effort_enum_dehumidifier():
    spec = {"effort": "enum", "active": f"binary_sensor.{P}dehumidifier_active",
            "level": f"sensor.{P}dehumidifier_level", "map": {"low": 50.0, "high": 100.0}}
    raw = {
        f"binary_sensor.{P}dehumidifier_active": [(0, "on"), (400, "off")],
        f"sensor.{P}dehumidifier_level": [(0, "Low"), (200, "High")],
    }
    assert device_effort_series(spec, raw) == [(0, 50.0), (200, 100.0), (400, 0.0)]


def test_build_panel_series_shapes():
    classified = {
        "metrics": {"humidity": f"sensor.{P}humidity"},
        "devices": {"dehumidifier": {
            "effort": "enum", "active": f"binary_sensor.{P}dehumidifier_active",
            "level": f"sensor.{P}dehumidifier_level", "map": {"low": 50.0, "high": 100.0}}},
    }
    raw = {
        f"sensor.{P}humidity": [(0, "55"), (60, "54")],
        f"binary_sensor.{P}dehumidifier_active": [(0, "on")],
        f"sensor.{P}dehumidifier_level": [(0, "High")],
    }
    ms, os_ = build_panel_series(raw, classified)
    assert ms["humidity"] == [(0, 55.0), (60, 54.0)]
    assert os_["dehumidifier"] == [(0, 100.0)]


def test_learn_summary_from_synthetic_series():
    rng = np.random.default_rng(3)
    drift, gain = -0.03, -0.02
    t, humi, eff = 0.0, 55.0, 0.0
    mser, dser = [], []
    for i in range(FULL_SAMPLES):            # full volume → confidence can clear 50%
        if i % 10 == 0:
            eff = float(rng.choice([0, 50, 100]))
            dser.append((t, eff))
        mser.append((t, humi))
        humi += (drift + gain * eff) + rng.normal(0, 0.01)
        t += 60.0
    out = learn({"humidity": mser}, {"dehumidifier": dser}, step_s=60)
    assert 0.0 <= out["confidence"] <= 100.0
    assert out["confidence"] > 50.0
    assert out["samples"] > 400
    hm = out["models"]["humidity"]
    assert hm["gains"]["dehumidifier"] < 0        # dehumidifier lowers RH
    assert abs(hm["gains"]["dehumidifier"] - gain) < 0.005


# ── durable-store path: snapshot encoding + learn from pre-built Samples ──────

def test_encode_snapshot_reads_live_state():
    classified = {
        "metrics": {"temperature": f"sensor.{P}temperature",
                    "humidity": f"sensor.{P}humidity"},
        "devices": {
            "blower": {"effort": "speed", "speed": f"sensor.{P}blower_speed"},
            "heater": {"effort": "gear", "active": f"binary_sensor.{P}heater_active",
                       "level": f"sensor.{P}heater_level", "max": 10},
            "dehumidifier": {"effort": "enum", "active": f"binary_sensor.{P}dehumidifier_active",
                             "level": f"sensor.{P}dehumidifier_level",
                             "map": {"low": 50.0, "high": 100.0}},
        },
    }
    state = {
        f"sensor.{P}temperature": "72.4", f"sensor.{P}humidity": "55",
        f"sensor.{P}blower_speed": "46",
        f"binary_sensor.{P}heater_active": "on", f"sensor.{P}heater_level": "5",
        f"binary_sensor.{P}dehumidifier_active": "off", f"sensor.{P}dehumidifier_level": "High",
    }
    vals = encode_snapshot(classified, state.get)
    assert vals["temperature"] == 72.4 and vals["humidity"] == 55.0
    assert vals["blower"] == 46.0
    assert vals["heater"] == 50.0           # on, 5/10
    assert vals["dehumidifier"] == 0.0      # off → 0 regardless of level


def test_encode_snapshot_skips_missing_metric():
    classified = {"metrics": {"vpd": f"sensor.{P}vpd"},
                  "devices": {"blower": {"effort": "speed", "speed": f"sensor.{P}blower_speed"}}}
    vals = encode_snapshot(classified, {f"sensor.{P}blower_speed": "10"}.get)
    assert "vpd" not in vals and vals["blower"] == 10.0


def test_learn_samples_matches_series_path():
    # Same synthetic response, but fed as pre-gridded Samples (the store path).
    rng = np.random.default_rng(7)
    drift, gain = -0.03, -0.02
    humi, eff = 55.0, 0.0
    samples = []
    for i in range(FULL_SAMPLES):
        if i % 10 == 0:
            eff = float(rng.choice([0, 50, 100]))
        samples.append(Sample(i * 60.0, {"humidity": humi}, {"dehumidifier": eff}))
        humi += (drift + gain * eff) + rng.normal(0, 0.01)
    out = learn_samples(samples, ["humidity"], ["dehumidifier"])
    assert out["samples"] == FULL_SAMPLES
    assert out["confidence"] > 50.0
    assert abs(out["models"]["humidity"]["gains"]["dehumidifier"] - gain) < 0.005


def test_learn_samples_splits_day_night_when_lights_present():
    rng = np.random.default_rng(11)
    samples = []
    for i in range(400):
        lit = 100.0 if (i % 24) < 12 else 0.0     # 12-on / 12-off photoperiod
        heat = float(rng.choice([0, 100]))
        samples.append(Sample(i * 300.0, {"temperature": 70.0 + rng.normal(0, 0.1)},
                              {"light_1": lit, "heater": heat}))
    out = learn_samples(samples, ["temperature"], ["light_1", "heater"])
    assert "day" in out and "night" in out
    assert out["day"]["samples"] + out["night"]["samples"] == out["samples"]
    assert out["day"]["samples"] > 0 and out["night"]["samples"] > 0
    # No lights → no day/night split (nothing to split on).
    out2 = learn_samples(samples, ["temperature"], ["heater"])
    assert "day" not in out2 and "night" not in out2


def test_seed_gridding_hourly_stats_plus_sparse_gear():
    # Mirrors the backfill: metrics + continuous device come from hourly statistics
    # (dense, long reach); the gear device comes from states and only covers the
    # recent tail. On the hourly seed grid the gear reads 0 before its first reading
    # and its real effort after — so older rows inform drift/continuous only.
    H = 3600.0
    classified = {
        "metrics": {"temperature": f"sensor.{P}temperature"},
        "devices": {
            "blower": {"effort": "speed", "speed": f"sensor.{P}blower_speed"},
            "heater": {"effort": "gear", "active": f"binary_sensor.{P}heater_active",
                       "level": f"sensor.{P}heater_level", "max": 10},
        },
    }
    raw = {
        f"sensor.{P}temperature": [(i * H, 70.0 + i) for i in range(6)],   # 6 h of stats
        f"sensor.{P}blower_speed": [(i * H, 40.0) for i in range(6)],
        # gear only appears in the last 2 hours (states window)
        f"binary_sensor.{P}heater_active": [(4 * H, "on")],
        f"sensor.{P}heater_level": [(4 * H, "5")],
    }
    ms, os_ = build_panel_series(raw, classified)
    t0 = min(s[0][0] for s in ms.values() if s)   # anchor to metrics, like the seed
    samples = build_samples(ms, os_, step_s=SEED_STEP_S, t0=t0)
    assert [s.t for s in samples] == [i * H for i in range(6)]
    assert samples[0].outputs["heater"] == 0.0     # older rows: gear unknown → 0
    assert samples[4].outputs["heater"] == 50.0    # on, 5/10, once states cover it
    assert samples[5].outputs["heater"] == 50.0
    assert all(s.outputs["blower"] == 40.0 for s in samples)


# ── recorder path: incremental history window (v3.20.52) ────────────────

def _recorder_read(rows, start, end, include_start=True):
    """What the recorder returns for get_significant_states(minimal_response=True):
    the state at `start` (stamped `start`) when asked for, then each change in
    (start, end), with consecutive duplicates dropped."""
    out = {}
    for eid, series in rows.items():
        res = []
        if include_start:
            before = [r for r in series if r[0] < start]
            if before:
                res.append((start, before[-1][1]))
        for t, v in series:
            if start < t < end and (not res or res[-1][1] != v):
                res.append((t, v))
        if res:
            out[eid] = res
    return out


def test_merge_history_equals_a_full_read():
    from custom_components.sf.ai_learn import merge_history
    rng = np.random.default_rng(4)
    rows = {
        "sensor.t": [(float(t), f"{20 + rng.integers(0, 4) * 0.1:.1f}") for t in range(0, 20000, 7)],
        "sensor.b": [(float(t), str(int(rng.choice([0, 50])))) for t in range(0, 20000, 900)],
        "binary_sensor.h": [(5.0, "off"), (19990.0, "on")],     # changes only at the edges
        "sensor.late": [(15000.0, "1"), (15500.0, "2")],         # starts inside the window
    }
    days_s = 5000.0
    prev_end = 10000.0
    cached = _recorder_read(rows, prev_end - days_s, prev_end)
    for end in (10015.0, 10600.0, 13333.0, 19995.0):
        # Read only from shortly before the previous read's end (overlap), merge, slide.
        new = _recorder_read(rows, prev_end - 600.0, end, include_start=False)
        cached = merge_history(cached, new, end - days_s)
        assert cached == _recorder_read(rows, end - days_s, end), end
        prev_end = end


async def test_forced_pass_waits_and_never_overlaps(monkeypatch):
    # v3.20.52 fix: force=True bypassed the running-pass guard and the first pass to
    # finish cleared it, so a forced pass (profile save/load, clean) ran alongside a
    # scheduled one and the next tick started a third.
    import asyncio
    import types
    import custom_components.sf.ai_learn as al

    running = peak = 0
    order: list = []

    async def fake_panel(hass, bus, slot, mac, days, store=None, zone=None):
        nonlocal running, peak
        running += 1
        peak = max(peak, running)
        order.append(bus._ai_slow == {} and "forced-data" or "tick")
        await asyncio.sleep(0.05)
        running -= 1

    monkeypatch.setattr(al, "async_learn_panel", fake_panel)
    bus = types.SimpleNamespace(_slot_cache={"aa": "dp1"}, _ai_zones=[], _ai_slow={"x": 1})
    a = asyncio.create_task(al.async_learn_bus(None, bus))               # scheduled tick
    await asyncio.sleep(0.01)
    b = asyncio.create_task(al.async_learn_bus(None, bus, force=True))   # user action
    await asyncio.sleep(0.06)                                            # a done, b running
    c = asyncio.create_task(al.async_learn_bus(None, bus))               # next tick
    await asyncio.gather(a, b, c)
    assert peak == 1
    assert order == ["tick", "forced-data"]       # the forced pass ran, after the tick
    assert bus._ai_learning is False


def test_non_finite_states_count_as_missing():
    # v3.20.52 fix: a level state "nan"/"inf" crashed the capture tick (int(nan)) — and a
    # "nan" reading is no reading. Treat them like "unknown".
    classified = {
        "metrics": {"temperature": f"sensor.{P}temperature", "humidity": f"sensor.{P}humidity"},
        "devices": {
            "blower": {"effort": "speed", "speed": f"sensor.{P}blower_speed"},
            "heater": {"effort": "gear", "active": f"binary_sensor.{P}heater_active",
                       "level": f"sensor.{P}heater_level", "max": 10},
        },
    }
    for bad in ("nan", "inf", "-inf", "NaN"):
        state = {f"sensor.{P}temperature": bad, f"sensor.{P}humidity": "55",
                 f"sensor.{P}blower_speed": bad,
                 f"binary_sensor.{P}heater_active": "on", f"sensor.{P}heater_level": bad}
        vals = encode_snapshot(classified, state.get)
        assert vals == {"humidity": 55.0, "heater": 0.0}, (bad, vals)
    spec = classified["devices"]["heater"]
    raw = {spec["active"]: [(0, "on")], spec["level"]: [(0, "inf"), (60, "5")]}
    assert device_effort_series(spec, raw) == [(0, 0.0), (60, 50.0)]


async def test_closed_store_stops_learning_and_capture_quietly(monkeypatch):
    import types
    import custom_components.sf.ai_learn as al
    from custom_components.sf.ai_store import AiStore
    store = AiStore(":memory:")
    store.close()
    called = []

    async def fake_panel(*a, **k):
        called.append(1)

    monkeypatch.setattr(al, "async_learn_panel", fake_panel)
    bus = types.SimpleNamespace(_slot_cache={"aa": "dp1"}, _ai_zones=[])
    await al.async_learn_bus(None, bus, store=store)
    assert called == []
