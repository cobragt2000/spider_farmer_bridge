"""Optional bundled Lovelace cards (opt-in via Settings).

When the user ticks "Install Spider Farmer dashboard card" the integration
serves the bundled cards in ``cards/`` and makes them available on the HA
frontend two ways, for maximum compatibility:

  1. Registers them in Lovelace's resource collection (storage-mode
     dashboards) — the same mechanism the "Add resource" UI and HACS use.
  2. Adds them as frontend extra-module URLs — covers YAML-mode dashboards
     and loads the element in the app shell.

Unticking removes both, so the cards stop loading on the next page load.

Bundled cards:
  • spider-farmer-card.js  -> custom:spider-farmer-card  (tent overview + config)
  • ppfd-3d-card.js         -> custom:ppfd-3d-card        (3D PPFD visualizer;
    loads three.js r128 from cdnjs at runtime, so its 3D view needs internet)
"""
from __future__ import annotations

import logging
import os

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# URL base the cards are served under (each file gets ?v=<version> appended).
URL_BASE = "/sf_bridge_frontend"
_BUNDLE_DIR = os.path.join(os.path.dirname(__file__), "cards")
CARD_FILES = ("spider-farmer-card.js", "ppfd-3d-card.js")
_STATIC_FLAG = "sf_card_static_registered"
_EXTRA_MODULE_KEY = "frontend_extra_module_url"


def _present_cards() -> list[str]:
    """CARD_FILES that actually exist in the bundle dir."""
    return [f for f in CARD_FILES if os.path.isfile(os.path.join(_BUNDLE_DIR, f))]


def card_url(filename: str, version: str) -> str:
    """Served URL with a version query so browsers refetch on each release."""
    return f"{URL_BASE}/{filename}?v={version}"


async def _ensure_static_path(hass: HomeAssistant) -> None:
    """Serve the cards/ dir once per HA process."""
    if hass.data.get(_STATIC_FLAG):
        return
    try:
        from homeassistant.components.http import StaticPathConfig

        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, _BUNDLE_DIR, False)]
        )
    except ImportError:
        hass.http.register_static_path(URL_BASE, _BUNDLE_DIR, False)
    except (RuntimeError, ValueError) as exc:
        _LOGGER.debug("Static path register skipped: %s", exc)
    hass.data[_STATIC_FLAG] = True


def _lovelace_resources(hass: HomeAssistant):
    """Return the Lovelace ResourceStorageCollection, or None."""
    data = hass.data.get("lovelace")
    if data is None:
        return None
    res = getattr(data, "resources", None)
    if res is None and isinstance(data, dict):
        res = data.get("resources")
    return res


async def _add_lovelace_resources(hass: HomeAssistant, urls: list[str]) -> None:
    """Add/refresh the card URLs in the Lovelace resource list (storage mode).
    No-op (best-effort) in YAML resource mode, where it can't be edited."""
    res = _lovelace_resources(hass)
    if res is None:
        return
    try:
        if hasattr(res, "loaded") and not res.loaded:
            await res.async_load()
            res.loaded = True
    except Exception as exc:  # pragma: no cover
        _LOGGER.debug("Lovelace resources load skipped: %s", exc)
    try:
        items = list(res.async_items())
    except Exception as exc:
        _LOGGER.debug("Lovelace resources unavailable (YAML mode?): %s", exc)
        return
    for url in urls:
        base = url.split("?")[0]
        found = next(
            (i for i in items if str(i.get("url", "")).split("?")[0] == base), None
        )
        try:
            if found is None:
                await res.async_create_item({"res_type": "module", "url": url})
                _LOGGER.info("Registered Lovelace resource %s", url)
            elif found.get("url") != url:
                await res.async_update_item(found["id"], {"url": url})
        except Exception as exc:  # YAML mode / unsupported — fall back to js_url
            _LOGGER.debug("Lovelace resource add skipped for %s: %s", url, exc)


async def _remove_lovelace_resources(hass: HomeAssistant, bases: set[str]) -> None:
    res = _lovelace_resources(hass)
    if res is None:
        return
    try:
        items = list(res.async_items())
    except Exception:
        return
    for i in items:
        if str(i.get("url", "")).split("?")[0] in bases:
            try:
                await res.async_delete_item(i["id"])
                _LOGGER.info("Removed Lovelace resource %s", i.get("url"))
            except Exception as exc:
                _LOGGER.debug("Lovelace resource remove skipped: %s", exc)


async def async_register_card(hass: HomeAssistant, version: str) -> None:
    """Serve + register the bundled cards. Idempotent and best-effort."""
    files = _present_cards()
    if not files:
        _LOGGER.warning(
            "No Spider Farmer card bundles found in %s; nothing installed",
            _BUNDLE_DIR,
        )
        return

    await _ensure_static_path(hass)
    urls = [card_url(f, version) for f in files]

    # Primary: Lovelace resource collection (storage-mode dashboards).
    await _add_lovelace_resources(hass, urls)

    # Fallback/also: frontend extra-module URLs (YAML mode + app shell).
    try:
        from homeassistant.components import frontend

        for url in urls:
            frontend.add_extra_js_url(hass, url)
    except KeyError:
        _LOGGER.debug("Frontend extra-module registry not ready")

    _LOGGER.info(
        "Spider Farmer Lovelace cards installed: %s (v%s)", ", ".join(files), version
    )


async def async_unregister_card(hass: HomeAssistant, version: str) -> None:
    """Stop loading the cards: remove them from the Lovelace resource list and
    the frontend extra-module list. The served static route stays (harmless)."""
    bases = {f"{URL_BASE}/{f}" for f in CARD_FILES}
    await _remove_lovelace_resources(hass, bases)

    mgr = hass.data.get(_EXTRA_MODULE_KEY)
    if mgr is not None:
        active = getattr(mgr, "urls", ())
        for f in CARD_FILES:
            url = card_url(f, version)
            try:
                if url in active:
                    mgr.remove(url)
            except Exception as exc:
                _LOGGER.debug("Card js_url removal skipped for %s: %s", f, exc)
