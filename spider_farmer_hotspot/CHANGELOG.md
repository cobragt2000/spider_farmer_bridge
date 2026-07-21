# Changelog

All notable changes to the **Spider Farmer Hotspot** add-on. The Supervisor
offers an update whenever the `version` in `config.yaml` increases; the notes
below are shown on the add-on's Changelog tab.

## 0.5.4

- **Fix: iptables rules had no effect on HAOS (0 redirect hits).** The container's default
  `iptables` is the legacy backend, but Home Assistant OS processes **nftables** — so the
  8883->proxy redirect and the internet-NAT rules were added to a table the kernel never
  evaluates. They reported success yet matched 0 packets, which is why the light dialed
  192.168.99.1 but nothing reached the proxy. The add-on now uses `iptables-nft` (the
  nft-backed backend) so the rules land in the ruleset the kernel actually uses.

## 0.5.3

- **Internet access for the hotspot (likely fix for "connected but offline").** The add-on
  now enables IP forwarding + NAT (MASQUERADE) from the hotspot subnet to the host's uplink,
  so joined devices have real internet just like they do on the LAN in the router-NAT method.
  Many controllers won't open their cloud MQTT connection until they can reach the internet,
  which left them joined but offline on an isolated hotspot. The `:8883` redirect still
  intercepts the cloud connection to the local proxy. New `internet_access` option (default
  on) to disable it if you want a fully isolated hotspot.

## 0.5.2

- **Dashboard: redirect packet counter.** When `proxy_port` != 8883, the dashboard now
  shows how many packets have hit the 8883 -> proxy redirect rule. 0 pkts means no device
  has actually sent traffic to :8883 on the hotspot (it isn't attempting the cloud
  connection, or is using a cached IP); >0 confirms the redirect is catching it.

## 0.5.1

- **Fix: DNS/DHCP logs were invisible.** dnsmasq defaulted to syslog (absent in the
  container), so `log-dhcp` and the `dns_logging` query log never reached the add-on
  Log tab. Added `log-facility=-` so all dnsmasq logging goes to stderr and shows up
  in the log.

## 0.5.0

- **`proxy_port` option + port redirect.** Devices always connect to the cloud on
  tcp/8883, but the integration's proxy may listen elsewhere (e.g. :8000). Set
  `proxy_port` to the integration's listen port and the add-on redirects the
  hotspot's inbound 8883 to it (iptables), so devices actually reach the proxy —
  the job the router did in the NAT method. The startup health check and the
  dashboard now reflect the configured port and show the 8883 -> proxy_port
  redirect.

## 0.4.0

- **Status dashboard (HA ingress).** The add-on now has a Web UI (Open in the
  sidebar / add-on page) showing the AP settings, the DNS redirect target,
  whether the integration's proxy is **listening on :8883**, and a live table of
  **connected Wi-Fi clients** (name / IP / MAC / lease) from the DHCP leases.
- **DHCP logging** is always on now (`log-dhcp` + a lease file), so the add-on
  log shows each device's DHCP handshake and assigned IP. New **`dns_logging`**
  option adds per-query DNS logging to see the controller's cloud lookups
  (noisy; off by default).
