"""Env-outlet persistence (v3.19.301).

An adopted env outlet (Temperature/Humidity on an external-sensor strip) is parked
in Manual on the device, so there's no device evidence to re-adopt on reboot. The
bus persists the entry to the config option so it reloads on restart, and removes
it when the user sets a real non-env mode from the app."""

from custom_components.sf.bus import SfBus
from custom_components.sf.const import CONF_OUTLET_ENV


class _Entry:
    def __init__(self):
        self.options: dict = {}


class _CE:
    def __init__(self, entry):
        self.entry = entry
        self.updates = 0

    def async_get_entry(self, _eid):
        return self.entry

    def async_update_entry(self, entry, options=None):
        entry.options = options
        self.updates += 1


class _Hass:
    def __init__(self, ce):
        self.config_entries = ce


def _bus():
    bus = SfBus.__new__(SfBus)
    entry = _Entry()
    ce = _CE(entry)
    bus.hass = _Hass(ce)
    bus.entry_id = "e1"
    return bus, entry, ce


def test_persist_set_reload_shape():
    bus, entry, ce = _bus()
    cfg = {"enabled": True, "mode": "Temperature", "dir": "Cooling", "_auto": True}
    bus._persist_outlet_env_set("aabbccddeeff", 1, cfg)
    saved = entry.options[CONF_OUTLET_ENV]["aabbccddeeff"]["1"]
    assert saved["mode"] == "Temperature" and saved["dir"] == "Cooling"
    assert saved["enabled"] is True and saved["_auto"] is True


def test_persist_set_is_idempotent():
    bus, entry, ce = _bus()
    cfg = {"enabled": True, "mode": "Humidity", "dir": "Dehumidifying", "_auto": True}
    bus._persist_outlet_env_set("aabbccddeeff", 4, cfg)
    n = ce.updates
    bus._persist_outlet_env_set("aabbccddeeff", 4, dict(cfg))   # unchanged
    assert ce.updates == n   # no extra write / no listener churn


def test_persist_del_removes_entry():
    bus, entry, ce = _bus()
    bus._persist_outlet_env_set("aabbccddeeff", 2, {"enabled": True, "mode": "Temperature", "dir": "Heating"})
    bus._persist_outlet_env_del("aabbccddeeff", 2)
    assert "aabbccddeeff" not in entry.options.get(CONF_OUTLET_ENV, {})
