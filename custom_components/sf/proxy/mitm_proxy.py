"""
TLS man-in-the-middle proxy for GGS controllers.

Sits between each Spider Farmer GGS controller and the vendor cloud: it
terminates the controller's TLS connection with a locally-trusted server
certificate, opens its own verified TLS connection onward to the cloud, and
pumps bytes in both directions unchanged so the controller keeps working
normally. While relaying, it decodes the MQTT PUBLISH frames it sees and hands
them to the normalizer/entity layer, and it can inject its own control messages
into the controller connection.

Auto-detection: a controller's MQTT CONNECT client-id is its MAC address, so a
session is created per MAC on connect. The device type (CB / PS5 / PS10 / LC /
SE light) is inferred from the data blocks in the first few status frames, and
entities are created from that evidence rather than any pre-configured list.
"""

from __future__ import annotations

import asyncio
import json
import logging
import ssl
import time
from typing import Dict, Optional, Any


from .mqtt_parser import (
    parse_packets, build_publish,
    MQTT_PUBLISH, MQTT_CONNECT, MQTT_SUBSCRIBE,
)
from .normalizer import normalize_status
from ..diag import DIAG
from ..ha.discovery import (
    publish_discovery_for_device,
    publish_soil_sensor_discovery,
    unpublish_outlet_discovery,
    cleanup_stale_discovery,
    HA_STATUS_TOPIC,
    _mac, _capabilities,
)

_LOGGER = logging.getLogger(__name__)


# v3.4.0: NO accessory block is CB-exclusive — the AC5/AC10 power strips
# host lights, fans, blowers, heaters, humidifiers, dehumidifiers, air
# sensors, and soil probes just like a CB. The one wire-level
# discriminator is OUTLETS: only power strips have them (confirmed on real
# hardware — CBs never report an outlet block). Accessory blocks without
# outlets suggest a CB, tentatively; the retype path corrects a loaded
# strip whose outlet block arrives late.
_ACCESSORY_MARKERS = frozenset(
    ("fan", "blower", "sensor", "heater", "humidifier", "dehumidifier")
)

# Ambiguous evidence (outlets/lights only) is not trusted until this many
# getDevSta frames have been merged, or this much time has passed since the
# first frame — GGS controllers report every few seconds, so a partial
# first frame (the CB 4E01 misdetection) gets corrected before any
# entities are created.
_DETECT_MIN_FRAMES = 3
_DETECT_MAX_WAIT_SEC = 8.0


def _classify_evidence(evidence: set, max_outlet: int) -> tuple[Optional[str], bool]:
    """
    Classify accumulated getDevSta evidence.
    Returns (device_type, conclusive). Conclusive types are final; others
    are tentative and may be upgraded by later frames.

    v3.4.0 ordering: outlets first — they're the only strip-exclusive
    signal and win over any accessory blocks a loaded strip also reports.
    """
    if "selight" in evidence:
        return "se", True       # flat SE-light schema — nothing else has it
    if max_outlet > 5:
        return "ps10", True     # nothing else has >5 outlets
    if max_outlet >= 1:
        return "ps5", False     # tentative: may grow into a ps10
    if evidence & _ACCESSORY_MARKERS:
        return "cb", False      # tentative: a strip's outlets may be late
    if "light" in evidence or "light2" in evidence:
        return "lc", False
    return None, False


def _senconfig_from(d):
    """Locate the senConfig list in a getConfigField / getConfigFile payload:
    getConfigField ["device","senConfig"] -> data.senConfig; getConfigFile ->
    data.configFile.senConfig (or .configFile.device.senConfig)."""
    if not isinstance(d, dict):
        return None
    if isinstance(d.get("senConfig"), list):
        return d["senConfig"]
    cf = d.get("configFile")
    if isinstance(cf, dict):
        if isinstance(cf.get("senConfig"), list):
            return cf["senConfig"]
        dev = cf.get("device")
        if isinstance(dev, dict) and isinstance(dev.get("senConfig"), list):
            return dev["senConfig"]
    return None


def _calibration_from(d):
    """Air-sensor calibration block: getConfigField ["calibration"] ->
    data.calibration; getConfigFile -> data.configFile.calibration."""
    if not isinstance(d, dict):
        return None
    c = d.get("calibration")
    if isinstance(c, dict):
        return c
    cf = d.get("configFile")
    if isinstance(cf, dict) and isinstance(cf.get("calibration"), dict):
        return cf["calibration"]
    return None


