"""Adaptive climate control — learning orchestration + HA glue (P0 slice 2b).

Ties the pure learning core (`ai_climate`) and the history pipeline (`ai_history`)
to Home Assistant for a single panel:

  classify a panel's entities  →  fetch recorder history  →  encode device effort
  →  build samples  →  fit models  →  cache + publish a 0..100 confidence.

**Observe-only (P0): nothing here actuates a device.** The publish lights up a
`sensor.sf_<panel>_ai_confidence` diagnostic (0..100 %, model summary in its
attributes) — the first look at what the learner knows, and the seed for the AI
Stats card.

The classification + encoding + learning are PURE (plain dicts of entity_id →
series), so they unit-test without HA. The recorder query, Store cache, service
and publish are the thin HA wrappers at the bottom.
"""

from __future__ import annotations

import bisect
from dataclasses import replace
from typing import Mapping, Optional, Sequence

import re

from .ai_climate import (
    DENOISE_FRAMES, DENOISE_HALF_SEC, FULL_SAMPLES,
    fit_models, overall_confidence, split_day_night,
)
from .ai_history import build_samples, gear_effort, speed_effort
from .ai_readiness import (
    forecast_selftest, penalised_confidence, step_responses,
)

# Metrics the learner tracks (entity suffix == metric name). VPD included so it
# can learn humidity/temp trade-offs later.
METRICS = ("temperature", "humidity", "vpd")

# Per-device effort source. "speed" = a continuous 0..100 % sensor; "gear"/"enum"
# = a running flag (<dev>_active) gated with a level/enum sensor. Suffixes are the
# entity-id suffix after sf_<panel>_.
#
# Inputs fall in two groups (both are regressors in the fit; the split matters for
# CONTROL later, not for learning):
#   - ACTUATORS the climate loop can drive: blower (exhaust), heater, humidifier,
#     dehumidifier.
#   - DISTURBANCES we only observe: the grow LIGHTS (their photoperiod is the tent's
#     biggest heat source — including them stops the model blaming device schedules
#     that merely correlate with day/night). A future controller treats these as
#     feed-forward inputs, NOT levers (never dim the lights to cool the tent).
# The internal CIRCULATION FAN is deliberately excluded: it just moves air around
# inside the tent, so it has no real effect on temp/humidity — but its schedule
# correlated with the light cycle and the OLS handed it a large SPURIOUS gain
# (confirmed on live data, 3.20.4), corrupting the model. (John, 2026-11-11)
DEVICE_SPECS: dict[str, dict] = {
    "blower":       {"effort": "speed", "speed": "blower_speed"},
    "heater":       {"effort": "gear",  "active": "heater_active",       "level": "heater_level",       "max": 10},
    "humidifier":   {"effort": "gear",  "active": "humidifier_active",   "level": "humidifier_level",   "max": 4},
    "dehumidifier": {"effort": "enum",  "active": "dehumidifier_active", "level": "dehumidifier_level",
                     "map": {"low": 50.0, "high": 100.0}},
    # Disturbance inputs (observed, not actuated): grow-light brightness %.
    "light_1":      {"effort": "speed", "speed": "light_1_brightness"},
    "light_2":      {"effort": "speed", "speed": "light_2_brightness"},
}

Series = Sequence[tuple[float, object]]        # [(epoch, raw_state), ...] asc by t

# Plug-outlet support (v3.20.9). An AC5/AC10 is a full controller (same sensors +
# built-in accessories as a DP) PLUS plug outlets. A device plugged into an outlet
# and set to an ENVIRONMENT mode is a real climate actuator, so it joins the fit as
# an on/off (0/100) regressor — same path as the gear devices (binary, no long-term
# stats: states backfill + durable-store capture going forward). Only these modes
# count as climate (irrigation/timers/manual/"Light Env" are skipped). The outlet's
# Device Type select gives the direction, kept as a label for the card. (John,
# 2026-11-11: "an AC has the same functionality as a dp … just with plug outlets.")
OUTLET_MAX = 10
OUTLET_ENV_MODES = {"Temperature", "Humidity", "CO2"}
# Per-mode "Device Type" select suffix → the direction label it carries.
OUTLET_DIR_SUFFIX = {
    "Temperature": "temp_device", "Humidity": "humidity_device", "CO2": "co2_device",
}
# Role-tagged Manual outlets (v3.20.23). A grouped rig runs its climate on AC plug
# strips that have NO local temp/humidity sensor, so SF's environment modes won't hold
# there — the user drives the outlet from an HA automation in MANUAL. An outlet the
# user has assigned a learning ROLE (card_option dev_ai_outlet_roles) joins the fit as
# an on/off (0/100) regressor from its switch, exactly like an env-mode outlet, but
# keyed by the role instead of SF's mode. Roles are the external-device roles minus
# "fan"/"other" (John, 2026-11-12). Values are stored lowercase; the card capitalizes.
OUTLET_ROLES = ("humidifier", "heater", "dehumidifier", "cooler", "light")


# ── pure: classification ─────────────────────────────────────────────────────

def roles_for_slot(roles: Optional[Mapping[str, str]], panel: str) -> dict:
    """Narrow a panel-qualified outlet-role map ({"ac10:outlet_3": "humidifier"} or
    {"ac10:3": ...}) to {outlet_index: role} for one panel. Keys for other panels and
    malformed entries are dropped."""
    out: dict[int, str] = {}
    for k, v in (roles or {}).items():
        pnl, _, tail = str(k).partition(":")
        if pnl != panel:
            continue
        tail = tail.replace("outlet_", "").strip()
        if tail.isdigit():
            out[int(tail)] = v
    return out


