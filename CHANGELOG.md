# Changelog

All notable changes to the Spider Farmer Bridge integration.
Each section below is ready to paste into the matching GitHub release.

## 3.19.146

### Fixed
- **Auto-mode heater/humidifier/dehumidifier tiles now turn off when they stop.**
  The controller reports these accessories turning *on* in its status frames but
  never reports the *off* — it just keeps saying they're enabled. The bridge now
  reads the on/off from the controller's operation log (which records both the
  start and the stop) and polls it directly, so the tile matches the app when an
  auto-mode heater, dehumidifier, or humidifier cycles off.
- **Leaf VPD target is Apply/Discard gated again.** The Leaf VPD min/max on the
  Environment tab were writing live instead of staging behind the tab's Apply /
  Discard bar; they now stage like every other Environment control. Card 0.20.28.

### Changed
- **Device mode summary now shows on the light and fan tiles too** (their mode,
  plus schedule window / gear), and an offline tile no longer shows a stray
  "unavailable" line.

## 3.19.145

### Fixed
- **Climate device tiles now show off when idle, and their level when on.** A
  heater/humidifier/dehumidifier in an auto mode reports "on" while it's enabled
  but not actually running, so the tile stayed on even though the app showed it
  off. The tile now follows the real running output, and disabling the accessory
  turns the tile off promptly. The heater and humidifier tiles also show their
  level (e.g. "L3"), and the dehumidifier shows Low/High, while running.

## 3.19.144

### Fixed
- **Device mode dropdowns no longer blank out.** The Mode (and other) dropdowns
  could render empty even though the device had a valid mode — a stale-value
  glitch where the select's value got stuck at "" after re-renders. The selects
  now force-sync their value, so they always show the real mode/selection.
- **Auto/gear now shows on the climate tiles.** The heater/humidifier/dehumidifier
  gear (Automatic / level / Low-High) was being decoded from the wrong (live)
  frames, so it stayed "unknown" and the tile summary and gear dropdown were
  blank. It's now decoded from the controller's config responses, so the tile
  shows e.g. "Temp · Auto" / "Humid · High" and the gear dropdown fills in.
- **Blower/Fan Standby speed selectable when running is Automatic.** With the
  running speed set to Automatic, the Standby dropdown offered only "Off"; it now
  offers the full range (e.g. 39%).

## 3.19.142

### Fixed
- **Environment "Automatic" now shows as Auto on the tile.** The running-speed
  entities (Blower Running Speed, Fan Schedule Gear) had a minimum above 0, so
  the Automatic value (0) was dropped as "unknown" — the tile couldn't show it.
  Their minimum is now 0, so Automatic reads back correctly: the tile mode
  summary shows "Auto" and the Gear/Running Speed selector shows "Automatic".

## 3.19.141

### Fixed
- **Fan / blower "Automatic" running speed now actually sends Automatic.** The
  card sends `0` for the Automatic option, but the write clamped it up to the
  minimum speed (so the blower ran at 1% instead of auto-ramping). `0` now
  correctly writes `maxSpeed:0` (Automatic), and it no longer zeroes the stored
  level. Verified against the app on the wire.

## 3.19.140

### Changed
- **Device mode summary moved up and onto 2–3 lines.** The mode summary now sits
  right under the tile's expand arrow (the main on/off/level stays at the bottom)
  and is split into short, abbreviated lines instead of one long line — e.g.
  "Enviro · Pri Temp" / "55% · Stby 20%", "Cycle" / "5m on · 7m off" / "L4 · Stby
  Off", "Temp · Auto", "Humid · High". Card 0.20.24.

## 3.19.139

### Added
- **"Automatic" gear for the heater, fan, and blower; Low/High for the
  dehumidifier.** Following the humidifier, the other auto-capable devices now
  expose their full gear choices in their auto/Environment mode, matching the SF
  app:
  - **Heater** (Temperature mode): Automatic (controller picks the level) or a
    fixed level 1–10 — device `level` field (0 = Automatic).
  - **Fan** (Environment): Automatic or a fixed gear 1–10 — device `maxSpeed`
    field (0 = Automatic).
  - **Blower** (Environment): Automatic or a fixed running % (25–100) — device
    `maxSpeed` field (0 = Automatic).
  - **Dehumidifier** (Humidity mode): Low or High — device `level` field
    (0 = Low, 1 = High); "auto" for the dehumidifier is simply the Humidity mode.

  The tile mode summary shows these too (e.g. "Temperature · Auto",
  "Environment · Prioritize humidity · Auto", "Humidity · High"). Card 0.20.23.

## 3.19.138

### Added
- **Humidifier "Automatic" gear.** In Humidity mode the gear now offers
  **Automatic** (the controller picks the level from your day/night humidity
  targets) in addition to fixed levels 1–4 — matching the SF app. Automatic is
  stored in the device's `level` field (0 = Automatic); the tile keeps showing
  the actual running level. Card 0.20.22.
- **Device mode summary on tiles (Settings toggle).** A new "Device mode summary"
  toggle under Settings → Tile extras (Apply/Discard like the others). When on,
  each device tile shows a small line with its mode and key settings without
  opening it — e.g. blower "Environment · Prioritize humidity · 90/40%",
  humidifier "Humidity · Auto", a light "Schedule". Manual tiles are unchanged.

## 3.19.137

### Added
- **Automatic clock sync — controllers no longer drift.** When a controller
  connects, the bridge re-sends the current time and timezone (the same
  `setDevTimezone` the SF app uses), so schedules, cycles, and day/night windows
  always fire at the right wall-clock time. The timezone comes straight from Home
  Assistant's own configuration (including the correct DST rules), and the UTC
  clock is refreshed on every connect. It happens automatically for every
  controller — new or existing — whenever control is enabled; no app interaction
  needed.

## 3.19.135

### Fixed
- **Cycle Run/Off Duration is now an elapsed-time spinner, not a clock.** The
  Run Duration and Off Duration fields (blower, fan, heater, humidifier,
  dehumidifier Cycle mode) used a native time picker, which shows an AM/PM clock
  instead of a duration. They're now h / min / s number boxes matching the SF
  app's "00h 00min 00s" — Run Duration is how long it runs after it starts, Off
  Duration is how long it stays off before the next execution. Start Time stays a
  clock. Card 0.20.21.

## 3.19.134

### Fixed
- **Device mode selects now track the controller's real mode — no more reverting.**
  The Blower / Fan / Heater / Humidifier / Dehumidifier "Mode Set" selects were
  subscribed to the read-only Mode *sensor* topic, whose verbose label (e.g.
  "Environment: Prioritize Humi") never matches one of the four select options,
  so the select silently kept its last value — usually "Manual" — while the device
  was really in Environment/Cycle/etc. Changing a mode or saving settings then
  appeared to "revert." Two fixes: the controller's true `modeType` (which arrives
  in config responses and the full startup/reconnect snapshot) is now decoded into
  a properly collapsed Mode Set value plus the Environment Run Mode; and each Mode
  Set select now listens to its own topic. The card now reads the device's real
  current settings.
- **The card no longer auto-reverts a mode you picked.** A staged mode change now
  stays put until it's confirmed by the controller, or until you press Discard or
  leave the tab — there is no longer any time-based revert. Card 0.20.20.

## 3.19.132

### Added
- **Outlet mode config shows on selection — configure and apply in one step.**
  Picking a mode (Cycle, Temperature, Humidity, CO2) in the Outlets tab now shows
  that mode's settings immediately — Cycle timings (start / run / off / times), or
  the device dropdown for the environment modes — instead of the old two-step
  "apply, then the fields appear, then configure and apply again". Apply commits the
  mode and its settings in one atomic write (new `sf.set_outlet_config` service).
  Card 0.20.18.

## 3.19.131

### Fixed
- **Switching an outlet to a config mode now sticks.** Changing an outlet to Cycle
  / Time Slot / etc. sent a minimal `{modeType, mOnOff}` block with no `cycleTime` /
  `timePeriod`, which the firmware rejected — the outlet snapped back to Manual.
  The mode write now always includes a complete, valid config block (verified: the
  bare write in the log came back `modeType:0`).
- **Card no longer shows a stale mode after the device rejects it.** An optimistic
  mode pick that the controller doesn't confirm within a few seconds is now dropped,
  so the dropdown falls back to the real state instead of showing a mode the device
  never entered. Card 0.20.17.

## 3.19.130

### Changed
- **Fan Speed dropdown shows gears 1–10.** The fan is gear-based, so its Manual
  Speed dropdown now lists levels 1–10 instead of percentages (blower stays a
  25–100% list, light Brightness 11–100%). Card 0.20.16.

## 3.19.129

### Changed
- **Manual Speed / Brightness dropdowns use 1% steps.** Fan/blower Speed and light
  Brightness dropdowns now list every 1%, matching the old slider's granularity —
  fan Speed Off + 1–100%, blower Speed 25–100% (its hardware floor), light
  Brightness 11–100%. Card 0.20.15.

## 3.19.128

### Fixed
- **Outlet sub-settings applied together no longer clobber.** Changing an outlet's
  mode plus its cycle timings / device dropdowns in one Apply issued separate
  read-modify-writes that each read a stale cache, so only the last field stuck.
  The proxy now folds each outlet write back into its cache (same fix as env /
  fan / blower), so all the changes merge into the final block.

### Changed
- **Manual-mode Brightness is now a dropdown too.** Like the Speed control (3.19.127),
  the light's Manual Brightness is a percentage dropdown (5% steps) instead of a
  slider. Card 0.20.14.

## 3.19.127

### Changed
- **Manual-mode Speed is now a dropdown, not a slider.** The fan/blower Manual
  Speed control is a percentage dropdown (Off + 5% steps), easier to set an exact
  value than dragging a slider. Card 0.20.13.

## 3.19.126

### Fixed
- **Config-mode settings no longer clobbered by a base power/level change (full
  fix).** 3.19.125 fixed the blower power toggle but missed the **percentage/level**
  write path and leaked live-only keys into writes; a mode change (e.g. Manual →
  Environment) could still revert on reload. Now every bare power/brightness/level
  change on a **fan, blower, light, heater, humidifier, or dehumidifier** read-
  modify-writes the cached config block — preserving `modeType`, speeds, PPFD/Time
  Slot and Cycle settings — and strips live-only fields. The proxy also folds every
  `["device",<module>]` write back into its cache, so consecutive writes in one
  Apply build on each other regardless of order (verified against a device log).

## 3.19.125

### Fixed
- **Blower/fan Environment-mode speeds no longer wiped by the power toggle.** When
  a blower (or fan) was in a config mode (Environment / Cycle / Time Slot), applying
  changes fired two writes back-to-back — the mode + speed bundle, then the power
  toggle — and the power write sent a bare manual block that overwrote
  `modeType`/`maxSpeed`/`minSpeed`, so Running Speed reverted to blank and Standby
  Speed to Off right after Apply. The power toggle now read-modify-writes the cached
  config block (preserving the mode's speed settings), and the proxy folds
  `["device","fan"]`/`["device","blower"]` writes back into its cache so consecutive
  writes in one Apply build on each other (same fix as the environment "only 1 at a
  time" bug).

## 3.19.124

### Added
- **S-Station single-plug support.** The new Spider Farmer S-Station (a 1-outlet
  WiFi/Bluetooth smart plug) was being detected as an AC5 power strip. It's now
  recognised as its own device type — a single-outlet device types as **st**,
  shows as **"S-Station"** with `sf_st1_*` entities, and gets the same controls as
  the AC5/AC10 (outlet with modes, environment targets, alarms, calibration). The
  card recognises `st` panels and labels them S-Station. Detection is safe: a strip
  that happens to report only its first outlet early still upgrades to AC5/AC10
  once the rest appear. Card 0.20.12.
  (Built from the product listing + a menu screenshot — no device log yet, so
  mode-label wording may need a small tweak once a real S-Station log is captured.)

### Fixed
- **Card editor no longer lists a standalone strip as its own nested outlet
  device.** For a card whose panel *is* the AC5/AC10/S-Station, the "Outlet devices"
  list used to show that same strip (a redundant self-reference). Its outlets always
  render directly now, so the list only shows strips genuinely nested under a
  Display Panel.

## 3.19.123

### Changed
- Settings: the "Custom outlet names" toggle sits with the other tile toggles and
  keeps its description; the tile-display group is named "Tile extras". Card 0.20.11.

## 3.19.121

### Added
- **Custom layout (Phase 1): overall scale + tiles per row.** Settings → Layout has
  a "Custom layout" toggle; turn it on and you get a **Scale** slider (70–150%,
  default 100%) that zooms the whole card together — tiles, text, icons, graphs —
  and a **Tiles per row** selector (2–5). Both save to the controller (survive
  upgrades, sync across devices) and are per panel. Storage is a single layout blob
  so drag-to-reorder can be added later without another option. Card 0.20.9.

## 3.19.120

### Changed
- **Outlet name edits are now gated by Apply / Discard**, like every other outlet
  control. Typing a name stages it (the row shows the pending-edit highlight and
  the Apply bar activates); it's only saved on Apply and dropped on Discard or when
  you leave the tab — consistent with mode/power/schedule edits. Card 0.20.8.

## 3.19.119

### Added
- **Custom outlet names.** Outlet names aren't stored on the controller (the app
  keeps them cloud-side and never sends them to the device), so they can't be read
  through the bridge. Instead the card now lets you name outlets yourself: a
  "Custom outlet names" toggle in Settings → Outlet names, and once on, a Name
  field on each outlet in the Outlets tab that replaces "Outlet 1/2/…". Names are
  saved to the controller via the card-options store, so they survive upgrades and
  sync to your other devices. Card 0.20.7.

## 3.19.118

### Changed
- **Hotspot device-name map moved to `/config/sf/ap/`.** The integration now
  writes `sf_hotspot_devices.json` (the mac→friendly-name map the Wi-Fi AP add-on
  reads) to `/config/sf/ap/` instead of bare `/config`, keeping the integration's
  shared files together under `/config/sf/`. Pairs with Spider Farmer Hotspot
  add-on 0.8.1, which reads the new location and falls back to the old path so
  names keep working during the update.

## 3.19.117

### Fixed
- **Diagnostic log now lives at `/config/sf/logs/` and honours a custom path.**
  The default log location moved out of `custom_components/sf/logs/` — that folder
  is replaced on every integration update, which was wiping the log history. The
  default is now `sf/logs/diagnostic.log` (i.e. `/config/sf/logs/`), outside the
  integration, so updates can't delete it. Also fixes a bug where deliberately
  pointing the log at `/config/sf/logs` was silently rewritten back into the
  update-wiped folder on each reload, so the file was never created there. Existing
  installs on the old default are migrated out automatically; a path you set
  yourself is left alone. Point-of-truth for retention is unchanged.

## 3.19.116

### Changed
- **The 5-reading leaf calibrator now fills either Day or Night.** The
  "Calibrate from 5 readings" box gained a Day/Night selector, so the same box
  calibrates whichever offset you're setting — measure under the light and pick
  Day, or lights-off and pick Night, then Apply. The "Use" button labels the
  target it will fill. Card 0.20.6.

## 3.19.115

### Added
- **Separate Day and Night leaf offset for Leaf VPD.** Leaves run well below air
  temperature under the light (transpiration cooling) but settle close to air
  once it's off, so a single offset misreads Leaf VPD at night. The Leaf Offset
  control in the Calibration tab is now split into **Day** and **Night**, and the
  Leaf VPD sensor picks the active one from the controller's day cycle — flipping
  the instant the schedule crosses (it prefers the controller's own day/night
  flag, falling back to the Day Cycle start/stop times). The existing Leaf Offset
  keeps its value as the Day offset (no reset); Night defaults to 0.0 (leaf ≈ air)
  — adjust it in Calibration. The Leaf VPD target band stays a single range, since
  VPD targets track growth stage, not time of day. Card 0.20.5.

## 3.19.114

### Fixed
- **Tiles now follow the day/night cycle when picking targets.** The tile target
  (and the Air VPD healthy range) read a binary sensor that doesn't exist
  (`is_day_env_target`), so the lookup always fell through to "day" — tiles kept
  showing the day target even after the controller switched to its night cycle,
  while the header badge correctly showed "Night Cycle". Tiles now use the same
  day/night source as the badge (the `daytime_schedule` sensor, falling back to
  the Day Cycle start/stop times), so the target shown always matches the active
  cycle. Card 0.20.4.

## 3.19.113

### Fixed
- **Diagnostic log retention now really keeps N days.** Each restart writes a new
  per-boot log file, but the rotating handler only pruned its *own* file's dated
  backups — so old per-boot files from earlier restarts were never cleaned up and
  the "keep N days" setting wasn't enforced across them (files piled up, and the
  newest file looked empty/"reset"). Startup now sweeps the whole diagnostic-log
  set and deletes anything older than the retention window. The per-boot + midnight
  rotation behaviour is unchanged (new file on restart, and a fresh file at the
  midnight crossover).

