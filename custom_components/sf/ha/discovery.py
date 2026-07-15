"""
ha/discovery.py — Spider Farmer Bridge (adapter)
=================================================
Thin adapter the proxy calls to turn device detections into native HA
entities. proxy/mitm_proxy.py imports these functions; each routes to the
SfBus, keeping the proxy decoupled from the HA entity layer.
"""
from __future__ import annotations

import logging
from typing import Any

from ..entity_defs import (  # re-exported for mitm_proxy imports
    HA_STATUS_TOPIC,
    _mac,
    _capabilities,
    _device_name,
)

_LOGGER = logging.getLogger(__name__)

__all__ = [
    "HA_STATUS_TOPIC",
    "_mac",
    "_capabilities",
    "_device_name",
    "publish_discovery_for_device",
    "publish_soil_sensor_discovery",
    "unpublish_outlet_discovery",
    "cleanup_stale_discovery",
]


def publish_discovery_for_device(client: Any, device_id: str, device_cfg: dict) -> None:
    """Register a device native entities on the bus."""
    client.register_device(device_cfg)
    _LOGGER.debug(
        "Registered native entities for %s (%s)",
        _device_name(device_cfg), device_id,
    )


def publish_soil_sensor_discovery(
    client: Any, mac_raw: str, sensor_id: str, device_cfg: dict
) -> None:
    client.register_soil(mac_raw, str(sensor_id), device_cfg)
    _LOGGER.debug("Registered soil probe %s on %s", sensor_id, mac_raw)


def unpublish_outlet_discovery(client: Any, mac_raw: str, outlet_num: int) -> None:
    client.prune_outlet(mac_raw, outlet_num)


def cleanup_stale_discovery(client: Any, mac_raw: str) -> None:
    """No retained MQTT topics exist anymore — nothing to clean."""
    return
