"""Adaptive climate — durable SF data store (SQLite), independent of the recorder.

Home Assistant's recorder purges globally (`purge_keep_days`, default 10) and an
integration can't change that or ask for per-entity retention. So the adaptive-
climate layer keeps its OWN compact time-series of the climate metrics + device
efforts, with a user-set retention (0 = keep everything). The learner trains from
this store, so its history is never capped by the recorder's purge.

One narrow table — `samples(panel, ts, k, v)` — so each panel can carry a
different set of metric/device keys. A capture tick writes one row per key at a
shared `ts`; reconstruction groups rows by `ts` back into `Sample`s.

**Sync SQLite** — every method here does blocking DB I/O, so callers MUST run them
via `hass.async_add_executor_job(...)`, never on the event loop (see CLAUDE.md
"HA event-loop safety"). No device is actuated from this module.
"""

from __future__ import annotations

import json
import sqlite3
import time
from typing import Mapping, Sequence

from .ai_climate import Sample


class AiStore:
    """SQLite-backed time-series for one integration instance (all panels)."""

    def __init__(self, path: str):
        # check_same_thread=False: the store is only ever touched from executor
        # threads, and callers serialise access (never concurrent writers).
        self._path = path
        self._db = sqlite3.connect(path, check_same_thread=False)
        self._db.execute(
            "CREATE TABLE IF NOT EXISTS samples (panel TEXT, ts REAL, k TEXT, v REAL)")
        self._db.execute(
            "CREATE INDEX IF NOT EXISTS ix_panel_ts ON samples (panel, ts)")
        # Per-panel flags (e.g. whether the one-shot recorder backfill has run). Kept
        # separate from row counts so a live capture racing ahead of the first seed
        # can't make the seed think it's already done and skip the backfill.
        self._db.execute(
            "CREATE TABLE IF NOT EXISTS meta (panel TEXT PRIMARY KEY, seeded INTEGER)")
        # Saved LEARNING PROFILES — named snapshots of a panel's captured dataset, so a
        # new grow with the same physical setup can warm-start from a previous one. A
        # profile row holds metadata (JSON); its samples live in profile_samples.
        self._db.execute(
            "CREATE TABLE IF NOT EXISTS profiles ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, panel TEXT, "
            "created REAL, meta TEXT)")
        self._db.execute(
            "CREATE TABLE IF NOT EXISTS profile_samples (profile_id INTEGER, ts REAL, k TEXT, v REAL)")
        self._db.execute(
            "CREATE INDEX IF NOT EXISTS ix_profsamp ON profile_samples (profile_id, ts)")
        self._db.commit()

    def is_seeded(self, panel: str) -> bool:
        """Has this panel's one-shot recorder backfill already run?"""
        row = self._db.execute(
            "SELECT seeded FROM meta WHERE panel=?", (panel,)).fetchone()
        return bool(row and row[0])

    def mark_seeded(self, panel: str) -> None:
        self._db.execute(
            "INSERT OR REPLACE INTO meta (panel, seeded) VALUES (?, 1)", (panel,))
        self._db.commit()

    def append(self, panel: str, ts: float, values: Mapping[str, float]) -> None:
        """Append one capture: a row per non-None value, all sharing `ts`."""
        rows = [(panel, float(ts), k, float(v)) for k, v in values.items() if v is not None]
        if not rows:
            return
        self._db.executemany("INSERT INTO samples (panel, ts, k, v) VALUES (?,?,?,?)", rows)
        self._db.commit()

    def samples(self, panel: str, metric_names: Sequence[str],
                since_ts: float = 0.0) -> list[Sample]:
        """Rebuild `Sample`s for a panel from `since_ts` onward. Keys in
        `metric_names` become `metrics`; all others become `outputs`."""
        mset = set(metric_names)
        cur = self._db.execute(
            "SELECT ts, k, v FROM samples WHERE panel=? AND ts>=? ORDER BY ts",
            (panel, float(since_ts)))
        out: list[Sample] = []
        cur_ts = None
        metrics: dict[str, float] = {}
        outputs: dict[str, float] = {}
        for ts, k, v in cur:
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
        if panel is None:
            cur = self._db.execute("DELETE FROM samples")
            self._db.execute("DELETE FROM meta")
        else:
            cur = self._db.execute("DELETE FROM samples WHERE panel=?", (panel,))
            self._db.execute("DELETE FROM meta WHERE panel=?", (panel,))
        self._db.commit()
        return cur.rowcount

    def delete_since(self, panel: str, since_ts: float) -> int:
        """Delete a panel's rows at/after `since_ts` — used to refresh the recent
        window with finer recorder-states data (older data is left untouched).
        Returns rows removed."""
        cur = self._db.execute(
            "DELETE FROM samples WHERE panel=? AND ts >= ?", (panel, float(since_ts)))
        self._db.commit()
        return cur.rowcount

    def purge(self, before_ts: float) -> int:
        """Delete rows older than `before_ts`. Returns rows removed. A retention of
        0 ('keep everything') simply never calls this."""
        cur = self._db.execute("DELETE FROM samples WHERE ts < ?", (float(before_ts),))
        self._db.commit()
        return cur.rowcount

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
        ts = [r[0] for r in self._db.execute(
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
        cur = self._db.execute(
            "DELETE FROM samples WHERE panel=? AND ts < ?", (panel, float(boundary)))
        self._db.commit()
        return cur.rowcount

    def stats(self, panel: str | None = None) -> dict:
        """Coverage for one panel (or all): raw key-row count, distinct-timestamp
        SAMPLE count (what the learner actually trains on — each timestamp carries
        several metric/device key-rows), and first/last timestamp."""
        if panel is None:
            row = self._db.execute(
                "SELECT COUNT(*), COUNT(DISTINCT ts), MIN(ts), MAX(ts) FROM samples"
            ).fetchone()
        else:
            row = self._db.execute(
                "SELECT COUNT(*), COUNT(DISTINCT ts), MIN(ts), MAX(ts) "
                "FROM samples WHERE panel=?", (panel,)).fetchone()
        return {"rows": row[0] or 0, "samples": row[1] or 0, "first": row[2], "last": row[3]}

    def recent_samples(self, panel: str, since_ts: float) -> int:
        """Distinct-timestamp SAMPLE count for `panel` at/after `since_ts`. Used for the
        card's live capture-rate readout (e.g. count over the last hour = rows/hour),
        so you can watch event-driven capture densify during a swing and idle when steady."""
        row = self._db.execute(
            "SELECT COUNT(DISTINCT ts) FROM samples WHERE panel=? AND ts>=?",
            (panel, float(since_ts))).fetchone()
        return int(row[0] or 0)

    def size_bytes(self) -> int:
        """On-disk size of the SQLite file (bytes), 0 for an in-memory DB. Reflects
        the whole store (all panels)."""
        import os
        try:
            return os.path.getsize(self._path) if self._path not in (":memory:", "") else 0
        except OSError:
            return 0

    def vacuum(self) -> None:
        """Reclaim disk after a large purge (sync; executor only)."""
        self._db.execute("VACUUM")

    # ── Saved learning profiles ──────────────────────────────────────────────
    def save_profile(self, name: str, panel: str, meta: Mapping | None = None) -> int:
        """Snapshot a panel's current captured dataset under `name` (replacing a profile
        of the same name). `meta` (device set, zone, span, confidence at save) is stored
        as JSON for the card to show + match-check on load. Returns the new profile id."""
        name = str(name).strip()
        if not name:
            raise ValueError("profile name required")
        self.delete_profile_by_name(name)                 # overwrite same-name
        cur = self._db.execute(
            "INSERT INTO profiles (name, panel, created, meta) VALUES (?,?,?,?)",
            (name, panel, time.time(), json.dumps(dict(meta or {}))))
        pid = cur.lastrowid
        self._db.execute(
            "INSERT INTO profile_samples (profile_id, ts, k, v) "
            "SELECT ?, ts, k, v FROM samples WHERE panel=?", (pid, panel))
        self._db.commit()
        return int(pid)

    def list_profiles(self) -> list[dict]:
        """All saved profiles, newest first: id, name, panel, created, meta(dict),
        and the distinct-timestamp sample count the profile holds."""
        rows = self._db.execute(
            "SELECT p.id, p.name, p.panel, p.created, p.meta, "
            "       (SELECT COUNT(DISTINCT ts) FROM profile_samples s WHERE s.profile_id=p.id) "
            "FROM profiles p ORDER BY p.created DESC").fetchall()
        out = []
        for pid, name, panel, created, meta, nsamp in rows:
            try:
                m = json.loads(meta) if meta else {}
            except (ValueError, TypeError):
                m = {}
            out.append({"id": int(pid), "name": name, "panel": panel,
                        "created": created, "meta": m, "samples": int(nsamp or 0)})
        return out

    def load_profile(self, profile_id: int, panel: str, replace: bool = False) -> int:
        """Copy a profile's samples into `panel`'s live store. `replace` clears the panel
        first (start the new grow from the profile); otherwise the profile is MERGED with
        whatever the panel already has. Returns rows added. Unknown id → 0."""
        exists = self._db.execute(
            "SELECT 1 FROM profiles WHERE id=?", (int(profile_id),)).fetchone()
        if not exists:
            return 0
        if replace:
            self._db.execute("DELETE FROM samples WHERE panel=?", (panel,))
        cur = self._db.execute(
            "INSERT INTO samples (panel, ts, k, v) "
            "SELECT ?, ts, k, v FROM profile_samples WHERE profile_id=?",
            (panel, int(profile_id)))
        self._db.commit()
        return cur.rowcount

    def delete_profile(self, profile_id: int) -> int:
        """Delete a profile and its samples. Returns 1 if a profile was removed."""
        self._db.execute("DELETE FROM profile_samples WHERE profile_id=?", (int(profile_id),))
        cur = self._db.execute("DELETE FROM profiles WHERE id=?", (int(profile_id),))
        self._db.commit()
        return cur.rowcount

    def delete_profile_by_name(self, name: str) -> int:
        row = self._db.execute("SELECT id FROM profiles WHERE name=?", (str(name),)).fetchone()
        return self.delete_profile(row[0]) if row else 0

    def close(self) -> None:
        self._db.close()
