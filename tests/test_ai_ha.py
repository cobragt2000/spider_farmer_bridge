"""Adaptive climate — Home Assistant-backed regressions from the 3.20.51 audit.

These run the real HA glue (options listener, timers, services, sensor) with the durable
store and recorder mocked or in a temp dir. Nothing here talks to a real controller."""

import time
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from ha_compat import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.sf import ai_learn
from custom_components.sf.const import DATA_BUS, DOMAIN

try:
    from pytest_homeassistant.common import async_fire_time_changed
except ImportError:  # older cores: community plugin
    from pytest_homeassistant_custom_component.common import async_fire_time_changed


def _rec_rows(series):
    """[(epoch, state)] → the dict rows get_significant_states(minimal_response) yields."""
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


# ── integration setup / options (needs the custom integration loaded) ─────────

@pytest.fixture
def _custom(enable_custom_integrations):
    yield


async def _setup_entry(hass, port, options, allow_control=True):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": port, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": allow_control},
        options=options, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _unload(hass, entry):
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


_ZONE = {"id": "z", "name": "Z", "sensor_panel": "dp1", "device_panels": [], "external": []}


@pytest.mark.parametrize("options", [
    {"ai_learn": True},                                   # AI on, device control off
    {"ai_learn": False, "ai_zones": [_ZONE]},              # AI off, a zone configured
    {"ai_learn": True, "ai_store": False, "ai_retention_days": 30},   # retention w/o store
])
async def test_option_write_does_not_reload_when_ai_settings_unchanged(hass, _custom, options):
    # Audit 3.20.51: the listener treated AI as "device control AND ai_learn" while setup
    # (since 3.20.30) uses ai_learn alone, and compared configured zones although setup
    # keeps none while AI is off — so every card-option write reloaded the integration and
    # dropped the controller connections.
    entry = await _setup_entry(hass, 19301, options, allow_control=False)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, "card_options": {"aabbcc": {"ai_learn_level": "fast"}}})
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][entry.entry_id][DATA_BUS] is bus
    await _unload(hass, entry)


async def test_option_write_still_reloads_when_ai_settings_change(hass, _custom):
    entry = await _setup_entry(hass, 19302, {"ai_learn": True}, allow_control=False)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    hass.config_entries.async_update_entry(entry, options={**entry.options, "ai_zones": [_ZONE]})
    await hass.async_block_till_done()
    bus2 = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    assert bus2 is not bus and bus2._ai_zones == [_ZONE]
    await _unload(hass, entry)


async def test_store_that_failed_to_open_does_not_reload_on_every_write(hass, _custom):
    with patch("custom_components.sf.ai_store.AiStore.__init__", side_effect=OSError("disk")):
        entry = await _setup_entry(hass, 19303, {"ai_learn": True, "ai_store": True})
    assert "ai_store" not in hass.data[DOMAIN][entry.entry_id]
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, "card_options": {"aabbcc": {"x": "1"}}})
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][entry.entry_id][DATA_BUS] is bus
    await _unload(hass, entry)


async def test_retention_purge_runs_shortly_after_setup(hass, _custom):
    # The purge was only a 24-h interval timer, so with restarts/reloads more often than
    # daily it never ran.
    with patch("custom_components.sf.ai_learn.async_learn_bus"):
        entry = await _setup_entry(
            hass, 19304, {"ai_learn": True, "ai_store": True, "ai_retention_days": 1})
        st = hass.data[DOMAIN][entry.entry_id]["ai_store"]
        await hass.async_add_executor_job(
            st.append, "dp1", time.time() - 30 * 86400, {"temperature": 20.0})
        await hass.async_add_executor_job(st.append, "dp1", time.time(), {"temperature": 21.0})
        async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=30))
        await hass.async_block_till_done()
        assert (await hass.async_add_executor_job(st.stats, "dp1"))["rows"] == 1
        await _unload(hass, entry)


async def test_saving_a_zone_reloads_once(hass, _custom, monkeypatch):
    entry = await _setup_entry(hass, 19305, {"ai_learn": True})
    import custom_components.sf as sf_init
    setups = []
    orig = sf_init.async_setup_entry

    async def counting(h, e):
        setups.append(1)
        return await orig(h, e)

    monkeypatch.setattr(sf_init, "async_setup_entry", counting)
    from custom_components.sf.config_flow import SfBridgeOptionsFlow
    flow = SfBridgeOptionsFlow(entry)
    flow.hass = hass
    flow.handler = entry.entry_id
    flow.flow_id = "x"
    flow._save_zones([_ZONE])
    await hass.async_block_till_done()
    assert len(setups) == 1
    assert hass.data[DOMAIN][entry.entry_id][DATA_BUS]._ai_zones == [_ZONE]
    await _unload(hass, entry)


