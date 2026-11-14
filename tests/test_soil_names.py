"""Soil-probe app names (senConfig[].label) -> HA sensor name (read-only)."""
import json
import pytest
from ha_compat import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish, _senconfig_from
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH
from custom_components.sf.ha.discovery import publish_soil_sensor_discovery

CB_MAC = "0A1B2C3D4E01"
CB_MAC_LC = "0a1b2c3d4e01"

CB_SOIL = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "sensors": [{"id": "AA01", "type": 2, "tempSoil": 22.1, "humiSoil": 45.0, "ECSoil": 1.2}],
}


def _pkt(data):
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": "getDevSta", "uid": "u1", "data": data}).encode(),
    )


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


def test_senconfig_from_shapes():
    # getConfigField ["device","senConfig"] -> data.senConfig
    assert _senconfig_from({"senConfig": [{"id": "AA01", "label": "X"}]}) == [{"id": "AA01", "label": "X"}]
    # getConfigFile -> data.configFile.senConfig
    assert _senconfig_from({"configFile": {"senConfig": [{"id": "B"}]}}) == [{"id": "B"}]
    # nested under device
    assert _senconfig_from({"configFile": {"device": {"senConfig": [{"id": "C"}]}}}) == [{"id": "C"}]
    assert _senconfig_from({"nope": 1}) is None
    assert _senconfig_from("x") is None


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18961, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_app_name_renames_live(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(CB_SOIL), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    publish_soil_sensor_discovery(bus, CB_MAC, "AA01", {"mac": CB_MAC, "type": "CB"})
    await hass.async_block_till_done()

    st = hass.states.get("sensor.sf_dp1_soil1_temperature")
    assert st is not None
    assert st.attributes["friendly_name"].endswith("Soil 1 Temperature")

    # App names the probe -> the three sensors adopt it as their default name.
    bus.apply_soil_labels(CB_MAC, [{"id": "AA01", "type": 2, "label": "Front Left"}])
    await hass.async_block_till_done()
    for suf, word in (("temperature", "Temperature"), ("moisture", "Moisture"), ("ec", "EC")):
        st = hass.states.get(f"sensor.sf_dp1_soil1_{suf}")
        assert st.attributes["friendly_name"].endswith(f"Front Left {word}"), st.attributes["friendly_name"]

    # entity_id is unchanged (object_id based), so history is intact.
    assert hass.states.get("sensor.sf_dp1_soil1_temperature") is not None
    # Averages are NOT affected by probe labels.
    assert bus._soil_label.get("AA01") == "Front Left"

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_app_name_at_registration(hass: HomeAssistant):
    """Label known before the probe registers -> sensor builds with it."""
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    bus.apply_soil_labels(CB_MAC, [{"id": "AA01", "type": 2, "label": "Back Right"}])
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt(CB_SOIL), bus)
    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    publish_soil_sensor_discovery(bus, CB_MAC, "AA01", {"mac": CB_MAC, "type": "CB"})
    await hass.async_block_till_done()
    st = hass.states.get("sensor.sf_dp1_soil1_moisture")
    assert st.attributes["friendly_name"].endswith("Back Right Moisture")
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
