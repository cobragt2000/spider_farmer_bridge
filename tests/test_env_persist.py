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


def test_release_makes_override_return_real_mode():
    """v3.19.312: when the device reports a real non-env modeType (Cycle=2), the
    outlet is released and the virtual-mode override must then return the REAL
    mode. The proxy releases BEFORE publishing so the card leaves the stale
    virtual 'Temperature' — this test locks the release+override behaviour."""
    bus, entry, ce = _bus()
    mac = "aabbccddeeff"
    bus._ext_air = {mac}
    bus._outlet_env = {mac: {1: {"enabled": True, "mode": "Temperature",
                                 "dir": "Cooling", "_auto": True}}}
    bus._outlet_env_state = {}
    bus._outlet_env_primed = set()
    bus._outlet_env_setpoint = {}
    bus._ensure_control_timer = lambda: None   # no live loop in the unit test

    topic = f"ggs/ha/{mac}/outlet_1_mode/state"
    # While adopted, the device's Manual mode is overridden to the virtual one.
    assert bus.env_outlet_mode_override(mac, topic, "Cycle") == "Temperature"
    # Device now reports Cycle (modeType 2) -> the outlet is released.
    bus.maybe_adopt_env_outlet(mac, 1, 2, 1, 1)
    assert 1 not in bus._outlet_env.get(mac, {})
    # …so the override now returns the REAL mode; the card updates off Temperature.
    assert bus.env_outlet_mode_override(mac, topic, "Cycle") == "Cycle"


def _bus_env(mac):
    """A bus stubbed for the env-outlet control-set tests (no HA plumbing)."""
    bus = SfBus.__new__(SfBus)
    bus._ext_air = set()
    bus._outlet_env = {}
    bus._outlet_env_state = {}
    bus._outlet_env_primed = set()
    bus._outlet_env_setpoint = {}
    bus._ensure_control_timer = lambda: None
    bus._publish_env_outlet_mode = lambda *_a: None
    bus.published = []
    bus.publish = lambda topic, val, retain=False: bus.published.append((topic, val))
    bus._persist_outlet_env_del = lambda *_a: bus.__dict__.setdefault("purged", []).append(_a)
    return bus


def test_release_all_env_outlets_keeps_light_env():
    """v3.19.313: a strip switched off external hands back its Temperature/Humidity
    outlets (they run natively on an SF strip) but KEEPS Light Env (sensorless
    day/night, valid on any strip)."""
    mac = "aabbccddeeff"
    bus = _bus_env(mac)
    bus._outlet_env = {mac: {
        1: {"enabled": True, "mode": "Temperature", "dir": "Cooling", "_auto": True},
        2: {"enabled": True, "mode": "Humidity", "dir": "Dehumidifying", "_auto": True},
        5: {"enabled": True, "mode": "Light Env", "dir": "Day"},
    }}
    bus.release_all_env_outlets(mac)
    remaining = bus._outlet_env.get(mac, {})
    assert set(remaining) == {5}                       # only Light Env survives
    assert remaining[5]["mode"] == "Light Env"
    assert ("purged" in bus.__dict__) and len(bus.purged) == 2   # O1+O2 persisted-purged
    # The two released outlets were un-virtualized to Manual for the card.
    assert (f"ggs/ha/{mac}/outlet_1_mode/state", "Manual") in bus.published
    assert (f"ggs/ha/{mac}/outlet_2_mode/state", "Manual") in bus.published


def test_apply_outlet_env_drops_stale_non_external_temp():
    """v3.19.313: loading the persisted option must NOT re-activate Temperature/
    Humidity env outlets on a strip that isn't external (e.g. one already switched
    back to its own SF 3-in-1). Light Env on that same strip is kept."""
    mac = "aabbccddeeff"
    bus = _bus_env(mac)
    bus._ext_air = set()   # strip is SF-source now
    option = {mac: {
        "1": {"enabled": True, "mode": "Temperature", "dir": "Cooling", "_auto": True},
        "5": {"enabled": True, "mode": "Light Env", "dir": "Day"},
    }}
    bus.apply_outlet_env(option)
    got = bus._outlet_env.get(mac, {})
    assert set(got) == {5}                              # Temp dropped, Light Env kept
    assert (f"ggs/ha/{mac}/outlet_1_mode/state", "Manual") in bus.published


def test_apply_outlet_env_keeps_temp_on_external():
    """The same Temperature entry IS honoured when the strip is external."""
    mac = "aabbccddeeff"
    bus = _bus_env(mac)
    bus._ext_air = {mac}
    option = {mac: {"1": {"enabled": True, "mode": "Temperature",
                          "dir": "Cooling", "_auto": True}}}
    bus.apply_outlet_env(option)
    assert 1 in bus._outlet_env.get(mac, {})
