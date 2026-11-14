"""Spider Farmer Bridge — v3, native HA entities (no MQTT)."""
from __future__ import annotations

import asyncio
import logging
import ssl

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.service import async_register_admin_service

from .bus import SfBus
from .diag import DIAG
from . import preserve
from .cert_manager import ensure_certs, cert_paths, upstream_ca_path
from .const import (
    DOMAIN, CONF_LISTEN_PORT, CONF_UPSTREAM_HOST, CONF_UPSTREAM_PORT,
    DEFAULT_LISTEN_PORT, DEFAULT_UPSTREAM_HOST, DEFAULT_UPSTREAM_PORT,
    CONF_ALLOW_CONTROL, CONF_BLOCK_CLOUD, CONF_DIAG_PER_BOOT,
    CONF_KEEP_OFFLINE, CONF_OFFLINE_TIMEOUT, DEFAULT_OFFLINE_TIMEOUT,
    CONF_STRIP_SENSORS, CONF_SMART_CONTROL, CONF_OUTLET_ENV, DATA_BUS,
    DATA_PROXY, DATA_PROXY_TASK, PLATFORMS,
    CONF_DIAG_LOG, CONF_DIAG_PATH, DEFAULT_DIAG_PATH,
    CONF_DIAG_DAYS, DEFAULT_DIAG_DAYS, CONF_PRESERVE_ON_REMOVE,
)
from .entity_defs import HA_STATUS_TOPIC
from .proxy.mitm_proxy import MITMProxy

_LOGGER = logging.getLogger(__name__)

# Background config sync interval — not exposed in UI
_POLL_INTERVAL_SEC = 600


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    # Follow the HA instance's temperature unit for every temperature this
    # integration decodes/writes (set before any entity is built, so their
    # units and the decoded values agree). Default is °F if unread.
    from .tempunits import set_unit as _set_temp_unit
    try:
        _set_temp_unit(hass.config.units.temperature_unit)
    except Exception:  # noqa: BLE001 — never block setup on a unit read
        pass

    # One-time migration: move legacy/doomed diagnostic-log defaults onto the
    # current one (sf/logs/, i.e. /config/sf/logs — outside custom_components/ so
    # updates can't wipe it). The previous default lived INSIDE the integration
    # folder and was replaced on every update. IMPORTANT: sf/logs/diagnostic.log
    # is now the live default and must NOT be in this list — rewriting it is what
    # clobbered a user's deliberate /config/sf/logs path straight back into the
    # update-wiped custom_components folder.
    if (entry.options or {}).get(CONF_DIAG_PATH) in (
        "sf_bridge/diagnostic.log",
        "custom_components/sf/logs/diagnostic.log",
    ):
        hass.config_entries.async_update_entry(
            entry,
            options={**entry.options, CONF_DIAG_PATH: DEFAULT_DIAG_PATH},
        )
        _LOGGER.info(
            "Migrated diagnostic log path to %s (out of the update-wiped "
            "integration folder)", DEFAULT_DIAG_PATH
        )

    # 3.19.90: the two diagnostic-log toggles collapsed into one. The
    # per-boot (version-tagged) switch is now the master enable; the old
    # 'Enable diagnostic log' switch is gone. Carry each user's real on/off
    # state onto the surviving toggle and drop the retired key.
    if CONF_DIAG_LOG in (entry.options or {}):
        opts = dict(entry.options)
        opts[CONF_DIAG_PER_BOOT] = bool(opts.get(CONF_DIAG_LOG, False))
        opts.pop(CONF_DIAG_LOG, None)
        hass.config_entries.async_update_entry(entry, options=opts)

    # One-time rename to the DP / AC scheme (Display Panel + AC5/AC10):
    # rewrites stored entity-id slots and device names on existing installs.
    _migrate_naming_scheme(hass, entry)

    # One-time repair: older builds could register a per-device soil AVERAGE as
    # a phantom probe (e.g. sensor.sf_dp1_soil5_* instead of ..._soil_avg_*).
    # Rename those back in place, by unique_id, so history is preserved.
    _migrate_soil_avg_entity_ids(hass, entry)

    # One-time cleanup (3.18.3): 3.18.0-3.18.2's keep-offline restore misread
    # soil calibration unique_ids as probe serials, spawning phantom soilN
    # sensors and churning the real cal entity ids. Remove the phantoms and
    # re-home the real cal ids.
    _migrate_soil_cal_entity_ids(hass, entry)

    # One-time (3.19.0): calibration/substrate became editable number/select
    # entities; drop the old read-only sensor-domain versions.
    _migrate_cal_to_editable(hass, entry)

    # One-time (3.19.307): Display Off changed number -> select; drop the stale
    # number-domain ghost left on display panels adopted before the change.
    _migrate_display_off_to_number(hass, entry)

    # One-time (3.19.392): the "Operations" (oplog) diagnostic sensor is no longer
    # created (its state was just the last op time and nothing consumed it). Remove
    # the existing entity so it doesn't linger as an "unavailable" ghost.
    _migrate_remove_oplog(hass, entry)
    _migrate_remove_dehumidifier_gear(hass, entry)

    # One-time (3.19.103): soil calibration/substrate entity ids were never
    # re-homed when a Display Panel's dp slot changed, so a dp1<->dp2 swap left
    # them stranded on the other panel (their device name showed the wrong
    # controller). reconcile now handles them — run it once to correct any
    # stranded ids in place (history preserved).
    _migrate_soil_cal_slots(hass, entry)

    # 3.19.88: seed per-device decisions for the toggleable accessories
    # (Light 2 / Fan) from current state so an upgrade neither hides existing
    # gear nor prompts for devices already in service. Runs before the update
    # listener is registered (below), so it can't trigger a reload loop.
    _seed_component_decisions(hass, entry)

    cfg = {**entry.data, **(entry.options or {})}
    listen_port   = int(cfg.get(CONF_LISTEN_PORT,   DEFAULT_LISTEN_PORT))
    upstream_host =     cfg.get(CONF_UPSTREAM_HOST, DEFAULT_UPSTREAM_HOST)
    upstream_port = int(cfg.get(CONF_UPSTREAM_PORT, DEFAULT_UPSTREAM_PORT))

    # ── Bundled certs ──────────────────────────────────────────────────────
    try:
        cert_dir = await hass.async_add_executor_job(ensure_certs, hass.config.config_dir)
    except Exception as exc:
        _LOGGER.error("Spider Farmer Bridge: cert setup failed: %s", exc)
        return False

    server_cert, server_key, ca_cert = cert_paths(cert_dir)

    # ── Diagnostic log (optional, options-toggled) ────────────────────────
    await hass.async_add_executor_job(_apply_diag_options, hass, cfg)

    # ── State bus (replaces the MQTT broker) ──────────────────────────────
    bus = SfBus(hass, entry.entry_id)
    bus.keep_offline = bool(cfg.get(CONF_KEEP_OFFLINE, True))

    # ── Proxy — publishes decoded state into the bus ─────────────────────
    proxy_config = {
        "proxy": {
            "listen_host":              "0.0.0.0",
            "listen_port":              listen_port,
            "upstream_host":            upstream_host,
            "upstream_port":            upstream_port,
            "cert_file":                server_cert,
            "upstream_ca_file":         upstream_ca_path(),
            "key_file":                 server_key,
            "ca_file":                  ca_cert,
            "config_poll_interval_sec": _POLL_INTERVAL_SEC,
        },
    }
    proxy = MITMProxy(config=proxy_config, mqtt_client=bus, config_path=None)
    proxy.allow_control = bool(cfg.get(CONF_ALLOW_CONTROL, False))
    proxy.block_cloud = bool(cfg.get(CONF_BLOCK_CLOUD, False))
    proxy.offline_timeout = float(cfg.get(CONF_OFFLINE_TIMEOUT, DEFAULT_OFFLINE_TIMEOUT) or 0)
    bus.proxy = proxy

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        DATA_BUS:   bus,
        DATA_PROXY: proxy,
    }

    # ── Time-lapse: camera capture → secure storage; card scrubs/exports. ──
    # Created before platforms so the status sensor can find it. Never let this
    # optional subsystem break core bridge setup. (v3.19.358)
    timelapse = None
    try:
        from .timelapse import TimelapseManager
        from .timelapse_http import async_register_timelapse_http
        # Fold any legacy single-time-lapse options into one instance (keeps its
        # folder + running session). Safe here: runs before the update listener is
        # attached, so it can't re-enter setup. (v3.19.362)
        await _migrate_timelapse_options(hass, entry)
        # Move any EMPTY instance off the shared /media/sf_timelapse root into its own
        # per-instance subfolder, so multiple cameras never pour frames into one folder
        # (and the old shared folder isn't "retained"). Only when it has no frames.
        await _tidy_timelapse_dirs(hass, entry)
        timelapse = TimelapseManager(hass, entry)
        timelapse.sync()
        hass.data[DOMAIN][entry.entry_id]["timelapse"] = timelapse
        async_register_timelapse_http(hass)
    except Exception:  # noqa: BLE001 - optional feature must not block the bridge
        _LOGGER.exception("Time-lapse setup failed; continuing without it")

    # ── Platforms first, so entity listeners exist before any device data ──
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    _async_register_services(hass)

    # v3.9.0: with keep-offline on, resurrect entity objects for everything
    # already in the registry, so powered-off gear survives the restart
    # with restored state instead of vanishing until it next reports.
    bus.restore_registered_entities()

    # v3.19.253: set up external-sensor mirroring for any outlet-only strip
    # configured to borrow a 3rd-party HA temp/humidity entity.
    bus.apply_strip_sensors(cfg.get(CONF_STRIP_SENSORS) or {})
    # v3.19.256: start the smart-control loop for any configured device.
    bus.apply_smart_control(cfg.get(CONF_SMART_CONTROL) or {})
    # v3.19.268: start integration-driven env outlet control (sensorless strips).
    bus.apply_outlet_env(cfg.get(CONF_OUTLET_ENV) or {})

    # Bridge is up — retained-"online" parity
    bus.publish(HA_STATUS_TOPIC, "online")

    # Staleness guard: restored entities get a grace window to hear from
    # their device; devices silent past it show unavailable instead of
    # presenting months-old restored values as current.
    bus.start_grace(120)

    # ── Bundled Lovelace cards (opt-in in Settings) ──────────────────────
    # Registered BEFORE the TLS/port work below: if the proxy can't bind (the
    # classic port-8883-taken-by-Mosquitto case) this setup returns False, and
    # a card installed on an earlier run would keep its Lovelace resource
    # entry while its static route was never served — the browser then shows
    # "Custom element doesn't exist: spider-farmer-card" on every load.
    await _apply_card_option(hass, cfg)
    # Re-assert once HA has fully started: on a cold boot this entry can be
    # set up before frontend/lovelace are ready to accept the registration.
    async def _recheck_cards(_event) -> None:
        await _apply_card_option(hass, cfg)

    entry.async_on_unload(
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _recheck_cards)
    )

    # Auto-start time-lapse capture once HA is fully up (the camera entity must
    # exist first). Stop cleanly on unload. (v3.19.358)
    if timelapse is not None:
        async def _start_timelapse(_event=None) -> None:
            # Resume the persisted session for every instance that was capturing
            # before the reboot (keeps each continuous); first run falls back to
            # each instance's 'enabled' flag.
            await timelapse.async_restore_all()

        if hass.is_running:
            hass.async_create_task(_start_timelapse())
        else:
            entry.async_on_unload(
                hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _start_timelapse)
            )
        entry.async_on_unload(timelapse.cancel_all)

    # ── TLS server context (blocking load in executor) ────────────────────
    def _build_ssl_ctx():
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
        ctx.load_cert_chain(certfile=server_cert, keyfile=server_key)
        return ctx

    server_ssl_ctx = await hass.async_add_executor_job(_build_ssl_ctx)

    # ── Bind synchronously, then hand off the serve loop ─────────────────
    stop_event = asyncio.Event()
    try:
        server = await asyncio.start_server(
            proxy.handle_client,
            host="0.0.0.0",
            port=listen_port,
            ssl=server_ssl_ctx,
            reuse_address=True,   # rebind cleanly on reload (3.19.94)
        )
    except OSError as exc:
        _LOGGER.error(
            "Spider Farmer Bridge: cannot bind port %d — %s", listen_port, exc
        )
        await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
        hass.data[DOMAIN].pop(entry.entry_id, None)
        return False

    _LOGGER.info("Spider Farmer Bridge: listening on port %d", listen_port)

    async def _run_proxy() -> None:
        poll_task = asyncio.create_task(proxy.config_poll_loop())
        sweep_task = asyncio.create_task(proxy.offline_sweep_loop())
        try:
            async with server:
                await stop_event.wait()
        finally:
            for _t in (poll_task, sweep_task):
                _t.cancel()
                try:
                    await _t
                except asyncio.CancelledError:
                    pass
        _LOGGER.info("Spider Farmer Bridge: stopped")

    proxy_task = asyncio.ensure_future(_run_proxy())

    hass.data[DOMAIN][entry.entry_id].update({
        DATA_PROXY_TASK: proxy_task,
        "stop_event":    stop_event,
        "server":        server,
    })

    # Remove the card's internal "Apply" write-channel entities left over
    # from older versions. Saves now go through the sf.apply_bundle service,
    # so the entities (which HA always lists on the device page, even when
    # hidden) are gone entirely.
    _remove_apply_entities(hass)

    # Restore customizations (entity/device renames, icons, areas) that a previous
    # remove-with-preserve saved. Load the snapshot OFF the event loop once, then
    # apply it now AND again as devices reconnect and their entities appear
    # (SIGNAL_AVAILABILITY) — on a fresh reinstall the entities are created after
    # setup, so a one-shot pass would miss them. apply_snapshot does no I/O, only
    # fills EMPTY fields, and never clobbers a current value, so re-running is cheap
    # and safe. The loaded snapshot is held in the closure so we don't re-read the
    # file on every availability change.
    _preserve_snap = await hass.async_add_executor_job(preserve._load_snapshot, hass)
    if _preserve_snap:
        from homeassistant.helpers.dispatcher import async_dispatcher_connect
        from .const import SIGNAL_AVAILABILITY
        preserve.apply_snapshot(hass, entry.entry_id, _preserve_snap)
        entry.async_on_unload(async_dispatcher_connect(
            hass, SIGNAL_AVAILABILITY,
            lambda *_: preserve.apply_snapshot(hass, entry.entry_id, _preserve_snap)))

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


