# Changelog

All notable changes to the Spider Farmer Bridge integration.
Each section below is ready to paste into the matching GitHub release.

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