## 3.19.112

### Fixed
- **Indicator Light switch stayed stale after toggling.** The LED confirm poll is a
  targeted `getConfigField ["outlet","led"]`, so the device replies with a bare
  `{"led": N}` (no `outlet` wrapper) — which the config-response handler skipped, so
  the switch didn't reflect the change even though the device applied it. The bare
  `led` value now drives the Indicator Light state. (Found during the live QA pass.)

## 3.19.111

### Fixed
- **Multi-field Apply on the Environment/Calibration tabs.** Changing more than one
  target (e.g. temp AND humidity) and applying together only kept the last one —
  each field's write rebuilt the whole config block from the cached copy, so the
  second write reverted the first ("only 1 at a time"). The proxy now folds each
  read-modify-write block back into the session cache before injecting, so
  back-to-back writes build on each other. Covers env targets, air + soil
  calibration, and alarm blocks.
- **Unsaved edits linger across tabs.** Switching tabs with a pending change (a
  Settings colour edit, an env/calibration input, an alerts edit) left the Apply
  bar waiting when you came back. Leaving a tab now discards its un-applied edits.

### Changed
- **Card: Leaf VPD target moved above the VPD kPa readout** on the Environment tab.
  (Card v0.20.3.)

## 3.19.110

### Fixed
- **Dead-zone band marker always visible.** When a reading sat well outside its band
  (e.g. Air Temp far above target) the marker clamped to the edge and got clipped, so
  it vanished on some tiles. The band scale now always includes the current value, and
  the marker is centred on its position — so it's shown on every tile and its distance
  past the band reads at a glance.

### Changed
- **Range shown for any colour source.** The band + subline now follow "Colour by":
  Targets shows the target band, **Alarms shows the alarm min/max range** ("range 16–32°F"),
  Both prefers the target and falls back to the alarm range — so the healthy range is
  legible at a glance in every mode, including metrics that only have alarms (soil, PPFD).
- **New Settings toggle: "Target / range line"** (Overview extras) to hide the
  target/range subline on tiles. On by default. (Card v0.20.2.)

## 3.19.109

### Changed
- **Richer tap-for-graph.** The inline history graph now shows the current value
  (coloured by state), min / avg / max and the target band over the window, y-axis
  range labels, start/now time labels, the amber near-edge margin behind the line, a
  soft area fill, and blue/red dots marking the 6-hour min and max. (Card v0.20.1.)

## 3.19.108

### Added
- **Amber near-edge + trend arrows + dead-zone band + tap-for-graph (Overview).**
  - **Amber near-edge** — target colouring is now 4-state: green in the band, **amber**
    in a margin just outside it (margin = the dead zone), then red/blue beyond. A new
    "Near edge" colour swatch sets the amber.
  - Target colouring, the band, and the graph now also cover **VPD Air** (its implied
    range from the active day/night temp + humidity targets) and **VPD Leaf** (its
    min/max band, which always colours since it has no device alarm).
  - **Trend arrows** — an up/down/flat arrow per tile from recent readings (in-memory,
    no recorder query). Toggle in Settings → Overview extras.
  - **Dead-zone band** — a small band under each tile showing the healthy band + amber
    margin with a marker at the live value. Toggle in Settings.
  - **Tap for graph** — tap any Overview tile to open an inline 6-hour history sparkline
    (from HA history) with the target band shaded behind it.
  (Card v0.20.0.)

## 3.19.107

### Added
- **Target-aware tile colouring — "Colour by: Alarms / Targets / Both".** A new
  Settings control chooses what drives the overview tile highlight:
  - **Alarms** (default, unchanged) — the controller's alarm thresholds (Alerts tab).
  - **Targets** — the environment day/night **target ± dead zone** for Temp / Humidity /
    CO2. Above the band colours like "above max", below like "below min", in-band like
    in-range. Tiles also gain a small "target 72°F · ±2" subline.
  - **Both** — an active alarm wins (stays red/blue); targets colour everything else.

  Reuses the existing Tile / Text / No-color highlight styles and the out-of-range /
  in-range colours, follows the active day/night period, and persists per panel (syncs
  across devices, survives upgrades). Defaults to Alarms so nothing changes until you opt
  in. (Card v0.19.0.)

## 3.19.106

### Fixed
- **Card build warning.** `alarmSources()` passed the optional `config.panel`
  into a helper typed for a required string (TS2345). Guarded it — no behaviour
  change, just a clean build. (Card v0.18.5.)

## 3.19.105

### Changed
- **Whole-number controls read as integers.** Targets, levels, dead zones, speeds
  and other step-1/step-10 numbers now show "16" instead of "16.0". Calibration
  offsets (step 0.1) and sensors keep their decimal.
- **Humidifier Level is an entry box** (1–4) instead of a slider, matching the
  other level controls.

## 3.19.104

### Changed
- **Uniform calibration/target controls.** CO2 Calibration and the three
  environment Dead Zone controls were sliders while every other calibration and
  target was an entry box, so the device page looked mixed. They're all boxes
  now, so the number controls line up consistently.

## 3.19.103

### Fixed
- **Soil calibration showing the wrong controller after a panel slot swap.** When
  two Display Panels swapped dp slots, the slot-reconcile re-homed the soil probe
  sensors but not the editable soil *calibration* (and substrate) entities, so
  those stranded on the other panel — e.g. one panel's Calibration tab listed a
  soil probe under the other panel's name. Reconcile now moves the calibration/substrate
  ids too, and a one-time repair corrects any already-stranded ids in place
  (history preserved). The "VPD Air"/"VPD Leaf" ids are pinned so the rename
  can't disturb them.

### Changed
- **Card layout.** Leaf VPD targets (Environment) and Leaf VPD calibration
  (Calibration) now sit **above** their Apply/Discard bar. Air-calibration
  dropdowns are narrower and share one row, and the soil substrate selector moved
  onto the same row as Temp / Moisture / EC. (Card v0.18.4.)

## 3.19.102

### Added
- **Leaf VPD target band + tile colouring.** New `number.sf_<panel>_leaf_vpd_min`
  and `_leaf_vpd_max` (kPa, defaults 0.8 / 1.2) set the leaf VPD you're aiming
  for. The card shows them under the **Environment** tab, and the VPD Leaf tile
  now colours when the reading drifts outside that band — reusing the Settings
  tab highlight colours, exactly like the air metrics. (Card v0.18.3.)

### Changed
- **Renamed the VPD sensors to "VPD Air" and "VPD Leaf"** so they list next to
  each other. Entity ids are unchanged (`sensor.sf_<panel>_vpd`,
  `sensor.sf_<panel>_leaf_vpd`), so dashboards and automations keep working.
- **Moved Leaf VPD calibration (offset + 5-reading calibrator) to the
  Calibration tab**, where it belongs alongside the other sensor calibrations.

## 3.19.101

### Added
- **Leaf VPD.** A new `sensor.sf_<panel>_leaf_vpd` computes VPD referenced to the
  leaf surface — which runs cooler than the air — as SVP(leaf) − RH·SVP(air),
  and shows as a tile in the Parameters grid. Leaf temperature comes from a new
  local **Leaf Offset** control (`number.sf_<panel>_leaf_offset`, a temperature
  delta that persists across restarts). The card's Settings tab adds a Leaf VPD
  section: set the offset directly, or use the 5-reading calibrator (enter five
  measured leaf-surface temps and it applies the implied leaf − air offset).
  Only created on panels that report both air temperature and humidity.
  (Card v0.18.2.)

## 3.19.100

### Changed
- **Card: smaller Indicator Light toggle in the Outlets tab.** The status-LED
  switch beside the strip name was noticeably taller than its "Indicator light"
  label; it's now sized to sit inline with that text. (Card v0.18.1.)

## 3.19.99

### Fixed
- **Device stuck "offline" in HA after a controller reconnect.** Controllers drop
  and re-open their connection periodically. Because a reconnect reuses the same
  internal session, the *old* connection's teardown could still fire and publish
  "offline" — evicting the live session — even though the controller was already
  back and reporting on its new connection. The device then latched unavailable in
  HA (all entities greyed out) and never recovered until a reload, while its data
  kept flowing underneath. Teardown now only runs for the connection that still
  owns the session, so a reconnect no longer knocks the device offline.

## 3.19.98

### Added
- **Block cloud / local-only toggle (air-gap).** A new Settings switch forces every controller onto the
  proxy's built-in local broker and never opens an upstream connection to the Spider Farmer cloud. It
  applies at the proxy, so it covers both hotspot (Wi-Fi AP) and NAT'd devices in one switch. Control
  and state keep working locally; the phone app loses its cloud path while this is on. Flip it live from
  Settings — active sessions reconnect into local mode without a reload.

## 3.19.97

### Fixed
- **Indicator Light switch missing on AC5/AC10 when "keep offline devices" is unchecked.** The strip's
  Indicator Light is a device-level entity (not tied to a reported data block), so the phantom-cleanup
  pass (`prune_blocks`, which only runs with keep-offline off) deleted it moments after it was created.
  Cleanup now never removes an entity that's valid under the device's current evidence, so the LED
  switch — and its card toggle in the Outlets tab — appears as intended.

## 3.19.96

### Added
- **Local-only fallback — control keeps working with no internet.** The integration is normally a
  transparent relay to the Spider Farmer cloud, so an outage used to drop every controller offline in
  HA. Now, when the cloud is unreachable, the proxy serves each controller **itself** as a minimal MQTT
  broker — answering its CONNECT/SUBSCRIBE/ping and processing the state it self-reports — so Home
  Assistant keeps full visibility and control with no cloud connection. Nothing is lost: the phone app
  can't reach the cloud during an outage either. When the internet returns, the proxy detects it and
  hands the controller back to full relay (restoring app control) automatically. (Your grow gear also
  keeps running its on-device schedules regardless — this is about HA staying in the loop.)

## 3.19.95

### Added
- **Feeds real device names to the Spider Farmer Hotspot add-on.** The integration writes a
  `mac → friendly name` map to `/config` (`sf_hotspot_devices.json`), so the hotspot add-on's
  connected-clients page (v0.7.0+) can show the real device name (e.g. "SF Power Strip AC10") instead
  of the DHCP hostname or "(unknown)". Debounced — only rewritten when the device set changes; harmless if the add-on isn't
  installed.

## 3.19.94

### Fixed
- **Reloading the integration no longer needs a full HA restart to reconnect.** On reload the listen
  socket wasn't fully released, so the re-setup couldn't rebind the port and devices stayed
  disconnected until HA restarted. The listener is now closed and awaited (`wait_closed`) on unload,
  with explicit address reuse on bind, so a reload cleanly re-establishes the connection.

### Added
- **Light 1 is now a per-device toggle too (Configure → Device accessories).** The step lists every
  device with Light 1, Light 2, and Fan checkboxes, always shown, so it's clear what each device
  reports vs what's toggled off. Useful for a fan-only strip where the light channel should be hidden.
  Checked = allow (created when reported); unchecked = hide and tear down.
- **Indicator Light (status LED) control for AC5/AC10.** A `switch.sf_<strip>_indicator_light` entity
  toggles the strip's physical LED (writes the top-level `["outlet","led"]` the SF app uses), and the
  card shows it in the Outlets tab, on the right of each strip's name bar.

### Changed
- **Card: all tabs show by default.** Environment, Calibration, Alerts, Log, and Settings always
  appear (each with a friendly empty state when the device hasn't reported that data yet); only the
  Outlets tab is gated on outlets being present. The Settings tab is no longer tied to Alerts. Card
  bumped to **v0.18.0**.

## 3.19.93

### Fixed
- **Standalone AC5/AC10 outlet control now actually switches the outlet.** A power strip with no host
  panel controls its outlets through the **top-level `["outlet","O{n}"]`** config path (matching the SF
  app); addressing it under `["device",…]` saved the config but never flipped the live outlet, so the
  toggle bounced back. HA now uses the top-level path for standalone strips (commands, polling, mode,
  and schedule writes); CB-hosted strips keep the `["device","ps5"/"ps10",…]` path.

### Notes
- **AC5/AC10 control requires "Smart Mode."** The strips have a Standalone mode (local only, ignores
  app/HA commands) and a Smart Mode (app/HA controlled). Outlet toggles only take effect in Smart Mode.

## 3.19.91

### Fixed
- **Power-strip Environment device was mislabeled "Display Panel".** The Environment sub-device for an
  AC5/AC10 now takes the strip's real name (e.g. "SF Power Strip AC10 Environment") instead of a
  hardcoded "Display Panel" label. Entity IDs are unchanged — display name only.

## 3.19.90

### Added
- **Environment setpoints on AC5/AC10.** The strips carry the same `target` block as the display
  panel (day/night temperature, humidity, and CO2 setpoints + deadband) plus air-sensor calibration —
  confirmed from the device config once those app screens were opened. A strip now gets the same
  Environment target entities the panel has; their state and writes flow through the existing
  type-agnostic normalizer/command paths, and the target block is polled for strips too. (Air-sensor
  calibration entities were already type-agnostic and appear once the strip reports a calibration
  block.)

### Changed
- **Diagnostic log: one toggle instead of two.** The separate "Enable diagnostic log" switch is gone;
  the surviving toggle — renamed **"Create diagnostic log (new file each restart, tagged with version
  + date/time)"** — now both enables logging and writes the versioned per-restart file. Your existing
  on/off state is carried over on upgrade.

## 3.19.89

### Changed
- **Housekeeping: the planning backlog is no longer published.** `BACKLOG.md` has been removed from
  the repository and the release package, and added to `.gitignore` so it stays local. Planned work
  and ideas are now kept privately; shipped changes remain documented here in the changelog. No
  functional change — integration only; card unchanged at v0.17.35.

## 3.19.88

