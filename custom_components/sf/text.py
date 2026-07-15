"""Text platform — Spider Farmer Bridge (v3.10.2).

HH:MM schedule fields (SE light schedule start/end). State mirrors the
matching reporting topic; writes go through the command handler's
block-preserving setConfigFile builder.
"""
from __future__ import annotations

import logging
import re

from homeassistant.components.text import TextEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

_LOGGER = logging.getLogger(__name__)

PLATFORM = "text"

_HHMM = re.compile(r"^([01]?\d|2[0-3]):[0-5]\d$")


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(SfTimeText(bus, d) for d in defs)

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


class SfTimeText(SfEntity, TextEntity):
    _attr_pattern = r"^([01]?\d|2[0-3]):[0-5]\d$"
    _attr_native_min = 4
    _attr_native_max = 5

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_native_value = None

    @property
    def _state_field(self) -> str:
        f = self.d.field
        return f[:-4] if f.endswith("_set") else f

    @property
    def state_topics(self) -> list[str]:
        return [f"ggs/ha/{self.d.mac}/{self._state_field}/state"]

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        payload = (payload or "").strip()
        if _HHMM.match(payload):
            self._attr_native_value = payload

    @callback
    def _restore(self, last) -> None:
        self._handle_payload("", last.state)

    async def async_set_value(self, value: str) -> None:
        value = value.strip()
        if not _HHMM.match(value):
            _LOGGER.warning("%s: invalid HH:MM value %r", self.entity_id, value)
            return
        await self._command(value, subfield=self.d.command_subfield)
