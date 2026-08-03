"""Local-only fallback: the proxy acts as the MQTT broker when the cloud is
unreachable, so HA keeps read + control without internet (3.19.96).
"""
import asyncio
import json

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.sf.const import DOMAIN, DATA_PROXY
from custom_components.sf.proxy.mqtt_parser import (
    _encode_varint, build_publish, parse_packets,
    MQTT_CONNACK, MQTT_SUBACK, MQTT_PUBACK, MQTT_PINGRESP,
)

MAC = "0A1B2C3D4E20"
MAC_LC = "0a1b2c3d4e20"


@pytest.fixture(autouse=True)
def _e(enable_custom_integrations):
    yield


def _mstr(s: str) -> bytes:
    b = s.encode()
    return len(b).to_bytes(2, "big") + b


def _connect(cid: str) -> bytes:
    var = _mstr("MQTT") + b"\x04\x02\x00\x3c" + _mstr(cid)
    return b"\x10" + _encode_varint(len(var)) + var


def _subscribe(topic: str, pid: int = 1) -> bytes:
    var = pid.to_bytes(2, "big") + _mstr(topic) + b"\x00"
    return b"\x82" + _encode_varint(len(var)) + var


_PINGREQ = b"\xc0\x00"


class _Reader:
    def __init__(self, chunks):
        self._c = list(chunks)
        self._eof = False

    async def read(self, n):
        await asyncio.sleep(0)
        if self._c:
            return self._c.pop(0)
        self._eof = True
        return b""

    def at_eof(self):
        return self._eof


class _Writer:
    def __init__(self):
        self.data = bytearray()

    def write(self, b):
        self.data += b

    async def drain(self):
        await asyncio.sleep(0)

    def get_extra_info(self, _key):
        return ("10.0.0.9", 1)

    def close(self):
        pass

    async def wait_closed(self):
        await asyncio.sleep(0)


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18990, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_local_broker_answers_handshake_and_processes_state(hass: HomeAssistant):
    entry = await _setup(hass)
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]

    # A ps10 getDevSta the controller self-reports, plus a QoS-1 publish.
    up = build_publish(
        f"SF/GGS/CB/API/UP/{MAC}",
        json.dumps({"method": "getDevSta", "uid": "u", "data": {"outlet": {
            "psmode": 0, **{f"O{n}": {"on": 0} for n in range(1, 11)}}}}).encode(),
    )
    up_qos1 = build_publish(
        f"SF/GGS/CB/API/UP/{MAC}",
        json.dumps({"method": "getSysSta", "uid": "u", "data": {}}).encode(),
        qos=1, packet_id=5,
    )
    reader = _Reader([
        _connect(MAC),
        _subscribe(f"SF/GGS/CB/API/DOWN/{MAC}"),
        _PINGREQ,
        up, up_qos1,
    ])
    writer = _Writer()

    await proxy._serve_local(reader, writer, ("10.0.0.9", 12345), [None])
    await hass.async_block_till_done()

    pkts, _ = parse_packets(bytes(writer.data))
    types = [p.packet_type for p in pkts]
    # Broker answered the handshake + keep-alive + QoS-1 ack.
    assert MQTT_CONNACK in types
    assert MQTT_SUBACK in types
    assert MQTT_PINGRESP in types
    assert MQTT_PUBACK in types

    # The self-reported state was decoded into HA entities — control works
    # without any cloud connection.
    reg = er.async_get(hass)
    uids = {e.unique_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)}
    assert f"ggs_{MAC_LC}_outlet_1" in uids
    # And the session is tracked (so HA command injection targets it).
    assert MAC_LC in proxy._sessions


async def test_block_cloud_forces_local_and_skips_upstream(hass, monkeypatch):
    """With Block Cloud on, handle_client goes straight to local mode and never
    opens an upstream connection to the Spider Farmer cloud."""
    entry = await _setup(hass)
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]
    proxy.block_cloud = True

    served = []

    async def _fake_serve(cr, cw, peer, sref):
        served.append(peer)

    async def _boom(*a, **k):
        raise AssertionError("upstream must not be opened when block_cloud is on")

    monkeypatch.setattr(proxy, "_serve_local", _fake_serve)
    monkeypatch.setattr(asyncio, "open_connection", _boom)

    await proxy.handle_client(_Reader([]), _Writer())
    assert served, "block_cloud should route the controller to local mode"
