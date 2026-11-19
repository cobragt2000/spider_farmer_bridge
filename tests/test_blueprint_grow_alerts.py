"""Behaviour of the bundled "Spider Farmer - Grow Alerts" automation blueprint.

Each test builds an automation from the blueprint file in this repo and drives it
with plain states / events and a frozen clock. Alerts are observed through the
blueprint's "Extra actions" slot (an event carrying alert_title / alert_message),
so every notification channel the blueprint sends to is exercised the same way.
"""

from __future__ import annotations

import asyncio
import os
import shutil
from datetime import timedelta
from pathlib import Path
from unittest.mock import patch

import pytest
from homeassistant.components import automation
from homeassistant.core import CoreState
from homeassistant.helpers import device_registry as dr
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from homeassistant.util.yaml import load_yaml

from tests.ha_compat import MockConfigEntry

try:  # Home Assistant 2026.11+
    from pytest_homeassistant.common import async_fire_time_changed, async_mock_service
except ImportError:  # older cores: community plugin
    from pytest_homeassistant_custom_component.common import (  # type: ignore[no-redef]
        async_fire_time_changed,
        async_mock_service,
    )

BLUEPRINT = Path(__file__).resolve().parents[1] / "custom_components" / "sf" / "blueprints" / "grow_alerts.yaml"
BP_PATH = "spider_farmer/grow_alerts.yaml"
AUTOMATION = "automation.ga"
ALARMS = "sensor.sf_dp1_alarms"
CTRL = "aabbccddeeff"  # controller id as the integration writes it (sf_device / sf_alarm "mac")

EXTRA = [{"event": "ga_alert", "event_data": {"t": "{{ alert_title }}", "m": "{{ alert_message }}"}}]
AIR = {"sensor.t": "70", "sensor.h": "50", "sensor.v": "1.0"}
# Inputs every test gets unless it tests exactly these (findings 1 and 8): the three
# air sensors (once required) and a re-notify value carrying `days` (once the only
# shape that rendered). This keeps each test focused on its own behaviour.
BASE = {"temp_sensor": "sensor.t", "humidity_sensor": "sensor.h", "vpd_sensor": "sensor.v",
        "renotify_after": {"days": 0, "hours": 0, "minutes": 0, "seconds": 0}}


def _every(minutes: int) -> dict:
    return {"days": 0, "hours": 0, "minutes": minutes, "seconds": 0}


def _automation_config(inputs: dict, alias: str = "ga") -> dict:
    return {"id": alias, "alias": alias, "use_blueprint": {"path": BP_PATH, "input": inputs}}


async def _install_blueprint(hass) -> None:
    dst = hass.config.path("blueprints", "automation", "spider_farmer", "grow_alerts.yaml")

    def _copy():
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy(BLUEPRINT, dst)

    await hass.async_add_executor_job(_copy)


async def _setup(hass, inputs: dict, states: dict | None = None, *, extra: bool = True, base: bool = True) -> list:
    """Create the automation; return the list that collects (minute, title, message)."""
    await _install_blueprint(hass)
    for eid, st in (states or {}).items():
        if isinstance(st, tuple):
            hass.states.async_set(eid, st[0], st[1])
        else:
            hass.states.async_set(eid, st)
    alerts: list = []
    start = dt_util.utcnow()
    hass.bus.async_listen(
        "ga_alert",
        lambda e: alerts.append((round((dt_util.utcnow() - start).total_seconds() / 60, 1),
                                 e.data["t"], e.data["m"])),
    )
    assert await async_setup_component(hass, "persistent_notification", {})
    inp = {**(BASE if base else {}), **({"extra_actions": EXTRA} if extra else {}), **inputs}
    assert await async_setup_component(hass, automation.DOMAIN, {automation.DOMAIN: _automation_config(inp)})
    await hass.async_block_till_done()
    return alerts


async def _spin(hass, n: int = 50) -> None:
    """Let pending callbacks and automation runs advance. (Not
    hass.async_block_till_done(): it would wait forever for a run that sits in a
    re-notify wait while the frozen clock doesn't move.)"""
    for _ in range(n):
        await asyncio.sleep(0)


