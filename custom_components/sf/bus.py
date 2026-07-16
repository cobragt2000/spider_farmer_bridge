"""
bus.py — Spider Farmer Bridge state bus
=======================================
In-process state hub between the proxy and the HA entity layer.

The proxy (proxy/mitm_proxy.py) publishes decoded state through a small
``publish(topic, payload, retain, qos)`` interface. This bus receives those
calls, caches the latest value per topic, and dispatches updates to the native
HA entities. The topic strings are internal state keys.

Command path: entities call ``async_command(topic, payload)`` with the
``ggs/ha/{mac}/{field}/set`` topic form, which the proxy translates into a
device message via command_handler.py.
"""
from __future__ import annotations

import logging
from typing import Any, Optional

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .diag import DIAG
from .const import (
    SIGNAL_AVAILABILITY,
    SIGNAL_DEVICE_AVAIL_FMT,
    SIGNAL_NEW_FMT,
    SIGNAL_SOIL_LABEL_FMT,
    SIGNAL_STATE_FMT,
)
def reconcile_registry_to_slots(hass, slots: dict, soil_slots: dict | None = None) -> int:
    """Standalone collision-safe two-phase rename of every sf_ entity to the
    entity_id its slot dictates. Callable without a bus instance (used by
    the options flow immediately on mappings save). Returns renames done."""
    from homeassistant.helpers import entity_registry as er
    from .const import DOMAIN as _DOM
    import time as _t

    soil_slots = soil_slots or {}
    if not slots and not soil_slots:
        return 0
    registry = er.async_get(hass)
    planned: list[tuple[str, str]] = []
    for entity in list(registry.entities.values()):
        if entity.platform != _DOM:
            continue
        uid = entity.unique_id or ""
        if not uid.startswith("ggs_"):
            continue
        obj = entity.entity_id.split(".", 1)[1]
        if not obj.startswith("sf_"):
            continue
        mac = uid[4:].split("_", 1)[0]
        field = uid[len(f"ggs_{mac}_"):]
        if field.startswith("soil_avg_"):
            # Per-DEVICE soil average: ggs_{mac}_soil_avg_{suffix} ->
            # sf_{device_slot}_soil_avg_{suffix}. NOT a probe — keyed by the
            # host device's slot, so it follows dp1/dp2 slot changes (must be
            # handled before the generic soil_ branch, which would misread
            # "avg" as a probe serial and skip it — the dp1/dp2 swap bug).
            suffix = field[len("soil_avg_"):]
            cb_slot = slots.get(mac)
            if not cb_slot or suffix not in ("temperature", "moisture", "ec"):
                continue
            final_eid = f"{entity.domain}.sf_{cb_slot}_soil_avg_{suffix}"
        elif field.startswith("soil_"):
            # ggs_{mac}_soil_{serial}_{suffix} — id is CB-scoped (v3.3.1):
            # sf_{cb_slot}_{soil_slot}_{suffix}
            body = field[len("soil_"):]
            serial, _, suffix = body.rpartition("_")
            soil_slot = soil_slots.get(serial.lower())
            cb_slot = slots.get(mac)
            if not soil_slot or not cb_slot or suffix not in (
                "temperature", "moisture", "ec"
            ):
                continue
            final_eid = f"{entity.domain}.sf_{cb_slot}_{soil_slot}_{suffix}"
        else:
            slot = slots.get(mac)
            if not slot:
                continue
            final_eid = (
                f"{entity.domain}."
                f"{_expected_obj(slot, field, entity, registry)}"
            )
        if final_eid != entity.entity_id:
            planned.append((entity.entity_id, final_eid))

    if not planned:
        return 0

    stamp = int(_t.time())
    temp_map: list[tuple[str, str]] = []
    for i, (cur, final) in enumerate(planned):
        domain = cur.split(".", 1)[0]
        temp = f"{domain}.sf_migtmp_{stamp}_{i}"
        try:
            registry.async_update_entity(cur, new_entity_id=temp)
            temp_map.append((temp, final))
        except (ValueError, KeyError) as exc:
            _LOGGER.warning("reconcile park failed %s: %s", cur, exc)
    for temp, final in temp_map:
        try:
            registry.async_update_entity(temp, new_entity_id=final)
            _LOGGER.info("Renamed %s -> %s", temp, final)
        except (ValueError, KeyError) as exc:
            _LOGGER.error(
                "reconcile finalize failed %s -> %s: %s (entity left on "
                "temp id; will be corrected on next reconcile)",
                temp, final, exc,
            )
    _LOGGER.info("Reconciled %d entity ids to slots", len(temp_map))
    return len(temp_map)


def _expected_obj(slot, field, entity, registry):
    """Final object_id for a slot+field. Mirrors SfDef.expected_object_id
    but works from registry data (unique_id field + original_name)."""
    from homeassistant.util import slugify
    # Prefer the entity's original_name (the human name we set), which is
    # what slugify used originally: sf_{slot}_{name}. Fall back to field.
    name = entity.original_name
    if name:
        return slugify(f"sf_{slot}_{name}")
    return slugify(f"sf_{slot}_{field}")


from .entity_defs import (
    EVIDENCE_BLOCKS,
    HA_STATUS_TOPIC,
    OUTLET_MODE_NAMES,
    OUTLET_TYPE_TO_MODE,
    SfDef,
    build_device_entities,
    build_outlet_mode_config,
    build_outlet_mode_select,
    build_soil_entities,
    build_soil_avg_entities,
    build_env_entities,
    build_air_calibration_entities,
    build_soil_calibration_entities,
    SUBSTRATE_OPTIONS,
    _device_model,
    _device_name,
    _mac,
)

_LOGGER = logging.getLogger(__name__)

_PLATFORM_DOMAIN = {
    "sensor": "sensor",
    "binary_sensor": "binary_sensor",
    "switch": "switch",
    "light": "light",
    "fan": "fan",
    "number": "number",
    "select": "select",
    "text": "text",
}


