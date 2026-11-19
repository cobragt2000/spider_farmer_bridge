"""Adaptive climate — Home Assistant-backed regressions fixed in v3.20.52.

These run the real HA glue (options listener, timers, services, sensor) with the durable
store and recorder mocked or in a temp dir. Nothing here talks to a real controller."""

import asyncio
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
def _custom(enable_custom_integrations, hass, tmp_path):
    """Load the custom integration, in a config dir of this test's own: the older test
    plugin shares one config dir between tests, so the durable store (config/sf) would
    carry rows from one test into the next."""
    hass.config.config_dir = str(tmp_path)
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
    # v3.20.52 fix: the listener treated AI as "device control AND ai_learn" while setup
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
    # v3.20.52 fix: only the controller light channels (light_1/light_2) were recognised,
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


async def test_ai_sensor_records_little_and_only_on_change(
        recorder_mock, hass: HomeAssistant, enable_custom_integrations, hass_storage):
    # v3.20.52 fix: every 15-s pass stamped a fresh last_fit, so the sensor wrote a new
    # state row AND a new ~3 KB attributes row each time (~17 MB/day per panel), and
    # rewrote .storage/sf_ai_model_<slot> (never read) for every slot.
    from sqlalchemy import text
    from custom_components.sf.ai_store import AiStore
    from test_integration import CB_MAC_LC, _simulate_cb
    try:
        from pytest_homeassistant.components.recorder.common import async_wait_recording_done
    except ImportError:
        from pytest_homeassistant_custom_component.components.recorder.common import (
            async_wait_recording_done)

    with patch("custom_components.sf.ai_learn.async_learn_bus"), \
         patch("custom_components.sf.ai_learn.async_capture_bus"):
        entry = await _setup_entry(hass, 19310, {"ai_learn": True})
        bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
        _simulate_cb(hass, bus)
        await hass.async_block_till_done()
        eid = next(e for e in hass.states.async_entity_ids() if e.endswith("_ai_confidence"))
        slot = eid[len("sensor.sf_"):-len("_ai_confidence")]
        store = AiStore(":memory:")
        now = time.time()
        for i in range(500):                                  # idle capture history
            store.append(slot, now - 3600 - (500 - i) * 300,
                         {"temperature": 24 + (i % 9) * 0.1, "humidity": 60.0 + i % 5,
                          "blower": 40.0 + (i % 3) * 10})

        def counts():
            from homeassistant.components.recorder import get_instance
            with get_instance(hass).engine.connect() as c:
                mid = c.execute(text("SELECT metadata_id FROM states_meta WHERE entity_id=:e"),
                                {"e": eid}).scalar()
                rows = c.execute(text("SELECT COUNT(*) FROM states WHERE metadata_id=:m"),
                                 {"m": mid}).scalar()
                attrs = [r[0] for r in c.execute(text(
                    "SELECT sa.shared_attrs FROM state_attributes sa WHERE sa.attributes_id IN "
                    "(SELECT attributes_id FROM states WHERE metadata_id=:m)"), {"m": mid})]
                return rows, attrs

        await async_wait_recording_done(hass)
        rows0, _ = await hass.async_add_executor_job(counts)
        for k in range(60):                                   # 15 min of 15-s passes
            if k % 20 == 0:                                   # a capture every 300 s
                store.append(slot, time.time(), {"temperature": 24.3, "humidity": 61.0,
                                                 "blower": 50.0})
            await ai_learn.async_learn_panel(hass, bus, slot, CB_MAC_LC, store=store)
            await hass.async_block_till_done()
        await async_wait_recording_done(hass)
        rows1, attrs = await hass.async_add_executor_job(counts)
        st = hass.states.get(eid)
        assert rows1 - rows0 == 3                             # one per change, not 60
        assert all("models" not in a and "last_fit" not in a for a in attrs)
        assert st.attributes["models"] and st.attributes["store_enabled"] is True   # card view
        assert not [k for k in hass_storage if k.startswith("sf_ai_model")]
        store.close()
        await _unload(hass, entry)


