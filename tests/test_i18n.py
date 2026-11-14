"""Translations: every entity name the integration can create has an English
translation that reproduces today's name exactly, and names, the options menu
and the accessory labels follow Home Assistant's language."""
import json
import os
import re

import pytest
try:  # Home Assistant 2026.11+ ships its own test package
    from pytest_homeassistant.common import MockConfigEntry
except ImportError:
    from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf import entity_defs as ed
from custom_components.sf.const import DOMAIN
from custom_components.sf.proxy.mitm_proxy import ProxySession, _process_publish
from custom_components.sf.proxy.mqtt_parser import MQTTPacket, MQTT_PUBLISH

CB_MAC = "0A1B2C3D4E01"
TDIR = os.path.join(os.path.dirname(__file__), "..", "custom_components", "sf", "translations")


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


def _translations(lang: str) -> dict:
    with open(os.path.join(TDIR, f"{lang}.json"), encoding="utf-8") as fh:
        return json.load(fh)


def _all_defs() -> list:
    """Every entity definition the builders can produce, across all device
    types, accessories, outlet modes, soil probes and calibration entities."""
    defs, cfg = [], {"mac": CB_MAC, "type": "cb"}
    for dtype in ("cb", "ps5", "ps10", "st", "lc", "se"):
        defs += ed.build_device_entities(
            {"mac": CB_MAC, "type": dtype}, include_outlets=True, blocks=None,
            slot=f"{dtype}1", toggles={b: True for b in ed.TOGGLEABLE_BLOCKS})
    defs += ed.build_soil_entities(CB_MAC, "SN1", cfg, slot="dp1", soil_slot="soil1")
    defs += ed.build_soil_entities(CB_MAC, "SN2", cfg, slot="dp1", soil_slot="veg_left")
    defs += ed.build_soil_entities(CB_MAC, "SN3", cfg, slot="dp1", soil_slot="soil3",
                                   name_label="Pot A")
    defs += ed.build_soil_avg_entities(CB_MAC, cfg, slot="dp1")
    for build in (ed.build_alarms_entity, ed.build_oplog_entity,
                  ed.build_alarm_settings_entity, ed.build_plan_entity,
                  ed.build_plan_switch_entity):
        r = build(cfg, slot="dp1")
        defs += r if isinstance(r, list) else [r]
    defs += ed.build_air_calibration_entities(cfg, slot="dp1")
    defs += ed.build_soil_calibration_entities(CB_MAC, "SN1", cfg, slot="dp1", soil_slot="soil1")
    defs.append(ed.build_outlet_mode_select(CB_MAC, 3, "ac5", "SF Power Strip AC5 4E01",
                                            "Power Strip AC5"))
    for mode in [m for m, _ in ed.OUTLET_MODES] + ed.OUTLET_VIRTUAL_MODES:
        defs += ed.build_outlet_mode_config(CB_MAC, 3, "ac5", "SF Power Strip AC5 4E01",
                                            "Power Strip AC5", mode)
    defs += ed.build_env_entities(cfg, "dp1", include_co2=True)
    return defs


def test_every_entity_name_translates_to_todays_english_name():
    """A new entity name without an en.json entry fails here, naming the key and
    the English template to add."""
    entity = _translations("en")["entity"]
    defs = _all_defs()
    assert len(defs) > 600
    for d in defs:
        text = entity.get(d.platform, {}).get(d.translation_key, {}).get("name")
        template = d.name
        for k, v in (d.translation_placeholders or {}).items():
            template = re.sub(r"(?<![\w.])" + re.escape(v) + r"(?![\w.])", "{" + k + "}",
                              template, count=1)
        assert text is not None, (
            f'en.json is missing entity.{d.platform}.{d.translation_key}: {{"name": "{template}"}}')
        assert text.format(**(d.translation_placeholders or {})) == d.name, (
            d.platform, d.translation_key, text, d.name)


def test_name_template_keeps_glued_numbers():
    assert ed.name_translation("CO2 Target Day") == ("co2_target_day", None)
    assert ed.name_translation("Outlet 3 Mode") == ("outlet_n_mode", {"n": "3"})
    assert ed.name_translation("Light 2") == ("light_n", {"n": "2"})


def test_translation_texts_are_frontend_safe():
    """No raw braces besides {placeholders} and no HTML: the frontend formats
    these strings, so a JSON example like {"a": 1} would break the text."""
    def walk(node, path=""):
        if isinstance(node, dict):
            for k, v in node.items():
                yield from walk(v, f"{path}.{k}" if path else k)
        else:
            yield path, node
    for lang in ("en", "de"):
        for path, text in walk(_translations(lang)):
            assert "<" not in text and ">" not in text, (lang, path)
            rest = re.sub(r"\{\w+\}", "", text)
            assert "{" not in rest and "}" not in rest, (lang, path, text)


