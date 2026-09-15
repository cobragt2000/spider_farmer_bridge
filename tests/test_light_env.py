"""'Light Env' outlet mode (v3.19.292) — an integration-driven outlet that
follows the environment/planting-plan day-cycle window: ON during the Day window
by default, or during Night. No device modeType; the device is held in Manual and
the bus toggles the socket."""

from custom_components.sf.smart_control import decide_light, ON, OFF
from custom_components.sf.entity_defs import (
    OUTLET_MODE_NAMES, OUTLET_MODE_TO_TYPE, OUTLET_VIRTUAL_MODES)
from custom_components.sf.proxy.command_handler import _OUTLET_MODE_TO_TYPE


def test_decide_light_day_direction():
    # direction "Day" (and the default) -> ON in day, OFF at night.
    assert decide_light(True, "Day") == ON
    assert decide_light(False, "Day") == OFF
    assert decide_light(True, "") == ON       # default = Day
    assert decide_light(False, "") == OFF
    assert decide_light(True, None) == ON      # None tolerated


def test_decide_light_night_direction():
    assert decide_light(False, "Night") == ON
    assert decide_light(True, "Night") == OFF
    assert decide_light(False, "night") == ON  # case-insensitive


def test_light_env_is_a_selectable_outlet_mode():
    assert "Light Env" in OUTLET_MODE_NAMES
    assert "Light Env" in OUTLET_VIRTUAL_MODES


def test_light_env_is_not_a_device_modetype():
    # It must NOT map to a real device modeType in entity_defs (it's virtual)...
    assert "Light Env" not in OUTLET_MODE_TO_TYPE
    # ...but the command handler writes Manual (0) for it, so the device never
    # runs a stale schedule while the bus drives the socket.
    assert _OUTLET_MODE_TO_TYPE["Light Env"] == 0
