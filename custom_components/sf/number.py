"""Number platform — Spider Farmer Bridge (level controls, v3.6.0).

Heater Level (1-10), Humidifier Level (1-4), Fan Oscillation (0-10).

State mirrors the matching reporting topic (the def's field minus its
``_set`` suffix), so the slider always shows what the controller last
reported. Commands go through the accessory's block-preserving subfield
write in the command handler; setting a level never flips the device on.
"""
from __future__ import annotations

import logging

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

_LOGGER = logging.getLogger(__name__)

PLATFORM = "number"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(SfLevelNumber(bus, d) for d in defs)

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


class SfLevelNumber(SfEntity, NumberEntity):
    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_native_step = float(d.step) if d.step else 1
        self._attr_mode = {
            "box": NumberMode.BOX,
            "auto": NumberMode.AUTO,
            "slider": NumberMode.SLIDER,
        }.get(d.num_mode, NumberMode.SLIDER)
        self._attr_native_min_value = float(d.min_value or 0)
        self._attr_native_max_value = float(d.max_value or 100)
        if d.unit:
            self._attr_native_unit_of_measurement = d.unit
        self._attr_native_value = None

    @property
    def _state_field(self) -> str:
        # heater_level_set -> heater_level, fan_oscillation_set -> fan_oscillation
        f = self.d.field
        return f[:-4] if f.endswith("_set") else f

    @property
    def state_topics(self) -> list[str]:
        return [f"ggs/ha/{self.d.mac}/{self._state_field}/state"]

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        try:
            value = float(payload)
        except (ValueError, TypeError):
            return
        # A report below the floor means "not running" (e.g. humidifier
        # level 0 while off) — show unknown rather than an invalid slider.
        if value < self._attr_native_min_value:
            self._attr_native_value = None
        else:
            self._attr_native_value = min(value, self._attr_native_max_value)

    @callback
    def _restore(self, last) -> None:
        self._handle_payload("", last.state)

    async def async_set_native_value(self, value: float) -> None:
        # Level-style entities set command_subfield explicitly ("level",
        # "oscillation_level", ...); env/outlet numbers write the bare field.
        await self._command(str(int(value)), subfield=self.d.command_subfield)
