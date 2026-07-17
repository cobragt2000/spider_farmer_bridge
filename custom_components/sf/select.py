"""Select platform — Spider Farmer Bridge (v3.6.0).

Dehumidifier Level: Low / High. The controller encodes it as mLevel
0=Low / 1=High; the command handler accepts the strings directly. State
mirrors the dehumidifier_level reporting topic, which publishes
"Low"/"High" while running and "Off" while idle — "Off" is not a level,
so the select keeps the last known choice.
"""
from __future__ import annotations

import logging

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

_LOGGER = logging.getLogger(__name__)

PLATFORM = "select"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(SfLevelSelect(bus, d) for d in defs)

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


class SfLevelSelect(SfEntity, SelectEntity):
    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_options = list(d.options or [])
        self._attr_current_option = None
        # Outlet Mode selector (v3.11.1a) has no device state topic — seed it
        # from the mode the bus is tracking (defaults to Manual).
        import re
        self._outlet_mode_n = None
        m = re.match(r"outlet_(\d+)_mode$", d.field)
        if m:
            self._outlet_mode_n = int(m.group(1))
            self._attr_current_option = bus.outlet_mode(d.mac, self._outlet_mode_n)

    @property
    def _state_field(self) -> str:
        f = self.d.field
        return f[:-4] if f.endswith("_set") else f

    @property
    def state_topics(self) -> list[str]:
        # Outlet Mode selector: subscribe to the device-decoded mode topic so
        # a mode changed from the SF app flows back into HA (display only —
        # dynamic visibility is driven by the bus from the config poll).
        return [f"ggs/ha/{self.d.mac}/{self._state_field}/state"]

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        payload = (payload or "").strip()
        if payload in self._attr_options:
            self._attr_current_option = payload
            return
        # Variant labels map to their base option: the SE light reports
        # "Automatic (Standby)" while idling in automatic mode.
        base = payload.split(" (")[0]
        if base in self._attr_options:
            self._attr_current_option = base
        # Anything else ("Off" while idle) is not a choice — keep last.

    @callback
    def _restore(self, last) -> None:
        self._handle_payload("", last.state)

    async def async_select_option(self, option: str) -> None:
        # Outlet Mode selector (v3.11.1a): swap the visible per-mode entities
        # immediately, then send the modeType write (routed via the CB).
        import re
        m = re.match(r"outlet_(\d+)_mode$", self.d.field)
        if m:
            self.bus.set_outlet_mode_from_ha(
                self.d.mac_raw, int(m.group(1)), option
            )
            # No device state topic for the mode — hold the chosen value
            # optimistically so the selector doesn't snap back to Manual.
            self._attr_current_option = option
            self.async_write_ha_state()
        elif self.d.field.endswith("_substrate"):
            # Substrate soilType has no immediate echo — the change only
            # comes back on the next config-file poll, so hold the choice
            # optimistically to avoid snapping back.
            self._attr_current_option = option
            self.async_write_ha_state()
        # With a command_subfield the write goes to {field}/{subfield}/set;
        # without one (SE mode / outlet mode) it goes to the field topic.
        await self._command(option, subfield=self.d.command_subfield)
