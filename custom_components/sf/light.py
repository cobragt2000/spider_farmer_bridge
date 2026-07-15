"""
Light platform — Spider Farmer Bridge.

Brightness is 0-100:
  state payload:   {"state": "ON"|"OFF", "brightness": 0-100}
  command payload: {"state": "ON", "brightness": 0-100}  (brightness optional)

command_handler.py turns the command JSON into a device write (mode
preservation, OFF->ON last-brightness restore, schedule guard).
"""
from __future__ import annotations

import json
import logging
from typing import Any

from homeassistant.components.light import ATTR_BRIGHTNESS, ColorMode, LightEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

_LOGGER = logging.getLogger(__name__)

PLATFORM = "light"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(
            SfSeLight(bus, d) if d.kind == "se" else SfLight(bus, d)
            for d in defs
        )

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


def _pct_to_255(pct: int) -> int:
    return max(0, min(255, round(pct * 255 / 100)))


def _255_to_pct(b255: int) -> int:
    return max(0, min(100, round(b255 * 100 / 255)))


class SfLight(SfEntity, LightEntity):
    _attr_color_mode = ColorMode.BRIGHTNESS
    _attr_supported_color_modes = {ColorMode.BRIGHTNESS}

    def __init__(self, bus: SfBus, d: SfDef) -> None:
        super().__init__(bus, d)
        self._attr_is_on = None
        self._attr_brightness = None

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        try:
            data = json.loads(payload)
        except (ValueError, TypeError):
            _LOGGER.debug("%s: bad light payload %r", self.entity_id, payload)
            return
        state = str(data.get("state", "")).upper()
        if state in ("ON", "OFF"):
            self._attr_is_on = state == "ON"
        if "brightness" in data:
            try:
                self._attr_brightness = _pct_to_255(int(data["brightness"]))
            except (ValueError, TypeError):
                pass

    @callback
    def _restore(self, last) -> None:
        self._attr_is_on = last.state == "on"
        b = last.attributes.get(ATTR_BRIGHTNESS)
        if isinstance(b, (int, float)):
            self._attr_brightness = int(b)

    async def async_turn_on(self, **kwargs: Any) -> None:
        cmd: dict[str, Any] = {"state": "ON"}
        if ATTR_BRIGHTNESS in kwargs:
            cmd["brightness"] = _255_to_pct(int(kwargs[ATTR_BRIGHTNESS]))
        # brightness omitted -> command_handler restores last non-zero level
        await self._command(json.dumps(cmd))

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._command(json.dumps({"state": "OFF"}))


class SfSeLight(SfLight):
    """Standalone SE-series light (SE4500 etc., v3.10.2).

    State comes from the flat se_* topics (the device streams a report
    within ~200 ms of every change); commands use the captured app
    format — setOnOff for power, setLight for brightness."""

    @property
    def state_topics(self) -> list[str]:
        return [
            f"ggs/ha/{self.d.mac}/se_active/state",
            f"ggs/ha/{self.d.mac}/se_brightness/state",
        ]

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        if topic.endswith("se_active/state"):
            p = (payload or "").strip().upper()
            if p in ("ON", "OFF"):
                self._attr_is_on = p == "ON"
            return
        try:
            pct = max(0, min(100, int(float(payload))))
        except (ValueError, TypeError):
            return
        if pct > 0:
            self._attr_brightness = _pct_to_255(pct)

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._command("ON")
        if ATTR_BRIGHTNESS in kwargs:
            pct = _255_to_pct(int(kwargs[ATTR_BRIGHTNESS]))
            await self._command(str(pct), subfield="brightness")

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._command("OFF")
