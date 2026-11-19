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


# ── audit 3.20.51 regressions ─────────────────────────────────────────────────

def test_concurrent_capture_fit_and_profile_ops_do_not_corrupt_transactions(tmp_path):
    # One sqlite3 connection is shared by several executor threads (capture every 5 s, fit
    # every 15 s, profile actions, purge). Without a lock they interleave inside each
    # other's transactions: "cannot commit - no transaction is active", "cannot start a
    # transaction within a transaction", SystemError.
    import threading
    import time
    s = AiStore(str(tmp_path / "s.db"))
    for i in range(300):
        s.append("dp1", 1000.0 + i, {"temperature": 20.0, "blower": 50.0})
    errors: list = []
    stop = time.time() + 1.0

    def reader():
        while time.time() < stop:
            try:
                s.samples("dp1", ["temperature"]); s.stats("dp1"); s.list_profiles()
            except Exception as e:  # noqa: BLE001
                errors.append(repr(e))

    def writer():
        t = 10000.0
        while time.time() < stop:
            try:
                s.append("dp1", t, {"temperature": 21.0, "blower": 40.0})
                t += 1.0
            except Exception as e:  # noqa: BLE001
                errors.append(repr(e))

    def profiler():
        while time.time() < stop:
            try:
                s.save_profile("p", "dp1", {}); s.delete_profile_by_name("p")
            except Exception as e:  # noqa: BLE001
                errors.append(repr(e))

    threads = [threading.Thread(target=f) for f in (reader, writer, profiler)]
    for th in threads:
        th.start()
    for th in threads:
        th.join()
    assert errors == []
    st = s.stats("dp1")
    s.close()
    fresh = AiStore(str(tmp_path / "s.db"))            # cached counts == a real recount
    assert fresh.stats("dp1") == st
    fresh.close()


def test_close_waits_for_an_inflight_read(tmp_path):
    import threading
    import time
    s = AiStore(str(tmp_path / "s.db"))
    with s._tx() as db:
        db.executemany("INSERT INTO samples (panel, ts, k, v) VALUES (?,?,?,?)",
                       [("dp1", float(i), "temperature", 1.0) for i in range(200000)])
    out = []
    reading = threading.Event()
    conn = s._conn

    def slow_conn():                                   # called with the store lock held
        reading.set()
        time.sleep(0.05)
        return conn()

    s._conn = slow_conn
    th = threading.Thread(target=lambda: out.append(len(s.samples("dp1", ["temperature"]))))
    th.start()
    assert reading.wait(5)
    s._conn = conn
    s.close()                                          # must wait, not tear the read apart
    th.join()
    assert out == [200000]
    assert s.closed
    import sqlite3
    try:
        s.stats("dp1")
        raise AssertionError("closed store answered")
    except sqlite3.ProgrammingError:
        pass
    s.close()                                          # idempotent


def test_profile_save_is_atomic():
    # Save = delete the old same-name profile + insert + copy. A failure part-way used to
    # leave the old profile deleted and nothing in its place.
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0})
    s.save_profile("Grow", "dp1", {"note": "first"})
    try:
        s.save_profile("Grow", "dp1", {"bad": object()})    # not JSON-serialisable
    except TypeError:
        pass
    lst = s.list_profiles()
    assert len(lst) == 1 and lst[0]["meta"] == {"note": "first"} and lst[0]["samples"] == 1
    s.close()


def test_merging_a_profile_twice_does_not_duplicate_rows():
    s = _store()
    for t in (0.0, 60.0, 120.0):
        s.append("dp1", t, {"temperature": 20.0, "blower": 50.0})
    pid = s.save_profile("Grow", "dp1", {})
    s.reset(None)
    assert s.load_profile(pid, "dp1") == 6
    assert s.load_profile(pid, "dp1") == 0                 # already there → nothing added
    st = s.stats("dp1")
    assert st["rows"] == 6 and st["samples"] == 3
    s.close()


def test_retention_purge_keeps_rows_loaded_from_a_profile():
    # A loaded profile keeps its original (old) timestamps; the time-based purge deleted the
    # warm start at the next daily run. Loaded rows are exempt; live capture still ages out.
    s = _store()
    old = 1000.0
    for i in range(10):
        s.append("dp1", old + i * 60, {"temperature": 24.0, "blower": 50.0})
    pid = s.save_profile("last grow", "dp1", {})
    s.reset(None)
    s.load_profile(pid, "dp1")
    for i in range(5):                                    # old live rows: purgeable
        s.append("dp1", 500.0 + i, {"temperature": 22.0})
    for i in range(5):                                    # new live rows
        s.append("dp1", 1e6 + i, {"temperature": 25.0})
    removed = s.purge(before_ts=1e5)
    assert removed == 5
    ts = [x.t for x in s.samples("dp1", ["temperature"])]
    assert ts == [old + i * 60 for i in range(10)] + [1e6 + i for i in range(5)]
    s.reset(None)                                          # "clean" still removes everything
    assert s.stats("dp1")["rows"] == 0
    s.close()


