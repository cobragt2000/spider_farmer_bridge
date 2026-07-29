"""Temperature-unit handling (3.19.80).

Temperatures follow the HA unit system: the imperial path must be byte-for-byte
identical to the historical hardcoded-°F behaviour, and the metric path must be a
pure identity. The autouse ``_default_temp_unit`` fixture resets the module
global to °F before each test, so each metric test sets °C explicitly.
"""
import custom_components.sf.tempunits as tu
from custom_components.sf.proxy.normalizer import normalize_target

_MAC = "0A1B2C3D4E01"
_MAC_LC = "0a1b2c3d4e01"


def test_imperial_matches_legacy():
    tu.set_unit("°F")
    # absolute: round(c * 9/5 + 32)
    assert tu.c_to_disp(25) == 77
    assert tu.c_to_disp(17.2222) == 63
    assert round(tu.disp_to_c(77), 4) == 25.0
    # delta ndigits=0 returns an int (matches legacy round(x)), not 1.0
    assert tu.cdelta_to_disp(0.5556, 0) == 1
    assert isinstance(tu.cdelta_to_disp(0.5556, 0), int)
    assert tu.cdelta_to_disp(-0.2778, 1) == -0.5
    assert round(tu.dispdelta_to_c(0.5), 4) == 0.2778
    # entity-def bound literals unchanged
    assert tu.abs_bound(32) == 32 and tu.abs_bound(122) == 122
    assert tu.delta_bound(-18) == -18 and tu.delta_bound(18) == 18
    assert tu.unit() == "°F"


def test_metric_is_identity():
    tu.set_unit("°C")
    assert tu.c_to_disp(25) == 25
    assert tu.disp_to_c(25) == 25
    assert tu.cdelta_to_disp(2, 0) == 2
    assert tu.dispdelta_to_c(2) == 2
    # bounds convert the °F literals to whole °C
    assert tu.abs_bound(32) == 0 and tu.abs_bound(122) == 50
    assert tu.delta_bound(18) == 10
    assert tu.unit() == "°C"


def test_set_unit_parsing():
    tu.set_unit("°C"); assert tu.is_metric()
    tu.set_unit("°F"); assert not tu.is_metric()
    tu.set_unit("C"); assert tu.is_metric()
    tu.set_unit("F"); assert not tu.is_metric()


def test_bad_values_return_none():
    tu.set_unit("°F")
    assert tu.c_to_disp("x") is None
    assert tu.cdelta_to_disp(None) is None


def test_normalize_target_metric_stays_celsius():
    tu.set_unit("°C")
    target = {"temp": {"targetDay": 17.2222, "targetNight": 20.0, "deadband": 0.5556}}
    out = normalize_target(_MAC, target)
    e = _MAC_LC
    assert out[f"ggs/ha/{e}/env_temp_day/state"] == "17"       # °C, no +32
    assert out[f"ggs/ha/{e}/env_temp_night/state"] == "20"
    assert out[f"ggs/ha/{e}/env_temp_deadband/state"] == "1"   # round(0.5556)


def test_normalize_target_imperial_converts():
    tu.set_unit("°F")
    target = {"temp": {"targetDay": 17.2222, "deadband": 0.5556}}
    out = normalize_target(_MAC, target)
    e = _MAC_LC
    assert out[f"ggs/ha/{e}/env_temp_day/state"] == "63"       # 17.2222C -> 63F
    assert out[f"ggs/ha/{e}/env_temp_deadband/state"] == "1"   # 0.5556C -> 1F
