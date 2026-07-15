"""Sensor platform — Spider Farmer Bridge v3."""
from __future__ import annotations

import logging

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

_LOGGER = logging.getLogger(__name__)

PLATFORM = "sensor"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(SfSensor(bus, d) for d in defs)

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


class SfSensor(SfEntity, SensorEntity):
    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_native_value = None
        if d.unit:
            self._attr_native_unit_of_measurement = d.unit
        if d.device_class:
            self._attr_device_class = SensorDeviceClass(d.device_class)
        if d.state_class:
            self._attr_state_class = SensorStateClass(d.state_class)
        if d.options:
            self._attr_options = list(d.options)
        if d.precision is not None:
            self._attr_suggested_display_precision = d.precision

    @property
    def _is_numeric(self) -> bool:
        return self.d.state_class == "measurement" and not self.d.options

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        payload = (payload or "").strip()
        if not payload:
            self._attr_native_value = None
            return
        if self._is_numeric:
            # Validate, but keep the raw string — the device sends the
            # sensors did, so "61.0" stays "61.0" and "850" stays "850".
            try:
                float(payload)
                self._attr_native_value = payload
            except ValueError:
                _LOGGER.debug("%s: non-numeric payload %r", self.entity_id, payload)
                self._attr_native_value = None
        else:
            if self.d.options and payload not in self.d.options:
                _LOGGER.warning(
                    "%s: value %r not in enum options %s — ignoring",
                    self.entity_id, payload, self.d.options,
                )
                return
            self._attr_native_value = payload
