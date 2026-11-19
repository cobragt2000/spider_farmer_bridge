"""Adaptive climate — durable SF data store (SQLite), independent of the recorder.

Home Assistant's recorder purges globally (`purge_keep_days`, default 10) and an
integration can't change that or ask for per-entity retention. So the adaptive-
climate layer keeps its OWN compact time-series of the climate metrics + device
efforts, with a user-set retention (0 = keep everything). The learner trains from
this store, so its history is never capped by the recorder's purge.

One narrow table — `samples(panel, ts, k, v, loaded)` — so each panel can carry a
different set of metric/device keys. A capture tick writes one row per key at a
shared `ts`; reconstruction groups rows by `ts` back into `Sample`s. The table is
clustered on its key (panel, ts, k) — a WITHOUT ROWID table needs no separate index, so
it takes ~40 % less disk than the old rowid table + (panel, ts) index, and the key is
unique, so loading the same profile twice can't duplicate rows. `loaded` = 1
marks rows copied in from a saved learning profile: the retention purge keeps them
(they are the warm start the user asked for); only "clean" or a replacing load
removes them.

**Sync SQLite** — every method here does blocking DB I/O, so callers MUST run them
via `hass.async_add_executor_job(...)`, never on the event loop (see CLAUDE.md
"HA event-loop safety"). Several executor threads use the one connection (capture,
fit, purge, profile actions, close on unload), so every access holds `_lock` and
every multi-statement change is one transaction. No device is actuated from this
module.
"""

from __future__ import annotations

import json
import os
import sqlite3
import threading
import time
from contextlib import contextmanager
from typing import Mapping, Sequence

from .ai_climate import Sample


# Schema history (PRAGMA user_version):
#   0 — ≤ 3.20.51: samples(panel, ts, k, v) + index (panel, ts); values in HA's display unit.
#   1 — (development only) samples.loaded flag + UNIQUE (panel, ts, k) index.
#   2 — samples rebuilt as a WITHOUT ROWID table keyed (panel, ts, k), with `loaded`.
SCHEMA_VERSION = 2
_CREATE_SAMPLES = (
    "CREATE TABLE IF NOT EXISTS {name} (panel TEXT NOT NULL, ts REAL NOT NULL, "
    "k TEXT NOT NULL, v REAL, loaded INTEGER NOT NULL DEFAULT 0, "
    "PRIMARY KEY (panel, ts, k)) WITHOUT ROWID")


