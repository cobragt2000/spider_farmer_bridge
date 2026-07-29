"""Config flow for Spider Farmer Bridge."""
from __future__ import annotations

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
    DOMAIN,
    CONF_LISTEN_PORT,
    CONF_UPSTREAM_HOST,
    CONF_UPSTREAM_PORT,
    DEFAULT_LISTEN_PORT,
    DEFAULT_UPSTREAM_HOST,
    DEFAULT_UPSTREAM_PORT,
    CONF_ALLOW_CONTROL,
    CONF_DIAG_PER_BOOT,
    CONF_ENV_ENTITIES,
    CONF_KEEP_OFFLINE,
    CONF_DIAG_LOG,
    CONF_DIAG_PATH,
    DEFAULT_DIAG_PATH,
    CONF_DIAG_DAYS,
    DEFAULT_DIAG_DAYS,
    CONF_PRESERVE_ON_REMOVE,
    CONF_INSTALL_CARD,
)

# The upstream (Spider Farmer cloud) host/port are protocol constants — the
# devices always dial sf.mqtt.spider-farmer.com:8883. They're shown read-only
# so users can see them but can't break the relay by editing them. read_only
# selectors need HA 2024.8+, so fall back to plain editable fields on older
# cores (the value is still the correct constant).
def _readonly_text():
    try:
        return selector.TextSelector(
            selector.TextSelectorConfig(read_only=True)  # type: ignore[typeddict-unknown-key]
        )
    except (vol.Invalid, TypeError, ValueError):
        return str


def _readonly_port():
    try:
        return selector.NumberSelector(
            selector.NumberSelectorConfig(  # type: ignore[typeddict-unknown-key]
                min=1, max=65535, mode=selector.NumberSelectorMode.BOX, read_only=True
            )
        )
    except (vol.Invalid, TypeError, ValueError):
        return vol.All(int, vol.Range(min=1, max=65535))


def _base_schema(current: dict) -> vol.Schema:
    """Setup/settings fields shared by initial config and the options flow.
    Built at call time (not import) so the read_only selectors are only
    validated against the running HA, never at module import."""
    return vol.Schema({
        vol.Required(
            CONF_LISTEN_PORT,
            default=current.get(CONF_LISTEN_PORT, DEFAULT_LISTEN_PORT),
        ): vol.All(int, vol.Range(min=1, max=65535)),
        vol.Required(
            CONF_UPSTREAM_HOST,
            default=current.get(CONF_UPSTREAM_HOST, DEFAULT_UPSTREAM_HOST),
        ): _readonly_text(),
        vol.Required(
            CONF_UPSTREAM_PORT,
            default=current.get(CONF_UPSTREAM_PORT, DEFAULT_UPSTREAM_PORT),
        ): _readonly_port(),
        vol.Required(
            CONF_ALLOW_CONTROL,
            default=current.get(CONF_ALLOW_CONTROL, False),
        ): bool,
        vol.Required(
            CONF_KEEP_OFFLINE,
            default=current.get(CONF_KEEP_OFFLINE, True),
        ): bool,
        vol.Required(
            CONF_ENV_ENTITIES,
            default=current.get(CONF_ENV_ENTITIES, True),
        ): bool,
    })


class SfBridgeConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Single-step setup — certs are bundled, nothing to configure manually."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(
                title="Spider Farmer Bridge",
                data=user_input,
            )

        return self.async_show_form(
            step_id="user",
            data_schema=_base_schema({}),
            description_placeholders={"port": str(DEFAULT_LISTEN_PORT)},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return SfBridgeOptionsFlow(config_entry)


class SfBridgeOptionsFlow(config_entries.OptionsFlow):
    """Reconfigure after initial setup + device replacement migration."""

    def __init__(self, config_entry):
        self._entry = config_entry

    async def async_step_init(self, user_input=None):
        # Labels provided inline — immune to HA's translation caching,
        # which only reloads custom-integration strings at core startup.
        return self.async_show_menu(
            step_id="init",
            menu_options={
                "settings": "Settings (ports, control, diagnostic log)",
                "mappings": "Device mappings (logical slots for entity IDs)",
                "lights": "Hide Light 2 (panels with a phantom 2nd light)",
                "migrate": "Migrate device (replace hardware, keep history)",
                "replace_soil": "Replace soil probe (swap hardware, keep history)",
            },
        )

    async def async_step_settings(self, user_input=None):
        current = {**self._entry.data, **(self._entry.options or {})}

        if user_input is not None:
            # MERGE into existing options — returning only the form fields
            # would wipe keys other steps own (device_slots!), since HA
            # replaces entry.options wholesale with this payload.
            return self.async_create_entry(
                title="",
                data={**(self._entry.options or {}), **user_input},
            )

        # Ports + Spider Farmer cloud host/port (host/port are read-only).
        schema = _base_schema(current).extend({
            vol.Required(
                CONF_INSTALL_CARD,
                default=current.get(CONF_INSTALL_CARD, False),
            ): bool,
            vol.Required(
                CONF_PRESERVE_ON_REMOVE,
                default=current.get(CONF_PRESERVE_ON_REMOVE, True),
            ): bool,
            vol.Required(
                CONF_DIAG_LOG,
                default=current.get(CONF_DIAG_LOG, False),
            ): bool,
            # Version-tagged per-restart log file — kept directly under the
            # "Enable diagnostic log" toggle it belongs with.
            vol.Required(
                CONF_DIAG_PER_BOOT,
                default=current.get(CONF_DIAG_PER_BOOT, True),
            ): bool,
            vol.Required(
                CONF_DIAG_PATH,
                default=current.get(CONF_DIAG_PATH, DEFAULT_DIAG_PATH),
            ): str,
            vol.Required(
                CONF_DIAG_DAYS,
                default=current.get(CONF_DIAG_DAYS, DEFAULT_DIAG_DAYS),
            ): vol.In(list(range(1, 31))),
        })

        return self.async_show_form(step_id="settings", data_schema=schema)

    async def async_step_lights(self, user_input=None):
        """Hide the phantom "Light 2" channel on panels that only have one
        physical light. When hidden the integration never creates the
        light.sf_<panel>_light_2 entity (nor its light_2_* settings), and any
        already-created ones are removed. Stored per-MAC in the config entry:
        options["card_options"][mac]["hide_light2"]."""
        from homeassistant.helpers import (
            device_registry as dr,
            entity_registry as er_mod,
        )

        slots = dict((self._entry.options or {}).get("device_slots", {}))
        card_opts = dict((self._entry.options or {}).get("card_options", {}))

        # Candidate panels = anything that has a light channel (light_1/2).
        ent_reg = er_mod.async_get(self.hass)
        light_macs: set[str] = set()
        for e in ent_reg.entities.values():
            if e.platform != DOMAIN:
                continue
            uid = e.unique_id or ""
            if uid.startswith("ggs_") and (
                uid.endswith("_light_1") or uid.endswith("_light_2")
            ):
                light_macs.add(uid[4:].rsplit("_light_", 1)[0])

        if not light_macs:
            return self.async_abort(reason="no_lights")

        dev_reg = dr.async_get(self.hass)
        names: dict[str, str] = {}
        for device in dr.async_entries_for_config_entry(
            dev_reg, self._entry.entry_id
        ):
            for domain, ident in device.identifiers:
                if domain == DOMAIN and ident.startswith("ggs_"):
                    names[ident[4:]] = device.name_by_user or device.name

        def _hidden(mac: str) -> bool:
            return str(
                card_opts.get(mac, {}).get("hide_light2")
            ) in ("1", "true", "True", "on")

        if user_input is not None:
            selected = set(user_input.get("hide", []))
            new_card = {m: dict(v) for m, v in card_opts.items()}
            newly_hidden = []
            for mac in light_macs:
                opt = new_card.setdefault(mac, {})
                if mac in selected:
                    if not _hidden(mac):
                        newly_hidden.append(mac)
                    opt["hide_light2"] = "1"
                else:
                    opt["hide_light2"] = "0"
            self.hass.config_entries.async_update_entry(
                self._entry,
                options={**(self._entry.options or {}), "card_options": new_card},
            )
            # Tear down already-registered Light 2 entities right away.
            data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
            bus = data.get("bus")
            if bus is not None:
                for mac in newly_hidden:
                    bus.prune_light2({"mac": mac, "type": bus._type_for_mac(mac)})
            self.hass.async_create_task(
                self.hass.config_entries.async_reload(self._entry.entry_id)
            )
            return self.async_create_entry(
                title="", data=dict(self._entry.options or {})
            )

        options = [
            selector.SelectOptionDict(
                value=mac,
                label=f"{slots.get(mac, mac)} — {names.get(mac, 'panel')}",
            )
            for mac in sorted(light_macs, key=lambda m: slots.get(m, m))
        ]
        default_hidden = [m for m in light_macs if _hidden(m)]
        schema = vol.Schema({
            vol.Optional("hide", default=default_hidden): selector.SelectSelector(
                selector.SelectSelectorConfig(options=options, multiple=True)
            ),
        })
        return self.async_show_form(step_id="lights", data_schema=schema)

    async def async_step_mappings(self, user_input=None):
        """View/edit the logical slot assigned to each device. Slots drive
        entity_ids (sf_dp1_temperature); display names are untouched."""
        from homeassistant.helpers import device_registry as dr

        slots = dict((self._entry.options or {}).get("device_slots", {}))
        soil_slots = dict((self._entry.options or {}).get("soil_slots", {}))

        # serial -> attached CB (mac + cb slot), from registry unique_ids
        from homeassistant.helpers import entity_registry as er_mod
        ent_reg = er_mod.async_get(self.hass)
        soil_cb: dict = {}
        for e in ent_reg.entities.values():
            if e.platform != DOMAIN:
                continue
            uid = e.unique_id or ""
            if uid.startswith("ggs_") and "_soil_" in uid:
                mac_part = uid[4:].split("_soil_", 1)[0]
                body = uid[4 + len(mac_part) + len("_soil_"):]
                serial, _, sfx = body.rpartition("_")
                if sfx in ("temperature", "moisture", "ec"):
                    soil_cb[serial.lower()] = slots.get(mac_part, "")

        def scoped(serial: str, soil_slot: str) -> str:
            cb = soil_cb.get(serial, "")
            return f"{cb}_{soil_slot}" if cb else soil_slot

        dev_reg = dr.async_get(self.hass)
        names = {}
        for device in dr.async_entries_for_config_entry(
            dev_reg, self._entry.entry_id
        ):
            for domain, ident in device.identifiers:
                if domain == DOMAIN and ident.startswith("ggs_"):
                    names[ident[4:]] = device.name_by_user or device.name

        errors = {}
        if user_input is not None:
            import re
            new_devices, new_soil, retired = {}, {}, []
            prefix_error = False
            all_cb_slots = set(slots.values())
            for key, v in user_input.items():
                v = str(v).strip().lower()
                if key.startswith("soil:"):
                    serial = key[5:]
                    if v == "":
                        retired.append(serial)   # blank = retire the probe
                        continue
                    own_cb = soil_cb.get(serial, "")
                    if own_cb and v.startswith(f"{own_cb}_"):
                        v = v[len(own_cb) + 1:]   # strip the probe's own CB
                    else:
                        # Typing a DIFFERENT CB's prefix isn't a move —
                        # probes follow their physical port.
                        for cb in all_cb_slots:
                            if cb != own_cb and v.startswith(f"{cb}_"):
                                prefix_error = True
                    if v:
                        new_soil[serial] = v
                    else:
                        retired.append(serial)
                else:
                    new_devices[key] = v
            values = list(new_devices.values()) + list(new_soil.values())
            dev_vals = list(new_devices.values())
            per_cb: dict = {}
            for serial, v in new_soil.items():
                per_cb.setdefault(soil_cb.get(serial, "?"), []).append(v)
            soil_dupe = any(len(vs) != len(set(vs)) for vs in per_cb.values())
            if prefix_error:
                errors["base"] = "wrong_cb_prefix"
            elif any(not re.fullmatch(r"[a-z0-9_]+", v) for v in values) or \
                 any(v == "" for v in new_devices.values()):
                errors["base"] = "bad_slot"
            elif len(set(dev_vals)) != len(dev_vals) or soil_dupe:
                errors["base"] = "duplicate_slot"
            else:
                merged_soil = {
                    k: v for k, v in {**soil_slots, **new_soil}.items()
                    if k not in retired
                }
                self.hass.config_entries.async_update_entry(
                    self._entry,
                    options={
                        **(self._entry.options or {}),
                        "device_slots": {**slots, **new_devices},
                        "soil_slots": merged_soil,
                    },
                )
                # Retire probes (removes their entities) before reconciling
                data = self.hass.data.get(DOMAIN, {}).get(
                    self._entry.entry_id, {}
                )
                bus = data.get("bus")
                if bus is not None:
                    for serial in retired:
                        bus.retire_soil(serial)
                # Reconcile NOW, synchronously against the registry — swaps
                # apply deterministically, not on a reload timer.
                from .bus import reconcile_registry_to_slots
                reconcile_registry_to_slots(
                    self.hass, {**slots, **new_devices}, merged_soil
                )
                self.hass.async_create_task(
                    self.hass.config_entries.async_reload(self._entry.entry_id)
                )
                return self.async_create_entry(
                    title="", data=dict(self._entry.options or {})
                )

        if not slots and not soil_slots:
            return self.async_abort(reason="no_devices")

        schema_fields = {
            vol.Required(mac, default=slot): str
            for mac, slot in sorted(slots.items(), key=lambda kv: kv[1])
        }
        for serial, slot in sorted(
            soil_slots.items(), key=lambda kv: scoped(kv[0], kv[1])
        ):
            schema_fields[
                vol.Optional(f"soil:{serial}", default=scoped(serial, slot))
            ] = str
        schema = vol.Schema(schema_fields)

        soil_types = dict((self._entry.options or {}).get("soil_types", {}))

        def _kind(serial: str) -> str:
            k = soil_types.get(serial.lower())
            return f"[{k}] " if k else ""

        mapping_lines = "\n".join(
            f"{slot}  =  {names.get(mac, 'unknown device')}  ({mac})"
            for mac, slot in sorted(slots.items(), key=lambda kv: kv[1])
        ) + "\n" + "\n".join(
            f"{scoped(serial, slot)}  =  {_kind(serial)}Soil probe {serial}"
            for serial, slot in sorted(
                soil_slots.items(), key=lambda kv: scoped(kv[0], kv[1])
            )
        )
        return self.async_show_form(
            step_id="mappings",
            data_schema=schema,
            errors=errors,
            description_placeholders={"mappings": mapping_lines},
        )

    async def async_step_replace_soil(self, user_input=None):
        """One-step soil probe replace: the NEW probe takes the OLD probe's
        slot (so entity_ids and history continue), and the old probe is
        retired. Both probes must have reported at least once."""
        soil_slots = dict((self._entry.options or {}).get("soil_slots", {}))
        soil_types = dict((self._entry.options or {}).get("soil_types", {}))

        # serial -> attached CB slot (for scoped labels / same-CB check)
        from homeassistant.helpers import entity_registry as er_mod
        ent_reg = er_mod.async_get(self.hass)
        slots = dict((self._entry.options or {}).get("device_slots", {}))
        soil_cb: dict = {}
        for e in ent_reg.entities.values():
            if e.platform != DOMAIN:
                continue
            uid = e.unique_id or ""
            if uid.startswith("ggs_") and "_soil_" in uid:
                mac_part = uid[4:].split("_soil_", 1)[0]
                body = uid[4 + len(mac_part) + len("_soil_"):]
                serial, _, sfx = body.rpartition("_")
                if sfx in ("temperature", "moisture", "ec"):
                    soil_cb[serial.lower()] = slots.get(mac_part, "")

        def label(serial: str) -> str:
            k = soil_types.get(serial.lower())
            tag = f"[{k}] " if k else ""
            sl = soil_slots.get(serial, "?")
            cb = soil_cb.get(serial.lower(), "")
            scoped = f"{cb}_{sl}" if cb else sl
            return f"{tag}{scoped} — {serial}"

        errors = {}
        if user_input is not None:
            old_s = user_input["old_probe"]
            new_s = user_input["new_probe"]
            if old_s == new_s:
                errors["base"] = "same_probe"
            elif soil_cb.get(old_s.lower()) != soil_cb.get(new_s.lower()):
                # Physical replacement is same port/CB; different CBs would
                # change the entity_id prefix and not preserve history.
                errors["base"] = "different_cb"
            else:
                old_slot = soil_slots.get(old_s)
                data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
                bus = data.get("bus")
                # New probe inherits the old probe's slot; old is retired.
                soil_slots[new_s] = old_slot
                soil_slots.pop(old_s, None)
                soil_types.pop(old_s.lower(), None)
                self.hass.config_entries.async_update_entry(
                    self._entry,
                    options={**(self._entry.options or {}),
                             "soil_slots": soil_slots,
                             "soil_types": soil_types},
                )
                if bus is not None:
                    bus.retire_soil(old_s)
                    bus._soil_cache[new_s] = old_slot
                from .bus import reconcile_registry_to_slots
                reconcile_registry_to_slots(self.hass, slots, soil_slots)
                self.hass.async_create_task(
                    self.hass.config_entries.async_reload(self._entry.entry_id)
                )
                return self.async_create_entry(
                    title="", data=dict(self._entry.options or {})
                )

        if len(soil_slots) < 2:
            return self.async_abort(reason="need_two_probes")

        options = [
            selector.SelectOptionDict(value=serial, label=label(serial))
            for serial in sorted(soil_slots, key=lambda x: label(x))
        ]
        schema = vol.Schema({
            vol.Required("old_probe"): selector.SelectSelector(
                selector.SelectSelectorConfig(options=options)
            ),
            vol.Required("new_probe"): selector.SelectSelector(
                selector.SelectSelectorConfig(options=options)
            ),
        })
        return self.async_show_form(
            step_id="replace_soil", data_schema=schema, errors=errors,
            description_placeholders={},
        )

    async def async_step_migrate(self, user_input=None):
        """Replace a device: move the old device's entity identities
        (entity_ids, history, automations) onto its replacement, then
        remove the old device."""
        errors = {}
        if user_input is not None:
            old_id = user_input["old_device"]
            new_id = user_input["new_device"]
            if old_id == new_id:
                errors["base"] = "same_device"
            else:
                from .migrate import migrate_device

                migrated, migrate_errors = migrate_device(
                    self.hass, old_id, new_id, entry=self._entry
                )
                if any("type mismatch" in e for e in migrate_errors):
                    errors["base"] = "type_mismatch"
                elif migrate_errors:
                    errors["base"] = "migration_failed"
                elif migrated == 0:
                    errors["base"] = "nothing_to_migrate"
                else:
                    # Reload so live entities rebind to migrated identities
                    self.hass.async_create_task(
                        self.hass.config_entries.async_reload(
                            self._entry.entry_id
                        )
                    )
                    return self.async_create_entry(
                        title="", data=dict(self._entry.options or {})
                    )

        schema = vol.Schema({
            vol.Required("old_device"): selector.DeviceSelector(
                selector.DeviceSelectorConfig(integration=DOMAIN)
            ),
            vol.Required("new_device"): selector.DeviceSelector(
                selector.DeviceSelectorConfig(integration=DOMAIN)
            ),
        })
        return self.async_show_form(
            step_id="migrate", data_schema=schema, errors=errors
        )
