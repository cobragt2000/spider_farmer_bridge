"""
migrate.py — Spider Farmer Bridge device replacement (v3.0.13)
==============================================================
Replace a physical device while keeping its HA identity.

HA keys history by entity_id and identity by unique_id. Migration:
  1. For every entity of the OLD device, compute the unique_id the NEW
     device would use (swap the ggs_{mac}_ prefix)
  2. Remove the NEW device's auto-created duplicate entry, if any
     (it holds at most a few hours of throwaway history)
  3. Rewrite the OLD entry in place: new unique_id + new device_id —
     entity_id is untouched, so recorder history, automations, dashboards,
     and card references all continue seamlessly on the new hardware
  4. Remove the old device from the device registry
  5. Caller reloads the config entry so live entities rebind cleanly
"""
from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN
from .diag import DIAG

_LOGGER = logging.getLogger(__name__)


def _mac_from_device(device: dr.DeviceEntry) -> str | None:
    for domain, ident in device.identifiers:
        if domain == DOMAIN and ident.startswith("ggs_"):
            return ident[4:]
    return None


@callback
def migrate_device(
    hass: HomeAssistant,
    old_device_id: str,
    new_device_id: str,
    entry=None,
) -> tuple[int, list[str]]:
    """Move the old device's entity identities onto the new device.
    Returns (migrated_count, errors)."""
    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)
    errors: list[str] = []

    old_dev = dev_reg.async_get(old_device_id)
    new_dev = dev_reg.async_get(new_device_id)
    if old_dev is None or new_dev is None:
        return 0, ["source or target device no longer exists"]

    old_mac = _mac_from_device(old_dev)
    new_mac = _mac_from_device(new_dev)
    if not old_mac or not new_mac:
        return 0, ["could not determine device MACs"]
    if old_mac == new_mac:
        return 0, ["source and target are the same device"]

    # Like-for-like guard: migrating across device types (CB -> PS10 etc.)
    # would move only the shared fields and strand the rest as orphans.
    if (
        old_dev.model and new_dev.model
        and old_dev.model != new_dev.model
    ):
        return 0, [
            f"device type mismatch: {old_dev.model} -> {new_dev.model}"
        ]

    prefix_old = f"ggs_{old_mac}_"
    prefix_new = f"ggs_{new_mac}_"
    migrated = 0

    for entity in list(
        er.async_entries_for_device(
            ent_reg, old_device_id, include_disabled_entities=True
        )
    ):
        uid = entity.unique_id or ""
        if not uid.startswith(prefix_old):
            continue
        new_uid = prefix_new + uid[len(prefix_old):]

        # The new device's auto-created twin loses; the old identity wins.
        dup = ent_reg.async_get_entity_id(entity.domain, DOMAIN, new_uid)
        if dup and dup != entity.entity_id:
            ent_reg.async_remove(dup)

        try:
            ent_reg.async_update_entity(
                entity.entity_id,
                new_unique_id=new_uid,
                device_id=new_device_id,
            )
            migrated += 1
        except (ValueError, KeyError) as exc:
            errors.append(f"{entity.entity_id}: {exc}")

    if migrated and not errors:
        dev_reg.async_remove_device(old_device_id)
        # Transfer the logical slot: the replacement inherits e.g. cb1, so
        # slot-based entity_ids (sf_dp1_*) keep pointing at the live device.
        if entry is not None:
            slots = dict((entry.options or {}).get("device_slots", {}))
            if old_mac in slots:
                slots[new_mac] = slots.pop(old_mac)
                hass.config_entries.async_update_entry(
                    entry, options={**(entry.options or {}), "device_slots": slots}
                )

    _LOGGER.info(
        "Device migration %s -> %s: %d entities moved, %d errors",
        old_mac, new_mac, migrated, len(errors),
    )
    DIAG.bus_event(
        f"migrate {old_mac} -> {new_mac} entities={migrated} errors={errors}"
    )
    return migrated, errors