def _remove_apply_entities(hass: HomeAssistant) -> None:
    """Remove any leftover ggs_*_apply write-channel entities (pre-3.19.40).

    They were only ever a transport for the card's Save button; that now uses
    the sf.apply_bundle service, and HA shows even hidden entities on the
    device page, so the registry entries are deleted outright."""
    try:
        from homeassistant.helpers import entity_registry as er
        reg = er.async_get(hass)
        for ent in list(reg.entities.values()):
            uid = ent.unique_id or ""
            if (ent.platform == DOMAIN and uid.startswith("ggs_")
                    and uid.endswith("_apply")):
                reg.async_remove(ent.entity_id)
    except Exception as exc:  # pragma: no cover - best effort
        _LOGGER.debug("Remove apply entities skipped: %s", exc)


async def _apply_card_option(hass: HomeAssistant, cfg: dict) -> None:
    """Always install the bundled dashboard cards (the on/off option was removed —
    both the Environment entities and the cards are created automatically)."""
    from . import frontend as sf_frontend

    # Read the version off the event loop (manifest.json is a blocking open).
    version = await hass.async_add_executor_job(_integration_version)
    await sf_frontend.async_register_card(hass, version)


_NAMING_SCHEME_FLAG = "naming_scheme_dp_ac"

# Old display label -> wire type, for renaming existing device entries.
_OLD_LABELS_TO_TYPE = {
    "Control Box": "cb", "Power Strip 5": "ps5", "Power Strip 10": "ps10",
}


def _remap_slot(slot: str) -> str:
    """Old entity-id slot -> new (cb#->dp#, ps5->ac5, ps10->ac10, with the
    strip _N suffix preserved)."""
    import re
    m = re.match(r"^cb(\d+)$", slot)
    if m:
        return f"dp{m.group(1)}"
    m = re.match(r"^ps5(_\d+)?$", slot)
    if m:
        return "ac5" + (m.group(1) or "")
    m = re.match(r"^ps10(_\d+)?$", slot)
    if m:
        return "ac10" + (m.group(1) or "")
    return slot


