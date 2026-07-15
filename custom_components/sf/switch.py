"""Switch platform — Spider Farmer Bridge v3 (GGS outlets)."""
from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchDeviceClass, SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

PLATFORM = "switch"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(
            SfClimateSwitch(bus, d) if d.kind == "climate"
            else SfToggleSwitch(bus, d) if d.kind == "toggle"
            else SfOutletSwitch(bus, d)
            for d in defs
        )

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


class SfOutletSwitch(SfEntity, SwitchEntity):
    _attr_device_class = SwitchDeviceClass.OUTLET

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

    # Non-optimistic: send the command and
    # wait for the controller's next getDevSta report to confirm the state.
    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._command("ON")

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._command("OFF")


class SfClimateSwitch(SfEntity, SwitchEntity):
    """Manual on/off for a climate accessory (heater / humidifier /
    dehumidifier).

    State mirrors the accessory's ``{field}_active`` topic — evidence the
    accessory is actually running, straight from the controller's report.
    Commands go to the accessory's own field topic; the command handler
    turns them into a manual mOnOff write that keeps the current level
    (falling back to the last level it ran at for heater/humidifier,
    where level 0 would make ON a no-op)."""

    _attr_device_class = SwitchDeviceClass.SWITCH

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_is_on = None

    @property
    def state_topics(self) -> list[str]:
        return [f"ggs/ha/{self.d.mac}/{self.d.field}_active/state"]

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        payload = (payload or "").strip().upper()
        if payload in ("ON", "OFF"):
            self._attr_is_on = payload == "ON"

    @callback
    def _restore(self, last) -> None:
        self._attr_is_on = last.state == "on"

    # Non-optimistic, like the outlets: state flips when the controller's
    # next getDevSta report confirms it.
    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._command("ON")

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._command("OFF")


class SfToggleSwitch(SfEntity, SwitchEntity):
    """Generic ON/OFF toggle for a single subfield on a device block
    (v3.7.0: Fan Natural Wind). State mirrors the matching reporting
    topic (the def's field minus its ``_set`` suffix); commands are
    block-preserving subfield writes, so the rest of the block (speed,
    mode, oscillation) rides along untouched."""

    _attr_device_class = SwitchDeviceClass.SWITCH

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_is_on = None

    @property
    def _state_field(self) -> str:
        f = self.d.field
        return f[:-4] if f.endswith("_set") else f

    @property
    def state_topics(self) -> list[str]:
        return [f"ggs/ha/{self.d.mac}/{self._state_field}/state"]

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        payload = (payload or "").strip().upper()
        if payload in ("ON", "OFF"):
            self._attr_is_on = payload == "ON"

    @callback
    def _restore(self, last) -> None:
        self._attr_is_on = last.state == "on"

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._command("ON", subfield=self.d.command_subfield)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._command("OFF", subfield=self.d.command_subfield)
