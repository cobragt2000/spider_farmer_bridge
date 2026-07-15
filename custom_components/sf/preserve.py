"""
preserve.py — Spider Farmer Bridge customization preservation (v3.2.0)
=====================================================================
What survives an integration removal *natively*:
  • recorder history (states) — keyed by entity_id, not the config entry
  • long-term statistics — keyed by statistic_id (= entity_id)
Both reconnect on reinstall because the slot system recreates identical
entity_ids. So history/stats are NOT lost on removal.

What is lost on removal: entity/device *registry customizations* — manual
renames (name_by_user), area assignments, icon overrides, hidden/disabled
state. Those are tied to the config entry and wiped when it's deleted.

This module snapshots those customizations (keyed by unique_id, which is
stable across removal/reinstall) to config/sf/preserved_registry.json — a
location OUTSIDE custom_components/ so it survives even a full reinstall.

  preserve ON  (default): snapshot kept; restored onto recreated entities.
  preserve OFF (clean):   snapshot deleted AND recorder history/statistics
                          for our entities purged, so nothing lingers.

Restore only ever FILLS EMPTY fields — it never overwrites a customization
the user currently has, so normal restarts are unaffected.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

_SNAPSHOT_NAME = "preserved_registry.json"


def _snapshot_path(hass: HomeAssistant) -> str:
    # config/sf/ — outside custom_components/, survives reinstall
    return hass.config.path("sf", _SNAPSHOT_NAME)


def build_snapshot(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    """Capture entity + device customizations for this config entry."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)

    entities: dict[str, dict] = {}
    entity_ids: list[str] = []
    for e in er.async_entries_for_config_entry(ent_reg, entry_id):
        uid = e.unique_id or ""
        if not uid.startswith("ggs_"):
            continue
        entity_ids.append(e.entity_id)
        cust = {}
        if e.name is not None:            cust["name"] = e.name          # name_by_user
        if e.icon is not None:            cust["icon"] = e.icon
        if e.area_id is not None:         cust["area_id"] = e.area_id
        if e.disabled_by is not None:     cust["disabled_by"] = str(e.disabled_by)
        if e.hidden_by is not None:       cust["hidden_by"] = str(e.hidden_by)
        if cust:
            cust["entity_id"] = e.entity_id
            entities[uid] = cust

    devices: dict[str, dict] = {}
    for d in dr.async_entries_for_config_entry(dev_reg, entry_id):
        ident = next(
            (i for dom, i in d.identifiers if dom == DOMAIN and i.startswith("ggs_")),
            None,
        )
        if ident is None:
            continue
        cust = {}
        if d.name_by_user is not None:    cust["name_by_user"] = d.name_by_user
        if d.area_id is not None:         cust["area_id"] = d.area_id
        if cust:
            devices[ident] = cust

    return {
        "version": 1,
        "entry_id": entry_id,
        "entities": entities,
        "devices": devices,
        "all_entity_ids": entity_ids,   # for clean-removal purge
    }


def write_snapshot(hass: HomeAssistant, entry_id: str) -> None:
    """Refresh the on-disk snapshot (called on every unload → always current
    right before any removal). Blocking I/O — call in executor."""
    try:
        data = build_snapshot(hass, entry_id)
        if not data["entities"] and not data["devices"] and not data["all_entity_ids"]:
            return
        path = _snapshot_path(hass)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        _LOGGER.debug("Wrote preservation snapshot: %s", path)
    except Exception as exc:
        _LOGGER.warning("Could not write preservation snapshot: %s", exc)


def _load_snapshot(hass: HomeAssistant) -> dict | None:
    try:
        with open(_snapshot_path(hass), encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, ValueError):
        return None