### Added
- **Per-device accessory selection for Light 2 and Fan (supersedes 3.19.87's Hide Light 2).**
  The controllers report a second light (`light2`) and an add-on fan (`fan`) unreliably — a panel
  with neither can still surface a phantom tile (e.g. a panel reports a `fan` block with no fan
  attached). These two are now the only manually-gated accessories; everything else (blower, the
  primary light, humidifier, sensors, outlets) stays fully auto-detected. Manage them under
  **Settings → Devices & services → Spider Farmer Bridge → Configure → "Device accessories"** — one
  entry per device, so a real fan on one panel and a phantom fan on another are independent. Checked
  means "allowed" (created when the device reports it); unchecked hides it and tears down any existing
  entities.
- **First-run prompt for new devices.** When a newly-connected device reports a Light 2 or Fan we
  have no decision for, the integration **defers** creating those entities (so no phantom appears) and
  raises a fixable **Repair** ("Confirm accessories on …") that deep-links to the same picker. Answer
  it and the confirmed accessories are created; ignore it and nothing phantom is added. A bare-outlet
  strip reports neither block, so it never prompts. Plug a light/fan into it later and the prompt fires
  then.

### Changed
- **Upgrades are seamless.** A one-time migration seeds a decision for every device that already has a
  Light 2 / Fan entity (kept, marked confirmed) and folds in the prior card-driven Hide Light 2
  (`card_options[mac]["hide_light2"]=="1"` → Light 2 off). Existing panels aren't disrupted and don't
  prompt; only genuinely new devices defer + prompt. Stored per-MAC in
  `options["components"][mac][block]`.
- Internals: `build_device_entities(…, toggles=…)` gates only the `light2`/`fan` blocks on the
  per-device decision (True = evidence-based create, False = hide, undecided = defer);
  `SfBus.prune_toggled()` / `_raise_component_issue()` and a shared `repairs.py` flow drive the
  teardown and prompt. Card bumped to **v0.17.35** (its Settings note now points at "Device
  accessories").

## 3.19.87

### Changed
- **"Hide Light 2" moved from the card to the integration.** Some panels report a second light
  channel even when only one physical light is attached, creating a phantom `light.sf_<panel>_light_2`
  entity. That toggle used to live in the card's Settings and only hid the tile — the entity still
  existed in Home Assistant. It's now an integration option: **Settings → Devices & services → Spider
  Farmer Bridge → Configure → "Hide Light 2 (panels with a phantom 2nd light)"**. Check any
  light-capable panel to hide its Light 2; the integration removes the entity and all its `light_2_*`
  settings and never recreates them (via `build_device_entities(hide_light2=…)` + `SfBus.prune_light2`),
  so HA no longer registers it at all. Uncheck to bring Light 2 back. The setting is stored per-panel
  in the config entry (`card_options[mac]["hide_light2"]`), so any value you set previously from the
  card carries over. The card's Settings now shows a one-line pointer to the integration option
  instead of the toggle. Card bumped to **v0.17.34** (toggle removed; still respects the stored value).

## 3.19.86

### Changed
- **An outlet mode change now forces the outlet off.** When you switch an outlet's mode, the write
  sets `mOnOff = 0` so it stays idle until the new mode's settings are configured and saved — a stale
  schedule or level can't switch the outlet on the moment you change modes. (Your 3.19.85 log showed
  the setpoint was already preserved on a mode change; this makes "stays off through reconfigure"
  explicit and safe.) Turn it back on manually, or let the mode's schedule/target take over, after
  you've saved. Integration-only; card unchanged at v0.17.33.

## 3.19.85

### Changed
- **Outlet pop fully staged, like the device tiles (supersedes 3.19.84).** The outlet Mode select is
  staged again — changing it no longer writes to the device, so switching to a scheduled mode never
  auto-turns the outlet on; everything commits together on Apply. The pop is reordered to match the
  device tiles (Mode dropdown, then Power, then config), and the controls shown now follow the
  *staged* mode: the Time Slot schedule editor appears optimistically (from a local draft, committed
  on Apply), and the pop no longer shows the previous mode's fields after you switch. Note: the
  per-field dropdowns for other scheduled modes (Cycle timings, device-type selects) are created by
  the integration only once the device is actually in that mode, so those fill in right after Apply.
  (Bundled card v0.17.33.)

## 3.19.84

### Fixed
- **Outlet Mode change now reveals that mode's options immediately.** Since the outlets moved to
  staged Apply (3.19.71), changing an outlet's mode (e.g. Manual → Time Slot) didn't show the new
  mode's controls (the Time Slot schedule editor, cycle fields, …) until you pressed Apply. The
  integration only creates an outlet's per-mode config entities while the device is actually in that
  mode, so a staged mode change couldn't surface them. The outlet Mode select now writes live (with
  an optimistic pick), so the device switches and reports the new config right away; power and the
  config values still stage behind Apply. (Bundled card v0.17.32.)

## 3.19.83

### Added
- **Device active color by mode (Settings tab).** A "Device active color" section colours a device
  tile (light, fan, blower, heater, humidifier, dehumidifier) while it's on, by its mode — with a
  No color / Tile color / Text color choice and three pinwheels grouped as **Manual** (default
  accent), **Scheduled** (Time Slot + Cycle), and **Auto** (Environment, Temperature, Humidity,
  PPFD). A device **fault** (out of water / tank full / heater alarm) always overrides the mode
  colour with red. Shown when the panel has devices; staged behind the Apply bar and persisted
  server-side per controller. (Bundled card v0.17.31.)

## 3.19.82

### Added
- **Outlet active color by mode (Settings tab).** A new "Outlet active color" section colours an
  outlet tile while it's on, by its operating mode — with a No color / Tile color / Text color choice
  and four colour pinwheels grouped as **Manual** (default accent), **Scheduled** (Time Slot + Cycle),
  **Environment** (Temperature + Humidity + CO2), and **Drip Irrigation**. Off outlets stay neutral.
  Shown only when the panel has outlets; staged behind the Apply bar and persisted server-side per
  controller like the other colour settings. (Bundled card v0.17.30.)

## 3.19.81

### Fixed
- **Follow-up to the C/F unit change (3.19.80): green test suite + one decode fix.** The temperature
  dead-zone/offset decode returned a float (`1.0`) where the historical code returned an int (`1`)
  for whole-number deltas — restored the int so the imperial output is byte-for-byte unchanged
  (`tempunits.cdelta_to_disp`). Test suite updates: an autouse fixture resets the unit module global
  to °F before each test (kills cross-test leakage from the mutable global), the three
  temperature-touching integration setups are pinned to the imperial unit system so they keep
  validating the °F path, and a new `tests/test_tempunits.py` guards both paths (imperial =
  legacy formulas, metric = identity, incl. a metric `normalize_target`). `pytest tests/` →
  143 passed. (Integration-only; card unchanged at v0.17.29.)

## 3.19.80

### Added
- **Temperatures now follow your Home Assistant unit system (°C or °F).** Every temperature the
  integration decodes and writes — air/soil sensors (already), env Day/Night targets, Temp Dead
  Zone, Go-dark / Turn-off thresholds, air + soil calibration offsets, and the air/soil alarm
  thresholds — is emitted in your HA instance's configured temperature unit and converted back to
  the controller's native °C on write. A metric install now sees °C throughout; an imperial install
  is unchanged. Set once at setup from `hass.config.units.temperature_unit` (new `tempunits.py`);
  the card's temperature ranges/labels follow `hass.config.unit_system`. If you change your HA unit
  system, reload the integration to re-tag the entities.

  Implementation note: the imperial path is byte-for-byte identical to before (the conversion helpers
  reduce to the old formulas), and the metric path is a pure identity, so existing °F users see no
  change. Verified with °C↔°F round-trip tests.

## 3.19.79

### Changed
- **Log tab de-duplicates identical same-second entries.** When one physical device reports an alarm
  as two modules (e.g. the 4-in-1 Sensor = devType 17 + 18), the Log tab now shows a single row for
  that event — matching the SF app — instead of two identical lines. Rows are collapsed only when the
  panel, device name, alarm text, and second all match; a same-second "Soil Sensor" offline stays its
  own row. (Bundled card v0.17.28.)

## 3.19.78

### Fixed
- **Alarm log now names the "4-in-1 Sensor" instead of "Device 17 / Device 18".** Alarm devType 17
  and 18 are the two internal modules of the 4-in-1 air sensor; both report offline together, which
  the SF app logs as a single "4-in-1 Sensor" offline. Confirmed by matching the app's notifications
  to the card's Log tab at 2026-07-28 18:52:50 (alongside devType 19 = Soil Sensor). They now decode
  to "4-in-1 Sensor" in the Log tab. (Integration-only; card unchanged at v0.17.27.)

  Note: because both modules fire, the Log tab shows two "4-in-1 Sensor … offline" rows for one
  event where the app shows one — say the word and I can de-duplicate same-second, same-name entries.

## 3.19.77

### Changed
- **The standalone SE-light card now stages behind one Apply/Discard too.** Its power, brightness
  dial, mode, and schedule (both the multi-period editor and the legacy fields) previously wrote
  instantly; they now collect and commit together on Apply, matching the tent card's device tiles.
  The dial reflects your pending brightness/on-off before you apply, dragging brightness to 0 turns
  it off on Apply, and the schedule editor's separate Apply/Discard is gone (folded into the card
  bar; "+ Add period" stays). (Bundled card v0.17.27.)

## 3.19.76

### Fixed
- **Manual mode now shows each device's full control set, not just the primary control.** Manual was
  missing the always-applicable options that the scheduled modes expose: the Fan's **Oscillation**
  and **Natural Wind**, and the Light's **Go dark** and **Turn off** over-temperature thresholds are
  now available in Manual too (they apply regardless of mode; only schedule/cycle timing is
  mode-specific). Heater, humidifier, dehumidifier, and blower already carried their full non-timing
  controls (gear / wind / speed / Close CO2). (Bundled card v0.17.26.)

## 3.19.75

### Changed
- **Device tiles now stage every control behind one Apply/Discard, like the other tabs.** Opening a
  device (light, fan, blower, heater, humidifier, dehumidifier) and changing power, brightness /
  speed / gear, mode, oscillation, or any setting no longer writes instantly — the edits collect and
  commit together when you press Apply (Discard reverts). Previously power, the main slider, and
  Manual-mode controls acted immediately while only scheduled edits staged. Staged rows show the
  accent bar; the Apply bar is disabled until you change something. Under the hood the commit is one
  atomic `apply_bundle` for the module settings plus the right service call for power / brightness /
  speed, and an explicit power-off always wins over a brightness/speed turn-on. (Bundled card
  v0.17.25.)

## 3.19.74

### Added
- **"Hide Light 2" toggle in the Settings tab.** Some controllers report a phantom second light
  (e.g. an inline adapter on the port with no actual light attached), so a Light 2 tile shows with
  nothing behind it. The toggle — shown only when a `light_2` entity exists — hides that tile. It
  stages behind the Apply bar and persists server-side per controller like the colour settings.
  (Bundled card v0.17.24.)

  Note: this is the manual fix. The controller reports the `light2` block identically whether a real
  light or just an adapter is attached, so it can't be auto-detected from the light data alone; a
  data-driven auto-hide (via the controller's `getGGSDev` accessory list) is on the backlog pending
  more diagnostic captures.

## 3.19.73

### Added
- **Custom highlight colours and in-range colouring in the Settings tab.** The out-of-range section
  now has two colour pickers — **Above max** and **Below min** — so you can set your own colours in
  place of the default red / blue (they apply everywhere out-of-range colouring shows: Overview tiles
  and the soil per-probe breakdowns). A new **In-range highlight** section mirrors the same three
  modes (No color / Tile color / Text color) with its own colour picker, so readings *within* their
  limits can be highlighted too — it colours every reading and is off by default. All five settings
  stage behind the Apply bar and persist server-side per controller, like the existing colour mode.
  Offline / fault tiles stay their fixed red. (Bundled card v0.17.23.)

## 3.19.72

### Changed
- **Every Save/Discard prompt is now one standardized Apply/Discard bar.** All commit prompts across
  the card — device tiles, Environment, Calibration, Outlets, Settings, Alerts, and the SE-light
  schedule — share the same wording ("Apply" / "Discard"), the same button order and styling, and the
  same disabled-until-changed behaviour. Previously some read "Save" with the buttons in the opposite
  order; the older Alerts and schedule bars have been brought in line. (Bundled card v0.17.22.)

## 3.19.71

### Changed
- **Environment, Calibration, Outlets, and Settings now stage edits behind an Apply button.**
  Previously these tabs wrote to the device the instant you changed a dropdown or toggle. Each tab
  now collects your edits locally and commits them together when you press **Apply** at the bottom
  (with a **Discard** to revert), matching the Alerts tab. A staged control shows a small accent
  bar until applied.
  - Environment: Day Cycle start/stop and every Day / Night / Dead Zone value.
  - Calibration: all air and soil offsets plus the substrate pick.
  - Outlets: the outlet's power On/Off, mode, mode settings, and Time Slot schedule all apply
    together from the one Apply bar in the expanded outlet (the schedule's separate Save is gone;
    "+ Add slot" stays). The tile reflects your staged power/mode before you apply.
  - Settings: the out-of-range colour choice is applied on Apply instead of instantly.
  (Bundled card v0.17.21.)

## 3.19.70

### Added
- **Day / Night cycle pill on the Overview "Parameters" header.** The right of the header now
  shows a sun · "Day Cycle" or moon · "Night Cycle" badge, driven by the controller's own daytime
  schedule (the Environment tab's Day Cycle Start/Stop, or the device's schedule sensor where it
  exposes one; handles a window that wraps past midnight). Hidden on controllers with no cycle info.
- **Light-leak alert.** When it's the night cycle and light is present, a red "Light detected"
  alert appears centred between the Parameters label and the cycle pill. Controllers with a PPFD
  sensor trip it when PPFD rises above the dark floor (> 1 µmol) and show the reading
  ("Light detected · 118 µmol"); controllers without PPFD fall back to the hardware daytime light
  sensor. It stays hidden during the day and on genuinely dark nights. (Bundled card v0.17.20.)

## 3.19.69

### Changed
- **Out-of-range colouring now extends to individual soil-probe values in the breakdowns.** In the
  per-metric "by probe" popup and the All Soil Stats table, each probe's value is coloured red when
  it's above its soil alarm's max or blue when below its min — so you can see at a glance which
  probe is out of range, not just that the tile average is. Respects the Settings-tab colour choice
  (No color disables it) and only colours a value when that soil alarm (Soil Temp / WC / Soil EC) is
  enabled. Offline probes still show fully red, and the existing tile alerts are unchanged.
  (Bundled card v0.17.19.)

## 3.19.68

### Changed
- **Climate fault tiles read "EMPTY" / "FULL" instead of "TANK EMPTY" / "TANK FULL".** The
  longer text was clipping to "TANK E…" on narrow mobile tiles; the shorter word fits at the
  normal tile size (the "Humidifier" / "Dehumidifier" label already gives the context). Heater
  still reads "Alarm". (Bundled card v0.17.18.)

## 3.19.67

### Changed
- **The card's out-of-range colour choice now saves server-side.** Picking No color / Tile /
  Text in the Settings tab was remembered only in the browser's local storage, which the Home
  Assistant mobile app and other devices could reset. The choice is now persisted to the
  controller's config entry (new `sf.set_card_option` service) and read back from the Alarm
  Settings sensor's `card_options` attribute, so it survives upgrades, the mobile app, and syncs
  across devices. Local storage stays as an instant cache for first paint, and the optional
  `alarm_colors:` YAML default still works as a fallback. (Bundled card v0.17.17.)

## 3.19.66

### Changed
- **Outlet controls now expand under their own strip.** Tapping an outlet tile opens its
  control panel directly beneath that strip's grid, instead of at the bottom of the Outlets tab
  — clearer with more than one power strip. (Bundled card v0.17.16.)

## 3.19.65

### Fixed
- **Outlet tiles now work with a second same-type power strip.** A second AC5 / AC10 gets a
  slot with an underscore (`ac5_2`, `ac10_2`), which the new tile Outlets tab's key parser (from
  3.19.64) mis-read, so those outlets wouldn't expand. It now splits on the last underscore, so
  `ac5_2` outlet 3 resolves correctly. (The integration already assigned multi-strip slots fine;
  this was card-only.) (Bundled card v0.17.15.)

## 3.19.64

