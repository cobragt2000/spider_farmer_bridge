#!/usr/bin/env python3
"""Tiny status page for the Spider Farmer Hotspot add-on (served via HA ingress).

Shows the AP settings, the DNS redirect target, whether the integration's proxy
is listening on :8883, and the list of connected Wi-Fi clients (DHCP leases).
"""
import html
import json
import os
import re
import socket
import subprocess
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

OPTIONS = "/data/options.json"
LEASES = "/data/dnsmasq.leases"
# The Spider Farmer Bridge integration writes this map (mac -> friendly name)
# into HA's /config, which this add-on mounts read-write.
DEVICE_MAP = "/config/sf_hotspot_devices.json"
PORT = int(os.environ.get("INGRESS_PORT", "8099"))


def opts():
    try:
        with open(OPTIONS) as f:
            return json.load(f)
    except Exception:
        return {}


def device_names():
    """mac (lower, no separators) -> friendly name, from the integration."""
    try:
        with open(DEVICE_MAP) as f:
            raw = json.load(f)
        out = {}
        for k, v in raw.items():
            mac = re.sub(r"[^0-9a-f]", "", str(k).lower())
            name = v.get("name") if isinstance(v, dict) else v
            if mac and name:
                out[mac] = str(name)
        return out
    except Exception:
        return {}


def stations():
    """mac (lower, colon) -> {signal dBm, inactive ms, tx MBit/s}, from the AP's
    station table across all wifi interfaces. A device present here is currently
    associated (online); one only in the DHCP leases is offline."""
    out = {}
    try:
        ifaces = re.findall(
            r"Interface (\w+)",
            subprocess.run(["iw", "dev"], capture_output=True, text=True,
                           timeout=2).stdout,
        )
    except Exception:
        ifaces = []
    for ifc in ifaces:
        try:
            dump = subprocess.run(
                ["iw", "dev", ifc, "station", "dump"],
                capture_output=True, text=True, timeout=2,
            ).stdout
        except Exception:
            continue
        cur = None
        for ln in dump.splitlines():
            m = re.match(r"Station ([0-9a-fA-F:]{17})", ln)
            if m:
                cur = out.setdefault(m.group(1).lower(), {})
                continue
            if cur is None:
                continue
            s = re.search(r"signal:\s*(-?\d+)", ln)
            if s:
                cur["signal"] = int(s.group(1))
            i = re.search(r"inactive time:\s*(\d+)", ln)
            if i:
                cur["inactive"] = int(i.group(1))
            t = re.search(r"tx bitrate:\s*([\d.]+)", ln)
            if t:
                cur["tx"] = float(t.group(1))
    return out


def fmt_ago(ms):
    """A wifi 'inactive time' in ms -> a short 'last seen' string."""
    if ms is None:
        return ""
    s = ms / 1000.0
    if s < 5:
        return "now"
    if s < 90:
        return f"{int(s)}s ago"
    return f"{int(s // 60)}m ago"


def signal_quality(dbm):
    """dBm -> (label, colour). None dBm -> unknown."""
    if dbm is None:
        return "—", "#8b98a5"
    if dbm >= -55:
        return "Excellent", "#3fb950"
    if dbm >= -67:
        return "Great", "#56d364"
    if dbm >= -75:
        return "OK", "#d29922"
    return "Poor", "#f85149"


def leases():
    rows = []
    try:
        with open(LEASES) as f:
            for ln in f:
                p = ln.split()
                if len(p) >= 4:
                    rows.append((p[1], p[2], p[3], p[0]))  # mac, ip, name, expiry
    except FileNotFoundError:
        pass
    return rows


def redirect_hits():
    """Packets that hit the nft 8883 -> proxy redirect rule (None if none)."""
    try:
        out = subprocess.run(
            ["nft", "list", "chain", "ip", "sfhs", "pre"],
            capture_output=True, text=True, timeout=2,
        ).stdout
        m = re.search(r"counter packets (\d+)", out)
        if m:
            return int(m.group(1))
    except Exception:
        pass
    return None


def proxy_listening(port=8883):
    for fam, addr in ((socket.AF_INET, ("127.0.0.1", port)),):
        s = socket.socket(fam, socket.SOCK_STREAM)
        s.settimeout(0.4)
        try:
            if s.connect_ex(addr) == 0:
                return True
        except OSError:
            pass
        finally:
            s.close()
    return False