def classify_panel(entity_ids: Sequence[str], panel: str, get_state=None,
                   roles: Optional[Mapping[int, str]] = None) -> dict:
    """From the full entity-id list, pick this panel's metric sensors and the
    device-effort sources that are actually present. Returns
    {"metrics": {name: eid}, "devices": {name: {spec..., resolved eids}}}.

    `get_state(entity_id)->raw str|None` (optional) enables plug-outlet detection:
    outlets currently in an environment mode (Temperature/Humidity/CO2) are added as
    on/off actuators. Without it (pure tests that don't exercise outlets), only the
    built-in accessories are classified.

    `roles` (optional) maps an outlet index (1-based) → a learning role for THIS panel
    (card_option dev_ai_outlet_roles). A role-tagged outlet that is NOT in an env mode
    (e.g. a Manual outlet the user drives from an automation, on an AC strip with no
    local sensor) still joins the fit as an on/off actuator, keyed by its role. An
    env-mode outlet takes precedence (it's already added with its SF direction)."""
    present = set(entity_ids)
    pfx = f"sf_{panel}_"

    def sensor(suffix: str) -> Optional[str]:
        eid = f"sensor.{pfx}{suffix}"
        return eid if eid in present else None

    def binary(suffix: str) -> Optional[str]:
        eid = f"binary_sensor.{pfx}{suffix}"
        return eid if eid in present else None

    metrics = {m: sensor(m) for m in METRICS}
    metrics = {m: e for m, e in metrics.items() if e}

    devices: dict[str, dict] = {}
    for name, spec in DEVICE_SPECS.items():
        if spec["effort"] == "speed":
            e = sensor(spec["speed"])
            if e:
                devices[name] = {"effort": "speed", "speed": e}
        else:
            active = binary(spec["active"])
            level = sensor(spec["level"])
            if active and level:
                d = {"effort": spec["effort"], "active": active, "level": level}
                if spec["effort"] == "gear":
                    d["max"] = spec["max"]
                else:
                    d["map"] = spec["map"]
                devices[name] = d

    # Plug outlets → on/off actuators. An outlet qualifies two ways:
    #   1. it's in an SF environment mode (Temperature/Humidity/CO2), OR
    #   2. the user assigned it a learning role (dev_ai_outlet_roles) — covers Manual
    #      outlets on sensorless AC strips driven by an HA automation.
    # Env mode wins when both apply (keeps the SF direction label).
    role_map = {int(k): str(v).strip().lower()
                for k, v in (roles or {}).items()
                if str(v).strip().lower() in OUTLET_ROLES}
    if get_state is not None:
        for n in range(1, OUTLET_MAX + 1):
            sw_eid = f"switch.{pfx}outlet_{n}"
            if sw_eid not in present:
                continue
            mode_eid = f"select.{pfx}outlet_{n}_mode"
            mode = str(get_state(mode_eid) or "").strip() if mode_eid in present else ""
            if mode in OUTLET_ENV_MODES:
                dir_eid = f"select.{pfx}outlet_{n}_{OUTLET_DIR_SUFFIX[mode]}"
                direction = str(get_state(dir_eid) or "").strip() if dir_eid in present else ""
                devices[f"outlet_{n}"] = {
                    "effort": "switch", "switch": sw_eid, "mode": mode, "dir": direction,
                }
            elif n in role_map:
                # Role-tagged (Manual or otherwise) — learned from its on/off switch.
                devices[f"outlet_{n}"] = {
                    "effort": "switch", "switch": sw_eid, "mode": mode or "Manual",
                    "role": role_map[n],
                }
    return {"metrics": metrics, "devices": devices}


def classify_zone(entity_ids: Sequence[str], zone: dict, get_state=None,
                  roles: Optional[Mapping[str, str]] = None) -> dict:
    """A ZONE = one sensor controller + devices gathered from additional controllers
    + external HA entities, learned jointly. Returns the same shape as classify_panel
    ({"metrics", "devices"}) plus "meta" (per-device labels) so the card can show e.g.
    "AC5 · Outlet 3" or "Big Humidifier (external)".

    Metrics come ONLY from the zone's sensor controller. Devices from the other
    controllers are key-prefixed with their slot (ac5:heater) to stay unique; external
    HA entities become on/off actuators keyed ext_<n>.

    `roles` maps a panel-qualified outlet key ("ac10:outlet_3" or "ac10:3") → a learning
    role, used to fold in Manual, role-tagged outlets. Split per panel for classify_panel."""
    sensor_panel = zone.get("sensor_panel", "")
    base = classify_panel(entity_ids, sensor_panel, get_state=get_state,
                          roles=roles_for_slot(roles, sensor_panel))
    metrics = base["metrics"]
    devices: dict[str, dict] = dict(base["devices"])        # sensor-panel devices: bare keys
    meta: dict[str, dict] = {
        name: {"panel": sensor_panel, "base": name}
        for name in base["devices"]
    }

    for p in zone.get("device_panels", []):
        if not p or p == sensor_panel:
            continue
        pc = classify_panel(entity_ids, p, get_state=get_state, roles=roles_for_slot(roles, p))
        for name, spec in pc["devices"].items():
            key = f"{p}:{name}"
            devices[key] = spec
            meta[key] = {"panel": p, "base": name}

    present = set(entity_ids)
    for i, ext in enumerate(zone.get("external", []) or [], start=1):
        eid = (ext or {}).get("entity_id")
        if not eid or eid not in present:
            continue
        key = f"ext_{i}"
        # On/off actuator (reads the entity's state). Dimmable % is a later enhancement.
        devices[key] = {"effort": "switch", "switch": eid, "external": True,
                        "role": ext.get("role", "other")}
        meta[key] = {"external": True, "role": ext.get("role", "other"), "entity_id": eid}

    return {"metrics": metrics, "devices": devices, "meta": meta}


# ── pure: effort encoding from raw history ───────────────────────────────────

def _ffill(series: Series, t: float):
    if not series:
        return None
    times = [p[0] for p in series]
    i = bisect.bisect_right(times, t) - 1
    return series[i][1] if i >= 0 else None


def _num(v) -> Optional[float]:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _row_ts(when) -> Optional[float]:
    """Epoch seconds from a recorder row's time, which — depending on HA version +
    minimal_response — can be a datetime, a float/int epoch, or an ISO-8601 string
    (e.g. '2026-11-01T10:12:15.142799+00:00'). Returns None if unparseable."""
    if when is None:
        return None
    if hasattr(when, "timestamp"):          # datetime
        return when.timestamp()
    if isinstance(when, (int, float)):
        return float(when)
    from datetime import datetime
    try:
        return datetime.fromisoformat(str(when)).timestamp()
    except ValueError:
        return None