### Changed
- **Outlets tab is now tile-based.** Each outlet is a compact tile (plug icon, On/Off, and its
  mode) grouped by power strip, instead of a stack of full-width blocks. Tapping a tile expands
  its controls below the grid — power toggle, Mode selector, and any mode-specific config
  (Cycle timings, Temperature/Humidity/CO2 device type, Drip Irrigation, or the full Time-Slot
  schedule editor) — mirroring the Overview device tiles. Verified against ac10 + ac5 (the
  on/off toggle now lives in the expanded panel). (Bundled card v0.17.14.)

## 3.19.63

### Changed
- **"All Soil Stats" is now a tile.** The full-width "All Soil Sensors Stats" bar became a
  proper Overview tile in the Parameters grid that expands the same per-probe table (Temp / WC /
  EC) below the grid. The tile shows the probe count, and **turns red reading "N offline" when
  one or more probes are offline** — matching the red rows in the expanded table. Verified live
  (4 probes, 2 offline → red "2 offline"). (Bundled card v0.17.13.)

## 3.19.62

### Fixed
- **Humidifier "TANK EMPTY" fault tile never lit up.** The fault check looked for a
  `humidifier_water` entity, but the sensor's entity_id is `humidifier_tank` (derived from its
  "Tank" name), so an empty humidifier never turned the tile red. Corrected to the right entity —
  verified live with an empty tank. (Dehumidifier/heater ids were already correct.) (Bundled
  card v0.17.12.)

## 3.19.61

### Changed
- **Climate fault tiles reworded.** The humidifier's out-of-water fault now reads **"TANK
  EMPTY"** and the dehumidifier's full-tank fault reads **"TANK FULL"** (shown in red only when
  the fault is active). Same behaviour as 3.19.60, clearer wording. (Bundled card v0.17.11.)

## 3.19.60

### Added
- **Fault highlighting on the climate device tiles.** The Humidifier, Dehumidifier and Heater
  Overview tiles now turn red when the controller reports that device's live fault: the
  humidifier is **"Out of water"**, the dehumidifier tank is **"Tank full"**, or the heater
  reports an **"Alarm"**. These use the same always-on red treatment as the soil-offline flag
  (a hardware fault, independent of the Settings-tab colour choice). Verified against live
  entities (`humidifier_water` / `dehumidifier_tank` / `heater_status`). (Bundled card v0.17.10.)

### Notes
- The **heater "Alarm"** is decoded from the controller's per-device alarm flag; its exact
  meaning (likely an over-temperature/overheat cutout) isn't yet confirmed against the app, so
  the tile shows a generic "Alarm". If a capture pins it down, the label can be made specific.

## 3.19.59

### Fixed
- **Overview tiles clipping off the right edge on mobile.** A long tile value (notably the
  offline "Unavailable" text) widened its grid column enough to push the third column past the
  card and off-screen on narrow phones. The parameter grid now uses `minmax(0, 1fr)` columns
  with `min-width: 0` tiles so a wide value clips inside its own tile instead of overflowing the
  card, and an offline soil-average tile now reads the shorter **"Offline"** (no unit) rather
  than "Unavailable". Verified on a live card: at a 380px width the grid no longer overflows.
  (Bundled card v0.17.9.)

## 3.19.58

### Added
- **Offline soil probes are flagged red on the card.** Building on the per-probe offline
  detection (3.19.57): a **Soil Avg** Overview tile that's unavailable (a probe on that
  controller is offline) now shows red, and both soil breakdowns — the per-metric "by probe"
  popup and the "All Soil Sensors Stats" table — give the offline probe's row a red backing and
  red text (reading "Offline" in the popup) instead of a plain white row. This is a fault
  indicator, shown regardless of the Settings-tab colour choice. (Bundled card v0.17.8.)

## 3.19.57

### Fixed
- **An unplugged soil probe now shows offline instead of a frozen reading.** The controller
  simply drops an offline probe from its data, so its Temperature / Moisture / EC entities used
  to freeze on their last value (e.g. a plausible-looking 71 °F) with no sign the probe was
  gone. Each probe is now timestamped as it reports; if one goes silent for ~90 seconds its
  three entities flip to **unavailable** (per-probe — the controller and the other probes stay
  online), and clear again the moment it reports. A probe that's already unplugged when Home
  Assistant starts likewise reads unavailable once the 120-second startup grace closes. The
  per-controller **Soil Avg** sensors are
  unchanged: they still go unavailable when the controller has no live probes, which remains
  the at-a-glance "a probe is offline, go look" cue.

## 3.19.56

### Added
- **Settings tab: out-of-range tile highlighting.** A new Settings tab on the tent card lets
  you pick how an Overview reading is flagged when it crosses its alarm limits — **No color**,
  **Tile color** (the whole tile tints), or **Text color** (just the value). Red = above max,
  blue = below min. It only colours metrics whose alarm is switched on in the Alerts tab, and
  compares each reading against that metric's own min/max (Air Temp, Humidity, VPD, CO2, PPFD,
  Soil Temp, WC, Soil EC). The choice is remembered per panel on the device (localStorage) and
  can also be preset in YAML with `alarm_colors: tile | text | off`. The Settings tab appears
  once a controller's alarm thresholds exist. (Bundled card v0.17.7.)

## 3.19.55

### Fixed
- **PPFD alarm Min now stops at 3900 (100 below the 4000 Max), matching the app.** The Min
  dropdown had offered values all the way to 4000; the app's PPFD Min tops out 100 µmol/m²/s
  under the Max ceiling. Min now ranges 0–3900 while Max stays 0–4000. (Bundled card v0.17.6.)

## 3.19.54

### Fixed
- **PPFD alarm max now reaches 4000.** The Alerts-tab PPFD dropdowns were capped at 3000, but
  the controller's PPFD alarm range goes to 4000 µmol/m²/s (its default max is 4000) — so the
  default couldn't be shown and high maxes couldn't be set. Raised the bound to 4000 to match
  the app. (Bundled card v0.17.5.)

## 3.19.53

### Added
- **Min PPFD in the Alerts tab.** The PPFD alarm was max-only; it now offers a **Min** as well,
  matching the other range metrics. It writes a `vmin` into the same alarm block the controller
  already parses (the value round-trips); a controller that doesn't act on a low-PPFD alarm just
  won't fire it.

### Changed
- **Three more alarms decoded from a confirmed app capture (2026-07-27).** **Soil Sensor**
  offline (devType 19 — this was the "Device 19" still showing in the Log Type filter),
  **Light 1** over-temperature ("The light temperature is too high", devType 20 / alarmType 6),
  and its "Restoring normal" now read like the app instead of raw "Device N / Alarm N". That
  covers the over-temperature and soil-sensor-offline alarms. (devType 17 — a still-unnamed
  device that also fires the offline condition — remains "Device 17 Current device is offline"
  until its own app entry is captured.)

## 3.19.52

### Changed
- **Sensor-offline alarm now labelled.** An app capture confirmed a devType 16 / alarmType 3
  entry as **"Temperature & Humidity Sensor — Current device is offline"**, so it and its
  "Restoring normal" now read like the app instead of "Device 16 / Alarm 3". alarmType 3 is
  decoded as the offline condition generally, so devType 17 (a second device that fires it)
  reads "Device 17 Current device is offline" until its own device name is captured.

### Notes
- **Over-temperature is still the one remaining unmapped alarm** — it hasn't appeared in any
  capture. A diagnostic log while it's active (with the app's Notification screen) will finish
  the set.

## 3.19.51

### Changed
- **Alarm labels fully confirmed against the app, and two more decoded.** A frame-by-frame
  match of the SF app's Notification screen against the wire log confirmed every metric label
  from 3.19.50 to the second — including Soil Temp (devType 6) and Soil EC (devType 8), which
  were previously inferred and are now confirmed. Two alarms that had been surfacing as raw
  "Device 26 / Device 27" are now decoded: **Humidification — "Humidifier is out of water"**
  (devType 27 / alarmType 4) and **Dehumidification — "Dehumidifier water tank is full"**
  (devType 26 / alarmType 5), matching the app's wording exactly.

### Notes
- **Over-temperature and sensor/device-offline alarms are still not labelled.** The only
  candidates in captured history are a devType 16 / 17 pair (both alarmType 3) from
  2025-11-23, which surface as "Device 16/17". They aren't yet correlated to an app entry, so
  which is over-temp and which is offline is unconfirmed — a diagnostic log captured while one
  of those alarms is active (with the app's Notification screen for cross-reference) will pin
  them down.

## 3.19.50

### Fixed
- **Log tab only showed alarms since HA booted — the rest of the device's history
  was never fetched.** The controller pages its alarm history with a *cursor*
  (`{"limit":N,"id":X}`, returning entries with id greater than X — exactly how the
  SF app's Notification screen loads it). The integration was instead sending a
  single `{"offset":0,"count":50}`, which the firmware only answers with the
  *oldest ~10* entries; everything between that oldest slice and whatever arrived
  live since boot was invisible. The poll now walks the cursor forward from a
  per-device high-water id, one page at a time, until it catches up — so the full
  buffered history (hundreds of entries) backfills into the Alarms sensor and the
  Log tab. Later polls fetch only genuinely new entries. Verified against a live
  capture: all 344 buffered entries for a panel now ingest in a handful of pages.

### Changed
- **Alarm labels corrected from a confirmed app correlation.** Matching the app's
  Notification screen to the wire log by exact timestamp: **VPD** (devType 3) is now
  confirmed (was inferred), and **devType 7 is "WC"** (water content) — it was
  mislabelled "Soil Temp". The soil group is now read as devType 6/7/8 =
  Soil Temp / WC / Soil EC (6 and 8 remain inferred, anchored by the confirmed
  dev7=WC). Unmapped codes still surface as "Device N".

## 3.19.49

### Fixed
- **Dashboard cards intermittently showing "Configuration error" after a page refresh.**
  On a cache-cold reload Home Assistant could build the tent/light cards a moment before the
  (large) card bundle finished registering its custom elements; HA then rendered a
  "Configuration error" box and did not always rebuild it once the element appeared, so the
  card stayed broken until another manual refresh. The card now self-heals: after it loads it
  re-asserts its element registrations (which triggers HA's own rebuild) and nudges any
  stranded error card of its own to rebuild, across a few short passes right after load. Live
  testing confirmed that once the elements are (re)defined HA immediately swaps the error box
  for the real card. (Bundled card v0.17.4.)

## 3.19.48

### Fixed
- **Environment tab: the "Dead Zone" dropdown no longer stretches across the whole row.**
  It previously took all the space left after Night/Day, making it far wider than the values
  it holds. It's now a compact box aligned to the right edge of each row (Temperature,
  Humidity, CO2), with Night/Day still sized to their contents on the left. (Bundled card
  v0.17.3.)

## 3.19.47

### Changed
- **The Log tab now shows only the selected day.** It previously listed the picked date *and
  everything earlier*, so months-old entries appeared under today's date. Pick a date to see
  that day's alarms; the picker still defaults to the current day and rolls over at midnight.
  (Bundled card v0.17.2.)

## 3.19.46

### Fixed
- **Log tab clipped the tab bar and ran off the bottom of the card.** With six tabs the row
  scrolled horizontally, which left "Log" half cut off (and hid that it existed); the tab bar
  now wraps to a second row on narrow cards. The log list itself is capped at roughly ten
  rows and scrolls for the rest, with an entry count above it. (Bundled card v0.17.1.)

## 3.19.45

### Fixed
- **"Custom element doesn't exist: spider-farmer-card" (recurring).** Three separate causes,
  all fixed:
  - A **failed static-route registration was cached as success** — the integration marked the
    card route "served" even when registering it raised, so the Lovelace resource pointed at
    a URL that 404s for the rest of the HA run. Failures are no longer cached, and the
    integration now logs a clear error instead of registering a resource it can't serve.
  - **Card registration happened after the proxy bound its port.** If the bind failed (the
    classic "listen port 8883 is Mosquitto's" case) setup returned early, leaving a card
    resource from an earlier run pointing at a route that never got served. The card is now
    registered *before* the port work, so a bind failure no longer breaks the dashboard.
  - **Load order.** `lovelace` was missing from the integration's `after_dependencies`, so on
    a cold boot the resource registration could be skipped silently. It's declared now, and
    the registration is re-asserted once Home Assistant has fully started.

### Added
- **README: "Troubleshooting the dashboard card"** — an ordered checklist (hard refresh,
  integration load failure, wrong `custom_components` folder name, duplicate resources, YAML
  mode). Symlinking or copying the cards into `config/www/` is *not* needed; if that's the
  only thing that helps, one of the listed causes is the real one.

## 3.19.44

### Added
- **Log tab on the tent card** — the app's Notification screen, in HA. Shows the decoded
  alarm history (red bar = raised, green = restored) with a **Device** filter (panel + nested
  strips, shown when more than one has a log), a **Type** filter built from the metrics
  actually present (Air Temp, Humidity, CO2, …), and a **date picker that always defaults to
  the current day** — entries from the picked day and earlier are listed, newest first. The
  tab appears once a controller's Alarms sensor exists; `default_tab: log` is supported in
  the card config and editor. (Bundled card v0.17.0.)
- **`default_tab: alerts`** now works too (previously the editor offered tabs the option
  didn't accept).

### Changed
- **CO2 alarm label upgraded from inferred to confirmed** — an app-visible "CO₂ Below
  threshold" notification matched the wire entry exactly.

## 3.19.43

### Added
- **Alarm events now carry human-readable labels.** Decoded from live correlation of a
  triggered temp-above alarm and app-visible notification history: `Air Temp`/`Humidity`
  (confirmed) plus `VPD`/`CO2`/`Soil Temp`/`Soil WC` (inferred) for the source, and
  `Above threshold` / `Below threshold` / `Restoring normal` for the event — so the Alarms
  sensor and `sf_alarm` automation events read like the app's Notification screen instead of
  raw codes. Unknown codes still surface as `Device N` / `Alarm N`.

### Notes
- The alarm-log poll added in 3.19.41 is confirmed working: controllers answer the
  `{"offset": 0, "count": 50}` read with their full recent history (an empty `data` reply
  just means that device has no log).

## 3.19.42

### Added
- **System/health diagnostic sensors.** Controllers that report the `sys` block get
  **Firmware Version**, **Uptime**, **WiFi Signal** (dBm), **WiFi Connected**, and
  **Ethernet Connected** — created evidence-based, grouped under Diagnostic.
- **Operations log.** The controller pushes its latest operation (outlet switched by a mode,
  schedule fired, …) in every status frame; it's now an **Operations** sensor (state = latest
  operation time, last 50 decoded entries in the `events` attribute) plus an `sf_oplog` HA
  event per new entry for automations — same pattern as the Alarms sensor. Codes (`opType`,
  `devType`, `modeType`) are raw until label captures land.

### Fixed
- **Novel-field detector table refreshed.** Climate schedule read-backs
  (`heater/humidifier/dehumidifier timePeriod`/`cycleTime`) and the light threshold/PPFD
  read-backs (`darkTemp`, `offTemp`, `ppfdPeriod`) have been decoded since earlier releases —
  the diagnostic log wrongly flagged them as NOVEL. The known-fields table now matches
  reality, so the NOVEL feed is back to being a true to-do list.

## 3.19.41

### Added
- **Day/night binary sensors.** Controllers report two day/night flags in every status frame
  and they're now entities: **Daytime (Light Sensor)** (`isDaySensor` — day as detected by the
  light sensor) and **Daytime (Schedule)** (`isDayEnvTarget` — whether the environment
  day-cycle window is currently active). Created evidence-based like every other sensor, so
  they appear only on controllers that actually report them.
- **Alarm/notification history now backfills without the app.** The controller only reports
  its alarm log when asked, which used to mean HA's Alarms sensor filled in only while the SF
  app's Notification screen was open (plus the passive latest-alarm on every status frame).
  The integration now requests the alarm log at connect and on the periodic poll, so the
  Alarms sensor (last 50 events, newest first) and `sf_alarm` HA events work standalone.

### Notes
- Alarm device/type labels are still raw codes (`Device 8`, `Alarm 2`) — the wire values
  aren't documented. If you match a code to what the app's Notification screen shows for the
  same event, captures are welcome to fill in the label tables.

## 3.19.40

### Fixed
- **Environment / Calibration / Alerts dropdowns showed minimums (32°F / 0% / 300ppm) instead
  of the controller's saved settings.** The data was arriving fine — the card set each
  `<select>`'s value before its options existed (a Lit render-order quirk), so every dropdown
  fell back to its first option and never recovered, because the unchanged value was
  dirty-checked and never re-applied. Options now carry an explicit `selected` flag, so all
  dropdowns (Environment targets/dead zones, Calibration offsets, Alerts min/max, device mode
  and speed selects) render the real current value. (Bundled card v0.16.17.)

### Changed
- **The per-device "Apply" write-channel entities are gone.** Hiding them (3.19.35/3.19.36)
  removed them from dashboards, but HA always lists hidden entities on the device page, which
  is where they kept showing up. The card's Save buttons now call a proper `sf.apply_bundle`
  service instead, the apply text entities are no longer created, and leftover registry
  entries from older versions are removed automatically at startup. If you called
  `text.set_value` on an `*_apply` entity from an automation, switch it to `sf.apply_bundle`
  (see Developer Tools → Services).

## 3.19.39

### Fixed
- **README "dashboard card" badge showed "resource not found."** It pointed at a
  `spider-farmer-card/package.json` that isn't committed to this repo. The card version now
  ships as `custom_components/sf/cards/card-version.json` (bundled with the card), and the
  badge reads from there.

## 3.19.38

### Fixed
- **Devices mis-assigned an `ac10` slot on a fresh install/reload.** A config/senConfig frame
  that arrived before type detection finished assigned the device's logical slot from an
  unknown-type guess (which defaulted to a power strip → `ac10…`), so Display Panels landed
  on `ac10` instead of `dp1`. Slot assignment from those config paths now waits until the
  device type is actually detected. (Both power strips and CBs can carry soil probes, so
  there's no safe pre-detection guess — hence the wait.)
  *(To fix an install that already got wrong slots: edit them in the Device slot mappings
  dialog, or fully remove and re-add the integration on this version.)*
- **Dehumidifier/heater/humidifier switch could read "unknown"** (and render as flash
  buttons, and fail CI). Their on/off now always resolves to a definite ON/OFF: mOnOff/on
  when reported, else the live running level, else off.

## 3.19.36

### Fixed
- **Blower Close CO2 (and Fan Natural Wind) rendered as two flash buttons instead of a
  toggle.** Their switch state stayed "unknown" until the device happened to report the
  field, and HA draws an unknown toggle as on/off flash buttons. They now always publish a
  definite ON/OFF (default OFF), so they show as a normal toggle.
- **"Apply" entities are now auto-hidden on existing installs too.** A setup-time sweep hides
  any leftover visible `*_apply` write-channel entities, so you don't have to hide them one
  by one.

### Note
- Environment targets are confirmed to decode correctly (temp/humidity/CO2 day-night targets
  all produce the right values). If the Env tab still looks empty, it's the card not having
  loaded yet — see the 3.19.35 card-loading fix and check for a duplicate card resource.

## 3.19.35

### Fixed
- **Card sometimes needed several refreshes to load ("config error").** Older `?v=` copies of
  the card could pile up in the frontend's module list on repeated updates, so the browser
  tried to load multiple versions. The integration now purges stale card URLs and loads only
  the current version.
- **Environment targets now also decode from the full config file**, not just the targeted
  `["target"]` read — so the Env tab fills reliably from whichever config response arrives.

### Changed
- **Hidden the per-device "Apply" entities.** The card's Save write-channels (`Fan Apply`,
  `Heater Apply`, …) are now hidden from the dashboard by default — they're internal and
  never touched directly (still functional). Existing installs: hide the current ones from
  the device page, or they clear on a remove/re-add.

## 3.19.34

### Changed
- **Calibration and Alerts tabs now use dropdowns.** Air/soil calibration offsets and the
  alarm Min/Max thresholds are dropdowns (built from each field's range and step) instead of
  boxes and sliders. (Bundled card v0.16.16.)

### Fixed
- **Config settings (Environment / Calibration / Alerts) sometimes showed defaults until a
  save.** Some controllers don't answer the first config read on connect, so those tabs sat
  on placeholder values until the ~10-minute poll. The initial poll now retries the config
  read with backoff until the target/calibration/alarm thresholds actually arrive, so the
  CB's current saved settings appear promptly.

## 3.19.33

### Changed
- **Execution Times is a whole-number dropdown on every Cycle tile.** Fan, blower, heater,
  humidifier and dehumidifier now pick Execution Times from a 1–100 dropdown (integers only,
  no decimals) instead of a number box. (Bundled card v0.16.15.)

## 3.19.32

### Changed
- **Environment tab now uses dropdowns.** The temperature/humidity/CO2 Day, Night and Dead
  Zone targets are dropdowns instead of number boxes and sliders — options come from each
  field's own range (Temp 32–122 °F, Humidity 0–100 %, CO2 300–2500 ppm step 10, plus the
  dead-zone ranges). Still live (applied on change). (Bundled card v0.16.14.)

## 3.19.31

### Fixed
- **Gear / Wind Speed missing from the heater, humidifier and dehumidifier tiles.** The card
  referenced the wrong entity id (`..._level_set`); the actual settable entity id derives
  from the friendly name — `number.sf_<p>_heater_level`, `number.sf_<p>_humidifier_level`,
  `select.sf_<p>_dehumidifier_level`. The Gear (L1–L10 / L1–L4) and Wind Speed (Low/High)
  dropdowns now appear in every mode. (Bundled card v0.16.13.)

## 3.19.30

### Fixed
- **Humidifier (and dehumidifier) couldn't be turned off.** Their switch state was derived
  from an `on` field the device never sends — the humidifier/dehumidifier blocks report
  `mOnOff` (setpoint) and a live `level`, not `on`. The switch therefore read OFF even while
  running, so every tap sent ON and it never turned off. On/off state now comes from
  `mOnOff` (config frames) or the live running level (heater/humidifier, where level 0 is
  unambiguously off), so the toggle reflects reality and turns the device off.

### Added
- **Mode-aware Humidifier tile.** Manual (Switch + Gear **L1–L4**), Time Slot, Cycle
  (Start / Run Time / Closing Time / Execution Times / Gear), and Humidity — matching the
  heater/dehumidifier tiles, staged behind Save. New entities: `humidifier_mode_set`,
  `humidifier_schedule_start/stop`, `humidifier_cycle_start/run/off/times`.
  (Bundled card v0.16.12.) *As with the others, the Humidity mode value is a documented
  best-guess pending a confirmed capture; Manual/Time Slot/Cycle are confirmed.*

## 3.19.29

### Docs
- **README status badges.** Added header badges that read live from the repo — integration
  version (`manifest.json`), dashboard-card version (`package.json`), Hotspot add-on version
  (`config.yaml`), and total GitHub downloads.

## 3.19.28

### Fixed
- **Phantom environment sensors on sensor-less AC5/AC10 (run direct, no CB/DP).**
  Those controllers emit a full air-sensor block of all zeros
  (`temp:0, humi:0, co2:0, vpd:0, ppfd:0`) even with no probe attached, which was
  read as evidence and created empty Temperature/Humidity/CO2/VPD/PPFD entities
  (all showing 0 / 32 °F). Air-sensor entities are now created only when a real
  ambient reading is present (non-zero temperature or humidity), so a real CB with
  a probe is unaffected while a bare strip gets none.

  *Already have the phantom entities?* After updating, HA marks them "no longer
  provided by the integration" — delete them from the device page (or remove and
  re-add the device) to clear them.

