"""Outlet on/off live-status poll (v3.19.298).

After an outlet write, the proxy polls the LIVE getDevSta ~2s later so the switch
tile flips from the authoritative live `on` (not a config snapshot) in ~2s instead
of waiting for the next ~10s self-report. Deduped so rapid writes coalesce."""

import asyncio
import pytest

from custom_components.sf.proxy.mitm_proxy import ProxySession


def _sess():
    s = ProxySession.__new__(ProxySession)
    s.mac = "0a1b2c3d4e30"
    s.mac_raw = "0a1b2c3d4e30"
    s.uid = "9"
    s.confirm_delay = 0.0
    s._pending_confirms = set()
    return s


async def test_devsta_poll_injects_getdevsta():
    s = _sess()
    captured = []

    async def fake_inject(payload):
        captured.append(payload)

    s.inject = fake_inject
    s.schedule_devsta_poll()
    await asyncio.sleep(0.02)
    assert captured, "expected a live poll to be injected"
    assert captured[0]["method"] == "getDevSta"
    assert captured[0]["pid"] == "0a1b2c3d4e30"


async def test_devsta_poll_deduped():
    s = _sess()
    captured = []

    async def fake_inject(payload):
        captured.append(payload)

    s.inject = fake_inject
    s.schedule_devsta_poll()
    s.schedule_devsta_poll()   # second call while first pending -> coalesced
    await asyncio.sleep(0.02)
    assert len(captured) == 1