def page():
    o = opts()
    hotspot_ip = o.get("hotspot_ip", "")
    dns_target = o.get("dns_target") or hotspot_ip
    proxy_port = int(o.get("proxy_port", 8883) or 8883)
    rows = leases()
    up = proxy_listening(proxy_port)
    proxy_html = (
        f"<span style='color:#3fb950'>:{proxy_port} listening ✓</span>" if up
        else f"<span style='color:#f85149'>:{proxy_port} NOT listening ✗ — is the "
             "Spider Farmer Bridge integration running?</span>"
    )
    redirect_html = f" (device :8883 &rarr; proxy :{proxy_port})"
    hits = redirect_hits()
    if hits is not None:
        hcolor = "#3fb950" if hits > 0 else "#d29922"
        note = "" if hits > 0 else " (no device traffic on :8883 yet)"
        hits_html = (f"<div style='margin-top:6px'><span class=k>Cloud redirect:</span> "
                     f"<span style='color:{hcolor}'>{hits} pkts{note}</span></div>")
    else:
        hits_html = ""
    names = device_names()
    sta = stations()
    trs = ""
    for mac, ip, name, exp in rows:
        try:
            left = int(exp) - int(time.time())
            lease = f"{left // 60} min" if left > 0 else "expired"
        except Exception:
            lease = html.escape(exp)
        # Prefer the integration's friendly name; fall back to the DHCP
        # hostname, then "(unknown)".
        mackey = re.sub(r"[^0-9a-f]", "", mac.lower())
        friendly = names.get(mackey)
        if friendly:
            nm = html.escape(friendly)
        elif name not in ("*", ""):
            nm = html.escape(name)
        else:
            nm = "<span style='opacity:.55'>(unknown)</span>"
        st = sta.get(mac.lower())
        online = st is not None
        # Status (online + last-seen, from the AP association table).
        if online:
            ago = fmt_ago(st.get("inactive"))
            status_html = ("<span style='color:#3fb950'>Online</span>"
                           + (f" <span style='opacity:.55'>· {ago}</span>" if ago else ""))
        else:
            status_html = "<span style='color:#8b98a5'>Offline</span>"
        # Signal.
        dbm = st.get("signal") if online else None
        label, colour = signal_quality(dbm)
        sig_txt = f"{label}" + (f" ({dbm} dBm)" if dbm is not None else "")
        sig_html = f"<span style='color:{colour}'>{sig_txt}</span>"
        # Link speed (tx bitrate).
        tx = st.get("tx") if online else None
        link_html = (f"{tx:g} Mbit/s" if tx is not None
                     else "<span style='opacity:.4'>—</span>")
        trs += (f"<tr><td>{nm}</td><td>{status_html}</td><td>{sig_html}</td>"
                f"<td>{link_html}</td><td>{html.escape(ip)}</td>"
                f"<td>{html.escape(mac)}</td><td>{lease}</td></tr>")
    if not trs:
        trs = "<tr><td colspan=7 style='opacity:.55'>No clients connected yet</td></tr>"
    e = lambda v: html.escape(str(v))
    return f"""<!doctype html><html><head><meta charset=utf-8>
<meta http-equiv=refresh content=10>
<title>Spider Farmer Hotspot</title>
<style>
body{{font-family:system-ui,sans-serif;margin:16px;background:#0e0e0e;color:#e6e6e6}}
h2{{font-weight:500;margin:.2em 0}} h3{{font-weight:500}}
table{{border-collapse:collapse;width:100%}}
td,th{{text-align:left;padding:7px 9px;border-bottom:1px solid #2a2a2a;font-size:14px}}
th{{color:#9aa;font-weight:400}}
.card{{background:#181818;border-radius:12px;padding:12px 16px;margin-bottom:14px}}
.k{{color:#8b98a5}}
</style></head><body>
<h2>Spider Farmer Hotspot</h2>
<div class=card>
  <div><span class=k>SSID:</span> {e(o.get('ssid',''))} &nbsp;
       <span class=k>Channel:</span> {e(o.get('channel',''))} &nbsp;
       <span class=k>AP IP:</span> {e(o.get('hotspot_ip',''))} &nbsp;
       <span class=k>Interface:</span> {e(o.get('wifi_interface',''))}</div>
  <div style='margin-top:6px'><span class=k>DNS redirect:</span>
       sf.mqtt.spider-farmer.com &rarr; {e(dns_target)}:8883{redirect_html}</div>
  <div style='margin-top:6px'><span class=k>Proxy:</span> {proxy_html}</div>
  {hits_html}
</div>
<div class=card>
  <h3>Connected clients ({len(rows)})</h3>
  <table><tr><th>Name</th><th>Status</th><th>Signal</th><th>Link</th><th>IP</th><th>MAC</th><th>Lease left</th></tr>{trs}</table>
</div>
<p style='opacity:.5;font-size:12px'>Auto-refreshes every 10s. Grow gear should
appear here within a minute of joining the hotspot. If a device is listed here
but still offline in the app, the proxy/redirect is the next thing to check.</p>
</body></html>"""


class H(BaseHTTPRequestHandler):
    def do_GET(self):
        body = page().encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", PORT), H).serve_forever()
