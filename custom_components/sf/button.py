"""Button platform — Spider Farmer Bridge v3.

One stateless action button per controller. Currently: Reboot, which injects
the firmware's ``setDevRestart`` device-management command through the bridge.
Gated by Allow device control (via the bus) and only pressable while the
controller is online (SfEntity.available)."""
from __future__ import annotations

from homeassistant.components.button import ButtonDeviceClass, ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .bus import SfBus
from .const import DATA_BUS, DOMAIN, SIGNAL_NEW_FMT
from .entity import SfEntity
from .entity_defs import SfDef

PLATFORM = "button"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    bus: SfBus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    @callback
    def _add(defs: list[SfDef]) -> None:
        async_add_entities(
            SfRebootButton(bus, d) for d in defs if d.kind == "reboot"
        )

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_NEW_FMT.format(PLATFORM), _add)
    )
    pending = bus.platform_ready(PLATFORM)
    if pending:
        _add(pending)


class SfRebootButton(SfEntity, ButtonEntity):
    """Reboot the controller (firmware ``setDevRestart``). Stateless."""

    _attr_device_class = ButtonDeviceClass.RESTART

    # No reporting topic — a button carries no device state to seed or restore.
    @property
    def state_topics(self) -> list[str]:
        return []

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:  # pragma: no cover
        return

    @callback
    def _restore(self, last) -> None:  # pragma: no cover
        return

    async def async_press(self) -> None:
        # Raises HomeAssistantError (surfaced in the UI) if control is disabled
        # or the device is offline.
        await self.bus.reboot_device(self.d.mac)