## 3.19.27

### Added
- **Mode-aware Heater and Dehumidifier tiles.** Both now have expanded, per-mode tiles:
  - *Heater* — Manual (Switch + Gear L1–L10), Time Slot, Cycle (Start / Run Time / Closing
    Time HH:MM:SS / Execution Times / Gear), and Temperature.
  - *Dehumidifier* — Manual (Switch + Wind Speed Low/High), Time Slot, Cycle, and Humidity.

  Schedule/cycle changes commit atomically behind **Save**, same as the fan/blower/light
  tiles. Backed by a new climate schedule/cycle write path and decode, plus new entities
  (`heater_mode_set`, `heater_schedule_start/stop`, `heater_cycle_start/run/off/times`, and
  the dehumidifier equivalents). (Bundled card v0.16.11.)

  *Note:* Manual / Time Slot / Cycle use the confirmed universal mode values. The
  **Temperature** (heater) and **Humidity** (dehumidifier) modes use a best-guess mode value
  (temp-only / humidity-only) — still pending a confirmed packet capture of those two modes
  being saved in the app; everything else is confirmed. Humidifier tile is still to come
  (not yet recorded).

## 3.19.26

### Added
- **Mode-aware Blower tile.** The blower now has the same expanded tile as the fan:
  Manual (speed dial), Time Slot, Cycle, and Environment. Running Speed is a 25–100 %
  dropdown, Standby Speed tracks it (Off, then 25…running−1), Cycle uses HH:MM / HH:MM:SS
  pickers, Environment has a Run Mode selector, and every mode has the **Close CO2 Device**
  toggle. Staged behind Save like the other tiles. New blower entities:
  `blower_mode_set`, `blower_run_mode`, `blower_schedule_start/stop`,
  `blower_running_speed`, `blower_standby_speed`, `blower_cycle_start/run/off/times`,
  `blower_close_co2`. (Bundled card v0.16.10.)

  *Heater and Dehumidifier tiles are next — their schedule/cycle write format still needs a
  confirmed packet capture before their editable scheduling can be trusted.*

## 3.19.25

### Changed
- **Light & fan settings are now dropdowns with the app's ranges.**
  - *Light tile:* Target Brightness (11–100 %), Go dark and Turn off (**Off**, 59–122 °F),
    Simulate Sunrise/Sunset (**Off**, 1–60 min), Target PPFD (20–2000 µmol). PPFD mode now
    also exposes **Dimming Range Min/Max** (11–100 %).
  - *Fan tile:* Gear (L1–L10), Oscillation (**Off**, 1–10), and Standby Speed — whose
    options track the gear (gear 1 → Off only; gear 3 → Off/1/2; … gear 10 → Off/1–9),
    exactly like the SF app.

  "Off" on Go dark / Turn off now correctly disables the threshold (stores 0) instead of
  writing 0 °F, and decodes back to "Off". PPFD target range raised to 2000. Two new
  entities per light: `ppfd_min`, `ppfd_max`. (Bundled card v0.16.9.)

## 3.19.24

### Changed
- **Default proxy listen port is now `8000`** (was `8883`). The Mosquitto/MQTT broker
  add-on binds `8883` on the HA host, so a fresh install defaulting to `8883` would collide
  with it. New installs now listen on `8000` out of the box; the redirect/hotspot forwards
  the devices' `8883` traffic there. **Existing installs are unchanged** — your saved listen
  port is kept. The companion Hotspot add-on's `proxy_port` default moves to `8000` to match
  (add-on v0.6.8). README updated.

## 3.19.23

### Changed
- **Mode changes now activate only on Save (matches the SF app).** Picking a scheduled
  mode (Time Slot / PPFD / Cycle / Environment) no longer sends anything to the controller
  — it just switches the tile view. The mode is committed together with its settings when
  you press **Save**, which is also when the schedule activates. So choosing Time Slot no
  longer turns a light on until you save. Manual stays live (direct control). Discard
  reverts the staged mode too.

### Fixed
- **Fan tile: Time Slot now shows its settings.** Selecting Time Slot switches the fan tile
  to the schedule fields immediately (previously it could stay on Power/Speed until the
  device round-tripped).
- **Fan Cycle time/duration pickers.** Cycle **Start Time** is now a time picker (HH:MM),
  and **Run Duration** / **Off Duration** are HH:MM:SS pickers (the controller stores these
  as seconds; they were previously whole-minute number boxes). Legacy minute writes still
  work.

## 3.19.22

### Fixed
- **Mode dropdown now switches the tile body instantly.** Changing a light/fan mode
  (e.g. Time Slot → Manual) updated the tile body only after the device round-trip, so it
  looked stuck until you clicked elsewhere. The dropdown is now optimistic — the body
  reflects your pick immediately and reconciles when the device confirms. (Also fixes the
  card not re-rendering on staged edits: the Save-draft state was missing from the update
  check.)
- **Time fields no longer clip on mobile.** The schedule start/stop time inputs kept a
  usable minimum width and wrap instead of shrinking until the HH:MM (AM/PM) value is cut off.

### Note
- Switching a **light** to **Time Slot** may turn it on: that runs the light's saved
  schedule, and if the current time is inside the schedule's ON window the controller
  turns the light on (same as the Spider Farmer app). It isn't the integration forcing it
  — the writes send `mOnOff:0`. PPFD mode stays off when its PPFD window isn't active.
  Adjust or clear the schedule window, or use Manual, to keep it off.

## 3.19.21

### Added
- **Save button on climate accessories too.** Heater, Humidifier and Dehumidifier tiles
  now stage their Level behind the same **Save**/Discard flow as the fan and light tiles
  (Power stays live). Save commits as one atomic write that preserves the accessory's
  on/off state. New hidden Apply entities: `heater_apply`, `humidifier_apply`,
  `dehumidifier_apply`. (Bundled card v0.16.6.)

## 3.19.20

### Added
- **Save button for schedule settings (hybrid live/staged tiles).** Fan, blower and
  panel-light tiles now stage their schedule/cycle/environment parameters locally and
  commit them with a **Save** button as a single atomic device write — no more partial
  or racy per-field writes while you're mid-edit, and it matches the Spider Farmer app's
  configure-then-save flow. Momentary controls stay live: Power, the Manual speed/
  brightness slider, Oscillation and Natural Wind still apply the instant you change them.
  Rows with an uncommitted edit show a small accent bar; Discard reverts staged changes.

  New per-device "Apply" entities (hidden under Config) carry the bundle:
  `fan_apply`, `blower_apply`, `light_1_apply`, `light_2_apply`. (Bundled card v0.16.5.)

## 3.19.19

### Fixed
- **Changing a mode/setting could switch a device on.** Every accessory
  (fan, blower, light) preserves its on/off state across mode and setting
  changes now. The device's live telemetry fields (`on`/`level`) were leaking
  into the read-modify-write cache from device echoes and getting sent back in
  the config write — and `on:1` commands the device ON regardless of the manual
  setpoint, so e.g. switching the fan to Time Slot spun it up to 10%. Outgoing
  config writes now strip those live fields and send only setpoints
  (`mOnOff`/`mLevel`/…), so nothing we send flips the power.

  Note: in a *schedule/cycle/environment* mode the device's own automation still
  decides on/off from the schedule — same as the official app. This fix stops
  the integration from forcing it on.

## 3.19.18

### Fixed
- **Fan Mode dropdown desynced from the tile body.** The select was uncontrolled, so
  picking a mode made the dropdown jump ahead to your choice while the tile body still
  showed the previous mode's controls (e.g. dropdown said "Time Slot" but the Manual
  Speed slider stayed). All dropdowns are now bound to the confirmed entity state, so the
  mode selector and its per-mode controls always move together once the device confirms.
  (Bundled card v0.16.4.)

## 3.19.17