- **Proxy health check at startup:** logs a clear warning if nothing is
  listening on :8883 (a device can join the hotspot yet stay offline if the
  integration/proxy isn't reachable at the DNS target).

## 0.3.9

- **Raspberry Pi / brcmfmac support:** disable Wi-Fi powersave on the AP
  connection in the nmcli backend, which improves access-point stability on
  Broadcom radios (Pi 3B+/4/5 built-in Wi-Fi). Applied best-effort so it can
  never break the connection.
- Docs: documented that the Pi's built-in Wi-Fi is supported and that `auto`
  (nmcli) is the recommended backend there.

## 0.3.8

- **New `security` option** (`wpa2` / `wpa` / `open`) for both backends. This is
  a workaround for radios whose driver can't set a WPA2/CCMP key in AP mode
  (e.g. old Ralink `rt73usb`, which reaches `AP-ENABLED` then fails with
  `key not allowed` / `Failed to set beacon parameters`): try `wpa` (TKIP) or,
  as a hardware test only, `open`. When `open`, no password is required.
- Docs: added a Wi-Fi adapter compatibility section with the log symptoms of an
  incompatible radio and known-good AP chipsets (MediaTek MT7601U/MT76x2U,
  Ralink RT5370/rt2800usb).

## 0.3.7

- **hostapd:** dropped `ieee80211n`/`wmm` so the AP uses a plain 20MHz channel.
  This avoids the HT40 "(extension) channel is disabled" failure some radios hit
  even in a valid country domain.
- **Diagnostics:** the startup now logs the radio's driver/chipset, whether any
  radio is self-managed, the full `iw reg get` output, and the actual 2.4GHz
  channel flags for the chosen radio - so a channel that's `disabled`/`no IR` at
  the radio level is visible in the log.

## 0.3.6

- Version bump to ensure the Supervisor detects the update. Includes all of the
  0.3.5 regulatory-domain handling. No other change. **When pushing, confirm
  `config.yaml` on GitHub shows the new `version:` - the Supervisor reads the
  version from that file only.**

## 0.3.5

- **Fix (root cause of AP failures):** both backends were failing because the
  radio sat in the world ("00") regulatory domain, where 2.4GHz AP transmission
  is forbidden - hostapd reported "channel is disabled" and NetworkManager timed
  out as "802.1X supplicant took too long to authenticate". The add-on now sets
  the regulatory domain (`iw reg set <country_code>`) before starting either
  backend, logs the domain before/after, flags self-managed radios, and prints a
  clear warning (with the exact HA setting to change) if the domain is still
  world/unset. Added the `wireless-regdb` package.
- **Note:** the definitive fix is host-side - set your country under
  **Settings > System > General > Country** in Home Assistant, which sets the
  system-wide Wi-Fi regulatory domain.

## 0.3.4

- **Build:** removed the deprecated `build.yaml`. The base-image `LABEL` moved
  into the Dockerfile and `ARG BUILD_FROM` now has a default, which silences the
  Supervisor's "build.yaml is deprecated" and Docker's `InvalidDefaultArgInFrom`
  warnings. The Supervisor still injects the correct per-architecture base image
  at build time (archs are declared in `config.yaml`). No runtime change.

## 0.3.3

- **Fix (build):** removed the `rfkill` apk package - it does not exist in the
  Alpine 3.19 base and broke the image build. `/dev/rfkill` isn't exposed to the
  add-on container anyway, so the tool couldn't have run; the hostapd fallback
  still sets the regulatory domain via `iw reg set`, and the `rfkill unblock`
  call remains guarded so it's simply skipped when the tool is absent.

## 0.3.2

- Log the running add-on version at startup (`... add-on v0.3.2 starting`) to
  make support and update verification easier. No functional change to the
  hotspot or DNS behaviour.

## 0.3.1

- **Fix (nmcli):** the AP connection is now built in a single `nmcli con add`
  with `802-11-wireless.mode ap` set at creation. Previously the mode was applied
  by a follow-up `modify` that also carried an invalid per-connection country
  property; when NetworkManager rejected that property the whole command was
  silently dropped, leaving the radio in client mode and failing with
  "Wi-Fi network could not be found".
- **Fix (nmcli):** `con add` / `con up` errors are surfaced to the log instead of
  being swallowed, so real NetworkManager messages are visible.
- **Fix (hostapd fallback):** run `rfkill unblock all` and `iw reg set <country>`
  and add `ieee80211d=1` before starting hostapd, addressing
  "channel is disabled" on radios whose regulatory domain wasn't set. Added the
  `rfkill` package.

## 0.3.0

- **Wi-Fi interface dropdown + auto-detection.** `wifi_interface` is now a
  dropdown (`auto` / `wlan0` / `wlan1` / `wlan2`) defaulting to `auto`. On start
  the add-on enumerates wireless interfaces, prefers one that advertises AP mode,
  selects it, and logs every card it found (so oddly-named USB dongles are
  handled and easy to identify for a manual override).

## 0.2.0

- **NetworkManager AP backend.** New `ap_backend` option (`auto` / `nmcli` /
  `hostapd`). On Home Assistant OS, `nmcli` lets NetworkManager own the AP so it
  no longer fights the OS for the radio; our dnsmasq still provides DHCP and the
  DNS override. `auto` picks nmcli when a running NetworkManager is present, else
  hostapd, and falls back to hostapd if nmcli fails.
- Added `host_dbus` so the in-container `nmcli` can reach the host NetworkManager.

## 0.1.0

- Initial release. Wi-Fi access point (hostapd) on a dedicated radio plus
  dnsmasq for DHCP and a local DNS override that points
  `sf.mqtt.spider-farmer.com` at the Spider Farmer Bridge proxy — so GGS
  controllers reach the integration over Wi-Fi with no router NAT rule.
