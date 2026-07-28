# Spider Farmer Bridge for Home Assistant

[![Validate](https://github.com/cobragt2000/spider_farmer_bridge/actions/workflows/validate.yml/badge.svg)](https://github.com/cobragt2000/spider_farmer_bridge/actions/workflows/validate.yml)
[![hacs](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Discord](https://img.shields.io/badge/Discord-Join%20our%20chat-5865F2.svg?logo=discord&logoColor=white)](https://discord.gg/YZCcdwXTCp)
![Discord Online](https://img.shields.io/discord/1527435346420175042)
[![Integration usage](https://img.shields.io/badge/dynamic/json?color=41BDF5&logo=home-assistant&label=integration%20usage&suffix=%20installs&cacheSeconds=15600&url=https://analytics.home-assistant.io/custom_integrations.json&query=$.sf.total)](https://analytics.home-assistant.io/)

[![Integration version](https://img.shields.io/badge/dynamic/json?color=2ea44f&label=integration&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcobragt2000%2Fspider_farmer_bridge%2Fmain%2Fcustom_components%2Fsf%2Fmanifest.json)](https://github.com/cobragt2000/spider_farmer_bridge/releases)
[![Dashboard card version](https://img.shields.io/badge/dynamic/json?color=1f6feb&label=dashboard%20card&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcobragt2000%2Fspider_farmer_bridge%2Fmain%2Fcustom_components%2Fsf%2Fcards%2Fcard-version.json)](https://github.com/cobragt2000/spider_farmer_bridge)
[![Hotspot add-on version](https://img.shields.io/badge/dynamic/yaml?color=8250df&label=hotspot%20add--on&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcobragt2000%2Fspider_farmer_bridge%2Fmain%2Fspider_farmer_hotspot%2Fconfig.yaml)](https://github.com/cobragt2000/spider_farmer_bridge)
[![Downloads](https://img.shields.io/github/downloads/cobragt2000/spider_farmer_bridge/total?color=orange&label=downloads)](https://github.com/cobragt2000/spider_farmer_bridge/releases)

Local control and monitoring for **Spider Farmer GGS (Genius Grow System)**
devices — Display Panels, AC5/AC10 power strips, light controllers, grow
lights, climate gear, and 3-in-1 soil probes — as **native Home Assistant
entities**. No cloud API, no MQTT broker, no polling the app.

It works by transparently proxying each device's own TLS connection to the
Spider Farmer cloud: devices keep working in the SF app exactly as before,
while every status frame passing through becomes live HA state and (optionally)
HA can inject commands back.

> **📶 Connecting via Wi-Fi (no router config)?** This repo also ships a second,
> optional component — the **Spider Farmer Hotspot** add-on — which turns your HA
> host into a Wi-Fi access point the controllers join directly, so you don't need
> a router that can NAT-redirect traffic. It installs from this same repository
> via the **Add-on Store** (separately from this HACS integration). If your router
> already redirects the devices, you can ignore it. See
> [Connecting the devices](#connecting-the-devices).

---

## Screenshots

**Devices & entities** — everything modeled from live device evidence:

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/01_integration_entries.png" width="660" alt="Integration entries" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/13_power_strip_device.png" width="440" alt="Power Strip device page" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/08_sensors.png" width="235" alt="Sensor list" />
</p>

**Controls** — environment targets, climate/fan, and per-outlet modes:

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/05_environment_controls.png" width="270" alt="Environment controls" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/06_climate_fan_controls.png" width="250" alt="Climate & fan controls" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/07_outlet_controls.png" width="245" alt="Outlet controls" />
</p>

**Editable sensor calibration** — air + per-probe soil offsets and substrate type, written straight back to the controller:

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/18_calibration_entities.png" width="330" alt="Calibration and substrate entities" />
</p>

**Configure → Settings, mappings, migration & probe replacement:**

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/09_configure_menu.png" width="330" alt="Configure menu" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/10_settings_options.png" width="330" alt="Settings options" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/02_device_slot_mappings.png" width="300" alt="Device slot mappings" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/11_migrate_device.png" width="330" alt="Migrate device" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/04_replace_soil_probe.png" width="300" alt="Replace soil probe" />
</p>

## What you get

**Devices, modeled truthfully.** Every entity is created from *evidence* —
the data blocks a device actually reports — never from assumptions about the
device type. A Display Panel with two lights and nothing else gets exactly two
lights. Plug a humidifier in tomorrow and its entities appear on the next
status frame; unplug the CO2 probe and its sensor is pruned. The AC5/AC10
power strips support the full accessory set (lights, fans, blowers, heaters,
humidifiers, dehumidifiers, air sensors, soil probes) and are modeled
accordingly.

**Entity types** (per device, as reported):

| Group | Entities |
|---|---|
| Air sensors | Temperature, Humidity, CO2, VPD, PPFD (per-field, 2-decimal display) |
| Outlets | Switch per reported outlet (power strips only) |
| Lights | Light 1 / Light 2 with brightness + brightness sensors |
| Fan | Fan (10 gears, working oscillation), **Fan Speed** slider (0–100 %, 10 % steps) + speed sensor, Oscillation slider, Natural Wind, Mode |
| Blower | Blower (on/off + speed, 25 % floor), **Blower Speed** slider (0 = Off, 25–100 %) + speed sensor, Mode |
| SE Lights | Standalone SE-series (SE4500 etc.): dimmable light, Manual/Automatic mode, schedule start/end, schedule brightness, sunrise/sunset fade (0-30 min, one setting drives both ends of the schedule), plus Brightness/Mode/Active sensors |
| Climate | Humidifier / Dehumidifier / Heater: manual On/Off switch, Level control (heater 1-10, humidifier 1-4, dehumidifier Low/High), Active, Level, Mode, Tank / Status |
| Soil probes | Temperature, Moisture, EC per probe (auto-discovered), plus per-device **Soil Avg** Temperature / Moisture / EC across a controller's probes |

📋 **Full entity reference:** every entity the integration creates — grouped by
function with `entity_id` suffixes and descriptions — is documented in
**[docs/ENTITIES.md](docs/ENTITIES.md)**.

**Logical slot entity IDs.** Display names stay physical
(`SF Display Panel A1B2`); entity IDs are role-based:
`sensor.sf_dp1_temperature`, `switch.sf_ac10_outlet_3`,
`sensor.sf_dp1_soil2_moisture`. Slots are assigned first-seen, persisted, and
fully editable in **Configure → Device mappings** (soil probes included,
scoped per host device — `dp1_soil1` and `dp2_soil1` are different probes).
Swaps and renames apply instantly via a collision-safe two-phase reconcile.

**Hardware replacement without breakage.**
*Devices:* Configure → Migrate device — pick old and new (same type
enforced); entity IDs, history, automations, and the logical slot transfer to
the replacement; the old device is removed.
*Soil probes:* in Device mappings, give the new serial the dead probe's slot
and blank the old serial (blank = retire). One submit.

**Deleting devices.** Delete works from HA's device page. A connected device
is *reset* (session severed, entities rebuilt fresh on reconnect); power a
device off first for permanent removal. Devices are never auto-removed — a
tent packed away for months is dormant, not gone.

**Availability done right.** Per-device availability (one unit dropping
doesn't grey out the rest), a 120-second startup grace window, and a restore
ownership check (`sf_device` attribute) so a device can never resurrect
another device's cached values after a slot change.

**Near-real-time config.** The proxy watches app→device commands and
confirm-polls the affected module seconds later — change fan oscillation in
the SF app and HA reflects it in ~2–4 s instead of the 10-minute poll.

**Customization preservation.** "Preserve on removal" (default on) snapshots
entity renames, icons, areas, and hidden/disabled flags to
`config/sf/preserved_registry.json` — outside the integration folder, so it
survives a full reinstall and restores automatically. Uncheck it for a clean
removal that also purges the integration's recorder history and statistics.

**Diagnostic log.** Options-toggled, daily-rotating (1–30 day retention),
written off the event loop, separate from HA's log. Includes a
**novel-field detector**: any field the controllers send that the integration
doesn't consume is flagged once — a literal to-do list for feature additions
— plus full capture of app commands, config responses, detection decisions,
and contained errors.

> **Sharing diagnostic logs?** They contain your devices' MAC addresses,
> account UID, and timezone/locale. Redact those before posting a log to a
> public GitHub issue (search-and-replace the MACs with e.g. `aabbccddeeff`).

**Robustness.** Frame-processing errors are contained (they can never sever a
device's cloud connection), reloads sever sessions so devices reconnect to
the new instance (no reboot needed after options changes), a misdetected
device type self-repairs in place, and Settings saves can't clobber stored
mappings.

**Device control** (HA → device) is gated behind an options checkbox,
**default off**, toggleable live. With control off the integration is
read-only and commands raise a visible error. The command layer (outlets,
lights with brightness, fan gears/oscillation, blower with its 25 % floor)
is tested end-to-end against real injected payloads.

---

## How it works

```
GGS device ──TLS──► MITM proxy (this integration, listen port)
                       │            └──TLS──► Spider Farmer cloud (unchanged)
                       ▼
                  state bus ──► native HA entities
                       ▲
                  commands (optional, gated)
```

Your network redirects the devices' cloud traffic
(`sf.mqtt.spider-farmer.com:8883`) to the machine running HA. The
integration terminates TLS with bundled certificates, relays everything to
the real cloud (the SF app keeps working), and mirrors the decoded traffic
into HA. Set the proxy's **listen port to something other than 8883** (e.g.
`8000`) — the Mosquitto/MQTT broker add-on binds `8883` on the HA host, so the
proxy must listen elsewhere; your redirect (or the hotspot) forwards the
devices' `8883` traffic to that port. Device types are detected from evidence on the wire — outlets mean
power strip; accessory blocks without outlets mean Display Panel; lights only
means light controller — with automatic correction if later evidence
disagrees.

## Requirements

- Home Assistant 2024.x or newer
- **One way to get the devices' cloud traffic to the HA host** (see
  [Connecting the devices](#connecting-the-devices)) — either a router/firewall
  that can NAT-redirect the devices' outbound `TCP 8883` (pfSense, OPNsense,
  OpenWrt, etc.), **or** the companion **Spider Farmer Hotspot** add-on (no
  router config)
- The HA host reachable from the devices on the integration's **listen port**.
  Set the proxy to a port **other than 8883** (e.g. `8000`): the Mosquitto/MQTT
  broker add-on already binds `8883` on the HA host, so the proxy can't share it.
  Your redirect (or the hotspot) forwards the devices' `8883` traffic to that
  port — the devices still dial `8883`, only the HA-side listener differs.

## Installation

### HACS (custom repository)
1. HACS → three-dot menu → **Custom repositories** → add
   `https://github.com/cobragt2000/spider_farmer_bridge`, category **Integration**
2. Install **Spider Farmer Bridge**, restart Home Assistant
3. Settings → Devices & Services → **Add integration** → Spider Farmer Bridge

### Manual
Copy `custom_components/sf/` into your `config/custom_components/` and
restart.

## Connecting the devices

The integration is a local proxy: the GGS controllers must reach it instead of
the Spider Farmer cloud. Pick **one** of these — you do not need both.

### Option A — Wi-Fi hotspot add-on (no router config)

The **Spider Farmer Hotspot** add-on — shipped from **this same repository** —
turns your HA host into a small Wi-Fi access point that the controllers join
directly. It runs a local DNS override so `sf.mqtt.spider-farmer.com` resolves
to this host's proxy; the integration still relays to the real cloud, so the
phone app keeps working. Nothing changes on your router.

Requires Home Assistant OS/Supervised, a wired uplink, and a **dedicated 2.4 GHz
Wi-Fi radio** for the AP (a Pi's built-in Wi-Fi or a USB dongle). On HAOS it
uses NetworkManager for the AP by default (`ap_backend: auto`) so it coexists
with the OS's own Wi-Fi handling; a raw-`hostapd` backend is also available.

Install it once you've added this repo to the **Add-on Store** (Settings →
Add-ons → Add-on Store → ⋮ → Repositories → the same repo URL you added in
HACS). Set an SSID/password, then pair each controller to the hotspot with the
Spider Farmer app (hold the controller's mode button ~5 s to enter pairing).
Full steps in [`spider_farmer_hotspot/DOCS.md`](spider_farmer_hotspot/DOCS.md).

> One repo, two stores: HA installs *integrations* (HACS) and *add-ons*
> (Supervisor) separately, so you add this repository's URL in both places —
> but it's the same URL and the same repo.

### Option B — Router NAT redirect (pfSense example)

Port-forward rule on the devices' interface: source = the GGS devices,
destination `any:8883` → redirect target = HA host on the integration's
**listen port** (e.g. `8000` — not `8883`, which the MQTT broker add-on binds
on the HA host). Devices connect within seconds of the rule going live; no
device-side changes. Needs a router that supports NAT/DNS overrides — most
consumer routers do not, which is what Option A is for.

Rule checklist:

- **Destination port `8883`** is what the rule must *match* (that's what the
  devices dial); the **translated/redirect port** is the integration's listen
  port (e.g. `8000`). Don't put `8000` in the destination-port field — the
  devices never send anything there, so the rule would match nothing.
- **Source port stays Any** (clients use random ephemeral ports).
- **Same subnet? Enable Masquerade/SNAT on the rule.** If the GGS devices and
  the HA host sit on the same subnet, a destination-NAT-only redirect breaks:
  the HA host replies *directly* to the device from its own IP instead of the
  cloud IP the device dialed, and the device drops the reply — the TCP
  handshake never completes and the proxy log stays silent even though the
  rule's hit counter climbs. Turning on the rule's **Masquerade / SNAT /
  NAT reflection** option forces replies back through the router, which
  un-NATs them. (pfSense: enable NAT reflection + associated outbound NAT for
  the rule; UniFi/others: tick Masquerade on the NAT rule.) Putting the
  devices on their own VLAN also avoids this, as does Option A.

## Configuration (gear icon → Configure)

- **Settings** — listen port, upstream host/port, **Allow device control**
  (live toggle), **Install Spider Farmer dashboard card** (see below),
  **Preserve customizations & history on removal**, diagnostic log
  toggle/path/retention
- **Device mappings** — view/edit every device's and soil probe's logical
  slot; entity IDs re-align on submit
- **Migrate device** — hardware replacement with identity transfer

## Dashboard card

The integration ships optional Lovelace cards. Tick **Settings → Install Spider
Farmer dashboard card** and the integration serves and auto-registers them — no
HACS install and no manual Lovelace resource entry. Unchecking it removes them
from the frontend (the change applies live; refresh the browser to pick it up).
The served URLs carry the integration version, so browsers refetch the cards on
each release automatically. Three cards are bundled:

- **`custom:spider-farmer-card`** — the main tent card (below).
- **`custom:spider-light-card`** — a control card for an SE-series light
  (below).
- **`custom:ppfd-3d-card`** — a 3D PPFD visualizer for Spider Farmer SE4500 /
  SF2000 grow lights. Configure it per its own options (`light_model`,
  `entities`).

The main card (`custom:spider-farmer-card`) is a single tabbed card:

- **Overview** — environment parameter tiles (Air Temp, Humidity, VPD, CO2,
  PPFD, Soil Temp/Moisture/EC) plus light / fan / blower / climate controls.
  The Soil Temp / Moisture / EC tiles are the panel-wide averages — click one
  to expand a per-probe breakdown of that reading.
- **Environment** — day/night targets and dead zones for Temp, Humidity, and
  CO2, plus the day-cycle start/stop times.
- **Outlets** — per-outlet mode configuration for the strips nested under this
  panel. An outlet in **Time Slot** mode gets a full multi-slot, weekday-aware
  schedule editor (add/remove up to 12 slots, per-day picker, start/stop times).
- **Calibration** — editable sensor calibration mirroring the SF app: air
  offsets (Air Temp, Humidity, PPFD, CO2) and per-probe soil offsets (Temp,
  Moisture, EC) plus a substrate-type picker on Pro probes. Editing a value
  writes it straight back to the controller.
- **Alerts** — editable alarm thresholds, mirroring the app's Alarm Settings:
  Climate (Air Temp, Humidity, VPD, CO2, PPFD), Substrate (Soil Temp, WC, Soil
  EC), and Other Device flags. Each has an enable toggle and Max/Min limits;
  edits are staged and written together with Save.
- **Log** — the app's Notification screen: decoded alarm history with raised
  (red) / restored (green) markers, Device and Type filters, and a date picker
  that defaults to the current day. Shows that day's entries, newest first
  (capped at ten rows, scroll for the rest). Appears once the controller's
  Alarms sensor has data.

On the device tiles, mode-dependent settings (schedules, cycles, speeds) are
staged as you edit and committed as one atomic write when you press **Save** —
under the hood the card calls the `sf.apply_bundle` service.

Add it to a dashboard once installed:

```yaml
type: custom:spider-farmer-card
panel: dp1                   # the display panel's slot (sf_dp1_*)
outlets: [dp1, ac5, ac10]    # slots whose outlet modes to show on the Outlets tab (optional)
title: Grow Tent             # optional
default_tab: overview        # optional: "overview" (default), "environment", "outlets", "calibration", "alerts", or "log"
```

Entities render only when they exist, so partial setups display cleanly: each
of the Environment, Outlets, and Calibration tabs appears only when that
panel actually has the matching entities. Enabling the card loads the element
globally but has no effect until you add it to a dashboard.

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/15_card_overview.png" width="245" alt="Spider Farmer card — Overview tab" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/16_card_config.png" width="245" alt="Spider Farmer card — Environment tab" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/19_card_outlets.png" width="245" alt="Spider Farmer card — Outlets tab" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/17_card_cali.png" width="245" alt="Spider Farmer card — Calibration tab" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/24_card_alerts.png" width="245" alt="Spider Farmer card — Alerts tab" />
</p>

When a panel has two or more soil probes, the Soil tiles and the **All Soil
Stats** tile expand to a per-probe table. The Overview also flags problems at a
glance: a reading colours against its own alarm limits — **red above max, blue
below min** — an offline probe and the All Soil Stats tile turn red, and a
climate fault shows on its tile (**TANK EMPTY** / **TANK FULL** / heater alarm).
Pick tile-tint or value-text highlighting in the **Settings** tab. The two
Overview shots below are the same tent in *tile-colour* and *text-colour* mode:

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/22_card_soil_tiles.png" width="245" alt="Overview — tile-colour highlights, offline soil probes, and TANK EMPTY" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/20_card_soil_breakdown.png" width="245" alt="Overview — text-colour highlights" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/21_card_all_soil_stats.png" width="300" alt="Settings tab — out-of-range highlight modes" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/25_card_alert_color_modes.png" width="420" alt="Highlight modes compared — colored value text vs colored tile" />
</p>

The `custom:ppfd-3d-card` 3D PPFD visualizer for SE4500 / SF2000 grow lights:

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/ppfd_se4500.png" width="330" alt="PPFD 3D visualizer — SE4500" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/ppfd_sf2000.png" width="330" alt="PPFD 3D visualizer — SF2000" />
</p>

### SE-series light card

`custom:spider-light-card` mirrors the SF app's light screen for an SE-series
light: a circular brightness dial with an on/off toggle, a brightness slider, a
Manual / Automatic mode selector, and — in Automatic — a full multi-period,
weekday-aware **schedule editor**. Add or remove time periods; each has a per-day
picker, start/stop times, brightness, and sunrise/sunset fade. Changes are staged
and written together with **Save** (or **Discard**).

```yaml
type: custom:spider-light-card
light: se1          # the SE light's slot (sf_se1_*); defaults to the first found
title: Grow Light   # optional
```

The schedule is exposed on `sensor.sf_se1_schedule` (period count as state, the
decoded `periods` list as an attribute) and written back with the
`sf.set_se_schedule` service, so you can also drive it from automations.

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/23_light_card.png" width="300" alt="Spider Light card — dial, mode, and schedule editor" />
</p>

## Troubleshooting the dashboard card

**"Custom element doesn't exist: spider-farmer-card"** means the browser
couldn't load the card's JavaScript. In order of likelihood:

1. **Hard-refresh the browser** (Ctrl/Cmd-Shift-R; in the companion app:
   Settings → Companion app → Reset frontend cache). The card is served with a
   `?v=` version query, and a stale cached page can still reference an old one.
2. **Check the integration actually loaded.** The cards are served by the
   integration, so if setup failed the URL 404s and the element never
   registers. The usual cause is the proxy's **listen port being taken** (port
   `8883` is the Mosquitto add-on's — use e.g. `8000`); look for
   `cannot bind port` in Settings → System → Logs. Since 3.19.45 the card is
   registered before the port is bound, so this no longer breaks the card.
3. **Confirm the integration folder is `custom_components/sf`.** HA derives the
   folder from the integration's domain — a folder named after the *repository*
   (`spider_farmer_bridge`) won't load at all. Rename it to `sf` and restart.
4. **Check for duplicate/stale resources.** Settings → Dashboards → ⋮ →
   Resources: there should be exactly one `/sf_bridge_frontend/spider-farmer-card.js`
   entry. Delete extras (older `?v=` copies), then reload.
5. **YAML-mode dashboards** don't read the storage resource list; the
   integration also adds the card as a frontend extra-module URL, which covers
   this — but a manual `lovelace: resources:` entry pointing at
   `/sf_bridge_frontend/spider-farmer-card.js` works too.

You do **not** need to symlink or copy the cards into `config/www/` — if that's
the only thing that makes the card load, something above is the real cause and
worth reporting with your log.

## Entity ID scheme

```
sensor.sf_dp1_temperature          Display Panel 1 air temperature
switch.sf_ac10_outlet_3            AC10 strip, outlet 3
light.sf_dp2_light_1               Display Panel 2, light port 1
fan.sf_dp1_blower                  exhaust blower
sensor.sf_dp1_soil2_ec             probe 2 on Display Panel 1
sensor.sf_ac5_soil1_moisture       probe 1 on the AC5 strip
sensor.sf_dp1_soil_avg_moisture    per-device soil average (all probes on dp1)
```

Unique IDs are MAC/serial-based underneath, so editing slots never touches
identity or history.

## Upgrading / removal notes

- Entity IDs from any earlier version rename in place automatically on first
  boot (history follows the rename)
- The `logs/` folder inside `custom_components/sf/` is lost if you delete the
  folder before extracting an update; extract over it, or move the log path
  in Settings

## Credits

Grateful acknowledgement to the community projects that first reverse-engineered
the Spider Farmer GGS protocol this integration speaks:

- **Eddie Piazza** — Schedule 4 Real: https://github.com/EddiePiazza/schedule-4-real
- **iceboerg** — spiderfarmer-bridge: https://github.com/iceboerg00/spiderfarmer-bridge

This integration is an independent implementation written from its own packet
captures. The **Spider Farmer Hotspot** add-on's Wi-Fi AP + local DNS-redirect
approach is adapted from **iceboerg**'s spiderfarmer-bridge, used with
permission.

Development assistance — integration refactoring, test suite, the bundled
dashboard cards, and packaging — by **Claude (Anthropic)**.

## License

Released under the MIT License — see [`LICENSE.md`](LICENSE.md).

## Disclaimer

Not affiliated with Spider Farmer. This intercepts your own devices' traffic
on your own network; devices remain fully functional in the