### Added
- **Mode-aware Fan tile.** The expanded fan tile now mirrors the app: a **Mode** selector
  (Manual / Time Slot / Cycle / Environment) drives which controls appear.
  - *Manual* — Speed slider.
  - *Time Slot* — Schedule start/stop, Gear, Oscillation, Standby Speed, Natural Wind.
  - *Cycle* — Start time, Run/Off minutes, Execution Times, Gear, Oscillation, Standby Speed, Natural Wind.
  - *Environment* — Run Mode (temp/humidity priority), Gear, Oscillation, Standby Speed, Natural Wind.

  Backed by 10 new fan entities and a confirmed write path (`modeType`, `shakeLevel`,
  `natural`, `minSpeed`/`maxSpeed`, `timePeriod`, `cycleTime`). (Bundled card v0.16.3.)

## 3.19.16

### Fixed
- **Device-tile fonts now match.** In an expanded device tile, the auto-surfaced controls
  (e.g. Fan Oscillation, Natural Wind, Heater Level) rendered in a smaller label style than
  the Power/Speed rows. They now use the same row style, so all labels in a tile match.
  (Bundled card v0.16.2.)

## 3.19.15

### Fixed
- **Lighting-period time boxes clipped on mobile.** The two time inputs plus their label
  didn't fit the row width. The period now stacks under its label with the two inputs
  flexing to share the full width (and given proper borders/padding). (Bundled card v0.16.1.)

## 3.19.14

### Added
- **Mode-aware light tile.** Expanding a Light tile now shows only the controls that apply
  to the selected Mode, mirroring the SF app:
  - **Manual** — Power, Brightness, Current PPFD.
  - **Time Slot** — current readout, **Light duration** (derived, shown above the period),
    **Lighting period** (start–stop), Target Brightness, Simulate Sunrise/Sunset (fade),
    Go dark, Turn off.
  - **PPFD** — current readout, **DLI + Light duration**, Lighting period, **Target PPFD**
    with the **current PPFD shown alongside it**, Simulate, Go dark, Turn off.
  - PPFD Target no longer appears under Manual/Time Slot.
- New light entities backing the above: schedule start/stop, schedule brightness, fade, and
  the PPFD start/stop/fade (decoded from `timePeriod` / `ppfdPeriod`; writes already
  supported). (Bundled card v0.16.0.)

## 3.19.13

