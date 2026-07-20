"""Spider Farmer Bridge — v3, native HA entities (no MQTT)."""
from __future__ import annotations

import asyncio
import logging
import ssl

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .bus import SfBus
from .diag import DIAG
from . import preserve
from .cert_manager import ensure_certs, cert_paths, upstream_ca_path
from .const import (
    DOMAIN, CONF_LISTEN_PORT, CONF_UPSTREAM_HOST, CONF_UPSTREAM_PORT,
    DEFAULT_LISTEN_PORT, DEFAULT_UPSTREAM_HOST, DEFAULT_UPSTREAM_PORT,
    CONF_ALLOW_CONTROL, CONF_DIAG_PER_BOOT, CONF_ENV_ENTITIES,
    CONF_KEEP_OFFLINE, DATA_BUS,
    DATA_PROXY, DATA_PROXY_TASK, PLATFORMS,
    CONF_DIAG_LOG, CONF_DIAG_PATH, DEFAULT_DIAG_PATH,
    CONF_DIAG_DAYS, DEFAULT_DIAG_DAYS, CONF_PRESERVE_ON_REMOVE,
    CONF_INSTALL_CARD,
)
from .entity_defs import HA_STATUS_TOPIC
from .proxy.mitm_proxy import MITMProxy

_LOGGER = logging.getLogger(__name__)

# Background config sync interval — not exposed in UI
_POLL_INTERVAL_SEC = 600


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    # One-time migration: the diagnostic log default has moved twice
    # (sf_bridge/ -> sf/logs/ -> custom_components/sf/logs/). Rewrite only
    # stale *defaults* — never a path the user set deliberately.
    if (entry.options or {}).get(CONF_DIAG_PATH) in (
        "sf_bridge/diagnostic.log",
        "sf/logs/diagnostic.log",
    ):
        hass.config_entries.async_update_entry(
            entry,
            options={**entry.options, CONF_DIAG_PATH: DEFAULT_DIAG_PATH},
        )
        _LOGGER.info(
            "Migrated diagnostic log path to %s", DEFAULT_DIAG_PATH
        )

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
    bus.env_entities = bool(cfg.get(CONF_ENV_ENTITIES, True))

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
    bus.proxy = proxy

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        DATA_BUS:   bus,
        DATA_PROXY: proxy,
    }

    # ── Platforms first, so entity listeners exist before any device data ──
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    _async_register_services(hass)

    # v3.9.0: with keep-offline on, resurrect entity objects for everything
    # already in the registry, so powered-off gear survives the restart
    # with restored state instead of vanishing until it next reports.
    bus.restore_registered_entities()

    # If Environment entities are disabled, remove any that a prior run made
    # so they vanish from the UI (and don't get restored above).
    if not bus.env_entities:
        from homeassistant.helpers import entity_registry as er
        ent_reg = er.async_get(hass)
        for e in list(er.async_entries_for_config_entry(ent_reg, entry.entry_id)):
            uid = e.unique_id or ""
            if uid.startswith("ggs_") and "_env_" in uid:
                ent_reg.async_remove(e.entity_id)

    # Bridge is up — retained-"online" parity
    bus.publish(HA_STATUS_TOPIC, "online")

    # Staleness guard: restored entities get a grace window to hear from
    # their device; devices silent past it show unavailable instead of
    # presenting months-old restored values as current.
    bus.start_grace(120)

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
        try:
            async with server:
                await stop_event.wait()
        finally:
            poll_task.cancel()
            try:
                await poll_task
            except asyncio.CancelledError:
                pass
        _LOGGER.info("Spider Farmer Bridge: stopped")

    proxy_task = asyncio.ensure_future(_run_proxy())

    hass.data[DOMAIN][entry.entry_id].update({
        DATA_PROXY_TASK: proxy_task,
        "stop_event":    stop_event,
    })

    # ── Optional bundled Lovelace card (opt-in in Settings) ───────────────
    await _apply_card_option(hass, cfg)

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _apply_card_option(hass: HomeAssistant, cfg: dict) -> None:
    """Install or remove the bundled dashboard cards per the current option."""
    from . import frontend as sf_frontend

    # Read the version off the event loop (manifest.json is a blocking open).
    version = await hass.async_add_executor_job(_integration_version)
    if cfg.get(CONF_INSTALL_CARD, False):
        await sf_frontend.async_register_card(hass, version)
    else:
        await sf_frontend.async_unregister_card(hass, version)


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


_SCHEDULE_SCHEMA = vol.Schema({
    vol.Required("entity_id"): cv.entity_ids,
    vol.Required("periods"): [dict],
})


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

    if not hass.services.has_service(DOMAIN, "set_se_schedule"):
        hass.services.async_register(
            DOMAIN, "set_se_schedule", _set_se_schedule, schema=_SCHEDULE_SCHEMA)
    if not hass.services.has_service(DOMAIN, "set_outlet_schedule"):
        hass.services.async_register(
            DOMAIN, "set_outlet_schedule", _set_outlet_schedule, schema=_SCHEDULE_SCHEMA)


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
    """Start/stop the dedicated diagnostic log per current options."""
    if cfg.get(CONF_DIAG_LOG, False):
        path = cfg.get(CONF_DIAG_PATH) or DEFAULT_DIAG_PATH
        if not path.startswith("/"):
            path = hass.config.path(path)
        # v3.11.2b0: one self-identifying log file per HA boot (version + time)
        if cfg.get(CONF_DIAG_PER_BOOT, True):
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
    if proxy is None:
        await hass.config_entries.async_reload(entry.entry_id)
        return
    cfg = {**entry.data, **(entry.options or {})}
    await hass.async_add_executor_job(_apply_diag_options, hass, cfg)
    await _apply_card_option(hass, cfg)
    new_allow = bool(cfg.get(CONF_ALLOW_CONTROL, False))
    if proxy.allow_control != new_allow:
        proxy.allow_control = new_allow
        _LOGGER.info(
            "Spider Farmer Bridge: device control %s",
            "enabled" if new_allow else "disabled",
        )


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
