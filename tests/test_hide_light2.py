"""Hide Light 2 (integration option, 3.19.87).

build_device_entities(hide_light2=True) must not emit the Light 2 light, its
brightness sensor, or any of its light_2_* config entities — while leaving
Light 1 and everything else untouched. This is the gate the options-flow
"Hide Light 2" toggle drives; when set, HA never registers the phantom entity.
"""
from custom_components.sf.entity_defs import build_device_entities

# A display panel (cb) — has both light channels in its capability set.
CFG = {"mac": "0A1B2C3D4E01", "type": "cb"}


def _fields(defs):
    return {d.field for d in defs}


def test_light2_present_by_default():
    fields = _fields(build_device_entities(CFG))
    assert "light_2" in fields
    assert "light_1" in fields
    # A representative light_2 config entity is present too.
    assert any(f.startswith("light_2_") for f in fields)


def test_hide_light2_removes_all_light2_entities():
    defs = build_device_entities(CFG, hide_light2=True)
    fields = _fields(defs)
    # No Light 2 anything.
    assert not any(f == "light_2" or f.startswith("light_2") for f in fields)
    # Light 1 and its config entities survive.
    assert "light_1" in fields
    assert any(f.startswith("light_1_") for f in fields)


def test_hide_light2_only_affects_light2():
    """The hidden set is exactly the delta between the two builds."""
    full = _fields(build_device_entities(CFG))
    hidden = _fields(build_device_entities(CFG, hide_light2=True))
    removed = full - hidden
    assert removed  # something was removed
    assert all(f.startswith("light_2") for f in removed)
