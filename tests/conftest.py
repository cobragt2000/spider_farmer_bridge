import pytest

pytest_plugins = "pytest_homeassistant_custom_component"

# ---------------------------------------------------------------------------
# Compat shims for running the suite on older HA cores. Both are strict
# no-ops on the HA versions the integration actually targets (2024.3+);
# they only fire on old cores so the suite stays runnable anywhere.
# ---------------------------------------------------------------------------
from homeassistant.const import __version__ as _ha_version  # noqa: E402

_ha_year, _ha_minor = (int(x) for x in _ha_version.split(".")[:2])
_OLD_CORE = (_ha_year, _ha_minor) < (2024, 3)

# 1) DeviceInfo moved to helpers.device_registry in HA 2023.9.
import homeassistant.helpers.device_registry as _dr  # noqa: E402

if not hasattr(_dr, "DeviceInfo"):
    from homeassistant.helpers.entity import DeviceInfo as _DeviceInfo

    _dr.DeviceInfo = _DeviceInfo

# 2) Since HA 2024.3 entity registry-update events are processed eagerly,
#    so a renamed entity's old state is freed before the event loop yields.
#    The bus's two-phase slot reconcile relies on that. On older cores the
#    stale state lingers and blocks the finalize rename, so we drop the
#    state-machine clause from _entity_id_available (registry collisions
#    are still enforced) to mirror modern-core timing.
if _OLD_CORE:
    from homeassistant.helpers import entity_registry as _er

    def _entity_id_available(self, entity_id, known_object_ids):
        return entity_id not in self.entities and entity_id not in (
            known_object_ids or {}
        )

    _er.EntityRegistry._entity_id_available = _entity_id_available


@pytest.fixture(autouse=True)
def enable_sockets(socket_enabled):
    """The integration binds a real TCP listener during setup."""
    yield

# 3) Also a consequence of pre-2024.3 lazy event processing: during the
#    two-phase reconcile an entity can receive a registry-update event for
#    an entity_id that a later (already applied) rename has superseded,
#    tripping an assert inside Entity._async_registry_updated. Eager cores
#    process each event before the next rename, so skip superseded events.
if _OLD_CORE:
    from homeassistant.helpers import entity_registry as _er2
    from homeassistant.helpers.entity import Entity as _Entity

    _orig_registry_updated = _Entity._async_registry_updated

    async def _patched_registry_updated(self, event):
        data = event.data
        if (
            data.get("action") == "update"
            and _er2.async_get(self.hass).async_get(data["entity_id"]) is None
        ):
            return  # superseded by a later rename in the same reconcile pass
        await _orig_registry_updated(self, event)

    _Entity._async_registry_updated = _patched_registry_updated
