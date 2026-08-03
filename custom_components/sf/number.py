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
        async_add_entities(
            SfLeafOffsetNumber(bus, d) if d.kind == "leaf_offset"
            else SfLocalNumber(bus, d) if d.kind == "leaf_target"
            else SfCalNumber(bus, d) if d.kind == "cal"
            else SfBlowerSpeedNumber(bus, d) if d.kind == "blower"
            else SfFanSpeedNumber(bus, d) if d.kind == "fan"
            else SfLevelNumber(bus, d)
            for d in defs
        )

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


class SfBlowerSpeedNumber(SfLevelNumber):
    """Blower speed slider: 0 = Off, otherwise 25-100 % (hardware airflow
    floor). Setting 0 turns the blower off via the block's on/off write;
    any value 1-24 snaps up to the 25 % floor. Mirrors blower_speed, which
    reports 0 while the blower is off."""

    _FLOOR_PCT = 25

    async def async_set_native_value(self, value: float) -> None:
        pct = int(value)
        if pct <= 0:
            # subfield=None -> blower block on/off write ("OFF")
            await self._command("OFF")
            return
        pct = max(self._FLOOR_PCT, min(100, pct))
        await self._command(str(pct), subfield=self.d.command_subfield)


class SfFanSpeedNumber(SfLevelNumber):
    """Circulation-fan speed slider in %, mapped to the fan's 10 gears.
    The slider is 0-100 in steps of 10; 0 = Off. Reads the reported gear
    (fan_gear, 0-10, which is 0 while the fan is off) and shows it as a
    percentage; writes convert the percentage back to a 1-10 gear. The fan
    entity's own speed control is unchanged."""

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        try:
            gear = float(payload)
        except (ValueError, TypeError):
            return
        self._attr_native_value = max(0.0, min(100.0, gear * 10))

    async def async_set_native_value(self, value: float) -> None:
        pct = int(value)
        if pct <= 0:
            await self._command("OFF")
            return
        gear = max(1, min(10, round(pct / 10)))
        await self._command(str(gear), subfield=self.d.command_subfield)



class SfLocalNumber(SfEntity, NumberEntity):
    """A number that lives entirely in HA — no device field behind it.

    Used for user preferences the controller knows nothing about (Leaf VPD
    target bounds, the leaf-temp offset). It persists across restarts via
    RestoreEntity and, when set, simply stores the value so dependents (the Leaf
    VPD sensor, the card's tile colouring) can react. Seeded from
    ``default_value`` until something is restored."""

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_mode = NumberMode.BOX
        self._attr_native_min_value = float(
            d.min_value if d.min_value is not None else 0)
        self._attr_native_max_value = float(
            d.max_value if d.max_value is not None else 100)
        self._attr_native_step = float(d.step or 1)
        self._attr_native_value = (
            float(d.default_value) if d.default_value is not None else None)
        if d.unit:
            self._attr_native_unit_of_measurement = d.unit

    @property
    def state_topics(self) -> list[str]:
        return []  # local config; nothing on the device feeds it

    @property
    def available(self) -> bool:
        # Settable whenever the integration is up, even if this controller is
        # momentarily offline (it's a preference, not live device data).
        return self.bus.available

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        return  # no device topics feed this entity

    @callback
    def _clamp(self, v: float) -> float:
        return max(self._attr_native_min_value,
                   min(self._attr_native_max_value, v))

    @callback
    def _restore(self, last) -> None:
        try:
            self._attr_native_value = self._clamp(float(last.state))
        except (ValueError, TypeError):
            pass

    async def async_set_native_value(self, value: float) -> None:
        self._attr_native_value = self._clamp(round(float(value), 2))
        self.async_write_ha_state()


class SfLeafOffsetNumber(SfLocalNumber):
    """Leaf-temperature offset — a local delta (leaf runs cooler than air) used
    only to derive the Leaf VPD sensor. Its unit follows the HA temperature unit
    so it reads in °F or °C; because it is a *delta*, the Leaf VPD sensor
    converts it per-degree (÷1.8 for °F) rather than as an absolute temp."""

    async def async_added_to_hass(self) -> None:
        units = getattr(self.hass.config, "units", None)
        self._attr_native_unit_of_measurement = getattr(
            units, "temperature_unit", "°F")
        await super().async_added_to_hass()


class SfCalNumber(SfLevelNumber):
    """Editable calibration offset. Unlike the level numbers these are
    float-valued and may be negative, so the entered value is sent as a raw
    float (not truncated to int). The write is held optimistically until the
    device echoes the stored offset back on the next config-file poll."""

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        # Offsets can legitimately be 0 or negative, so skip the level
        # entities' "below floor means off -> unknown" handling.
        try:
            value = float(payload)
        except (ValueError, TypeError):
            return
        lo, hi = self._attr_native_min_value, self._attr_native_max_value
        self._attr_native_value = max(lo, min(hi, value))

    async def async_set_native_value(self, value: float) -> None:
        v = round(float(value), 1)
        self._attr_native_value = v
        self.async_write_ha_state()
        await self._command("%g" % v, subfield=self.d.command_subfield)
