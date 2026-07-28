# Spider Farmer Bridge — Backlog

Deferred items to pick up later. Not scheduled; captured so they aren't lost.

## Open / remaining (as of 2026-07-27)

Current outstanding items, newest work first. Most of the alarm feed (item 8
below) is now shipped — cursor paging (3.19.50) and confirmed labels through
3.19.52/53. These are what's left:

- **Standing: keep `docs/ENTITIES.md` in sync.** Any entity added or removed in
  `entity_defs.py` (or the platform files) must be reflected in the entity
  reference doc, which the README links to. Update it as part of the same change.

- **Firmware "update available" detection + notify (deferred — needs a capture).**
  The controller's *current* firmware is already exposed (`sys.ver` -> Firmware
  Version sensor, 3.19.42), and each attached accessory reports its own
  `fwVersion`/`hwVersion` in `getGGSDev` (soil probes, sensors — not surfaced
  yet). What's missing is any "latest available version" signal: across ~52k
  captured messages there is no firmware-check method on the proxied
  MQTT-over-TLS link, so the OTA/update check almost certainly runs on a
  separate cloud endpoint the SF app hits, not through the bridge. Do NOT call
  Spider Farmer's cloud directly (undocumented, fragile, breaks local-only).
  Plan when a real update is pending: (1) capture a diagnostic log while the SF
  app is checking/showing a firmware update and see whether that traffic crosses
  the proxy; if it does, decode it into an HA `update` entity + notification.
  Feasible now regardless: notify on firmware *change* (fire an event when
  `sys.ver` changes) and add per-accessory firmware sensors from `getGGSDev`.

  **Bluetooth path (evaluated 2026-07-27).** Reference:
  `https://github.com/cr0ssn0tice/Spider-Farmer-GGS-Controller-MQTT` — a working
  reverse-engineering of the GGS controller's BLE protocol. Key facts:
  - The controller (`SF-GGS-CB`) speaks **plain, unencrypted JSON over standard
    BLE GATT**: service `0000ff00-…`, notifications on `0000ff01-…`
    (device→client, pushes the same `getDevSta` telemetry), command writes on
    `0000ff02-…`. Same payload shape we already decode from the TLS proxy.
  - **Hardware: an ESP32 is NOT required for us.** That repo ships a convenience
    ESP32 firmware (`.ino`, ESP32-WROOM-32 / NodeMCU ESP32; ESP8266 unsupported —
    no BLE), but it also proved the protocol over plain `bleak` on a PC. Since HA
    uses `bleak` natively, we can drive it from the **HA host's built-in
    Bluetooth or a USB BLE dongle**. An ESP32 is only ever an *optional*
    range-extender via ESPHome `bluetooth_proxy` (not this repo's firmware).
  - Caveats to test first: BLE range (~10 m line-of-sight); the controller likely
    allows **one BLE connection at a time**, so HA holding the link may block the
    SF app (and vice-versa); and BLE carries the *same* telemetry, with no
    firmware-"update-available" field shown in the repo — so BLE gives a fully
    cloud-free control/telemetry path but does **not** by itself answer the
    update-check question. Still need a capture (network or BLE) taken while an
    update is actually pending. (Requested 2026-07-27.)

- **Alarm devType 17 label — needs a capture.** devType 16 = Temperature &
  Humidity Sensor and devType 19 = Soil Sensor are confirmed offline sources
  (alarmType 3). devType 17 also fires the offline condition but has never been
  matched to an app Notification entry, so it renders "Device 17 Current device
  is offline". Capture the app's Notification screen + a diagnostic log while a
  devType-17 alarm is active to name it. Label-only, low risk.

- **"Lights off" alarm code — not yet seen.** Over-temperature is mapped
  (devType 20 "Light 1" / alarmType 6 "The light temperature is too high",
  3.19.53). A separate "lights off" alarm was mentioned but no distinct wire
  code has appeared — the captured light entries were only the over-temp raise
  and its restore. Grab the app Notification + log when a lights-off alarm fires
  to map its devType/alarmType.

- **Confirm the Min-PPFD alarm actually fires on-device.** 3.19.53 added a Min
  PPFD threshold in the Alerts tab; it writes `vmin` into the alarm block in the
  same shape every other metric uses and round-trips correctly. Whether the
  firmware acts on a *low*-PPFD alarm is unverified — set a min and confirm it
  triggers. If the device ignores it, note the limitation on the control.

- **PPFD Min ceiling: fixed 3900 vs. dynamic.** 3.19.55 caps the PPFD Min
  dropdown at a fixed 3900 (100 below the 4000 Max ceiling), matching the app
  capture where Max was 4000. Not yet confirmed whether the app caps Min at
  (currently-selected Max − 100) instead — i.e. Min ≤ 700 when Max is set to
  800. If so, switch the Min ceiling from fixed to dynamic. Needs an app capture
  with Max set below 4000.

## Soil sensor usability (requested 2026-07-11)

1. **[DONE in 3.11.2b1] Pro/Basic labels in the Device mappings list**
   Label each soil probe as **Pro** or **Basic** in the mappings UI so a
   multi-probe pro array is easy to tell apart from a single basic probe when
   reassigning slots.
   Detection signal (already confirmed in captures): a probe's `mst_fw_ver` ==
   65535 (0xFFFF) → Basic; a real firmware version (e.g. 4) → Pro. Pro probes
   also carry 16-char hardware serials; basic probes use short IDs (e.g. `AA01`).
   Scope: cosmetic/label only. Low risk.

2. **[DONE in 3.11.2b1] One-step soil probe replace**
   A mappings action that maps old-serial → new-serial and transfers the slot in
   a single step, instead of the current two-step retire-old + reassign-new.
   Note: probe history already survives a swap today because soil entity_ids are
   slot-based (`sf_cb1_soil1_*`); this is a convenience wrapper over the existing
   retire + reassign.

## Outlet modes alpha (3.11.1a) — decisions pending before production

3. **[DECIDED / DONE in 3.11.2b4] Base On/Off switch visibility**
   Decision: KEEP the base outlet On/Off switch visible in every mode. Rationale:
   the device only applies a switch to Manual mode once the on/off status is
   toggled (confirmed quirk in the SF app itself), so the switch must stay
   reachable. Locked with a test.

4. **[MOSTLY DONE in 3.11.1a3] Real writes for outlet mode sub-settings**
   Live now (real block-preserving writes): mode switching (modeType), Manual
   on/off, Temperature/Humidity/CO2 device dropdowns, Cycle (start/run/off/
   times), Time Slot start/stop, and Time Slot "Daily" (weekmask 127).
   **Still remaining** — the two richest surfaces, which need new entity
   modeling, not just wire encoding:
   - **Drip Irrigation advanced**: sensor -> serial bind, average target, the
     irrigation periods list, and the Emergency Protection sub-page. Wire
     formats already decoded in `docs/OUTLET_MODES_WIRE.md`.
   - **[DONE in 3.19.6] Time Slot "Custom"**: per-day-of-week picker (weekmask
     bits) and the full 12-slot list. Weekmask bit order confirmed from the
     2026-07-20 log (bit0=Sun … bit6=Sat); exposed on a per-outlet
     `..._ts_schedule` sensor + `sf.set_outlet_schedule` service; card editor on
     the Outlets tab.
   Wire formats for BOTH now fully decoded from the 2026-07-13 captures and
   written up in `docs/OUTLET_MODES_WIRE.md` (drip bind/period/extra; multi-slot
   timePeriod + custom weekmask). Remaining work is HA entity modeling + UX for
   the periods list and day picker, not protocol decoding.

5. **[DONE in 3.11.1a4] Device-side outlet mode sync**
   App-side changes now flow back into HA: the outlet config block is polled
   (getConfigField) and decoded into state topics, so the Mode selector and the
   sub-setting entities update to match the device, and the visible per-mode
   entities switch automatically. (Startup also reads the real mode.)

## Soil sensor averages (requested 2026-07-13)

6. **[DONE in 3.11.2b0] Soil average sensors (temp / moisture / EC)**
   The app reports an aggregate "avg" soil reading (the `{"id":"avg", tempSoil,
   humiSoil, ECSoil}` entry that leads the `sensors` array). Create per-device
   average sensors when soil probes are seen:
   `sensor.sf_cb1_soil_avg_temperature`, `..._moisture`, `..._ec` (scoped per
   CB/controller, like the individual probes). Source is already in every
   getDevSta frame — the normalizer currently skips the `avg` entry. Gate on
   soil-probe presence so devices without probes don't get empty average
   sensors.

## Diagnostic log per-instance naming (requested 2026-07-13)

7. **[DONE in 3.11.2b0] Timestamped/versioned diagnostic log filename per HA boot**
   When the diagnostic log is enabled, start a fresh log file on each HA restart
   with the integration version, date, and time appended to the name, e.g.
   `diagnostic-3.11.1a4-20260713-142530.log`. One log per running instance makes
   tracing far easier (no more re-uploads of a rotated/overwritten `diagnostic.log`,
   and every capture is self-identifying by version + boot time).
   Notes: derive the base name/dir from the current diag path setting; keep the
   daily rotation retention (or reconcile it with per-boot files); consider a small
   cleanup so old per-boot logs don't accumulate unbounded.

## Device alarm / event history (spotted 2026-07-20 log)

8. **[PARTLY DONE in 3.19.7] Alarms / events feed** — plumbing shipped: `getAlarmLog`
   responses + the `alarmLast` block are decoded onto `sensor.sf_<slot>_alarms` (state =
   latest time, `events` attribute) and an `sf_alarm` HA event fires on new entries.
   **Remaining:** decode the `devType` / `alarmType` enums into human labels (only devType 8
   / alarmType 2 captured so far), consider polling `getAlarmLog` for a fuller history, and
   confirm the `alarmLast` block structure from a live capture. Original notes below.

   The controller reports an event history the integration
   doesn't consume yet. Seen as two top-level blocks in a getConfigFile/status frame:
   ```
   "count": 1
   "list": [{"id": 386, "epoch": 1784571720, "devType": 8, "alarmType": 2}]
   ```
   Each entry looks like one alarm/event: `id`, `epoch` (unix time), `devType` (which
   accessory), and `alarmType` (what happened). The alarm *thresholds* are already in the
   config (`alarm.temp/humi/co2/tempSoil/humiSoil/ECSoil/vpd/ppfd` with enabled/vmin/vmax),
   so this `list` is the fired-alarm log. Candidate: a per-controller sensor exposing the
   most recent event (state = time/type, attribute = the decoded list), and/or an HA event
   fired on new entries so automations can react. Needs `devType`/`alarmType` enum decoding
   from more captures (only devType 8 / alarmType 2 seen so far).
