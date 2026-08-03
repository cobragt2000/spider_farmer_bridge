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
        async_add_entities(
            SfLeafVpdSensor(bus, d) if d.kind == "leaf_vpd"
            else SfScheduleSensor(bus, d) if d.kind == "schedule"
            else SfAlarmsSensor(bus, d) if d.kind in ("alarms", "oplog")
            else SfAlarmSettingsSensor(bus, d) if d.kind == "alarm_settings"
            else SfSensor(bus, d)
            for d in defs
        )

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
    def _restore(self, last) -> None:
        # HA records a device_class sensor's state in the *display* unit, not
        # the native one. Our temperature sensors are native °C but shown in
        # the user's unit (often °F), so last.state is already converted.
        # Feeding it back through _handle_payload would treat that °F number
        # as °C and double-convert on display (e.g. 80 °F restored as 80 °C ->
        # shown 176 °F, spiking graphs after every reboot). Convert the saved
        # display value back to the native unit first.
        native_unit = self.d.unit
        saved_unit = last.attributes.get("unit_of_measurement")
        if (
            self._is_numeric
            and self.d.device_class == "temperature"
            and native_unit
            and saved_unit
            and saved_unit != native_unit
        ):
            try:
                v = float(last.state)
            except (ValueError, TypeError):
                super()._restore(last)
                return
            if saved_unit in ("°F", "℉"):
                v = (v - 32) * 5 / 9
            elif saved_unit == "K":
                v = v - 273.15
            self._handle_payload(self.d.state_topic, f"{round(v, 1)}")
            return
        super()._restore(last)

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


def _to_c(value: float, unit: str | None) -> float:
    """A temperature reading in its displayed unit -> °C."""
    u = unit or "°C"
    if "F" in u or "℉" in u:
        return (value - 32) / 1.8
    if u == "K":
        return value - 273.15
    return value


def _delta_to_c(value: float, unit: str | None) -> float:
    """A temperature *delta* (offset) in its unit -> a °C delta (per-degree)."""
    u = unit or "°C"
    return value / 1.8 if ("F" in u or "℉" in u) else value


def _svp(tc: float) -> float:
    """Saturation vapour pressure (kPa) at temperature ``tc`` °C."""
    import math
    return 0.6108 * math.exp(17.27 * tc / (tc + 237.3))


class SfLeafVpdSensor(SfSensor):
    """Leaf VPD, derived in HA (v3.19.101).

    VPD referenced to the leaf surface rather than the air:
        VPD_leaf = SVP(T_leaf) - (RH / 100) * SVP(T_air),  T_leaf = T_air + offset
    The offset (Leaf Offset number) is a temperature delta in the user's unit.
    This sensor watches the panel's air-temperature, humidity, and Leaf Offset
    entities and recomputes whenever any of them changes — there is no device
    topic for it."""

    @property
    def state_topics(self) -> list[str]:
        return []  # computed from sibling entities, not a device topic

    @property
    def _sibling_ids(self) -> tuple[str, str, str]:
        base = f"sf_{self.d.slot}"
        return (
            f"sensor.{base}_temperature",
            f"sensor.{base}_humidity",
            f"number.{base}_leaf_offset",
        )

    async def async_added_to_hass(self) -> None:
        from homeassistant.helpers.event import async_track_state_change_event
        await super().async_added_to_hass()
        self.async_on_remove(
            async_track_state_change_event(
                self.hass, list(self._sibling_ids), self._sources_changed
            )
        )
        self._recompute()
        self.async_write_ha_state()

    @callback
    def _sources_changed(self, _event) -> None:
        self._recompute()
        self.async_write_ha_state()

    @callback
    def _restore(self, last) -> None:
        return  # always recomputed live; never restore a stale kPa reading

    def _recompute(self) -> None:
        if self.hass is None:
            return
        temp_id, humi_id, off_id = self._sibling_ids
        t = self.hass.states.get(temp_id)
        h = self.hass.states.get(humi_id)
        o = self.hass.states.get(off_id)
        try:
            air = float(t.state)
            rh = float(h.state)
        except (AttributeError, ValueError, TypeError):
            self._attr_native_value = None
            return
        air_c = _to_c(air, t.attributes.get("unit_of_measurement"))
        try:
            offset = float(o.state)
            off_unit = o.attributes.get("unit_of_measurement")
        except (AttributeError, ValueError, TypeError):
            offset, off_unit = -2.0, t.attributes.get("unit_of_measurement")
        leaf_c = air_c + _delta_to_c(offset, off_unit)
        vpd = _svp(leaf_c) - (rh / 100.0) * _svp(air_c)
        self._attr_native_value = f"{max(0.0, vpd):.2f}"


class SfScheduleSensor(SfSensor):
    """SE-light schedule: state is the period count; the decoded period array
    (days/start/end/brightness/fade) is exposed as the ``periods`` attribute
    for the light card to read and edit."""

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        import json
        try:
            periods = json.loads(payload) if payload else []
        except (ValueError, TypeError):
            periods = []
        if not isinstance(periods, list):
            periods = []
        n = len(periods)
        self._attr_native_value = f"{n} period{'' if n == 1 else 's'}"
        self._attr_extra_state_attributes = {
            **(self._attr_extra_state_attributes or {}),
            "periods": periods,
        }


class SfAlarmsSensor(SfSensor):
    """Controller alarm/event log: state = the most recent alarm's time (or
    'none'); the decoded list is exposed as the ``events`` attribute."""

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        import json
        try:
            events = json.loads(payload) if payload else []
        except (ValueError, TypeError):
            events = []
        if not isinstance(events, list):
            events = []
        latest = events[0] if events and isinstance(events[0], dict) else None
        self._attr_native_value = (latest.get("time") if latest else None) or "none"
        self._attr_extra_state_attributes = {
            **(self._attr_extra_state_attributes or {}),
            "count": len(events),
            "events": events,
        }


class SfAlarmSettingsSensor(SfSensor):
    """Controller alarm thresholds: state = number of enabled alarms; the
    decoded climate/substrate/other groups are exposed as the ``settings``
    attribute for the card's Alerts tab to read and edit."""

    @callback
    def _handle_payload(self, topic: str, payload: str) -> None:
        import json
        try:
            settings = json.loads(payload) if payload else {}
        except (ValueError, TypeError):
            settings = {}
        if not isinstance(settings, dict):
            settings = {}
        enabled = sum(
            1
            for grp in ("climate", "substrate", "other")
            for m in (settings.get(grp) or [])
            if isinstance(m, dict) and m.get("enabled")
        )
        self._attr_native_value = f"{enabled} on"
        self._alarm_settings = settings

    # `settings` (decoded thresholds) + `card_options` (per-panel card display
    # prefs persisted server-side via sf.set_card_option, so the Settings tab's
    # colour choice survives upgrades and syncs across devices). Exposed as a
    # live property so a card-option change re-renders without a new payload.
    @property
    def extra_state_attributes(self) -> dict:
        return {
            "settings": getattr(self, "_alarm_settings", {}),
            "card_options": self._card_options(),
        }

    def _card_options(self) -> dict:
        try:
            entry = self.hass.config_entries.async_get_entry(self.bus.entry_id)
            opts = (entry.options or {}).get("card_options", {}) if entry else {}
            v = opts.get(self.d.mac)
            return dict(v) if isinstance(v, dict) else {}
        except Exception:  # noqa: BLE001
            return {}
