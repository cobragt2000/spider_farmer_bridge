"""Soil calibration entity ids follow a dp-slot swap (3.19.103).

Earlier reconcile only re-homed the soil probe *sensors* on a slot change, not
the editable calibration numbers/selects — so two panels swapping dp1<->dp2 left
the cal entities stranded on the wrong panel (showing the other controller's
name). reconcile now handles them, while leaving the pinned VPD ids alone.
"""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf.const import DOMAIN
from custom_components.sf.bus import reconcile_registry_to_slots

MAC_A, MAC_B = "0a1b2c3d4e01", "0a1b2c3d4e02"   # A -> dp1, B -> dp2
SER_A, SER_B = "aaa1", "bbb2"


@pytest.fixture(autouse=True)
def _enable(enable_custom_integrations):
    yield


def _mk(reg, entry, domain, uid, object_id, name):
    e = reg.async_get_or_create(
        domain, DOMAIN, uid, suggested_object_id=object_id,
        config_entry=entry, original_name=name,
    )
    # Force the exact (possibly "wrong") entity id we want to start from.
    if e.entity_id != f"{domain}.{object_id}":
        reg.async_update_entity(e.entity_id, new_entity_id=f"{domain}.{object_id}")
    return f"{domain}.{object_id}"


async def test_soil_cal_ids_reconcile_and_vpd_pins_hold(hass: HomeAssistant):
    entry = MockConfigEntry(domain=DOMAIN, unique_id=DOMAIN, data={})
    entry.add_to_hass(hass)
    reg = er.async_get(hass)

    # Cal entities are SWAPPED: A's soil1 cal sits on dp2, B's on dp1.
    _mk(reg, entry, "number", f"ggs_{MAC_A}_soil_{SER_A}_cal_temp",
        "sf_dp2_soil1_cal_temp", "Soil 1 Temp Calibration")
    _mk(reg, entry, "number", f"ggs_{MAC_B}_soil_{SER_B}_cal_temp",
        "sf_dp1_soil1_cal_temp", "Soil 1 Temp Calibration")
    _mk(reg, entry, "select", f"ggs_{MAC_A}_soil_{SER_A}_substrate",
        "sf_dp2_soil1_substrate", "Soil 1 Substrate")
    # Pinned VPD ids whose display names differ from their ids — must NOT move.
    _mk(reg, entry, "sensor", f"ggs_{MAC_A}_vpd", "sf_dp1_vpd", "VPD Air")
    _mk(reg, entry, "sensor", f"ggs_{MAC_A}_leaf_vpd", "sf_dp1_leaf_vpd", "VPD Leaf")

    reconcile_registry_to_slots(
        hass,
        {MAC_A: "dp1", MAC_B: "dp2"},
        {SER_A: "soil1", SER_B: "soil1"},
    )
    await hass.async_block_till_done()

    # Cal + substrate ids now match their device's slot.
    assert reg.async_get("number.sf_dp1_soil1_cal_temp").unique_id == \
        f"ggs_{MAC_A}_soil_{SER_A}_cal_temp"
    assert reg.async_get("number.sf_dp2_soil1_cal_temp").unique_id == \
        f"ggs_{MAC_B}_soil_{SER_B}_cal_temp"
    assert reg.async_get("select.sf_dp1_soil1_substrate").unique_id == \
        f"ggs_{MAC_A}_soil_{SER_A}_substrate"

    # Pinned VPD ids untouched (not renamed to sf_dp1_vpd_air / _vpd_leaf).
    assert reg.async_get("sensor.sf_dp1_vpd").unique_id == f"ggs_{MAC_A}_vpd"
    assert reg.async_get("sensor.sf_dp1_leaf_vpd").unique_id == f"ggs_{MAC_A}_leaf_vpd"
    assert reg.async_get("sensor.sf_dp1_vpd_air") is None