@callback
def restore_customizations(hass: HomeAssistant, entry_id: str) -> int:
    """Fill EMPTY customization fields on this entry's entities/devices from
    the snapshot. Never overwrites current values. Returns count applied."""
    snap = _load_snapshot(hass)
    if not snap:
        return 0

    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    applied = 0

    ent_snaps: dict = snap.get("entities", {})
    for e in er.async_entries_for_config_entry(ent_reg, entry_id):
        cust = ent_snaps.get(e.unique_id or "")
        if not cust:
            continue
        updates: dict = {}
        if cust.get("name") and e.name is None:
            updates["name"] = cust["name"]
        if cust.get("icon") and e.icon is None:
            updates["icon"] = cust["icon"]
        if cust.get("area_id") and e.area_id is None:
            updates["area_id"] = cust["area_id"]
        if updates:
            try:
                ent_reg.async_update_entity(e.entity_id, **updates)
                applied += 1
            except (ValueError, KeyError):
                pass

    dev_snaps: dict = snap.get("devices", {})
    for d in dr.async_entries_for_config_entry(dev_reg, entry_id):
        ident = next(
            (i for dom, i in d.identifiers if dom == DOMAIN and i.startswith("ggs_")),
            None,
        )
        cust = dev_snaps.get(ident or "")
        if not cust:
            continue
        updates = {}
        if cust.get("name_by_user") and d.name_by_user is None:
            updates["name_by_user"] = cust["name_by_user"]
        if cust.get("area_id") and d.area_id is None:
            updates["area_id"] = cust["area_id"]
        if updates:
            try:
                dev_reg.async_update_device(d.id, **updates)
                applied += 1
            except (ValueError, KeyError):
                pass

    if applied:
        _LOGGER.info("Restored %d preserved customizations", applied)
    return applied


def delete_snapshot(hass: HomeAssistant) -> None:
    path = _snapshot_path(hass)
    try:
        os.remove(path)
        _LOGGER.info("Deleted preservation snapshot (clean removal)")
    except FileNotFoundError:
        pass
    except Exception as exc:
        _LOGGER.warning("Could not delete preservation snapshot: %s", exc)
    # Don't strand an empty config/sf/ folder
    try:
        os.rmdir(os.path.dirname(path))
    except OSError:
        pass  # not empty or already gone — fine


async def purge_recorder(hass: HomeAssistant, entity_ids: list[str]) -> None:
    """Clean removal: purge recorder states + statistics for our entities so
    nothing lingers as orphans. Best-effort — guarded if recorder absent."""
    if not entity_ids:
        return
    # States, via the recorder service
    if hass.services.has_service("recorder", "purge_entities"):
        try:
            await hass.services.async_call(
                "recorder",
                "purge_entities",
                {"entity_id": entity_ids, "keep_days": 0},
                blocking=True,
            )
            _LOGGER.info("Purged recorder states for %d entities", len(entity_ids))
        except Exception as exc:
            _LOGGER.warning("recorder purge_entities failed: %s", exc)
    # Statistics, via the recorder instance API if available
    try:
        from homeassistant.components.recorder import get_instance

        instance = get_instance(hass)
        if instance is not None and hasattr(instance, "async_clear_statistics"):
            instance.async_clear_statistics(list(entity_ids))
            _LOGGER.info("Cleared statistics for %d entities", len(entity_ids))
    except Exception as exc:
        _LOGGER.debug("statistics clear skipped: %s", exc)


async def handle_removal(hass: HomeAssistant, entry, preserve: bool) -> None:
    """Called from async_remove_entry."""
    snap = _load_snapshot(hass)
    entity_ids = list(snap.get("all_entity_ids", [])) if snap else []

    if preserve:
        # Snapshot already written on unload — leave it for the next install.
        _LOGGER.info(
            "Integration removed with preservation ON — customizations saved "
            "to config/sf/%s; history/statistics remain in the recorder.",
            _SNAPSHOT_NAME,
        )
    else:
        await purge_recorder(hass, entity_ids)
        await hass.async_add_executor_job(delete_snapshot, hass)
        _LOGGER.info("Integration removed with preservation OFF — cleaned up.")
