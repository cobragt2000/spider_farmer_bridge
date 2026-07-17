"""Write path: editable air + soil calibration and substrate offsets are
translated into setConfigField messages (read-modify-write, correct units)."""
from custom_components.sf.proxy.command_handler import translate_command

MAC = "0a1b2c3d4e01"
UID = "u1"


def _air(field, value, cal_cfg):
    return translate_command(field, value, MAC, UID, cal_cfg=cal_cfg)


def _soil(field, value, senconfig):
    return translate_command(field, value, MAC, UID, senconfig=senconfig)


# ── Air calibration (top-level ["calibration"] block) ────────────────────────

def test_air_temp_offset_f_to_c_rmw():
    cal = {"temp": 1.0, "humi": 2.0, "co2": 3, "ppfd": 4.0}
    msg = _air("cal_air_temp", "0.5", cal)
    assert msg["method"] == "setConfigField"
    assert msg["params"]["keyPath"] == ["calibration"]
    block = msg["params"]["calibration"]
    assert block["temp"] == round(0.5 * 5 / 9, 4)   # degF offset -> degC
    # other fields preserved (read-modify-write)
    assert block["humi"] == 2.0 and block["co2"] == 3 and block["ppfd"] == 4.0


def test_air_humi_direct():
    msg = _air("cal_air_humidity", "-3.5", {"temp": 0, "humi": 0, "co2": 0, "ppfd": 0})
    assert msg["params"]["calibration"]["humi"] == -3.5


def test_air_ppfd_is_direct_micromol_not_percent():
    msg = _air("cal_ppfd", "-2.5", {"temp": 0, "humi": 0, "co2": 0, "ppfd": 0})
    assert msg["params"]["calibration"]["ppfd"] == -2.5   # NOT scaled to a %


def test_air_co2_integer_step():
    msg = _air("cal_co2", "100", {"temp": 0, "humi": 0, "co2": 0, "ppfd": 0})
    assert msg["params"]["calibration"]["co2"] == 100


def test_air_cal_defaults_when_uncached():
    msg = _air("cal_air_humidity", "1.0", None)
    block = msg["params"]["calibration"]
    assert block == {"temp": 0, "humi": 1.0, "co2": 0, "ppfd": 0}


# ── Soil calibration + substrate (["device","senConfig"] array) ──────────────

def _sen():
    return [
        {"id": "AA01", "type": 2, "soilType": 1,
         "calibration": {"tempSoil": 0.0, "humiSoil": 0.0, "ECSoil": 0.0}},
        {"id": "BB02", "type": 2, "soilType": 0,
         "calibration": {"tempSoil": 9.9, "humiSoil": 8.8, "ECSoil": 1.1}},
    ]


def test_soil_temp_offset_rmw_preserves_other_probe():
    msg = _soil("soil_AA01_cal_temp", "0.9", _sen())
    assert msg["params"]["keyPath"] == ["device", "senConfig"]
    arr = msg["params"]["senConfig"]
    a = next(e for e in arr if e["id"] == "AA01")
    b = next(e for e in arr if e["id"] == "BB02")
    assert a["calibration"]["tempSoil"] == round(0.9 * 5 / 9, 4)
    assert a["soilType"] == 1                       # untouched
    # the OTHER probe is preserved verbatim
    assert b["calibration"] == {"tempSoil": 9.9, "humiSoil": 8.8, "ECSoil": 1.1}


def test_soil_moisture_and_ec_direct():
    m = _soil("soil_AA01_cal_moisture", "-4.0", _sen())
    e = _soil("soil_AA01_cal_ec", "2.5", _sen())
    assert next(x for x in m["params"]["senConfig"] if x["id"] == "AA01")["calibration"]["humiSoil"] == -4.0
    assert next(x for x in e["params"]["senConfig"] if x["id"] == "AA01")["calibration"]["ECSoil"] == 2.5


def test_substrate_label_to_index():
    for label, idx in (("Clay soil", 0), ("Coco coir", 1), ("Peat soil", 2)):
        msg = _soil("soil_BB02_substrate", label, _sen())
        assert next(x for x in msg["params"]["senConfig"] if x["id"] == "BB02")["soilType"] == idx


def test_substrate_unknown_option_drops():
    assert _soil("soil_AA01_substrate", "Gravel", _sen()) is None


def test_soil_write_refused_when_uncached():
    # A partial array would wipe the other probes — refuse until senConfig seen.
    assert _soil("soil_AA01_cal_temp", "1.0", None) is None
    assert _soil("soil_AA01_cal_temp", "1.0", []) is None


def test_soil_write_unknown_serial_drops():
    assert _soil("soil_ZZ99_cal_temp", "1.0", _sen()) is None
