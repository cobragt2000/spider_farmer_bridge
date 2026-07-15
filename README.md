# Spider Farmer Bridge for Home Assistant

[![Validate](https://github.com/cobragt2000/spider_farmer_bridge/actions/workflows/validate.yml/badge.svg)](https://github.com/cobragt2000/spider_farmer_bridge/actions/workflows/validate.yml)
[![hacs](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

Local control and monitoring for **Spider Farmer GGS (Genius Grow System)**
devices — Display Paneles, AC5/AC10 power strips, light controllers, grow
lights, climate gear, and 3-in-1 soil probes — as **native Home Assistant
entities**. No cloud API, no MQTT broker, no polling the app.

It works by transparently proxying each device's own TLS connection to the
Spider Farmer cloud: devices keep working in the SF app exactly as before,
while every status frame passing through becomes live HA state and (optionally)
HA can inject commands back.

An independent Home Assistant integration for Spider Farmer GGS controllers.
It speaks the controllers' own protocol, first documented by the community
projects credited below, and is implemented from this project's own packet
captures — a TLS proxy, MQTT codec, normalizer, and command translator feeding
native HA entities.

---

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
GGS device ──TLS──► MITM proxy (this integration, port 8883)
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
into HA. Device types are detected from evidence on the wire — outlets mean
power strip; accessory blocks without outlets mean Display Panel; lights only
means light controller — with automatic correction if later evidence
disagrees.

## Requirements

- Home Assistant 2024.x or newer
- A router/firewall that can NAT-redirect the GGS devices' outbound
  `TCP 8883` to your HA host (pfSense, OPNsense, OpenWrt, etc.)
- The HA host reachable from the devices' VLAN on the configured listen port

## Installation

### HACS (custom repository)
1. HACS → three-dot menu → **Custom repositories** → add
   `https://github.com/cobragt2000/spider_farmer_bridge`, category **Integration**
2. Install **Spider Farmer Bridge**, restart Home Assistant
3. Settings → Devices & Services → **Add integration** → Spider Farmer Bridge

### Manual
Copy `custom_components/sf/` into your `config/custom_components/` and
restart.

### Network redirect (pfSense example)
Port-forward rule on the devices' interface: source = the GGS devices,
destination `any:8883` → redirect target = HA host, port 8883. Devices
connect within seconds of the rule going live; no device-side changes.

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
each release automatically. Two cards are bundled:

- **`custom:spider-farmer-card`** — the main tent card (below).
- **`custom:ppfd-3d-card`** — a 3D PPFD visualizer for Spider Farmer SE4500 /
  SF2000 grow lights. Configure it per its own options (`light_model`,
  `entities`). Note: it loads three.js from a CDN at runtime, so its 3D view
  needs internet access.

The main card (`custom:spider-farmer-card`) is a single tabbed card:

- **Overview** — environment parameter tiles (Air Temp, Humidity, VPD, CO2,
  PPFD, Soil Temp/Moisture/EC) plus light / fan / blower / climate controls.
- **Config** — the Environment editor (day/night targets + dead zones for
  Temp, Humidity, CO2, plus day-cycle times) and per-outlet mode configuration.

Add it to a dashboard once installed:

```yaml
type: custom:spider-farmer-card
panel: dp1                   # the display panel's slot (sf_dp1_*)
outlets: [dp1, ac5, ac10]    # slots whose outlet modes to show on the Config tab (optional)
title: Grow Tent             # optional
default_tab: overview        # optional: "overview" (default) or "config"
```

Entities render only when they exist, so partial setups display cleanly, and
the Config tab appears only when the environment/outlet-mode entities are
present. Enabling the card loads the element globally but has no effect until
you add it to a dashboard.

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/15_card_overview.png" width="330" alt="Spider Farmer card — Overview tab" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/16_card_config.png" width="330" alt="Spider Farmer card — Config tab" />
</p>

The `custom:ppfd-3d-card` 3D PPFD visualizer for SE4500 / SF2000 grow lights:

<p align="center">
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/ppfd_se4500.png" width="330" alt="PPFD 3D visualizer — SE4500" />
  <img src="https://raw.githubusercontent.com/cobragt2000/spider_farmer_bridge/main/docs/images/ppfd_sf2000.png" width="330" alt="PPFD 3D visualizer — SF2000" />
</p>

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
- Cached states from before 3.2.3 lack the ownership stamp and are not
  restored once — entities show `unknown` for the seconds until devices report
- The `logs/` folder inside `custom_components/sf/` is lost if you delete the
  folder before extracting an update; extract over it, or move the log path
  in Settings

## Credits

Grateful acknowledgement to the community projects that first reverse-engineered
the Spider Farmer GGS protocol this integration speaks:

- **Eddie Piazza** — Schedule 4 Real: https://github.com/EddiePiazza/schedule-4-real
- **iceboerg** — spiderfarmer-bridge: https://github.com/iceboerg00/spiderfarmer-bridge

This integration is an independent implementation written from its own packet
captures.

Development assistance — integration refactoring, test suite, the bundled
dashboard cards, and packaging — by **Claude (Anthropic)**.

## License

Released under the MIT License — see [`LICENSE.md`](LICENSE.md).

## Disclaimer

Not affiliated with Spider Farmer. This intercepts your own devices' traffic
on your own network; devices remain fully functional in the