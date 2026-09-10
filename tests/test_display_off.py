"""Display Off / Auto Screen Off (system.scroff) — command + entity (v3.19.259)."""

from custom_components.sf.proxy.command_handler import translate_command
from custom_components.sf.entity_defs import build_device_entities

MAC = "0A1B2C3D4E18"


def test_display_off_command_minutes_to_seconds():
    cmd = translate_command("display_off", "5", MAC, "u1")
    assert cmd["method"] == "setConfigField"
    assert cmd["params"]["keyPath"] == ["system", "scroff"]
    assert cmd["params"]["scroff"] == 300      # 5 min -> 300 s


def test_display_off_command_off():
    for v in ("0", "Off"):
        cmd = translate_command("display_off", v, MAC, "u1")
        assert cmd["params"]["scroff"] == 0


def test_display_off_entity_on_screen_devices():
    for dtype in ("cb", "st"):
        fields = {d.field for d in build_device_entities(
            {"mac": MAC, "type": dtype}, blocks={"sys"}, slot="x")}
        assert "display_off" in fields


def test_display_off_entity_not_on_strips():
    fields = {d.field for d in build_device_entities(
        {"mac": MAC, "type": "ps10"}, blocks={"power"}, slot="ac10")}
    assert "display_off" not in fields