async def _tick(hass, freezer, seconds: float) -> None:
    freezer.tick(timedelta(seconds=seconds))
    async_fire_time_changed(hass, dt_util.utcnow())
    await _spin(hass)


async def _set(hass, entity_id: str, state: str, attrs: dict | None = None) -> None:
    hass.states.async_set(entity_id, state, attrs)
    await _spin(hass)


def _errors(caplog) -> list[str]:
    return [r.getMessage()[:300] for r in caplog.records if r.levelname == "ERROR"]


def _running(hass) -> int:
    return hass.states.get(AUTOMATION).attributes.get("current", 0)


# ---------------------------------------------------------------------------
# Loads / validates
# ---------------------------------------------------------------------------


async def test_blueprint_validates_and_loads_without_any_input(hass, caplog):
    """The file is a valid automation blueprint, and an automation that sets no
    input at all loads and is on (every input has a default)."""
    from homeassistant.components.automation.helpers import async_get_blueprints

    await _install_blueprint(hass)
    bp = await async_get_blueprints(hass).async_get_blueprint(BP_PATH)  # raises if invalid
    assert bp.name == "Spider Farmer - Grow Alerts"
    await _setup(hass, {}, extra=False, base=False)
    st = hass.states.get(AUTOMATION)
    assert st is not None and st.state == "on"
    assert _errors(caplog) == []


# ---------------------------------------------------------------------------
# 1 — renotify_after without `days`
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("renotify", [None, {"hours": 0, "minutes": 0, "seconds": 0}])
async def test_alert_sent_with_default_renotify(hass, freezer, caplog, renotify):
    """The duration selector (and the default) never send `days`; rendering
    `renotify_after.days` failed every run, so no alert was ever sent."""
    inputs = {"temp_sensor": "sensor.t", "humidity_sensor": "sensor.h", "vpd_sensor": "sensor.v", "temp_high": 80}
    if renotify is not None:
        inputs["renotify_after"] = renotify
    alerts = await _setup(hass, inputs, AIR, base=False)
    await _set(hass, "sensor.t", "81")
    await _tick(hass, freezer, 181)
    assert len(alerts) == 1
    assert _errors(caplog) == []


async def test_renotify_interval_from_the_ui(hass, freezer):
    alerts = await _setup(hass, {"temp_sensor": "sensor.t", "humidity_sensor": "sensor.h", "vpd_sensor": "sensor.v",
                                 "temp_high": 80, "renotify_after": {"hours": 0, "minutes": 10, "seconds": 0}},
                          AIR, base=False)
    await _set(hass, "sensor.t", "81")
    await _tick(hass, freezer, 181)
    for _ in range(4):
        await _tick(hass, freezer, 300)
    assert len(alerts) == 3  # at 3, 13 and 23 min


# ---------------------------------------------------------------------------
# 2 — a crossing that matures inside the settle window is delayed, not dropped
# ---------------------------------------------------------------------------


async def test_crossing_inside_settle_window_is_delayed(hass, freezer):
    alerts = await _setup(hass, {"temp_sensor": "sensor.t", "temp_high": 83, "temp_night_high": 78,
                                 "day_sensor": "binary_sensor.day",
                                 "settle_after_flip": {"hours": 0, "minutes": 15, "seconds": 0}},
                          {**AIR, "binary_sensor.day": "off"})
    await _set(hass, "binary_sensor.day", "on")       # lights on at 0
    await _tick(hass, freezer, 300)
    await _set(hass, "sensor.t", "88")                # past the day high at +5 min, stays there
    for i in range(115):                              # 2 h of fresh readings
        await _tick(hass, freezer, 60)
        if i % 5 == 0:
            await _set(hass, "sensor.t", "89" if i % 2 else "88.5")
    assert len(alerts) == 1
    assert 15 <= alerts[0][0] <= 16      # when the settle time is up (crossed at 5, sustained by 8)
    assert "(day)" in alerts[0][1]


