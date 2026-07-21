# Spider Farmer Hotspot

Turns your Home Assistant host into a small Wi-Fi access point that Spider
Farmer GGS controllers join directly. The add-on also runs a local DNS override
so the controller's cloud endpoint (`sf.mqtt.spider-farmer.com`) resolves to the
**Spider Farmer Bridge** integration's proxy on this same host.

The result: the grow gear talks to your integration over Wi-Fi with **no router
configuration** (no port forwarding, no NAT rules). The integration still relays
to the real Spider Farmer cloud over your wired connection, so the phone app
keeps working normally.

This add-on is the *networking* half. The protocol decoding, entities, and
Lovelace cards live in the **Spider Farmer Bridge** custom integration, which
you install from the same repository via HACS. Install both (see below).

## How it fits together

```
  GGS controller --Wi-Fi-->  AP interface (this add-on)
                                |  dnsmasq: sf.mqtt.spider-farmer.com -> 192.168.10.1:8883
                                v
                       Spider Farmer Bridge proxy (the integration, :8883)
                                |  relays over the wired uplink
                                v
                       real Spider Farmer cloud  (phone app still works)
```

## Installing both halves (one repository)

The integration and this add-on ship from the **same GitHub repo**. Home
Assistant keeps integrations and add-ons in separate stores, so you add the one
URL in two places:

1. **HACS → Custom repositories** → add the repo URL (category *Integration*).
   Install **Spider Farmer Bridge**, restart HA, add the integration.
2. **Settings → Add-ons → Add-on Store → ⋮ → Repositories** → add the *same*
   repo URL. Install **Spider Farmer Hotspot** from the list that appears.

## Requirements

- **Home Assistant OS or Supervised** (add-ons only run there).
- A **wired uplink** (Ethernet) for your LAN / internet.
- A **dedicated 2.4 GHz Wi-Fi radio** for the access point. The radio you point
  `wifi_interface` at is consumed entirely by the AP - it can no longer be a
  Wi-Fi client. A Raspberry Pi 4/5 (Ethernet + built-in Wi-Fi) works, or add a
  USB Wi-Fi dongle that supports AP mode.
- The **Spider Farmer Bridge** integration installed and running (its proxy must
  be listening on `:8883`).

## AP backends

| `ap_backend` | What it does | When to use |
|---|---|---|
| `auto` *(default)* | Uses NetworkManager if it's running, else hostapd. | Leave this unless you hit trouble. |
| `nmcli` | NetworkManager creates the AP connection (mode `ap`, static IP). Our dnsmasq still does DHCP + the DNS override. | HAOS/Supervised - coexists with the NM that already runs there, so it won't fight over the radio. |
| `hostapd` | Raw hostapd owns the radio directly. | When NM isn't present, or you've already freed the interface from it. |

On Home Assistant OS the built-in NetworkManager manages Wi-Fi, so `nmcli` (via
`auto`) is usually the smoother choice. `host_dbus` is enabled so `nmcli` inside
the add-on can reach the host's NetworkManager.

## Choosing the Wi-Fi interface

Home Assistant add-on option pages are static, so they can't show a live list of
your Wi-Fi cards. Instead, leave `wifi_interface` on **`auto`** (the default) and
the add-on detects wireless interfaces at startup, prefers one that advertises
**AP mode**, and uses it. The add-on log prints every card it found, e.g.:

```
[sf-hotspot] detected wireless interfaces: wlan0(AP-capable) wlan1(AP-capable)
[sf-hotspot] auto-selected wifi_interface=wlan0
```

If `auto` picks the wrong radio (say it grabbed your LAN Wi-Fi), read that log
line, then set `wifi_interface` to the correct name. The dropdown offers the
common names `wlan0`/`wlan1`/`wlan2`; USB dongles with unusual names are still
handled by `auto` (the log shows the exact name to type if you need to override).

## Configuration

| Option | Default | Notes |
|---|---|---|
| `hotspot_enabled` | `true` | Master switch. |
| `ap_backend` | `auto` | `auto` / `nmcli` / `hostapd` (see above). |
| `wifi_interface` | `auto` | Radio dedicated to the AP. `auto` detects it; or pick `wlan0`/`wlan1`/`wlan2`. See below. |
| `ssid` | `SF-Bridge` | Hotspot network name. |
| `password` | `changeme123` | WPA2 password, min 8 chars. **Change this.** |
| `security` | `wpa2` | `wpa2` (CCMP), `wpa` (TKIP, for old radios), or `open` (no password - testing only). |
| `channel` | `6` | 2.4 GHz channel (1-13). |
| `hotspot_ip` | `192.168.10.1` | The host's address on the hotspot; also the gateway/DNS handed to clients. Pick a subnet that does NOT overlap your LAN. |
| `proxy_port` | `8883` | The port the Spider Farmer Bridge integration listens on. If it's not 8883 (e.g. 8000), the add-on redirects the hotspot's inbound 8883 to it. |
| `internet_access` | `true` | Give joined devices real internet (IP forward + NAT to the host uplink), like the LAN. Many controllers need this to come online. Turn off for an isolated hotspot. |
| `dns_target` | *(blank)* | Where `sf.mqtt.spider-farmer.com` resolves for hotspot clients. Blank = `hotspot_ip` (the local proxy). |
| `country_code` | `US` | Regulatory domain for the radio. |
| `unmanage_via_nmcli` | `false` | hostapd backend only: run `nmcli dev set <iface> managed no` on start so hostapd can claim the radio. |

