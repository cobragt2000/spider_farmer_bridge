"""
entity.py — Spider Farmer Bridge
=================================
Base class for all native entities.

Entity ID
---------
Each entity's id is the slot-based slug (e.g. sensor.sf_dp1_temperature),
computed here and assigned to ``self.entity_id`` directly so it is fully
deterministic rather than left to HA's slugify.

State restore
-------------
RestoreEntity brings an entity back with its last state after an HA restart;
it goes live again on the next device report.
"""
from __future__ import annotations

import logging
from typing import Optional

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.util import slugify

from .bus import SfBus
from .const import (
    DOMAIN,
    SIGNAL_AVAILABILITY,
    SIGNAL_DEVICE_AVAIL_FMT,
    SIGNAL_REMOVE_FMT,
    SIGNAL_STATE_FMT,
)
from .entity_defs import SfDef

_LOGGER = logging.getLogger(__name__)


class SfEntity(RestoreEntity):
    """Common behaviour for every Spider Farmer Bridge entity."""

    _attr_should_poll = False
    _attr_has_entity_name = True

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        self.bus = bus
        self.d = d
        self._attr_unique_id = d.unique_id
        self._attr_name = d.name
        if d.icon:
            self._attr_icon = d.icon

        # Force the logical-slot entity_id (v3.1.0): sensor.sf_dp1_temperature
        self.entity_id = f"{self._platform_domain()}.{d.expected_object_id}"
        # Ownership tag (v3.2.3): lets restore verify a cached state under
        # this entity_id actually came from THIS device — after a slot swap
        # the id's cached state may belong to the other device.
        self._attr_extra_state_attributes = {"sf_device": d.mac}

    @property
    def device_info(self) -> DeviceInfo:
        """Computed live so a retype (LC -> CB) is reflected the moment the
        bus repairs the registry — a re-added entity can never write a
        stale device name/model back into the device registry."""
        if self.d.device_key:
            # A sub-device (e.g. Environment): its own card, but linked to the
            # controller via via_device so HA nests it under the panel.
            return DeviceInfo(
                identifiers={(DOMAIN, f"ggs_{self.d.mac}_{self.d.device_key}")},
                name=self.d.device_name,
                manufacturer="Spider Farmer",
                model=self.d.device_model,
                via_device=(DOMAIN, f"ggs_{self.d.mac}"),
            )
        name, model = self.bus.device_display.get(
            self.d.mac, (self.d.device_name, self.d.device_model)
        )
        info = DeviceInfo(
            identifiers={(DOMAIN, f"ggs_{self.d.mac}")},
            name=name,
            manufacturer="Spider Farmer",
            model=model,
        )
        # Nest a power strip under the display panel that hosts it (the panel
        # reports the strip's ps5/ps10 block); standalone strips stay top-level.
        host = self.bus.host_cb_mac_for_strip(self.d.mac)
        if host:
            info["via_device"] = (DOMAIN, f"ggs_{host}")
        return info

    def _platform_domain(self) -> str:
        return self.d.platform

    # ── Topics this entity listens to (subclasses may extend) ─────────────

    @property
    def state_topics(self) -> list[str]:
        return [self.d.state_topic]

    # ── Lifecycle ──────────────────────────────────────────────────────────

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()

        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_AVAILABILITY, self._availability_changed
            )
        )
        # v3.11.1a: dynamic hide — the bus asks this entity to remove itself
        # when its outlet leaves the mode it belongs to.
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                SIGNAL_REMOVE_FMT.format(self.d.unique_id),
                self._async_dynamic_remove,
            )
        )
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                SIGNAL_DEVICE_AVAIL_FMT.format(self.d.mac),
                self._availability_changed,
            )
        )
        for topic in self.state_topics:
            self.async_on_remove(
                async_dispatcher_connect(
                    self.hass,
                    SIGNAL_STATE_FMT.format(topic),
                    self._make_topic_handler(topic),
                )
            )

        # Seed: live cache first (device already reported), else restore.
        seeded = False
        for topic in self.state_topics:
            cached = self.bus.cached(topic)
            if cached is not None:
                self._handle_payload(topic, cached)
                seeded = True
        if not seeded:
            last = await self.async_get_last_state()
            if last is not None and last.state not in ("unknown", "unavailable"):
                # Restore ONLY states this device wrote. A slot swap moves
                # entity_ids between devices; the restore cache is keyed by
                # entity_id, so without this check a device resurrects the
                # OTHER device's last values as its own.
                if last.attributes.get("sf_device") == self.d.mac:
                    self._restore(last)
                else:
                    _LOGGER.debug(
                        "%s: skipping restore of foreign/legacy state",
                        self.entity_id,
                    )

        self.async_write_ha_state()

    def _make_topic_handler(self, topic: str):
        @callback
        def _handler(payload: str) -> None:
            self._handle_payload(topic, payload)
            self.async_write_ha_state()
        return _handler

    @callback
    def _availability_changed(self) -> None:
        self.async_write_ha_state()

    @callback
    def _async_dynamic_remove(self) -> None:
        self.hass.async_create_task(self.async_remove())

    @property
    def available(self) -> bool:
        return self.bus.available and self.bus.device_online(self.d.mac)

    # ── Subclass hooks ─────────────────────────────────────────────────────

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        raise NotImplementedError

    @callback
    def _restore(self, last) -> None:
        """Repopulate state from HA's restore cache. Default: feed the last
        state string through the normal payload handler."""
        self._handle_payload(self.d.state_topic, last.state)

    # ── Command helper ─────────────────────────────────────────────────────

    async def _command(self, payload: str, subfield: Optional[str] = None) -> None:
        field = self.d.command_field or self.d.field
        topic = (
            f"ggs/ha/{self.d.mac}/{field}/{subfield}/set"
            if subfield
            else f"ggs/ha/{self.d.mac}/{field}/set"
        )
        await self.bus.async_command(topic, payload)