async def test_lights_off_while_still_warm(hass, freezer):
    """Lights off with the tent at 80 (> night high 78): no alert if it cools
    down within the settle time; an alert when the settle time is up if it
    doesn't."""
    alerts = await _setup(hass, {"temp_sensor": "sensor.t", "temp_high": 83, "temp_night_high": 78,
                                 "day_sensor": "binary_sensor.day"},
                          {**AIR, "sensor.t": "80", "binary_sensor.day": "on"})
    await _tick(hass, freezer, 3600)
    await _set(hass, "binary_sensor.day", "off")      # night 1: cools to 77 after 10 min
    await _tick(hass, freezer, 600)
    await _set(hass, "sensor.t", "77")
    for _ in range(6):
        await _tick(hass, freezer, 600)
    assert alerts == []
    await _set(hass, "sensor.t", "80")
    await _set(hass, "binary_sensor.day", "on")       # day: 80 is fine
    await _tick(hass, freezer, 3600)
    await _set(hass, "binary_sensor.day", "off")      # night 2 (at 190 min): stays at 80
    for _ in range(30):
        await _tick(hass, freezer, 60)
    assert len(alerts) == 1 and 205 <= alerts[0][0] <= 206 and "(night)" in alerts[0][1]


# ---------------------------------------------------------------------------
# 3 / 4 — controller alarms come from sf_alarm, classified by alarm type
# ---------------------------------------------------------------------------


def _alarm(i, devtype, alarm_type, text, device):
    return {"id": i, "epoch": 1000 + i, "time": f"2026-11-01T10:{i:02d}:00+00:00", "devType": devtype,
            "device": device, "alarmType": alarm_type, "alarm": text}


TANK = _alarm(5, 26, 5, "Dehumidifier water tank is full", "Dehumidification")
TANK_CLEAR = _alarm(8, 26, None, "Restoring normal", "Dehumidification")
THRESH = _alarm(6, 1, 1, "Above threshold", "Air Temp")
THRESH_CLEAR = _alarm(7, 1, None, "Restoring normal", "Air Temp")
OFF_4IN1 = _alarm(9, 17, 3, "Current device is offline", "4-in-1 Sensor")
OFF_SOIL = _alarm(10, 19, 3, "Current device is offline", "Soil Sensor")


def _alarm_state(hass, events):
    hass.states.async_set(ALARMS, events[0]["time"] if events else "none",
                          {"sf_device": CTRL, "count": len(events), "events": events, "friendly_name": "Alarms"})


async def _fire_alarm(hass, entry, log, mac=CTRL):
    """What the integration does for a new log entry: publish the merged log on
    the sensor, then fire sf_alarm for the new entry."""
    _alarm_state(hass, log)
    hass.bus.async_fire("sf_alarm", {"mac": mac, **entry})
    await _spin(hass)


async def test_alarm_relay_ignores_sensor_churn_and_relays_each_new_alarm(hass):
    alerts = await _setup(hass, {"alarms_sensors": [ALARMS]}, {ALARMS: ("none", {"sf_device": CTRL, "events": []})})
    # Sensor goes unavailable (attributes dropped) and comes back with the same log,
    # restores as "none" after a reload, and an older entry is backfilled: no alerts.
    await _set(hass, ALARMS, "unavailable", {"friendly_name": "Alarms"})
    _alarm_state(hass, [TANK])
    await _spin(hass)
    _alarm_state(hass, [TANK, _alarm(1, 2, 2, "Below threshold", "Humidity")])
    await _spin(hass)
    assert alerts == []
    # Two new offline alarms in the same frame: both relayed.
    log = [OFF_SOIL, OFF_4IN1, TANK]
    _alarm_state(hass, log)
    hass.bus.async_fire("sf_alarm", {"mac": CTRL, **OFF_4IN1})
    hass.bus.async_fire("sf_alarm", {"mac": CTRL, **OFF_SOIL})
    await _spin(hass)
    assert sorted(a[2] for a in alerts) == ["4-in-1 Sensor: Current device is offline",
                                            "Soil Sensor: Current device is offline"]
    # Another controller's alarm (its sensor isn't picked): not relayed.
    await _fire_alarm(hass, TANK_CLEAR, log, mac="001122334455")
    assert len(alerts) == 2


