"""
MQTT 3.1.1 wire codec.

A minimal, self-contained encoder/decoder for the handful of MQTT control
packets this proxy needs to see on the wire (PUBLISH, CONNECT, SUBSCRIBE).
Implemented from the MQTT 3.1.1 specification (OASIS standard) — the byte
layout of each packet is defined there, not invented here.

Design: a small cursor over the byte buffer reads length-prefixed strings and
the variable-length "Remaining Length" integer; each packet type has a focused
decoder. Only fields the proxy consumes are extracted.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional, Tuple

# Control packet type codes (MQTT 3.1.1 section 2.1.1)
MQTT_CONNECT = 1
MQTT_CONNACK = 2
MQTT_PUBLISH = 3
MQTT_PUBACK = 4
MQTT_SUBSCRIBE = 8
MQTT_SUBACK = 9
MQTT_PINGREQ = 12
MQTT_PINGRESP = 13
MQTT_DISCONNECT = 14


@dataclass
class MQTTPacket:
    """A decoded control packet. Only the fields relevant to the packet type
    are populated; the rest stay at their defaults."""
    packet_type: int
    flags: int
    payload: bytes                       # bytes after the fixed header
    topic: Optional[str] = None          # PUBLISH
    message: Optional[bytes] = None      # PUBLISH application payload
    qos: int = 0                         # PUBLISH
    retain: bool = False                 # PUBLISH
    packet_id: Optional[int] = None      # PUBLISH (QoS > 0)
    client_id: Optional[str] = None      # CONNECT
    topics: Optional[List[str]] = None   # SUBSCRIBE topic filters


class _Cursor:
    """Sequential reader over a bytes buffer with MQTT-typed reads."""

    __slots__ = ("_b", "_i")

    def __init__(self, buf: bytes, start: int = 0) -> None:
        self._b = buf
        self._i = start

    @property
    def pos(self) -> int:
        return self._i

    def remaining(self) -> int:
        return len(self._b) - self._i

    def u8(self) -> int:
        v = self._b[self._i]
        self._i += 1
        return v

    def u16(self) -> int:
        hi = self._b[self._i]
        lo = self._b[self._i + 1]
        self._i += 2
        return (hi << 8) | lo

    def take(self, n: int) -> bytes:
        chunk = self._b[self._i:self._i + n]
        self._i += n
        return chunk

    def rest(self) -> bytes:
        return self._b[self._i:]

    def mqtt_str(self) -> str:
        """A 2-byte length-prefixed UTF-8 string (MQTT section 1.5.3)."""
        n = self.u16()
        return self.take(n).decode("utf-8", errors="replace")

    def varint(self) -> int:
        """The 'Remaining Length' variable byte integer (MQTT section 2.2.3):
        up to four bytes, 7 payload bits each, high bit = continuation."""
        value = 0
        shift = 0
        while True:
            if self._i >= len(self._b):
                raise _Incomplete()
            byte = self._b[self._i]
            self._i += 1
            value |= (byte & 0x7F) << shift
            if not byte & 0x80:
                return value
            shift += 7
            if shift > 21:
                raise ValueError("Remaining Length exceeds 4 bytes")


class _Incomplete(Exception):
    """Raised when the buffer holds only part of a packet."""


def _encode_varint(value: int) -> bytes:
    """Inverse of _Cursor.varint - encode a length as 1..4 continuation bytes."""
    out = bytearray()
    while True:
        byte = value & 0x7F
        value >>= 7
        if value:
            byte |= 0x80
        out.append(byte)
        if not value:
            return bytes(out)


def parse_packets(buf: bytes) -> Tuple[List[MQTTPacket], bytes]:
    """Decode every complete control packet at the front of ``buf``.

    Returns the decoded packets and any trailing bytes that form an
    incomplete packet (to be prepended to the next read)."""
    packets: List[MQTTPacket] = []
    cur = _Cursor(buf)

    while cur.remaining() > 0:
        frame_start = cur.pos
        header = cur.u8()
        ptype = header >> 4
        flags = header & 0x0F

        try:
            length = cur.varint()
        except _Incomplete:
            return packets, buf[frame_start:]
        except ValueError:
            # Malformed length - drop this byte and resync on the next.
            cur = _Cursor(buf, frame_start + 1)
            continue

        if cur.remaining() < length:
            return packets, buf[frame_start:]

        body = cur.take(length)
        pkt = MQTTPacket(packet_type=ptype, flags=flags, payload=body)

        if ptype == MQTT_PUBLISH:
            _decode_publish(pkt, body)
        elif ptype == MQTT_CONNECT:
            _decode_connect(pkt, body)
        elif ptype == MQTT_SUBSCRIBE:
            _decode_subscribe(pkt, body)

        packets.append(pkt)

    return packets, b""


def _decode_publish(pkt: MQTTPacket, body: bytes) -> None:
    """PUBLISH (MQTT section 3.3): topic string, optional packet id, then
    payload. QoS and RETAIN come from the fixed-header flags."""
    pkt.qos = (pkt.flags >> 1) & 0x03
    pkt.retain = bool(pkt.flags & 0x01)
    try:
        cur = _Cursor(body)
        pkt.topic = cur.mqtt_str()
        if pkt.qos > 0:
            pkt.packet_id = cur.u16()
        pkt.message = cur.rest()
    except IndexError:
        # Truncated variable header - leave fields unset.
        pass


def _decode_connect(pkt: MQTTPacket, body: bytes) -> None:
    """CONNECT (MQTT section 3.1): variable header is protocol name + level +
    connect flags + keepalive; the payload begins with the client identifier,
    which is the only field this proxy needs."""
    try:
        cur = _Cursor(body)
        cur.mqtt_str()   # protocol name ("MQTT")
        cur.u8()         # protocol level
        cur.u8()         # connect flags
        cur.u16()        # keep-alive
        pkt.client_id = cur.mqtt_str()
    except IndexError:
        pkt.client_id = None


def _decode_subscribe(pkt: MQTTPacket, body: bytes) -> None:
    """SUBSCRIBE (MQTT section 3.8): 2-byte packet id, then one or more
    (topic filter string, requested-QoS byte) pairs."""
    filters: List[str] = []
    try:
        cur = _Cursor(body)
        cur.u16()  # packet id
        while cur.remaining() >= 2:
            filters.append(cur.mqtt_str())
            cur.u8()  # requested QoS
    except IndexError:
        pass
    pkt.topics = filters


def build_publish(topic: str, message: bytes, qos: int = 0, retain: bool = False,
                  packet_id: int = 1) -> bytes:
    """Encode a PUBLISH packet for ``topic`` carrying ``message``."""
    topic_bytes = topic.encode("utf-8")
    variable = bytearray()
    variable += len(topic_bytes).to_bytes(2, "big")
    variable += topic_bytes
    if qos > 0:
        variable += packet_id.to_bytes(2, "big")
    variable += message

    flags = (qos << 1) | (1 if retain else 0)
    header = bytes([(MQTT_PUBLISH << 4) | flags])
    return header + _encode_varint(len(variable)) + bytes(variable)
