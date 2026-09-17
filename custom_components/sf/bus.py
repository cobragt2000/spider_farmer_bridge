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
import re
import time
from typing import Any, Optional

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .tempunits import cdelta_to_disp

from .diag import DIAG
from .const import (
    CONF_OUTLET_ENV,
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
            # sf_{cb_slot}_{soil_slot}_{suffix}. The suffix is either a probe
            # reading (temperature/moisture/ec) OR an editable-calibration field
            # (cal_temp/cal_moisture/cal_ec/substrate). Earlier builds only
            # matched the readings, so the cal/substrate ids were never re-homed
            # on a dp-slot change — a dp1<->dp2 swap stranded them on the wrong
            # panel (v3.19.103 fix).
            body = field[len("soil_"):]
            cb_slot = slots.get(mac)
            # Longest / most-specific suffixes first so "cal_ec" wins over "ec".
            suffix = next(
                (s for s in (
                    "cal_temp", "cal_moisture", "cal_ec", "substrate",
                    "temperature", "moisture", "ec")
                 if body == s or body.endswith(f"_{s}")),
                None,
            )
            if not suffix or not cb_slot:
                continue
            serial = body[: len(body) - len(suffix)].rstrip("_")
            soil_slot = soil_slots.get(serial.lower())
            if not soil_slot:
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


# Fields whose SfDef pins an explicit object_id, so the entity id must NOT be
# derived from the (display) name. Keeps sensor.sf_<slot>_vpd / _leaf_vpd stable
# even though their names are "VPD Air" / "VPD Leaf".
_PINNED_OBJ_SUFFIX = {"vpd": "vpd", "leaf_vpd": "leaf_vpd"}


def _expected_obj(slot, field, entity, registry):
    """Final object_id for a slot+field. Mirrors SfDef.expected_object_id
    but works from registry data (unique_id field + original_name)."""
    from homeassistant.util import slugify
    # A pinned object_id wins over the name (the def sets object_id explicitly).
    if field in _PINNED_OBJ_SUFFIX:
        return slugify(f"sf_{slot}_{_PINNED_OBJ_SUFFIX[field]}")
    # Prefer the entity's original_name (the human name we set), which is
    # what slugify used originally: sf_{slot}_{name}. Fall back to field.
    name = entity.original_name
    if name:
        return slugify(f"sf_{slot}_{name}")
    return slugify(f"sf_{slot}_{field}")


from .entity_defs import (
    EVIDENCE_BLOCKS,
    TOGGLEABLE_BLOCKS,
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
    build_alarms_entity,
    build_alarm_settings_entity,
    build_oplog_entity,
    build_plan_entity,
    build_plan_switch_entity,
    build_soil_calibration_entities,
    SUBSTRATE_OPTIONS,
    _device_model,
    _device_name,
    _mac,
)

_LOGGER = logging.getLogger(__name__)

# A soil-probe measurement state topic: ggs/ha/{mac}/soil_{serial}_{metric}/state
# (excludes the per-device soil_avg_* topics). Used to timestamp each probe so a
# probe that stops reporting (unplugged) can be flipped to unavailable per-probe.
_SOIL_STATE_RE = re.compile(
    r"^ggs/ha/([^/]+)/soil_(?!avg_)([A-Za-z0-9]+)_(?:temperature|moisture|ec)/state$"
)

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
        self._hotspot_map_blob: str = ""             # last-written hotspot device map
        self._outlet_mode: dict[str, str] = {}       # "{mac}_{n}" -> mode name
        self._soil_type: dict[str, str] = {}         # serial -> "Pro" | "Basic"
        self._soil_label: dict[str, str] = {}        # serial -> app label (senConfig)
        self._soil_cfg_cache: dict[str, dict] = {}   # serial -> full senConfig entry
        self._air_cal: dict[str, dict] = {}          # mac -> air calibration block
        self._air_seen: set[str] = set()             # macs that reported temp/humi
                                                     # (gates Environment targets on
                                                     # strips — v3.19.251)
        # Macs whose OWN device sensor block reports CO2 (sensor:co2). An external
        # temp/humi mirror device (S-Station 3-in-1) can still have a native CO2
        # sensor, so CO2 targets must key off real CO2 evidence, not the mirror
        # flag — otherwise the Environment tab loses CO2 on such a device.
        # (v3.19.308)
        self._co2_seen: set[str] = set()
        # External-sensor mirroring for outlet-only strips (v3.19.253): a strip
        # with no SF sensor can borrow a 3rd-party HA temp/humidity entity, which
        # we mirror onto its temperature/humidity/vpd topics. mac -> unsubscribe.
        self._ext_cancels: dict[str, object] = {}
        # Macs currently on an external sensor — they get the Environment target
        # entities back (for planting-plan targets), even without an SF sensor
        # (v3.19.256). Still no air calibration (there's no SF probe to trim).
        self._ext_air: set[str] = set()
        # Which air fields are driven by an EXTERNAL sensor per mac (subset of
        # {"temperature","humidity","vpd"}). When a device also has its own SF
        # temp/hum probe (S-Station 3-in-1, a display panel) its onboard reading
        # would fight the mirror and flip-flop, so those exact device topics are
        # suppressed on report while the external mirror owns them. (v3.19.306)
        self._ext_air_fields: dict[str, set[str]] = {}
        # Smart control engine (v3.19.256): mac -> config, per-mac loop state,
        # macs already commanded once this session, and the periodic timer.
        self._smart_cfg: dict[str, dict] = {}
        self._smart_state: dict[str, object] = {}
        self._smart_primed: set[str] = set()
        self._smart_timer = None
        # Integration-driven env outlet control (v3.19.268): a sensorless strip's
        # outlet set to Temperature (Cooling/Heating) can't run on the device, so
        # we drive it from the mirrored reading + env target. mac -> {n: cfg},
        # per-(mac,n) loop state, and (mac,n) already primed this session. The
        # chosen mode is held VIRTUALLY (device stays Manual so mOnOff switches):
        # _outlet_env_view keeps the mode/direction the card should display.
        self._outlet_env: dict[str, dict[int, dict]] = {}
        self._outlet_env_state: dict[tuple, object] = {}
        self._outlet_env_primed: set[tuple] = set()
        # Last (target, deadband, direction) seen per outlet, so a setpoint change
        # (target edit or day/night flip) resets the anti-cycle dwell and reacts
        # to the new threshold immediately. (v3.19.300)
        self._outlet_env_setpoint: dict[tuple, tuple] = {}
        # Event-driven control: watch the input sensors + env target/deadband
        # entities so a threshold crossing fires a control pass at once instead of
        # waiting up to 15s for the next periodic tick. (v3.19.300)
        self._env_watch_cancel = None
        self._env_watch_ids: frozenset = frozenset()
        self._env_debounce_cancel = None
        self._led_pruned: set[str] = set()          # macs whose phantom Indicator
                                                     # Light was removed (v3.19.260)
        self._alarm_events: dict[str, dict] = {}     # mac -> {id: event}
        self._alarm_seeded: set[str] = set()         # macs seen once (don't fire on backfill)
        self._oplog_events: dict[str, dict] = {}     # mac -> {id: op entry}
        self._oplog_seeded: set[str] = set()
        # mac -> merged grow-plan state {active, present, stages, progress}. The
        # stage list arrives via getConfigFile (apply_plan) and the live progress
        # via getDevSta (apply_plan_progress); both republish the merged view.
        self._plan_state: dict[str, dict] = {}
        self.keep_offline: bool = True               # v3.9.0: keep entities for
                                                     # blocks that stop reporting
        # Per-probe offline (v3.19.57): a soil probe that stops appearing in the
        # controller's data (unplugged) is flipped to unavailable after
        # _soil_timeout seconds, instead of freezing on its last reading.
        self._soil_seen: dict[str, float] = {}       # "{mac}/{serial}" -> monotonic
        self._soil_online: dict[str, bool] = {}      # last-dispatched per-probe online
        self._soil_timeout: float = 90.0
        self._soil_timer_cancel = None
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
                # keep-offline OFF: now that live devices have had the grace
                # window to reconnect, remove whole devices that never checked in
                # this session (unplugged/removed gear). (v3.19.304)
                if not self.keep_offline:
                    self.prune_offline_devices()

        self._grace_cancel = async_call_later(self.hass, seconds, _grace_expired)

    def stop_grace(self) -> None:
        if self._grace_cancel is not None:
            self._grace_cancel()
            self._grace_cancel = None
        if self._soil_timer_cancel is not None:
            self._soil_timer_cancel()
            self._soil_timer_cancel = None
        # Tear down the control loop + its event-driven input watch on unload/reload
        # so nothing fires against a dead bus. (v3.19.300)
        if self._smart_timer is not None:
            self._smart_timer()
            self._smart_timer = None
        if self._env_watch_cancel is not None:
            self._env_watch_cancel()
            self._env_watch_cancel = None
            self._env_watch_ids = frozenset()
        if self._env_debounce_cancel is not None:
            self._env_debounce_cancel()
            self._env_debounce_cancel = None

    def device_online(self, mac: str) -> bool:
        """Per-device availability with the startup grace window: a device
        that has published availability uses that; one never seen this boot
        is assumed online only until the grace window closes."""
        if mac in self.device_available:
            return self.device_available[mac]
        return not self._grace_over

    # ── Per-probe soil freshness (v3.19.57) ───────────────────────────────
    def _note_soil_seen(self, topic: str) -> None:
        """Timestamp the probe behind a soil measurement topic. First soil
        frame also starts the staleness sweep. A probe that had gone offline
        and is now reporting again is flipped back immediately."""
        m = _SOIL_STATE_RE.match(topic)
        if not m:
            return
        mac, serial = m.group(1), m.group(2)
        key = f"{mac}/{serial}"
        self._soil_seen[key] = time.monotonic()
        if not self._soil_online.get(key, True):
            self._soil_online[key] = True
            async_dispatcher_send(self.hass, SIGNAL_DEVICE_AVAIL_FMT.format(mac))
        if self._soil_timer_cancel is None:
            from datetime import timedelta
            from homeassistant.helpers.event import async_track_time_interval
            self._soil_timer_cancel = async_track_time_interval(
                self.hass, self._check_soil_freshness, timedelta(seconds=30)
            )

    @callback
    def _check_soil_freshness(self, _now=None) -> None:
        """Flip probes silent longer than _soil_timeout to offline (and their
        entities to unavailable) by re-dispatching device availability."""
        mono = time.monotonic()
        stale_macs: set[str] = set()
        for key, seen in self._soil_seen.items():
            online = (mono - seen) <= self._soil_timeout
            if self._soil_online.get(key, True) != online:
                self._soil_online[key] = online
                stale_macs.add(key.split("/", 1)[0])
        for mac in stale_macs:
            async_dispatcher_send(self.hass, SIGNAL_DEVICE_AVAIL_FMT.format(mac))

    def probe_online(self, mac: str, serial: str) -> bool:
        """True while a soil probe is fresh. A probe not seen this boot reads
        online during the startup grace (its controller may not have sent a
        frame yet); once grace closes, a still-silent probe — e.g. one unplugged
        before HA started — reads offline. Grace-close dispatches SIGNAL_
        AVAILABILITY, which re-renders these entities."""
        seen = self._soil_seen.get(f"{mac}/{serial}")
        if seen is None:
            return not self._grace_over
        return (time.monotonic() - seen) <= self._soil_timeout

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
            # Stamp the probe BEFORE dispatching so the entity re-renders with a
            # fresh timestamp (avoids a one-frame lag flipping back from offline).
            self._note_soil_seen(topic)
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

    @staticmethod
    def _slot_ok(slot: str, dtype: str) -> bool:
        """Does this stored slot match the device type's prefix? A power strip
        must sit on an ac5/ac10 slot; a panel on dp. Used to detect a strip
        mis-slotted as a panel (dp*) by the 3.19.90 confirm-first bug, which
        assigned a slot before the device was typed."""
        from .entity_defs import _SLOT_PREFIX
        exp = _SLOT_PREFIX.get((dtype or "").lower())
        if not exp:
            return True  # unknown type — don't second-guess
        return slot == exp or slot.startswith(f"{exp}_") or slot.startswith(exp)

    def get_slot(self, mac_raw: str, dtype: str) -> str:
        """Persistent logical slot for a device (cb1, cb2, ps5, lc1 ...).
        Assigned on first sight, stored in the config entry, transferred by
        migration, and editable in the integration options."""
        mac = _mac(mac_raw)
        # Self-heal (3.19.91): a strip mis-slotted as a panel (e.g. dp3) by the
        # 3.19.90 confirm-first bug — purge the bad mapping so the logic below
        # reassigns a correct ac5/ac10 slot; entity ids re-align via _add_defs.
        if (dtype or "").lower() in ("ps5", "ps10"):
            bad = self._slot_cache.get(mac)
            if bad is None:
                _e = self.hass.config_entries.async_get_entry(self.entry_id)
                bad = (_e.options or {}).get("device_slots", {}).get(mac) if _e else None
            if bad is not None and not self._slot_ok(bad, dtype):
                _LOGGER.warning(
                    "Re-slotting strip %s: %r is not a valid %s slot", mac, bad, dtype
                )
                self._slot_cache.pop(mac, None)
                _e = self.hass.config_entries.async_get_entry(self.entry_id)
                if _e is not None:
                    _slots = dict((_e.options or {}).get("device_slots", {}))
                    if _slots.pop(mac, None) is not None:
                        self.hass.config_entries.async_update_entry(
                            _e, options={**(_e.options or {}), "device_slots": _slots}
                        )
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

    def _toggles_for(self, mac_raw: str) -> dict:
        """Per-device decisions for the two toggleable accessories (Light 2,
        Fan). Returns only *decided* blocks: {"light2": True/False, ...}. A
        block missing from the dict is undecided — build_device_entities()
        defers it (creates nothing) and blocks_seen() raises a first-run
        prompt. Stored per-MAC: options["components"][mac][block] = bool."""
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if not entry:
            return {}
        mac = _mac(mac_raw)
        comps = (entry.options or {}).get("components", {}).get(mac, {})
        return {b: bool(comps[b]) for b in TOGGLEABLE_BLOCKS if b in comps}

    @callback
    def prune_toggled(self, device_cfg: dict) -> int:
        """Remove already-registered entities for any toggleable accessory
        that is not currently decided-on for this device (hidden or undecided).
        Generic: diff the full toggleable set against what the current
        decisions keep, and remove the difference from the registry."""
        from .const import DOMAIN
        registry = er.async_get(self.hass)
        slot = self._slot_for_cfg(device_cfg)
        keep = {
            d.unique_id for d in build_device_entities(
                device_cfg, include_outlets=False, slot=slot,
                toggles=self._toggles_for(device_cfg.get("mac", "")),
            )
        }
        all_on = {b: True for b in TOGGLEABLE_BLOCKS}
        removed = 0
        for d in build_device_entities(
            device_cfg, include_outlets=False, slot=slot, toggles=all_on,
        ):
            if d.unique_id in keep:
                continue
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
                "Pruned %d toggled-off accessory entities from %s",
                removed, _mac(device_cfg.get("mac", "")),
            )
            DIAG.bus_event(
                f"prune_toggled {_mac(device_cfg.get('mac',''))} removed={removed}"
            )
        return removed

    @callback
    def _write_hotspot_map(self) -> None:
        """Publish a mac -> friendly-name map to /config for the Spider Farmer
        Hotspot add-on, so its connected-clients page shows real device names
        instead of the DHCP hostname ("GGS-CB") or "(unknown)". Debounced —
        only rewrites when the set of devices/names changes."""
        import json as _json
        data = {
            mac: {"name": name, "model": model}
            for mac, (name, model) in self.device_display.items()
        }
        blob = _json.dumps(data, sort_keys=True)
        if blob == self._hotspot_map_blob:
            return
        self._hotspot_map_blob = blob
        # Under /config/sf/ap so the hotspot's shared files sit alongside the
        # rest of the integration's /config/sf data (logs, etc.).
        path = self.hass.config.path("sf/ap/sf_hotspot_devices.json")

        def _write() -> None:
            try:
                import os
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "w") as f:
                    f.write(blob)
            except Exception:  # noqa: BLE001 — add-on integration is best-effort
                pass

        self.hass.async_add_executor_job(_write)

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
        self._write_hotspot_map()
        self._repair_if_retyped(device_cfg)
        # Re-evaluate power-strip nesting every discovery cycle (this runs
        # ~every 60s via ensure_discovery), so a strip that connected before
        # its host panel still nests once both are up — not only on the first
        # block report.
        self._update_strip_nesting(device_cfg)
        # Environment target device (see _ensure_env_device).
        self._ensure_env_device(device_cfg)
        # v3.0.12: no entities on faith — groups are created via
        # blocks_seen()/outlet_seen() from what the device actually reports.

    def _ensure_env_device(self, device_cfg: dict) -> None:
        """Create the Environment target device for a panel/strip.

        One per display panel (CB) and per power strip (AC5/AC10/S-Station).
        v3.19.90: strips carry the same "target" block as the panel (day/night
        temp/humidity/CO2 setpoints + deadband) — so they get the same
        Environment entities; state/writes flow through the type-agnostic
        normalizer/command paths.

        v3.19.251: strips only get the Environment device once an air sensor is
        actually attached (temp/humi evidence). Without a sensor the setpoints
        are meaningless and showed up as a phantom "… Environment" device under
        AC5/AC10. CB display panels keep the target device unconditionally (the
        panel is the environment controller even before a probe is plugged in)."""
        dtype = (device_cfg.get("type", "") or "").lower()
        if dtype not in ("cb", "ps5", "ps10", "st"):
            return
        mac = _mac(device_cfg.get("mac", ""))
        if (dtype in ("ps5", "ps10", "st")
                and mac not in self._air_seen and mac not in self._ext_air):
            # No sensor of any kind on this strip (SF or external) — don't create
            # Environment targets, and clean up any sensor-derived phantoms left
            # from before the gate (same policy as prune_blocks: only when
            # keep_offline is off). A strip on an external sensor (in _ext_air)
            # keeps its Environment targets for planting-plan use.
            if not self.keep_offline:
                self._prune_strip_extras(device_cfg)
            return
        # CO2 targets: a plain external temp/humi mirror (AC5/AC10 borrowing a
        # 3rd-party temp/humi sensor) has no CO2 sensor, so it must not get CO2
        # targets (v3.19.257). But a device whose OWN sensor block reports CO2 —
        # the S-Station 3-in-1 does — keeps CO2 even while it mirrors temp/humi
        # externally, otherwise its Environment tab loses CO2. Key off real CO2
        # evidence, not the mirror flag. (v3.19.308)
        include_co2 = (mac not in self._ext_air) or (mac in self._co2_seen)
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
                device_cfg, slot=self._slot_for_cfg(device_cfg),
                include_co2=include_co2))
        elif include_co2 and f"ggs_{mac}_env_co2_day" not in self._registered:
            # Temp/humi targets already exist but the CO2 ones are missing — the
            # device reports a CO2 sensor yet CO2 targets were excluded (an
            # external-mirror device with a native CO2 sensor, or an install
            # upgraded from before this gate). Add just the CO2 targets so the
            # Environment tab regains CO2 without re-adopting. General across
            # device types (st / ps5 / ps10 / cb). (v3.19.308)
            add = [
                d for d in build_env_entities(
                    device_cfg, slot=self._slot_for_cfg(device_cfg),
                    include_co2=True)
                if (d.field or "").startswith("env_co2")
                and d.unique_id not in self._registered
            ]
            for d in add:
                self._pruned.discard(d.unique_id)
            if add:
                self._add_defs(add)
        if not include_co2:
            self._prune_env_co2(mac)   # remove any leftover CO2 targets

    def _note_air_evidence(self, blocks: set, device_cfg: dict) -> None:
        """Record air-sensor evidence for a MAC, then (un)build its Environment
        target device. Called on each block report. _ensure_env_device creates
        the device when a strip has air evidence and prunes leftover sensor-
        derived phantoms when it does not (and keep_offline is off)."""
        if {"sensor:temp", "sensor:humi"} & blocks:
            self._air_seen.add(_mac(device_cfg.get("mac", "")))
        if "sensor:co2" in blocks:
            self._co2_seen.add(_mac(device_cfg.get("mac", "")))
        self._ensure_env_device(device_cfg)

    # Sensor-derived entity groups that don't belong on an outlet-only strip
    # (no air sensor): leaf-VPD family, grow-plan, and air calibration. The
    # Environment target entities are added on top from build_env_entities.
    _STRIP_PHANTOM_SUFFIXES = (
        "leaf_vpd", "leaf_offset", "leaf_offset_night", "leaf_vpd_min", "leaf_vpd_max",
        "plan", "plan_enabled",
        "cal_air_temp", "cal_air_humidity", "cal_ppfd", "cal_co2",
    )

    def _prune_uids(self, uids: set) -> int:
        """Remove a set of our entity unique_ids from the registry. Returns the
        number removed. No-op for uids that aren't registered."""
        registry = er.async_get(self.hass)
        from .const import DOMAIN
        removed = 0
        for entity in list(registry.entities.values()):
            if entity.platform != DOMAIN or entity.unique_id not in uids:
                continue
            registry.async_remove(entity.entity_id)
            self._registered.discard(entity.unique_id)
            self._pruned.add(entity.unique_id)
            removed += 1
        return removed

    def _prune_env_co2(self, mac: str) -> None:
        """Remove the CO2 Environment target entities for a device with no CO2
        sensor (e.g. an external-sensor strip). No-op if none are registered."""
        removed = self._prune_uids({
            f"ggs_{mac}_env_co2_day", f"ggs_{mac}_env_co2_night",
            f"ggs_{mac}_env_co2_deadband",
        })
        if removed:
            _LOGGER.info("Removed %d phantom CO2 targets from %s (no CO2 sensor)",
                         removed, mac)

    def _strip_without_air(self, mac_raw: str) -> bool:
        """True for a power strip (AC5/AC10/S-Station) that has not reported an
        air sensor this session — an outlet-only strip. Such a strip must not
        get sensor-derived entities (Environment, leaf VPD, grow-plan, air
        calibration): they are meaningless without a sensor and showed up as
        phantoms. (v3.19.252)"""
        dtype = (self._type_for_mac(mac_raw) or "").lower()
        return dtype in ("ps5", "ps10", "st") and _mac(mac_raw) not in self._air_seen

    def _prune_strip_extras(self, device_cfg: dict) -> None:
        """Remove sensor-derived phantom entities from a strip that has no air
        sensor — Environment targets, leaf-VPD family, grow-plan, and air
        calibration. No-op for entities that aren't registered. (v3.19.252)"""
        mac = _mac(device_cfg.get("mac", ""))
        targets = {f"ggs_{mac}_{sfx}" for sfx in self._STRIP_PHANTOM_SUFFIXES}
        targets |= {
            d.unique_id for d in build_env_entities(
                device_cfg, slot=self._slot_for_cfg(device_cfg))
        }
        registry = er.async_get(self.hass)
        from .const import DOMAIN
        removed = 0
        for entity in list(registry.entities.values()):
            if entity.platform != DOMAIN or entity.unique_id not in targets:
                continue
            registry.async_remove(entity.entity_id)
            self._registered.discard(entity.unique_id)
            self._pruned.add(entity.unique_id)
            removed += 1
        if removed:
            _LOGGER.info(
                "Pruned %d sensor-derived phantom entities from outlet-only "
                "strip %s (no air sensor)", removed, mac,
            )
            DIAG.bus_event(f"prune_strip_extras {mac} removed={removed}")

    # ── External sensor mirroring (v3.19.253) ─────────────────────────────
    @callback
    def apply_strip_sensors(self, strip_sensors: dict) -> None:
        """(Re)configure external-sensor mirroring from the config-entry option
        ``strip_sensors`` = {mac_lc: {source, temp, humi}}. For each strip set to
        source=external with a chosen temp/humi entity, create the strip's
        temperature/humidity/vpd sensor entities and mirror the external HA
        entity's live state onto their topics (temp converted to wire °C; VPD
        derived). SF-source strips (or cleared config) tear their mirror down."""
        from homeassistant.helpers.event import async_track_state_change_event
        wanted = {
            _mac(mac): cfg for mac, cfg in (strip_sensors or {}).items()
            if isinstance(cfg, dict) and cfg.get("source") == "external"
            and (cfg.get("temp") or cfg.get("humi"))
        }
        prev_ext = set(self._ext_air)
        self._ext_air = set(wanted)   # gates Environment targets on these strips
        # Per-mac externally-driven air fields — suppress exactly these on the
        # device's own report so the onboard probe can't fight the mirror. VPD is
        # externally derived only when BOTH temp and humi are mirrored (matches
        # _publish_ext, which emits vpd only then). (v3.19.306)
        self._ext_air_fields = {}
        for _m, _c in wanted.items():
            _fs: set[str] = set()
            if _c.get("temp"):
                _fs.add("temperature")
            if _c.get("humi"):
                _fs.add("humidity")
            if _c.get("temp") and _c.get("humi"):
                _fs.add("vpd")
            self._ext_air_fields[_m] = _fs
        # Drop listeners for strips no longer external.
        for mac in [m for m in self._ext_cancels if m not in wanted]:
            try:
                self._ext_cancels.pop(mac)()
            except Exception:  # noqa: BLE001 — best-effort teardown
                pass
        # Switched a strip back to SF (no external sensor): the mirrored
        # temperature/humidity/vpd are now stale HA-only entities. Remove them
        # when keep_offline is off (same policy as other prunes); a strip with a
        # real SF sensor re-creates them from evidence. (v3.19.264)
        # A strip that's no longer external runs its outlet env modes natively on
        # the device — hand every env-adopted outlet back so we stop virtualizing
        # / re-parking them (else native mode changes revert). Runs regardless of
        # keep_offline, before the entity prune below. (v3.19.313)
        for mac in prev_ext - set(wanted):
            self.release_all_env_outlets(mac)
        if not self.keep_offline:
            for mac in prev_ext - set(wanted):
                removed = self._prune_uids({
                    f"ggs_{mac}_temperature", f"ggs_{mac}_humidity",
                    f"ggs_{mac}_vpd",
                })
                # Also drop the Environment targets / plan so the card returns to
                # outlet-only immediately (a strip with a real SF sensor re-creates
                # everything from evidence on its next report).
                self._prune_strip_extras({"mac": mac, "type": self._type_for_mac(mac)})
                if removed:
                    _LOGGER.info(
                        "Removed %d external-mirror sensors from %s "
                        "(switched back to SF)", removed, mac)
        for mac, cfg in wanted.items():
            temp_id = cfg.get("temp") or None
            humi_id = cfg.get("humi") or None
            dcfg = {"mac": mac, "type": self._type_for_mac(mac) or "ps10"}
            slot = self._slot_for_cfg(dcfg)
            blocks = set()
            if temp_id:
                blocks.add("sensor:temp")
            if humi_id:
                blocks.add("sensor:humi")
            if temp_id and humi_id:
                blocks.add("sensor:vpd")
            # Keep the air sensors AND the Leaf-VPD family (leaf_vpd sensor +
            # day/night Leaf Offset + Leaf VPD min/max). The leaf-VPD sensor is
            # self-computed in HA from air temp + humidity + offset (no device
            # topic), so on an external strip with both temp and humidity mirrored
            # it works the moment its entities exist — previously the filter dropped
            # the whole family, so external strips never showed Leaf VPD. (v3.19.314)
            _keep = ("temperature", "humidity", "vpd",
                     "leaf_vpd", "leaf_offset", "leaf_offset_night",
                     "leaf_vpd_min", "leaf_vpd_max")
            defs = [
                d for d in build_device_entities(
                    dcfg, include_outlets=False, blocks=blocks, slot=slot)
                if (d.field or "") in _keep
                and d.unique_id not in self._registered
            ]
            # Clear any prior prune mark so _add_defs actually (re)creates them —
            # prune_blocks may have removed them before the external gate. (264)
            for d in defs:
                self._pruned.discard(d.unique_id)
            if defs:
                self._add_defs(defs)
            # Bring back the Environment target entities (temp/humidity/CO2
            # setpoints) so planting plans have targets on this strip.
            self._ensure_env_device(dcfg)
            # (Re)subscribe to the chosen external entities.
            watch = [x for x in (temp_id, humi_id) if x]
            if mac in self._ext_cancels:
                try:
                    self._ext_cancels.pop(mac)()
                except Exception:  # noqa: BLE001
                    pass

            @callback
            def _changed(_event, _mac=mac, _t=temp_id, _h=humi_id) -> None:
                self._publish_ext(_mac, _t, _h)

            self._ext_cancels[mac] = async_track_state_change_event(
                self.hass, watch, _changed)
            self._publish_ext(mac, temp_id, humi_id)   # initial paint

    def device_air_suppressed(self, mac_raw: str, topic: str) -> bool:
        """True when ``topic`` is the device's OWN air reading for a field that
        an external sensor is mirroring — so the onboard probe's report is
        dropped and only the mirror writes it (no flip-flop). Only
        temperature/humidity/vpd are ever suppressed; PPFD, CO2, day/night flags
        and everything else always pass through. General across device types
        (S-Station 3-in-1, display panels, strips). (v3.19.306)"""
        fields = self._ext_air_fields.get(_mac(mac_raw))
        if not fields:
            return False
        return any(topic.endswith(f"/{f}/state") for f in fields)

    @callback
    def _publish_ext(self, mac: str, temp_id, humi_id) -> None:
        """Mirror the external temp/humi entities onto the strip's topics and
        derive VPD (kPa). Temperature is converted to wire °C to match a real
        SF sensor (the temperature entity displays it in the user's unit)."""
        import math
        air_c = None
        rh = None
        if temp_id:
            st = self.hass.states.get(temp_id)
            try:
                val = float(st.state)
                unit = (st.attributes.get("unit_of_measurement") or "°C")
                # °F -> wire °C is (F - 32) / 1.8. The SF temperature sensor then
                # converts back to the user's unit for display. (v3.19.266)
                air_c = (val - 32.0) / 1.8 if ("F" in unit or "℉" in unit) else val
                self.publish(f"ggs/ha/{mac}/temperature/state", f"{air_c:.2f}")
            except (AttributeError, ValueError, TypeError):
                pass
        if humi_id:
            st = self.hass.states.get(humi_id)
            try:
                rh = float(st.state)
                self.publish(f"ggs/ha/{mac}/humidity/state", f"{rh:.1f}")
            except (AttributeError, ValueError, TypeError):
                pass
        if air_c is not None and rh is not None:
            svp = 0.6108 * math.exp(17.27 * air_c / (air_c + 237.3))
            vpd = max(0.0, svp * (1.0 - rh / 100.0))
            self.publish(f"ggs/ha/{mac}/vpd/state", f"{vpd:.2f}")

    # ── Smart control engine (v3.19.256) ──────────────────────────────────
    # Card-configured closed-loop control. v1: humidity -> dehumidifier, driven
    # in FULL MANUAL (fallback #3: on HA downtime the gear holds its last state;
    # SF does not resume). The decision logic is the pure decide() in
    # smart_control.py; this is the thin async loop that reads the sensor and
    # issues the resulting gear via the normal apply_bundle command path.
    def apply_smart_control(self, smart: dict) -> None:
        """(Re)configure smart control from the ``smart_control`` option =
        {mac_lc: {enabled, humidity, target, deadband, ...}}. Starts a periodic
        loop while any entry is enabled; stops it otherwise."""
        from datetime import timedelta
        from homeassistant.helpers.event import async_track_time_interval
        self._smart_cfg = {
            _mac(mac): cfg for mac, cfg in (smart or {}).items()
            if isinstance(cfg, dict) and cfg.get("enabled")
        }
        # Forget loop state + priming for macs no longer controlled.
        for mac in list(self._smart_state):
            if mac not in self._smart_cfg:
                self._smart_state.pop(mac, None)
                self._smart_primed.discard(mac)
        self._ensure_control_timer()

    def _ensure_control_timer(self) -> None:
        """Start/stop the 15s control tick based on whether ANY loop is active
        (smart-control dehumidifier and/or env-driven outlets)."""
        from datetime import timedelta
        from homeassistant.helpers.event import async_track_time_interval
        want_timer = bool(self._smart_cfg or self._outlet_env)
        if want_timer and self._smart_timer is None:
            self._smart_timer = async_track_time_interval(
                self.hass, self._smart_tick, timedelta(seconds=15))
        elif not want_timer and self._smart_timer is not None:
            self._smart_timer()
            self._smart_timer = None
        # Keep the event-driven input watch in sync with the active env outlets
        # so a threshold crossing / target edit reacts at once (not up to 15s).
        self._ensure_env_watch()

    def _ensure_env_watch(self) -> None:
        """(Re)subscribe to the input sensors + env target/deadband/day-window
        entities of every env-controlled outlet, so a change runs a control pass
        immediately. The 15s timer remains as a safety backstop."""
        from homeassistant.helpers.event import async_track_state_change_event
        ids: set[str] = set()
        for mac, outs in self._outlet_env.items():
            slot = self._slot_for_cfg({"mac": mac, "type": self._type_for_mac(mac)})
            ids.add(f"text.sf_{slot}_env_day_start")
            ids.add(f"text.sf_{slot}_env_day_end")
            for _n, cfg in outs.items():
                mode = cfg.get("mode") or "Temperature"
                if mode == "Humidity":
                    ids.update({
                        f"sensor.sf_{slot}_humidity",
                        f"number.sf_{slot}_env_humi_day",
                        f"number.sf_{slot}_env_humi_night",
                        f"number.sf_{slot}_env_humi_deadband"})
                elif mode == "Temperature":
                    ids.update({
                        f"sensor.sf_{slot}_temperature",
                        f"number.sf_{slot}_env_temp_day",
                        f"number.sf_{slot}_env_temp_night",
                        f"number.sf_{slot}_env_temp_deadband"})
                # Light Env needs only the day window (added above).
        frozen = frozenset(ids)
        if frozen == self._env_watch_ids:
            return
        if self._env_watch_cancel is not None:
            self._env_watch_cancel()
            self._env_watch_cancel = None
        self._env_watch_ids = frozen
        if frozen:
            self._env_watch_cancel = async_track_state_change_event(
                self.hass, list(frozen), self._env_input_changed)

    @callback
    def _env_input_changed(self, _event) -> None:
        """A watched env input changed — run a control pass shortly after. Debounced
        (~0.4s) so an Environment "Apply" that writes several targets coalesces to
        a single pass."""
        from homeassistant.helpers.event import async_call_later
        if self._env_debounce_cancel is not None:
            self._env_debounce_cancel()
            self._env_debounce_cancel = None

        @callback
        def _run(_now):
            self._env_debounce_cancel = None
            self.hass.async_create_task(self._smart_tick())

        self._env_debounce_cancel = async_call_later(self.hass, 0.4, _run)

    async def _smart_tick(self, _now=None) -> None:
        """One control pass over every enabled smart-control device."""
        import time as _time
        from .smart_control import DehumConfig, DehumState, decide, OFF, LOW, HIGH
        allow = bool(getattr(self.proxy, "allow_control", False)) if self.proxy else False
        now = _time.monotonic()
        for mac, cfg in list(self._smart_cfg.items()):
            slot = self._slot_for_cfg({"mac": mac, "type": self._type_for_mac(mac)})
            humidity_id = cfg.get("humidity") or f"sensor.sf_{slot}_humidity"
            st_obj = self.hass.states.get(humidity_id)
            try:
                rh = float(st_obj.state)
            except (AttributeError, ValueError, TypeError):
                rh = None
            dcfg = DehumConfig(
                target=float(cfg.get("target", 55)),
                deadband=float(cfg.get("deadband", 5)),
                escalate_after_s=float(cfg.get("escalate_after_s", 300)),
                escalate_drop=float(cfg.get("escalate_drop", 1)),
                ease_band=float(cfg.get("ease_band", 3)),
                min_on_s=float(cfg.get("min_on_s", 120)),
                min_off_s=float(cfg.get("min_off_s", 120)),
            )
            prev = self._smart_state.get(mac, DehumState(cmd=OFF, since=now))
            nxt = decide(prev, rh, dcfg, now)
            self._smart_state[mac] = nxt
            first = mac not in self._smart_primed
            if not allow:
                continue   # device control disabled — engine can't actuate
            if first or nxt.cmd != prev.cmd:
                self._smart_primed.add(mac)
                await self._smart_actuate(mac, nxt.cmd)
        await self._env_outlet_tick(allow, now)

    async def _smart_actuate(self, mac: str, cmd: str) -> None:
        """Issue the dehumidifier gear via apply_bundle (full Manual)."""
        import json as _json
        from .smart_control import LOW, HIGH
        if cmd == LOW:
            payload = {"mode": "Manual", "onoff": 1, "auto_gear": "Low"}
        elif cmd == HIGH:
            payload = {"mode": "Manual", "onoff": 1, "auto_gear": "High"}
        else:  # OFF
            payload = {"mode": "Manual", "onoff": 0}
        DIAG.bus_event(f"smart_control {mac} dehumidifier -> {cmd}")
        await self.async_command(
            f"ggs/ha/{mac}/dehumidifier/apply_bundle/set", _json.dumps(payload))

    # ── Integration-driven env outlet control (v3.19.268) ─────────────────────
    # A sensorless strip's outlet set to Temperature can't run on the device, so
    # the card registers it here (sf.set_outlet_env) and we drive it from the
    # mirrored temperature + the strip's env target. The device is held in Manual
    # (so mOnOff actually switches the socket); the chosen mode is virtual — see
    # env_outlet_mode_override(), which keeps the card showing Temperature/Cooling.
    def apply_outlet_env(self, outlet_env: dict) -> None:
        """(Re)configure env outlet control from the ``outlet_env`` option =
        {mac_lc: {"<n>": {enabled, mode, dir, ...}}}. Explicit enabled entries are
        merged over any AUTO-adopted outlets (device-frame driven) so an unrelated
        option save never drops them. Release is immediate/in-memory (see
        release_outlet_env) — there is no persistent block, so re-selecting an env
        mode simply re-adopts from the next device frame."""
        opt: dict[str, dict[int, dict]] = {}
        for mac_raw, outs in (outlet_env or {}).items():
            if not isinstance(outs, dict):
                continue
            mac = _mac(mac_raw)
            for n_raw, cfg in outs.items():
                if not isinstance(cfg, dict) or not cfg.get("enabled"):
                    continue
                try:
                    n = int(n_raw)
                except (ValueError, TypeError):
                    continue
                opt.setdefault(mac, {})[n] = cfg
        new: dict[str, dict[int, dict]] = {}
        for mac, outs in self._outlet_env.items():   # keep auto-adopted entries
            for n, cfg in outs.items():
                if cfg.get("_auto"):
                    new.setdefault(mac, {})[n] = cfg
        for mac, outs in opt.items():                # explicit config wins
            for n, cfg in outs.items():
                new.setdefault(mac, {})[n] = cfg
        # Temperature/Humidity env control is only for external-source strips.
        # Drop any such entry on a strip that isn't external — e.g. a strip
        # switched back to its own SF sensor (3-in-1) before v3.19.313, whose
        # stale outlet_env entries would otherwise keep re-parking its outlets in
        # Manual and revert every native mode change. Light Env (sensorless
        # day/night switching) is valid on any strip and is kept. apply_strip_sensors
        # runs first, so self._ext_air is authoritative here. Dropped in-memory
        # each load (the tick also guards); the persisted copy is purged on the
        # live external->SF transition in apply_strip_sensors, not here — this runs
        # during setup and must not write the config entry (would trigger a reload
        # mid-setup). (v3.19.313)
        for mac in [m for m in new if m not in self._ext_air]:
            for n in list(new[mac]):
                if (new[mac][n].get("mode") or "Temperature") == "Light Env":
                    continue
                self.publish(f"ggs/ha/{mac}/outlet_{n}_mode/state", "Manual", retain=True)
                new[mac].pop(n, None)
            if not new[mac]:
                new.pop(mac, None)
        for key in list(self._outlet_env_state):
            mac, n = key
            if n not in new.get(mac, {}):
                self._outlet_env_state.pop(key, None)
                self._outlet_env_primed.discard(key)
                self._outlet_env_setpoint.pop(key, None)
        self._outlet_env = new
        self._ensure_control_timer()
        for mac, outs in self._outlet_env.items():
            for n in outs:
                self._publish_env_outlet_mode(mac, n)

    def release_outlet_env(self, mac_raw: str, n: int) -> None:
        """Hand an outlet back (user picked a non-env mode). Drops it from the
        control set immediately; the device already has the new mode, so nothing
        re-adopts it until an env-mode frame is seen again."""
        mac = _mac(mac_raw)
        if mac in self._outlet_env and n in self._outlet_env[mac]:
            del self._outlet_env[mac][n]
            if not self._outlet_env[mac]:
                del self._outlet_env[mac]
        self._outlet_env_state.pop((mac, n), None)
        self._outlet_env_primed.discard((mac, n))
        self._outlet_env_setpoint.pop((mac, n), None)
        self._ensure_control_timer()

    def release_all_env_outlets(self, mac_raw: str) -> None:
        """Release EVERY env-controlled outlet on a strip and forget the persisted
        copies. Called when a strip is no longer external-source (v3.19.313): on a
        strip with its own SF sensor (e.g. the 3-in-1) the outlets run their env
        modes natively on the device, so the integration must stop virtualizing /
        driving them — otherwise it keeps re-parking them in Manual and every
        native mode change reverts. Republishes the real (Manual) mode so the card
        drops the stale virtual Temperature/Humidity display at once."""
        mac = _mac(mac_raw)
        outs = self._outlet_env.get(mac)
        if not outs:
            return
        for n, cfg in list(outs.items()):
            # Light Env is sensorless (day/night) and valid on any strip — keep it.
            if (cfg.get("mode") or "Temperature") == "Light Env":
                continue
            # Un-virtualize the display before the override stops covering it: the
            # device is parked in Manual (modeType 0), so that's the real mode now.
            base = f"ggs/ha/{mac}/outlet_{n}"
            self.publish(f"{base}_mode/state", "Manual", retain=True)
            self.release_outlet_env(mac, n)
            self._persist_outlet_env_del(mac, n)
        DIAG.bus_event(f"outlet_env release_all {mac} (no longer external)")

    def maybe_adopt_env_outlet(self, mac_raw: str, n: int, modetype,
                               temp_add, humi_add) -> None:
        """Auto-adopt (and keep in sync) an outlet the device reports in an
        Environment mode on a SENSORLESS (external-source) strip, so it's driven
        without the user re-applying it in the card — and even if it was set from
        the SF app. modeType 3=Temperature, 4=Humidity; direction from tempAdd
        (1=Heating/2=Cooling) / humiAdd (1=Humidifying/2=Dehumidifying).

        This runs on every env-mode config frame, so a direction/mode CHANGE
        (e.g. Humidifying -> Dehumidifying) refreshes the auto-adopted entry — the
        device config is the source of truth. Non-env frames (modeType 0, i.e. the
        Manual we force to drive the socket) are ignored so we never wipe it. An
        explicit card-configured entry (not `_auto`) is never overridden here."""
        mac = _mac(mac_raw)
        if mac not in self._ext_air:
            return
        try:
            mt = int(modetype)
        except (ValueError, TypeError):
            return
        if mt == 3:
            cfg = {"enabled": True, "mode": "Temperature", "_auto": True,
                   "dir": "Heating" if temp_add == 1 else "Cooling"}
        elif mt == 4:
            cfg = {"enabled": True, "mode": "Humidity", "_auto": True,
                   "dir": "Humidifying" if humi_add == 1 else "Dehumidifying"}
        elif mt in (1, 2, 5, 7, 8, 14):
            # A REAL non-env mode (Time Slot/Cycle/CO2/Blower/Drip), almost always
            # set from the SF app — the user took this outlet out of env control.
            # Release + forget it (incl. the persisted copy). modeType 0 is our own
            # Manual parking, so it never lands here and never releases. (v3.19.301)
            if mac in self._outlet_env and n in self._outlet_env[mac]:
                self.release_outlet_env(mac, n)
            self._persist_outlet_env_del(mac, n)
            return
        else:
            return   # modeType 0 (our Manual parking) — leave any entry alone
        existing = self._outlet_env.get(mac, {}).get(n)
        if existing is not None:
            if not existing.get("_auto"):
                return   # explicit card config wins — don't override
            if existing.get("mode") == cfg["mode"] and existing.get("dir") == cfg["dir"]:
                return   # unchanged
            # Direction/mode changed — reset loop state so it re-decides now.
            self._outlet_env_state.pop((mac, n), None)
            self._outlet_env_primed.discard((mac, n))
        self._outlet_env.setdefault(mac, {})[n] = cfg
        DIAG.bus_event(f"outlet_env adopt {mac} O{n} {cfg['mode']}/{cfg['dir']}")
        # Persist it so it survives an HA restart: the device is parked in Manual
        # (modeType 0) to drive the socket, so there's no device evidence to
        # re-adopt from on reboot — without this the env mode is lost and the tile
        # falls back to Manual. (v3.19.301)
        self._persist_outlet_env_set(mac, n, cfg)
        self._ensure_control_timer()
        self._publish_env_outlet_mode(mac, n)

    def _persist_outlet_env_set(self, mac: str, n: int, cfg: dict) -> None:
        """Write an env-outlet entry into the config option (survives restart).
        Keeps the ``_auto`` flag so app-side direction changes still refresh it.
        No-ops when unchanged so it doesn't churn storage or loop the update
        listener."""
        if self.entry_id is None:
            return
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is None:
            return
        opts = dict(entry.options or {})
        oe = {**(opts.get(CONF_OUTLET_ENV) or {})}
        per_mac = {**(oe.get(mac) or {})}
        new_cfg = dict(cfg)
        if per_mac.get(str(n)) == new_cfg:
            return
        per_mac[str(n)] = new_cfg
        oe[mac] = per_mac
        opts[CONF_OUTLET_ENV] = oe
        self.hass.config_entries.async_update_entry(entry, options=opts)

    def _persist_outlet_env_del(self, mac: str, n: int) -> None:
        """Remove an env-outlet entry from the config option (e.g. the user set a
        real non-env mode in the SF app)."""
        if self.entry_id is None:
            return
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is None:
            return
        opts = dict(entry.options or {})
        oe = {**(opts.get(CONF_OUTLET_ENV) or {})}
        per_mac = {**(oe.get(mac) or {})}
        if str(n) not in per_mac:
            return
        per_mac.pop(str(n), None)
        if per_mac:
            oe[mac] = per_mac
        else:
            oe.pop(mac, None)
        opts[CONF_OUTLET_ENV] = oe
        self.hass.config_entries.async_update_entry(entry, options=opts)

    def plan_active(self, mac_raw: str) -> bool:
        """True when this device's grow-plan is enabled/running."""
        st = self._plan_state.get(_mac(mac_raw))
        if not st:
            return False
        if st.get("active"):
            return True
        prog = st.get("progress") or {}
        return bool(prog.get("isPlanRun"))

    def light_mode_label_override(self, mac_raw: str, topic: str, val: str) -> str:
        """While a plan is running a light's mode is 'Planting Plan' — the SF app
        only offers Manual / Planting Plan then. The device still stores the raw
        modeType (1 = Time Slot, 12 = PPFD); either non-Manual mode is shown as
        'Planting Plan' while the plan is active, so the mode entity, dropdown and
        tile all agree. (v3.19.273 / v3.19.276)"""
        if val not in ("Time Slot", "PPFD"):
            return val
        import re as _re
        if not _re.search(r"/light_\d+_mode/state$", topic):
            return val
        return "PPFD - Plan" if self.plan_active(mac_raw) else val

    def _publish_env_outlet_mode(self, mac: str, n: int) -> None:
        """Publish the VIRTUAL outlet mode/direction for an env-controlled outlet
        so the card shows Temperature/Cooling even though the device is Manual."""
        cfg = self._outlet_env.get(mac, {}).get(n)
        if not cfg:
            return
        base = f"ggs/ha/{mac}/outlet_{n}"
        mode = cfg.get("mode") or "Temperature"
        self.publish(f"{base}_mode/state", mode, retain=True)
        d = str(cfg.get("dir") or "").lower()
        if mode == "Light Env":
            # Day/Night has no device select entity — the card owns its display.
            return
        if mode == "Humidity":
            self.publish(f"{base}_humidity_device/state",
                         "Dehumidifying" if d.startswith("dehum") else "Humidifying",
                         retain=True)
        else:
            self.publish(f"{base}_temp_device/state",
                         "Heating" if d.startswith("heat") else "Cooling", retain=True)

    def env_outlet_mode_override(self, mac: str, topic: str, val: str) -> str:
        """Hook for the config-decode publish path: replace the device-reported
        Manual mode (and its temp_device) with the VIRTUAL env mode for any outlet
        we're driving. Leaves every other topic untouched."""
        if not self._outlet_env:
            return val
        m = _mac(mac)
        outs = self._outlet_env.get(m)
        if not outs:
            return val
        import re as _re
        mt = _re.match(
            rf"ggs/ha/{m}/outlet_(\d+)_(mode|temp_device|humidity_device)/state$", topic)
        if not mt:
            return val
        n = int(mt.group(1))
        cfg = outs.get(n)
        if not cfg:
            return val
        field = mt.group(2)
        d = str(cfg.get("dir") or "").lower()
        if field == "mode":
            return cfg.get("mode") or val
        if cfg.get("mode") == "Light Env":
            return val   # Light Env has no temp/humidity direction entity
        if field == "humidity_device":
            return "Dehumidifying" if d.startswith("dehum") else "Humidifying"
        return "Heating" if d.startswith("heat") else "Cooling"

    def env_outlet_modetype_override(self, mac: str, n: int, modetype):
        """The visibility driver keys sub-entity display off the device modeType;
        for an env-controlled outlet the device is Manual (0) but the card must
        keep the Temperature sub-controls, so report the virtual modeType (3)."""
        cfg = self._outlet_env.get(_mac(mac), {}).get(n)
        if not cfg:
            return modetype
        return {"Temperature": 3, "Humidity": 4, "CO2": 5}.get(cfg.get("mode"), modetype)

    def _env_is_day(self, slot: str, now_dt) -> bool:
        """Day/night from the strip's env window text entities (HH:MM); defaults
        to day if unset/unparseable."""
        def _mins(eid, dflt):
            st = self.hass.states.get(eid)
            try:
                h, m = str(st.state).split(":")
                return int(h) * 60 + int(m)
            except (AttributeError, ValueError, TypeError):
                return dflt
        start = _mins(f"text.sf_{slot}_env_day_start", 5 * 60)
        end = _mins(f"text.sf_{slot}_env_day_end", 20 * 60)
        cur = now_dt.hour * 60 + now_dt.minute
        return start <= cur < end if start <= end else (cur >= start or cur < end)

    async def _env_outlet_tick(self, allow: bool, now: float) -> None:
        """One control pass over every env-controlled outlet (Temperature or
        Humidity). Humidity reuses the same hysteresis: humidify behaves like
        "heat" (on when low), dehumidify like "cool" (on when high)."""
        if not self._outlet_env:
            return
        from homeassistant.util import dt as dt_util
        from .smart_control import (
            TempConfig, TempState, decide_temp, decide_light, OFF, ON)
        now_dt = dt_util.now()
        for mac, outs in list(self._outlet_env.items()):
            mac_is_ext = mac in self._ext_air
            slot = self._slot_for_cfg({"mac": mac, "type": self._type_for_mac(mac)})
            day = self._env_is_day(slot, now_dt)
            for n, cfg in list(outs.items()):
                mode = (cfg.get("mode") or "Temperature")
                # Temperature/Humidity env control is external-only: on a strip
                # with its own SF sensor those outlets run natively on the device,
                # so never drive them from here. Light Env (sensorless day/night
                # switching) is valid on any strip and always runs. (v3.19.313)
                if not mac_is_ext and mode != "Light Env":
                    continue
                self._publish_env_outlet_mode(mac, n)   # keep the display fresh
                d = str(cfg.get("dir", "")).lower()
                if mode == "Light Env":
                    # Purely day/night — no sensor/target. decide_light gives the
                    # target on/off; a tiny state entry still drives change-only
                    # commands so we don't re-issue every tick.
                    cmd = decide_light(day, d)
                    key = (mac, n)
                    first = key not in self._outlet_env_primed
                    prev = self._outlet_env_state.get(key, TempState(cmd=OFF, since=now))
                    self._outlet_env_state[key] = (
                        prev if prev.cmd == cmd else TempState(cmd=cmd, since=now))
                    if not allow:
                        continue
                    if first or cmd != prev.cmd:
                        self._outlet_env_primed.add(key)
                        DIAG.bus_event(
                            f"outlet_env {mac} O{n} Light/{d or 'day'} day={day} -> {cmd}")
                        await self.async_command(
                            f"ggs/ha/{mac}/outlet_{n}/set",
                            "ON" if cmd == ON else "OFF")
                    continue
                if mode == "Humidity":
                    reading = self._num_state(f"sensor.sf_{slot}_humidity")
                    target = self._num_state(
                        f"number.sf_{slot}_env_humi_{'day' if day else 'night'}")
                    deadband = self._num_state(f"number.sf_{slot}_env_humi_deadband")
                    # dehumidify -> on when high ("cool"); humidify -> on when low ("heat")
                    direction = "cool" if d.startswith("dehum") else "heat"
                    dz_default = 2.0
                else:  # Temperature
                    reading = self._num_state(f"sensor.sf_{slot}_temperature")
                    target = self._num_state(
                        f"number.sf_{slot}_env_temp_{'day' if day else 'night'}")
                    deadband = self._num_state(f"number.sf_{slot}_env_temp_deadband")
                    direction = "heat" if d.startswith("heat") else "cool"
                    dz_default = 1.1111
                if target is None:
                    continue
                tcfg = TempConfig(
                    target=target,
                    deadband=float(cfg.get("deadband",
                                          deadband if deadband is not None else dz_default)),
                    direction=direction,
                    min_on_s=float(cfg.get("min_on_s", 120)),
                    min_off_s=float(cfg.get("min_off_s", 120)),
                )
                key = (mac, n)
                first = key not in self._outlet_env_primed
                # First sighting: pre-date the dwell so the initial decision can
                # act immediately (no 2-min wait on startup / after adoption).
                prev = self._outlet_env_state.get(
                    key, TempState(cmd=OFF, since=now - max(tcfg.min_on_s, tcfg.min_off_s)))
                # Setpoint change (target/deadband edit, or day<->night flip):
                # pre-date the dwell so the outlet reacts to the NEW threshold
                # immediately instead of waiting out the anti-cycle dwell from the
                # last toggle. The deadband still provides hysteresis. (v3.19.300)
                sp = (round(target, 4), round(tcfg.deadband, 4), direction)
                if not first and self._outlet_env_setpoint.get(key) != sp:
                    prev = TempState(
                        cmd=prev.cmd, since=now - max(tcfg.min_on_s, tcfg.min_off_s))
                self._outlet_env_setpoint[key] = sp
                nxt = decide_temp(prev, reading, tcfg, now)
                self._outlet_env_state[key] = nxt
                if not allow:
                    continue
                if first or nxt.cmd != prev.cmd:
                    self._outlet_env_primed.add(key)
                    DIAG.bus_event(
                        f"outlet_env {mac} O{n} {mode}/{direction} val={reading} "
                        f"target={target} -> {nxt.cmd}")
                    await self.async_command(
                        f"ggs/ha/{mac}/outlet_{n}/set",
                        "ON" if nxt.cmd == ON else "OFF")

    def _num_state(self, eid: str):
        """Read a numeric HA state, or None if missing/non-numeric."""
        st = self.hass.states.get(eid)
        try:
            return float(st.state)
        except (AttributeError, ValueError, TypeError):
            return None

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
                device_cfg, slot=self._slot_for_cfg(device_cfg),
                toggles=self._toggles_for(device_cfg.get("mac", "")),
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
                d for d in build_device_entities(
                    cfg, slot=slot,
                    toggles=self._toggles_for(mac),
                )
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

            # Editable calibration/substrate entities (number/select). Rebuild
            # so they persist for offline devices, restored to their last
            # value; the live config poll refreshes them when the device
            # reconnects.
            import re as _re2
            covered = {d.unique_id for d in defs}
            cal_defs = []
            if any(u.startswith(f"ggs_{mac}_cal_") for u in existing):
                cal_defs += build_air_calibration_entities(cfg, slot=slot)
            soil_cal: dict = {}
            cal_uid_re = _re2.compile(
                rf"^ggs_{mac}_soil_(.+?)_(cal_temp|cal_moisture|cal_ec|substrate)$"
            )
            for uid in existing:
                m = cal_uid_re.match(uid)
                if m:
                    soil_cal.setdefault(m.group(1), set()).add(m.group(2))
            for serial, kinds in soil_cal.items():
                cal_defs += build_soil_calibration_entities(
                    mac, serial, cfg, slot=slot,
                    soil_slot=self.get_soil_slot(serial, mac),
                    include_substrate="substrate" in kinds,
                )
            defs += [
                d for d in cal_defs
                if d.unique_id in existing and d.unique_id not in covered
            ]

            # Grow-plan sensor + start/stop switch aren't part of
            # build_device_entities (they're created lazily from getConfigFile),
            # so recreate them here when the registry has them. Otherwise the
            # Planting Plan view vanishes after a restart until the next config
            # poll (or an app open) re-sends getConfigFile — the plan sensor
            # restores its last-known stages from the attribute cache. (v3.19.152)
            have = {d.unique_id for d in defs}
            if f"ggs_{mac}_plan" in existing and f"ggs_{mac}_plan" not in have:
                defs.append(build_plan_entity(cfg, slot=slot))
            if (f"ggs_{mac}_plan_enabled" in existing
                    and f"ggs_{mac}_plan_enabled" not in have):
                defs.append(build_plan_switch_entity(cfg, slot=slot))

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
        if (f"ggs_{mac}_cal_air_temp" not in self._registered
                and mac in self.device_display
                and not self._strip_without_air(mac_raw)):
            cfg = {"mac": mac_raw, "type": self._type_for_mac(mac_raw)}
            self._add_defs(build_air_calibration_entities(
                cfg, slot=self._slot_for_cfg(cfg)))
        t = cal.get("temp")
        if t is not None:
            self.publish(f"ggs/ha/{mac}/cal_air_temp/state", cdelta_to_disp(t, 1))
        for wire, field in (("humi", "cal_air_humidity"), ("co2", "cal_co2"),
                            ("ppfd", "cal_ppfd")):
            if cal.get(wire) is not None:
                self.publish(f"ggs/ha/{mac}/{field}/state", cal[wire])

    def apply_alarms(self, mac_raw: str, events: list) -> None:
        """Merge decoded alarm-log entries for a controller: create the Alarms
        sensor once, publish the merged list (newest first), and fire an
        ``sf_alarm`` HA event for each genuinely new entry (not on the first
        backfill, so a restart doesn't replay old alarms into automations)."""
        if not isinstance(events, list) or not events:
            return
        import json as _json
        mac = _mac(mac_raw)
        store = self._alarm_events.setdefault(mac, {})
        seeded = mac in self._alarm_seeded
        fresh = []
        for e in events:
            if not isinstance(e, dict) or e.get("id") is None:
                continue
            eid = e["id"]
            if eid not in store and seeded:
                fresh.append(e)
            store[eid] = e
        self._alarm_seeded.add(mac)
        if f"ggs_{mac}_alarms" not in self._registered and mac in self.device_display:
            cfg = {"mac": mac_raw, "type": self._type_for_mac(mac_raw)}
            self._add_defs([build_alarms_entity(cfg, slot=self._slot_for_cfg(cfg))])
        merged = sorted(
            store.values(),
            key=lambda x: (x.get("epoch") or 0, x.get("id") or 0), reverse=True,
        )[:50]
        self.publish(f"ggs/ha/{mac}/alarms/state", _json.dumps(merged))
        for e in fresh:
            try:
                self.hass.bus.async_fire("sf_alarm", {"mac": mac, **e})
            except Exception:  # noqa: BLE001 — never let event firing break parsing
                pass

    def apply_oplog(self, mac_raw: str, events: list) -> None:
        """Merge decoded operation-log entries (v3.19.42): create the
        Operations sensor once, publish the merged list (newest first), and
        fire an ``sf_oplog`` HA event for each genuinely new entry (skipped on
        the first backfill so restarts don't replay history)."""
        if not isinstance(events, list) or not events:
            return
        import json as _json
        mac = _mac(mac_raw)
        store = self._oplog_events.setdefault(mac, {})
        seeded = mac in self._oplog_seeded
        fresh = []
        for e in events:
            if not isinstance(e, dict) or e.get("id") is None:
                continue
            eid = e["id"]
            if eid not in store and seeded:
                fresh.append(e)
            store[eid] = e
        self._oplog_seeded.add(mac)
        if f"ggs_{mac}_oplog" not in self._registered and mac in self.device_display:
            cfg = {"mac": mac_raw, "type": self._type_for_mac(mac_raw)}
            self._add_defs([build_oplog_entity(cfg, slot=self._slot_for_cfg(cfg))])
        merged = sorted(
            store.values(),
            key=lambda x: (x.get("epoch") or 0, x.get("id") or 0), reverse=True,
        )[:50]
        self.publish(f"ggs/ha/{mac}/oplog/state", _json.dumps(merged))
        # Drive the auto-mode heater/humidifier on/off from the op log. The
        # controller reports these turning ON in getDevSta but NEVER reports the
        # OFF there — only the op log records the stop (opType 1 = turned on,
        # 2 = turned off; null = a mode/level change, not a transition). Take the
        # newest real op entry per accessory devType. devTypes confirmed from the
        # op log: 25 = Heater (Temperature), 27 = Humidification.
        #
        # The dehumidifier (26) is deliberately NOT op-log driven (v3.19.238): its
        # op log can miss the turn-off entirely (switching it off via a mode change
        # logs no opType 2), leaving a stale opType-1 "on" that the bus would keep
        # republishing over the real state — so the tile stuck "on" after the unit
        # was switched off. The dehumidifier's on/off is owned by the config
        # `mOnOff` (the switch state) in the normalizer, which is always current.
        # The blower/fan run at a continuous level (getDevSta tracks them), so
        # they're not op-log driven either. (v3.19.146, v3.19.238)
        _OPLOG_ACTIVE = {25: "heater", 27: "humidifier"}
        _op_seen: set = set()
        for e in merged:   # newest first
            field = _OPLOG_ACTIVE.get(e.get("devType"))
            if not field or field in _op_seen:
                continue
            # Only opType 0/1 are on/off events. Other op-log entries for the same
            # accessory (mode/level/gear changes) carry opType=null — they must NOT
            # be read as a turn-off, or a mode change right after a turn-on would
            # wrongly flip the accessory to OFF (v3.19.x: dehumidifier stuck "off").
            op = e.get("opType")
            if op is None:
                continue
            _op_seen.add(field)
            # OFF-ONLY supplement (v3.19.243). The LIVE getDevSta `level` is
            # authoritative for whether a heater/humidifier is running RIGHT NOW
            # (level>0 = on, 0 = off) and it DOES report the idle 0. So the op log
            # must NEVER turn one ON: a stale opType-1 "on" (the last actuation,
            # e.g. while enabled-but-idle in Temperature/auto mode) would fight the
            # live "off" on every getDevSta frame and flicker the tile on/off every
            # ~6 s (confirmed live). The op log may still supply an OFF the live
            # frame missed. `on` comes from the live level; `off` can come from the
            # live level, config `mOnOff:0`, or an op-log opType 2 here.
            if int(op) == 1:
                continue
            self.publish(f"ggs/ha/{mac}/{field}_active/state", "OFF")
        for e in fresh:
            try:
                self.hass.bus.async_fire("sf_oplog", {"mac": mac, **e})
            except Exception:  # noqa: BLE001
                pass

    def apply_alarm_settings(self, mac_raw: str, alarm: dict) -> None:
        """Decode the controller alarm-threshold block and publish it for the
        card's Alerts tab. Creates the sensor once. State = enabled count."""
        if not isinstance(alarm, dict):
            return
        from .proxy.normalizer import decode_alarm_settings
        decoded = decode_alarm_settings(alarm)
        if decoded is None:
            return
        import json as _json
        mac = _mac(mac_raw)
        if f"ggs_{mac}_alarm_settings" not in self._registered and mac in self.device_display:
            cfg = {"mac": mac_raw, "type": self._type_for_mac(mac_raw)}
            self._add_defs([build_alarm_settings_entity(cfg, slot=self._slot_for_cfg(cfg))])
        self.publish(f"ggs/ha/{mac}/alarm_settings/state", _json.dumps(decoded))

    def apply_plan(self, mac_raw: str, active: bool, stages: list,
                   present: bool = False) -> None:
        """Grow-plan config from getConfigFile: the enabled flag + stage list
        (each stage's day/night targets). Merged with the live getDevSta progress
        and republished. (v3.19.149)"""
        mac = _mac(mac_raw)
        st = self._plan_state.setdefault(mac, {})
        st["active"] = bool(active)
        new_stages = stages if isinstance(stages, list) else []
        # Keep the last non-empty stage list if a frame drops it while the plan is
        # still active — a transient getConfigFile carrying an empty plan.stage
        # would otherwise blank the stages, so the sensor can't match the running
        # stage and bounces between the stage label ("Flowering") and a bare
        # "active" (~20s apart in the history). The plan_enabled switch already
        # conveys active/off; clear the stages only when the plan is actually
        # inactive. (v3.19.174)
        if new_stages or not active:
            st["stages"] = new_stages
        if present:
            st["present"] = True
        self._publish_plan(mac_raw)

    def apply_plan_progress(self, mac_raw: str, progress: dict) -> None:
        """Live grow-plan progress from getDevSta (running, current stageId,
        planted/remaining/total days, progress %). Merged with the config stage
        list and republished. (v3.19.150)"""
        mac = _mac(mac_raw)
        st = self._plan_state.setdefault(mac, {})
        st["progress"] = progress if isinstance(progress, dict) else {}
        self._publish_plan(mac_raw)

    def _publish_plan(self, mac_raw: str) -> None:
        """Publish the merged grow-plan view for the card. State = active/first
        stage label (or 'inactive'); attributes carry active, stages, progress.
        The sensor is created the first time a plan-capable device reports a plan
        block, an active plan, or live progress — so the card's Environment /
        Planting-Plan toggle shows on those devices even when the plan is off.
        Devices that never report a plan never get the entity."""
        import json as _json
        mac = _mac(mac_raw)
        st = self._plan_state.get(mac, {})
        progress = st.get("progress") or {}
        # The config enabled flag (from getConfigFile) is authoritative for
        # active — it reflects a Start/Stop as soon as the config is re-read. The
        # live getDevSta "running" flag is only a fallback before the first config
        # frame; otherwise a stale isPlanRun would keep the card showing "active"
        # (with a Stop button) after the plan was actually stopped. (v3.19.151)
        if "active" in st:
            active = bool(st.get("active"))
        else:
            active = bool(progress.get("running"))
        present = bool(st.get("present")) or bool(progress) or bool(st.get("stages"))
        registered = f"ggs_{mac}_plan" in self._registered
        if not registered and not (active or present):
            return  # no plan capability seen — don't create the entity
        if (not registered and self._strip_without_air(mac_raw)
                and mac not in self._ext_air):
            return  # truly sensorless outlet-only strip — a grow plan doesn't
                    # apply. A strip on an external sensor (in _ext_air) DOES get
                    # the plan, so its targets can drive smart control. (v3.19.260)
        if not registered and mac in self.device_display:
            cfg = {"mac": mac_raw, "type": self._type_for_mac(mac_raw)}
            slot = self._slot_for_cfg(cfg)
            self._add_defs([
                build_plan_entity(cfg, slot=slot),
                build_plan_switch_entity(cfg, slot=slot),
            ])
        payload = {
            "active": active,
            "stages": st.get("stages") or [],
            "progress": progress,
        }
        self.publish(f"ggs/ha/{mac}/plan/state", _json.dumps(payload))
        self.publish(f"ggs/ha/{mac}/plan_enabled/state", "ON" if active else "OFF")
        self._publish_plan_light(mac_raw, active, st, progress)
        self._publish_plan_target(mac_raw, active, st, progress)

    def _publish_plan_target(self, mac_raw: str, active: bool,
                             st: dict, progress: dict) -> None:
        """While a plan runs the ACTIVE STAGE's day/night targets (temp/humi/co2 +
        deadbands) drive the env tiles — those live in the plan, not the device's
        base ``target`` block, and change as the plan advances. Publishing them here
        (re-run on every getDevSta progress frame) keeps the tiles on the current
        stage's targets and refreshes them at each stage transition. The base-target
        publish in the proxy is suppressed while a plan is active. (v3.19.303)"""
        if not active:
            return
        stages = st.get("stages") or []
        if not stages:
            return
        sid = progress.get("stageId")
        stage = next((s for s in stages if s.get("stageId") == sid), stages[0])
        # Stages are stored FLAT (temp_day/temp_night/temp_dz, humi_*, co2_*) in
        # wire units (°C / % / ppm) by _parse_plan. Rebuild the nested ``target``
        # block those came from so normalize_target does the identical unit
        # conversion and topic mapping as the manual-Environment path — no second
        # copy of the °C→display math to drift. (v3.19.303)
        tgt: dict = {}
        for blk, day, night, dz in (
            ("temp", "temp_day", "temp_night", "temp_dz"),
            ("humi", "humi_day", "humi_night", "humi_dz"),
            ("co2", "co2_day", "co2_night", "co2_dz"),
        ):
            sub: dict = {}
            if stage.get(day) is not None:
                sub["targetDay"] = stage[day]
            if stage.get(night) is not None:
                sub["targetNight"] = stage[night]
            if stage.get(dz) is not None:
                sub["deadband"] = stage[dz]
            if sub:
                tgt[blk] = sub
        if not tgt:
            return
        from .proxy.normalizer import normalize_target
        for topic, val in normalize_target(mac_raw, tgt).items():
            self.publish(topic, val, retain=True)

    def _publish_plan_light(self, mac_raw: str, active: bool,
                            st: dict, progress: dict) -> None:
        """While a plan runs the light follows the active stage's light schedule
        (which lives in the plan, not the device light block), so the per-light
        PPFD/schedule entities would otherwise sit on 'unknown'. Publish the
        active stage's light1/light2 schedule into those entities so the card and
        integration show the real plan-driven light settings. (v3.19.275)"""
        if not active:
            return
        stages = st.get("stages") or []
        if not stages:
            return
        sid = progress.get("stageId")
        stage = next((s for s in stages if s.get("stageId") == sid), stages[0])
        from .tempunits import c_to_disp, abs_bound
        mac = _mac(mac_raw)
        floor = abs_bound(59)   # below the valid 59-122°F / 15-50°C range == "Off"

        def thr(c):
            v = c_to_disp(c)
            return str(v) if v is not None and v >= floor else "0"

        for key, num in (("light1", 1), ("light2", 2)):
            L = stage.get(key)
            if not isinstance(L, dict):
                continue
            base = f"ggs/ha/{mac}/light_{num}"
            # Floor a PPFD light's target/dimming to the valid range so the number
            # entities (min 20 µmol / 11%) accept the publish — a below-min value is
            # rejected by HA and the entity stays 'unknown', which blanked the tile's
            # µmol/DLI. Matches the card + save-path floor. (v3.19.316)
            ppfd_t = int(L.get("ppfd_target", 0) or 0)
            ppfd_lo = int(L.get("ppfd_min", 0) or 0)
            ppfd_hi = int(L.get("ppfd_max", 0) or 0)
            if L.get("mode") == "PPFD":
                ppfd_t = max(20, ppfd_t)
                ppfd_lo = min(100, max(11, ppfd_lo))
                ppfd_hi = 100 if ppfd_hi < ppfd_lo else min(100, ppfd_hi)
            pub = {
                f"{base}_go_dark/state": thr(L.get("go_dark") or 0),
                f"{base}_turn_off/state": thr(L.get("turn_off") or 0),
                f"{base}_schedule_start/state": L.get("ts_start", "00:00"),
                f"{base}_schedule_stop/state": L.get("ts_stop", "00:00"),
                f"{base}_schedule_brightness/state": str(int(L.get("ts_bri", 0) or 0)),
                f"{base}_fade/state": str(int(L.get("ts_fade", 0) or 0)),
                f"{base}_ppfd_target/state": str(ppfd_t),
                f"{base}_ppfd_start/state": L.get("ppfd_start", "00:00"),
                f"{base}_ppfd_stop/state": L.get("ppfd_stop", "00:00"),
                f"{base}_ppfd_fade/state": str(int(L.get("ppfd_fade", 0) or 0)),
                f"{base}_ppfd_min/state": str(ppfd_lo),
                f"{base}_ppfd_max/state": str(ppfd_hi),
            }
            for topic, value in pub.items():
                self.publish(topic, value, retain=True)

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
                         cdelta_to_disp(cal.get("tempSoil") or 0, 1))
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

        # Indicator LED — a device-level switch tied to hasOutlets, NOT to any
        # EVIDENCE_BLOCK. On a pure-outlet strip nothing calls blocks_seen (no
        # sensor blocks), so the LED was never (re)created and its old registry
        # entry showed "unavailable" — greyed out (v3.19.252). Create it here,
        # alongside the outlets, keyed on its own unique_id like the mode select.
        led_uid = f"ggs_{mac}_indicator_light"
        led_defs = [
            d for d in build_device_entities(device_cfg, slot=slot)
            if d.unique_id == led_uid
        ]
        if led_defs:
            if led_uid not in self._registered:
                self._pruned.discard(led_uid)
                DIAG.bus_event(f"outlet_seen {led_uid}")
                self._add_defs(led_defs)
        elif mac not in self._led_pruned:
            # Device has no status LED (single-plug S-Station) — its built-in
            # display shows mode/on. Remove any phantom Indicator Light created
            # before the gate. Check the REGISTRY directly (not _registered,
            # which may be empty right after a restart). Once per MAC. (v3.19.260)
            self._led_pruned.add(mac)
            if self._prune_uids({led_uid}):
                _LOGGER.info("Removed phantom Indicator Light from %s (no LED)", mac)
                DIAG.bus_event(f"prune_indicator {mac}")

        # Reboot button — a device-level control added in build_device_entities
        # like display_off / the LED. It is normally created via blocks_seen, but
        # a pure-outlet or external-sensor strip (ps5/ps10) reports NO SF sensor
        # block, so blocks_seen never runs for it and the button was never made
        # (ac5/ac10 had no Reboot while dp2/st1 did). Create it here, keyed on its
        # own unique_id like the Indicator LED above. (v3.19.307)
        rb_uid = f"ggs_{mac}_reboot"
        if rb_uid not in self._registered:
            rb_defs = [
                d for d in build_device_entities(device_cfg, slot=slot)
                if d.unique_id == rb_uid
            ]
            if rb_defs:
                self._pruned.discard(rb_uid)
                self._add_defs(rb_defs)
                DIAG.bus_event(f"outlet_seen {rb_uid}")

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
        from .entity_defs import _TYPE_LABELS, _PRIMARY_TYPE
        for t, label in _TYPE_LABELS.items():
            if label == model:
                return t
        # Unknown type (device_display not populated yet) — last-resort default.
        # Callers that assign a slot are now gated on a detected type (both PS
        # strips and CBs can carry soil probes, so there's no safe guess here),
        # so this rarely triggers; default to the primary type (display panel)
        # rather than a specific power strip, which mis-slotted panels as ac10.
        return _PRIMARY_TYPE

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

    def prune_offline_devices(self) -> int:
        """When 'keep offline devices' is OFF, remove WHOLE devices that have not
        connected this session — the piece prune_blocks can't do (it only cleans
        per-block phantoms on a device that IS reporting). A device that was
        unplugged/removed (e.g. an SE light taken out of service) never reports,
        so prune_blocks never runs for it and restore_registered_entities skips it,
        leaving a ghost device on the HA device page. This enumerates the config
        entry's device registry and removes any whose MAC never published
        availability this session (not in ``device_available``); a device that
        returns later re-registers its entities from scratch (its slot is kept, so
        entity_ids and history come back). Gated on ``keep_offline`` being False —
        the default (True) preserves dormant gear. Run AFTER the startup grace
        window (so devices that merely reconnect slowly are spared) and when the
        option is toggled off. (v3.19.304)"""
        if self.keep_offline:
            return 0
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is None:
            return 0
        from homeassistant.helpers import device_registry as dr
        from .const import DOMAIN
        dev_reg = dr.async_get(self.hass)
        ent_reg = er.async_get(self.hass)
        removed = 0
        for device in list(dr.async_entries_for_config_entry(dev_reg, entry.entry_id)):
            mac = None
            for dom, ident in device.identifiers:
                if dom == DOMAIN and str(ident).startswith("ggs_"):
                    mac = str(ident)[4:]
            if not mac:
                continue                      # not one of our controllers
            if mac in self.device_available:
                continue                      # connected at least once this session
            # A live proxy session (belt & suspenders — availability may lag).
            prox = self.proxy
            if prox is not None:
                try:
                    if prox.has_session(mac):
                        continue
                except Exception:  # pragma: no cover - defensive
                    pass
            for ent in list(er.async_entries_for_device(
                    ent_reg, device.id, include_disabled_entities=True)):
                ent_reg.async_remove(ent.entity_id)
            dev_reg.async_remove_device(device.id)
            self.forget_device(mac)
            removed += 1
            DIAG.bus_event(f"prune_offline_device {mac}")
        if removed:
            _LOGGER.info(
                "Removed %d offline device(s) not seen this session "
                "(keep-offline disabled)", removed,
            )
        # Remove ALL remaining option traces of gone devices (device_slots,
        # components, per-mac runtime dicts) so nothing lingers as "unknown
        # device" in the mappings / accessories screens. Covers both the devices
        # just pruned AND older orphans whose registry entry was deleted earlier
        # but whose slot was kept. Keep = still registered OR connected. (v3.19.306)
        keep = {_mac(m) for m in self._registry_macs(entry)}
        keep |= {_mac(m) for m in self.device_available}
        orphans: set[str] = set()
        opts = entry.options or {}
        for key in ("device_slots", "components", "strip_sensors",
                    "smart_control", "outlet_env"):
            d = opts.get(key)
            if isinstance(d, dict):
                orphans |= {m for m in d if _mac(m) not in keep}
        if orphans:
            self.purge_device_slots(orphans)
        # Orphaned soil probes: their parent controller was removed, so their
        # entities are gone, but the per-serial soil_slots/soil_types mappings
        # (not keyed by MAC, so purge_device_slots misses them) lingered on the
        # mapping screen as bare "soil1/soil2". Purge those too. (v3.19.309)
        self.purge_orphan_soil()
        return removed

    def purge_orphan_soil(self) -> int:
        """Remove soil_slots / soil_types entries for probes with NO surviving
        soil entity in the registry — i.e. their parent controller was pruned. A
        probe that is merely offline keeps its entities (per-probe staleness only
        greys the tile), so it is NOT orphaned. (v3.19.309)"""
        import re as _re
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is None:
            return 0
        from .const import DOMAIN
        registry = er.async_get(self.hass)
        live: set[str] = set()
        pat = _re.compile(r"_soil_(.+?)_(?:temperature|moisture|ec)$")
        for e in registry.entities.values():
            if e.platform != DOMAIN:
                continue
            m = pat.search((e.unique_id or "").lower())
            if m and m.group(1) != "avg":
                live.add(m.group(1))
        opts = dict(entry.options or {})
        changed = False
        for key in ("soil_slots", "soil_types"):
            d = opts.get(key)
            if isinstance(d, dict):
                kept = {s: v for s, v in d.items() if str(s).lower() in live}
                if len(kept) != len(d):
                    opts[key] = kept
                    changed = True
        if changed:
            self.hass.config_entries.async_update_entry(entry, options=opts)
            DIAG.bus_event("purge_orphan_soil")
        return 1 if changed else 0

    def _registry_macs(self, entry) -> set:
        """MACs with a device-registry entry under this config entry."""
        from homeassistant.helpers import device_registry as dr
        from .const import DOMAIN
        dev_reg = dr.async_get(self.hass)
        out: set = set()
        for device in dr.async_entries_for_config_entry(dev_reg, entry.entry_id):
            for dom, ident in device.identifiers:
                if dom == DOMAIN and str(ident).startswith("ggs_"):
                    out.add(str(ident)[4:])
        return out

    def purge_device_slots(self, macs) -> bool:
        """Erase every stored option trace of the given (removed) MACs —
        device_slots, components, and the per-mac runtime dicts (strip_sensors,
        smart_control, outlet_env). The slot is normally KEPT so a returning
        device reclaims its entity_ids; this is the explicit permanent-removal
        path (a device deleted while OFFLINE, or pruned with keep-offline off), so
        it leaves nothing behind in the config screens. (v3.19.306)"""
        macs = {_mac(m) for m in macs}
        if not macs:
            return False
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        if entry is None:
            return False
        opts = dict(entry.options or {})
        changed = False
        for key in ("device_slots", "components", "strip_sensors",
                    "smart_control", "outlet_env"):
            d = opts.get(key)
            if isinstance(d, dict):
                kept = {m: v for m, v in d.items() if _mac(m) not in macs}
                if len(kept) != len(d):
                    opts[key] = kept
                    changed = True
        if changed:
            self.hass.config_entries.async_update_entry(entry, options=opts)
            DIAG.bus_event(f"purge_device_slots {sorted(macs)}")
        return changed

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
        # Air-sensor evidence gates the Environment target device on strips
        # (v3.19.251) — do this before the empty-blocks bail-out so a strip that
        # reports nothing but outlets can still have a leftover phantom cleaned.
        self._note_air_evidence(blocks, device_cfg)
        if not blocks:
            return
        toggles = self._toggles_for(mac_raw)
        seen_toggleable = {b for b in TOGGLEABLE_BLOCKS if b in blocks}
        if seen_toggleable:
            # Light 2 / Fan are created automatically; if the user has HIDDEN
            # one (explicit False), tear down anything built before.
            if any(toggles.get(b) is False for b in seen_toggleable):
                self.prune_toggled(device_cfg)
        defs = build_device_entities(
            device_cfg, include_outlets=False, blocks=blocks,
            slot=self._slot_for_cfg(device_cfg), toggles=toggles,
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
        # Entities the device legitimately has given its CURRENT evidence —
        # never prune these. Covers device-level entities that aren't tied to a
        # single block (e.g. a strip's Indicator Light), which otherwise appear
        # in every per-block build below and get wrongly deleted (3.19.97).
        toggles = self._toggles_for(mac_raw)
        keep = {
            d.unique_id for d in build_device_entities(
                device_cfg, include_outlets=False,
                blocks=set(evidence) & set(EVIDENCE_BLOCKS), toggles=toggles,
            )
        }
        # An external-sensor strip mirrors a 3rd-party temp/humidity onto its
        # temperature/humidity/vpd entities — those aren't in the device's own
        # evidence, so keep them from being pruned as phantoms. (v3.19.264)
        if _mac(mac_raw) in self._ext_air:
            keep |= {
                d.unique_id for d in build_device_entities(
                    device_cfg, include_outlets=False,
                    blocks={"sensor:temp", "sensor:humi", "sensor:vpd"},
                    toggles=toggles,
                )
            }
        for block in EVIDENCE_BLOCKS:
            if block in evidence:
                continue
            for d in build_device_entities(
                device_cfg, include_outlets=False, blocks={block}
            ):
                if d.unique_id in keep:
                    continue  # valid under current evidence — not a phantom
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

    async def reboot_device(self, mac: str) -> None:
        """Reboot a controller (setDevRestart), gated by Allow device control
        like every other actuation. Raised errors surface in the HA UI."""
        if self.proxy is None:
            raise HomeAssistantError("Spider Farmer Bridge proxy is not running")
        if not self.proxy.allow_control:
            raise HomeAssistantError(
                "Device control is disabled — enable it in the "
                "Spider Farmer Bridge integration options to reboot a device"
            )
        ok = await self.proxy.reboot_device(mac)
        if not ok:
            raise HomeAssistantError(
                "Device is offline — it must be connected to the bridge to reboot"
            )

    # ── Convenience for entities ───────────────────────────────────────────

    def cached(self, topic: str) -> Optional[str]:
        return self.states.get(topic)
