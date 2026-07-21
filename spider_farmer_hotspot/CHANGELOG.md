# Changelog

All notable changes to the **Spider Farmer Hotspot** add-on. The Supervisor
offers an update whenever the `version` in `config.yaml` increases; the notes
below are shown on the add-on's Changelog tab.

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
