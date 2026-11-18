"""Install the bundled automation blueprint(s) into config/blueprints.

Home Assistant only loads blueprints from ``config/blueprints/<domain>/`` — it
does NOT read blueprints shipped inside a custom integration's folder. So on
setup we copy our bundled blueprint there once, making it available out of the
box (no manual "Import blueprint" step).

All functions here do blocking file I/O and MUST be run in an executor
(``hass.async_add_executor_job``), never on the event loop.
"""

from __future__ import annotations

import logging
import os

_LOGGER = logging.getLogger(__name__)

# Bundled source (inside this integration) → destination under config/blueprints.
# dest is namespaced under a "spider_farmer" folder so it can't collide with
# another integration's "grow_alerts.yaml".
_BLUEPRINTS = (
    ("grow_alerts.yaml", ("automation", "spider_farmer", "grow_alerts.yaml")),
)

# Marker that identifies a copy as OURS (so an update never clobbers an unrelated
# file a user happened to place at the destination path).
_MANAGED_MARKER = "cobragt2000/spider_farmer_bridge"


def install_bundled_blueprints(integration_dir: str, config_dir: str) -> list[str]:
    """Copy each bundled blueprint into config/blueprints. Runs in an executor.

    Copies when the destination is missing, and updates in place only when the
    existing file is our managed copy AND the shipped content changed — so a
    user's own automations (built *from* the blueprint) are untouched, and a file
    the user deliberately replaced at that path is left alone. Never raises;
    returns a list of human notes about what changed (empty if nothing did).
    """
    notes: list[str] = []
    for src_name, dst_parts in _BLUEPRINTS:
        src = os.path.join(integration_dir, "blueprints", src_name)
        dst = os.path.join(config_dir, "blueprints", *dst_parts)
        try:
            with open(src, "r", encoding="utf-8") as fh:
                content = fh.read()
        except OSError as exc:
            _LOGGER.debug("blueprint source unreadable (%s): %s", src, exc)
            continue

        existing: str | None = None
        try:
            with open(dst, "r", encoding="utf-8") as fh:
                existing = fh.read()
        except OSError:
            existing = None

        if existing is not None:
            if existing == content:
                continue  # already current
            if _MANAGED_MARKER not in existing:
                continue  # not ours — don't overwrite the user's file

        try:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(dst, "w", encoding="utf-8") as fh:
                fh.write(content)
        except OSError as exc:
            _LOGGER.debug("could not write blueprint (%s): %s", dst, exc)
            continue

        notes.append(
            f"{'updated' if existing is not None else 'installed'} "
            f"{os.path.join('blueprints', *dst_parts)}"
        )
    return notes