## Wi-Fi adapter compatibility

Running an access point needs a radio whose driver supports **AP (master) mode
with WPA2**. Not every Wi-Fi adapter does - many old or cheap USB dongles can
associate as a client but fail to run a secure AP.

Symptoms of an incompatible adapter in the log:

- `key not allowed` / `Failed to set beacon parameters` - the driver can't set
  the WPA2/CCMP key in AP mode (common on old Ralink `rt73usb`/`rt2500usb`).
- `channel is disabled` that persists even with the correct country set - a
  self-managed or driver-locked radio.

If you hit these, try the `security` option (`wpa` or, for a quick hardware
test, `open`); if only `open` beacons, the adapter can't do WPA2-AP and should
be replaced. Reliable, inexpensive AP-capable USB chipsets include **MediaTek
MT7601U / MT76x2U** and **Ralink RT5370 (rt2800usb)** - these "just work" as
HAOS access points.

**Raspberry Pi built-in Wi-Fi is supported.** The Pi 3B+/4/5 (and Pi 3B, 2.4GHz
only) use Broadcom radios via the `brcmfmac` driver, which does AP mode well and
is a common HAOS hotspot. On a Pi, keep `ap_backend` on `auto` (the default):
NetworkManager manages the built-in radio on Home Assistant OS, so letting NM
create the AP (the nmcli backend) is the smoothest path. No extra configuration
is needed beyond setting your country (Settings > System > General) and an
SSID/password here.

## Status dashboard

The add-on has a Web UI (the **Open Web UI** button on the add-on page, or its
sidebar panel). It shows the AP settings, the DNS redirect target, whether the
Spider Farmer Bridge proxy is **listening on :8883**, and a live table of the
**Wi-Fi clients** currently joined to the hotspot (name / IP / MAC / lease).

Use it to debug a device that won't come online:

1. **Is the device listed as a client?** No -> it didn't join the hotspot or get
   a DHCP lease (check password/pairing; the add-on log shows DHCP handshakes).
2. **Is ":8883" shown as listening?** No -> the integration isn't running or its
   proxy isn't reachable at the DNS target; start it / fix the redirect target.
3. **Device listed and :8883 listening, but still offline in the app?** Turn on
   the `dns_logging` option and watch the add-on log for the device querying
   `sf.mqtt.spider-farmer.com` — that confirms the redirect is being used. If the
   query resolves to the DNS target but the app stays offline, the proxy relay to
   the real cloud is the next thing to check.

## First-time pairing

1. Install and start the add-on; confirm the `SF-Bridge` network appears.
2. Put the GGS controller into pairing mode: **hold the mode button ~5 seconds**
   until it advertises for setup.
3. In the **Spider Farmer phone app**, add/pair the device and, when it asks
   which Wi-Fi network the controller should join, choose the **`SF-Bridge`**
   hotspot (enter the password you set).
4. The controller joins the hotspot, resolves the cloud endpoint to your local
   proxy, and the integration's entities come to life. The app keeps working
   because the proxy relays upstream.

## Troubleshooting

- **`interface 'wlan0' not found`** - the add-on log prints available
  interfaces; set `wifi_interface` to the right one (e.g. `wlan1` for a dongle).
- **AP never appears / interface bounces (hostapd)** - NetworkManager is
  managing the radio. Switch `ap_backend` to `nmcli` (recommended on HAOS), or
  set `unmanage_via_nmcli: true`.
- **nmcli backend fails** - the add-on automatically retries with hostapd; check
  the log. Ensure `host_dbus` is available (it's set in the add-on config).
- **nmcli: "Wi-Fi network could not be found"** - NM tried client mode instead
  of AP mode. Fixed in 0.3.1 (the AP mode is now set when the connection is
  created). If you still see it, a version skew between the add-on's `nmcli` and
  the host NetworkManager can be the cause - the log prints both versions; a
  Supervisor/host reboot re-syncs them.
- **hostapd: "channel is disabled" / rfkill** - the container couldn't set the
  regulatory domain or was rf-blocked. 0.3.1 runs `rfkill unblock` and
  `iw reg set <country>` first, but the reliable path on HAOS is
  `ap_backend: nmcli` (the default via `auto`), which lets the host handle
  regulatory rules. Also confirm `country_code` matches your region.
- **`dnsmasq failed to start` / port 53 in use** - another DNS service holds
  port 53. dnsmasq here binds only to the hotspot interface; if a host-wide DNS
  is bound to `0.0.0.0:53` there may be a conflict - see the log.
- **Device connects but no entities** - confirm the Spider Farmer Bridge
  integration is running and its proxy is on `:8883`, and that `dns_target`
  points at the host address where the proxy listens.

## Alternative: router NAT (no add-on)

If you would rather not run a hotspot, redirect the controller's cloud traffic
at your router: DNAT outbound TCP `:8883` for `sf.mqtt.spider-farmer.com` to the
HA host. That is the "advanced / firewall" method and needs a router that
supports NAT/DNS overrides (pfSense, OPNsense, OpenWrt, etc.). The hotspot
add-on exists because most consumer routers do not.