def device_effort_series(spec: dict, raw: Mapping[str, Series]) -> list[tuple[float, float]]:
    """Collapse a device's raw entity history into one 0..100 effort series."""
    if spec["effort"] == "speed":
        out = []
        for t, v in raw.get(spec["speed"], []):
            n = _num(v)
            if n is not None:
                out.append((t, speed_effort(n)))
        return _dedupe(out)

    if spec["effort"] == "switch":          # plug outlet: on → 100, else 0
        out = []
        for t, v in raw.get(spec["switch"], []):
            out.append((t, 100.0 if str(v).lower() == "on" else 0.0))
        return _dedupe(out)

    active_s = raw.get(spec["active"], [])
    level_s = raw.get(spec["level"], [])
    times = sorted({t for t, _ in active_s} | {t for t, _ in level_s})
    out = []
    for t in times:
        on = str(_ffill(active_s, t)).lower() == "on"
        lvl = _ffill(level_s, t)
        if spec["effort"] == "gear":
            n = _num(lvl)
            eff = gear_effort(on, int(n), spec["max"]) if n is not None else 0.0
        else:   # enum
            eff = spec["map"].get(str(lvl).lower(), 0.0) if on else 0.0
        out.append((t, eff))
    return _dedupe(out)


def _dedupe(series: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """Drop consecutive identical values (they add nothing to forward-fill)."""
    out: list[tuple[float, float]] = []
    for t, v in series:
        if not out or out[-1][1] != v:
            out.append((t, v))
    return out


def build_panel_series(raw_history: Mapping[str, Series], classified: dict):
    """Turn raw per-entity history into the (metric_series, output_series) that
    `build_samples` consumes: metrics as numeric series, each device as its
    encoded effort series."""
    metric_series: dict[str, list[tuple[float, Optional[float]]]] = {}
    for name, eid in classified["metrics"].items():
        metric_series[name] = [(t, _num(v)) for t, v in raw_history.get(eid, [])]
    output_series = {
        name: device_effort_series(spec, raw_history)
        for name, spec in classified["devices"].items()
    }
    return metric_series, output_series


# ── pure: learn + summary ────────────────────────────────────────────────────

def _summarize(models, nsamples: int) -> dict:
    """Shared result shape for both the series path and the store path."""
    summary = {
        m: {
            "drift": round(md.drift, 5),
            "gains": {d: round(g, 5) for d, g in md.gains.items()},
            # Ventilation gains (device -> Δmetric/min per output-% per intake-gap unit),
            # present only where an intake reference let the term be identified.
            "vent": {d: round(g, 6) for d, g in (md.vent or {}).items()},
            "n": md.n, "r2": md.r2, "confidence": md.confidence,
        }
        for m, md in models.items()
    }
    return {
        "confidence": overall_confidence(models),
        "models": summary,
        "samples": nsamples,
    }


def _light_keys(devices) -> list:
    """Device keys that are grow lights (light_1/light_2, possibly panel-prefixed in
    a zone). Used to split samples into day (lights on) vs night."""
    return [d for d in devices if re.search(r"(^|:)light_\d", str(d))]


def _result(samples, metrics, devices, full_samples=FULL_SAMPLES,
            denoise_sec=DENOISE_HALF_SEC, slow=None) -> dict:
    """Fit the COMBINED model (all samples) plus separate DAY and NIGHT models when
    grow lights are present — day and night are different regimes, so learning them
    apart keeps night data from biasing the daytime response (and vice-versa).
    `full_samples` = the confidence 'enough data' bar, set by the learning-speed window.
    `denoise_sec` = the cadence-scaled smoothing half-window for noise-limited metrics.

    Control-readiness (v3.20.39, see ai_readiness):
      - `slow` carries the step responses + forecast self-test from a recent pass; when None
        they are computed now and returned under "_slow" for the caller to cache. A FAILED
        self-test halves that model's learning %."""
    metrics = list(metrics)
    devices = list(devices)
    lights = _light_keys(devices)                 # day/night split uses the light keys
    regimes = {"all": (samples, full_samples)}
    if lights:
        day, night = split_day_night(samples, lights)
        # Day/night each see about half the window, so their 'enough' bar is halved too.
        half = max(1.0, full_samples / 2.0)
        regimes["day"] = (day, half)
        regimes["night"] = (night, half)
    fresh = slow is None
    if fresh:
        slow = {"steps": step_responses(samples, metrics, devices), "selftest": {}}
        for reg, (rs, fs) in regimes.items():
            slow["selftest"][reg] = forecast_selftest(
                rs, metrics, devices,
                lambda s, m, d, fs=fs: fit_models(s, m, d, fs, denoise_sec))
    out: dict = {}
    for reg, (rs, fs) in regimes.items():
        tests = (slow.get("selftest") or {}).get(reg) or {}
        models = {m: replace(md, confidence=penalised_confidence(md.confidence, tests.get(m)))
                  for m, md in fit_models(rs, metrics, devices, fs, denoise_sec).items()}
        summ = _summarize(models, len(rs))
        for m, t in tests.items():
            if m in summ["models"]:
                summ["models"][m]["forecast"] = t
        if reg == "all":
            out = summ
        else:
            out[reg] = summ
    out["steps"] = slow.get("steps") or {}
    if fresh:
        out["_slow"] = slow
    return out


def learn(metric_series, output_series, *, step_s: float = 120.0, slow=None) -> dict:
    """Fit all metric models from raw series (recorder path), with day/night split.
    Returns {confidence, models, samples, [day], [night], steps}."""
    samples = build_samples(metric_series, output_series, step_s=step_s)
    return _result(samples, list(metric_series.keys()), list(output_series.keys()), slow=slow)


def learn_samples(samples, metrics, devices, full_samples=FULL_SAMPLES,
                  denoise_sec=DENOISE_HALF_SEC, slow=None) -> dict:
    """Fit from pre-built Samples (the durable-store path), with day/night split."""
    return _result(samples, metrics, devices, full_samples, denoise_sec, slow)


# ── pure: live snapshot encoding (for the durable capture tick) ───────────────

def encode_snapshot(classified: dict, get_state) -> dict:
    """Current encoded values for one panel: {metric: value, device: 0..100 effort}.
    `get_state(entity_id)` returns the raw state string (or None). Pure — the HA
    `hass.states.get` lookup is injected, so this unit-tests without HA."""
    vals: dict[str, float] = {}
    for name, eid in classified["metrics"].items():
        n = _num(get_state(eid))
        if n is not None:
            vals[name] = n
    for name, spec in classified["devices"].items():
        if spec["effort"] == "speed":
            n = _num(get_state(spec["speed"]))
            if n is not None:
                vals[name] = speed_effort(n)
        elif spec["effort"] == "switch":
            vals[name] = 100.0 if str(get_state(spec["switch"])).lower() == "on" else 0.0
        else:
            on = str(get_state(spec["active"])).lower() == "on"
            lvl = get_state(spec["level"])
            if spec["effort"] == "gear":
                n = _num(lvl)
                vals[name] = gear_effort(on, int(n), spec["max"]) if n is not None else 0.0
            else:   # enum
                vals[name] = spec["map"].get(str(lvl).lower(), 0.0) if on else 0.0
    return vals


# ── HA glue (thin; imports kept local so the pure core tests without HA) ──────

STORE_VERSION = 1
BACKFILL_DAYS = 10          # states-history reach (the recorder's purge window)
CAPTURE_STEP_S = 120.0      # recorder-path synthetic step (dormant backfill only)
# Event-driven capture (v3.20.32). We poll fast but only STORE a snapshot when something
# actually changed — so the store runs at the hardware frame rate during a swing and goes
# sparse when the tent is steady, with no user cadence knob. Measured on live data: the SF
# controller pushes one live frame ≈ every 6 s (CAPTURE_FRAME_S) and that is the real
# resolution floor; the Govee intake sensor is a touch faster. Polling at 5 s oversamples
# that frame slightly so no distinct frame is missed; change-dedup drops the duplicates.
CAPTURE_POLL_S = 5.0        # how often we LOOK (cheap in-memory compare; writes only on change)
CAPTURE_FRAME_S = 6.0       # measured SF live-frame cadence — the capture resolution floor
CAPTURE_IDLE_S = 300.0      # force a snapshot at least this often even when nothing moved
CAPTURE_EFFECTIVE_S = 60.0  # nominal avg sample spacing (active+idle) for the confidence bar
# A metric counts as "moved" (worth storing) only past these absolute deltas — above the
# per-frame sensor jitter, so a genuinely steady tent stays sparse. A real swing blows past
# them. Any DEVICE on/off/level change always stores (that transition is the key event).
CAPTURE_EPS = {"temperature": 0.15, "humidity": 0.6, "vpd": 0.04}
CAPTURE_EPS_DEFAULT = 0.1
# Step responses + the forecast self-test are heavier than a fit, so the live loop reuses
# them for this long before recomputing (a user action — clean, profile load — forces it).
SLOW_ANALYSIS_EVERY_S = 600.0
DENSE_MAX_S = 600.0         # max gap still counted as "dense" forward/fine data (vs hourly stats)
# Long-term statistics backfill. HA keeps hourly min/mean/max for numeric
# `measurement` sensors far longer than states history (months/years), so the seed
# pulls these to start the store with weeks of history instead of ~10 days. Only the
# metrics + continuous devices (blower/fan/lights) have statistics; the gear devices
# (heater/humidifier/dehumidifier on-off + level) are binary/enum and have NONE, so
# they're seeded from states history (10 days) and accrue full-res going forward.
STATS_BACKFILL_DAYS = 400   # grab everything available; HA returns only what exists
SEED_STEP_S = 3600.0        # seed grid = hourly (matches the statistics period)


def _store(hass, panel: str):
    from homeassistant.helpers.storage import Store
    return Store(hass, STORE_VERSION, f"sf_ai_model_{panel}")


# ── durable SF data store: capture, one-shot seed, purge ──────────────────────
#
# Opt-in (CONF_AI_STORE). When on, the integration keeps its OWN SQLite time-series
# of each panel's metrics + device efforts, independent of the recorder's purge, and
# the learner trains from it instead of the recorder. All DB I/O here is sync, so
# every caller wraps it in hass.async_add_executor_job (loop-safety — see CLAUDE.md).

def card_opt(co, name: str):
    """One AI-card setting from a panel's card_options. The production AI card stores
    `ai_<name>`; the dev card stores `dev_ai_<name>`. The production key wins whenever it
    is present — even an empty value, which is an explicit choice (e.g. "" = Live re-fit) —
    otherwise fall back to the dev key so settings made on the dev card keep working."""
    if not co:
        return None
    key = "ai_" + name
    if key in co:
        return co.get(key)
    return co.get("dev_ai_" + name)


def read_outlet_roles(hass, sensor_slot: str) -> dict:
    """Per-outlet learning roles the user assigned on the AI card, stored server-side as
    card_option `ai_outlet_roles` (dev card: `dev_ai_outlet_roles`) on the (sensor) panel's alarm_settings. Keys are
    panel-qualified ("ac10:outlet_3"); value is a role (humidifier/heater/…). Tolerates a
    JSON string (the card writes it stringified) or a dict. Empty when unset."""
    import json
    st = hass.states.get(f"sensor.sf_{sensor_slot}_alarm_settings")
    co = (st.attributes.get("card_options") if st else None) or {}
    raw = card_opt(co, "outlet_roles")
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except (ValueError, TypeError):
            raw = {}
    return raw if isinstance(raw, dict) else {}


def snapshot_changed(prev: Optional[dict], vals: dict, metrics) -> bool:
    """Should this live snapshot be STORED, versus the previous stored one for the panel?
    The core of event-driven capture: we store only when something real happened —
      • any DEVICE channel changed (an on/off/level transition — the key learning event), or
      • any METRIC (or ambient reference) moved past its jitter epsilon (a real swing).
    Per-frame sensor jitter below the epsilon is treated as "no change", so a genuinely
    steady tent produces no rows (the idle floor in async_capture_bus still forces an
    occasional anchor). prev=None (first sample) always stores."""
    if not prev:
        return True
    mset = set(metrics)
    for k, v in vals.items():
        pv = prev.get(k)
        if pv is None:
            return True                        # a channel appeared
        base = k[len("ambient_"):] if k.startswith("ambient_") else k
        if k in mset or k.startswith("ambient_"):
            eps = CAPTURE_EPS.get(base, CAPTURE_EPS_DEFAULT)
            try:
                if abs(float(v) - float(pv)) >= eps:
                    return True
            except (TypeError, ValueError):
                if v != pv:
                    return True
        elif v != pv:                          # device channel — any change is an event
            return True
    for k in prev:                             # a channel disappeared
        if k not in vals:
            return True
    return False


def read_learn_window(hass, sensor_slot: str) -> float:
    """Learning-speed level → fit WINDOW in days (0 = all data). Set on the AI card
    (card_option ai_learn_level / dev_ai_learn_level). Slow uses everything (most stable); the faster levels
    fit only recent data so the model re-learns quickly after a tent change (add/remove a
    device). Read like the re-fit cadence, from the panel's alarm_settings.
      now = 1 day, fast = 3, medium = 7, slow = all."""
    st = hass.states.get(f"sensor.sf_{sensor_slot}_alarm_settings")
    co = (st.attributes.get("card_options") if st else None) or {}
    level = str(card_opt(co, "learn_level") or "slow").strip().lower()
    return {"now": 1.0, "fast": 3.0, "medium": 7.0, "slow": 0.0}.get(level, 0.0)


def read_ambient(hass, sensor_slot: str) -> tuple[str, str]:
    """Optional intake-air (lung-room / outside) reference entity ids the user set on the
    AI card (ai_ambient_temp / ai_ambient_humidity; dev card: dev_ai_*). Returns ("","") when unset.
    Captured into the store as ambient_temperature / ambient_humidity so a later backend
    (ventilation term) has intake history aligned with the tent samples."""
    st = hass.states.get(f"sensor.sf_{sensor_slot}_alarm_settings")
    co = (st.attributes.get("card_options") if st else None) or {}
    return (str(card_opt(co, "ambient_temp") or ""),
            str(card_opt(co, "ambient_humidity") or ""))


async def async_capture_bus(hass, bus, store) -> None:
    """Append live snapshots to the durable store — EVENT-DRIVEN. Called on a fast poll
    (CAPTURE_POLL_S) but stores a panel's snapshot only when snapshot_changed() says
    something real moved, or the idle floor (CAPTURE_IDLE_S) has elapsed since its last
    row. So the store runs at the hardware frame rate through a swing and goes sparse when
    the tent is steady — no user cadence knob. Cheap: reads current states + compares on
    the loop; only changed panels hit the DB (single executor write)."""
    import logging
    log = logging.getLogger(__name__)
    entity_ids = list(hass.states.async_entity_ids())
    last_vals = getattr(bus, "_ai_last_vals", None)
    if last_vals is None:
        last_vals = bus._ai_last_vals = {}
    last_write = getattr(bus, "_ai_last_write", None)
    if last_write is None:
        last_write = bus._ai_last_write = {}

    def _get(eid):
        st = hass.states.get(eid)
        return st.state if st is not None else None

    from homeassistant.util import dt as dt_util
    now = dt_util.utcnow().timestamp()
    zones = getattr(bus, "_ai_zones", []) or []
    rows: list[tuple[str, dict]] = []
    for mac, slot in dict(getattr(bus, "_slot_cache", {})).items():
        kind, z = resolve_panel(slot, zones)
        if kind == "absorbed":
            continue        # its devices are captured under the zone's sensor panel
        _roles = read_outlet_roles(hass, slot)
        classified = (classify_zone(entity_ids, z, get_state=_get, roles=_roles)
                      if kind == "zone"
                      else classify_panel(entity_ids, slot, get_state=_get,
                                          roles=roles_for_slot(_roles, slot)))
        if not classified["metrics"] or not classified["devices"]:
            continue
        vals = encode_snapshot(classified, _get)
        if any(m in vals for m in classified["metrics"]):
            # Capture the optional intake-air reference alongside the tent sample (keys
            # ambient_*). Not a metric/device today — it just accumulates aligned history
            # for the future ventilation term; current learning ignores it.
            at, ah = read_ambient(hass, slot)
            for key, eid in (("ambient_temperature", at), ("ambient_humidity", ah)):
                if eid:
                    av = _num(_get(eid))
                    if av is not None:
                        vals[key] = av
            # Event-driven gate: store only on a real change, or once the idle floor lapses.
            idle_due = (now - last_write.get(slot, 0.0)) >= CAPTURE_IDLE_S
            if not (idle_due or snapshot_changed(last_vals.get(slot), vals,
                                                 classified["metrics"])):
                continue
            rows.append((slot, vals))   # store key = the (sensor) panel's slot
            last_vals[slot] = vals
            last_write[slot] = now
    if not rows:
        return

    def _write():
        for slot, vals in rows:
            store.append(slot, now, vals)

    try:
        await hass.async_add_executor_job(_write)
    except Exception:  # noqa: BLE001 — capture is best-effort
        log.exception("sf ai_store: capture write failed")


async def async_backfill_panel(hass, bus, store, panel: str, days: float = BACKFILL_DAYS,
                               zone: Optional[dict] = None, include_stats: bool = False) -> int:
    """Sync a panel's store with Home Assistant history.

      - RECENT window (last ~`days`): the recorder's FINE states history (dense — this is
        where the detailed data lives, with FULL device on/off state). The window is
        refreshed: existing rows there are replaced.
      - OLDER than that (only when `include_stats=True`, OFF by default): HA long-term
        STATISTICS (hourly). Gear devices (heater/humidifier/dehumidifier on-off, outlets)
        have NO long-term statistics, so those older samples are DEVICE-BLIND — the metric
        moves but every on/off device reads off, so the fit can't attribute the change and
        just biases drift + dilutes R². 10 days of 2-min capture already maxes the
        confidence volume term, so the blind backfill adds no volume and only hurts
        quality; it's off by default (v3.20.26). Depth instead comes from forward capture,
        which records full device state going forward.

    Either way, device-BLIND rows already in the store are trimmed at the end, keeping all
    device-complete data (fine + forward capture). Returns rows written. Used for the
    one-shot seed and the manual 'rebuild from history' action."""
    from homeassistant.util import dt as dt_util

    def _gs(eid):
        st = hass.states.get(eid)
        return st.state if st is not None else None
    eids_all = list(hass.states.async_entity_ids())
    _roles = read_outlet_roles(hass, panel)
    classified = (classify_zone(eids_all, zone, get_state=_gs, roles=_roles) if zone
                  else classify_panel(eids_all, panel, get_state=_gs,
                                      roles=roles_for_slot(_roles, panel)))
    if not classified["metrics"] or not classified["devices"]:
        return 0
    eids = list(classified["metrics"].values())
    for spec in classified["devices"].values():
        eids += [v for k, v in spec.items() if isinstance(v, str) and "." in v]

    cutoff = dt_util.utcnow().timestamp() - float(days) * 86400.0   # recent | older boundary
    states_raw = await async_fetch_history(hass, eids, days)                 # fine, recent
    # Device-complete-only store keys (gear/enum/switch devices have no statistics, so a
    # sample that carries one of these is NOT a blind stats row). Used to trim blind data.
    device_keys = [name for name, spec in classified["devices"].items()
                   if spec.get("effort") in ("gear", "enum", "switch")]
    stats_raw = (await async_fetch_statistics(hass, eids, STATS_BACKFILL_DAYS)
                 if include_stats else {})

    def _sync():
        earliest = store.stats(panel)["first"]
        written = 0
        # RECENT: replace the last `days` with fine states (dense). Anchor the grid to
        # the METRICS' start (≈ the recorder window), not every series — else a gear
        # device whose first state is recent would truncate the grid to near-nothing.
        store.delete_since(panel, cutoff)
        ms, os_ = build_panel_series(states_raw, classified)
        rstarts = [p[0][0] for p in ms.values() if p]
        rt0 = min(rstarts) if rstarts else None
        for s in build_samples(ms, os_, step_s=CAPTURE_STEP_S, t0=rt0):
            if s.t >= cutoff:
                store.append(panel, s.t, {**s.metrics, **s.outputs})
                written += 1
        # OLDER: hourly statistics — only when explicitly requested (device-blind; off by
        # default). Appended only where the store doesn't already reach, so re-runs stay
        # idempotent and never overwrite accumulated fine data.
        if include_stats and stats_raw:
            older_bound = cutoff if earliest is None else min(cutoff, earliest)
            ms2, os2 = build_panel_series(stats_raw, classified)
            starts = [p[0][0] for p in ms2.values() if p]
            t0 = min(starts) if starts else None
            for s in build_samples(ms2, os2, step_s=SEED_STEP_S, t0=t0):
                if s.t < older_bound:
                    store.append(panel, s.t, {**s.metrics, **s.outputs})
                    written += 1
        else:
            # Trim any device-blind rows a previous stats backfill left behind, by sample
            # spacing (blind = hourly, real = 2-min), keeping all dense device-complete data.
            store.trim_sparse(panel, DENSE_MAX_S)
        store.mark_seeded(panel)
        return written

    return await hass.async_add_executor_job(_sync)


async def async_seed_store_from_recorder(hass, bus, store, panel: str, days: float = BACKFILL_DAYS,
                                         zone: Optional[dict] = None) -> int:
    """No-op (v3.20.27). Learning no longer imports ANY recorder/statistics history —
    HA history is unreliable for this (short recorder windows, and on/off devices have no
    long-term statistics so older samples are device-blind). The store instead learns only
    from the integration's OWN forward capture (full device state, every 2 min) once
    adaptive climate is on. async_backfill_panel is kept for a possible future opt-in
    'import device-complete history' but is not used by default."""
    return 0


async def async_reseed_bus(hass, bus, store, days: float = BACKFILL_DAYS) -> None:
    """Clean = START OVER. Wipe the durable store's captured samples for every panel so
    learning begins fresh from live capture (v3.20.34). Saved learning PROFILES are kept —
    they live in their own tables, untouched — so you can reload one afterwards. No new
    recorder/statistics import happens. No-op if the store is off."""
    import logging
    log = logging.getLogger(__name__)
    if store is None:
        log.warning("sf ai_reseed: durable store is off — nothing to clean")
        return
    removed = 0
    try:
        # Full reset of all panels' samples (+ seeded flags); profiles are not touched.
        removed = await hass.async_add_executor_job(store.reset, None)
    except Exception:  # noqa: BLE001 — best-effort
        log.exception("sf ai_clean: store reset failed")
    # Drop the per-panel capture dedup caches so the next tick stores a fresh baseline row.
    for attr in ("_ai_last_vals", "_ai_last_write"):
        try:
            getattr(bus, attr, {}).clear()
        except Exception:  # noqa: BLE001
            pass
    log.info("sf ai_clean: wiped %s rows — starting over; saved profiles kept", removed)
    # Re-fit + republish NOW (force) so the card reflects the wipe immediately, regardless of
    # the user's throttle cadence.
    await async_learn_bus(hass, bus, days, store=store, force=True)


async def async_purge_store(hass, store, retention_days: float) -> int:
    """Drop store rows older than retention_days. retention_days <= 0 means 'keep
    everything' — no purge at all. Returns rows removed."""
    if not retention_days or retention_days <= 0:
        return 0
    from homeassistant.util import dt as dt_util
    before = dt_util.utcnow().timestamp() - float(retention_days) * 86400.0

    def _purge():
        return store.purge(before)

    return await hass.async_add_executor_job(_purge)


async def async_fetch_history(hass, entity_ids: Sequence[str], days: float):
    """Pull recorder history for the given entities over the last `days`,
    returned as {entity_id: [(epoch, state_str), ...]} sorted ascending."""
    from datetime import timedelta
    from homeassistant.components.recorder import get_instance, history
    from homeassistant.util import dt as dt_util

    end = dt_util.utcnow()
    start = end - timedelta(days=days)

    def _run():
        # Query AND parse inside the executor so neither the DB read nor the
        # per-row Python loop (can be large over a long window) ever runs on the
        # event loop. (loop-safety)
        states = history.get_significant_states(
            hass, start, end, list(entity_ids),
            minimal_response=True, no_attributes=True,
        )
        out: dict[str, list[tuple[float, object]]] = {}
        for eid, rows in (states or {}).items():
            series: list[tuple[float, object]] = []
            for st in rows:
                # get_significant_states rows are State objects (or minimal dicts).
                when = getattr(st, "last_updated", None) or getattr(st, "last_changed", None)
                val = getattr(st, "state", None)
                if isinstance(st, dict):
                    when = st.get("last_updated") or st.get("last_changed")
                    val = st.get("state")
                ts = _row_ts(when)
                if ts is None:
                    continue
                series.append((ts, val))
            series.sort(key=lambda p: p[0])
            out[eid] = series
        return out

    return await get_instance(hass).async_add_executor_job(_run)


async def async_fetch_statistics(hass, entity_ids: Sequence[str], days: float):
    """Pull HA long-term statistics (hourly mean) for the given entities over the
    last `days`, as {entity_id: [(epoch, mean), ...]} ascending. Entities without
    statistics (binary/enum — the gear on-off/level sensors) are simply absent from
    the result. This reaches months back, past the recorder's states purge window."""
    from datetime import timedelta
    from homeassistant.components.recorder import get_instance
    from homeassistant.components.recorder.statistics import statistics_during_period
    from homeassistant.util import dt as dt_util

    end = dt_util.utcnow()
    start = end - timedelta(days=days)
    ids = list(entity_ids)

    def _run():
        stats = statistics_during_period(
            hass, start, end, set(ids), "hour", None, {"mean"})
        out: dict[str, list[tuple[float, object]]] = {}
        for eid, rows in (stats or {}).items():
            series: list[tuple[float, object]] = []
            for r in rows:
                ts = _row_ts(r.get("start"))
                mean = r.get("mean")
                if ts is None or mean is None:
                    continue
                series.append((ts, mean))
            if series:
                series.sort(key=lambda p: p[0])
                out[eid] = series
        return out

    return await get_instance(hass).async_add_executor_job(_run)


def resolve_panel(panel: str, zones) -> tuple[str, Optional[dict]]:
    """Classify a panel against the zone config: ("zone", z) if it's a zone's sensor
    controller, ("absorbed", z) if another zone pulls in its devices, else
    ("panel", None) for ordinary per-panel learning."""
    for z in zones or []:
        if z.get("sensor_panel") == panel:
            return ("zone", z)
    for z in zones or []:
        if panel in (z.get("device_panels") or []):
            return ("absorbed", z)
    return ("panel", None)


def _slow_cached(bus, panel: str):
    """Recent step-response + self-test results for this panel, or None when they're
    missing or older than SLOW_ANALYSIS_EVERY_S (→ recompute this pass)."""
    import time as _t
    ent = (getattr(bus, "_ai_slow", None) or {}).get(panel)
    if ent and _t.time() - ent[0] < SLOW_ANALYSIS_EVERY_S:
        return ent[1]
    return None


def _slow_store(bus, panel: str, slow: dict) -> None:
    import time as _t
    cache = getattr(bus, "_ai_slow", None)
    if cache is None:
        cache = bus._ai_slow = {}
    cache[panel] = (_t.time(), slow)


async def async_learn_panel(hass, bus, panel: str, mac: str, days: float = BACKFILL_DAYS,
                            store=None, zone: Optional[dict] = None) -> dict:
    """Full observe-only pass for one panel: classify → learn → cache → publish the
    confidence. Returns the summary dict. No actuation.

    Source of truth for training:
      - store given (CONF_AI_STORE on): seed the store from the recorder once, then
        train from the durable store — history grows past the recorder's purge window.
      - no store (default): train directly from the recorder (its ~10-day window).
    """
    def _gs(eid):
        st = hass.states.get(eid)
        return st.state if st is not None else None

    eids_all = list(hass.states.async_entity_ids())
    _roles = read_outlet_roles(hass, panel)
    classified = (classify_zone(eids_all, zone, get_state=_gs, roles=_roles) if zone
                  else classify_panel(eids_all, panel, get_state=_gs,
                                      roles=roles_for_slot(_roles, panel)))
    if not classified["metrics"] or not classified["devices"]:
        result = {"confidence": 0.0, "models": {}, "samples": 0}
    elif store is not None:
        # Durable-store path. Seed once from the recorder, then fit from the store.
        await async_seed_store_from_recorder(hass, bus, store, panel, days, zone=zone)
        metrics = list(classified["metrics"].keys())
        devices = list(classified["devices"].keys())

        # Learning-speed level → fit only on samples newer than `since` (0 = all), and set
        # the confidence "enough data" bar to that window so a fast level reaches full
        # confidence when ITS window fills, not only after 10 days. Read on the loop (hass
        # states); the fit itself stays in the executor.
        import time as _t
        _win = read_learn_window(hass, panel)
        since = max(0.0, _t.time() - _win * 86400.0) if _win > 0 else 0.0
        # Capture is event-driven (variable rate), so the confidence "enough data" bar for a
        # windowed level is set from a NOMINAL average spacing (CAPTURE_EFFECTIVE_S) — a
        # window reaches full confidence once it holds ~that density; a dynamic tent fills
        # faster. Slow (all data) keeps the fixed FULL_SAMPLES bar.
        full = (_win * 86400.0 / CAPTURE_EFFECTIVE_S) if _win > 0 else FULL_SAMPLES
        # Denoise half-window tracks the hardware frame rate (a couple of frames), so it
        # de-jitters without flattening the seconds-scale swings a small tent actually has.
        denoise = min(DENOISE_HALF_SEC, DENOISE_FRAMES * CAPTURE_FRAME_S)

        recent_win = 300.0                             # 5-min rolling window → live rows/hr
        recent_since = _t.time() - recent_win
        slow = _slow_cached(bus, panel)

        def _fit():
            samples = store.samples(panel, metrics, since)
            res = learn_samples(samples, metrics, devices, full, denoise, slow=slow)
            res["_store_stats"] = store.stats(panel)   # rows + distinct-ts samples + range
            res["_store_bytes"] = store.size_bytes()   # whole-DB file size
            res["_store_recent"] = store.recent_samples(panel, recent_since)  # count in window
            res["profiles"] = store.list_profiles()    # saved learning profiles (for the card)
            return res

        result = await hass.async_add_executor_job(_fit)
        # Surface the durable store's actual coverage so the card can show the real
        # training span + size instead of a recorder-window knob (moot once seeded).
        st = result.pop("_store_stats", {}) or {}
        result["store_enabled"] = True
        # store_rows = distinct-timestamp SAMPLES (what the learner trains on), not the
        # raw per-key row count (each timestamp has several metric/device key-rows).
        result["store_rows"] = int(st.get("samples") or 0)
        # Live capture rate: samples stored in the last `recent_win` seconds; the card turns
        # count + window into rows/hr. Refreshes every live tick (~15 s).
        result["store_recent"] = int(result.pop("_store_recent", 0) or 0)
        result["store_recent_s"] = recent_win
        result["store_bytes"] = int(result.pop("_store_bytes", 0) or 0)
        first, last = st.get("first"), st.get("last")
        if first and last:
            span = max(0.0, (float(last) - float(first)) / 86400.0)
            result["store_first"] = float(first)
            result["store_last"] = float(last)
            result["store_days"] = round(span, 1)
            result["history_days"] = round(span)   # Overview "days history" = real span
    else:
        eids = list(classified["metrics"].values())
        for spec in classified["devices"].values():
            eids += [v for k, v in spec.items() if isinstance(v, str) and "." in v]
        raw = await async_fetch_history(hass, eids, days)
        # Series-building + the OLS fit are pure CPU — keep them off the loop too.
        slow = _slow_cached(bus, panel)
        result = await hass.async_add_executor_job(
            lambda: learn(*build_panel_series(raw, classified), slow=slow)
        )
        result["store_enabled"] = False
    if "_slow" in result:
        _slow_store(bus, panel, result.pop("_slow"))
    result["days"] = days
    if zone:
        # Per-controller breakdown so the card badge can show exactly what the zone
        # includes ("dp1 · sensor · 5 dev", "ac10 · 0 dev") — a controller that's
        # listed but contributes 0 learnable devices still shows, which is the
        # fastest way to spot a mis-set outlet or a controller added by mistake.
        meta = classified.get("meta", {})
        panel_counts: dict[str, int] = {}
        external = 0
        for m in meta.values():
            if m.get("external"):
                external += 1
            elif m.get("panel"):
                panel_counts[m["panel"]] = panel_counts.get(m["panel"], 0) + 1
        sp = zone.get("sensor_panel")
        ordered = [sp] + [p for p in (zone.get("device_panels") or []) if p and p != sp]
        panels = [{"slot": p, "sensor": (p == sp), "devices": panel_counts.get(p, 0)}
                  for p in ordered]
        result["zone"] = {"id": zone.get("id"), "name": zone.get("name"),
                          "sensor_panel": sp, "panels": panels, "external": external}
    # Per-device labels so the card can show "AC5 · Outlet 3", "Big Humidifier
    # (external)" or "Outlet 3 · Cooling" instead of a bare key.
    zmeta = classified.get("meta", {})
    meta: dict[str, dict] = {}
    for name, spec in classified["devices"].items():
        m = dict(zmeta.get(name, {}))
        if spec.get("effort") == "switch":
            if spec.get("external"):
                m["external"] = True
                m["role"] = spec.get("role")
            else:
                m["kind"] = "outlet"
                m["mode"] = spec.get("mode")
                m["dir"] = spec.get("dir")
                # Role-tagged Manual outlet (no SF env direction) — carry the role so the
                # card can label it "Outlet 3 · Humidifier" instead of a bare number.
                if spec.get("role"):
                    m["role"] = spec.get("role")
        else:
            # Built-in accessory: its current SF mode (e.g. "Environment", "Manual") — tells
            # a future controller whether SF is already driving it. (v3.20.39)
            mode = _gs(f"sensor.sf_{m.get('panel') or panel}_{m.get('base') or name}_mode")
            if mode not in (None, "", "unknown", "unavailable"):
                m["mode"] = mode
        if m:
            meta[name] = m
    if meta:
        result["device_meta"] = meta
    # Wall-clock stamp of THIS fit, so the card's "next update" countdown resets
    # exactly on the mark at each pass. Needed because HA only bumps the sensor's
    # last_updated when the payload changes — an identical re-fit (common once a
    # model settles) left last_updated stale and the countdown stuck at "due now".
    # A fresh last_fit every pass also guarantees last_updated advances. (v3.20.22)
    import time as _time
    result["last_fit"] = _time.time()
    try:
        await _store(hass, panel).async_save(result)
    except Exception:  # noqa: BLE001 — cache is best-effort
        pass
    # Publish onto the bus so sensor.sf_<panel>_ai_confidence picks it up.
    import json
    bus.publish(f"ggs/ha/{mac}/ai_confidence/state", json.dumps(result), retain=True)
    return result


async def async_learn_bus(hass, bus, days: float = BACKFILL_DAYS, store=None,
                          force: bool = False) -> None:
    """Run an observe-only learning pass for every panel known to this bus. Errors
    on one panel never stop the others. No actuation. `store` (when CONF_AI_STORE is
    on) routes training through the durable store instead of the recorder.

    Re-entrancy guarded: if a pass is already running (e.g. a scheduled tick fires
    while a manual sf.ai_learn is still going), skip rather than pile up overlapping
    recorder reads — keeps the integration from hogging the executor / lagging HA.
    `force=True` bypasses that skip and also resets the cadence stamp, so a user action
    (clean, load/save/delete a profile) refreshes the card NOW rather than waiting for
    the next throttled tick."""
    import logging
    log = logging.getLogger(__name__)
    if getattr(bus, "_ai_learning", False) and not force:
        log.debug("sf ai_learn: a pass is already running — skipping this trigger")
        return
    bus._ai_learning = True
    if force:
        bus._ai_last_fit = 0.0          # let the next heartbeat fire promptly too
        bus._ai_slow = {}               # data changed — recompute step responses + self-test
    zones = getattr(bus, "_ai_zones", []) or []
    try:
        for mac, slot in dict(getattr(bus, "_slot_cache", {})).items():
            kind, z = resolve_panel(slot, zones)
            if kind == "absorbed":
                continue        # learned as part of its zone's sensor panel
            try:
                await async_learn_panel(hass, bus, slot, mac, days, store=store,
                                        zone=z if kind == "zone" else None)
            except Exception:  # noqa: BLE001 — one panel's failure is isolated
                log.exception("sf ai_learn: pass failed for panel %s (%s)", slot, mac)
    finally:
        bus._ai_learning = False