def test_ai_sensor_restores_state_and_attributes():
    # Restore fed the saved STATE ("47.3") into the JSON payload handler → unknown + no
    # attributes after every restart until the first pass.
    from custom_components.sf.entity_defs import SfDef
    from custom_components.sf.sensor import SfAiSensor
    d = SfDef(platform="sensor", field="ai_confidence", name="AI Confidence",
              mac="0a1b2c3d4e01", mac_raw="0A1B2C3D4E01", device_name="SF Panel",
              device_model="Display Panel", unit="%", kind="ai")
    s = SfAiSensor.__new__(SfAiSensor)
    s.d = d
    s._attr_native_value = None
    s._attr_extra_state_attributes = {"sf_device": d.mac}
    models = {"temperature": {"drift": 0.01, "gains": {"blower": -0.001}, "n": 10}}
    last = SimpleNamespace(state="47.3", attributes={
        "sf_device": d.mac, "models": models, "store_enabled": True, "store_rows": 1234,
        "history_days": 3.5, "profiles": [{"id": 1, "name": "g"}], "unit_of_measurement": "%"})
    s._restore(last)
    assert s._attr_native_value == 47.3
    a = s._attr_extra_state_attributes
    assert a["models"] == models and a["store_enabled"] is True and a["store_rows"] == 1234
    assert a["history_days"] == 3.5 and a["profiles"] == [{"id": 1, "name": "g"}]


