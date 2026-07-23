# Changelog

All notable changes to the Spider Farmer Bridge integration.
Each section below is ready to paste into the matching GitHub release.

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