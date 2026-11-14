"""Durable SF data store (SQLite), independent of the recorder. No HA.

Checks round-trip append→samples reconstruction (metrics vs outputs split by
name), per-panel isolation, since_ts filtering, purge (retention), and stats.
See `_backlog_private/AI_CLIMATE_DESIGN.md`.
"""

from custom_components.sf.ai_store import AiStore


def _store():
    # :memory: DB — never touches disk, fresh per test.
    return AiStore(":memory:")


def test_profile_save_list_load_delete_roundtrip():
    s = _store()
    for t in (0.0, 120.0, 240.0):
        s.append("dp1", t, {"temperature": 70.0 + t, "heater": 100.0})
    pid = s.save_profile("Veg tent", "dp1", {"devices": ["heater"], "note": "grow 1"})
    lst = s.list_profiles()
    assert len(lst) == 1
    assert lst[0]["name"] == "Veg tent" and lst[0]["samples"] == 3
    assert lst[0]["meta"]["devices"] == ["heater"]
    # Load into a FRESH panel (merge) — the dataset copies over.
    added = s.load_profile(pid, "dp2")
    assert added == 6                                  # 3 ts × 2 keys
    assert [x.t for x in s.samples("dp2", ["temperature"])] == [0.0, 120.0, 240.0]
    # Replace: loading again with replace clears dp2 first (no duplication).
    s.load_profile(pid, "dp2", replace=True)
    assert len(s.samples("dp2", ["temperature"])) == 3
    # Delete removes the profile + its samples.
    assert s.delete_profile(pid) == 1
    assert s.list_profiles() == []
    s.close()


def test_reset_wipes_samples_but_keeps_profiles():
    # "Clean = start over" (v3.20.34): reset() wipes captured samples for a fresh start,
    # but saved profiles live in their own tables and MUST survive so they can be reloaded.
    s = _store()
    for t in (0.0, 120.0, 240.0):
        s.append("dp1", t, {"temperature": 70.0 + t, "heater": 100.0})
    pid = s.save_profile("Keep me", "dp1", {"devices": ["heater"]})
    assert s.reset(None) > 0                               # wipe everything
    assert s.stats("dp1")["rows"] == 0                     # samples gone
    assert len(s.list_profiles()) == 1                     # profile survived the wipe
    assert s.load_profile(pid, "dp1") == 6                 # and is still reloadable
    s.close()


def test_profile_save_overwrites_same_name():
    s = _store()
    s.append("dp1", 0.0, {"temperature": 70.0, "heater": 0.0})
    s.save_profile("Tent A", "dp1", {})
    s.append("dp1", 120.0, {"temperature": 71.0, "heater": 100.0})
    s.save_profile("Tent A", "dp1", {})               # same name → replace, not duplicate
    lst = s.list_profiles()
    assert len(lst) == 1 and lst[0]["samples"] == 2
    s.close()


def test_append_and_reconstruct_splits_metrics_from_outputs():
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0, "humidity": 55.0, "heater": 50.0})
    s.append("dp1", 120.0, {"temperature": 21.0, "humidity": 54.0, "heater": 100.0})
    got = s.samples("dp1", ["temperature", "humidity"])
    assert [x.t for x in got] == [0.0, 120.0]
    assert got[0].metrics == {"temperature": 20.0, "humidity": 55.0}
    assert got[0].outputs == {"heater": 50.0}
    assert got[1].outputs == {"heater": 100.0}
    s.close()


def test_none_values_are_skipped():
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0, "humidity": None})
    got = s.samples("dp1", ["temperature", "humidity"])
    assert got[0].metrics == {"temperature": 20.0}
    s.close()


def test_panels_are_isolated():
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0})
    s.append("dp3", 0.0, {"temperature": 99.0})
    assert s.samples("dp1", ["temperature"])[0].metrics["temperature"] == 20.0
    assert s.samples("dp3", ["temperature"])[0].metrics["temperature"] == 99.0
    assert s.samples("nope", ["temperature"]) == []
    s.close()


def test_since_ts_filters():
    s = _store()
    for t in (0.0, 60.0, 120.0, 180.0):
        s.append("dp1", t, {"temperature": t})
    got = s.samples("dp1", ["temperature"], since_ts=120.0)
    assert [x.t for x in got] == [120.0, 180.0]
    s.close()


def test_recent_samples_counts_distinct_ts_in_window():
    s = _store()
    # Three snapshots inside the last hour, two older — each ts has 2 key-rows.
    for t in (10000.0, 10030.0, 10090.0, 6000.0, 3000.0):
        s.append("dp1", t, {"temperature": 70.0, "heater": 0.0})
    assert s.recent_samples("dp1", since_ts=10000.0 - 3600.0) == 3   # last hour → 3 samples
    assert s.recent_samples("dp1", since_ts=0.0) == 5                # all
    assert s.recent_samples("dp3", since_ts=0.0) == 0                # other panel
    s.close()


def test_purge_drops_old_rows_and_returns_count():
    s = _store()
    for t in (0.0, 60.0, 120.0, 180.0):
        s.append("dp1", t, {"temperature": t, "heater": 0.0})
    removed = s.purge(before_ts=120.0)  # drops t=0 and t=60 → 2 keys each = 4 rows
    assert removed == 4
    assert [x.t for x in s.samples("dp1", ["temperature"])] == [120.0, 180.0]
    s.close()