def test_merge_marks_overlapping_live_rows_as_profile_data():
    s = _store()
    for t in (0.0, 60.0):
        s.append("dp1", t, {"temperature": 20.0})
    pid = s.save_profile("Grow", "dp1", {})
    assert s.load_profile(pid, "dp1") == 0                # all rows already present…
    assert s.purge(before_ts=1e9) == 0                    # …and now kept as the warm start
    s.close()


def test_schema_migration_from_3_20_51_store(tmp_path):
    # An existing store: old schema and a profile merged twice (duplicate rows).
    import sqlite3
    path = str(tmp_path / "old.db")
    db = sqlite3.connect(path)
    db.execute("CREATE TABLE samples (panel TEXT, ts REAL, k TEXT, v REAL)")
    db.execute("CREATE INDEX ix_panel_ts ON samples (panel, ts)")
    db.execute("CREATE TABLE meta (panel TEXT PRIMARY KEY, seeded INTEGER)")
    db.execute("CREATE TABLE profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, "
               "panel TEXT, created REAL, meta TEXT)")
    db.execute("CREATE TABLE profile_samples (profile_id INTEGER, ts REAL, k TEXT, v REAL)")
    rows = [("dp1", 0.0, "temperature", 25.0), ("dp1", 0.0, "humidity", 60.0),
            ("dp1", 0.0, "blower", 40.0)]
    db.executemany("INSERT INTO samples VALUES (?,?,?,?)", rows + rows)      # duplicated
    db.commit()
    db.close()

    s = AiStore(path)
    got = s.samples("dp1", ["temperature", "humidity"])
    assert len(got) == 1 and s.stats("dp1")["rows"] == 3                  # duplicates gone
    assert got[0].metrics == {"temperature": 25.0, "humidity": 60.0}
    s.append("dp1", 0.0, {"temperature": 25.0})                            # still unique
    assert s.stats("dp1")["rows"] == 3
    s.close()
    again = AiStore(path)                                                   # opens cleanly
    sql = again._db.execute("SELECT sql FROM sqlite_master WHERE name='samples'").fetchone()[0]
    assert "WITHOUT ROWID" in sql
    names = {r[0] for r in again._db.execute("SELECT name FROM sqlite_master")}
    assert "ix_panel_ts" not in names and "samples_v2" not in names
    assert again.purge(1.0) == 3                                           # live rows: purgeable
    again.close()


def test_store_is_compact(tmp_path):
    # Keyed WITHOUT ROWID table: no separate index → about 160 B per 5-value sample here
    # (the 3.20.51 rowid table + (panel, ts) index took ~280 B).
    import os
    path = str(tmp_path / "s.db")
    s = AiStore(path)
    with s._tx() as db:
        db.executemany("INSERT INTO samples (panel, ts, k, v) VALUES (?,?,?,?)",
                       [("dp1", 1.7e9 + i * 60.0, k, 24.1) for i in range(20000)
                        for k in ("temperature", "humidity", "vpd", "blower", "light_1")])
    s.vacuum()
    s.close()
    assert os.path.getsize(path) / 20000 < 200


def test_rows_without_a_value_are_skipped():
    # SQLite stores NaN as NULL; such rows (from an old 'nan' state) must not reach the fit.
    s = _store()
    s.append("dp1", 0.0, {"temperature": 20.0, "blower": 50.0})
    s._db.execute("INSERT INTO samples (panel, ts, k, v) VALUES ('dp1', 0.0, 'heater', NULL)")
    got = s.samples("dp1", ["temperature"])
    assert got[0].outputs == {"blower": 50.0}
    s.close()


def test_cached_coverage_and_profile_list_stay_exact():
    # stats() and list_profiles() ran a COUNT(DISTINCT) over the whole store on every 15-s
    # pass; they are now counted once and kept current. They must always equal a recount.
    s = _store()

    def recount(panel):
        s._stats_cache.clear()
        return s.stats(panel)

    def check():
        for p in ("dp1", "dp2", None):
            cached = s.stats(p)
            assert cached == recount(p), p

    gen = s.generation
    for t in (10.0, 20.0, 30.0):
        s.append("dp1", t, {"temperature": 20.0, "blower": 1.0})
        s.append("dp2", t, {"temperature": 21.0})
        check()
    assert s.generation == gen                       # appends don't invalidate a fold
    s.append("dp1", 15.0, {"temperature": 20.5})     # out of order
    check()
    s.append("dp1", 30.0, {"temperature": 20.0})     # duplicate → ignored
    check()
    pid = s.save_profile("p", "dp1", {})
    assert [p["name"] for p in s.list_profiles()] == ["p"]
    s.purge(16.0)
    check()
    assert s.generation > gen
    s.load_profile(pid, "dp2")
    check()
    s.reset("dp1")
    check()
    s.delete_profile(pid)
    assert s.list_profiles() == []
    s.close()
