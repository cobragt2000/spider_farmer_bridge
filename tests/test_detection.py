"""Detection, retype, and registry-repair tests (the CB 4E01 misdetection)."""
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture(autouse=True)
def enable_sockets(socket_enabled):
    yield


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Spider Farmer Bridge",
        data={
            "listen_port": 18884,
            "upstream_host": "sf.mqtt.spider-farmer.com",
            "upstream_port": 8883,
            "allow_control": False,
        },
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _frame(session, bus, data: dict) -> None:
    """Feed one getDevSta frame through the real proxy pipeline."""
    pkt = MQTTPacket(
        packet_type=MQTT_PUBLISH,
        flags=0,
        payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps(
            {"method": "getDevSta", "uid": "u1", "data": data}
        ).encode(),
    )
    _process_publish(session, pkt, bus)


LIGHT_ONLY = {"light": {"mOnOff": 1, "mLevel": 80}}
FULL_CB = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "fan": {"mOnOff": 1, "mLevel": 7, "shakeLevel": 3, "natural": 0},
    "blower": {"mOnOff": 1, "mLevel": 65},
}


async def test_partial_first_frame_does_not_misdetect(hass: HomeAssistant):
    """The 4E01 bug: a light-only first frame must NOT type the device LC."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)

    # Frame 1: partial, light only — must stay untyped (no entities yet)
    _frame(session, bus, LIGHT_ONLY)
    await hass.async_block_till_done()
    assert session.device_type is None
    assert hass.states.get("light.sf_lc1_light_1") is None
    assert hass.states.get("light.sf_dp1_light_1") is None

    # Frames 2-3: accessory blocks without outlets — CB after the window
    # (tentative since v3.4.0: strips host accessories too)
    _frame(session, bus, FULL_CB)
    _frame(session, bus, FULL_CB)
    await hass.async_block_till_done()
    assert session.device_type == "cb"
    assert session.type_conclusive is False

    # Correct entities, correct IDs, and no LC ghosts anywhere
    assert hass.states.get("light.sf_dp1_light_1") is not None
    assert hass.states.get("sensor.sf_dp1_temperature") is not None
    assert hass.states.get("fan.sf_dp1_fan") is not None
    assert hass.states.get("light.sf_lc1_light_1") is None
    # Evidence-based (v3.0.12): FULL_CB reports no light2 block → no entity
    assert hass.states.get("light.sf_dp1_light_2") is None

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_true_lc_finalizes_after_window(hass: HomeAssistant):
    """A genuine light-only device still becomes an LC after 3 frames."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession("0A1B2C3E4E06", bus)
    pkt_data = {"light": {"mOnOff": 1, "mLevel": 50}, "light2": {"on": 0, "level": 0}}

    for topic_mac in range(2):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic="SF/GGS/CB/API/UP/0A1B2C3E4E06",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": pkt_data}).encode(),
        )
        _process_publish(session, pkt, bus)
        assert session.device_type is None  # still inside the window

    pkt = MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic="SF/GGS/CB/API/UP/0A1B2C3E4E06",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": pkt_data}).encode(),
    )
    _process_publish(session, pkt, bus)  # 3rd frame → finalize
    await hass.async_block_till_done()

    assert session.device_type == "lc"
    assert hass.states.get("light.sf_lc1_light_1") is not None
    assert hass.states.get("light.sf_lc1_light_2") is not None

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_runtime_retype_lc_to_cb(hass: HomeAssistant):
    """Tentative LC that later reveals CB markers is retyped live,
    entities renamed in place, LC-only entities removed."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    session = ProxySession(CB_MAC, bus)

    # Three light-only frames → tentatively typed LC, LC entities created
    for _ in range(3):
        _frame(session, bus, {"light": {"mOnOff": 1, "mLevel": 80}, "light2": {"on": 0}})
    await hass.async_block_till_done()
    assert session.device_type == "lc"
    assert hass.states.get("light.sf_lc1_light_1") is not None
    assert hass.states.get("light.sf_lc1_light_2") is not None

    # Full CB frame arrives → retype
    _frame(session, bus, FULL_CB)
    await hass.async_block_till_done()
    assert session.device_type == "cb"

    # light_1 renamed in place (same unique_id, new entity_id) — not recreated
    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    ent = reg.async_get("light.sf_dp1_light_1")
    assert ent is not None
    assert ent.unique_id == f"ggs_{CB_MAC_LC}_light_1"
    assert hass.states.get("light.sf_lc1_light_1") is None

    # light_2 exists on CBs too — renamed in place like light_1
    ent2 = reg.async_get("light.sf_dp1_light_2")
    assert ent2 is not None and ent2.unique_id == f"ggs_{CB_MAC_LC}_light_2"
    assert hass.states.get("sensor.sf_dp1_temperature") is not None
    assert hass.states.get("fan.sf_dp1_blower") is not None

    # Device registry repaired
    from homeassistant.helpers import device_registry as dr
    dev = dr.async_get(hass).async_get_device({(DOMAIN, f"ggs_{CB_MAC_LC}")})
    assert dev.name == "SF Display Panel 4E01"
    assert dev.model == "Display Panel"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_stale_registry_repair_on_restart(hass: HomeAssistant):
    """The reported situation: a previous run stored M4E01 as an LC. On the
    next run, CB detection must repair the registry in place — renames,
    not delete/recreate (no graveyard resurrection)."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.keep_offline = False  # this test exercises the pruning path (option off)

    # Simulate the stale registry left behind by the misdetection
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{CB_MAC_LC}")},
        name="SF Light Controller 4E01",
        manufacturer="Spider Farmer",
        model="Light Controller",
    )
    ent_reg = er.async_get(hass)
    stale = {
        ("light", f"ggs_{CB_MAC_LC}_light_1", "light_1"),
        ("light", f"ggs_{CB_MAC_LC}_light_2", "light_2"),
        ("sensor", f"ggs_{CB_MAC_LC}_light_1_brightness", "light_1_brightness"),
        ("sensor", f"ggs_{CB_MAC_LC}_light_2_brightness", "light_2_brightness"),
    }
    for domain, uid, tail in stale:
        ent_reg.async_get_or_create(
            domain, DOMAIN, uid,
            suggested_object_id=f"sf_light_controller_4e01_{tail}",
            device_id=device.id,
            config_entry=entry,
        )
    assert ent_reg.async_get(f"light.sf_light_controller_4e01_light_1") is not None

    # Device connects; partial then full frame → conclusive CB, repair fires
    session = ProxySession(CB_MAC, bus)
    _frame(session, bus, LIGHT_ONLY)
    _frame(session, bus, FULL_CB)
    _frame(session, bus, FULL_CB)
    await hass.async_block_till_done()

    # light_1 kept its unique_id and history, now under the correct entity_id
    ent = ent_reg.async_get("light.sf_dp1_light_1")
    assert ent is not None and ent.unique_id == f"ggs_{CB_MAC_LC}_light_1"
    assert ent_reg.async_get("light.sf_light_controller_4e01_light_1") is None

    # The seeded legacy light_2 is PRUNED, not renamed: this CB reports
    # no light2 block, and evidence rules over legacy registry entries.
    assert ent_reg.async_get_entity_id("light", DOMAIN, f"ggs_{CB_MAC_LC}_light_2") is None

    # Device renamed
    dev = dev_reg.async_get_device({(DOMAIN, f"ggs_{CB_MAC_LC}")})
    assert dev.name == "SF Display Panel 4E01"
    assert dev.model == "Display Panel"

    # Full CB entity set is live with correct IDs
    assert hass.states.get("sensor.sf_dp1_temperature") is not None
    assert hass.states.get("light.sf_dp1_light_1") is not None

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_ps5_upgrades_to_ps10(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]

    mac = "0A1B2C3E4E05"
    session = ProxySession(mac, bus)

    def frame(data):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{mac}",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
        )
        _process_publish(session, pkt, bus)

    five = {"outlet": {f"O{n}": {"mOnOff": 0} for n in range(1, 6)}}
    for _ in range(3):
        frame(five)
    await hass.async_block_till_done()
    assert session.device_type == "ps5"
    assert hass.states.get("switch.sf_ac5_outlet_5") is not None

    # Outlet 8 appears → PS10
    frame({"outlet": {"O8": {"mOnOff": 1}}})
    await hass.async_block_till_done()
    assert session.device_type == "ps10"
    assert hass.states.get("switch.sf_ac10_outlet_5") is not None
    assert hass.states.get("switch.sf_ac10_outlet_8") is not None
    assert hass.states.get("switch.sf_ac5_outlet_5") is None

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_evidence_based_groups_and_phantom_prune(hass: HomeAssistant):
    """v3.0.12: a lights-only CB (M4E02) gets ONLY light entities, and
    pre-existing phantom entities for unreported blocks are pruned."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.keep_offline = False  # this test exercises the pruning path (option off)

    mac_raw, mac = "0A1B2C3D4E02", "0a1b2c3d4e02"

    # Simulate pre-3.0.12 leftovers: phantom light_2 + humidifier sensor
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, f"ggs_{mac}")},
        name="SF Display Panel 4E02",
        manufacturer="Spider Farmer",
        model="Display Panel",
    )
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "light", DOMAIN, f"ggs_{mac}_light_2",
        suggested_object_id="sf_dp1_light_2",
        device_id=device.id, config_entry=entry,
    )
    ent_reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{mac}_humidifier_level",
        suggested_object_id="sf_dp1_humidifier_level",
        device_id=device.id, config_entry=entry,
    )

    # A lights-only CB: fan block present (that's what typed it CB), light,
    # air sensors — but no light2, no climate accessories
    session = ProxySession(mac_raw, bus)
    frame_data = {
        "sensor": {"temp": 22.0, "humi": 55.0},
        "light": {"mOnOff": 1, "mLevel": 100},
        "fan": {"mOnOff": 0, "mLevel": 0},
    }
    for _ in range(3):
        pkt = MQTTPacket(
            packet_type=MQTT_PUBLISH, flags=0, payload=b"",
            topic=f"SF/GGS/CB/API/UP/{mac_raw}",
            message=json.dumps({"method": "getDevSta", "uid": "u1", "data": frame_data}).encode(),
        )
        _process_publish(session, pkt, bus)
    await hass.async_block_till_done()

    # Reported blocks → entities exist with state
    assert hass.states.get("sensor.sf_dp1_temperature").state == "22.0"
    assert hass.states.get("light.sf_dp1_light_1") is not None
    assert hass.states.get("fan.sf_dp1_fan") is not None

    # Unreported blocks → nothing created, phantoms pruned from the registry
    assert hass.states.get("fan.sf_dp1_blower") is None
    assert hass.states.get("binary_sensor.sf_dp1_heater_active") is None
    assert ent_reg.async_get_entity_id("light", DOMAIN, f"ggs_{mac}_light_2") is None
    assert ent_reg.async_get_entity_id("sensor", DOMAIN, f"ggs_{mac}_humidifier_level") is None

    # Hardware added later → its group appears on evidence
    frame_data["humidifier"] = {"on": 1, "mLevel": 2}
    pkt = MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{mac_raw}",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": frame_data}).encode(),
    )
    _process_publish(session, pkt, bus)
    await hass.async_block_till_done()
    assert hass.states.get("binary_sensor.sf_dp1_humidifier_active").state == "on"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