class SfBus:
    """State bus + entity factory + command gateway."""

    def __init__(self, hass: HomeAssistant, entry_id: str | None = None) -> None:
        self.hass = hass
        self.entry_id = entry_id
        self.proxy: Any = None                       # set by __init__.py after proxy creation
        self.available: bool = True                  # retained-"online" parity at startup
        self.device_available: dict[str, bool] = {}  # per-MAC availability
        self._grace_over: bool = False               # startup staleness guard
        self._grace_cancel = None
        self.states: dict[str, str] = {}             # topic -> last payload
        self._registered: set[str] = set()           # unique_ids already created
        self._pruned: set[str] = set()               # unique_ids removed (ghost outlets)
        self._ready: set[str] = set()                # platforms whose adder is connected
        self._pending: dict[str, list[SfDef]] = {}   # platform -> defs waiting for adder
        self._slot_cache: dict[str, str] = {}        # mac -> slot (mirrors entry options)
        self._soil_cache: dict[str, str] = {}        # serial -> soil slot
        self._soil_attach: dict[str, str] = {}       # serial -> mac (this run)
        self.device_display: dict[str, tuple[str, str]] = {}  # mac -> (name, model)
        self._outlet_mode: dict[str, str] = {}       # "{mac}_{n}" -> mode name
        self._soil_type: dict[str, str] = {}         # serial -> "Pro" | "Basic"
        self._soil_label: dict[str, str] = {}        # serial -> app label (senConfig)
        self._soil_cfg_cache: dict[str, dict] = {}   # serial -> full senConfig entry
        self._air_cal: dict[str, dict] = {}          # mac -> air calibration block
        self.keep_offline: bool = True               # v3.9.0: keep entities for
                                                     # blocks that stop reporting
        self.env_entities: bool = True               # create Environment device

    def start_grace(self, seconds: float) -> None:
        """Devices unseen `seconds` after startup flip to unavailable
        instead of showing restored (possibly months-old) state as live."""
        from homeassistant.helpers.event import async_call_later

        @callback
        def _grace_expired(_now) -> None:
            self._grace_cancel = None
            if not self._grace_over:
                self._grace_over = True
                async_dispatcher_send(self.hass, SIGNAL_AVAILABILITY)
                _LOGGER.debug("Startup grace expired — unseen devices now unavailable")

        self._grace_cancel = async_call_later(self.hass, seconds, _grace_expired)

    def stop_grace(self) -> None:
        if self._grace_cancel is not None:
            self._grace_cancel()
            self._grace_cancel = None

    def device_online(self, mac: str) -> bool:
        """Per-device availability with the startup grace window: a device
        that has published availability uses that; one never seen this boot
        is assumed online only until the grace window closes."""
        if mac in self.device_available:
            return self.device_available[mac]
        return not self._grace_over

    # ── paho-compatible publish interface (called by proxy code) ──────────

    def publish(self, topic: str, payload: Any, retain: bool = False, qos: int = 0) -> None:
        if isinstance(payload, bytes):
            payload = payload.decode("utf-8", errors="replace")
        payload = str(payload)

        if topic == HA_STATUS_TOPIC:
            online = payload == "online"
            if online != self.available:
                self.available = online
                async_dispatcher_send(self.hass, SIGNAL_AVAILABILITY)
            return

        if topic.startswith("ggs/ha/") and topic.endswith("/availability"):
            mac = topic.split("/")[2]
            online = payload == "online"
            # Compare against the EFFECTIVE availability (grace-aware): a
            # device coming online after the grace window expired changes
            # from implicitly-unavailable to available and must dispatch.
            effective_before = self.device_online(mac)
            self.device_available[mac] = online
            if effective_before != online:
                async_dispatcher_send(
                    self.hass, SIGNAL_DEVICE_AVAIL_FMT.format(mac)
                )
            return

        if topic.startswith("ggs/ha/") and topic.endswith("/state"):
            self.states[topic] = payload
            async_dispatcher_send(self.hass, SIGNAL_STATE_FMT.format(topic), payload)
            return

        _LOGGER.debug("Bus: ignoring publish to %s", topic)

    # No-op publish/subscribe surface (kept for interface parity)
    def subscribe(self, *a, **kw): pass
    def unsubscribe(self, *a, **kw): pass
    def loop_start(self): pass
    def loop_stop(self): pass

    # ── Logical device slots (v3.1.0) ──────────────────────────────────────

    @staticmethod
    def _slot_name(dtype: str, n: int) -> str:
        from .entity_defs import _SLOT_PREFIX
        dtype = (dtype or "dev").lower()
        prefix = _SLOT_PREFIX.get(dtype, dtype)
        # Strips: first is the bare prefix (ac5), extras suffixed (ac5_2).
        # Others (dp, lc, se): numbered (dp1, dp2).
        if dtype in ("ps5", "ps10"):
            return prefix if n == 1 else f"{prefix}_{n}"
        return f"{prefix}{n}"

    def get_slot(self, mac_raw: str, dtype: str) -> str:
        """Persistent logical slot for a device (cb1, cb2, ps5, lc1 ...).
        Assigned on first sight, stored in the config entry, transferred by
        migration, and editable in the integration options."""
        mac = _mac(mac_raw)
        if mac in self._slot_cache:
            # Self-heal: if the stored mapping was wiped (pre-3.2.5 Settings
            # save replaced options wholesale), re-persist from cache so a
            # restart can't reassign slots by connect order.
            entry = self.hass.config_entries.async_get_entry(self.entry_id)
            if entry is not None:
                stored = (entry.options or {}).get("device_slots", {})
                if mac not in stored:
                    self.hass.config_entries.async_update_entry(
                        entry,
                        options={
                            **(entry.options or {}),
                            "device_slots": {**stored, **self._slot_cache},
                        },
                    )
                    _LOGGER.warning(
                        "Re-persisted device slots (stored mapping was "
                        "missing): %s", self._slot_cache,
                    )
            return self._slot_cache[mac]
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        slots: dict = dict((entry.options or {}).get("device_slots", {})) if entry else {}
        self._slot_cache.update(slots)
        if mac in slots:
            return slots[mac]
        taken = set(slots.values())
        n = 1
        while self._slot_name(dtype, n) in taken:
            n += 1
        slot = self._slot_name(dtype, n)
        slots[mac] = slot
        self._slot_cache[mac] = slot
        if entry:
            self.hass.config_entries.async_update_entry(
                entry, options={**(entry.options or {}), "device_slots": slots}
            )
        _LOGGER.info("Assigned slot %s to device %s (%s)", slot, mac, dtype)
        DIAG.bus_event(f"slot {mac} -> {slot}")
        return slot

    def _soil_serials_on_mac(self, mac: str) -> set:
        """Serials whose probe entities currently live under this CB
        (derived from registry unique_ids: ggs_{mac}_soil_{serial}_*)."""
        registry = er.async_get(self.hass)
        from .const import DOMAIN as _DOM
        prefix = f"ggs_{mac}_soil_"
        serials = set()
        for entity in registry.entities.values():
            if entity.platform != _DOM:
                continue
            uid = entity.unique_id or ""
            if uid.startswith(prefix):
                body = uid[len(prefix):]
                serial, _, suffix = body.rpartition("_")
                if suffix in ("temperature", "moisture", "ec"):
                    serials.add(serial.lower())
        return serials

    def get_soil_slot(self, sensor_id: str, mac_raw: str = "") -> str:
        """Persistent logical slot for a soil probe (soil1, soil2...), keyed
        by serial. Numbering is PER-CB (v3.3.1): each Display Panel counts its
        own probes, so cb1 and cb2 can both have a soil1. A probe moved to a
        CB where its number is taken gets renumbered on that CB."""
        import re as _re
        serial = _re.sub(r"[^a-zA-Z0-9_]", "_", str(sensor_id)).lower()
        mac = _mac(mac_raw) if mac_raw else ""

        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        slots: dict = dict((entry.options or {}).get("soil_slots", {})) if entry else {}
        slots.update(self._soil_cache)

        def taken_on_mac() -> set:
            if not mac:
                return set(slots.values())
            peers = self._soil_serials_on_mac(mac) | {
                s for s, m in self._soil_attach.items() if m == mac
            }
            return {slots[s] for s in peers if s in slots and s != serial}

        slot = slots.get(serial)
        if slot is not None and slot in taken_on_mac():
            # Probe moved onto a CB that already uses this number
            slot = None
        if slot is None:
            taken = taken_on_mac()
            n = 1
            while f"soil{n}" in taken:
                n += 1
            slot = f"soil{n}"
            _LOGGER.info("Assigned slot %s to soil probe %s", slot, serial)
            DIAG.bus_event(f"soil_slot {serial} -> {slot}")
        if slots.get(serial) != slot or (
            entry and serial not in (entry.options or {}).get("soil_slots", {})
        ):
            slots[serial] = slot
            if entry:
                self.hass.config_entries.async_update_entry(
                    entry, options={**(entry.options or {}), "soil_slots": slots}
                )
        self._soil_cache[serial] = slot
        if mac:
            self._soil_attach[serial] = mac
        return slot

    def drop_slot(self, mac_raw: str) -> None:
        """Forget a device's slot (used on retype so it gets a slot of the
        corrected type)."""
        mac = _mac(mac_raw)
        self._slot_cache.pop(mac, None)
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry:
            slots = dict((entry.options or {}).get("device_slots", {}))
            if mac in slots:
                slots.pop(mac)
                self.hass.config_entries.async_update_entry(
                    entry, options={**(entry.options or {}), "device_slots": slots}
                )

    def _slot_for_cfg(self, device_cfg: dict) -> str:
        return self.get_slot(
            device_cfg.get("mac", ""), (device_cfg.get("type") or "").lower()
        )

    # ── Device / entity registration (called via ha/discovery.py shim) ────

    @callback
    def register_device(self, device_cfg: dict) -> None:
        """Create all entities for one GGS device. Idempotent — the proxy's
        60s ensure_discovery() republish becomes a cheap no-op.

        If the device registry already knows this MAC under a different
        name/model (a previous run misdetected the type), repair the
        registry in place first so entity IDs land on the correct slugs."""
        from .entity_defs import _device_name, _device_model

        # Record the authoritative display name/model for this MAC so
        # entities (whose device_info is computed live) always register
        # the device under its *current* detected type — including when
        # HA re-adds them mid-retype after an entity_id rename.
        self.device_display[_mac(device_cfg.get("mac", ""))] = (
            _device_name(device_cfg), _device_model(device_cfg)
        )
        self._repair_if_retyped(device_cfg)
        # Re-evaluate power-strip nesting every discovery cycle (this runs
        # ~every 60s via ensure_discovery), so a strip that connected before
        # its host panel still nests once both are up — not only on the first
        # block report.
        self._update_strip_nesting(device_cfg)
        # Environment target device: one per display panel (CB), created once,
        # if enabled in options.
        if self.env_entities and (device_cfg.get("type", "") or "").lower() == "cb":
            mac = _mac(device_cfg.get("mac", ""))
            if f"ggs_{mac}_env_temp_day" not in self._registered:
                # Ensure the panel device exists first so the env device's
                # via_device link resolves and it nests under the panel.
                from homeassistant.helpers import device_registry as dr
                from .const import DOMAIN
                from .entity_defs import _device_name, _device_model
                entry = self.hass.config_entries.async_get_entry(self.entry_id)
                if entry is not None:
                    dr.async_get(self.hass).async_get_or_create(
                        config_entry_id=entry.entry_id,
                        identifiers={(DOMAIN, f"ggs_{mac}")},
                        name=_device_name(device_cfg),
                        manufacturer="Spider Farmer",
                        model=_device_model(device_cfg),
                    )
                self._add_defs(build_env_entities(
                    device_cfg, slot=self._slot_for_cfg(device_cfg)))
        # v3.0.12: no entities on faith — groups are created via
        # blocks_seen()/outlet_seen() from what the device actually reports.

    @callback
    def retype_device(self, device_cfg: dict) -> None:
        """Called by the proxy when accumulated evidence contradicts an
        earlier tentative type (e.g. 'lc' turned out to be a CB)."""
        mac = _mac(device_cfg.get("mac", ""))
        _LOGGER.warning(
            "Retyping device %s to %s — earlier detection was wrong",
            mac, device_cfg.get("type"),
        )
        DIAG.bus_event(f"retype {mac} -> {device_cfg.get('type')}")
        # Clear pruned outlets so pruning re-evaluates under the new type
        self._pruned = {u for u in self._pruned if not u.startswith(f"ggs_{mac}_")}
        self.drop_slot(device_cfg.get("mac", ""))
        self.register_device(device_cfg)

    def _repair_if_retyped(self, device_cfg: dict) -> None:
        from homeassistant.helpers import device_registry as dr
        from homeassistant.util import slugify

        from .const import DOMAIN
        from .entity_defs import _device_name, _device_model

        mac = _mac(device_cfg.get("mac", ""))
        expected_name = _device_name(device_cfg)
        expected_model = _device_model(device_cfg)

        dev_reg = dr.async_get(self.hass)
        device = dev_reg.async_get_device(identifiers={(DOMAIN, f"ggs_{mac}")})
        if device is None or (
            device.name == expected_name and device.model == expected_model
        ):
            return  # nothing stale

        _LOGGER.warning(
            "Device ggs_%s is registered as %r (%s) but is actually %r (%s) — "
            "repairing registry in place",
            mac, device.name, device.model, expected_name, expected_model,
        )

        wanted = {
            d.unique_id: d
            for d in build_device_entities(
                device_cfg, slot=self._slot_for_cfg(device_cfg)
            )
        }
        ent_reg = er.async_get(self.hass)
        prefix = f"ggs_{mac}_"

        for entry in list(er.async_entries_for_device(ent_reg, device.id, include_disabled_entities=True)):
            uid = entry.unique_id or ""
            if not uid.startswith(prefix):
                continue
            target = wanted.get(uid)
            if target is not None:
                expected_eid = f"{target.platform}.{target.expected_object_id}"
                self._rename_entity(ent_reg, entry.entity_id, expected_eid)
            elif "_soil_" in uid:
                # Soil probe — keep it, rename to the corrected slot slug
                # uid: ggs_{mac}_soil_{id}_{suffix} → "sf_{slot}_soil_{id}_{suffix}"
                tail = uid[len(prefix):]           # soil_{id}_{suffix}
                slot = self._slot_for_cfg(device_cfg)
                expected_eid = f"sensor.{slugify(f'sf_{slot}_{tail}')}"
                self._rename_entity(ent_reg, entry.entity_id, expected_eid)
            else:
                # Entity type the corrected device doesn't have (e.g. a CB
                # has no light_2) — remove it.
                _LOGGER.info("Removing stale entity %s (%s)", entry.entity_id, uid)
                ent_reg.async_remove(entry.entity_id)
                self._registered.discard(uid)

        dev_reg.async_update_device(
            device.id, name=expected_name, model=expected_model
        )

    def _rename_entity(self, ent_reg, current_eid: str, expected_eid: str) -> None:
        if current_eid == expected_eid:
            return
        try:
            ent_reg.async_update_entity(current_eid, new_entity_id=expected_eid)
            _LOGGER.info("Renamed %s -> %s", current_eid, expected_eid)
        except (ValueError, KeyError) as exc:
            _LOGGER.warning(
                "Could not rename %s -> %s: %s", current_eid, expected_eid, exc
            )

    @callback
    def reconcile_all_entity_ids(self) -> None:
        """Collision-safe two-phase rename of every sf_ entity to the id its
        current slot dictates. Handles slot SWAPS (cb1<->cb2 in one submit),
        where a direct rename fails because the target id is still occupied
        by the other device. Phase 1 parks every mismatched entity on a
        unique temp id (vacating all targets); phase 2 moves temp -> final.
        Called once after setup and after any slot edit / reload."""
        from homeassistant.config_entries import ConfigEntry  # noqa: F401
        registry = er.async_get(self.hass)
        from .const import DOMAIN as _DOM

        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is None:
            return
        slots: dict = dict((entry.options or {}).get("device_slots", {}))
        if not slots:
            return

        # Build MAC -> device_cfg from live sessions' known types, falling
        # back to the device registry model.
        planned: list[tuple[str, str]] = []   # (current_eid, final_eid)
        for entity in registry.entities.values():
            if entity.platform != _DOM:
                continue
            uid = entity.unique_id or ""
            if not uid.startswith("ggs_"):
                continue
            obj = entity.entity_id.split(".", 1)[1]
            if not obj.startswith("sf_"):
                continue
            mac = uid[4:].split("_", 1)[0]
            slot = slots.get(mac)
            if not slot:
                continue
            # unique_id: ggs_{mac}_{field}; field may itself contain _
            field = uid[len(f"ggs_{mac}_"):]
            final_obj = _expected_obj(slot, field, entity, registry)
            final_eid = f"{entity.domain}.{final_obj}"
            if final_eid != entity.entity_id:
                planned.append((entity.entity_id, final_eid))

        if not planned:
            return

        # Phase 1: park everything on temp ids
        import time as _t
        stamp = int(_t.time())
        temp_map: list[tuple[str, str]] = []
        for i, (cur, final) in enumerate(planned):
            domain = cur.split(".", 1)[0]
            temp = f"{domain}.sf_migtmp_{stamp}_{i}"
            self._rename_entity(registry, cur, temp)
            temp_map.append((temp, final))

        # Phase 2: temp -> final (all targets now vacated)
        for temp, final in temp_map:
            self._rename_entity(registry, temp, final)

        _LOGGER.info("Reconciled %d entity ids to current slots", len(planned))
        DIAG.bus_event(f"reconcile_all renamed={len(planned)}")

    @callback
    @callback
    def restore_registered_entities(self) -> None:
        """v3.9.0 (keep-offline): at startup, recreate a live entity object
        for every registry entry under this config entry. Without this, an
        accessory that is powered off (its block absent from reports) has no
        entity object after a restart — automations referencing it error
        until it next reports. Restored entities come back with their last
        state (RestoreEntity) and go live on the next matching report."""
        if not self.keep_offline:
            return
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is None:
            return
        from homeassistant.helpers import device_registry as dr

        from .const import DOMAIN
        from .entity_defs import _TYPE_LABELS

        model_to_type = {v: k for k, v in _TYPE_LABELS.items()}
        dev_reg = dr.async_get(self.hass)
        ent_reg = er.async_get(self.hass)
        restored = 0

        for device in dr.async_entries_for_config_entry(dev_reg, entry.entry_id):
            mac = None
            for dom, ident in device.identifiers:
                if dom == DOMAIN and str(ident).startswith("ggs_"):
                    mac = str(ident)[4:]
            if not mac:
                continue
            dtype = model_to_type.get(device.model or "")
            if not dtype:
                continue

            # Entities re-register device_info on add — seed the display
            # cache from the registry so the device keeps its current
            # name/model instead of reverting to the default label.
            self.device_display[mac] = (
                device.name or _mac(mac), device.model or ""
            )

            existing = {
                e.unique_id
                for e in er.async_entries_for_device(
                    ent_reg, device.id, include_disabled_entities=True
                )
                if (e.unique_id or "").startswith("ggs_")
            }
            if not existing:
                continue

            cfg = {"mac": mac, "type": dtype}
            slot = self._slot_for_cfg(cfg)
            defs = [
                d for d in build_device_entities(cfg, slot=slot)
                if d.unique_id in existing
            ]

            # Soil probes: rebuilt from their serial-based unique_ids
            covered = {d.unique_id for d in defs}
            soil_prefix = f"ggs_{mac}_soil_"
            serials = set()
            for uid in existing - covered:
                if uid.startswith(soil_prefix):
                    body = uid[len(soil_prefix):]
                    # Per-device AVERAGE sensors (ggs_{mac}_soil_avg_*) share the
                    # soil_ prefix but are NOT probes. Skip them here — the live
                    # register_soil() path recreates the averages from probe
                    # reports. Older builds treated "avg" as a probe serial,
                    # which registered phantom soilN entities (the average got
                    # handed the next free probe slot, e.g. soil5).
                    if body.startswith("avg_"):
                        continue
                    # Calibration/substrate diagnostic entities also share the
                    # soil_ prefix (ggs_{mac}_soil_{serial}_cal_* / _substrate)
                    # but are NOT probes. Skip them, or the restore re-reads
                    # "{serial}_cal" as a phantom probe serial and spawns extra
                    # soilN sensors on every reboot (BUG: 3.18.x).
                    if "_cal_" in body or body.endswith("_substrate"):
                        continue
                    serial, _, suffix = body.rpartition("_")
                    if serial and suffix in ("temperature", "moisture", "ec"):
                        serials.add(serial)
            for serial in sorted(serials):
                defs += build_soil_entities(
                    mac, serial, cfg, slot=slot,
                    soil_slot=self.get_soil_slot(serial, mac),
                )

            if defs:
                self._add_defs(defs)
                restored += len(defs)

        if restored:
            _LOGGER.info(
                "Restored %d entities from the registry (keep-offline)",
                restored,
            )
            DIAG.bus_event(f"restore_registered {restored}")

    def note_soil_type(self, serial: str, mst_fw_ver) -> None:
        """Record a probe as Pro or Basic from its firmware marker: a Basic
        probe reports mst_fw_ver 65535 (0xFFFF, no real firmware); a Pro
        probe reports a genuine version. Persisted to options so the mappings
        list can label probes without waiting for a fresh report."""
        try:
            fw = int(mst_fw_ver)
        except (ValueError, TypeError):
            return
        kind = "Basic" if fw == 65535 else "Pro"
        key = str(serial).lower()
        if self._soil_type.get(key) == kind:
            return
        self._soil_type[key] = kind
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is not None:
            types = dict((entry.options or {}).get("soil_types", {}))
            if types.get(key) != kind:
                types[key] = kind
                self.hass.config_entries.async_update_entry(
                    entry, options={**(entry.options or {}), "soil_types": types}
                )

    @callback
    def apply_air_calibration(self, mac_raw: str, cal: dict) -> None:
        """Air-sensor calibration offsets (config file top-level ``calibration``
        {temp,humi,co2,ppfd}). Creates the diagnostic sensors once and publishes
        the current offsets. Air-temp is converted degC(wire) -> degF(display)."""
        if not isinstance(cal, dict):
            return
        mac = _mac(mac_raw)
        self._air_cal[mac] = dict(cal)
        if f"ggs_{mac}_cal_air_temp" not in self._registered:
            cfg = {"mac": mac_raw, "type": self._type_for_mac(mac_raw) or "cb"}
            self._add_defs(build_air_calibration_entities(
                cfg, slot=self._slot_for_cfg(cfg)))
        t = cal.get("temp")
        if t is not None:
            self.publish(f"ggs/ha/{mac}/cal_air_temp/state", round(float(t) * 9 / 5, 1))
        for wire, field in (("humi", "cal_air_humidity"), ("co2", "cal_co2"),
                            ("ppfd", "cal_ppfd")):
            if cal.get(wire) is not None:
                self.publish(f"ggs/ha/{mac}/{field}/state", cal[wire])

    def apply_soil_labels(self, mac_raw: str, entries: list) -> None:
        """App-set soil-probe names (senConfig[].label): store per serial and
        live-rename the probe's sensors. Read-only — the app is the source of
        truth; a blank/absent label leaves the default 'Soil N'. A custom HA
        entity name still wins (HA's name_by_user overrides the default)."""
        if not isinstance(entries, list):
            return
        for e in entries:
            if not isinstance(e, dict):
                continue
            serial = str(e.get("id") or "").strip()
            if not serial:
                continue
            self._soil_cfg_cache[serial] = dict(e)
            import re as _re
            safe = _re.sub(r"[^a-zA-Z0-9_]", "_", serial)
            mac = _mac(mac_raw)
            cal = e.get("calibration")
            cal = cal if isinstance(cal, dict) else {}
            self.publish(f"ggs/ha/{mac}/soil_{safe}_cal_temp/state",
                         round(float(cal.get("tempSoil") or 0) * 9 / 5, 1))
            self.publish(f"ggs/ha/{mac}/soil_{safe}_cal_moisture/state",
                         cal.get("humiSoil") or 0)
            self.publish(f"ggs/ha/{mac}/soil_{safe}_cal_ec/state",
                         cal.get("ECSoil") or 0)
            st = e.get("soilType")
            try:
                idx = int(st) if st is not None else 0
            except (ValueError, TypeError):
                idx = 0
            if 0 <= idx < len(SUBSTRATE_OPTIONS):
                self.publish(f"ggs/ha/{mac}/soil_{safe}_substrate/state",
                             SUBSTRATE_OPTIONS[idx])
            raw = e.get("label")
            label = raw.strip() if isinstance(raw, str) else ""
            if not label or self._soil_label.get(serial) == label:
                continue
            self._soil_label[serial] = label
            async_dispatcher_send(
                self.hass, SIGNAL_SOIL_LABEL_FMT.format(serial), label
            )
            DIAG.bus_event(f"soil_label {serial} -> {label!r}")

    def register_soil(self, mac_raw: str, sensor_id: str, device_cfg: dict) -> None:
        slot = self._slot_for_cfg(
            {**device_cfg, "mac": device_cfg.get("mac", mac_raw)}
        )
        self._add_defs(build_soil_entities(
            mac_raw, sensor_id, device_cfg,
            slot=slot, soil_slot=self.get_soil_slot(sensor_id, mac_raw),
            name_label=self._soil_label.get(sensor_id),
        ))
        # v3.11.2b0: per-device average soil sensors, created once when the
        # first probe on this device is seen (gated on probe presence).
        avg_uid = f"ggs_{_mac(mac_raw)}_soil_avg_temperature"
        if avg_uid not in self._registered:
            self._add_defs(build_soil_avg_entities(mac_raw, device_cfg, slot=slot))
        # Per-probe calibration sensors; Substrate only on Pro probes (Basic
        # probes report mst_fw_ver 65535 and have no substrate type).
        is_pro = self._soil_type.get(str(sensor_id).lower()) == "Pro"
        self._add_defs(build_soil_calibration_entities(
            mac_raw, sensor_id, device_cfg,
            slot=slot, soil_slot=self.get_soil_slot(sensor_id, mac_raw),
            include_substrate=is_pro,
        ))

    @callback
    def retire_soil(self, serial: str) -> int:
        """Remove a probe's entities + slot mapping (mapping-screen retire).
        If the probe still reports, it re-registers under a fresh slot."""
        registry = er.async_get(self.hass)
        from .const import DOMAIN as _DOM
        removed = 0
        needle = f"_soil_{serial}_".lower()
        for entity in list(registry.entities.values()):
            if entity.platform != _DOM:
                continue
            if needle in (entity.unique_id or "").lower():
                registry.async_remove(entity.entity_id)
                self._registered.discard(entity.unique_id)
                removed += 1
        # slot keys are stored lowercased; match either case
        for key in [k for k in self._soil_cache if k.lower() == serial.lower()]:
            self._soil_cache.pop(key, None)
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is not None:
            slots = dict((entry.options or {}).get("soil_slots", {}))
            popped = [k for k in slots if k.lower() == serial.lower()]
            if popped:
                for k in popped:
                    slots.pop(k)
                self.hass.config_entries.async_update_entry(
                    entry, options={**(entry.options or {}), "soil_slots": slots}
                )
        _LOGGER.info("Retired soil probe %s (%d entities removed)", serial, removed)
        DIAG.bus_event(f"retire_soil {serial} removed={removed}")
        return removed

    @callback
    def prune_outlet(self, mac_raw: str, outlet_num: int) -> None:
        """Remove a ghost outlet's entity from the registry."""
        unique_id = f"ggs_{_mac(mac_raw)}_outlet_{outlet_num}"
        self._pruned.add(unique_id)
        # Remove from the registry even if not registered THIS run —
        # cleans up phantom outlets left behind by pre-3.0.11 versions.
        registry = er.async_get(self.hass)
        from .const import DOMAIN
        entity_id = registry.async_get_entity_id("switch", DOMAIN, unique_id)
        if entity_id:
            registry.async_remove(entity_id)
            _LOGGER.info("Pruned ghost outlet entity %s", entity_id)
            DIAG.bus_event(f"pruned {entity_id}")
        self._registered.discard(unique_id)

    @callback
    def outlet_seen(self, mac_raw: str, outlet_num: int, device_cfg: dict) -> None:
        """Evidence-based outlet creation (v3.0.11): a device reported this
        outlet number — create its entities if they don't exist yet."""
        mac = _mac(mac_raw)
        unique_id = f"ggs_{mac}_outlet_{outlet_num}"
        self._pruned.discard(unique_id)
        slot = self._slot_for_cfg(device_cfg)
        dname = _device_name(device_cfg)
        dmodel = _device_model(device_cfg)

        # Base On/Off switch — create once.
        if unique_id not in self._registered:
            defs = [
                d for d in build_device_entities(device_cfg, slot=slot)
                if d.unique_id == unique_id
            ]
            if defs:
                _LOGGER.info("Outlet reported — creating entity %s", unique_id)
                DIAG.bus_event(f"outlet_seen {unique_id}")
                self._add_defs(defs)

        # v3.11.1a: per-outlet Mode selector + current mode's config — created
        # INDEPENDENTLY of the switch. The keep-offline restore re-registers the
        # switch (it is in build_device_entities) but NOT these dynamically-built
        # mode entities; gating them behind the switch's "create once" check left
        # the Mode select "no longer provided by the integration" after any
        # restart. Keying on the mode select's own unique_id fixes that. (3.17.1)
        mode_uid = f"ggs_{mac}_outlet_{outlet_num}_mode"
        if mode_uid not in self._registered:
            self._add_defs([
                build_outlet_mode_select(mac_raw, outlet_num, slot, dname, dmodel)
            ])
            self._sync_outlet_mode(
                mac_raw, outlet_num, self.outlet_mode(mac, outlet_num),
                device_cfg,
            )

    # Backwards-compatible alias (pre-3.0.11 name)
    unprune_outlet = outlet_seen

    # ── Outlet modes (v3.11.1a alpha) ─────────────────────────────────────
    def outlet_mode(self, mac: str, n: int) -> str:
        return self._outlet_mode.get(f"{_mac(mac)}_{n}", "Manual")

    def soil_options(self) -> list[str]:
        """Drip-irrigation soil choices, built from the soil sensors actually
        detected (no hard cap). A pro CB with 6 probes yields 6 entries; a
        non-pro device with its single probe yields 1. 'Average' first."""
        from .entity_defs import soil_display_label
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        slots: dict = dict((entry.options or {}).get("soil_slots", {})) if entry else {}
        slots.update(self._soil_cache)

        def _key(slot: str):
            tail = slot[4:] if slot.startswith("soil") else slot
            return (0, int(tail)) if tail.isdigit() else (1, slot)

        labels = [soil_display_label(sl) for sl in sorted(set(slots.values()), key=_key)]
        return ["Average"] + labels

    @callback
    def set_outlet_mode_from_device(self, mac_raw: str, n: int,
                                    mode_type: int, device_cfg: dict) -> None:
        """Device reported an outlet's modeType — reflect it in the mode
        selector and swap the visible config entities."""
        mode = OUTLET_TYPE_TO_MODE.get(mode_type)
        if mode is None:
            return
        key = f"{_mac(mac_raw)}_{n}"
        if self._outlet_mode.get(key) == mode:
            return
        self._sync_outlet_mode(mac_raw, n, mode, device_cfg)

    @callback
    def set_outlet_mode_from_ha(self, mac_raw: str, n: int, mode: str) -> None:
        """HA Mode select changed — optimistically swap visible entities.
        The device confirms via its next report."""
        cfg = {"mac": mac_raw, "type": self._type_for_mac(mac_raw)}
        self._sync_outlet_mode(mac_raw, n, mode, cfg)

    def _type_for_mac(self, mac_raw: str) -> str:
        mac = _mac(mac_raw)
        name, model = self.device_display.get(mac, ("", ""))
        from .entity_defs import _TYPE_LABELS
        for t, label in _TYPE_LABELS.items():
            if label == model:
                return t
        return "ps10"

    def _sync_outlet_mode(self, mac_raw: str, n: int, mode: str,
                          device_cfg: dict) -> None:
        """Make exactly the entities for `mode` visible on this outlet:
        remove the previous mode's config entities from the registry (they
        vanish from the UI — full add/remove) and add the new mode's."""
        mac = _mac(mac_raw)
        key = f"{mac}_{n}"
        prev = self._outlet_mode.get(key)
        self._outlet_mode[key] = mode
        slot = self._slot_for_cfg(device_cfg)
        dname = _device_name(device_cfg)
        dmodel = _device_model(device_cfg)

        if prev and prev != mode:
            for d in build_outlet_mode_config(
                mac_raw, n, slot, dname, dmodel, prev,
                soil_options=self.soil_options(),
            ):
                self._remove_entity(d.platform, d.unique_id)

        new_defs = build_outlet_mode_config(
            mac_raw, n, slot, dname, dmodel, mode,
            soil_options=self.soil_options(),
        )
        if new_defs:
            self._add_defs(new_defs)
        DIAG.bus_event(f"outlet_mode {key} -> {mode}")

    def _remove_entity(self, platform: str, unique_id: str) -> None:
        """Fully remove an entity so it disappears from the UI (not greyed).
        Removing the registry entry fires HA's remove event, which drives the
        entity's own async_remove."""
        registry = er.async_get(self.hass)
        from .const import DOMAIN, SIGNAL_REMOVE_FMT
        eid = registry.async_get_entity_id(platform, DOMAIN, unique_id)
        async_dispatcher_send(self.hass, SIGNAL_REMOVE_FMT.format(unique_id))
        if eid and registry.async_get(eid):
            registry.async_remove(eid)
        self._registered.discard(unique_id)
        self._pruned.discard(unique_id)

    @callback
    def forget_device(self, mac: str) -> None:
        """Clear runtime registration state for a MAC (device deletion) so
        a reconnecting device recreates its entities from scratch. The slot
        mapping is intentionally KEPT — a returning device gets its old
        entity_ids back."""
        prefix = f"ggs_{mac}_"
        self._registered = {u for u in self._registered if not u.startswith(prefix)}
        self._pruned = {u for u in self._pruned if not u.startswith(prefix)}
        self.device_available.pop(mac, None)
        stale = [t for t in self.states if t.startswith(f"ggs/ha/{mac}/")]
        for t in stale:
            self.states.pop(t, None)
        DIAG.bus_event(f"forget_device {mac}")

    @callback
    def host_cb_mac_for_strip(self, mac: str) -> Optional[str]:
        """Display-panel mac hosting this power strip, or None if standalone."""
        prox = self.proxy
        if prox is None:
            return None
        try:
            return prox.host_cb_mac_for_strip(mac)
        except Exception:  # pragma: no cover - defensive
            return None

    def _update_strip_nesting(self, device_cfg: dict) -> None:
        """Nest a power strip under the display panel that hosts it
        (via_device), or leave it top-level when it runs standalone. Idempotent
        and re-evaluated each report, so plugging/unplugging a strip re-nests
        within a discovery cycle. Only the device link changes; entity ids and
        history are untouched."""
        dtype = (device_cfg.get("type", "") or "").lower()
        if dtype not in ("ps5", "ps10"):
            return
        from homeassistant.helpers import device_registry as dr
        from .const import DOMAIN
        mac = _mac(device_cfg.get("mac", ""))
        reg = dr.async_get(self.hass)
        strip = reg.async_get_device(identifiers={(DOMAIN, f"ggs_{mac}")})
        if strip is None:
            return
        host_mac = self.host_cb_mac_for_strip(mac)
        parent = (
            reg.async_get_device(identifiers={(DOMAIN, f"ggs_{host_mac}")})
            if host_mac else None
        )
        want = parent.id if parent else None
        if strip.via_device_id != want:
            reg.async_update_device(strip.id, via_device_id=want)
            _LOGGER.info(
                "Strip %s nesting -> %s", mac,
                f"under panel {host_mac}" if want else "top-level (standalone)",
            )

    def blocks_seen(self, mac_raw: str, seen: set, device_cfg: dict) -> None:
        """Evidence-based group creation (v3.0.12): the device reported
        these data blocks — create their entity groups if missing."""
        self._update_strip_nesting(device_cfg)
        blocks = set(seen) & set(EVIDENCE_BLOCKS)
        if not blocks:
            return
        defs = build_device_entities(
            device_cfg, include_outlets=False, blocks=blocks,
            slot=self._slot_for_cfg(device_cfg),
        )
        defs = [d for d in defs if d.unique_id not in self._registered]
        for d in defs:
            self._pruned.discard(d.unique_id)
        if defs:
            DIAG.bus_event(
                f"blocks_seen {_mac(device_cfg.get('mac',''))} {sorted(blocks)} "
                f"-> +{len(defs)} entities"
            )
            self._add_defs(defs)

    @callback
    def prune_blocks(self, mac_raw: str, evidence: set, device_cfg: dict) -> None:
        """Remove registry leftovers for blocks the device never reports
        (phantom lights/fans/climate from pre-3.0.12 versions).

        v3.9.0: gated behind the "keep offline devices" option (default on).
        A powered-off accessory looks exactly like a phantom — its block is
        absent from reports — so with the option on, nothing is removed and
        gear that is merely switched off survives restarts. Uncheck the
        option to restore phantom cleanup."""
        if self.keep_offline:
            _LOGGER.debug(
                "prune_blocks skipped for %s (keep-offline enabled)",
                _mac(device_cfg.get("mac", "")),
            )
            return
        registry = er.async_get(self.hass)
        from .const import DOMAIN
        removed = 0
        for block in EVIDENCE_BLOCKS:
            if block in evidence:
                continue
            for d in build_device_entities(
                device_cfg, include_outlets=False, blocks={block}
            ):
                self._pruned.add(d.unique_id)
                entity_id = registry.async_get_entity_id(
                    d.platform, DOMAIN, d.unique_id
                )
                if entity_id:
                    registry.async_remove(entity_id)
                    self._registered.discard(d.unique_id)
                    removed += 1
        if removed:
            _LOGGER.info(
                "Pruned %d phantom entities from %s (blocks never reported)",
                removed, _mac(device_cfg.get("mac", "")),
            )
            DIAG.bus_event(f"prune_blocks {_mac(device_cfg.get('mac',''))} removed={removed}")

    def _add_defs(self, defs: list[SfDef]) -> None:
        registry = er.async_get(self.hass)
        from .const import DOMAIN as _DOM
        new: dict[str, list[SfDef]] = {}
        for d in defs:
            # v3.1.0 entity_id reconcile: existing registry entries created
            # under older naming schemes (sf_display_panel_4e01_*) rename to
            # the slot scheme (sf_dp1_*). Only our own sf_* ids are touched.
            existing = registry.async_get_entity_id(d.platform, _DOM, d.unique_id)
            if existing:
                expected = f"{d.platform}.{d.expected_object_id}"
                obj = existing.split(".", 1)[1]
                if existing != expected and obj.startswith("sf_"):
                    # Never fight the global reconcile: if the target id is
                    # occupied (a swap in progress), leave it — the two-phase
                    # pass handles swaps collision-free.
                    if registry.async_get(expected) is None:
                        self._rename_entity(registry, existing, expected)
            uid = d.unique_id
            if uid in self._registered or uid in self._pruned:
                continue
            self._registered.add(uid)
            new.setdefault(d.platform, []).append(d)

        for platform, plat_defs in new.items():
            if platform in self._ready:
                async_dispatcher_send(
                    self.hass, SIGNAL_NEW_FMT.format(platform), plat_defs
                )
            else:
                self._pending.setdefault(platform, []).extend(plat_defs)

    @callback
    def platform_ready(self, platform: str) -> list[SfDef]:
        """Called by each platform's async_setup_entry after it connects its
        dispatcher listener. Returns any defs that arrived early."""
        self._ready.add(platform)
        return self._pending.pop(platform, [])

    # ── Command gateway ────────────────────────────────────────────────────

    async def async_command(self, topic: str, payload: str) -> None:
        if self.proxy is None:
            raise HomeAssistantError("Spider Farmer Bridge proxy is not running")
        if not self.proxy.allow_control:
            raise HomeAssistantError(
                "Device control is disabled — enable it in the "
                "Spider Farmer Bridge integration options"
            )
        await self.proxy.handle_command(topic, payload)

    # ── Convenience for entities ───────────────────────────────────────────

    def cached(self, topic: str) -> Optional[str]:
        return self.states.get(topic)
