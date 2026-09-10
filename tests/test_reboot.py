"""Device reboot — v3.19.287.

A per-controller Reboot button (and sf.reboot_device service) inject the
firmware's `setDevRestart` device-management command through the bridge. The
command envelope matches every other injected command; the action is gated by
Allow device control and only works while the controller is online.
"""
import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.sf.const import DATA_BUS, DOMAIN
from custom_components.sf.entity_defs import build_device_entities

MAC = "0A1B2C3D4E17"
MAC_LC = "0a1b2c3d4e17"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge", unique_id=DOMAIN,
        data={"listen_port": 18987, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True}, options={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_reboot_button_entity_created_end_to_end(hass: HomeAssistant):
    """The exact path that failed live: register + first block report must
    materialise a button.<slot>_reboot entity via the button platform."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    cfg = {"mac": MAC, "type": "cb"}
    bus.register_device(cfg)
    bus.blocks_seen(MAC, {"light"}, cfg)      # any evidence block
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    ents = er.async_entries_for_config_entry(reg, entry.entry_id)
    reboot = [e for e in ents if e.unique_id == f"ggs_{MAC_LC}_reboot"]
    assert reboot, "reboot button entity was not created"
    assert reboot[0].entity_id.startswith("button.")


async def test_reboot_command_payload():
    """setDevRestart envelope: method + empty params + pid + uid."""
    from custom_components.sf.proxy.mitm_proxy import MITMProxy, _mac
    prox = MITMProxy.__new__(MITMProxy)
    prox._sessions = {}
    captured = []

    class FakeSess:
        mac_raw = "0a1b2c3d4e07"
        uid = "12345"
        async def inject(self, payload):
            captured.append(payload)

    prox._sessions[_mac("0a1b2c3d4e07")] = FakeSess()
    assert await prox.reboot_device("0a1b2c3d4e07")
    assert captured[0]["method"] == "setDevRestart"
    assert captured[0]["params"] == {}
    assert captured[0]["pid"] == "0A1B2C3D4E07"
    assert captured[0]["uid"] == "12345"
    assert "msgId" in captured[0]


async def test_reboot_offline_returns_false():
    """No active session (controller offline) -> False, nothing injected."""
    from custom_components.sf.proxy.mitm_proxy import MITMProxy
    prox = MITMProxy.__new__(MITMProxy)
    prox._sessions = {}
    assert await prox.reboot_device("aabbccddeeff") is False


async def test_bus_reboot_gated_by_allow_control():
    """bus.reboot_device raises unless Allow device control is on; on -> proxy called."""
    from custom_components.sf.bus import SfBus
    bus = SfBus.__new__(SfBus)
    calls = []

    class FakeProxy:
        allow_control = False
        async def reboot_device(self, mac):
            calls.append(mac)
            return True

    bus.proxy = FakeProxy()
    with pytest.raises(HomeAssistantError):
        await bus.reboot_device("0a1b2c3d4e07")
    assert calls == []

    bus.proxy.allow_control = True
    await bus.reboot_device("0a1b2c3d4e07")
    assert calls == ["0a1b2c3d4e07"]


async def test_bus_reboot_offline_raises():
    """An online-gated proxy that reports the device offline surfaces an error."""
    from custom_components.sf.bus import SfBus
    bus = SfBus.__new__(SfBus)

    class FakeProxy:
        allow_control = True
        async def reboot_device(self, mac):
            return False           # offline

    bus.proxy = FakeProxy()
    with pytest.raises(HomeAssistantError):
        await bus.reboot_device("0a1b2c3d4e07")


def test_reboot_button_created_from_any_block():
    # The button is device-level (like display_off): created from whatever block
    # the controller reports first, NOT gated on the sys block (which never
    # reaches blocks_seen). A panel reporting only its light block still gets it.
    defs = build_device_entities(
        {"mac": "0A1B2C3D4E17", "type": "cb"}, blocks={"light"}, slot="dp1")
    reboot = [d for d in defs if d.field == "reboot"]
    assert reboot, "expected a reboot button for a controller from any block"
    d0 = reboot[0]
    assert d0.platform == "button"
    assert d0.kind == "reboot"
    assert d0.expected_object_id == "sf_dp1_reboot"


def test_reboot_button_created_for_all_controller_types():
    for dtype, slot in (("cb", "dp1"), ("ps5", "ac5"), ("ps10", "ac10"), ("st", "st1")):
        defs = build_device_entities(
            {"mac": "0A1B2C3D4E17", "type": dtype}, blocks={"outlet"}, slot=slot)
        assert any(d.field == "reboot" and d.platform == "button" for d in defs), \
            f"expected a reboot button for controller type {dtype}"


def test_reboot_button_absent_for_non_controller():
    # A standalone SE light ("se") is not a rebootable GGS controller.
    defs = build_device_entities(
        {"mac": "0A1B2C3D4E17", "type": "se"}, blocks={"selight"}, slot="se1")
    assert not any(d.field == "reboot" for d in defs)
