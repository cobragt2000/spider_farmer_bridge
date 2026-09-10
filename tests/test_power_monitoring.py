"""Power monitoring for the S-Station / metered plugs (v3.19.258).
The outlet block carries vRms/aRms/wattP/energy; vRms & wattP map 1:1 to the SF
app, aRms is centi-amps (÷100), energy is Wh -> kWh (÷1000)."""

from custom_components.sf.proxy.normalizer import _decode_outlets
from custom_components.sf.entity_defs import build_device_entities, EVIDENCE_BLOCKS


def test_power_monitoring_decode():
    out: dict = {}
    e = "0a1b2c3d4e17"
    outlet = {"psmode": 1, "psModel": 0, "vRms": 117, "aRms": 4,
              "wattP": 0, "energy": 10, "O1": {"on": 0}}
    _decode_outlets(out, e, outlet)
    assert out[f"ggs/ha/{e}/pm_voltage/state"] == "117"      # 1:1 volts
    assert out[f"ggs/ha/{e}/pm_power/state"] == "0"          # 1:1 watts
    assert out[f"ggs/ha/{e}/pm_current/state"] == "0.04"     # 4 centi-amps -> 0.04 A
    assert out[f"ggs/ha/{e}/pm_energy/state"] == "0.010"     # 10 Wh -> 0.010 kWh
    assert out[f"ggs/ha/{e}/outlet_1/state"] == "OFF"        # still decodes outlets


def test_power_monitoring_absent_when_not_reported():
    out: dict = {}
    _decode_outlets(out, "aabbccddeeff", {"O1": {"on": 1}})
    assert not any("pm_" in k for k in out)


def test_power_is_an_evidence_block():
    assert "power" in EVIDENCE_BLOCKS


def test_power_entities_created_from_evidence():
    defs = build_device_entities(
        {"mac": "0A1B2C3D4E17", "type": "st"}, blocks={"power"}, slot="st1")
    fields = {d.field for d in defs}
    assert {"pm_power", "pm_voltage", "pm_current", "pm_energy"} <= fields


def test_power_entities_absent_without_evidence():
    defs = build_device_entities(
        {"mac": "0A1B2C3D4E17", "type": "st"}, blocks={"light"}, slot="st1")
    assert not any(d.field.startswith("pm_") for d in defs)