class ProxySession:
    """One active GGS Controller connection."""

    def __init__(self, mac_raw: str, mqtt_client: Any):
        self.mac_raw        = mac_raw           # raw MAC from CONNECT client_id
        self.mac            = _mac(mac_raw)     # lowercase, no colons
        self.uid            = ""
        self.device_type    = None              # detected on first data frame
        self.device_cfg: dict = {}              # populated once type is known
        self.mqtt_client    = mqtt_client
        self.down_topic_prefix = "CB"
        self._upstream_writer: Optional[asyncio.StreamWriter] = None
        self._client_writer:   Optional[asyncio.StreamWriter] = None
        self._discovery_published = False
        self._outlet_discovery_pruned = False
        self._known_soil_ids: set = set()
        # Type-detection evidence, merged across getDevSta frames
        self.evidence: set = set()
        self.outlets_seen: set = set()
        self.max_outlet_seen: int = 0
        self.frames_seen: int = 0
        self.first_frame_at: float = 0.0
        self.type_conclusive: bool = False
        self._created_at: float = time.monotonic()
        self._last_discovery_at: float = 0.0
        self.device_state: Dict[str, dict] = {}
        self.se_config: Dict[str, Any] = {}          # SE light configFile.light cache
        self.outlet_cfg: Dict[str, dict] = {}        # "{block}/O{n}" -> full outlet config
        self.env_cfg: dict = {}                      # environment "target" block cache
        self.last_nonzero_level: Dict[str, int] = {}
        self.fan_state:   Dict[str, dict] = {}
        self.light_state: Dict[str, dict] = {}
        # Echo-triggered config confirm polling (v3.0.5)
        self.confirm_delay: float = 2.0
        self._pending_confirms: set = set()
        self.initial_poll_task: Optional[asyncio.Task] = None

    def set_upstream(self, writer: asyncio.StreamWriter) -> None:
        self._upstream_writer = writer

    def set_client(self, writer: asyncio.StreamWriter) -> None:
        self._client_writer = writer

    @property
    def has_client(self) -> bool:
        return self._client_writer is not None

    async def inject(self, payload: dict) -> None:
        """Inject a command directly into the device's TLS connection."""
        if self._client_writer is None:
            _LOGGER.warning("[%s] inject: no device connection", self.mac)
            return
        topic = (
            f"SF/GGS/{self.down_topic_prefix}/API/DOWN/"
            f"{self.mac_raw.upper().replace(':', '')}"
        )
        raw = build_publish(
            topic=topic,
            message=json.dumps(payload, separators=(",", ":")).encode(),
        )
        try:
            self._client_writer.write(raw)
            await self._client_writer.drain()
            _LOGGER.info("[%s] injected: %s", self.mac, payload.get("params", {}))
            DIAG.inject(self.mac, payload)
            if payload.get("method") == "setConfigField":
                self.schedule_config_confirm(
                    (payload.get("params") or {}).get("keyPath")
                )
            elif payload.get("method") == "setConfigFile":
                self.schedule_configfile_confirm()
        except Exception as exc:
            _LOGGER.error("[%s] inject error: %s", self.mac, exc)

    def schedule_config_confirm(self, keypath, delay: Optional[float] = None) -> None:
        """A setConfigField just went to the device (from the SF app via the
        cloud, or from HA via inject). Poll that module's config shortly
        after so shakeLevel/natural/modeType update in seconds instead of
        waiting for the 10-minute poll."""
        if not keypath or not isinstance(keypath, (list, tuple)):
            return
        module_path = [str(x) for x in list(keypath)[:2]]  # poll whole module
        key = tuple(module_path)
        if key in self._pending_confirms:
            return
        self._pending_confirms.add(key)

        async def _confirm() -> None:
            try:
                await asyncio.sleep(self.confirm_delay if delay is None else delay)
                await self.inject({
                    "method": "getConfigField",
                    "pid":    self.mac_raw,
                    "params": {"keyPath": module_path},
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    self.uid,
                })
                _LOGGER.debug("[%s] confirm poll sent for %s", self.mac, module_path)
            except Exception as exc:
                _LOGGER.debug("[%s] confirm poll failed: %s", self.mac, exc)
            finally:
                self._pending_confirms.discard(key)

        asyncio.create_task(_confirm())

    def schedule_configfile_confirm(self, delay: Optional[float] = None) -> None:
        """A setConfigFile (SE-light schedule write) just went to the device
        — from the app via the cloud or from HA. Re-read the config file
        shortly after so HA's schedule entities update in seconds."""
        key = ("configFile",)
        if key in self._pending_confirms:
            return
        self._pending_confirms.add(key)

        async def _confirm() -> None:
            try:
                await asyncio.sleep(self.confirm_delay if delay is None else delay)
                await self.inject({
                    "method": "getConfigFile",
                    "pid":    self.mac_raw,
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    self.uid,
                })
            except Exception as exc:
                _LOGGER.debug("[%s] configFile confirm failed: %s", self.mac, exc)
            finally:
                self._pending_confirms.discard(key)

        asyncio.create_task(_confirm())

    def ensure_discovery(self) -> None:
        """Publish HA discovery — immediately on first connect, then every 60s.
        This ensures new entities appear after integration updates without
        requiring device reconnection."""
        if not self.device_type:
            return
        now = time.monotonic()
        if not self._discovery_published or (now - self._last_discovery_at) > 60.0:
            publish_discovery_for_device(
                self.mqtt_client, self.mac, self.device_cfg
            )
            cleanup_stale_discovery(self.mqtt_client, self.mac_raw)
            self._discovery_published = True
            self._last_discovery_at = now

    def publish_availability(self, status: str) -> None:
        # Per-device availability: one topic per MAC, rather than a single
        # meant a single device disconnecting (or crash-looping) marked
        # EVERY entity of every device unavailable.
        self.mqtt_client.publish(
            f"ggs/ha/{self.mac}/availability", status, retain=True, qos=1
        )