### Fixed
- **Duplicate control in expanded device tiles.** A Fan/Blower tile showed both the pop's
  Speed slider and a second "Fan Speed" number (they're the same control). The de-dup check
  was matching the wrong entity_id (`…_gear_set` vs the name-slugged `…_fan_speed`); it now
  excludes the speed number correctly. Also strips the device-name prefix from the remaining
  labels, so they read "Fan Oscillation" / "Heater Level" instead of
  "SF Display Panel XXXX Fan Oscillation". (Bundled card v0.15.1.)

## 3.19.12

### Added
- **Light settings (Light 1 / Light 2).** Each panel light now exposes the SF app's
  advanced options as entities, which appear inline when you expand the light's tile on
  the Overview tab: **Mode** (Manual / Time Slot / PPFD), **Go dark** and **Turn off**
  temperature-overshoot thresholds (°F), and **PPFD Target** (µmol). Wire format confirmed
  from device logs (`keyPath ["device","light"]`: `modeType` 0/1/12, `darkTemp`/`offTemp`
  in °C, `ppfdPeriod[0].brightness` = target PPFD); temps are shown in °F and converted
  back on write.

### Changed
- **Environment tab** target columns reordered to **Night, then Day** (was Day, Night).
- **Alerts tab** threshold fields reordered to **Min, then Max** (was Max, Min).
- (Bundled card v0.15.0.)

## 3.19.11

### Changed
- **Overview tab: devices are now tiles.** Lights, Fan, Blower, Heater, Humidifier and
  Dehumidifier appear as tiles in a grid like the Parameters, mirroring the SF app's
  "Digital Device" screen. Each tile shows its live state (e.g. `65%`, `On`, `Off`,
  `Offline`) and **expands on click** to reveal its controls — power, brightness/speed
  slider, and any mode/level/oscillation options — the same drop-down pattern as the soil
  tiles. (Bundled card v0.14.0.)

## 3.19.10

### Added
- **Live value bubble on card sliders.** Every slider in the tent card and the SE light
  card now shows a small value bubble above the thumb while you drag it, updating in real
  time (e.g. `72°F`, `65%`, `250µmol`, `10m`). The value is only written to the device when
  you release, as before. Applies to environment targets, calibration offsets, light/fan
  levels, and the light schedule brightness/fade sliders. (Bundled card v0.13.0.)

## 3.19.9

### Fixes
- **Environment tab overflowed its card on mobile.** The Dead Zone slider couldn't shrink
  (missing `min-width: 0`), so the whole card was pushed wider than the screen and the title
  and dead-zone values were cut off. The slider now shrinks to fit like the other tabs.
  (Bundled card v0.12.1.)

## 3.19.8

### Added
- **Alarm thresholds + card "Alerts" tab.** The controller's alarm settings are now editable:
  the integration decodes the `alarm` block onto a per-controller
  **`sensor.sf_<slot>_alarm_settings`** (`settings` attribute), and the tent card gains an
  **Alerts** tab mirroring the SF app — Climate (Air Temp, Humidity, VPD, CO2, PPFD),
  Substrate (Soil Temp, WC, Soil EC), and Other Device (offline, water-full, over-temp, …).
  Each alert has an enable toggle and Max/Min limits; edits stage and write together via the
  new **`sf.set_alarm_settings`** service (read-modify-write; temps entered in °F, stored in
  °C). The tab appears only when the controller has reported its alarm block.
  (Bundled card v0.12.0.)

## 3.19.7

### Added
- **Controller alarm / event feed.** The integration now consumes the controller's alarm log
  (the `getAlarmLog` response, plus the `alarmLast` block pushed in every status frame) and
  exposes a per-controller **`sensor.sf_<slot>_alarms`** — state is the most recent alarm's
  time, with the decoded list (`id`, `time`, `devType`, `alarmType`) in the `events`
  attribute. A new HA event **`sf_alarm`** fires for each new alarm so automations can react
  (it does not replay old alarms on restart). Note: `devType`/`alarmType` are surfaced as raw
  values with placeholder labels for now — only one combination (devType 8 / alarmType 2) has
  been captured, so the human-readable labels will be filled in as more logs come in.

## 3.19.6

### Added
- **Outlet "Time Slot" schedule editor.** On the tent card's Outlets tab, an outlet in
  **Time Slot** mode now shows a full multi-slot, weekday-aware editor: add/remove up to 12
  slots, each with a per-day picker and start/stop times, with Save/Discard. Previously only a
  single slot with Daily/Custom was exposed.
- **Full outlet Time Slot parse + write.** The integration decodes the complete outlet
  `timePeriod` array (12 slots, weekday masks) onto a per-outlet `..._ts_schedule` sensor
  (`periods` attribute), and a new service **`sf.set_outlet_schedule`** writes it back —
  read-modify-write (the outlet's mode and other settings are preserved) and routed via the
  host CB (`ps5`/`ps10`) for nested strips. This completes the long-parked "Time Slot Custom"
  backlog item now that the weekmask bit order is confirmed (bit0=Sun … bit6=Sat).

## 3.19.5

### Added
- **New `custom:spider-light-card`** for SE-series lights. A dedicated card that mirrors the
  SF app's light screen: a circular brightness dial with an on/off toggle, a brightness
  slider, a Manual / Automatic mode selector, and — in Automatic — a full **multi-period,
  weekday-aware schedule editor**: add/remove time periods, per-period day pickers, start/stop
  times, brightness, and sunrise/sunset fade, with Save/Discard. Add it with
  `type: custom:spider-light-card` and `light: se1` (the SE light's slot). It's bundled in the
  same resource as the tent card, so no extra setup.
- **Full SE-light schedule support.** The integration now parses the controller's complete
  `timePeriod` array (multiple periods, each with a weekday mask) and exposes it on a new
  `sensor.sf_se1_schedule` (period count as state, decoded `periods` as an attribute). A new
  service **`sf.set_se_schedule`** writes the whole schedule back (used by the card; also
  callable from automations). Weekmask decoding was confirmed from device logs
  (bit0=Sun … bit6=Sat).
- **VPD range on the card's Environment tab.** A read-only **VPD kPa** section at the bottom
  mirrors the SF app: Daytime and Nighttime target ranges computed from each period's
  temperature and humidity targets and their dead zones (the range spans the hottest/driest
  to the coolest/wettest corner of the dead band). Updates live as you edit the setpoints.
  (Bundled card v0.10.1.)

## 3.19.4

### Added
- **Integration-usage badge** in the README (Home Assistant Analytics install count).
- **Calibration air offsets get a slider + entry box.** On the card's Calibration tab, Air
  Temp, Humidity, PPFD, and CO2 now show a slider on the left and an editable box on the
  right — adjust either and the other follows.

### Changed
- **Number formatting follows each field's step.** Whole-number / 10-step values (Environment
  Day/Night, dead zones, CO2 calibration) show without a decimal (`62`, `1 °F`, `250 ppm`),
  while 0.1-step calibration offsets keep one decimal (`0.0`, `-3.0`, `1.5`).

### Fixes
- **Card display issues on mobile.** The tab bar no longer clips the last tab (Calibration)
  on narrow screens — it scrolls horizontally instead. The Environment Day/Night number
  boxes no longer clip their values (e.g. "62" showing as "6", or a 4-digit CO2 target
  showing blank): the mobile number spin buttons are removed, the boxes are a fixed width
  sized for up to four digits regardless of screen size, and the Dead Zone slider takes
  the remaining width. (Bundled card v0.7.0.)

## 3.19.2

### Added
- **Per-probe soil breakdown on the card.** On `custom:spider-farmer-card`'s Overview tab,
  the Soil Temp, Moisture, and Soil EC tiles are now clickable when more than the average
  is available — clicking one expands a mini panel listing that reading for each individual
  probe (by its app name), so you can see per-probe values without leaving the Overview.
  Only appears when a panel has more than one probe (with a single probe the average is
  already that probe).
- **"All Soil Sensors Stats" table on the card.** Also on the Overview tab (2+ probes), a
  collapsible **All Soil Sensors Stats** section lists every probe in one table — name,
  Temp, WC (moisture), and EC per row. (Bundled card v0.6.0.)

## 3.19.1

### Fixes
- **Air/soil temperature spiked to ~176 °F on every reboot.** Home Assistant records a
  `temperature` sensor in the *display* unit (°F for Imperial users) while the integration's
  native unit is °C, so the keep-offline restore read the saved °F value back and re-applied
  it as °C — double-converting (e.g. 80 °F came back as 176 °F) and skewing history and
  automations for the seconds until the device next reported. The restore now converts the
  saved display value back to native °C first. Existing spikes already in history are
  unaffected; no new ones will be recorded.
- **Startup error log: "soil-cal park failed … New entity ID should be same domain".**
  The 3.18.x soil-calibration cleanup migration matched entities by unique_id only, so
  on 3.19 it also grabbed the new editable `number.` calibration entities and tried to
  park them under a `sensor.` temp id — which HA rejects (a rename can't change domain).
  The migration is now scoped to the legacy `sensor.` entities only; the `number.` /
  `select.` calibration entities are left alone (their platform already homes them
  correctly). No user action needed. (Bundled card v0.4.0.)

## 3.19.0

### Added
- **Editable sensor calibration.** The air-sensor and per-probe soil calibration
  offsets are now editable controls instead of read-only diagnostics. Adjusting one
  writes it straight back to the controller (no app needed):
  - **Air** (per Display Panel): Air Temp `±18 °F`, Air Humidity `±20 %`,
    PPFD `±20 µmol/m²/s` (box inputs, 0.1 steps) and CO2 `±200 ppm` (slider, 10-step).
  - **Soil** (per probe): Temp `±20 °F`, Moisture `±20 %`, EC `±5 mS/cm`
    (box inputs, 0.1 steps).
- **Substrate type.** Pro probes get a **Substrate** selector — Clay soil / Coco coir /
  Peat soil — that writes the probe's `soilType`.
- **Card tab overhaul.** `custom:spider-farmer-card` is reorganized into four tabs —
  **Overview**, **Environment**, **Outlets**, and **Calibration** — each shown only when
  the panel has the matching entities. Environment (day/night targets + dead zones) and
  Outlets (per-outlet modes) are now separate tabs, and the new Calibration tab mirrors
  the app's calibration screens: an Air Calibration section (Air Temp / Humidity / PPFD /
  CO2) and a per-probe Soil Calibration section (Temp / Moisture / EC + Substrate picker).
  Editing a value writes it straight to the controller. `default_tab` accepts `overview`,
  `environment`, `outlets`, or `calibration`. (bundled card v0.4.0)

### Notes
- Air-temp and soil-temp offsets are entered in °F (matching the app) and converted to
  °C on the wire. Humidity, EC, PPFD and CO2 are direct. PPFD stays in µmol/m²/s.
- Writes are read-modify-write: a soil change re-sends the full probe array so the other
  probes' settings are never disturbed. A soil write is held until the controller's
  config has been read at least once (so a partial array can't wipe the other probes).
- These entities moved from the `sensor.` domain (3.18.x, read-only) to `number.` /
  `select.` (editable). A one-time cleanup removes the old read-only sensors; the
  editable versions keep the same names and history.

## 3.18.3

### Fixes
- **Phantom soil sensors on every reboot (recorder errors).** The keep-offline restore
  parsed the new soil calibration unique_ids (`ggs_{mac}_soil_{serial}_cal_*`) as if
  "{serial}_cal" were a probe, spawning phantom `soilN` sensors (e.g. Soil 5-8) on each
  restart and churning the real calibration entity ids — which produced the recorder
  "cannot rename statistic_id / migrate history" errors. Restore now skips calibration
  and substrate ids, and a one-time cleanup removes the phantom entities and re-homes
  the real `cal_moisture` / `cal_ec` entities to their correct ids (history preserved).
- **Card `define` collision under tabbed-card.** `custom:spider-farmer-card`,
  `-editor`, and `ppfd-3d-card` now register with a guard (`if (!customElements.get(...))`),
  so a second load or tabbed-card's scoped registry no longer throws
  "Failed to execute 'define' … has already been used". (bundled card v0.2.4)
- **Calibration was "unknown" for up to ~10 min after startup.** The full `getConfigFile`
  (which carries air/soil calibration, substrate, and soil names) is now fetched ~3 s
  after each device connects, instead of waiting for the first periodic config poll.

## 3.18.2

### Fixes
- **Card: nested strips were dropped from the correct panel too.** The nesting filter
  (v0.2.2) resolved a panel's device via the first `sf_{slot}_*` entity it found, which
  could be an **Environment sub-device** entity (`sf_{slot}_env_*`). A nested strip's
  `via_device` points at the panel's **main** device, so the id mismatch filtered the
  strip out of its own panel's card as well. The card now resolves the panel's core
  device (prefers `sf_{slot}_temperature`, ignoring `_env_` sub-device entities), so a
  strip shows on its host panel and only there. (bundled card v0.2.3)

## 3.18.1

### Fixes (calibration read + card)
- **Soil/air calibration now populate on their own** — they no longer wait for a change
  in the app. The device doesn't answer targeted `getConfigField` reads for
  `["calibration"]` or `["device","senConfig"]`, so the integration now polls the full
  **`getConfigFile`** for panels/strips, which reliably carries the air calibration,
  soil calibration, substrate, and soil names. Missing calibration values default to
  **0** (instead of "unknown").
- **Substrate sensor is Pro-only.** Basic soil probes (firmware marker `mst_fw_ver`
  65535) no longer get a Substrate sensor — they have no substrate type.
- **Card:** a `custom:spider-farmer-card` bound to one panel now shows **only the power
  strip(s) actually nested under that panel** on the Config tab. Previously a card
  configured with multiple strips showed all of them on every panel's card. (bundled
  card v0.2.2)

## 3.18.0

### Sensor calibration & substrate (diagnostic, read-only)
- New **diagnostic sensors** surface the calibration offsets and soil substrate you
  set in the Spider Farmer app, read straight from the device config:
  - **Air** (per panel): Air Temp / Humidity / CO2 / PPFD Calibration offsets, from the
    config file's top-level `calibration` block. Air-temp is shown in **°F** to match
    the app (the wire is °C; converted on read).
  - **Soil** (per probe): Temp / Moisture / EC Calibration offsets, from
    `senConfig[].calibration` (soil-temp likewise °F). Plus a **Substrate** sensor
    (Clay / Coco / Peat) from `senConfig[].soilType`.
  - The integration now also polls `getConfigField ["calibration"]` so these stay
    current without the app open. Values update live within a poll cycle.
- Read-only for now — the app remains the source of truth. Making these **editable**
  (so you can enter offsets / pick substrate from HA and push to the app) is the next
  step; the write formats are already confirmed and locked.

## 3.17.0

### Fixes
- **Outlet "Mode" selectors disappeared after a restart** (with "Keep offline devices"
  on — the default). The keep-offline restore rebuilds an outlet's On/Off switch but
  not the dynamically-built Mode select, and the outlet-creation path only made the Mode
  select alongside a *new* switch — so once the switch was restored, the Mode select
  (and its per-mode config entities) was never recreated and HA reported it "no longer
  provided by the sf integration." The Mode select is now created independently of the
  switch, so it survives restarts. Affected AC5 and AC10 outlets. (Pre-existing bug,
  unrelated to the device-nesting change; a restart simply exposed it. The workaround of
  disabling "Keep offline devices" is no longer needed.)

### Soil probes
- **Soil sensors adopt the name you set in the Spider Farmer app.** The integration
  now reads each probe's app label (the device config's `senConfig` list, keyed by
  probe serial) and uses it as the sensor's **default name** — so a probe named
  "Front Left" in the app shows as "Front Left Temperature / Moisture / EC" instead
  of "Soil 1 …". Highlights:
  - **Live:** it polls the config each cycle and updates within about a minute of a
    rename in the app (no HA restart needed).
  - **Read-only:** the app is the source of truth. A **custom name you set in HA still
    wins** — the app name is only the default/placeholder. (An optional HA→app push is
    parked for a future release.)
  - **Non-destructive:** only the display name changes — entity IDs, history, and
    statistics are untouched (soil-probe entity IDs are slot-based, not name-based).
  - Per-device soil **averages** are unaffected (they aren't probes).

## 3.16.5

### Devices
- **Power strips nest under their host display panel.** When an AC5/AC10 strip is
  connected through a panel (the panel reports the strip's `ps5`/`ps10` block — the
  same signal that already routes the strip's outlet commands through the panel), the
  strip's device now shows **nested under that panel** in Settings → Devices, the same
  way the Environment sub-device nests. A strip run **standalone** (no hosting panel)
  stays **top-level**. The link is re-evaluated every discovery cycle, so plugging or
  unplugging a strip re-nests it within about a minute; only the device relationship
  changes — entity IDs, history, and automations are untouched.
  - Pairing is by strip *type* (the wire doesn't put the strip's MAC in the panel's
    block), so nesting is unambiguous for one panel per strip type — the normal
    single-tent setup. With multiple panels each hosting a same-type strip, the link
    may be approximate.

### Dashboard card (bundled card v0.2.1)
- **Outlet selection follows nesting.** In the card's visual editor, the "Outlet
  devices" picker now lists only the power strips **nested under the selected panel**
  (using the new device nesting above), instead of every strip in the system. If the
  panel has no nested strips, the outlet section is hidden entirely — so a standalone
  strip, controlled from its own card, no longer clutters an unrelated panel's card.
  New cards default their outlets to the panel's nested strips.

## 3.16.4

### Fixes
- **Soil-average sensors could be cross-assigned between panels** — dp1's card
  showed dp2's Soil Temp / Moisture / EC and vice versa. Two causes, both fixed:
  the slot reconcile skipped `soil_avg` entities entirely (it misread the "avg"
  in `ggs_{mac}_soil_avg_*` as a probe serial and found no slot for it), and the
  startup repair derived the target slot from the *current* entity_id instead of
  the device's MAC — so once a swap existed it stuck. Both now place each average
  by its host device's MAC → slot, using a collision-safe two-phase rename so a
  straight dp1↔dp2 swap resolves cleanly. History and statistics are preserved,
  and existing installs self-correct on the next restart. (Air sensors, lights,
  and other entities were unaffected — this was specific to the per-device soil
  averages.)

## 3.16.3

### Dashboard card (bundled card v0.2.0)
- **Visual editor with device dropdowns.** `custom:spider-farmer-card` now ships a
  working config UI. Previously the card advertised an editor that was never defined,
  so opening it errored with "Visual editor not supported … Cannot read properties of
  undefined (reading 'bind')". The editor lists your Spider Farmer devices in a **Panel
  device** dropdown (each shown with its friendly name), a **title** field, a
  **default tab** selector, and checkboxes to pick which power strips / panels expose
  their outlet controls on the Config tab — no more hand-typing slot names.
- **Device name in the header.** The card header now shows the selected panel's device
  name next to the title (e.g. "Spider Farmer · SF Display Panel 4E01"), so it's obvious
  which physical device a card is bound to — this makes a wrong `panel:` slot (e.g. dp1
  vs dp2) immediately visible.

## 3.16.2

### Fixes
- **Missing label on the initial setup form.** The "Create Environment Settings
  entities" checkbox showed its raw key (`environment_entities`) during first-time
  install because the config-flow translation was missing that field's label (the
  options flow already had it). Added the label so it reads correctly on install.

## 3.16.1

### Dashboard / controls
- **Blower Speed slider.** The blower now exposes a `number.sf_{panel}_blower_speed`
  control so its speed is adjustable inline (e.g. from the device's Controls card),
  matching the Heater/Humidifier level sliders. `0` = Off, and any value below the
  hardware's 25 % airflow floor snaps up to 25 %. It mirrors the existing
  `sensor.sf_{panel}_blower_speed` reading (which shows 0 while the blower is off).
  The blower `fan` entity's speed control is unchanged.
- **Fan Speed slider.** The circulation fan likewise gets a
  `number.sf_{panel}_fan_speed` control: a 0–100 % slider in 10 % steps mapped to the
  fan's 10 gears (`0` = Off, 10 % → gear 1 … 100 % → gear 10). It reads the reported
  gear and shows it as a percentage; the fan entity's own speed control is unchanged.

## 3.16.0

Base version for repo.

- Added licensing. 
- No functional changes from 3.15.3.

## 3.15.3

### Fixes
- **Phantom soil probes / correct soil-average handling.** Older builds' keep-offline
  startup restore mistakenly rebuilt the per-device soil AVERAGE as an extra probe named
  "avg", which was handed the next free probe slot — creating phantom entities like
  `sensor.sf_dp1_soil5_*` (on a 4-probe panel) or `sensor.sf_dp2_soil2_*` (on a 1-probe
  panel). Those phantoms are the averages in disguise, which is why the real
  `sensor.sf_{panel}_soil_avg_*` sensors never appeared and the card's soil tiles were
  missing. Two changes fix it:
  - Restore no longer touches the average unique IDs at all — it skips `ggs_{mac}_soil_avg_*`
    and lets the live path create the averages from probe reports.
  - **Automatic in-place repair on startup:** any existing phantom (an entity with the
    average unique_id `ggs_{mac}_soil_avg_*` sitting under a probe entity_id) is renamed by
    unique_id back to `sensor.sf_{slot}_soil_avg_{temperature|moisture|ec}`, **preserving
    history and statistics**. No manual entity deletion needed — just update and restart HA,
    and the soil-average sensors (and the card's tiles) appear with their correct IDs.

## 3.15.2

### Fixes
- **Soil average sensors were disappearing** (`sensor.sf_{panel}_soil_avg_temperature` /
  `_moisture` / `_ec`). The keep-offline startup restore predated the soil-average feature
  and misread their unique IDs (`ggs_{mac}_soil_avg_*`) as a soil probe with the serial
  "avg" — recreating them under the wrong entity_id and tripping the "create once" guard so
  the real averages never formed (which is why the dashboard card's Soil Temp / Moisture /
  EC tiles were missing). The restore now recognizes and rebuilds the per-device average
  sensors correctly.
  - **Recovery on an affected install:** after updating, delete any `soil_avg` entities in
    Settings → Devices & Services → Entities (search "soil_avg"), then reload the
    integration (or restart HA). They re-create with the correct IDs on the next soil-probe
    report, and the card tiles reappear.

## 3.15.1

### Dashboard cards
- Card loading made reliable: the integration now registers the bundled cards in
  **Lovelace's resource collection** (storage-mode dashboards — the same mechanism as
  the "Add resource" UI and HACS), with the frontend extra-module URL kept as a fallback
  for YAML-mode dashboards. They now appear automatically under Settings → Dashboards →
  Resources and in the card picker when the option is enabled.

### Fixes
- Fixed a blocking file read (the `manifest.json` version lookup) that ran inside the
  event loop during setup and logged a "blocking call" warning — now offloaded to an
  executor.

## 3.15.0 — first public release candidate

First public release of the Spider Farmer Bridge integration. Local control and
monitoring of Spider Farmer GGS controllers as native Home Assistant entities via
a TLS proxy — no cloud API, no MQTT broker.

### Highlights
- **Native entities** for Display Panels, AC5/AC10 power strips, light controllers,
  grow lights, climate gear (heater / humidifier / dehumidifier), and 3-in-1 soil
  probes — all created from live device evidence, with per-device availability,
  logical-slot entity IDs, hardware-replacement migration, and history preservation.
- **Environment settings** per display panel (day/night temp, humidity, CO2 targets
  and dead zones) with full block-preserving read/write and app↔HA sync.
- **Outlet modes** (Manual / Time Slot / Cycle / Temperature / Humidity / CO2 / Drip)
  with dynamic per-mode entities and real writes.
- **Optional bundled dashboard cards** (opt-in in Settings): `custom:spider-farmer-card`
  (tabbed Overview + Config) and `custom:ppfd-3d-card` (3D PPFD visualizer). Served at
  `/sf_bridge_frontend/` and auto-registered by the integration — no HACS card install or
  manual Lovelace resource. The version query on the URL cache-busts on each release.
- **Device control** is gated behind a Settings checkbox, default off (read-only).
- Diagnostic log with a novel-field detector; independent implementation.

### Packaging / CI
- Full test suite (92 tests) green; passes hassfest and HACS validation.
- Restored `const.py` signal constants; `pytest.ini` `pythonpath`; sorted manifest keys;
  valid `hacs.json`; `recorder` declared in `after_dependencies`; bundled-card assets in
  `cards/`.

## 3.14.1

### CI / packaging fixes
- Restored `const.py` (a packaging accident had dropped the trailing `SIGNAL_NEW_FMT`/`SIGNAL_REMOVE_FMT` signal constants, which broke entity setup and failed the whole test suite)
- `pytest.ini`: added `pythonpath = .` so the test suite imports `custom_components` under a plain `pytest tests/` run (CI collection was failing with `ModuleNotFoundError`)
- `hacs.json`: removed the invalid `render_readme` key so HACS manifest validation passes
- `manifest.json`: declared `recorder` in `after_dependencies` (used by the removal/purge path) to satisfy hassfest, and sorted the manifest keys (domain, name, then alphabetical) per hassfest lint
- Renamed the bundled-card asset folder `frontend/` → `cards/` to avoid a name collision with the `frontend.py` registrar module
- Docs: corrected stale `cb`/"Control Box"/"Power Strip 10" references to the current `dp`/"Display Panel"/"Power Strip AC10" naming in the README and options-flow text

## 3.14.0

### Second bundled card: PPFD 3D Grow Light
- The optional bundled-card install now includes a second card, **`custom:ppfd-3d-card`** — a 3D PPFD visualizer for Spider Farmer SE4500 / SF2000 grow lights — alongside `custom:spider-farmer-card`. The same Settings checkbox installs/removes both
- The frontend registrar now serves the whole `custom_components/sf/cards/` directory and auto-loads every bundled card module, so adding future cards is drop-in
- Note: the PPFD card loads three.js (r128) from cdnjs at runtime, so its 3D view needs internet access — the rest of the integration remains fully local

## 3.13.0

### Dashboard card (optional, bundled)
- New Settings option **"Install Spider Farmer dashboard card"** (default off). When enabled, the integration serves and auto-registers its bundled `custom:spider-farmer-card` Lovelace card — no HACS install and no manual Lovelace resource entry needed. Unchecking it removes the card from the frontend's auto-load list (the served file stays in the integration package, harmless)
- The card is a single tabbed card: **Overview** (parameter tiles + light/fan/blower/climate controls) and **Config** (Environment editor — day/night targets + dead zones for Temp/Humidity/CO2 — plus per-outlet mode configuration). Configure with `panel:` and optional `outlets:`
- Cache-busting is automatic: the served URL carries the integration version, so the browser refetches the card on each integration release
- The card element loads globally once enabled (it only defines the `spider-farmer-card` element; it has no effect until you add the card to a dashboard)

## 3.12.0
Consolidates the 3.11.2 beta series into a stable release.

### Environment Settings
- New **Environment device per display panel** ("SF Display Panel {last4} Environment", nested under its panel): Day Cycle start/stop and Temperature / Humidity / CO2 day + night targets and dead zones. Full read/write of the device's `["target"]` block, block-preserving, with app->HA sync. Temperatures shown in degF to match the SF app (wire is degC; converted both ways). VPD is read-only in the app, so it's not exposed
- UI: targets are manual-entry number boxes (whole numbers; temp/humidity step 1, CO2 step 10, range 300-2500 ppm); dead zones are sliders (Temp 1-18 degF, Humidity 1-10 %, CO2 10-250 ppm step 10). Number entities now show their units
- New Settings option "Create Environment Settings entities" (default on)

### Outlet modes (promoted from alpha)
- Per-outlet Mode selector (Manual / Time Slot / Cycle / Temperature / Humidity / CO2 / Drip Irrigation) with dynamic per-mode entity visibility, real block-preserving writes (mode switch, Manual on/off, Temp/Humidity/CO2 device, Cycle, Time Slot start/stop + Daily), and full app->HA sync via config polling
- The base outlet On/Off switch stays visible in every mode (the device only applies a Manual switch once on/off is toggled)
- Drip Irrigation advanced config and Time Slot custom-days / 12-slot support remain documented-but-unbuilt (`docs/OUTLET_MODES_WIRE.md`)

### Soil sensors
- Pro / Basic labels in the Device mappings list (from the probe firmware marker)
- One-step "Replace soil probe" action (new probe inherits the old slot; history continues)
- Per-controller average sensors (`..._soil_avg_temperature/_moisture/_ec`) when probes are present
- `retire_soil` made case-insensitive for uppercase hardware serials

### Renaming
- Display names: "Control Box" -> "Display Panel", "Power Strip 5/10" -> "Power Strip AC5/AC10". Entity-id slots: `cb`->`dp`, `ps5`/`ps10`->`ac5`/`ac10`. Automatic in-place migration on upgrade preserves unique IDs and history; update automations that referenced the old `sf_cb*`/`sf_ps5*`/`sf_ps10*` IDs
- Device wire-level protocol identifiers (cb/ps5/ps10) are unchanged

### Under the hood
- **Independent reimplementation of the `proxy/` layer** (MQTT codec, TLS proxy, normalizer, command translator) from the MQTT 3.1.1 spec, standard asyncio/TLS patterns, and this project's own documented captures. Attribution revised to credit the community protocol reverse-engineering while stating the source here is an independent implementation
- Diagnostic log can start a fresh, version+timestamp-named file per HA boot
- All Settings options are now labeled; a guard test enforces it
- New original brand icon (orange spider with an "SF" abdomen mark; no third-party logos)
- Test suite: 92 tests, all passing

## 3.11.1a4 (ALPHA)
- **App -> HA sync for outlet modes.** Changing an outlet's mode or settings in the SF app now flows back into HA: the polled outlet config (ps5/ps10/outlet block) is decoded into state topics, so the Mode selector, Device Type dropdowns, and Cycle/Time-Slot values update to match the device, and the visible per-mode entities switch automatically. Fixes the Mode selector and Temperature device (Cooling/Heating) not updating from the app
- A CB's ps5/ps10 config block is routed back to the correct standalone-strip entities (reverse of the command-side CB routing)
- Mode selector now reads the device's real mode on startup too (no longer Manual-only until you touch it)

## 3.11.1a3 (ALPHA)
- Decoded every outlet mode's wire format from a full app capture (see docs/OUTLET_MODES_WIRE.md) and made the writes **real**, block-preserving (read-modify-write from a freshly polled outlet config, so changing one setting never wipes the others):
  - Temperature/Humidity/CO2 **Device Type** dropdowns: Heating/Cooling (tempAdd 1/2), Humidifying/Dehumidifying (humiAdd 1/2), Aeration/Exhaust (co2Add 1/2)
  - **Cycle**: Start (HH:MM), Run/Off Duration (min→sec), Execution Times → cycleTime{}
  - **Time Slot**: Start/Stop (HH:MM), Week Daily→weekmask 127 → timePeriod[0]
- Added outlet-config polling (getConfigField on the ps5/ps10/outlet block) so the mode selector and writes work from the device's real current config
- Entity labels aligned to the SF app (Week, Execution Times, Device Type, Sensor)
- Still layout-only: Drip Irrigation advanced config (sensor→serial bind, irrigation periods, emergency protection) and the Time Slot custom day-of-week picker / 12-slot support — richer than the current entity set; formats are documented and ready to build if the feature is kept

## 3.11.1a2 (ALPHA)
- Drip Irrigation soil dropdown is now dynamic — it lists the soil probes actually detected, with no hard cap (up to 6 pro probes per device, or the single non-pro probe), instead of a fixed Soil 1-4. Falls back to just "Average" until probes are seen
- (Aside: pro vs non-pro probes are distinguishable in the data — non-pro reports mst_fw_ver 65535 and a short ID, pro reports a real firmware version and a 16-char serial — but the dropdown reflects real sensors directly, so no classification is needed)

## 3.11.1a1 (ALPHA)
- Fixed the outlet Mode selector snapping back to Manual after a change — the mode write was reaching the device correctly, but the selector (no device state topic) wasn't holding its chosen value; it's now optimistic and sticks
- Added Soil 4 to the Drip Irrigation soil-sensor dropdown

## 3.11.1a0 (ALPHA — layout preview, may be removed)
- **Per-outlet modes with dynamic visibility.** Each PS5/PS10 outlet gets a Mode selector (`select.sf_ps10_outlet_1_mode`): Manual, Time Slot, Cycle, Temperature, Humidity, CO2, Drip Irrigation. Only the active mode's config entities exist in HA — switching modes fully adds/removes them, so Manual shows just the On/Off switch + Mode selector, Cycle shows start/run/off/times, Temperature shows a Cooling/Heating device dropdown, etc. (dropdown-only layout for this preview)
- **Mode switching is a real write** — the confirmed device `modeType` (0 Manual, 1 Time Slot, 2 Cycle*, 3 Temperature, 4 Humidity, 5 CO2, 14 Drip; *2 inferred), block-preserving, routed through the hosting CB like all outlet commands
- **Sub-settings are layout-only in this alpha**: their exact wire encodings weren't in the capture, so changing them stores the value in HA but does not send to the device yet (logged). They become real once those specific toggles are captured
- This is an alpha to evaluate the layout — not a production feature yet. All prior functionality is unchanged

## 3.11.0
- **Automatic outlet command routing (CB-hosted vs. standalone)**: PS5/PS10 outlet switches now detect how the strip is connected and command it the right way — if a Control Box hosting the strip is connected (it reports the matching `ps5`/`ps10` block), the command routes through the CB using the confirmed app path `["device","ps5"|"ps10","O{n}"]`; if the strip is standalone, it's commanded directly with `["device","outlet","O{n}"]`. No configuration needed — plug the strip into a CB and control follows the CB; run it standalone and it goes direct
- Outlet switches stay grouped under the strip devices with their existing names (`switch.sf_ps10_outlet_1` …); only the underlying command target changes
- The CB's ps5/ps10 blocks are cached from reports so routed writes preserve outlet config (schedule/watering) and only flip on/off
- State feedback is unchanged — the strip reports its own outlet states regardless of which path issued the command

## 3.10.7
- **Fixed PS5/PS10 outlet control** — toggles were silently doing nothing. The outlet command built keyPath `["outlet","O{n}"]`, but the device requires the same `device`-rooted three-element path every other command uses; confirmed against an app capture: `["device","outlet","O{n}"]` with the outlet object carrying `modeType:0` (manual) + `mOnOff`. Cached outlet config (schedule/watering) is preserved on toggle, and outlet blocks are cached from reports so writes don't wipe it
- Added real outlet-command tests that assert the injected wire payload — the previous outlet test mocked the command handler and never exercised the payload, which is how this slipped through

## 3.10.6
- Repo prepared for publication: all real device identifiers (MAC addresses, OUI prefixes, device-name suffixes) replaced with internally consistent placeholders across tests, source comments, and docs; personal references removed. No functional changes — the test fixtures exercise identical logic

## 3.10.5
- "Schedule End" renamed to "Schedule Stop" (`text.sf_se1_schedule_stop`) so the schedule times list in start→stop order — HA sorts entities alphabetically by name and there's no explicit ordering hook. Unique ID unchanged; update automations that referenced the old entity_id

## 3.10.4
- The SE light's fade setting applies to **both sunrise and sunset** (one `fadeTime` drives the fade-in at schedule start and the fade-out at schedule end), so the entity is renamed accordingly: `number.sf_se1_sunrise_sunset_fade` (was `sunrise_minutes`). Unique ID is unchanged, so history carries over; update any automation that referenced the old entity_id

## 3.10.3
- **11% brightness floor on all lights** (hardware limit on SF panels, standalone SE and CB/strip-connected alike): any brightness command below 11% is raised to 11 — direct dimming, CB light blocks, and schedule brightness writes. The SE Schedule Brightness slider's range is now 11-100
- 0 still means "off" where off is the intent; the floor only applies to on-levels

## 3.10.2
- **Full SE-series light control**, built entirely from the captured app wire format (setOnOff / setLight / setMode / setConfigFile):
  - `light.sf_se1_light` — on/off + brightness (0-100%), non-optimistic (the light streams a report within ~200 ms of every change)
  - `select.sf_se1_mode` — Manual / Automatic
  - `text.sf_se1_schedule_start` / `text.sf_se1_schedule_end` (HH:MM), `number.sf_se1_schedule_brightness` (1-100%), `number.sf_se1_sunrise_minutes` (0-30, the sunrise fade) — block-preserving writes against the device's cached config file
- Mode sensor now shows names: Manual / Automatic / Automatic (Standby)
- The proxy reads the SE light's config file at connect and every 10 minutes, and re-reads it seconds after any schedule change (from HA or the app), so the schedule entities track both sides
- All control stays behind the device-control option
- New `text` platform (HH:MM fields with input validation)

## 3.10.1
- **Diagnostic log now captures every cloud/app → device command** (`DOWNCMD`), not just `setConfigField`. The SE4500's app writes use a method the log was silently passing through — this is the release that catches it
- Flat SE-light frames are captured in full on **value** changes (brightness/mode/pwm), not just structure changes, so app-side brightness tests are visible in the log
- No functional changes to entities or control

## 3.10.0
- **Standalone SE-series lights detected** (SE4500 and siblings, pcode 1005): these report a flat schema — top-level `brightness`/`mode`/`pwm`/`lightModel`, none of the Control-Box blocks — so detection never typed them. The `lightModel` marker is now conclusive evidence on the first frame; the device registers as "SF SE Light {last4}"
- Read-only entities for now: `sensor.sf_se1_brightness` (%), `sensor.sf_se1_mode` (raw mode number), `binary_sensor.sf_se1_active`. **Control is deferred on purpose**: the SF app's write format for standalone lights hasn't been captured yet, and guessing wire formats is how bugs get baked in. To enable control in a future release: turn on the diagnostic log, change the light's brightness/on-off from the SF app a few times, and send in the log
- SE frames no longer spam the diagnostic log's NOVEL-field warnings (schema added to the known-fields table)
- Keep-offline restart restore covers the SE type

## 3.9.0
- **"Keep offline devices" option (default ON)**: gear that is switched off at the tent no longer disappears from the integration after an HA restart. Two halves: entities for blocks that stop reporting are never pruned, and at startup every registered entity is recreated as a live object with its last state (RestoreEntity) — so automations referencing them keep resolving instead of erroring until the gear reports again
- Uncheck the option (Settings → Keep offline devices) to restore the old evidence-based phantom cleanup — useful once if you want to purge entities for gear you have permanently removed, then re-check it
- Outlet ghost-pruning is unaffected: a powered-off device plugged into a strip still reports its outlet, so that cleanup only ever catches true phantoms
- Note: version 3.8.0 was scrapped (dehumidifier slider experiment, reverted in favor of the dropdown)

## 3.7.0
- **Natural Wind toggle**: `switch.sf_cb1_fan_natural_wind` (per device with a circulation fan). Block-preserving write — speed, oscillation, and mode ride along untouched; state mirrors the controller's report (non-optimistic), gated behind the control option like all controls

## 3.6.1
- Bundled certificates renamed from `.crt`/`.key` to `.pem` (same PEM content, byte-for-byte): Windows flags `.crt` files extracted from downloaded zips as potentially harmful, which scared users at install time. No functional change; the device-facing CA and server cert are untouched

## 3.6.0
- **Level controls** (SF App ground-truth ranges): `number.sf_cb1_heater_level` (1-10), `number.sf_cb1_humidifier_level` (1-4 manual), `number.sf_cb1_fan_oscillation` (0-10, 0 = off), and `select.sf_cb1_dehumidifier_level` (Low/High) — likewise per strip
- Setting a level never flips the accessory on/off — `mOnOff` rides along unchanged; oscillation writes are block-preserving (speed/mode untouched)
- Sliders mirror the controller's reported level and show *unknown* while the accessory is idle (a reported 0 below the range floor is "not running", not a level)
- Dehumidifier level commands accept Low/High strings or 0/1
- Fan speed was already controllable via the fan entity's percentage slider (10 gears; blower 25-100%) — unchanged

## 3.5.0
- **Manual on/off switches for climate accessories**: Heater, Humidifier, and Dehumidifier each get a `switch` entity (`switch.sf_cb1_heater`, `switch.sf_cb1_humidifier`, `switch.sf_cb1_dehumidifier`, and likewise per strip). State mirrors the accessory's live `_active` report; commands are manual `mOnOff` writes, gated behind the device-control option like all other controls
- Heater/Humidifier ON now falls back to the last level the accessory actually ran at (else the lowest setting) instead of sending level 0, which the controller treats as off. Dehumidifier level 0 is a real setting (Low) and is left untouched
- Device name/model in the registry is now computed live from the bus, so an entity re-added mid-retype (LC → CB) can never write a stale device name back
- Test suite: 47 tests; added compat shims so the suite also runs on pre-2024.3 HA cores (no-ops on modern cores)

## 3.4.2
- **Reverts 3.4.1's per-install certificate generation — it broke every device connection.** The GGS devices only complete the TLS handshake with a server cert signed by the one specific CA already in their trust store, so a freshly generated CA can never work. The known-good certs ship bundled again (`custom_components/sf/certs/`) and are used as-is, never regenerated
- **Separated the two trust stores** (the root cause of the 3.4.1 outage): the generated CA had replaced the bundled `ca.crt` that was doubling as the upstream trust store, so the proxy could no longer verify the Spider Farmer cloud's certificate (signed by a private, self-signed CA — C=CN, O=MZ) and the relay collapsed. The cloud's public CA now ships separately in `custom_components/sf/upstream_ca/` and is used solely to verify the proxy→cloud leg (hostname check stays on); the device-facing certs are used only for the device→proxy leg
- The upstream TLS context no longer presents a client cert chain (the cloud never requested one)
- Test suite asserts the cloud CA is bundled, public-only (no private key), and distinct from the device-facing CA

## 3.4.1
- TLS certificates are now generated on first setup into `config/sf/certs/` (each install gets its own unique CA; no private key committed to the repo); requires the `cryptography` library
- Ships brand icons in `custom_components/sf/brand/` (HA 2026.3+ local brand assets)
- Added HACS `info.md`, GitHub issue templates, and CI (test suite + HACS + hassfest validation)

## 3.4.0
- **Detection rebuilt around real hardware capabilities**: AC5/AC10 power strips can host lights, fans, blowers, heaters, humidifiers, dehumidifiers, air sensors, and soil probes — so accessory blocks are no longer treated as Control-Box-exclusive
- Outlets are now the sole type discriminator: any outlet block = power strip (>5 outlets is conclusive PS10 on sight); accessory blocks without outlets suggest CB tentatively
- Power strips gain the full accessory entity set (air sensors, fan, blower, climate, lights, soil probes), all evidence-based — a loaded PS10 models exactly what's plugged into it
- Control Boxes no longer get outlet entities at all (matches hardware: CBs never report outlet blocks)
- CB detection now always uses the 3-frame window (accessory evidence is tentative), with the retype path correcting a loaded strip whose outlet block arrives late

## 3.3.3
- Soil probes on power strips now work correctly: the soil block is no longer Control-Box evidence (a probe on a PS5 previously retyped the strip as a CB)
- Fixed soil discovery consuming probe IDs during the detection window (tentatively-typed devices would permanently skip their probes' entities)

## 3.3.2
- Mappings screen displays and accepts CB-scoped soil values (`cb1_soil1`, `cb2_soil1`); bare values (`soil1`) also accepted
- Per-device soil duplicate validation actually shipped (a patch in 3.3.1 silently missed; global uniqueness was still enforced, blocking `soil1` on two CBs)
- Typing a different device's prefix on a probe is rejected with a clear error (probes follow their physical port; moves aren't mapping edits)

## 3.3.1
- Soil numbering is now per-device: each Control Box (or strip) counts its own probes, so `cb1_soil1` and `cb2_soil1` coexist
- Soil entity IDs are scoped to the host device: `sensor.sf_cb1_soil1_temperature`
- A probe moved to a device where its number is taken auto-renumbers on that device

## 3.3.0
- Soil probes become slot citizens: `sensor.sf_soil1_temperature` / `_moisture` / `_ec` (serials leave the entity IDs; unique IDs stay serial-based so history survives)
- Probes listed and editable in the Device mappings screen
- Probe replacement in one submit: give the new serial the dead probe's slot, blank the old serial (blank = retire: removes its entities and mapping)

## 3.2.6
- Clean removal no longer strands an empty `config/sf/` folder
- The customization snapshot is skipped entirely when "Preserve on removal" is unchecked

## 3.2.5
- **Fixed silent data loss**: saving the Settings form replaced the entry's options wholesale, wiping `device_slots` (slots would have reassigned by connect order on the next restart)
- Settings now merges into existing options; slot lookups self-heal a wiped stored mapping from the runtime cache

## 3.2.4
- Deleting a connected device now works as a **reset**: its session is severed, entities wiped, and it re-registers fresh on reconnect (power a device off first for permanent removal)
- Rolls up 3.2.3 (skip that version)

## 3.2.3
- **Field-level air sensor evidence**: temperature/humidity/