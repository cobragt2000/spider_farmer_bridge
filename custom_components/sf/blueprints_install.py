"""Install the bundled automation blueprint(s) into config/blueprints.

Home Assistant only loads blueprints from ``config/blueprints/<domain>/`` — it
does NOT read blueprints shipped inside a custom integration's folder. So on
setup we copy our bundled blueprint there, making it available out of the box
(no manual "Import blueprint" step).

A copy the user has edited is never overwritten: we remember the SHA-256 of
what we last wrote (in a small hidden JSON file next to the blueprint — Home
Assistant only reads ``*.yaml`` there) and replace the file only while it is
still exactly that. Writes are atomic (temp file + ``os.replace``), so Home
Assistant never sees a half-written blueprint.

All functions here do blocking file I/O and MUST be run in an executor
(``hass.async_add_executor_job``), never on the event loop.
"""

from __future__ import annotations

import contextlib
import hashlib
import json
import logging
import os
import stat
import tempfile
import threading

_LOGGER = logging.getLogger(__name__)

# Bundled source (inside this integration) → destination under config/blueprints.
# dest is namespaced under a "spider_farmer" folder so it can't collide with
# another integration's "grow_alerts.yaml".
_BLUEPRINTS = (
    ("grow_alerts.yaml", ("automation", "spider_farmer", "grow_alerts.yaml")),
)

# What we installed, per file name, kept next to the blueprints:
# {"grow_alerts.yaml": {"sha256": <what we wrote>, "kept_for": <shipped version
# we did not install because the file was edited — so that is logged once>}}
_RECORD_NAME = ".installed.json"

# Versions written to that path before the record existed (3.20.49 manual copy,
# 3.20.50, 3.20.51): an unedited copy of one of these is still ours to update.
# Later versions are recognised through the record, so this list never grows.
_SHIPPED_SHA256 = frozenset({
    "f67823f22c116edbc98b7cc066e13034b3d891f32c1f3d0b488cb9cb96ad262e",  # 3.20.49 / 3.20.50
    "800487a765b6a8f2f5c71d1a8ba3517013d5d55140f8f2a6fdc7979fcd45ee85",  # 3.20.51
})

# Setup runs once per config entry (and on every reload), possibly in parallel
# executor threads; serialise, and remember what was already announced.
_LOCK = threading.Lock()
_ANNOUNCED: set[tuple[str, str]] = set()


def install_bundled_blueprints(integration_dir: str, config_dir: str) -> list[str]:
    """Copy each bundled blueprint into config/blueprints. Runs in an executor.

    Writes the file when it is missing, or when it is still exactly a copy this
    integration wrote and the shipped content changed. An edited (or foreign)
    file is left alone and that is logged once at info level. Never raises;
    returns a list of human notes about what changed (empty if nothing did).
    """
    notes: list[str] = []
    with _LOCK:
        for src_name, dst_parts in _BLUEPRINTS:
            try:
                note = _install_one(integration_dir, config_dir, src_name, dst_parts)
            except Exception:  # noqa: BLE001 — best effort, never break setup
                _LOGGER.debug("blueprint install failed for %s", src_name, exc_info=True)
                continue
            if note:
                notes.append(note)
    return notes


def _install_one(integration_dir: str, config_dir: str, src_name: str, dst_parts: tuple[str, ...]) -> str | None:
    src = os.path.join(integration_dir, "blueprints", src_name)
    dst = os.path.join(config_dir, "blueprints", *dst_parts)
    rel = os.path.join("blueprints", *dst_parts)
    name = dst_parts[-1]
    record_path = os.path.join(os.path.dirname(dst), _RECORD_NAME)

    try:
        content = _read(src)
    except OSError as exc:
        _LOGGER.debug("blueprint source unreadable (%s): %s", src, exc)
        return None
    shipped = _sha256(content)

    try:
        existing: str | None = _read(dst)
    except FileNotFoundError:
        existing = None
    except OSError as exc:
        _LOGGER.debug("blueprint destination unreadable (%s): %s", dst, exc)
        return None

    record = _load_record(record_path)
    entry = record.get(name) if isinstance(record.get(name), dict) else {}

    if existing is not None:
        current = _sha256(existing)
        if current == shipped:
            if entry.get("sha256") != shipped:  # adopt an identical copy
                record[name] = {"sha256": shipped}
                _save_record(record_path, record)
            return None
        if current != entry.get("sha256") and current not in _SHIPPED_SHA256:
            # Edited since we wrote it (or never ours): leave it alone. When that
            # holds back a different bundled version, say so — once per version.
            if (entry.get("sha256") != shipped and entry.get("kept_for") != shipped
                    and (dst, shipped) not in _ANNOUNCED):
                _ANNOUNCED.add((dst, shipped))
                _LOGGER.info(
                    "Spider Farmer Bridge: %s differs from the copy the integration installed "
                    "(edited?), so it was left as is and this version's blueprint was not "
                    "installed. Delete the file and restart to get the bundled one.",
                    rel,
                )
                record[name] = {**entry, "kept_for": shipped}
                _save_record(record_path, record)
            return None

    try:
        _atomic_write(dst, content)
    except OSError as exc:
        _LOGGER.debug("could not write blueprint (%s): %s", dst, exc)
        return None
    record[name] = {"sha256": shipped}
    _save_record(record_path, record)
    return f"{'updated' if existing is not None else 'installed'} {rel}"


def _read(path: str) -> str:
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _load_record(path: str) -> dict:
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def _save_record(path: str, record: dict) -> None:
    try:
        _atomic_write(path, json.dumps(record, indent=2, sort_keys=True) + "\n")
    except OSError as exc:
        _LOGGER.debug("could not write blueprint record (%s): %s", path, exc)


def _atomic_write(path: str, text: str) -> None:
    """Write via a temp file in the same folder + os.replace. The temp name
    starts with a dot and doesn't end in .yaml, so Home Assistant never loads it."""
    directory = os.path.dirname(path)
    os.makedirs(directory, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=directory, prefix=".sf-", suffix=".tmp")
    try:
        with os.fdopen(fd, "wb") as fh:
            fh.write(text.encode("utf-8"))
            fh.flush()
            os.fsync(fh.fileno())
        try:
            mode = stat.S_IMODE(os.stat(path).st_mode)
        except OSError:
            mode = 0o644
        os.chmod(tmp, mode)
        os.replace(tmp, path)
    except BaseException:
        with contextlib.suppress(OSError):
            os.unlink(tmp)
        raise