async def test_profile_actions_without_panel_use_the_learnable_panel(hass, _custom):
    # The card sends no panel; the first slot (an SE light here) was picked, so the profile
    # was saved from — and loaded into — a slot with no data.
    entry = await _setup_entry(hass, 19306, {
        "ai_learn": True, "ai_store": True,
        "device_slots": {"aaaaaaaaaaa1": "se1", "bbbbbbbbbbb2": "dp1"}})
    data = hass.data[DOMAIN][entry.entry_id]
    bus, st = data[DATA_BUS], data["ai_store"]
    bus._slot_cache.update({"aaaaaaaaaaa1": "se1", "bbbbbbbbbbb2": "dp1"})
    for eid, val in (("sensor.sf_dp1_temperature", "24.0"), ("sensor.sf_dp1_humidity", "60"),
                     ("sensor.sf_dp1_blower_speed", "50"), ("sensor.sf_se1_light_1_brightness", "80")):
        hass.states.async_set(eid, val)
    for i in range(50):
        await hass.async_add_executor_job(
            st.append, "dp1", time.time() - 3000 + i * 60, {"temperature": 24.0, "blower": 50.0})
    await hass.services.async_call(DOMAIN, "ai_save_profile", {"name": "grow1"}, blocking=True)
    profs = await hass.async_add_executor_job(st.list_profiles)
    assert profs[0]["panel"] == "dp1" and profs[0]["samples"] == 50
    assert profs[0]["meta"]["devices"] == ["blower"]           # device check on the right panel
    await hass.async_add_executor_job(st.reset, None)
    await hass.services.async_call(DOMAIN, "ai_load_profile", {"name": "grow1"}, blocking=True)
    assert (await hass.async_add_executor_job(st.stats, "dp1"))["samples"] == 50
    assert (await hass.async_add_executor_job(st.stats, "se1"))["samples"] == 0
    await _unload(hass, entry)


async def test_day_night_split_with_grow_light_on_a_role_tagged_outlet(hass: HomeAssistant):
    # Audit 3.20.51: only the controller light channels (light_1/light_2) were recognised,
    # so a grow light on a plug outlet (role "light") or an external entity got no
    # day/night models.
    import json
    from custom_components.sf.ai_store import AiStore
    hass.states.async_set("sensor.sf_dp1_temperature", "24.0")
    hass.states.async_set("sensor.sf_dp1_blower_speed", "40")
    hass.states.async_set("switch.sf_dp1_outlet_3", "on")
    hass.states.async_set("select.sf_dp1_outlet_3_mode", "Manual")
    hass.states.async_set("sensor.sf_dp1_alarm_settings", "ok", {"card_options": {
        "ai_outlet_roles": json.dumps({"dp1:outlet_3": "light"})}})
    store = AiStore(":memory:")
    t0 = time.time() - 2 * 86400
    for i in range(2 * 24 * 12):                        # 2 days, every 5 min
        t = t0 + i * 300
        lit = 100.0 if (i // 12) % 24 < 16 else 0.0      # 16 h on / 8 h off
        store.append("dp1", t, {"temperature": 24.0 + (i % 7) * 0.1,
                                "blower": 40.0 + (i % 3) * 10, "outlet_3": lit})
    bus = SimpleNamespace(publish=lambda *a, **k: None)
    res = await ai_learn.async_learn_panel(hass, bus, "dp1", "aa", store=store)
    assert "day" in res and "night" in res
    assert res["day"]["samples"] + res["night"]["samples"] == res["samples"]
    assert res["day"]["samples"] > res["night"]["samples"] > 0
    store.close()


def test_light_keys_follow_the_light_role():
    specs = {"outlet_3": {"effort": "switch", "role": "light"},
             "ext_1": {"effort": "switch", "external": True, "role": "light"},
             "ext_2": {"effort": "switch", "external": True, "role": "other"},
             "ac5:light_2": {"effort": "speed"}, "heater": {"effort": "gear"}}
    assert ai_learn._light_keys(list(specs), specs) == ["outlet_3", "ext_1", "ac5:light_2"]
    assert ai_learn._light_keys(list(specs)) == ["ac5:light_2"]        # names only (old call)