async def test_alarm_matched_by_device_when_sensor_has_no_attributes(hass):
    """The picked sensor is matched to the controller through its device too
    (e.g. while it is unavailable and carries no sf_device attribute)."""
    entry = MockConfigEntry(domain="sf")
    entry.add_to_hass(hass)
    dev = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id,
                                                 identifiers={("sf", f"ggs_{CTRL}")}, name="Panel")
    from homeassistant.helpers import entity_registry as er
    er.async_get(hass).async_get_or_create("sensor", "sf", "alarms_x", suggested_object_id="sf_dp1_alarms",
                                           config_entry=entry, device_id=dev.id)
    alerts = await _setup(hass, {"alarms_sensors": [ALARMS]}, {ALARMS: "unavailable"})
    hass.bus.async_fire("sf_alarm", {"mac": CTRL, **TANK})
    await _spin(hass)
    assert [a[2] for a in alerts] == ["Dehumidification: Dehumidifier water tank is full"]


@pytest.mark.parametrize(
    ("scope", "expected"),
    [
        # "Faults only": the threshold alarm is filtered, so is its clear.
        (["Faults only (tank, offline, light-temp, etc.)"],
         ["Dehumidification: Dehumidifier water tank is full", "Dehumidification: Restoring normal"]),
        # "Tank / water": the tank alarm AND its clear.
        (["Tank / water (full or empty)"],
         ["Dehumidification: Dehumidifier water tank is full", "Dehumidification: Restoring normal"]),
        # "Above / below threshold": only the threshold pair.
        (["Above / below threshold"], ["Air Temp: Above threshold", "Air Temp: Restoring normal"]),
        # "Other faults": a clear is not an "other" fault.
        (["Other faults"], []),
        # The option wording of 3.20.49/50 ("All (including above/below threshold)").
        ("All (including above/below threshold)",
         ["Air Temp: Above threshold", "Dehumidification: Dehumidifier water tank is full",
          "Air Temp: Restoring normal", "Dehumidification: Restoring normal"]),
    ],
)
async def test_alarm_clear_takes_the_type_of_the_alarm_it_clears(hass, scope, expected):
    alerts = await _setup(hass, {"alarms_sensors": [ALARMS], "alarm_scope": scope, "alarm_include_clears": True},
                          {ALARMS: ("none", {"sf_device": CTRL, "events": []})})
    await _fire_alarm(hass, THRESH, [THRESH])
    await _fire_alarm(hass, TANK, [TANK, THRESH])
    await _fire_alarm(hass, THRESH_CLEAR, [THRESH_CLEAR, TANK, THRESH])
    await _fire_alarm(hass, TANK_CLEAR, [TANK_CLEAR, THRESH_CLEAR, TANK, THRESH])
    assert [a[2] for a in alerts] == expected


# ---------------------------------------------------------------------------
# 5 — repeats re-read the value and stop when the alert no longer applies
# ---------------------------------------------------------------------------


async def test_repeat_rereads_value_and_stops_after_lights_on(hass, freezer):
    alerts = await _setup(hass, {"humidity_sensor": "sensor.h", "hum_high": 80, "hum_night_high": 70,
                                 "day_sensor": "binary_sensor.day", "renotify_after": _every(10)},
                          {**AIR, "binary_sensor.day": "off"})
    await _tick(hass, freezer, 3600)
    await _set(hass, "sensor.h", "72", {"unit_of_measurement": "%"})
    await _tick(hass, freezer, 181)
    assert len(alerts) == 1 and "now 72%" in alerts[0][2] and "(night)" in alerts[0][1]
    await _tick(hass, freezer, 300)
    await _set(hass, "sensor.h", "79", {"unit_of_measurement": "%"})  # worse, still night
    await _tick(hass, freezer, 300)
    assert len(alerts) == 2 and "now 79%" in alerts[1][2]
    await _set(hass, "binary_sensor.day", "on")                      # day high 80: 75 is fine
    await _set(hass, "sensor.h", "75", {"unit_of_measurement": "%"})
    for _ in range(4):
        await _tick(hass, freezer, 600)
    assert len(alerts) == 2
    assert _running(hass) == 0


# ---------------------------------------------------------------------------
# 7 / 14 — phone problems don't stop the other channels; robust service name
# ---------------------------------------------------------------------------


