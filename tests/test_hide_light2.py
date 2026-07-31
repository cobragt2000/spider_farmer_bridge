"""Light 2 / Fan are auto-created; hiding one is opt-in (3.19.91).

build_device_entities() creates the two toggleable blocks (light2, fan) from
evidence like everything else. A per-device decision passed via `toggles` only
matters to HIDE one: only an explicit False suppresses it; True or a missing
key both create (when the block is reported).
"""
from custom_components.sf.entity_defs import build_device_entities, TOGGLEABLE_BLOCKS

# A display panel (cb) — capable of both a 2nd light and a fan/blower.
CFG = {"mac": "0A1B2C3D4E01", "type": "cb"}


def _fields(defs):
    return {d.field for d in defs}


def test_toggleable_blocks_are_exactly_light2_and_fan():
    assert set(TOGGLEABLE_BLOCKS) == {"light2", "fan"}


def test_no_toggles_creates_everything():
    fields = _fields(build_device_entities(CFG))
    assert "light_2" in fields
    assert "light_1" in fields
    assert "fan" in fields


def test_missing_decision_defaults_on():
    """A decision dict that omits a block still creates it (default-on)."""
    fields = _fields(build_device_entities(CFG, toggles={"light2": True}))
    assert "light_2" in fields          # explicit True
    assert "fan" in fields              # missing → still created


def test_empty_toggles_creates_both():
    fields = _fields(build_device_entities(CFG, toggles={}))
    assert "light_2" in fields
    assert "fan" in fields


def test_explicit_false_hides_only_that_accessory():
    defs = build_device_entities(CFG, toggles={"light2": False})
    fields = _fields(defs)
    assert not any(f.startswith("light_2") for f in fields)  # hidden
    assert "light_1" in fields          # 1st light untouched
    assert "fan" in fields              # fan untouched (not hidden)


def test_hiding_is_scoped_to_that_accessory():
    full = _fields(build_device_entities(CFG))
    hidden = _fields(build_device_entities(CFG, toggles={"light2": False, "fan": False}))
    removed = full - hidden
    assert removed
    assert all(f.startswith("light_2") or f.startswith("fan") for f in removed)
    # Blower is not toggleable — survives regardless.
    assert "blower" in hidden
