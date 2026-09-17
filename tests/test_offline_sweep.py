"""Device offline heartbeat sweep (v3.19.320).

A controller self-reports every ~6-10s. If it goes silent past the configurable
offline_timeout, the sweep flips it to unavailable (fast detection of a hard
power/Wi-Fi loss that never sends a clean disconnect); a frame brings it back."""

import time

from custom_components.sf.proxy.mitm_proxy import MITMProxy, ProxySession


class _FakeMqtt:
    def __init__(self):
        self.published = []

    def publish(self, topic, payload, retain=False, qos=0):
        self.published.append((topic, payload))


def _proxy_with_session(mac="0a1b2c3d4e01"):
    mq = _FakeMqtt()
    proxy = MITMProxy.__new__(MITMProxy)
    proxy._sessions = {}
    proxy.offline_timeout = 0.0
    sess = ProxySession(mac, mq)
    proxy._sessions[mac] = sess
    return proxy, sess, mq


def _avail(mq):
    return [(t, p) for (t, p) in mq.published if t.endswith("/availability")]


def test_sweep_disabled_does_nothing():
    proxy, sess, mq = _proxy_with_session()
    sess.last_frame_at = time.monotonic() - 999   # ancient
    proxy.offline_timeout = 0                      # disabled
    proxy._offline_sweep_once()
    assert _avail(mq) == []
    assert sess._stale_offline is False


def test_sweep_marks_offline_after_timeout():
    proxy, sess, mq = _proxy_with_session()
    proxy.offline_timeout = 30
    sess.last_frame_at = time.monotonic() - 40     # silent 40s > 30s
    proxy._offline_sweep_once()
    assert _avail(mq)[-1][1] == "offline"
    assert sess._stale_offline is True


def test_sweep_within_timeout_stays_online():
    proxy, sess, mq = _proxy_with_session()
    proxy.offline_timeout = 30
    sess.last_frame_at = time.monotonic() - 10     # only 10s silent
    proxy._offline_sweep_once()
    assert _avail(mq) == []
    assert sess._stale_offline is False


def test_sweep_marks_offline_only_once():
    proxy, sess, mq = _proxy_with_session()
    proxy.offline_timeout = 30
    sess.last_frame_at = time.monotonic() - 40
    proxy._offline_sweep_once()
    proxy._offline_sweep_once()                    # second pass — no duplicate
    assert len(_avail(mq)) == 1