def _phone(hass, name):
    entry = MockConfigEntry(domain="mobile_app")
    entry.add_to_hass(hass)
    return dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id,
                                                  identifiers={("mobile_app", name)}, name=name).id


async def _phone_run(hass, freezer, device_id, services=()):
    calls = {s: async_mock_service(hass, "notify", s) for s in services}
    tts = async_mock_service(hass, "tts", "speak")
    alerts = await _setup(hass, {"temp_sensor": "sensor.t", "temp_high": 80, "mobile_notify_device": device_id,
                                 "voice_enable": True, "voice_tts_entity": "tts.x",
                                 "voice_media_player": "media_player.y",
                                 "renotify_after": _every(10)},
                          {**AIR, "sensor.t": "79", "tts.x": "idle", "media_player.y": "idle"})
    await _set(hass, "sensor.t", "81")
    await _tick(hass, freezer, 181)
    await _tick(hass, freezer, 600)   # one repeat
    return calls, tts, alerts


async def test_phone_service_named_like_home_assistant_names_it(hass, freezer):
    """Home Assistant names the service slugify("mobile_app_" + name); for an
    emoji-only name that is mobile_app (not mobile_app_unknown)."""
    calls, tts, alerts = await _phone_run(hass, freezer, _phone(hass, "📱"), ["mobile_app", "mobile_app_unknown"])
    assert len(calls["mobile_app"]) == 2 and calls["mobile_app_unknown"] == []
    assert calls["mobile_app"][0].data["data"]["priority"] == "high"
    assert calls["mobile_app"][0].data["title"] == "Grow Tent alert — Temperature high (day)"
    assert len(tts) == 2 and len(alerts) == 2


async def test_deleted_phone_is_skipped(hass, freezer, caplog):
    calls, tts, alerts = await _phone_run(hass, freezer, "0123456789abcdef0123456789abcdef")
    assert len(tts) == 2 and len(alerts) == 2
    assert _errors(caplog) == []


async def test_phone_without_notify_service_does_not_stop_the_rest(hass, freezer):
    """The device exists but has no notify service (no push): TTS, extra actions
    and the repeat still happen."""
    calls, tts, alerts = await _phone_run(hass, freezer, _phone(hass, "Tablet"))
    assert len(tts) == 2 and len(alerts) == 2


# ---------------------------------------------------------------------------
# 8 — every sensor is optional
# ---------------------------------------------------------------------------


async def test_only_humidity_configured(hass, freezer, caplog):
    alerts = await _setup(hass, {"humidity_sensor": "sensor.h", "hum_high": 70}, {"sensor.h": "60"}, base=False)
    assert hass.states.get(AUTOMATION).state == "on"
    await _set(hass, "sensor.h", "75")
    await _tick(hass, freezer, 181)
    assert len(alerts) == 1
    assert _errors(caplog) == []


async def test_only_soil_configured(hass, freezer, caplog):
    alerts = await _setup(hass, {"soil_ec_sensors": ["sensor.ec1", "sensor.ec2"], "soil_ec_high": 2.5},
                          {"sensor.ec1": "1.8", "sensor.ec2": "1.9"}, base=False)
    await _set(hass, "sensor.ec2", "2.6", {"friendly_name": "Probe 2 EC"})
    await _tick(hass, freezer, 181)
    assert [a[2].split(":")[0] for a in alerts] == ["Soil EC high on Probe 2 EC"]
    assert _errors(caplog) == []


# ---------------------------------------------------------------------------
# 9 — catch-up for readings that are already out of range
# ---------------------------------------------------------------------------


