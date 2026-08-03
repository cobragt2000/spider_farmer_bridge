"""Reconnect availability race (3.19.98).

A controller periodically drops its TLS socket and immediately reconnects. The
reconnect reuses the SAME ProxySession object (bind_session just refreshes its
writers to the new socket), so the old connection's teardown still saw
``self._sessions[mac] is sess`` as true and published availability "offline" +
evicted the live session. The device then latched **offline** in HA even though
getDevSta frames kept relaying fine on the new socket, and it never recovered
because no fresh CONNECT followed.

The teardown now only fires for the connection that still owns the session's
client writer, so a superseded (old) connection leaves the live session alone.
"""
import pytest
from homeassistant.core import HomeAssistant

from custom_components.sf.const import DOMAIN, DATA_BUS, DATA_PROXY
from custom_components.sf.proxy.mitm_proxy import ProxySession

MAC = "0A1B2C3D4E01"
MAC_LC = "0a1b2c3d4e01"


@pytest.fixture(autouse=True)
def _enable(enable_custom_integrations):
    yield


class _FakeWriter:
    def __init__(self):
        self.closed = False

    def write(self, _data):
        pass

    async def drain(self):
        pass

    def close(self):
        self.closed = True


async def _setup(hass):
    from pytest_homeassistant_custom_component.common import MockConfigEntry
    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge",
        data={"listen_port": 18991, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        unique_id=DOMAIN,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_reconnect_does_not_latch_offline(hass: HomeAssistant):
    entry = await _setup(hass)
    bus = hass.data[DOMAIN][entry.entry_id][DATA_BUS]
    proxy = hass.data[DOMAIN][entry.entry_id][DATA_PROXY]

    # Connection A comes up: session created, device online.
    writer_a = _FakeWriter()
    sess = ProxySession(MAC, bus)
    sess.set_client(writer_a)
    proxy._sessions[MAC_LC] = sess
    sess.publish_availability("online")
    await hass.async_block_till_done()
    assert bus.device_online(MAC_LC) is True

    # Controller reconnects (fresh socket). bind_session reuses the SAME session
    # object and refreshes its writer to B; availability re-published online.
    writer_b = _FakeWriter()
    sess.set_client(writer_b)
    sess.publish_availability("online")
    await hass.async_block_till_done()

    # Connection A now tears down. It is superseded (writer replaced by B), so it
    # must NOT evict the live session nor flip the device offline.
    proxy._teardown_session(sess, writer_a)
    await hass.async_block_till_done()
    assert proxy._sessions.get(MAC_LC) is sess, "live session wrongly evicted"
    assert bus.device_online(MAC_LC) is True, "device latched offline on reconnect"

    # A genuine disconnect of the CURRENT (B) connection does tear down.
    proxy._teardown_session(sess, writer_b)
    await hass.async_block_till_done()
    assert MAC_LC not in proxy._sessions
    assert bus.device_online(MAC_LC) is False
