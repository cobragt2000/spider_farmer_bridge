"""Binary sensor platform — Spider Farmer Bridge v3."""
from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

PLATFORM = "binary_sensor"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(SfBinarySensor(bus, d) for d in defs)

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


class SfBinarySensor(SfEntity, BinarySensorEntity):
    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_is_on = None

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        payload = (payload or "").strip().upper()
        if payload in ("ON", "OFF"):
            self._attr_is_on = payload == "ON"

    @callback
    def _restore(self, last) -> None:
        self._attr_is_on = last.state == "on"