def _migrate_naming_scheme(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Rename to the Display Panel / AC5 / AC10 scheme on installs created
    before it. Idempotent, guarded by a flag in options."""
    if (entry.options or {}).get(_NAMING_SCHEME_FLAG):
        return

    from homeassistant.helpers import device_registry as dr
    from .const import DOMAIN
    from .entity_defs import _TYPE_LABELS
    from .bus import reconcile_registry_to_slots

    old_slots = dict((entry.options or {}).get("device_slots", {}))
    new_slots = {mac: _remap_slot(sl) for mac, sl in old_slots.items()}
    soil_slots = dict((entry.options or {}).get("soil_slots", {}))

    # Rename existing device entries (name + model) unless the user set a
    # custom name. Their identifier is ggs_{mac}; type comes from the old
    # model label.
    dev_reg = dr.async_get(hass)
    for device in dr.async_entries_for_config_entry(dev_reg, entry.entry_id):
        dtype = _OLD_LABELS_TO_TYPE.get(device.model or "")
        if not dtype:
            continue
        mac = None
        for dom, ident in device.identifiers:
            if dom == DOMAIN and str(ident).startswith("ggs_"):
                mac = str(ident)[4:]
        if not mac:
            continue
        last4 = mac[-4:].upper()
        new_model = _TYPE_LABELS.get(dtype, device.model)
        updates = {"model": new_model}
        if not device.name_by_user:
            updates["name"] = f"SF {new_model} {last4}"
        dev_reg.async_update_device(device.id, **updates)

    # Persist the remapped slots + flag, then reconcile entity ids.
    hass.config_entries.async_update_entry(
        entry,
        options={**(entry.options or {}),
                 "device_slots": new_slots,
                 _NAMING_SCHEME_FLAG: True},
    )
    if new_slots != old_slots:
        reconcile_registry_to_slots(hass, new_slots, soil_slots)
        _LOGGER.info("Migrated entity ids to the DP/AC naming scheme")


def _migrate_soil_avg_entity_ids(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Place every per-device soil-average sensor at the entity_id its OWN
    device's slot dictates, resolved by MAC — not by whatever slot the current
    entity_id happens to carry. Fixes two older problems in one pass:

      • phantom-probe ids from a keep-offline restore bug
        (sensor.sf_{slot}_soil5_{suffix}), and
      • cross-assigned / swapped ids (dp1's average sitting under
        sensor.sf_dp2_soil_avg_* and vice versa) — earlier code derived the
        target slot from the wrong entity_id, so a dp1<->dp2 swap persisted.

    Targets sensor.sf_{device_slot}_soil_avg_{suffix} using device_slots
    (mac -> slot). Uses a two-phase, collision-safe rename so a straight
    dp1<->dp2 swap resolves cleanly. History and statistics carry over.
    Idempotent."""
    import re
    import time
    from homeassistant.helpers import entity_registry as er

    device_slots = dict((entry.options or {}).get("device_slots", {}))
    if not device_slots:
        return

    ent_reg = er.async_get(hass)
    uid_re = re.compile(r"^ggs_([0-9a-f]+)_soil_avg_(temperature|moisture|ec)$")

    planned: list[tuple[str, str]] = []  # (current_entity_id, want)
    for e in list(er.async_entries_for_config_entry(ent_reg, entry.entry_id)):
        m = uid_re.match(e.unique_id or "")
        if not m:
            continue
        mac, suffix = m.group(1), m.group(2)
        slot = device_slots.get(mac)
        if not slot:
            continue  # unknown device slot — leave as-is
        want = f"sensor.sf_{slot}_soil_avg_{suffix}"
        if e.entity_id != want:
            planned.append((e.entity_id, want))

    if not planned:
        return

    # Phase 1: park every mover on a unique temp id, freeing all target ids so
    # a dp1<->dp2 swap can't collide.
    stamp = int(time.time())
    temp_map: list[tuple[str, str, str]] = []  # (temp, want, original)
    for i, (cur, want) in enumerate(planned):
        temp = f"sensor.sf_soilavgtmp_{stamp}_{i}"
        try:
            ent_reg.async_update_entity(cur, new_entity_id=temp)
            temp_map.append((temp, want, cur))
        except (ValueError, KeyError) as exc:
            _LOGGER.warning("soil-avg park failed %s: %s", cur, exc)

    # Phase 2: land each on its correct id.
    fixed = 0
    for temp, want, cur in temp_map:
        if ent_reg.async_get(want) is not None:
            _LOGGER.error(
                "soil-avg target %s already occupied; %s left on %s",
                want, cur, temp,
            )
            continue
        try:
            ent_reg.async_update_entity(temp, new_entity_id=want)
            _LOGGER.info("Repaired soil-average entity %s -> %s", cur, want)
            fixed += 1
        except (ValueError, KeyError) as exc:
            _LOGGER.error("soil-avg finalize failed %s -> %s: %s", cur, want, exc)
    if fixed:
        _LOGGER.info("Repaired %d soil-average entity id(s)", fixed)


def _migrate_soil_cal_entity_ids(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clean up phantom soil-probe fallout from 3.18.0-3.18.2. The keep-offline
    restore parsed soil calibration unique_ids (ggs_{mac}_soil_{serial}_cal_*)
    as probe serials, which spawned phantom soilN sensors on every reboot and
    churned the real calibration entity ids. This:
      * removes the pure-phantom cal_temperature entities (the real soil-temp
        calibration uses ..._cal_temp, so ..._cal_temperature is always phantom);
      * re-homes the real cal_moisture / cal_ec entities to their correct
        sensor.sf_{cb_slot}_{soil_slot}_cal_{suffix} (two-phase, collision-safe).
    Idempotent; history preserved for the re-homed entities."""
    import re
    import time
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    device_slots = dict((entry.options or {}).get("device_slots", {}))
    soil_slots = dict((entry.options or {}).get("soil_slots", {}))
    phantom_re = re.compile(r"^ggs_([0-9a-f]+)_soil_(.+)_cal_temperature$")
    cal_re = re.compile(r"^ggs_([0-9a-f]+)_soil_(.+)_cal_(moisture|ec)$")

    removed = 0
    planned: list[tuple[str, str]] = []
    for e in list(er.async_entries_for_config_entry(ent_reg, entry.entry_id)):
        # Only the legacy 3.18.x read-only cal SENSORS are in scope here. Since
        # 3.19 the real cal entities live in the number./select. domains and are
        # homed correctly by their platform; matching them by unique_id and
        # trying to park them under a sensor. temp id fails ("same domain").
        if e.entity_id.split(".", 1)[0] != "sensor":
            continue
        uid = e.unique_id or ""
        if phantom_re.match(uid):
            try:
                ent_reg.async_remove(e.entity_id)
                removed += 1
            except KeyError:
                pass
            continue
        m = cal_re.match(uid)
        if not m:
            continue
        mac, serial, suffix = m.group(1), m.group(2), m.group(3)
        cb_slot = device_slots.get(mac)
        soil_slot = soil_slots.get(serial.lower())
        if not cb_slot or not soil_slot:
            continue
        want = f"sensor.sf_{cb_slot}_{soil_slot}_cal_{suffix}"
        if e.entity_id != want:
            planned.append((e.entity_id, want))

    if planned:
        stamp = int(time.time())
        temp_map: list[tuple[str, str, str]] = []
        for i, (cur, want) in enumerate(planned):
            temp = f"sensor.sf_calmigtmp_{stamp}_{i}"
            try:
                ent_reg.async_update_entity(cur, new_entity_id=temp)
                temp_map.append((temp, want, cur))
            except (ValueError, KeyError) as exc:
                _LOGGER.warning("soil-cal park failed %s: %s", cur, exc)
        for temp, want, cur in temp_map:
            if ent_reg.async_get(want) is not None:
                _LOGGER.error("soil-cal target %s occupied; %s left on %s",
                              want, cur, temp)
                continue
            try:
                ent_reg.async_update_entity(temp, new_entity_id=want)
                _LOGGER.info("Re-homed soil-cal %s -> %s", cur, want)
            except (ValueError, KeyError) as exc:
                _LOGGER.error("soil-cal finalize failed %s -> %s: %s", cur, want, exc)
    if removed:
        _LOGGER.info("Removed %d phantom soil-cal entity(ies)", removed)


_SOIL_CAL_SLOT_FLAG = "soil_cal_slot_reconcile_v1"


def _migrate_soil_cal_slots(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """One-time repair (3.19.103): re-home soil calibration/substrate entity ids
    that a dp-slot swap stranded on the wrong panel.

    Older reconciles only remapped the probe sensors (temperature/moisture/ec),
    not the editable calibration numbers/selects, so after two Display Panels
    swapped dp1<->dp2 the cal entities kept the other panel's slot prefix and
    showed the wrong device name. Now that reconcile handles them, run it once
    with the persisted slot maps to correct any stranded ids (two-phase and
    collision-safe, so a straight swap is fine). Flagged so it runs a single
    time; harmless when nothing is stranded."""
    if (entry.options or {}).get(_SOIL_CAL_SLOT_FLAG):
        return
    from .bus import reconcile_registry_to_slots

    slots = dict((entry.options or {}).get("device_slots", {}))
    soil_slots = dict((entry.options or {}).get("soil_slots", {}))
    if slots:
        try:
            reconcile_registry_to_slots(hass, slots, soil_slots)
        except Exception:  # noqa: BLE001 - never block setup on a repair pass
            _LOGGER.exception("soil-cal slot reconcile failed (continuing)")
    hass.config_entries.async_update_entry(
        entry, options={**(entry.options or {}), _SOIL_CAL_SLOT_FLAG: True}
    )


def _migrate_cal_to_editable(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """3.19.0: calibration & substrate changed from read-only sensors to
    editable number/select entities. Those live under different domains
    (number./select.) so the old sensor-domain entities would otherwise
    linger as 'no longer provided'. Remove them; the platforms recreate the
    editable versions with the same unique_ids. Idempotent."""
    import re
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    cal_re = re.compile(
        r"^ggs_[0-9a-f]+_("
        r"cal_air_temp|cal_air_humidity|cal_ppfd|cal_co2|"
        r"soil_.+_cal_(temp|moisture|ec)|soil_.+_substrate)$"
    )
    removed = 0
    for e in list(er.async_entries_for_config_entry(ent_reg, entry.entry_id)):
        if e.domain != "sensor":
            continue
        if cal_re.match(e.unique_id or ""):
            try:
                ent_reg.async_remove(e.entity_id)
                removed += 1
            except KeyError:
                pass
    if removed:
        _LOGGER.info(
            "Removed %d read-only calibration sensor(s) now replaced by "
            "editable number/select entities", removed)


def _migrate_display_off_to_number(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """3.19.416: "Display Off / Auto Screen Off" is a number (0 = off, 1-10 min)
    so it renders like the other Configuration rows instead of a full-width
    dropdown. It was a select between 3.19.307 and 3.19.415. Both live under
    different domains but share the unique_id ``ggs_<mac>_display_off``, so the
    stale non-number entity lingers on the device page as an unavailable "no
    longer provided" ghost. Remove it; the number platform recreates the editable
    version with the same unique_id. Idempotent."""
    import re
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    uid_re = re.compile(r"^ggs_[0-9a-f]+_display_off$")
    removed = 0
    for e in list(er.async_entries_for_config_entry(ent_reg, entry.entry_id)):
        if e.domain != "number" and uid_re.match(e.unique_id or ""):
            try:
                ent_reg.async_remove(e.entity_id)
                removed += 1
            except KeyError:
                pass
    if removed:
        _LOGGER.info(
            "Removed %d stale non-number Display Off entity(ies) now "
            "replaced by the number version", removed)


def _migrate_remove_oplog(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """3.19.392: the per-controller "Operations" (oplog) diagnostic sensor
    (unique_id ``ggs_<mac>_oplog``) is no longer created — its state was only the
    last operation time and nothing consumed it. Remove any existing entity so it
    doesn't sit on the device page as an unavailable "no longer provided" ghost.
    Idempotent."""
    import re
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    uid_re = re.compile(r"^ggs_[0-9a-f]+_oplog$")
    removed = 0
    for e in list(er.async_entries_for_config_entry(ent_reg, entry.entry_id)):
        if e.domain == "sensor" and uid_re.match(e.unique_id or ""):
            try:
                ent_reg.async_remove(e.entity_id)
                removed += 1
            except KeyError:
                pass
    if removed:
        _LOGGER.info("Removed %d retired Operations (oplog) sensor(s)", removed)


def _migrate_remove_dehumidifier_gear(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """3.19.419: the separate "Dehumidifier Gear" select (unique_id
    ``ggs_<mac>_dehumidifier_gear``) is no longer created — it duplicated
    "Dehumidifier Level" (the dehumidifier has a single Low/High setting). Remove
    any existing entity so it doesn't sit on the device page as a disabled "no
    longer provided" ghost the user can't delete. Idempotent."""
    import re
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    uid_re = re.compile(r"^ggs_[0-9a-f]+_dehumidifier_gear$")
    removed = 0
    for e in list(er.async_entries_for_config_entry(ent_reg, entry.entry_id)):
        if e.domain == "select" and uid_re.match(e.unique_id or ""):
            try:
                ent_reg.async_remove(e.entity_id)
                removed += 1
            except KeyError:
                pass
    if removed:
        _LOGGER.info("Removed %d retired Dehumidifier Gear select(s)", removed)


def _seed_component_decisions(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Carry a prior card-driven "Hide Light 2" into the per-device accessory
    decisions (options["components"][mac]["light2"]). Light 2 / Fan otherwise
    create automatically, so nothing else needs seeding. Runs before the update
    listener is registered, so no reload loop; idempotent."""
    comps: dict = {
        mac: dict(v)
        for mac, v in (entry.options or {}).get("components", {}).items()
    }
    before = {mac: dict(v) for mac, v in comps.items()}

    # Carry a prior card-driven "Hide Light 2" over to the accessory decision
    # (card_options[mac]["hide_light2"] == "1"  ->  components[mac]["light2"]
    # = False). Everything else auto-creates, so nothing else needs seeding.
    for mac, opt in (entry.options or {}).get("card_options", {}).items():
        if "hide_light2" in (opt or {}):
            hidden = str(opt["hide_light2"]) in ("1", "true", "True", "on")
            comps.setdefault(mac, {})["light2"] = not hidden

    if comps != before:
        hass.config_entries.async_update_entry(
            entry, options={**(entry.options or {}), "components": comps},
        )
        _LOGGER.info("Carried prior Hide Light 2 into accessory decisions")


_SCHEDULE_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("periods"): [dict],
})
_OUTLET_CONFIG_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("mode"): cv.string,
    vol.Optional("config", default=dict): dict,
})
_ALARM_SETTINGS_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("settings"): dict,
})
_APPLY_BUNDLE_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("module"): cv.string,
    vol.Required("settings"): dict,
})
_CARD_OPTION_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("key"): cv.string,
    vol.Required("value"): cv.string,
})
_SET_PLAN_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("stages"): list,
    vol.Optional("enabled", default=False): vol.Any(bool, int),
})
_SENSOR_HEATING_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("on"): vol.Any(bool, int),
})
_REBOOT_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
})
_STRIP_SENSOR_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("source"): vol.In(["sf", "external"]),
    vol.Optional("temp_entity", default=""): cv.string,
    vol.Optional("humi_entity", default=""): cv.string,
})
_SMART_CONTROL_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("enabled"): vol.Any(bool, int),
    vol.Optional("settings", default={}): dict,
})
_OUTLET_ENV_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("enabled"): vol.Any(bool, int),
    # mode "Temperature" (v1); dir "Cooling"/"Heating". Extra tuning is optional.
    vol.Optional("mode", default="Temperature"): cv.string,
    vol.Optional("direction", default="Cooling"): cv.string,
    vol.Optional("settings", default={}): dict,
})
# Wire module names the apply-bundle command path understands.
_APPLY_MODULES = {"fan", "blower", "heater", "humidifier", "dehumidifier",
                  "light", "light2"}


def _proxy_for_entity(hass: HomeAssistant, ent) -> object | None:
    """The proxy owning an entity's config entry, or any active proxy."""
    data = hass.data.get(DOMAIN, {}).get(ent.config_entry_id) if ent else None
    proxy = data.get(DATA_PROXY) if isinstance(data, dict) else None
    if proxy is None:
        for d in hass.data.get(DOMAIN, {}).values():
            if isinstance(d, dict) and d.get(DATA_PROXY):
                return d[DATA_PROXY]
    return proxy


def _async_register_services(hass: HomeAssistant) -> None:
    """Register the schedule-write services (once)."""
    import re
    from homeassistant.helpers import entity_registry as er

    async def _set_se_schedule(call: ServiceCall) -> None:
        periods = call.data.get("periods") or []
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning("set_se_schedule: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            proxy = _proxy_for_entity(hass, ent)
            if proxy is not None:
                await proxy.write_se_schedule(mac, periods)

    async def _set_outlet_schedule(call: ServiceCall) -> None:
        periods = call.data.get("periods") or []
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            m = re.match(r"^ggs_([0-9a-f]+)_outlet_(\d+)_", ent.unique_id or "" if ent else "")
            if not m:
                _LOGGER.warning("set_outlet_schedule: %s is not an outlet entity", eid)
                continue
            proxy = _proxy_for_entity(hass, ent)
            if proxy is not None:
                await proxy.write_outlet_schedule(m.group(1), int(m.group(2)), periods)

    async def _set_outlet_config(call: ServiceCall) -> None:
        """Commit an outlet's mode + its config fields in one atomic write, so a
        freshly-picked mode and its settings land together (no two-step)."""
        mode = str(call.data.get("mode") or "")
        config = call.data.get("config") or {}
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            m = re.match(r"^ggs_([0-9a-f]+)_outlet_(\d+)_", ent.unique_id or "" if ent else "")
            if not m:
                _LOGGER.warning("set_outlet_config: %s is not an outlet entity", eid)
                continue
            proxy = _proxy_for_entity(hass, ent)
            if proxy is not None:
                await proxy.write_outlet_config(
                    m.group(1), int(m.group(2)), mode, config)

    async def _set_alarm_settings(call: ServiceCall) -> None:
        settings = call.data.get("settings") or {}
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning("set_alarm_settings: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            proxy = _proxy_for_entity(hass, ent)
            if proxy is not None:
                await proxy.write_alarm_settings(mac, settings)

    async def _apply_bundle(call: ServiceCall) -> None:
        """Commit a card Save bundle: several staged sub-settings written to
        one device module as a single block-preserving setConfigField."""
        import json as _json
        module = str(call.data.get("module") or "")
        module = {"light_1": "light", "light_2": "light2"}.get(module, module)
        if module not in _APPLY_MODULES:
            _LOGGER.warning("apply_bundle: unknown module %r", module)
            return
        payload = _json.dumps(call.data.get("settings") or {})
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning(
                    "apply_bundle: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            data = hass.data.get(DOMAIN, {}).get(ent.config_entry_id)
            bus = data.get(DATA_BUS) if isinstance(data, dict) else None
            if bus is None:
                for d0 in hass.data.get(DOMAIN, {}).values():
                    if isinstance(d0, dict) and d0.get(DATA_BUS):
                        bus = d0[DATA_BUS]
                        break
            if bus is not None:
                await bus.async_command(
                    f"ggs/ha/{mac}/{module}/apply_bundle/set", payload)

    async def _set_plan(call: ServiceCall) -> None:
        """Write a grow plan (create/edit) from the card: the stage list + an
        enabled flag, read-modify-write against the controller's cached plan."""
        stages = call.data.get("stages") or []
        enabled = call.data.get("enabled", False)
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning("set_plan: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            proxy = _proxy_for_entity(hass, ent)
            if proxy is not None:
                await proxy.write_plan(mac, stages, enabled)

    async def _set_sensor_heating(call: ServiceCall) -> None:
        """Start (on=1) / stop (on=0) the air temp/humidity sensor self-clean
        (the SF app's 'Sensor cleaning'). Gated by Allow device control."""
        from homeassistant.exceptions import HomeAssistantError
        on = bool(call.data.get("on"))
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning(
                    "set_sensor_heating: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            proxy = _proxy_for_entity(hass, ent)
            if proxy is None:
                continue
            if not getattr(proxy, "allow_control", False):
                raise HomeAssistantError(
                    "Device control is disabled — enable it in the Spider Farmer "
                    "Bridge integration options to start/stop sensor cleaning",
                    translation_domain=DOMAIN, translation_key="control_disabled_cleaning")
            await proxy.set_sensor_heating(mac, on)

    async def _reboot_device(call: ServiceCall) -> None:
        """Reboot the controller(s) behind the given entity(ies) — the firmware's
        setDevRestart. Gated by Allow device control; a target that's offline is
        skipped with a warning."""
        from homeassistant.exceptions import HomeAssistantError
        ent_reg = er.async_get(hass)
        seen: set[str] = set()
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning("reboot_device: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            if mac in seen:
                continue           # one reboot per controller even if several entities target it
            seen.add(mac)
            proxy = _proxy_for_entity(hass, ent)
            if proxy is None:
                continue
            if not getattr(proxy, "allow_control", False):
                raise HomeAssistantError(
                    "Device control is disabled — enable it in the Spider Farmer "
                    "Bridge integration options to reboot a device",
                    translation_domain=DOMAIN, translation_key="control_disabled_reboot")
            await proxy.reboot_device(mac)

    async def _set_card_option(call: ServiceCall) -> None:
        """Persist a per-panel card display option (e.g. the out-of-range
        colour mode) in the config entry so it survives upgrades and syncs
        across devices. Read back by the card via the alarm_settings sensor's
        ``card_options`` attribute."""
        from homeassistant.helpers.dispatcher import async_dispatcher_send
        from .const import SIGNAL_DEVICE_AVAIL_FMT
        key = str(call.data.get("key") or "")
        value = call.data.get("value")
        if not key:
            return
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning("set_card_option: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            entry = hass.config_entries.async_get_entry(ent.config_entry_id)
            if entry is None:
                continue
            opts = dict(entry.options or {})
            card_opts = {**(opts.get("card_options") or {})}
            mac_opts = {**(card_opts.get(mac) or {})}
            mac_opts[key] = value
            card_opts[mac] = mac_opts
            opts["card_options"] = card_opts
            # Live-applied by _async_update_listener (no reload); dispatch so the
            # alarm_settings sensor re-publishes its card_options attribute.
            hass.config_entries.async_update_entry(entry, options=opts)
            async_dispatcher_send(hass, SIGNAL_DEVICE_AVAIL_FMT.format(mac))

    async def _set_strip_sensor(call: ServiceCall) -> None:
        """Set an outlet-only strip's temperature source (v3.19.253): "sf" (its
        own sensor) or "external" (mirror a 3rd-party HA temp/humidity entity).
        Stored per-MAC in the config entry's ``strip_sensors`` option and applied
        live by _async_update_listener."""
        source = str(call.data.get("source") or "sf")
        temp_e = str(call.data.get("temp_entity") or "")
        humi_e = str(call.data.get("humi_entity") or "")
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning("set_strip_sensor: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            entry = hass.config_entries.async_get_entry(ent.config_entry_id)
            if entry is None:
                continue
            opts = dict(entry.options or {})
            strip = {**(opts.get(CONF_STRIP_SENSORS) or {})}
            if source == "external" and (temp_e or humi_e):
                strip[mac] = {"source": "external", "temp": temp_e, "humi": humi_e}
            else:
                strip.pop(mac, None)   # back to SF sensor / cleared
            opts[CONF_STRIP_SENSORS] = strip
            # Mirror into card_options so the card's Settings picker can read the
            # current selection back (it reads the alarm_settings sensor).
            from homeassistant.helpers.dispatcher import async_dispatcher_send
            from .const import SIGNAL_DEVICE_AVAIL_FMT
            card_opts = {**(opts.get("card_options") or {})}
            mac_opts = {**(card_opts.get(mac) or {})}
            mac_opts["temp_source"] = source
            mac_opts["ext_temp"] = temp_e if source == "external" else ""
            mac_opts["ext_humi"] = humi_e if source == "external" else ""
            card_opts[mac] = mac_opts
            opts["card_options"] = card_opts
            hass.config_entries.async_update_entry(entry, options=opts)
            async_dispatcher_send(hass, SIGNAL_DEVICE_AVAIL_FMT.format(mac))

    async def _set_smart_control(call: ServiceCall) -> None:
        """Enable/disable + tune smart control for a device (v3.19.256). Stored
        per-MAC in the ``smart_control`` option; the loop is (re)started live by
        _async_update_listener. Also mirrored into card_options as a JSON blob so
        the card's Smart-control section reads the current settings back."""
        import json as _json
        from homeassistant.helpers.dispatcher import async_dispatcher_send
        from .const import SIGNAL_DEVICE_AVAIL_FMT
        enabled = bool(call.data.get("enabled"))
        settings = call.data.get("settings") or {}
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            uid = ent.unique_id if ent else ""
            if not uid or not uid.startswith("ggs_"):
                _LOGGER.warning("set_smart_control: %s is not a Spider Farmer entity", eid)
                continue
            mac = uid[4:].split("_", 1)[0]
            entry = hass.config_entries.async_get_entry(ent.config_entry_id)
            if entry is None:
                continue
            opts = dict(entry.options or {})
            sc = {**(opts.get(CONF_SMART_CONTROL) or {})}
            merged = {**(sc.get(mac) or {}), **settings, "enabled": enabled}
            sc[mac] = merged
            opts[CONF_SMART_CONTROL] = sc
            card_opts = {**(opts.get("card_options") or {})}
            mac_opts = {**(card_opts.get(mac) or {})}
            mac_opts["smart"] = _json.dumps(merged)
            card_opts[mac] = mac_opts
            opts["card_options"] = card_opts
            hass.config_entries.async_update_entry(entry, options=opts)
            async_dispatcher_send(hass, SIGNAL_DEVICE_AVAIL_FMT.format(mac))

    async def _set_outlet_env(call: ServiceCall) -> None:
        """Enable/disable integration-driven env control for one outlet on a
        sensorless strip (v3.19.268). Stored per-(MAC, outlet) in ``outlet_env``;
        the loop is (re)started live by _async_update_listener. The chosen mode is
        held virtually so the card keeps showing Temperature/Cooling."""
        enabled = bool(call.data.get("enabled"))
        mode = str(call.data.get("mode") or "Temperature")
        direction = str(call.data.get("direction") or "Cooling")
        settings = call.data.get("settings") or {}
        ent_reg = er.async_get(hass)
        for eid in call.data.get("entity_id", []):
            ent = ent_reg.async_get(eid)
            m = re.match(r"^ggs_([0-9a-f]+)_outlet_(\d+)_", ent.unique_id or "" if ent else "")
            if not m:
                _LOGGER.warning("set_outlet_env: %s is not an outlet entity", eid)
                continue
            mac, n = m.group(1), m.group(2)
            entry = hass.config_entries.async_get_entry(ent.config_entry_id)
            if entry is None:
                continue
            data = hass.data.get(DOMAIN, {}).get(ent.config_entry_id)
            bus = data.get(DATA_BUS) if isinstance(data, dict) else None
            opts = dict(entry.options or {})
            oe = {**(opts.get(CONF_OUTLET_ENV) or {})}
            per_mac = {**(oe.get(mac) or {})}
            if enabled:
                per_mac[n] = {**(per_mac.get(n) or {}), **settings,
                              "enabled": True, "mode": mode, "dir": direction}
            else:
                # Release: drop the entry (no persistent tombstone) and hand the
                # outlet back immediately; an env-mode frame re-adopts it later.
                per_mac.pop(n, None)
                if bus is not None:
                    bus.release_outlet_env(mac, int(n))
            if per_mac:
                oe[mac] = per_mac
            else:
                oe.pop(mac, None)
            opts[CONF_OUTLET_ENV] = oe
            hass.config_entries.async_update_entry(entry, options=opts)

    if not hass.services.has_service(DOMAIN, "set_se_schedule"):
        hass.services.async_register(
            DOMAIN, "set_se_schedule", _set_se_schedule, schema=_SCHEDULE_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_outlet_schedule"):
        hass.services.async_register(
            DOMAIN, "set_outlet_schedule", _set_outlet_schedule, schema=_SCHEDULE_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_outlet_config"):
        hass.services.async_register(
            DOMAIN, "set_outlet_config", _set_outlet_config, schema=_OUTLET_CONFIG_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_alarm_settings"):
        hass.services.async_register(
            DOMAIN, "set_alarm_settings", _set_alarm_settings, schema=_ALARM_SETTINGS_SCHEMA)
    if not hass.services.has_service(DOMAIN, "apply_bundle"):
        hass.services.async_register(
            DOMAIN, "apply_bundle", _apply_bundle, schema=_APPLY_BUNDLE_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_card_option"):
        hass.services.async_register(
            DOMAIN, "set_card_option", _set_card_option, schema=_CARD_OPTION_SCHEMA)
    if not hass.services.has_service(DOMAIN, "reboot_device"):
        hass.services.async_register(
            DOMAIN, "reboot_device", _reboot_device, schema=_REBOOT_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_plan"):
        hass.services.async_register(
            DOMAIN, "set_plan", _set_plan, schema=_SET_PLAN_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_sensor_heating"):
        hass.services.async_register(
            DOMAIN, "set_sensor_heating", _set_sensor_heating,
            schema=_SENSOR_HEATING_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_strip_sensor"):
        hass.services.async_register(
            DOMAIN, "set_strip_sensor", _set_strip_sensor,
            schema=_STRIP_SENSOR_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_smart_control"):
        hass.services.async_register(
            DOMAIN, "set_smart_control", _set_smart_control,
            schema=_SMART_CONTROL_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_outlet_env"):
        hass.services.async_register(
            DOMAIN, "set_outlet_env", _set_outlet_env,
            schema=_OUTLET_ENV_SCHEMA)

    # ── Time-lapse capture controls (v3.19.362: per-instance, keyed by tl_id) ──
    async def _timelapse_start(call):
        # No caller-supplied `session`: capture always uses a fresh, safe
        # timestamp folder (prevents writing frames outside the storage root).
        ctrl = _tl_controller(hass, call.data.get("tl_id"))
        if ctrl is not None:
            await ctrl.async_start(interval=call.data.get("interval"))

    async def _timelapse_stop(call):
        ctrl = _tl_controller(hass, call.data.get("tl_id"))
        if ctrl is not None:
            await ctrl.async_stop()

    async def _timelapse_set_interval(call):
        ctrl = _tl_controller(hass, call.data.get("tl_id"))
        if ctrl is not None:
            await ctrl.async_set_interval(int(call.data["interval"]))

    async def _timelapse_export(call):
        ctrl = _tl_controller(hass, call.data.get("tl_id"))
        if ctrl is not None:
            await ctrl.async_export(
                session=call.data.get("session") or None,
                fps=call.data.get("fps"),
                name=call.data.get("name") or None)

    async def _timelapse_configure(call):
        """Card-driven settings for ONE instance. The card supplies tl_id (a slug of
        the card's name, or the camera when blank); the instance is CREATED if it
        doesn't exist yet, so dropping a card with a new name adds a time-lapse. The
        fields are merged into that instance's options dict (validated), the manager
        reconciles its controllers, and the instance is applied live."""
        mgr = _tl_manager(hass)
        if mgr is None:
            return
        from .config_flow import (
            _normalize_timelapse_dir, _is_blocked_timelapse_dir, _timelapse_dir_writable)
        from .const import (
            CONF_TIMELAPSE_INSTANCES, slug_timelapse_id,
            TL_NAME, TL_LABEL, TL_CAMERA, TL_DIR, TL_INTERVAL, TL_RETENTION, TL_ENABLED,
            TL_OVERLAY, TL_OVERLAY_BURN, TL_OVERLAY_PANEL, TL_OVERLAY_FIELDS,
            TL_OVERLAY_COLOR, TL_OVERLAY_GROUPED, TL_OVERLAY_POS, TL_OVERLAY_ORIENT,
            TL_OVERLAY_LABELS, TL_OVERLAY_FONT, TL_ALIGN, TL_DAILY_AT)
        d = call.data
        entry = mgr.entry
        # Resolve which instance: explicit tl_id, else a slug of name-or-camera.
        tl_id = d.get("tl_id")
        if not tl_id:
            tl_id = slug_timelapse_id(d.get("name") or d.get("camera") or "")
        tl_id = slug_timelapse_id(tl_id)
        opts = dict(entry.options or {})
        insts = dict(opts.get(CONF_TIMELAPSE_INSTANCES) or {})
        inst = dict(insts.get(tl_id) or {})
        if "name" in d and d["name"]:
            inst[TL_NAME] = str(d["name"])
        inst.setdefault(TL_NAME, tl_id)
        # Display name (header). Present-but-empty clears it → card falls back to
        # the camera's friendly name. Does NOT affect tl_id (that stays on TL_NAME).
        if "label" in d:
            inst[TL_LABEL] = str(d["label"] or "")
        if "camera" in d:
            inst[TL_CAMERA] = d["camera"]
        if "storage_dir" in d:
            path = _normalize_timelapse_dir(str(d["storage_dir"]))
            if not path or _is_blocked_timelapse_dir(path):
                _LOGGER.warning("Time-lapse: refused insecure storage dir %r", d["storage_dir"])
                return
            # Only allow paths Home Assistant itself permits access to
            # (allowlist_external_dirs, which includes media_dirs — the default
            # /media lives here). Blocks pointing the integration at /config,
            # arbitrary host paths, etc.
            if not await hass.async_add_executor_job(hass.config.is_allowed_path, path):
                _LOGGER.warning(
                    "Time-lapse: storage dir %s is not in Home Assistant's allowed "
                    "paths (allowlist_external_dirs / media_dirs) — refusing", path)
                return
            if not await hass.async_add_executor_job(_timelapse_dir_writable, path):
                _LOGGER.warning("Time-lapse: storage dir not writable: %s", path)
                return
            inst[TL_DIR] = path
        if "interval" in d:
            inst[TL_INTERVAL] = int(d["interval"])
        if "retention" in d:
            inst[TL_RETENTION] = int(d["retention"])
        if "enabled" in d:
            inst[TL_ENABLED] = bool(d["enabled"])
        if "overlay" in d:
            inst[TL_OVERLAY] = bool(d["overlay"])
        if "overlay_burn" in d:
            inst[TL_OVERLAY_BURN] = bool(d["overlay_burn"])
        if "overlay_panel" in d:
            inst[TL_OVERLAY_PANEL] = str(d["overlay_panel"])
        if "overlay_fields" in d:
            inst[TL_OVERLAY_FIELDS] = list(d["overlay_fields"])
        if "overlay_color" in d:
            inst[TL_OVERLAY_COLOR] = str(d["overlay_color"])
        if "overlay_grouped" in d:
            inst[TL_OVERLAY_GROUPED] = bool(d["overlay_grouped"])
        if "overlay_pos" in d:
            inst[TL_OVERLAY_POS] = dict(d["overlay_pos"] or {})
        if "overlay_orient" in d:
            inst[TL_OVERLAY_ORIENT] = str(d["overlay_orient"])
        if "overlay_labels" in d:
            inst[TL_OVERLAY_LABELS] = bool(d["overlay_labels"])
        if "overlay_font" in d:
            inst[TL_OVERLAY_FONT] = float(d["overlay_font"])
        if "align" in d:
            inst[TL_ALIGN] = bool(d["align"])
        if "daily_at" in d:
            inst[TL_DAILY_AT] = str(d["daily_at"])
        insts[tl_id] = inst
        opts[CONF_TIMELAPSE_INSTANCES] = insts
        hass.config_entries.async_update_entry(entry, options=opts)
        # Reconcile controllers to the new instances set, tell the sensor platform,
        # then apply this instance live (start/stop/restart to match).
        mgr.sync()
        mgr.notify_instances()
        ctrl = mgr.get(tl_id)
        if ctrl is not None:
            await ctrl.async_apply_config()

    async def _timelapse_clear(call):
        ctrl = _tl_controller(hass, call.data.get("tl_id"))
        if ctrl is not None:
            await ctrl.async_clear()

    async def _timelapse_remove(call):
        """Delete an instance entirely (stops capture, forgets its session, drops
        its status sensor). With delete_images=True (the card's default), its captured
        frames/sessions/exports folder is deleted too so re-adding the same camera
        starts clean — no manual folder deletion. (v3.19.373)"""
        mgr = _tl_manager(hass)
        if mgr is None:
            return
        from .const import CONF_TIMELAPSE_INSTANCES, slug_timelapse_id
        tl_id = slug_timelapse_id(call.data["tl_id"])
        entry = mgr.entry
        opts = dict(entry.options or {})
        insts = dict(opts.get(CONF_TIMELAPSE_INSTANCES) or {})
        if tl_id not in insts:
            return
        # Delete images BEFORE dropping the controller (we need its root path).
        if call.data.get("delete_images"):
            ctrl = mgr.get(tl_id)
            if ctrl is not None:
                try:
                    await ctrl.async_clear()
                except Exception:  # noqa: BLE001 - best-effort; still remove the instance
                    _LOGGER.warning("Time-lapse remove: image delete failed for %s", tl_id)
        insts.pop(tl_id, None)
        opts[CONF_TIMELAPSE_INSTANCES] = insts
        hass.config_entries.async_update_entry(entry, options=opts)
        mgr.sync()
        mgr.notify_instances()

    if not hass.services.has_service(DOMAIN, "timelapse_start"):
        hass.services.async_register(
            DOMAIN, "timelapse_start", _timelapse_start,
            schema=vol.Schema({vol.Optional("tl_id"): cv.string,
                               vol.Optional("interval"): vol.Coerce(int)}))
    if not hass.services.has_service(DOMAIN, "timelapse_stop"):
        hass.services.async_register(
            DOMAIN, "timelapse_stop", _timelapse_stop,
            schema=vol.Schema({vol.Optional("tl_id"): cv.string}))
    if not hass.services.has_service(DOMAIN, "timelapse_set_interval"):
        hass.services.async_register(
            DOMAIN, "timelapse_set_interval", _timelapse_set_interval,
            schema=vol.Schema({vol.Optional("tl_id"): cv.string,
                               vol.Required("interval"): vol.Coerce(int)}))
    if not hass.services.has_service(DOMAIN, "timelapse_export"):
        hass.services.async_register(
            DOMAIN, "timelapse_export", _timelapse_export,
            schema=vol.Schema({vol.Optional("tl_id"): cv.string,
                               vol.Optional("session"): cv.string,
                               vol.Optional("fps"): vol.Coerce(int),
                               vol.Optional("name"): cv.string}))
    if not hass.services.has_service(DOMAIN, "timelapse_configure"):
        # Admin-only: these point the integration at a storage folder and can
        # delete the frames/exports under it, so only admins may call them.
        async_register_admin_service(
            hass, DOMAIN, "timelapse_configure", _timelapse_configure,
            schema=vol.Schema({
                vol.Optional("tl_id"): cv.string,
                vol.Optional("name"): cv.string,
                vol.Optional("label"): cv.string,
                vol.Optional("camera"): cv.string,
                vol.Optional("storage_dir"): cv.string,
                vol.Optional("interval"): vol.Coerce(int),
                vol.Optional("retention"): vol.Coerce(int),
                vol.Optional("enabled"): cv.boolean,
                vol.Optional("overlay"): cv.boolean,
                vol.Optional("overlay_burn"): cv.boolean,
                vol.Optional("overlay_panel"): cv.string,
                vol.Optional("overlay_fields"): vol.All(cv.ensure_list, [cv.string]),
                vol.Optional("overlay_color"): cv.string,
                vol.Optional("overlay_grouped"): cv.boolean,
                vol.Optional("overlay_pos"): dict,
                vol.Optional("overlay_orient"): cv.string,
                vol.Optional("overlay_labels"): cv.boolean,
                vol.Optional("overlay_font"): vol.Coerce(float),
                vol.Optional("align"): cv.boolean,
                vol.Optional("daily_at"): cv.string,
            }))
    if not hass.services.has_service(DOMAIN, "timelapse_clear"):
        async_register_admin_service(
            hass, DOMAIN, "timelapse_clear", _timelapse_clear,
            schema=vol.Schema({vol.Optional("tl_id"): cv.string}))
    if not hass.services.has_service(DOMAIN, "timelapse_remove"):
        async_register_admin_service(
            hass, DOMAIN, "timelapse_remove", _timelapse_remove,
            schema=vol.Schema({vol.Required("tl_id"): cv.string,
                               vol.Optional("delete_images"): cv.boolean}))


def _tl_manager(hass):
    """First configured time-lapse manager (single config entry)."""
    for data in (hass.data.get(DOMAIN) or {}).values():
        if isinstance(data, dict) and data.get("timelapse") is not None:
            return data["timelapse"]
    return None


def _tl_controller(hass, tl_id=None):
    """A specific instance's controller (or the first when tl_id is omitted)."""
    mgr = _tl_manager(hass)
    return mgr.get(tl_id) if mgr is not None else None


def _any_timelapse(hass):
    """Back-compat: the first time-lapse controller across all instances."""
    return _tl_controller(hass, None)


def _norm_dir(p: str) -> str:
    return (str(p or "")).replace("\\", "/").rstrip("/")


async def _tidy_timelapse_dirs(hass, entry) -> None:
    """Repoint any instance still on the bare shared `/media/sf_timelapse` root to its
    own `/media/sf_timelapse/<tl_id>` subfolder — but ONLY when that root holds no
    frames for it, so an in-progress migrated time-lapse is never disturbed. This
    stops the old shared folder being 'retained' and prevents two cameras sharing one
    folder (which would intermix their sessions). (v3.19.365)"""
    from .const import CONF_TIMELAPSE_INSTANCES, DEFAULT_TIMELAPSE_DIR, TL_DIR
    from .timelapse import list_sessions
    opts = dict(entry.options or {})
    insts = dict(opts.get(CONF_TIMELAPSE_INSTANCES) or {})
    if not insts:
        return
    shared = _norm_dir(DEFAULT_TIMELAPSE_DIR)
    changed = False
    for tl_id, inst in list(insts.items()):
        if _norm_dir(inst.get(TL_DIR) or "") != shared:
            continue
        try:
            sessions = await hass.async_add_executor_job(list_sessions, DEFAULT_TIMELAPSE_DIR)
        except Exception:  # noqa: BLE001
            sessions = [1]  # be conservative — don't move if we can't tell
        if sessions:
            continue
        inst = dict(inst)
        inst[TL_DIR] = f"{DEFAULT_TIMELAPSE_DIR}/{tl_id}"
        insts[tl_id] = inst
        changed = True
        _LOGGER.info("Time-lapse %s: moved off shared root → %s", tl_id, inst[TL_DIR])
    if changed:
        opts[CONF_TIMELAPSE_INSTANCES] = insts
        hass.config_entries.async_update_entry(entry, options=opts)


async def _migrate_timelapse_options(hass, entry) -> None:
    """One-time: fold the legacy single-time-lapse top-level options into one
    instance under CONF_TIMELAPSE_INSTANCES, preserving its folder + running
    session so the update doesn't fragment or stop an in-progress time-lapse."""
    from .const import (
        CONF_TIMELAPSE_INSTANCES, CONF_TIMELAPSE_CAMERA, CONF_TIMELAPSE_DIR,
        CONF_TIMELAPSE_INTERVAL, CONF_TIMELAPSE_RETENTION, CONF_TIMELAPSE_ENABLED,
        CONF_TIMELAPSE_OVERLAY, CONF_TIMELAPSE_OVERLAY_BURN, CONF_TIMELAPSE_OVERLAY_PANEL,
        CONF_TIMELAPSE_OVERLAY_FIELDS, DEFAULT_TIMELAPSE_DIR, DEFAULT_TIMELAPSE_INTERVAL,
        DEFAULT_TIMELAPSE_RETENTION, DEFAULT_TIMELAPSE_OVERLAY_FIELDS, slug_timelapse_id,
        TL_NAME, TL_CAMERA, TL_DIR, TL_INTERVAL, TL_RETENTION, TL_ENABLED,
        TL_OVERLAY, TL_OVERLAY_BURN, TL_OVERLAY_PANEL, TL_OVERLAY_FIELDS)
    opts = dict(entry.options or {})
    if CONF_TIMELAPSE_INSTANCES in opts:
        return  # already migrated (or born multi-instance)
    merged = {**entry.data, **opts}
    cam = merged.get(CONF_TIMELAPSE_CAMERA)
    has_legacy = bool(cam or merged.get(CONF_TIMELAPSE_DIR)
                      or merged.get(CONF_TIMELAPSE_ENABLED))
    if not has_legacy:
        opts[CONF_TIMELAPSE_INSTANCES] = {}
        hass.config_entries.async_update_entry(entry, options=opts)
        return
    tl_id = slug_timelapse_id(cam or "timelapse")
    name = ""
    if cam:
        st = hass.states.get(cam)
        name = (st.attributes.get("friendly_name") if st else "") or cam.split(".")[-1]
    inst = {
        TL_NAME: name or tl_id,
        TL_CAMERA: cam or "",
        # KEEP the legacy folder exactly — existing frames stay reachable. (New
        # instances default to /media/sf_timelapse/<tl_id>; the legacy one didn't.)
        TL_DIR: merged.get(CONF_TIMELAPSE_DIR) or DEFAULT_TIMELAPSE_DIR,
        TL_INTERVAL: int(merged.get(CONF_TIMELAPSE_INTERVAL, DEFAULT_TIMELAPSE_INTERVAL)),
        TL_RETENTION: int(merged.get(CONF_TIMELAPSE_RETENTION, DEFAULT_TIMELAPSE_RETENTION)),
        TL_ENABLED: bool(merged.get(CONF_TIMELAPSE_ENABLED, False)),
        TL_OVERLAY: bool(merged.get(CONF_TIMELAPSE_OVERLAY, False)),
        TL_OVERLAY_BURN: bool(merged.get(CONF_TIMELAPSE_OVERLAY_BURN, False)),
        TL_OVERLAY_PANEL: merged.get(CONF_TIMELAPSE_OVERLAY_PANEL, "") or "",
        TL_OVERLAY_FIELDS: list(merged.get(CONF_TIMELAPSE_OVERLAY_FIELDS,
                                           DEFAULT_TIMELAPSE_OVERLAY_FIELDS)),
    }
    opts[CONF_TIMELAPSE_INSTANCES] = {tl_id: inst}
    hass.config_entries.async_update_entry(entry, options=opts)
    # Carry the legacy persisted intent/session onto the per-instance store so the
    # migrated time-lapse resumes the SAME session after this update.
    try:
        from homeassistant.helpers.storage import Store
        legacy = Store(hass, 1, f"sf_timelapse_{entry.entry_id}")
        data = await legacy.async_load()
        if data:
            await Store(hass, 1, f"sf_timelapse_{entry.entry_id}_{tl_id}").async_save(data)
    except Exception:  # noqa: BLE001 - resume is best-effort
        pass


def _integration_version() -> str:
    """Read this integration's version from its manifest."""
    try:
        import json as _json
        import os as _os
        mf = _os.path.join(_os.path.dirname(__file__), "manifest.json")
        return _json.load(open(mf, encoding="utf-8")).get("version", "dev")
    except Exception:
        return "dev"


def _apply_diag_options(hass: HomeAssistant, cfg: dict) -> None:
    """Start/stop the dedicated diagnostic log per current options.

    v3.19.90: a single toggle (CONF_DIAG_PER_BOOT) both enables logging and
    writes a self-identifying file per restart (version + date/time). The old
    separate 'Enable diagnostic log' switch was removed."""
    if cfg.get(CONF_DIAG_PER_BOOT, False):
        path = cfg.get(CONF_DIAG_PATH) or DEFAULT_DIAG_PATH
        if not path.startswith("/"):
            path = hass.config.path(path)
        from .diag import per_boot_path
        path = per_boot_path(path, _integration_version())
        days = int(cfg.get(CONF_DIAG_DAYS, DEFAULT_DIAG_DAYS))
        if not DIAG.enabled or DIAG.path != path or DIAG.days != days:
            DIAG.setup(path, days)
            _LOGGER.info(
                "Spider Farmer diagnostic log enabled: %s (keep %d days)",
                path, days,
            )
    elif DIAG.enabled:
        DIAG.shutdown()
        _LOGGER.info("Spider Farmer diagnostic log disabled")


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Apply option changes live without reloading the integration."""
    data = hass.data.get(DOMAIN, {}).get(entry.entry_id, {})
    proxy: MITMProxy | None = data.get(DATA_PROXY)
    bus = data.get(DATA_BUS)
    if proxy is None:
        await hass.config_entries.async_reload(entry.entry_id)
        return
    cfg = {**entry.data, **(entry.options or {})}
    await hass.async_add_executor_job(_apply_diag_options, hass, cfg)
    # NB: do NOT re-register the dashboard cards here. Card registration happens
    # once at setup; re-doing it on every options change made the frontend reload
    # the cards on each PPFD auto-save (a card_options write), which looked like
    # the 3D view "locking up" mid-slider. (v3.19.191)
    new_allow = bool(cfg.get(CONF_ALLOW_CONTROL, False))
    if proxy.allow_control != new_allow:
        proxy.allow_control = new_allow
        _LOGGER.info(
            "Spider Farmer Bridge: device control %s",
            "enabled" if new_allow else "disabled",
        )
    # Live-apply the offline timeout (no reload). (v3.19.320)
    new_to = float(cfg.get(CONF_OFFLINE_TIMEOUT, DEFAULT_OFFLINE_TIMEOUT) or 0)
    if proxy.offline_timeout != new_to:
        proxy.offline_timeout = new_to
        _LOGGER.info("Spider Farmer Bridge: offline timeout = %.0fs%s",
                     new_to, " (disabled)" if new_to <= 0 else "")
    new_block = bool(cfg.get(CONF_BLOCK_CLOUD, False))
    if proxy.block_cloud != new_block:
        proxy.block_cloud = new_block
        _LOGGER.info(
            "Spider Farmer Bridge: block cloud %s — reconnecting devices",
            "enabled (local-only)" if new_block else "disabled (relay to cloud)",
        )
        # Mode is chosen at connect time — sever sessions so each controller
        # reconnects into the new (local-only or relay) path within seconds.
        proxy.close_all_sessions()
    # Keep-offline: previously only read at setup, so unchecking "Keep offline
    # devices" did nothing until a full restart (v3.19.250 fix). Apply live —
    # once False, prune_blocks (called on each device report) removes phantom
    # accessory BLOCKS on the next report cycle, and prune_offline_devices()
    # removes whole devices that aren't connected right now (v3.19.304 — closes
    # the gap where an unplugged/removed controller lingered on the device page
    # until manually deleted).
    if bus is not None:
        new_keep = bool(cfg.get(CONF_KEEP_OFFLINE, True))
        if bus.keep_offline != new_keep:
            bus.keep_offline = new_keep
            _LOGGER.info(
                "Spider Farmer Bridge: keep offline devices %s%s",
                "enabled" if new_keep else "disabled",
                "" if new_keep else " — pruning phantom blocks + offline devices",
            )
            if not new_keep:
                bus.prune_offline_devices()
        # External-sensor mirroring — apply live so the card's Temperature
        # source picker (via sf.set_strip_sensor) takes effect without a reload.
        bus.apply_strip_sensors(cfg.get(CONF_STRIP_SENSORS) or {})
        # Smart control — apply live so the card's enable/tuning takes effect.
        bus.apply_smart_control(cfg.get(CONF_SMART_CONTROL) or {})
        # Env outlet control — apply live so an outlet mode change takes effect.
        bus.apply_outlet_env(cfg.get(CONF_OUTLET_ENV) or {})
    # Time-lapse: reconcile controllers to the instances set live (add/remove
    # cards). The configure service already applies the instance it changed; this
    # only keeps the controller set + status sensors in step for any other writer.
    # It never re-applies (restarts) existing captures, so unrelated option writes
    # (PPFD autosave, card_options) can't disturb a running time-lapse. (v3.19.362)
    mgr = data.get("timelapse")
    if mgr is not None and mgr.sync():
        mgr.notify_instances()


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Decide the fate of customizations + recorder data on removal."""
    cfg = {**entry.data, **(entry.options or {})}
    preserve_on_remove = bool(cfg.get(CONF_PRESERVE_ON_REMOVE, True))
    await preserve.handle_removal(hass, entry, preserve_on_remove)


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: ConfigEntry, device_entry
) -> bool:
    """Allow HA's 'delete device' button for devices with no active session.
    The integration never auto-removes a device (a grow tent packed away for
    months is dormant, not gone) — but the user can."""
    data = hass.data.get(DOMAIN, {}).get(entry.entry_id, {})
    proxy = data.get(DATA_PROXY)
    bus = data.get(DATA_BUS)
    for domain, ident in device_entry.identifiers:
        if domain == DOMAIN and ident.startswith("ggs_"):
            mac = ident[4:]
            severed = False
            if proxy is not None:
                severed = proxy.close_session(mac)
            if bus is not None:
                bus.forget_device(mac)
            if severed:
                _LOGGER.info(
                    "Deleted device %s while connected — session severed; the "
                    "device will re-register with fresh entities when it "
                    "reconnects (power it off first for permanent removal)",
                    mac,
                )
            elif bus is not None:
                # Offline delete = permanent removal: wipe every stored trace
                # (device_slots, components, per-mac runtime dicts) so nothing
                # lingers as "unknown device" in the config screens. A connected
                # delete keeps the slot so the device returns unchanged. (v3.19.306)
                bus.purge_device_slots({mac})
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    data = hass.data.get(DOMAIN, {}).pop(entry.entry_id, {})
    bus = data.get(DATA_BUS)
    if bus is not None:
        bus.stop_grace()
    proxy = data.get(DATA_PROXY)
    if proxy is not None:
        # Sever device connections so they reconnect to the reloaded
        # instance instead of relaying into this dead one.
        proxy.close_all_sessions()
    stop: asyncio.Event | None = data.get("stop_event")
    if stop:
        stop.set()
    # Release the listen port NOW (3.19.94): close the listener and wait for
    # it to fully release, otherwise a reload's start_server hits "address
    # already in use" and the integration can't rebind until HA is restarted.
    server = data.get("server")
    if server is not None:
        server.close()
        try:
            await server.wait_closed()
        except Exception:  # noqa: BLE001 — never block unload on socket teardown
            pass
    task = data.get(DATA_PROXY_TASK)
    if task and not task.done():
        task.cancel()
        try:
            await task
        except (asyncio.CancelledError, Exception):
            pass
    # Refresh the preservation snapshot while entities still exist, so a
    # subsequent removal has an up-to-date copy to keep. Skipped when the
    # user unchecked preservation — no config/sf/ folder gets created.
    cfg = {**entry.data, **(entry.options or {})}
    if cfg.get(CONF_PRESERVE_ON_REMOVE, True):
        await hass.async_add_executor_job(
            preserve.write_snapshot, hass, entry.entry_id
        )
    await hass.async_add_executor_job(DIAG.shutdown)
    return unload_ok