async def test_store_confidence_is_scored_by_covered_time(hass: HomeAssistant):
    # One busy day of 6-s capture is 14,400 rows — twice the old 7,200-row "enough data"
    # bar — but only 1 of the ~10 days the bar stands for.
    from custom_components.sf.ai_store import AiStore
    hass.states.async_set("sensor.sf_dp1_temperature", "24.0")
    hass.states.async_set("sensor.sf_dp1_blower_speed", "40")
    store = AiStore(":memory:")
    now, temp = time.time(), 24.0
    for i in range(14400):
        blower = 80.0 if (i // 50) % 2 else 20.0
        temp += (0.05 - 0.001 * blower) * 0.1
        store.append("dp1", now - 86400 + i * 6, {"temperature": round(temp, 3), "blower": blower})
    bus = SimpleNamespace(publish=lambda *a, **k: None)
    res = await ai_learn.async_learn_panel(hass, bus, "dp1", "aa", store=store)
    md = res["models"]["temperature"]
    assert md["n"] > 7200 and md["r2"] > 0.5
    assert md["confidence"] <= 0.1 + 1e-9
    store.close()



async def test_store_path_slow_level_reads_only_new_rows(hass: HomeAssistant):
    # Store on, learning speed Slow (all data, the default): each 15-s pass loaded the whole
    # store. After the first pass only about the last hour is read.
    from custom_components.sf.ai_store import AiStore
    hass.states.async_set("sensor.sf_dp1_temperature", "24.0")
    hass.states.async_set("sensor.sf_dp1_humidity", "60")
    hass.states.async_set("sensor.sf_dp1_blower_speed", "40")
    store = AiStore(":memory:")
    now = time.time()
    for i in range(3 * 24 * 60):                           # 3 days, a row per minute
        store.append("dp1", now - 3 * 86400 + i * 60, {
            "temperature": 24 + (i % 11) * 0.05, "humidity": 60.0 + (i % 7), "blower": 40.0 + (i % 3) * 20})
    calls = []
    orig = store.samples

    def spy(panel, metrics, since_ts=0.0, until_ts=None):
        calls.append(since_ts)
        return orig(panel, metrics, since_ts, until_ts)

    store.samples = spy
    bus = SimpleNamespace(publish=lambda *a, **k: None)
    first = await ai_learn.async_learn_panel(hass, bus, "dp1", "aa", store=store)
    calls.clear()
    store.append("dp1", now, {"temperature": 24.5, "humidity": 61.0, "blower": 60.0})
    second = await ai_learn.async_learn_panel(hass, bus, "dp1", "aa", store=store)
    assert calls and min(calls) > now - 2 * 3600, [now - c for c in calls]
    assert second["samples"] == first["samples"] + 1
    # …and the result is the full fit: a fresh bus (no cached fold) gives the same numbers.
    # (The forecast test — and the learning % it can halve — is recomputed only every 10
    # minutes by design, so compare the fitted numbers.)
    def fitted(res):
        return {m: {k: v for k, v in md.items() if k not in ("forecast", "confidence")}
                for m, md in res["models"].items()}

    third = await ai_learn.async_learn_panel(
        hass, SimpleNamespace(publish=lambda *a, **k: None), "dp1", "aa", store=store)
    assert fitted(third) == fitted(second)
    # Rows changed other than by appending (purge) → the fold is rebuilt, still exact.
    store.purge(now - 86400)
    fourth = await ai_learn.async_learn_panel(hass, bus, "dp1", "aa", store=store)
    fresh = await ai_learn.async_learn_panel(
        hass, SimpleNamespace(publish=lambda *a, **k: None), "dp1", "aa", store=store)
    assert fourth["samples"] == fresh["samples"] < second["samples"]
    assert fitted(fourth) == fitted(fresh)
    store.close()


def test_to_celsius():
    assert ai_learn.to_celsius(77.0, "°F") == 25.0
    assert ai_learn.to_celsius(25.0, "°C") == 25.0
    assert ai_learn.to_celsius(25.0, None) == 25.0
    assert abs(ai_learn.to_celsius(298.15, "K") - 25.0) < 1e-9
    assert ai_learn.to_celsius(None, "°F") is None


async def test_capture_stores_celsius_whatever_ha_displays(hass: HomeAssistant):
    from custom_components.sf.ai_store import AiStore
    store = AiStore(":memory:")
    bus = SimpleNamespace(_slot_cache={"aa": "dp1"}, _ai_zones=[])
    hass.states.async_set("sensor.sf_dp1_blower_speed", "40")
    hass.states.async_set("sensor.intake", "50.0", {"unit_of_measurement": "°F"})
    hass.states.async_set("sensor.sf_dp1_alarm_settings", "ok",
                          {"card_options": {"ai_ambient_temp": "sensor.intake"}})
    hass.states.async_set("sensor.sf_dp1_temperature", "77.0", {"unit_of_measurement": "°F"})
    await ai_learn.async_capture_bus(hass, bus, store)
    # The user switches HA to °C: same air, other numbers on screen.
    bus._ai_last_write.clear()
    hass.states.async_set("sensor.sf_dp1_temperature", "25.1", {"unit_of_measurement": "°C"})
    hass.states.async_set("sensor.intake", "10.0", {"unit_of_measurement": "°C"})
    await asyncio.sleep(0.01)
    await ai_learn.async_capture_bus(hass, bus, store)
    got = store.samples("dp1", ["temperature"])
    assert [round(s.metrics["temperature"], 3) for s in got] == [25.0, 25.1]
    assert [round(s.outputs["ambient_temperature"], 3) for s in got] == [10.0, 10.0]
    store.close()


async def test_store_results_are_shown_in_the_display_unit(hass: HomeAssistant):
    # Learned in °C; a °F install sees °F rates (the card labels them with the sensor unit).
    from custom_components.sf.ai_store import AiStore
    store = AiStore(":memory:")
    now, temp = time.time(), 24.0
    for i in range(3000):
        blower = 80.0 if (i // 40) % 2 else 20.0
        store.append("dp1", now - 3000 * 60 + i * 60, {"temperature": temp, "blower": blower})
        temp += (0.05 - 0.001 * blower) * 1.0           # °C per 1-min step
    hass.states.async_set("sensor.sf_dp1_blower_speed", "40")
    results = {}
    for unit in ("°C", "°F"):
        hass.states.async_set("sensor.sf_dp1_temperature", "24", {"unit_of_measurement": unit})
        bus = SimpleNamespace(publish=lambda *a, **k: None)
        results[unit] = (await ai_learn.async_learn_panel(
            hass, bus, "dp1", "aa", store=store))["models"]["temperature"]
    c, f = results["°C"], results["°F"]
    assert abs(c["gains"]["blower"] - (-0.001)) < 2e-5
    assert abs(f["gains"]["blower"] - c["gains"]["blower"] * 1.8) < 2e-5
    assert abs(f["drift"] - c["drift"] * 1.8) < 2e-4
    assert f["r2"] == c["r2"] and f["confidence"] == c["confidence"]
    store.close()