async def _setup(hass: HomeAssistant, language: str) -> MockConfigEntry:
    hass.config.language = language
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18889, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": False,
              "environment_entities": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _pkt(method: str, data: dict) -> MQTTPacket:
    return MQTTPacket(
        packet_type=MQTT_PUBLISH, flags=0, payload=b"",
        topic=f"SF/GGS/CB/API/UP/{CB_MAC}",
        message=json.dumps({"method": method, "uid": "u1", "data": data}).encode(),
    )


FRAME = {
    "sensor": {"temp": 24.5, "humi": 61.0},
    "light": {"mOnOff": 1, "mLevel": 80},
    "fan": {"mOnOff": 1, "mLevel": 7},
}


@pytest.mark.parametrize(("language", "expected"), [
    ("en", {"sensor.sf_dp1_temperature": "SF Display Panel 4E01 Temperature",
            "sensor.sf_dp1_humidity": "SF Display Panel 4E01 Humidity",
            "fan.sf_dp1_fan": "SF Display Panel 4E01 Fan"}),
    ("de", {"sensor.sf_dp1_temperature": "SF Display Panel 4E01 Temperatur",
            "sensor.sf_dp1_humidity": "SF Display Panel 4E01 Luftfeuchtigkeit",
            "fan.sf_dp1_fan": "SF Display Panel 4E01 Umluft"}),
])
async def test_entity_names_follow_ha_language(hass: HomeAssistant, language, expected):
    """Same entity_ids in every language; only the friendly names change."""
    entry = await _setup(hass, language)
    bus = hass.data[DOMAIN][entry.entry_id]["bus"]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FRAME), bus)
    await hass.async_block_till_done()

    for entity_id, name in expected.items():
        state = hass.states.get(entity_id)
        assert state is not None, entity_id
        assert state.attributes["friendly_name"] == name

    # Numbered names fill their placeholder: "Light 1" / "Licht 1"
    light = [s for s in hass.states.async_all("light")
             if s.entity_id.startswith("light.sf_dp1_light")]
    assert light, "no light entity"
    want = "Licht" if language == "de" else "Light"
    assert all(want in s.attributes["friendly_name"] for s in light)

    # The Environment sub-device: "… Environment" / "… Umgebung"
    from homeassistant.helpers import device_registry as dr
    ident = (DOMAIN, f"ggs_{CB_MAC.lower()}_env")
    env = next((dev for dev in dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)
                if ident in dev.identifiers), None)
    assert env is not None
    suffix = "Umgebung" if language == "de" else "Environment"
    assert env.name == f"SF Display Panel 4E01 {suffix}"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


@pytest.mark.parametrize(("language", "settings", "components"), [
    ("en", "Settings (ports, control, diagnostic log)",
     "Device accessories (Light 2 / Fan per device)"),
    ("de", "Einstellungen (Ports, Steuerung, Diagnoseprotokoll)",
     "Gerätezubehör (Licht 2 / Umluft je Gerät)"),
])
async def test_options_menu_follows_ha_language(hass: HomeAssistant, language, settings,
                                                components):
    entry = await _setup(hass, language)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == "menu"
    assert result["menu_options"]["settings"] == settings
    assert result["menu_options"]["components"] == components
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


async def test_old_core_without_name_placeholders_keeps_english(hass: HomeAssistant, monkeypatch):
    """Cores before name placeholders (HA 2024.1) keep today's English names for
    numbered entities and the Environment device instead of showing raw keys."""
    import custom_components.sf.entity as sf_entity
    monkeypatch.setattr(sf_entity, "_NAME_PLACEHOLDERS", False)
    monkeypatch.setattr(sf_entity, "_DEVICE_TRANSLATION", False)
    entry = await _setup(hass, "de")
    bus = hass.data[DOMAIN][entry.entry_id]["bus"]
    session = ProxySession(CB_MAC, bus)
    for _ in range(3):
        _process_publish(session, _pkt("getDevSta", FRAME), bus)
    await hass.async_block_till_done()

    # unnumbered names still translate, numbered ones stay English
    assert hass.states.get("sensor.sf_dp1_temperature").attributes["friendly_name"] \
        == "SF Display Panel 4E01 Temperatur"
    light = [s for s in hass.states.async_all("light")
             if s.entity_id.startswith("light.sf_dp1_light")]
    assert light and all("Light" in s.attributes["friendly_name"] for s in light)
    from homeassistant.helpers import device_registry as dr
    ident = (DOMAIN, f"ggs_{CB_MAC.lower()}_env")
    env = next(dev for dev in dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)
               if ident in dev.identifiers)
    assert env.name == "SF Display Panel 4E01 Environment"

    if session.initial_poll_task:
        session.initial_poll_task.cancel()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
