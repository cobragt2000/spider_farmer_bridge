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

import pytest
from homeassistant.components import automation
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from homeassistant.util.yaml import load_yaml

try:  # Home Assistant 2026.11+
    from pytest_homeassistant.common import async_fire_time_changed
except ImportError:  # older cores: community plugin
    from pytest_homeassistant_custom_component.common import async_fire_time_changed  # type: ignore[no-redef]

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