class MITMProxy:
    """
    Manages all active GGS Controller sessions and the HA MQTT bridge.
    """

    def __init__(
        self,
        config: dict,
        mqtt_client: Any,
        config_path: Optional[str] = None,
    ):
        self.config       = config
        self.mqtt_client  = mqtt_client
        self._config_path = config_path
        # Keyed by lowercase MAC (no colons)
        self._sessions: Dict[str, ProxySession] = {}
        # Cached upstream SSL context — built once in executor, not on event loop
        self._upstream_ssl_ctx: Optional[ssl.SSLContext] = None
        # Safety lock — commands are dropped unless explicitly enabled
        self.allow_control: bool = False
        # Republish discovery for this many seconds after startup
        self._start_time: float = time.monotonic()
        self._discovery_window_sec: float = 30.0

    def build_server_ssl_ctx(self) -> ssl.SSLContext:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
        ctx.load_cert_chain(
            certfile=self.config["proxy"]["cert_file"],
            keyfile=self.config["proxy"]["key_file"],
        )
        return ctx

    def _build_upstream_ssl_ctx(self) -> ssl.SSLContext:
        # Proxy -> cloud leg. The cloud serves a certificate signed by a
        # private CA that the system trust store doesn't know, so we verify
        # against that CA's public certificate, bundled with the integration.
        # Hostname verification stays enabled. This trust store is separate
        # from the device-facing certificate used on the controller leg.
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
        ctx.check_hostname = True
        ctx.verify_mode = ssl.CERT_REQUIRED
        ctx.load_verify_locations(cafile=self.config["proxy"]["upstream_ca_file"])
        return ctx

    async def async_build_upstream_ssl_ctx(self) -> ssl.SSLContext:
        """Return cached upstream SSL context, building it off the event loop if needed."""
        if self._upstream_ssl_ctx is None:
            loop = asyncio.get_event_loop()
            self._upstream_ssl_ctx = await loop.run_in_executor(
                None, self._build_upstream_ssl_ctx
            )
        return self._upstream_ssl_ctx

    async def config_poll_loop(self) -> None:
        """Periodic getConfigField poll (every 10 min by default)."""
        interval = int(
            self.config.get("proxy", {}).get("config_poll_interval_sec", 600)
        )
        if interval <= 0:
            return
        _LOGGER.info("Config poll loop started, interval=%ds", interval)
        while True:
            try:
                await asyncio.sleep(interval)
                for sess in list(self._sessions.values()):
                    await self._poll_session(sess)
            except asyncio.CancelledError:
                break
            except Exception as exc:
                _LOGGER.warning("Config poll error: %s", exc)
                await asyncio.sleep(30)

    async def _poll_session(self, sess: ProxySession) -> None:
        # Outlet config: poll the whole block(s) this device exposes so the
        # cache stays fresh for read-modify-write mode changes.
        outlet_blocks = []
        if sess.device_type in ("ps5", "ps10"):
            outlet_blocks = ["outlet"]
        ev = getattr(sess, "evidence", set())
        outlet_blocks += [b for b in ("ps5", "ps10") if b in ev]
        # Display panels also hold the environment target block.
        if sess.device_type == "cb":
            try:
                await sess.inject({
                    "method": "getConfigField", "pid": sess.mac_raw,
                    "params": {"keyPath": ["target"]},
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("env target poll failed: %s", exc)
        # Panels/strips: pull the whole config file so senConfig (soil names,
        # calibration, substrate) and the top-level air calibration arrive
        # reliably. The device does NOT answer targeted getConfigField reads
        # for ["calibration"] or ["device","senConfig"] — only the (app- or
        # here integration-triggered) getConfigFile returns them.
        if sess.device_type in ("cb", "ps5", "ps10"):
            try:
                await sess.inject({
                    "method": "getConfigFile", "pid": sess.mac_raw,
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("config file poll failed: %s", exc)
        for block in outlet_blocks:
            try:
                await sess.inject({
                    "method": "getConfigField", "pid": sess.mac_raw,
                    "params": {"keyPath": ["device", block]},
                    "msgId": str(int(time.time() * 1000)), "uid": sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("outlet cfg poll failed (%s): %s", block, exc)

        if sess.device_type == "se":
            # Standalone SE lights have no CB-style config tree — their
            # entire config is one getConfigFile document.
            try:
                await sess.inject({
                    "method": "getConfigFile",
                    "pid":    sess.mac_raw,
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("SE config poll failed: %s", exc)
            return
        for keypath in (
            ["device", "light"],  ["device", "light2"],
            ["device", "fan"],    ["device", "blower"],
            ["device", "heater"], ["device", "humidifier"],
            ["device", "dehumidifier"],
        ):
            try:
                await sess.inject({
                    "method": "getConfigField",
                    "pid":    sess.mac_raw,
                    "params": {"keyPath": keypath},
                    "msgId":  str(int(time.time() * 1000)),
                    "uid":    sess.uid,
                })
            except Exception as exc:
                _LOGGER.debug("poll inject failed for %s: %s", keypath, exc)
            await asyncio.sleep(0.5)

    def _strip_session_for_type(self, strip_type: str):
        """Reverse of _cb_host_for_strip: given a CB's ps5/ps10 block, find
        the connected standalone strip session that owns the HA entities."""
        for s in self._sessions.values():
            if getattr(s, "device_type", None) == strip_type and s.has_client:
                return s
        return None

    def _cb_host_for_strip(self, strip_type: str):
        """Return a connected CB session that is currently hosting a strip of
        this type (reports its ps5/ps10 block), or None. When present, outlet
        commands route through the CB — the confirmed app control path — using
        that block's keyPath; when absent, the strip is commanded directly.

        This is what makes routing automatic: plug the strip into a CB and
        HA commands follow the CB; run it standalone and they go direct."""
        if strip_type not in ("ps5", "ps10"):
            return None
        for s in self._sessions.values():
            if (
                getattr(s, "device_type", None) == "cb"
                and strip_type in getattr(s, "evidence", set())
                and s.has_client
            ):
                return s
        return None

    def host_cb_mac_for_strip(self, strip_mac: str):
        """Lowercase mac of the display panel currently hosting the power strip
        with this mac (the panel reports the strip's ps5/ps10 block), or None
        when the strip is standalone or unknown. Pairing is by strip type — the
        same signal that routes outlet commands — so it is unambiguous for one
        panel per strip type (the normal single-tent case)."""
        sess = None
        for s in self._sessions.values():
            if getattr(s, "mac", None) == strip_mac:
                sess = s
                break
        if sess is None:
            return None
        host = self._cb_host_for_strip(
            (getattr(sess, "device_type", "") or "").lower()
        )
        return host.mac if host is not None else None

    async def handle_command(self, topic: str, value: Any) -> None:
        """Handle an HA -> device command addressed by its topic."""
        # Command topics: ggs/ha/{mac}/{field}/set
        #                 or: ggs/ha/{mac}/{field}/{subfield}/set
        if isinstance(value, bytes):
            value = value.decode("utf-8", errors="replace")

        parts = topic.split("/")
        if len(parts) < 5:
            return
        mac_addr = parts[2]
        field    = parts[3]
        # ggs/ha/{mac}/{field}/set               → subfield=None
        # ggs/ha/{mac}/{field}/{subfield}/set    → subfield=parts[4]
        # ggs/ha/{mac}/{field}/{sub}/{subsub}/set → subfield="sub/subsub" (future)
        if len(parts) >= 6 and parts[-1] == "set":
            subfield = "/".join(parts[4:-1]) or None
        else:
            subfield = None

        sess = self._sessions.get(mac_addr)
        if sess is None:
            _LOGGER.warning("Command for mac=%s but no active session", mac_addr)
            return

        outlet_num = None
        outlet_subfield = None
        import re as _re
        om = _re.match(r"outlet_(\d+)(?:_(.+))?$", field)
        if om:
            n = int(om.group(1))
            if 1 <= n <= 10:
                outlet_num = n
                outlet_subfield = om.group(2)   # None | "mode" | "cycle_run" ...
            else:
                return

        # HA entity topics use light_1/light_2; the command translator uses
        # the device's own light/light2 block names, so map between them.
        if field == "light_1":
            field = "light"
        elif field == "light_2":
            field = "light2"

        # Outlet routing (v3.11.0): if this strip is hosted by a connected
        # CB, send through the CB with its ps5/ps10 block; else command the
        # strip directly with its own "outlet" block.
        cmd_sess = sess
        outlet_block = "outlet"
        if outlet_num is not None:
            host = self._cb_host_for_strip((sess.device_type or "").lower())
            if host is not None:
                cmd_sess = host
                outlet_block = (sess.device_type or "").lower()
                _LOGGER.debug(
                    "outlet %s on %s routed via CB host %s (block %s)",
                    outlet_num, sess.mac, host.mac, outlet_block,
                )

        from .command_handler import translate_command
        payload = translate_command(
            field, value, cmd_sess.mac_raw, cmd_sess.uid, outlet_num,
            device_state=cmd_sess.device_state,
            subfield=subfield,
            last_nonzero_level=cmd_sess.last_nonzero_level,
            fan_state=cmd_sess.fan_state,
            light_state=cmd_sess.light_state,
            se_config=cmd_sess.se_config,
            outlet_block=outlet_block,
            outlet_subfield=outlet_subfield,
            outlet_cfg=cmd_sess.outlet_cfg.get(f"{outlet_block}/O{outlet_num}")
                       if outlet_num is not None else None,
            env_cfg=cmd_sess.env_cfg or None,
        )
        if payload:
            await cmd_sess.inject(payload)

    def close_session(self, mac: str) -> bool:
        """Sever one device's connection (used by device deletion). The
        device will reconnect and re-register unless it's powered off."""
        sess = self._sessions.pop(mac, None)
        if sess is None:
            return False
        task = getattr(sess, "initial_poll_task", None)
        if task is not None and not task.done():
            task.cancel()
        writer = getattr(sess, "_client_writer", None)
        if writer is not None:
            try:
                writer.close()
            except Exception:
                pass
        _LOGGER.info("Severed session for %s (device deletion)", mac)
        return True

    def close_all_sessions(self) -> None:
        """Sever every device connection (v3.2.2 reload fix). Closing the
        listener only blocks NEW connections — established device sessions
        keep relaying into the unloaded instance ("zombie sessions"), so the
        devices never reconnect to the reloaded one. Closing their sockets
        forces a reconnect to the new listener within seconds."""
        for sess in list(self._sessions.values()):
            task = getattr(sess, "initial_poll_task", None)
            if task is not None and not task.done():
                task.cancel()
            writer = getattr(sess, "_client_writer", None)
            if writer is not None:
                try:
                    writer.close()
                except Exception:
                    pass
        count = len(self._sessions)
        self._sessions.clear()
        if count:
            _LOGGER.info(
                "Closed %d device sessions for reload — devices will "
                "reconnect to the new instance", count,
            )

    async def handle_client(
        self,
        client_reader: asyncio.StreamReader,
        client_writer: asyncio.StreamWriter,
    ) -> None:
        """Relay one controller TLS connection to the cloud and back."""
        peer = client_writer.get_extra_info("peername")
        _LOGGER.info("New connection from %s", peer)
        upstream_writer = None
        session_ref: list = [None]   # mutable cell shared with the inspectors

        try:
            ssl_ctx = await self.async_build_upstream_ssl_ctx()
            upstream_reader, upstream_writer = await asyncio.open_connection(
                self.config["proxy"]["upstream_host"],
                self.config["proxy"]["upstream_port"],
                ssl=ssl_ctx,
                server_hostname=self.config["proxy"]["upstream_host"],
            )

            def bind_session(client_id: str) -> ProxySession:
                mac_addr = _mac(client_id)
                existing = self._sessions.get(mac_addr)
                if existing:                     # reconnect: refresh writers
                    existing.set_upstream(upstream_writer)
                    existing.set_client(client_writer)
                    _LOGGER.info("[%s] reconnected", mac_addr)
                    return existing
                sess = ProxySession(client_id, self.mqtt_client)
                sess.set_upstream(upstream_writer)
                sess.set_client(client_writer)
                self._sessions[mac_addr] = sess
                _LOGGER.info("[%s] new session (type unknown until first data)",
                             mac_addr)
                DIAG.session(mac_addr, "CONNECT", f"peer={peer}")
                return sess

            def inspect_from_controller(pkt) -> None:
                """Controller -> cloud packets: track sessions and hand
                PUBLISH frames to the entity layer."""
                if pkt.packet_type == MQTT_CONNECT and pkt.client_id:
                    sess = bind_session(pkt.client_id)
                    session_ref[0] = sess
                    sess.publish_availability("online")
                    return
                sess = session_ref[0]
                if sess is None:
                    return
                if pkt.packet_type == MQTT_SUBSCRIBE and pkt.topics:
                    for t in pkt.topics:
                        parts = t.split("/")
                        if (len(parts) >= 6 and parts[0] == "SF"
                                and parts[1] == "GGS" and parts[3] == "API"
                                and parts[4] == "DOWN" and parts[2]):
                            if sess.down_topic_prefix != parts[2]:
                                _LOGGER.info("[%s] DOWN prefix from SUBSCRIBE: %s",
                                             sess.mac, parts[2])
                                sess.down_topic_prefix = parts[2]
                elif pkt.packet_type == MQTT_PUBLISH:
                    # Isolated: a fault in entity processing must never break
                    # the byte relay the controller depends on.
                    try:
                        _process_publish(sess, pkt, self.mqtt_client)
                    except Exception as exc:
                        _LOGGER.exception(
                            "[%s] frame processing failed on %s (relay continues)",
                            sess.mac, pkt.topic,
                        )
                        DIAG.error(sess.mac,
                                   f"frame processing failed on {pkt.topic}", exc)

            def inspect_from_cloud(pkt) -> None:
                """Cloud -> controller packets: learn the DOWN topic prefix and
                capture app-originated config writes so HA can confirm-poll
                them promptly instead of waiting for the periodic refresh."""
                sess = session_ref[0]
                if (sess is None or pkt.packet_type != MQTT_PUBLISH
                        or not pkt.topic or "/API/DOWN/" not in pkt.topic
                        or not pkt.message):
                    return
                parts = pkt.topic.split("/")
                if len(parts) >= 6 and parts[2] and sess.down_topic_prefix != parts[2]:
                    _LOGGER.info("[%s] DOWN prefix from cloud: %s",
                                 sess.mac, parts[2])
                    sess.down_topic_prefix = parts[2]
                try:
                    body = json.loads(pkt.message)
                except (ValueError, TypeError):
                    return
                method = body.get("method") or "?"
                DIAG.down_command(sess.mac, method, body)
                if method == "setConfigField":
                    params = body.get("params") or {}
                    DIAG.app_command(sess.mac, params.get("keyPath"), params)
                    sess.schedule_config_confirm(params.get("keyPath"))
                elif method == "setConfigFile":
                    params = body.get("params") or {}
                    lc = (params.get("configFile") or {}).get("light")
                    if isinstance(lc, dict):
                        sess.se_config = dict(lc)
                    sess.schedule_configfile_confirm()

            up = asyncio.create_task(
                self._pump(client_reader, upstream_writer, inspect_from_controller)
            )
            down = asyncio.create_task(
                self._pump(upstream_reader, client_writer, inspect_from_cloud)
            )
            _, pending = await asyncio.wait(
                {up, down}, return_when=asyncio.FIRST_COMPLETED
            )
            for t in pending:
                t.cancel()
            for t in pending:
                try:
                    await t
                except (asyncio.CancelledError, Exception):
                    pass

        except ssl.SSLError as exc:
            _LOGGER.warning("TLS MITM failed (%s) — closing", exc)
        except Exception as exc:
            _LOGGER.error("Connection error from %s: %s", peer, exc)
        finally:
            sess = session_ref[0]
            if sess:
                if sess.initial_poll_task and not sess.initial_poll_task.done():
                    sess.initial_poll_task.cancel()
                if self._sessions.get(sess.mac) is sess:
                    # Only mark offline if no newer session replaced this one.
                    self._sessions.pop(sess.mac, None)
                    sess.publish_availability("offline")
                    DIAG.session(sess.mac, "DISCONNECT")
            for w in (upstream_writer, client_writer):
                if w is not None:
                    try:
                        w.close()
                    except Exception:
                        pass
            _LOGGER.info("Connection from %s closed", peer)

    async def _pump(self, reader, writer, inspect) -> None:
        """Forward every byte from ``reader`` to ``writer`` unchanged, decoding
        the MQTT frames along the way and passing each to ``inspect``. The
        forward always happens; inspection is best-effort and never blocks or
        breaks the relay."""
        buf = b""
        try:
            while True:
                data = await reader.read(4096)
                if not data:
                    break
                try:
                    writer.write(data)
                    await writer.drain()
                except Exception:
                    break
                try:
                    buf += data
                    packets, buf = parse_packets(buf)
                    for pkt in packets:
                        inspect(pkt)
                except Exception as exc:
                    _LOGGER.debug("relay parse (non-fatal): %s", exc)
                    buf = b""
        except Exception as exc:
            _LOGGER.debug("relay pump ended: %r", exc)
        finally:
            try:
                writer.close()
            except Exception:
                pass


def _process_publish(
    session: ProxySession,
    pkt: Any,
    mqtt_client: Any,
) -> None:
    """
    Normalise an UP PUBLISH from the GGS Controller and republish to HA.
    Also handles device type detection and discovery publication.
    """
    if pkt.topic is None or pkt.message is None:
        return

    parts = pkt.topic.split("/")
    if (
        len(parts) < 6
        or parts[0] != "SF"
        or parts[1] != "GGS"
        or parts[3] != "API"
        or parts[4] != "UP"
    ):
        return

    try:
        data = json.loads(pkt.message)
    except Exception:
        return

    # ── DIAGNOSTIC: frame attribution check ──────────────────────────────
    # The UP topic carries the originating device MAC (parts[5]) and the
    # JSON carries a pid. Both should match the session's CONNECT identity.
    # If they don't, frames from one device are riding another device's
    # connection and state is being attributed to the wrong HA device.
    topic_mac = _mac(parts[5]) if len(parts) > 5 and parts[5] else ""
    pid_mac   = _mac(str(data.get("pid", "")))
    blocks    = sorted(data.get("data", {}).keys()) if isinstance(data.get("data"), dict) else []
    if topic_mac and topic_mac != session.mac:
        _LOGGER.warning(
            "ATTRIBUTION MISMATCH: session=%s but UP topic MAC=%s pid=%s "
            "method=%s blocks=%s",
            session.mac, topic_mac, pid_mac or "?",
            data.get("method"), blocks,
        )
    elif pid_mac and pid_mac != session.mac:
        _LOGGER.warning(
            "ATTRIBUTION MISMATCH (pid): session=%s topic MAC=%s pid=%s "
            "method=%s blocks=%s",
            session.mac, topic_mac or "?", pid_mac,
            data.get("method"), blocks,
        )
    else:
        _LOGGER.debug(
            "frame ok: session=%s topic_mac=%s pid=%s method=%s blocks=%s",
            session.mac, topic_mac or "?", pid_mac or "?",
            data.get("method"), blocks,
        )
    DIAG.frame(session.mac, topic_mac, pid_mac, str(data.get("method")), data)

    method = data.get("method")
    if method not in ("getDevSta", "getConfigField", "getConfigFile"):
        return



    # Update UID from device messages
    uid = data.get("uid", "")
    if uid and session.uid != uid:
        session.uid = uid

    d = data.get("data", {})

    # ── Device type detection (evidence accumulated across frames) ────────
    if method == "getDevSta":
        now = time.monotonic()
        if session.frames_seen == 0:
            session.first_frame_at = now
        session.frames_seen += 1
        present = {k for k, v in d.items() if v}
        # Field-level tokens for air sensors (v3.2.3): co2 etc. exist only
        # when that probe is physically attached, so each field is its own
        # evidence token. Plain "sensor" stays for type detection.
        sensor_block = d.get("sensor")
        if isinstance(sensor_block, dict):
            present |= {
                f"sensor:{k}"
                for k in ("temp", "humi", "co2", "vpd", "ppfd")
                if k in sensor_block
            }
        # Standalone SE-series lights (pcode 1005) report a FLAT schema —
        # top-level brightness/mode/pwm plus a lightModel marker, no CB
        # blocks at all. The marker is unambiguous, so it is its own token
        # (added even when the value is 0 — presence is the signal).
        if "lightModel" in d:
            present.add("selight")
        new_blocks = present - session.evidence
        session.evidence.update(new_blocks)
        if new_blocks and session.device_type and session.device_cfg:
            blocks_cb = getattr(session.mqtt_client, "blocks_seen", None)
            if blocks_cb is not None:
                blocks_cb(session.mac_raw, new_blocks, session.device_cfg)
        outlet_block = d.get("outlet", {})
        if isinstance(outlet_block, dict):
            for k in outlet_block:
                if k.startswith("O") and k[1:].isdigit():
                    n = int(k[1:])
                    if n not in session.outlets_seen:
                        session.outlets_seen.add(n)
                        session.max_outlet_seen = max(session.max_outlet_seen, n)
                        # Evidence-based outlet creation (v3.0.11): entities
                        # exist only for outlet numbers the device actually
                        # reports. Also covers late arrivals (new device
                        # plugged in after pruning).
                        if session.device_type and session.device_cfg:
                            seen_cb = getattr(
                                session.mqtt_client, "outlet_seen", None
                            )
                            if seen_cb is not None:
                                seen_cb(session.mac_raw, n, session.device_cfg)

        detected, conclusive = _classify_evidence(
            session.evidence, session.max_outlet_seen
        )
        waited_enough = (
            session.frames_seen >= _DETECT_MIN_FRAMES
            or (now - session.first_frame_at) >= _DETECT_MAX_WAIT_SEC
        )

        if session.device_type is None:
            if detected and (conclusive or waited_enough):
                session.device_type = detected
                session.type_conclusive = conclusive
                session.device_cfg = {
                    "mac":  session.mac_raw,
                    "type": detected.upper(),
                    # No friendly_name — falls back to the "{Type} {last4}" default
                }
                _LOGGER.info(
                    "[%s] device type detected: %s (%s, %d frames)",
                    session.mac, detected.upper(),
                    "conclusive" if conclusive else "tentative",
                    session.frames_seen,
                )
                DIAG.detection(
                    session.mac,
                    f"type={detected} conclusive={conclusive} "
                    f"frames={session.frames_seen} evidence={sorted(session.evidence)} "
                    f"outlets={sorted(session.outlets_seen)}",
                )
                session.ensure_discovery()
                # Flush evidence gathered before the type was known
                blocks_cb = getattr(session.mqtt_client, "blocks_seen", None)
                if blocks_cb is not None:
                    blocks_cb(session.mac_raw, session.evidence, session.device_cfg)
                seen_cb = getattr(session.mqtt_client, "outlet_seen", None)
                if seen_cb is not None:
                    for n in sorted(session.outlets_seen):
                        seen_cb(session.mac_raw, n, session.device_cfg)
        elif (
            not session.type_conclusive
            and detected
            and detected != session.device_type
        ):
            # Tentative type contradicted by stronger evidence — retype.
            # (e.g. a light-only or outlet-only start turned out to be a CB,
            # or a PS5 revealed outlet 6+.)
            _LOGGER.warning(
                "[%s] evidence contradicts tentative type %s — retyping to %s",
                session.mac, session.device_type.upper(), detected.upper(),
            )
            DIAG.detection(
                session.mac,
                f"RETYPE {session.device_type} -> {detected} "
                f"evidence={sorted(session.evidence)}",
            )
            session.device_type = detected
            session.type_conclusive = conclusive
            session.device_cfg = {
                "mac":  session.mac_raw,
                "type": detected.upper(),
            }
            session._outlet_discovery_pruned = False
            retype = getattr(session.mqtt_client, "retype_device", None)
            if retype is not None:
                retype(session.device_cfg)
            else:
                session.ensure_discovery()
            # Re-flush evidence under the corrected type
            blocks_cb = getattr(session.mqtt_client, "blocks_seen", None)
            if blocks_cb is not None:
                blocks_cb(session.mac_raw, session.evidence, session.device_cfg)
            seen_cb = getattr(session.mqtt_client, "outlet_seen", None)
            if seen_cb is not None:
                for n in sorted(session.outlets_seen):
                    seen_cb(session.mac_raw, n, session.device_cfg)

    if session.device_type is not None and method == "getDevSta":
        session.ensure_discovery()

        if session.initial_poll_task is None:
            # Schedule initial config poll after 3s (once per session)
            async def _initial_poll():
                await asyncio.sleep(3)
                if session.device_type == "se":
                    try:
                        await session.inject({
                            "method": "getConfigFile",
                            "pid":    session.mac_raw,
                            "msgId":  str(int(time.time() * 1000)),
                            "uid":    session.uid,
                        })
                    except Exception:
                        pass
                    return
                from .mitm_proxy import MITMProxy  # avoid circular at module level
                for keypath in (
                    ["device", "light"],  ["device", "light2"],
                    ["device", "fan"],    ["device", "blower"],
                    ["device", "heater"], ["device", "humidifier"],
                    ["device", "dehumidifier"], ["target"],
                ):
                    try:
                        await session.inject({
                            "method": "getConfigField",
                            "pid":    session.mac_raw,
                            "params": {"keyPath": keypath},
                            "msgId":  str(int(time.time() * 1000)),
                            "uid":    session.uid,
                        })
                    except Exception:
                        pass
                    await asyncio.sleep(0.5)

            session.initial_poll_task = asyncio.create_task(_initial_poll())

    # ── Cache device state ────────────────────────────────────────────────
    for module in ("light", "light2", "blower", "fan", "heater", "humidifier",
                   "dehumidifier", "outlet", "ps5", "ps10"):
        if module in d and isinstance(d[module], dict):
            session.device_state.setdefault(module, {}).update(d[module])
    for module in ("light", "light2"):
        if module in d and isinstance(d[module], dict):
            session.light_state.setdefault(module, {}).update(d[module])
    for module in ("fan", "blower"):
        if module in d and isinstance(d[module], dict):
            session.fan_state.setdefault(module, {}).update(d[module])
    for module in ("light", "light2", "fan", "blower", "heater", "humidifier"):
        if module in d and isinstance(d[module], dict):
            lvl = d[module].get("level", d[module].get("mLevel", 0))
            if isinstance(lvl, (int, float)) and lvl > 0:
                session.last_nonzero_level[module] = int(lvl)

    # ── Soil sensor discovery ─────────────────────────────────────────────
    # Only once the device type is known: tentatively-typed devices (PS
    # strips) have no device_cfg during the detection window, and consuming
    # probe ids then would permanently skip their entities (v3.3.3).
    if session.device_cfg:
        for s in d.get("sensors", []):
            sid = s.get("id")
            if sid and sid != "avg":
                note = getattr(mqtt_client, "note_soil_type", None)
                if note is not None and "mst_fw_ver" in s:
                    note(str(sid), s.get("mst_fw_ver"))
                if sid not in session._known_soil_ids:
                    session._known_soil_ids.add(sid)
                    publish_soil_sensor_discovery(
                        mqtt_client, session.mac_raw, str(sid), session.device_cfg
                    )

    # ── Outlet discovery pruning (evidence-based) ────────────────────────
    # Prune only from accumulated evidence (not the first partial frame) — a
    # partial frame would wipe real outlets. Prune only from accumulated
    # evidence, and only after the same stability window detection uses.
    if (
        not session._outlet_discovery_pruned
        and session.device_type
        and method == "getDevSta"
        and (
            session.frames_seen >= _DETECT_MIN_FRAMES
            or (time.monotonic() - session.first_frame_at) >= _DETECT_MAX_WAIT_SEC
        )
    ):
        caps = _capabilities(session.device_type)
        if caps["hasOutlets"]:
            max_outlet = 10 if session.device_type in ("ps10", "cb") else 5
            for n in range(1, max_outlet + 1):
                if n not in session.outlets_seen:
                    unpublish_outlet_discovery(mqtt_client, session.mac_raw, n)
            _LOGGER.info(
                "[%s] outlet discovery pruned to %s",
                session.mac, sorted(session.outlets_seen),
            )
        prune_cb = getattr(mqtt_client, "prune_blocks", None)
        if prune_cb is not None and session.device_cfg:
            prune_cb(session.mac_raw, session.evidence, session.device_cfg)
        session._outlet_discovery_pruned = True

    # ── Soil-probe app names (senConfig[].label) — read-only ──────────────
    if method in ("getConfigField", "getConfigFile"):
        _sen = _senconfig_from(d)
        if _sen:
            _apply = getattr(mqtt_client, "apply_soil_labels", None)
            if _apply is not None:
                _apply(session.mac_raw, _sen)
        _cal = _calibration_from(d)
        if _cal:
            _acal = getattr(mqtt_client, "apply_air_calibration", None)
            if _acal is not None:
                _acal(session.mac_raw, _cal)

    # ── Outlet config cache (v3.11.1a3): the whole ps5/ps10/outlet block
    # comes back from getConfigField ["device", <block>] as
    # data.<block>.O{n} = full config. Cache each so mode/sub-setting writes
    # are read-modify-write (never wipe the outlet's other settings).
    if method == "getConfigField":
        cfgd = d if isinstance(d, dict) else {}
        tgt = cfgd.get("target")
        if isinstance(tgt, dict):
            session.env_cfg = dict(tgt)
            from .normalizer import normalize_target
            for topic, val in normalize_target(session.mac_raw, tgt).items():
                mqtt_client.publish(topic, val, retain=True, qos=0)
        for block in ("ps5", "ps10", "outlet"):
            blk = cfgd.get(block)
            if not isinstance(blk, dict):
                continue
            for ok, ov in blk.items():
                if ok.startswith("O") and ok[1:].isdigit() and isinstance(ov, dict):
                    session.outlet_cfg[f"{block}/{ok}"] = dict(ov)
            # Resolve which device owns the HA entities: a CB's ps5/ps10
            # block belongs to the standalone strip of that type; a strip's
            # own "outlet" block belongs to itself.
            if block == "outlet":
                target_mac = session.mac_raw
                strip_type = session.device_type
            else:
                # ps5/ps10 block belongs to the standalone strip of that
                # type — resolve via the bus's proxy handle.
                prox = getattr(mqtt_client, "proxy", None)
                strip = prox._strip_session_for_type(block) if prox else None
                target_mac = strip.mac_raw if strip else None
                strip_type = block
            if not target_mac:
                continue
            # app -> HA: publish decoded state so the mode entities update
            from .normalizer import normalize_outlet_config
            for topic, val in normalize_outlet_config(target_mac, blk).items():
                mqtt_client.publish(topic, val, retain=True, qos=0)
            # drive dynamic visibility from the device's real modeType
            set_mode = getattr(mqtt_client, "set_outlet_mode_from_device", None)
            if set_mode is not None:
                for ok, ov in blk.items():
                    if ok.startswith("O") and ok[1:].isdigit() and isinstance(ov, dict):
                        n = int(ok[1:])
                        set_mode(target_mac, n, ov.get("modeType"),
                                 {"mac": target_mac, "type": strip_type})

    # ── SE light config file (schedule/sunrise) ──────────────────────────
    if method == "getConfigFile":
        cfg = d.get("configFile") if isinstance(d, dict) else None
        light_cfg = (cfg or {}).get("light")
        if isinstance(light_cfg, dict):
            session.se_config = dict(light_cfg)
            from .normalizer import normalize_se_configfile
            for topic, value in normalize_se_configfile(
                session.mac_raw, light_cfg
            ).items():
                mqtt_client.publish(topic, value, retain=True, qos=0)
        return

    # ── Normalise and publish state topics ────────────────────────────────
    is_config_resp = (method == "getConfigField")
    if is_config_resp:
        # Config responses carry shakeLevel/natural and the authoritative
        # modeType for fans and climate accessories (config responses were
        # these frames, leaving those sensors stale/unknown).
        from .normalizer import normalize_config_response
        for topic, value in normalize_config_response(session.mac_raw, data).items():
            mqtt_client.publish(topic, value, retain=True, qos=0)
    else:
        normalized = normalize_status(
            session.mac, data, mac=session.mac_raw, fan_cache=session.fan_state
        )
        for topic, value in normalized.items():
            mqtt_client.publish(topic, value, retain=True, qos=0)
