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

# 3) HA's camera component hard-imports optional native deps (turbojpeg, av, …)
#    at module load on newer cores. The time-lapse tests fully mock
#    `homeassistant.components.camera.async_get_image` (and timelapse.py imports
#    it lazily), so they never exercise the real component — but monkeypatching
#    that attribute forces the import, which fails in CI where those native deps
#    aren't installed (e.g. `No module named 'turbojpeg'`). If the real module
#    can't be imported, register a minimal stub exposing `async_get_image` so the
#    suite runs without the heavy dependency chain. When the real module imports
#    fine (older cores, or a fully-provisioned env) this is a no-op.
import sys as _sys  # noqa: E402
import types as _types  # noqa: E402

try:  # pragma: no cover - outcome depends on which optional deps are installed
    import homeassistant.components.camera  # noqa: F401
except Exception:  # ImportError, or any optional-dep failure in the chain
    _camera_stub = _types.ModuleType("homeassistant.components.camera")

    async def _stub_async_get_image(*args, **kwargs):
        # Every test that reaches capture overrides this via monkeypatch; if one
        # doesn't, fail loudly rather than silently returning None.
        raise RuntimeError(
            "camera stub: async_get_image was not mocked in this test"
        )

    _camera_stub.async_get_image = _stub_async_get_image
    _sys.modules["homeassistant.components.camera"] = _camera_stub
    # Also bind it on the parent package: monkeypatch's dotted-path lookup walks
    # attributes (homeassistant.components -> .camera), and a module that is only
    # in sys.modules isn't reachable that way (pytest 8+: "module
    # 'homeassistant.components' has no attribute 'camera'").
    import homeassistant.components as _components

    _components.camera = _camera_stub


@pytest.fixture(autouse=True)
def enable_sockets(socket_enabled):
    """The integration binds a real TCP listener during setup."""
    yield


# 3.19.91: Light 2 / Fan create automatically (default-on); a test only needs
# to set options["components"][mac][block] = False to hide one. No confirm-first
# gate, so the device-simulation tests need no special fixture here.


@pytest.fixture(autouse=True)
def _default_temp_unit():
    """Temperatures follow the HA unit system (3.19.80). ``set_unit`` mutates a
    module global, so reset it to °F before every test: pure-function tests are
    then deterministic (the historical imperial path), and no test inherits a
    unit left set by an earlier HA-setup test. HA-setup tests that want a
    specific unit set ``hass.config.units`` before setup (async_setup_entry
    re-reads it)."""
    import custom_components.sf.tempunits as _tu

    _tu.set_unit("°F")
    yield
    _tu.set_unit("°F")

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