class AiStore:
    """SQLite-backed time-series for one integration instance (all panels)."""

    def __init__(self, path: str):
        self._path = path
        self._lock = threading.RLock()
        # check_same_thread=False: the store is only ever touched from executor threads;
        # `_lock` serialises them. isolation_level=None: no implicit transactions — each
        # multi-statement change opens its own (see `_tx`).
        self._db: sqlite3.Connection | None = sqlite3.connect(
            path, check_same_thread=False, isolation_level=None)
        # Bumped whenever rows change other than by appending newer captures (purge, clean,
        # profile load, …), so readers that keep derived results (the incremental fit, the
        # cached coverage numbers) know to rebuild them.
        self.generation = 0
        self._stats_cache: dict = {}
        self._profiles_cache: list | None = None
        self._rebuilt = False
        with self._tx() as db:
            db.execute(_CREATE_SAMPLES.format(name="samples"))
            # Per-panel flags (e.g. whether the one-shot recorder backfill has run). Kept
            # separate from row counts so a live capture racing ahead of the first seed
            # can't make the seed think it's already done and skip the backfill.
            db.execute(
                "CREATE TABLE IF NOT EXISTS meta (panel TEXT PRIMARY KEY, seeded INTEGER)")
            # Saved LEARNING PROFILES — named snapshots of a panel's captured dataset, so a
            # new grow with the same physical setup can warm-start from a previous one. A
            # profile row holds metadata (JSON); its samples live in profile_samples.
            db.execute(
                "CREATE TABLE IF NOT EXISTS profiles ("
                "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, panel TEXT, "
                "created REAL, meta TEXT)")
            db.execute(
                "CREATE TABLE IF NOT EXISTS profile_samples (profile_id INTEGER, ts REAL, k TEXT, v REAL)")
            db.execute(
                "CREATE INDEX IF NOT EXISTS ix_profsamp ON profile_samples (profile_id, ts)")
            self._migrate(db)
        if self._rebuilt:
            # Hand the old table's pages back to the file system (one-time, after a rebuild).
            with self._lock:
                self._conn().execute("VACUUM")

    def _migrate(self, db) -> None:
        """Bring an older store up to SCHEMA_VERSION (inside the opening transaction)."""
        version = db.execute("PRAGMA user_version").fetchone()[0]
        if version >= SCHEMA_VERSION:
            return
        sql = db.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='samples'"
                         ).fetchone()[0] or ""
        if "WITHOUT ROWID" not in sql.upper():
            # ≤ 3.20.51 layout: copy into the keyed table. INSERT OR IGNORE in rowid order
            # keeps the first of any duplicate rows (a profile merged more than once).
            cols = {r[1] for r in db.execute("PRAGMA table_info(samples)")}
            loaded = "loaded" if "loaded" in cols else "0"
            db.execute(_CREATE_SAMPLES.format(name="samples_v2"))
            db.execute("INSERT OR IGNORE INTO samples_v2 (panel, ts, k, v, loaded) "  # noqa: S608
                       f"SELECT panel, ts, k, v, {loaded} FROM samples ORDER BY rowid")
            db.execute("DROP TABLE samples")                 # drops its indexes too
            db.execute("ALTER TABLE samples_v2 RENAME TO samples")
            self._rebuilt = True
        db.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")

    # ── connection plumbing ──────────────────────────────────────────────────
    def _conn(self) -> sqlite3.Connection:
        if self._db is None:
            raise sqlite3.ProgrammingError("AiStore is closed")
        return self._db

    @contextmanager
    def _tx(self):
        """One write transaction under the lock (all or nothing)."""
        with self._lock:
            db = self._conn()
            db.execute("BEGIN IMMEDIATE")
            try:
                yield db
            except BaseException:
                db.execute("ROLLBACK")
                raise
            db.execute("COMMIT")

    def _all(self, sql: str, args=()) -> list:
        with self._lock:
            return self._conn().execute(sql, args).fetchall()

    def _one(self, sql: str, args=()):
        with self._lock:
            return self._conn().execute(sql, args).fetchone()

    def _changed(self) -> None:
        """Rows changed in a way an appending capture doesn't: drop derived caches."""
        self.generation += 1
        self._stats_cache.clear()

    @property
    def closed(self) -> bool:
        return self._db is None

    # ── capture / seed flags ─────────────────────────────────────────────────
    def is_seeded(self, panel: str) -> bool:
        """Has this panel's one-shot recorder backfill already run?"""
        row = self._one("SELECT seeded FROM meta WHERE panel=?", (panel,))
        return bool(row and row[0])

    def mark_seeded(self, panel: str) -> None:
        with self._tx() as db:
            db.execute("INSERT OR REPLACE INTO meta (panel, seeded) VALUES (?, 1)", (panel,))

    def append(self, panel: str, ts: float, values: Mapping[str, float]) -> None:
        """Append one capture: a row per non-None value, all sharing `ts`."""
        rows = [(panel, float(ts), k, float(v)) for k, v in values.items() if v is not None]
        if not rows:
            return
        with self._tx() as db:
            added = db.executemany(
                "INSERT OR IGNORE INTO samples (panel, ts, k, v) VALUES (?,?,?,?)", rows).rowcount
            self._note_append(panel, float(ts), added)

    def _note_append(self, panel: str, ts: float, added: int) -> None:
        """Keep the cached coverage numbers in step with an append (lock held)."""
        if added <= 0:
            return
        for key in (panel, None):
            c = self._stats_cache.get(key)
            if c is None:
                continue
            if c["last"] is not None and ts <= c["last"]:
                self._stats_cache.pop(key, None)     # out of order: recount next time
                continue
            c["rows"] += added
            c["samples"] += 1
            c["last"] = ts
            if c["first"] is None:
                c["first"] = ts

    def samples(self, panel: str, metric_names: Sequence[str],
                since_ts: float = 0.0, until_ts: float | None = None) -> list[Sample]:
        """Rebuild `Sample`s for a panel from `since_ts` onward (and before `until_ts` when
        given). Keys in `metric_names` become `metrics`; all others become `outputs`."""
        mset = set(metric_names)
        if until_ts is None:
            rows = self._all(
                "SELECT ts, k, v FROM samples WHERE panel=? AND ts>=? AND v IS NOT NULL "
                "ORDER BY ts", (panel, float(since_ts)))
        else:
            rows = self._all(
                "SELECT ts, k, v FROM samples WHERE panel=? AND ts>=? AND ts<? "
                "AND v IS NOT NULL ORDER BY ts", (panel, float(since_ts), float(until_ts)))
        out: list[Sample] = []
        cur_ts = None
        metrics: dict[str, float] = {}
        outputs: dict[str, float] = {}
        for ts, k, v in rows:
            if cur_ts is None:
                cur_ts = ts
            elif ts != cur_ts:
                if metrics:
                    out.append(Sample(cur_ts, metrics, outputs))
                cur_ts, metrics, outputs = ts, {}, {}
            (metrics if k in mset else outputs)[k] = v
        if cur_ts is not None and metrics:
            out.append(Sample(cur_ts, metrics, outputs))
        return out

    def reset(self, panel: str | None = None) -> int:
        """Clear stored samples AND the seeded flag so the next learn pass re-imports
        from scratch (used by the re-seed action to pick up the fuller long-term
        statistics backfill). panel=None resets every panel. Returns rows removed."""
        with self._tx() as db:
            if panel is None:
                n = db.execute("DELETE FROM samples").rowcount
                db.execute("DELETE FROM meta")
            else:
                n = db.execute("DELETE FROM samples WHERE panel=?", (panel,)).rowcount
                db.execute("DELETE FROM meta WHERE panel=?", (panel,))
            self._changed()
        return n

    def delete_since(self, panel: str, since_ts: float) -> int:
        """Delete a panel's rows at/after `since_ts` — used to refresh the recent
        window with finer recorder-states data (older data is left untouched).
        Returns rows removed."""
        with self._tx() as db:
            n = db.execute(
                "DELETE FROM samples WHERE panel=? AND ts >= ?", (panel, float(since_ts))).rowcount
            self._changed()
        return n

    def purge(self, before_ts: float) -> int:
        """Delete captured rows older than `before_ts`. Returns rows removed. A retention
        of 0 ('keep everything') simply never calls this. Rows loaded from a saved profile
        are kept — they keep their original (old) timestamps, so a time-based purge would
        otherwise delete the warm start right after loading it."""
        with self._tx() as db:
            n = db.execute("DELETE FROM samples WHERE ts < ? AND loaded = 0",
                           (float(before_ts),)).rowcount
            if n:
                self._changed()
        return n

    def trim_sparse(self, panel: str, dense_max_s: float) -> int:
        """Drop a panel's device-BLIND older samples by SAMPLE SPACING. Blind data comes
        from long-term statistics (hourly, ~3600 s apart); real device-complete data (fine
        recorder states + forward capture) is dense (~120 s apart). Keying off a device
        column doesn't work — gear devices' numeric LEVEL sensors have statistics, so the
        blind rows still carry a (zero) gear value. So instead we find where the dense
        region begins — the earliest timestamp with a close newer neighbour (gap
        <= `dense_max_s`) — and drop everything older. Keeps ALL dense data (fine +
        forward capture), trims only the sparse statistics backfill. No sparse prefix →
        nothing removed. Returns rows removed."""
        with self._tx() as db:
            ts = [r[0] for r in db.execute(
                "SELECT DISTINCT ts FROM samples WHERE panel=? ORDER BY ts", (panel,)).fetchall()]
            if len(ts) < 2:
                return 0
            boundary = None
            for i in range(len(ts) - 1):
                if ts[i + 1] - ts[i] <= dense_max_s:        # first close pair = dense region start
                    boundary = ts[i]
                    break
            if boundary is None or boundary <= ts[0]:
                return 0                                     # all dense (or all sparse) → leave it
            n = db.execute(
                "DELETE FROM samples WHERE panel=? AND ts < ?", (panel, float(boundary))).rowcount
            self._changed()
        return n

    def stats(self, panel: str | None = None) -> dict:
        """Coverage for one panel (or all): raw key-row count, distinct-timestamp
        SAMPLE count (what the learner actually trains on — each timestamp carries
        several metric/device key-rows), and first/last timestamp. Counted once and then
        kept up to date by `append` (the live pass asks every 15 s; a COUNT(DISTINCT)
        over a year of rows took ~0.15 s each time)."""
        with self._lock:
            c = self._stats_cache.get(panel)
            if c is None:
                if panel is None:
                    row = self._one(
                        "SELECT COUNT(*), COUNT(DISTINCT ts), MIN(ts), MAX(ts) FROM samples")
                else:
                    row = self._one(
                        "SELECT COUNT(*), COUNT(DISTINCT ts), MIN(ts), MAX(ts) "
                        "FROM samples WHERE panel=?", (panel,))
                c = {"rows": row[0] or 0, "samples": row[1] or 0,
                     "first": row[2], "last": row[3]}
                self._stats_cache[panel] = c
            return dict(c)

    def recent_samples(self, panel: str, since_ts: float) -> int:
        """Distinct-timestamp SAMPLE count for `panel` at/after `since_ts`. Used for the
        card's live capture-rate readout (e.g. count over the last hour = rows/hour),
        so you can watch event-driven capture densify during a swing and idle when steady."""
        row = self._one("SELECT COUNT(DISTINCT ts) FROM samples WHERE panel=? AND ts>=?",
                        (panel, float(since_ts)))
        return int(row[0] or 0)

    def size_bytes(self) -> int:
        """On-disk size of the SQLite file (bytes), 0 for an in-memory DB. Reflects
        the whole store (all panels)."""
        try:
            return os.path.getsize(self._path) if self._path not in (":memory:", "") else 0
        except OSError:
            return 0

    def vacuum(self) -> None:
        """Reclaim disk after a large purge (sync; executor only)."""
        with self._lock:
            self._conn().execute("VACUUM")

    # ── Saved learning profiles ──────────────────────────────────────────────
    def save_profile(self, name: str, panel: str, meta: Mapping | None = None) -> int:
        """Snapshot a panel's current captured dataset under `name` (replacing a profile
        of the same name). `meta` (device set, zone, span, confidence at save) is stored
        as JSON for the card to show + match-check on load. Returns the new profile id."""
        name = str(name).strip()
        if not name:
            raise ValueError("profile name required")
        with self._tx() as db:
            row = db.execute("SELECT id FROM profiles WHERE name=?", (name,)).fetchone()
            if row:
                self._delete_profile(db, row[0])          # overwrite same-name
            pid = db.execute(
                "INSERT INTO profiles (name, panel, created, meta) VALUES (?,?,?,?)",
                (name, panel, time.time(), json.dumps(dict(meta or {})))).lastrowid
            db.execute(
                "INSERT INTO profile_samples (profile_id, ts, k, v) "
                "SELECT ?, ts, k, v FROM samples WHERE panel=?", (pid, panel))
            self._profiles_cache = None
        return int(pid)

    def list_profiles(self) -> list[dict]:
        """All saved profiles, newest first: id, name, panel, created, meta(dict),
        and the distinct-timestamp sample count the profile holds. Cached until a profile
        is saved or deleted (it was re-counted on every 15-s pass)."""
        with self._lock:
            if self._profiles_cache is None:
                rows = self._all(
                    "SELECT p.id, p.name, p.panel, p.created, p.meta, "
                    "       (SELECT COUNT(DISTINCT ts) FROM profile_samples s WHERE s.profile_id=p.id) "
                    "FROM profiles p ORDER BY p.created DESC")
                out = []
                for pid, name, panel, created, meta, nsamp in rows:
                    try:
                        m = json.loads(meta) if meta else {}
                    except (ValueError, TypeError):
                        m = {}
                    out.append({"id": int(pid), "name": name, "panel": panel,
                                "created": created, "meta": m, "samples": int(nsamp or 0)})
                self._profiles_cache = out
            return json.loads(json.dumps(self._profiles_cache))   # callers get their own copy

    def load_profile(self, profile_id: int, panel: str, replace: bool = False) -> int:
        """Copy a profile's samples into `panel`'s live store. `replace` clears the panel
        first (start the new grow from the profile); otherwise the profile is MERGED with
        whatever the panel already has — rows it already holds (same time + key) are not
        added twice. Loaded rows are marked so the retention purge keeps them. Returns rows
        added. Unknown id → 0."""
        pid = int(profile_id)
        with self._tx() as db:
            if not db.execute("SELECT 1 FROM profiles WHERE id=?", (pid,)).fetchone():
                return 0
            if replace:
                db.execute("DELETE FROM samples WHERE panel=?", (panel,))
            added = db.execute(
                "INSERT OR IGNORE INTO samples (panel, ts, k, v, loaded) "
                "SELECT ?, ts, k, v, 1 FROM profile_samples WHERE profile_id=?",
                (panel, pid)).rowcount
            # Rows the panel already had at the same time + key now belong to the loaded
            # profile too, so the purge spares the whole warm start.
            db.execute(
                "UPDATE samples SET loaded=1 WHERE panel=? AND loaded=0 "
                "AND ts BETWEEN (SELECT MIN(ts) FROM profile_samples WHERE profile_id=?) "
                "           AND (SELECT MAX(ts) FROM profile_samples WHERE profile_id=?) "
                "AND EXISTS (SELECT 1 FROM profile_samples p WHERE p.profile_id=? "
                "            AND p.ts=samples.ts AND p.k=samples.k)", (panel, pid, pid, pid))
            self._changed()
        return added

    def _delete_profile(self, db, profile_id: int) -> int:
        db.execute("DELETE FROM profile_samples WHERE profile_id=?", (int(profile_id),))
        return db.execute("DELETE FROM profiles WHERE id=?", (int(profile_id),)).rowcount

    def delete_profile(self, profile_id: int) -> int:
        """Delete a profile and its samples. Returns 1 if a profile was removed."""
        with self._tx() as db:
            n = self._delete_profile(db, profile_id)
            self._profiles_cache = None
        return n

    def delete_profile_by_name(self, name: str) -> int:
        with self._tx() as db:
            row = db.execute("SELECT id FROM profiles WHERE name=?", (str(name),)).fetchone()
            n = self._delete_profile(db, row[0]) if row else 0
            self._profiles_cache = None
        return n

    def close(self) -> None:
        """Close the connection. Waits for an in-flight read or write to finish (it holds
        the lock); later calls raise sqlite3.ProgrammingError. Safe to call twice."""
        with self._lock:
            if self._db is not None:
                self._db.close()
                self._db = None
