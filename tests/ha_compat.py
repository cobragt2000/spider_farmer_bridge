"""Version-independent helpers for the test suite.

Test plugin: Home Assistant 2026.11+ ships its own ``pytest-homeassistant``
(module ``pytest_homeassistant``); older cores use the community
``pytest-homeassistant-custom-component``. Tests import MockConfigEntry and
mock_restore_cache from here, so the suite runs with either.

Registry lookups:

``DeviceRegistry.async_get_device`` is deprecated on newer HA cores (device
identifiers are only unique per config entry) and raises when called from test
code, which has no integration frame. ``device_by_ident`` mirrors
``bus._dev_by_ident``: the entry-scoped ``async_get_device_by_identifier`` where
the core has it, ``async_get_device`` on older cores.
"""

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from custom_components.sf.const import DOMAIN

try:  # Home Assistant 2026.11+
    from pytest_homeassistant.common import MockConfigEntry, mock_restore_cache
except ImportError:  # older cores: community plugin
    from pytest_homeassistant_custom_component.common import (  # type: ignore[no-redef]
        MockConfigEntry,
        mock_restore_cache,
    )

__all__ = ["MockConfigEntry", "device_by_ident", "mock_restore_cache"]


def device_by_ident(hass: HomeAssistant, identifier: str):
    """Return our device whose identifier is ``(DOMAIN, identifier)``, or None."""
    ident = (DOMAIN, identifier)
    reg = dr.async_get(hass)
    lookup = getattr(reg, "async_get_device_by_identifier", None)
    if lookup is None:
        return reg.async_get_device(identifiers={ident})
    for entry in hass.config_entries.async_entries(DOMAIN):
        if (device := lookup(ident, entry.entry_id)) is not None:
            return device
    return None