def test_trim_sparse_drops_hourly_older_rows_keeps_dense():
    s = _store()
    # Older BLIND rows: hourly (3600 s apart) — even carrying a (zero) gear value, like the
    # statistics backfill, because gear LEVEL sensors have statistics.
    for t in (0.0, 3600.0, 7200.0, 10800.0):
        s.append("dp1", t, {"temperature": 70.0, "heater": 0.0})
    # Dense device-complete rows: 2-min (120 s) apart.
    base = 14400.0
    for i in range(5):
        s.append("dp1", base + i * 120.0, {"temperature": 71.0, "heater": 100.0})
    removed = s.trim_sparse("dp1", dense_max_s=600.0)
    assert removed == 8                               # 4 hourly rows × 2 keys
    kept = [x.t for x in s.samples("dp1", ["temperature"])]
    assert kept == [base + i * 120.0 for i in range(5)]   # only the dense run remains
    # All-dense store → nothing trimmed.
    assert s.trim_sparse("dp1", dense_max_s=600.0) == 0
    s.close()


def test_sample_dropped_when_only_outputs_present():
    # A sample with no metric keys is not a trainable row; reconstruction omits it.
    s = _store()
    s.append("dp1", 0.0, {"heater": 50.0})               # outputs only
    s.append("dp1", 60.0, {"temperature": 20.0, "heater": 50.0})
    got = s.samples("dp1", ["temperature"])
    assert [x.t for x in got] == [60.0]
    s.close()


def test_delete_since_refreshes_recent_window_only():
    # The rebuild replaces the recent window with fine states but leaves older data.
    s = _store()
    for t in (0.0, 3600.0, 7200.0, 10000.0, 10120.0):
        s.append("dp1", t, {"temperature": 20.0})
    removed = s.delete_since("dp1", 7200.0)      # drop the "recent" window
    assert removed == 3                          # 7200, 10000, 10120
    assert [x.t for x in s.samples("dp1", ["temperature"])] == [0.0, 3600.0]
    s.close()


def test_backfill_is_additive_prepend_only():
    # The non-destructive backfill keeps dense recent data and only prepends older
    # rows (t < current earliest). Mirrors async_backfill_older's filter.
    s = _store()
    for t in (1000.0, 1120.0, 1240.0):          # dense recent capture
        s.append("dp1", t, {"temperature": 20.0})
    earliest = s.stats("dp1")["first"]           # 1000
    for t in (0.0, 500.0, 1000.0, 5000.0):       # statistics candidates
        if earliest is None or t < earliest:     # prepend-only filter
            s.append("dp1", t, {"temperature": 19.0})
    st = s.stats("dp1")
    # only 0 and 500 are older than earliest(1000); 1000/5000 skipped; 3 dense kept
    assert st["first"] == 0.0 and st["samples"] == 5
    s.close()


def test_reset_clears_rows_and_seeded_flag():
    # The re-seed action relies on reset() wiping both rows and the seeded flag so
    # the next pass re-imports from scratch (picks up the fuller statistics backfill).
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0})
    s.append("dp3", 0.0, {"temperature": 22.0})
    s.mark_seeded("dp1"); s.mark_seeded("dp3")
    removed = s.reset("dp1")                      # one panel only
    assert removed == 1
    assert s.is_seeded("dp1") is False and s.samples("dp1", ["temperature"]) == []
    assert s.is_seeded("dp3") is True             # other panel untouched
    s.reset()                                     # all panels
    assert s.is_seeded("dp3") is False and s.stats()["rows"] == 0
    s.close()


def test_seeded_flag_is_independent_of_rows():
    # The flag — not row count — gates the one-shot backfill, so a live capture
    # racing ahead of the first seed can't make it think it's already done.
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0})   # a live row exists...
    assert s.is_seeded("dp1") is False             # ...but seeding hasn't run
    s.mark_seeded("dp1")
    assert s.is_seeded("dp1") is True
    assert s.is_seeded("dp3") is False             # per-panel
    s.close()


def test_stats_distinguishes_samples_from_rows_and_size():
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0, "heater": 0.0})    # 2 key-rows, 1 sample
    s.append("dp1", 60.0, {"temperature": 21.0, "heater": 50.0})  # 2 key-rows, 1 sample
    st = s.stats("dp1")
    assert st["rows"] == 4 and st["samples"] == 2
    assert s.size_bytes() == 0        # :memory: DB has no file
    s.close()


def test_stats_overall_and_per_panel():
    s = _store()
    s.append("dp1", 10.0, {"temperature": 20.0})
    s.append("dp1", 20.0, {"temperature": 21.0})
    s.append("dp3", 30.0, {"temperature": 22.0})
    overall = s.stats()
    assert overall["rows"] == 3 and overall["first"] == 10.0 and overall["last"] == 30.0
    one = s.stats("dp1")
    assert one["rows"] == 2 and one["first"] == 10.0 and one["last"] == 20.0
    empty = s.stats("nope")
    assert empty["rows"] == 0 and empty["first"] is None
    s.close()
