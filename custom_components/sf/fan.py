"""
Fan platform — Spider Farmer Bridge.

Two entity flavours:

Blower (exhaust):
  • percentage 1–100 mapped straight to the controller level, clamped to a
    25% minimum (the hardware's floor for airflow)
  • state JSON: {"state": "ON"|"OFF", "percentage": 0-100}

Fan (circulation):
  • 10 gears — HA percentage <-> gear via speed_count=10
  • state JSON: {"state", "percentage"(=gear 0-10), "oscillating", "natural_wind"}
  • oscillation routes oscillate() to the fan/oscillation_level/set subfield,
    restoring the last non-zero shakeLevel on enable and 0 on disable.
"""
from __future__ import annotations

import json
import logging
import math
from typing import Any, Optional

from homeassistant.components.fan import FanEntity, FanEntityFeature
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

_LOGGER = logging.getLogger(__name__)

PLATFORM = "fan"

_BLOWER_MIN_PCT = 25   # hardware airflow floor
_FAN_GEARS = 10


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        entities: list[FanEntity] = []
        for d in defs:
            if d.kind == "blower":
                entities.append(SfBlower(bus, d))
            else:
                entities.append(SfCirculationFan(bus, d))
        async_add_entities(entities)

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


def _base_features(*extra: FanEntityFeature) -> FanEntityFeature:
    feats = FanEntityFeature.SET_SPEED
    # TURN_ON / TURN_OFF exist from HA 2024.8 — guard for older cores
    for name in ("TURN_ON", "TURN_OFF"):
        member = getattr(FanEntityFeature, name, None)
        if member is not None:
            feats |= member
    for e in extra:
        feats |= e
    return feats


class _SfFanBase(SfEntity, FanEntity):
    # We declare TURN_ON/TURN_OFF explicitly (HA 2024.8+ model)
    _enable_turn_on_off_backwards_compatibility = False

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_is_on = None
        self._attr_percentage = None

    @callback
    def _restore(self, last) -> None:
        self._attr_is_on = last.state == "on"
        pct = last.attributes.get("percentage")
        if isinstance(pct, (int, float)):
            self._attr_percentage = int(pct)

    async def async_turn_on(
        self,
        percentage: Optional[int] = None,
        preset_mode: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        await self._command("ON")
        if percentage is not None:
            await self.async_set_percentage(percentage)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._command("OFF")


class SfBlower(_SfFanBase):
    """Exhaust blower — level 1–100 with a 25% command floor."""

    _attr_supported_features = _base_features()

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        try:
            data = json.loads(payload)
        except (ValueError, TypeError):
            return
        state = str(data.get("state", "")).upper()
        if state in ("ON", "OFF"):
            self._attr_is_on = state == "ON"
        try:
            self._attr_percentage = max(0, min(100, int(data.get("percentage", 0))))
        except (ValueError, TypeError):
            pass

    async def async_set_percentage(self, percentage: int) -> None:
        if percentage == 0:
            await self._command("OFF")
            return
        level = max(_BLOWER_MIN_PCT, min(100, int(percentage)))
        await self._command(str(level), subfield="percentage")


class SfCirculationFan(_SfFanBase):
    """Circulation fan — 10 gears + oscillation."""

    _attr_supported_features = _base_features(FanEntityFeature.OSCILLATE)
    _attr_speed_count = _FAN_GEARS

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_oscillating = None

    @property
    def _oscillation_level_topic(self) -> str:
        return f"ggs/ha/{self.d.mac}/fan_oscillation/state"

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        try:
            data = json.loads(payload)
        except (ValueError, TypeError):
            return
        state = str(data.get("state", "")).upper()
        if state in ("ON", "OFF"):
            self._attr_is_on = state == "ON"
        try:
            gear = max(0, min(_FAN_GEARS, int(data.get("percentage", 0))))
            self._attr_percentage = gear * (100 // _FAN_GEARS)
        except (ValueError, TypeError):
            pass
        if "oscillating" in data:
            self._attr_oscillating = bool(data["oscillating"])

    @callback
    def _restore(self, last) -> None:
        super()._restore(last)
        osc = last.attributes.get("oscillating")
        if isinstance(osc, bool):
            self._attr_oscillating = osc

    async def async_set_percentage(self, percentage: int) -> None:
        if percentage == 0:
            await self._command("OFF")
            return
        gear = max(1, min(_FAN_GEARS, math.ceil(percentage / (100 / _FAN_GEARS))))
        await self._command(str(gear), subfield="percentage")

    async def async_oscillate(self, oscillating: bool) -> None:
        if oscillating:
            # Restore last observed shake level; default to 3 (mid) if unknown
            cached = self.bus.cached(self._oscillation_level_topic)
            try:
                level = int(float(cached)) if cached else 0
            except (ValueError, TypeError):
                level = 0
            if level <= 0:
                level = 3
            await self._command(str(level), subfield="oscillation_level")
        else:
            await self._command("0", subfield="oscillation_level")
