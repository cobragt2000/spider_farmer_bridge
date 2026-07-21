# Changelog

All notable changes to the **Spider Farmer Hotspot** add-on. The Supervisor
offers an update whenever the `version` in `config.yaml` increases; the notes
below are shown on the add-on's Changelog tab.

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