async def test_already_out_of_range_at_home_assistant_start(hass, freezer):
    hass.set_state(CoreState.not_running)
    alerts = await _setup(hass, {"temp_sensor": "sensor.t", "temp_high": 80, "hum_high": 70,
                                 "water_sensors": ["binary_sensor.leak"],
                                 "soil_moisture_sensors": ["sensor.m1", "sensor.m2"], "soil_moisture_low": 30},
                          {**AIR, "sensor.t": "85", "sensor.h": "75", "binary_sensor.leak": "on",
                           "sensor.m1": "20", "sensor.m2": "50"})
    freezer.tick(timedelta(seconds=1))
    await hass.async_start()
    await _spin(hass)
    assert [a[1] for a in alerts] == ["Grow Tent alert — Water leak detected"]   # no sustain for a leak
    await _tick(hass, freezer, 29)
    await _reload(hass, {"temp_sensor": "sensor.t", "temp_high": 80, "hum_high": 70,
                         "water_sensors": ["binary_sensor.leak"],
                         "soil_moisture_sensors": ["sensor.m1", "sensor.m2"], "soil_moisture_low": 30})
    assert len(alerts) == 1                 # an unchanged reload right after the start: no second catch-up
    await _tick(hass, freezer, 30)
    await _set(hass, "sensor.h", "65")      # RH dips back within the sustain time ...
    await _tick(hass, freezer, 30)
    await _set(hass, "sensor.h", "72")      # ... and crosses again at 1.5 min: its own alert at 4.5 min
    await _tick(hass, freezer, 91)
    assert sorted(a[1] for a in alerts) == ["Grow Tent alert — Soil moisture low (dry)",
                                            "Grow Tent alert — Temperature high (day)",
                                            "Grow Tent alert — Water leak detected"]
    await _tick(hass, freezer, 90)
    assert alerts[-1][0] == 4.5 and alerts[-1][1] == "Grow Tent alert — Humidity high (day)"
    await _set(hass, "sensor.t", "86")
    await _tick(hass, freezer, 600)
    assert len(alerts) == 4


async def test_limit_moved_by_lights_on_alerts_after_settle(hass, freezer):
    """RH 68 all night (night high 70 is fine); lights on: day high 65 is exceeded
    without any crossing."""
    alerts = await _setup(hass, {"humidity_sensor": "sensor.h", "hum_high": 65, "hum_night_high": 70,
                                 "day_sensor": "binary_sensor.day"},
                          {**AIR, "sensor.h": "68", "binary_sensor.day": "off"})
    await _tick(hass, freezer, 3600)
    await _set(hass, "binary_sensor.day", "on")       # at 60 min
    for i in range(60):
        await _tick(hass, freezer, 60)
        if i % 5 == 0:
            await _set(hass, "sensor.h", "68.5" if i % 2 else "68")
    assert len(alerts) == 1 and 75 <= alerts[0][0] <= 76 and "(day)" in alerts[0][1]


async def _reload(hass, inputs):
    with patch("homeassistant.config.load_yaml_config_file", autospec=True,
               return_value={automation.DOMAIN: [_automation_config({**BASE, "extra_actions": EXTRA, **inputs})]}):
        await hass.services.async_call(automation.DOMAIN, "reload", blocking=True)
    await _spin(hass)


async def test_catch_up_on_reload_only_when_this_automation_changed(hass, freezer):
    inputs = {"temp_sensor": "sensor.t", "temp_high": 80}
    alerts = await _setup(hass, inputs, AIR)
    await _set(hass, "sensor.t", "85")
    await _tick(hass, freezer, 181)
    assert len(alerts) == 1
    await _tick(hass, freezer, 120)
    await _reload(hass, inputs)                        # unchanged: keeps running, no second alert
    await _tick(hass, freezer, 600)
    assert len(alerts) == 1
    await _reload(hass, {**inputs, "temp_high": 82})   # edited: re-created, 85 is still too hot
    await _tick(hass, freezer, 181)
    assert len(alerts) == 2


# ---------------------------------------------------------------------------
# 10 — night limits fall back to the day limits
# ---------------------------------------------------------------------------


async def test_night_uses_day_limits_when_no_night_limit_is_set(hass, freezer):
    alerts = await _setup(hass, {"temp_sensor": "sensor.t", "temp_high": 83, "temp_low": 60,
                                 "day_sensor": "binary_sensor.day"},
                          {**AIR, "binary_sensor.day": "off"})
    await _tick(hass, freezer, 3600)
    await _set(hass, "sensor.t", "85")
    await _tick(hass, freezer, 181)
    await _set(hass, "sensor.t", "70")
    await _set(hass, "sensor.t", "55")
    await _tick(hass, freezer, 181)
    assert [a[1] for a in alerts] == ["Grow Tent alert — Temperature high (night)",
                                      "Grow Tent alert — Temperature low (night)"]
    assert "above 83" in alerts[0][2]


