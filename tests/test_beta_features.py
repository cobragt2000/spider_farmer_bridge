"""v3.11.2b0 features: soil average sensors + per-boot diagnostic log name."""
import json
import re

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"

CB_WITH_SOIL = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "sensors": [
        {"id": "avg", "tempSoil": 24.0, "humiSoil": 45.5, "ECSoil": 1.2},
        {"id": "AABBCCDD", "type": 2, "tempSoil": 23.8, "humiSoil": 44.0,
         "ECSoil": 1.1, "mst_fw_ver": 4},
    ],
}


def _pkt(data):
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
    )


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18905, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_soil_average_sensors_created_and_valued(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(CB_WITH_SOIL), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    # Average sensors exist and carry the app's avg values
    t = hass.states.get("sensor.sf_dp1_soil_avg_temperature")
    m = hass.states.get("sensor.sf_dp1_soil_avg_moisture")
    e = hass.states.get("sensor.sf_dp1_soil_avg_ec")
    assert t is not None and t.state == "24.0"
    assert m is not None and m.state == "45.5"
    assert e is not None and e.state == "1.2"

    # Unique ids
    from homeassistant.helpers import entity_registry as er
    reg = er.async_get(hass)
    assert reg.async_get("sensor.sf_dp1_soil_avg_moisture").unique_id == \
        f"ggs_{CB_MAC_LC}_soil_avg_moisture"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_no_avg_sensors_without_probes(hass: HomeAssistant):
    """A device with no soil probes gets no average sensors."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt({
            "sensor": {"temp": 24.5, "humi": 61.0},
            "light": {"mOnOff": 1, "mLevel": 80},
        }), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    assert hass.states.get("sensor.sf_dp1_soil_avg_temperature") is None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def test_per_boot_log_path_format():
    from custom_components.sf.diag import per_boot_path, _BOOT_STAMP
    p = per_boot_path("/config/sf/logs/diagnostic.log", "3.11.2b0")
    assert p == f"/config/sf/logs/diagnostic-3.11.2b0-{_BOOT_STAMP}.log"
    # timestamp shape
    assert re.match(r".*-3\.11\.2b0-\d{8}-\d{6}\.log$", p)
    # extensionless base still gets .log
    assert per_boot_path("/x/diag", "9").endswith(f"-9-{_BOOT_STAMP}.log")
    # boot stamp stable within a process (per-instance)
    assert per_boot_path("/a.log", "1").split("-1-")[1] == \
        per_boot_path("/b.log", "1").split("-1-")[1]


async def test_naming_scheme_migration(hass: HomeAssistant):
    """Existing installs (cb1/ps5/ps10 slots, old device names) migrate to the
    DP/AC scheme: entity ids and device names rename, unique_ids/history stay."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18907, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        options={"device_slots": {"0a1b2c3d4e01": "cb1",
                                  "0a1b2c3d4e05": "ps10"}},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)

    # Pre-seed an old-scheme device + entity as a prior version would have.
    dev_reg = dr.async_get(hass)
    dev = dev_reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, "ggs_0a1b2c3d4e01")},
        name="SF Control Box 4E01", manufacturer="Spider Farmer",
        model="Control Box",
    )
    reg = er.async_get(hass)
    reg.async_get_or_create(
        "sensor", DOMAIN, "ggs_0a1b2c3d4e01_temperature",
        suggested_object_id="sf_cb1_temperature",
        device_id=dev.id, config_entry=entry,
    )

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Slots remapped, flag set
    slots = entry.options["device_slots"]
    assert slots["0a1b2c3d4e01"] == "dp1"
    assert slots["0a1b2c3d4e05"] == "ac10"
    assert entry.options.get("naming_scheme_dp_ac") is True

    # Device renamed; entity id migrated but unique_id (history) preserved
    dev = dev_reg.async_get_device({(DOMAIN, "ggs_0a1b2c3d4e01")})
    assert dev.name == "SF Display Panel 4E01"
    assert dev.model == "Display Panel"
    assert reg.async_get_entity_id("sensor", DOMAIN,
                                   "ggs_0a1b2c3d4e01_temperature") == \
        "sensor.sf_dp1_temperature"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_new_install_uses_dp_ac_slots(hass: HomeAssistant):
    """A fresh device gets dp/ac slots and the new display name directly."""
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18908, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(CB_WITH_SOIL), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.async_block_till_done()

    assert hass.states.get("sensor.sf_dp1_temperature") is not None
    from homeassistant.helpers import device_registry as dr
    dev = dr.async_get(hass).async_get_device({(DOMAIN, f"ggs_{CB_MAC_LC}")})
    assert dev.name == "SF Display Panel 4E01"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_soil_avg_swap_repaired_by_mac(hass: HomeAssistant):
    """Soil-average entity_ids that got cross-assigned between two panels are
    repaired to match each average's OWN device slot (by MAC) on setup, even
    when that means a straight dp1<->dp2 swap (collision-safe two-phase)."""
    from homeassistant.helpers import entity_registry as er

    MAC_A, MAC_B = "0a1b2c3d4e01", "0a1b2c3d4e02"
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18931, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        options={"device_slots": {MAC_A: "dp1", MAC_B: "dp2"},
                 "naming_scheme_dp_ac": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)

    reg = er.async_get(hass)
    # Seed swapped: A's average sitting under dp2's id, B's under dp1's.
    eA = reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{MAC_A}_soil_avg_temperature", config_entry=entry)
    reg.async_update_entity(eA.entity_id,
                            new_entity_id="sensor.sf_dp2_soil_avg_temperature")
    eB = reg.async_get_or_create(
        "sensor", DOMAIN, f"ggs_{MAC_B}_soil_avg_temperature", config_entry=entry)
    reg.async_update_entity(eB.entity_id,
                            new_entity_id="sensor.sf_dp1_soil_avg_temperature")

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Each average now lands on its own device's slot; unique_ids (history) kept.
    assert reg.async_get_entity_id(
        "sensor", DOMAIN, f"ggs_{MAC_A}_soil_avg_temperature"
    ) == "sensor.sf_dp1_soil_avg_temperature"
    assert reg.async_get_entity_id(
        "sensor", DOMAIN, f"ggs_{MAC_B}_soil_avg_temperature"
    ) == "sensor.sf_dp2_soil_avg_temperature"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
