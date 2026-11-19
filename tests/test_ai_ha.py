"""Adaptive climate — Home Assistant-backed regressions from the 3.20.51 audit.

These run the real HA glue (options listener, timers, services, sensor) with the durable
store and recorder mocked or in a temp dir. Nothing here talks to a real controller."""

import time
from types import SimpleNamespace
from unittest.mock import patch

from homeassistant.core import HomeAssistant

from custom_components.sf import ai_learn


def _rec_rows(series):
    """[(epoch, state)] → the dict rows get_significant_states(minimal_response) yields."""
    from homeassistant.util import dt as dt_util
    return [{"state": v, "last_changed": dt_util.utc_from_timestamp(t).isoformat()}
            for t, v in series]


async def test_recorder_path_reads_only_new_history_after_first_pass(hass: HomeAssistant):
    """Store off (the default): the 15-s live pass re-read 10 days of recorder history
    every time. After the first pass only the increment since the last read is fetched."""
    now = time.time()
    db = {
        "sensor.sf_dp1_temperature": [(now - 10 * 86400 + i * 60, f"{24 + (i % 5) * 0.1:.1f}")
                                      for i in range(14400)],
        "sensor.sf_dp1_blower_speed": [(now - 10 * 86400 + i * 600, str(30 + (i % 3) * 20))
                                       for i in range(1440)],
    }
    for eid, series in db.items():
        hass.states.async_set(eid, series[-1][1])
    calls = []

    def fake_states(_hass, start, end, eids, **kw):
        calls.append((start.timestamp(), end.timestamp(), kw.get("include_start_time_state", True)))
        out = {}
        for eid in eids:
            rows = [r for r in db.get(eid, []) if start.timestamp() < r[0] < end.timestamp()]
            if kw.get("include_start_time_state", True):
                before = [r for r in db.get(eid, []) if r[0] < start.timestamp()]
                if before:
                    rows = [(start.timestamp(), before[-1][1])] + rows
            if rows:
                out[eid] = _rec_rows(rows)
        return out

    bus = SimpleNamespace(publish=lambda *a, **k: None)
    rec = SimpleNamespace(async_add_executor_job=hass.async_add_executor_job)
    with patch("homeassistant.components.recorder.history.get_significant_states", fake_states), \
         patch("homeassistant.components.recorder.get_instance", return_value=rec):
        first = await ai_learn.async_learn_panel(hass, bus, "dp1", "aa", days=10)
        second = await ai_learn.async_learn_panel(hass, bus, "dp1", "aa", days=10)
    assert len(calls) == 2
    s1, e1, _ = calls[0]
    s2, e2, inc2 = calls[1]
    assert e1 - s1 > 9 * 86400                 # first pass: the full window
    assert e2 - s2 < 3600, (e2 - s2)           # then only the last few minutes
    assert inc2 is False                       # …without a synthetic start-state row
    assert second["samples"] == first["samples"]
    assert second["models"]["temperature"]["gains"] == first["models"]["temperature"]["gains"]