# ---------------------------------------------------------------------------
# 11 — flapping readings don't stack repeat loops
# ---------------------------------------------------------------------------


async def test_flapping_reading_does_not_stack_repeat_loops(hass, freezer):
    alerts = await _setup(hass, {"temp_sensor": "sensor.t", "temp_high": 80,
                                 "renotify_after": _every(30)}, AIR)
    for _ in range(4):     # hot for 9 min, below the limit for 1 min, again and again
        await _set(hass, "sensor.t", "81")
        await _tick(hass, freezer, 540)
        await _set(hass, "sensor.t", "79")
        await _tick(hass, freezer, 60)
    assert _running(hass) == 0
    n = len(alerts)
    await _set(hass, "sensor.t", "81")      # now stays hot for an hour
    for _ in range(60):
        await _tick(hass, freezer, 60)
        assert _running(hass) <= 1
    assert [a[0] - 40 for a in alerts[n:]] == [3.0, 33.0]
    await _set(hass, "sensor.t", "70")
    await _spin(hass)
    assert _running(hass) == 0


# ---------------------------------------------------------------------------
# 12 / 13 — input details
# ---------------------------------------------------------------------------


def _bp_data():
    return load_yaml(str(BLUEPRINT))


def test_soil_ec_thresholds_accept_ms_per_cm():
    soil = _bp_data()["blueprint"]["input"]["soil"]["input"]
    for key in ("soil_ec_high", "soil_ec_low"):
        assert soil[key]["selector"]["number"]["step"] <= 0.1


def test_source_url_points_at_the_blueprint_file():
    assert _bp_data()["blueprint"]["source_url"] == (
        "https://github.com/cobragt2000/spider_farmer_bridge/blob/main/"
        "custom_components/sf/blueprints/grow_alerts.yaml")


# ---------------------------------------------------------------------------
# 14 — "device can't keep up"
# ---------------------------------------------------------------------------


async def test_cant_keep_up_uses_night_limit_and_names_the_switch(hass, freezer):
    alerts = await _setup(hass, {"humidity_sensor": "sensor.h", "hum_low": 40, "hum_night_low": 50,
                                 "day_sensor": "binary_sensor.day",
                                 "humidifier_switch": ["switch.hum_a", "switch.hum_b"],
                                 "device_runtime_minutes": 30},
                          {**AIR, "sensor.h": "52", "binary_sensor.day": "off", "switch.hum_a": "off",
                           "switch.hum_b": "off"})
    await _tick(hass, freezer, 3600)
    await _set(hass, "switch.hum_b", "on", {"friendly_name": "Humidifier B"})
    await _set(hass, "sensor.h", "45")       # 45: fine by day (40), too dry at night (50)
    await _tick(hass, freezer, 181)
    hum_low = [a for a in alerts if "Humidity low" in a[1]]
    assert len(hum_low) == 1
    await _tick(hass, freezer, 30 * 60 - 181)
    stuck = [a for a in alerts if "can't keep up" in a[1]]
    assert len(stuck) == 1
    assert "Humidifier B has been on for 30 min" in stuck[0][2] and "below 50" in stuck[0][2]


async def test_cant_keep_up_repeat_stops_when_the_switch_turns_off(hass, freezer):
    alerts = await _setup(hass, {"humidity_sensor": "sensor.h", "hum_low": 40,
                                 "heater_switch": [], "humidifier_switch": ["switch.hum"],
                                 "device_runtime_minutes": 30,
                                 "renotify_after": _every(10)},
                          {**AIR, "sensor.h": "35", "switch.hum": "off"})
    await _set(hass, "switch.hum", "on")
    await _tick(hass, freezer, 30 * 60 + 1)
    assert len([a for a in alerts if "can't keep up" in a[1]]) == 1
    await _set(hass, "switch.hum", "off")    # RH still low, but the humidifier is off now
    for _ in range(3):
        await _tick(hass, freezer, 600)
    assert len([a for a in alerts if "can't keep up" in a[1]]) == 1
