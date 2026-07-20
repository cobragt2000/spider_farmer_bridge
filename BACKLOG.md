# Spider Farmer Bridge — Backlog

Deferred items to pick up later. Not scheduled; captured so they aren't lost.

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

8. **Alarms / events feed** — the controller reports an event history the integration
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
