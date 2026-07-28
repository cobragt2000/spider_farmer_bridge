# Spider Farmer Bridge — Entity reference

Every entity the integration can create, grouped by function. **Everything is
evidence-based:** an entity appears only when the controller actually reports the
matching block or field, so a partial setup shows exactly what it has and nothing
more (plug a humidifier in tomorrow and its entities appear on the next status
frame; unplug the CO2 probe and its sensor is pruned).

> **Maintainers:** keep this file in sync — when an entity is added or removed in
> `custom_components/sf/entity_defs.py` (or the platform files), update the matching
> section here.

## Naming

Entity IDs are **role-based and slot-stable**:

```
<domain>.sf_<slot>_<field>
```

- `<slot>` — the logical slot assigned first-seen and persisted: `dp1`, `dp2`, …
  for Display Panels / controllers; `ac5`, `ac10` for AC5 / AC10 power strips;
  `soil1`, `soil2`, … for soil probes (scoped per controller, e.g.
  `sf_dp1_soil1_*`); the SE-series light uses its own slot.
- `<field>` — the role suffix listed in each table below.

Examples: `sensor.sf_dp1_temperature`, `switch.sf_ac10_outlet_3`,
`sensor.sf_dp1_soil2_moisture`, `number.sf_dp1_env_temp_day`.

Display **names** stay physical (e.g. `SF Display Panel A1B2`) and use
`has_entity_name`, so the full friendly name is `<device name> <entity>`.
Slots (including soil probes) are editable in **Configure → Device mappings**;
history follows the slot.

---

## Air sensors

Per display panel / any controller with an ambient probe. Created per-field, so a
panel with no CO2 probe simply has no CO2 sensor. Two decimals on display.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Temperature | `temperature` | sensor | Air temperature (shown in your HA unit; °C native). |
| Humidity | `humidity` | sensor | Relative humidity (%). |
| CO2 | `co2` | sensor | CO2 concentration (ppm). |
| VPD | `vpd` | sensor | Vapour pressure deficit (kPa). |
| PPFD | `ppfd` | sensor | Photosynthetic photon flux density (µmol/m²/s). |

## Day / night status

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Daytime (Light Sensor) | `daytime_light_sensor` | binary_sensor | Day as seen by the light sensor (`isDaySensor`). |
| Daytime (Schedule) | `daytime_schedule` | binary_sensor | Inside the environment day-cycle window (`isDayEnvTarget`). |

## System / diagnostics

For controllers that report the `sys` block. Grouped under Diagnostic.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Firmware Version | `fw_version` | sensor | Controller firmware (`sys.ver`). |
| Uptime | `uptime` | sensor | Time since the controller last booted. |
| WiFi Signal | `wifi_rssi` | sensor | Wi-Fi RSSI (dBm). |
| WiFi Connected | `wifi_connected` | binary_sensor | Wi-Fi link up. |
| Ethernet Connected | `eth_connected` | binary_sensor | Ethernet link up. |

## Alarm & event feed

One set per controller once it has alarm/notification data. See the card's Log and
Alerts tabs. New alarm entries also fire an `sf_alarm` HA event; operations fire
`sf_oplog`.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Alarms | `alarms` | sensor | Decoded alarm history; state = latest alarm time, `events` attribute = the list. |
| Operations | `oplog` | sensor | Decoded operations log (mode switches, schedule fires); state = latest op time. |
| Alarm Settings | `alarm_settings` | sensor | The controller's alarm thresholds, decoded for the card's Alerts tab (`settings` attribute). |

## Panel lights (Light 1 / Light 2)

Display-panel light channels. Light 2 appears only when present. The tent card's
Light tile surfaces the settings.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Light 1 / Light 2 | `light_1`, `light_2` | light | On/off + brightness. |
| Light N Brightness | `light_1_brightness`, `light_2_brightness` | sensor | Reported brightness (%). |
| Light N Mode | `light_1_mode`, … | select | Manual / Time Slot / PPFD. |
| Light N Schedule Start / Stop | `light_1_schedule_start` / `_schedule_stop` | text | Time-Slot schedule window (HH:MM). |
| Light N Schedule Brightness | `light_1_schedule_brightness` | number | Scheduled brightness (11–100 %). |
| Light N Fade | `light_1_fade` | number | Sunrise/sunset fade (0–60 min). |
| Light N Go Dark | `light_1_go_dark` | number | Dim if light over-temp (°F; 0 = off). |
| Light N Turn Off | `light_1_turn_off` | number | Cut power if light over-temp (°F; 0 = off). |
| Light N PPFD Target | `light_1_ppfd_target` | number | Auto-dim PPFD target (20–2000 µmol). |
| Light N PPFD Start / Stop | `light_1_ppfd_start` / `_ppfd_stop` | text | PPFD schedule window. |
| Light N PPFD Fade | `light_1_ppfd_fade` | number | PPFD fade (0–30 min). |
| Light N Dimming Range Min / Max | `light_1_ppfd_min` / `_ppfd_max` | number | PPFD auto-dim brightness bounds (11–100 %). |

## Fan

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Fan | `fan` | fan | On/off + speed (10 gears). |
| Fan Speed | `fan_speed` | sensor / number | Gear read-back (sensor) and setter (number, 0–100 %). |
| Fan Oscillation | `fan_oscillation` | sensor / number | Oscillation level read-back and setter. |
| Fan Natural Wind | `fan_natural_wind` | binary_sensor / switch | Natural-wind mode state and toggle. |
| Fan Mode | `fan_mode` | sensor / select | Mode read-back (sensor) and setter (`fan_mode_set`). |
| Fan Run Mode | `fan_run_mode` | select | Schedule vs cycle run mode. |
| Fan Schedule Start / Stop | `fan_schedule_start` / `_stop` | text | Time-Slot schedule window. |
| Fan Schedule Gear | `fan_schedule_gear` | number | Scheduled speed. |
| Fan Standby Speed | `fan_standby_speed` | number | Off-window speed. |
| Fan Cycle Start / Run / Off | `fan_cycle_start` / `_run` / `_off` | text | Cycle timing (HH:MM:SS). |
| Fan Cycle Times | `fan_cycle_times` | number | Cycle repeat count. |

## Blower

Same shape as the fan, plus a CO2 toggle.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Blower | `blower` | fan | On/off + speed (25 % floor). |
| Blower Speed | `blower_speed` | sensor / number | Speed read-back and setter (0 = off, 25–100 %). |
| Blower Mode | `blower_mode` | sensor / select | Mode read-back and setter (`blower_mode_set`). |
| Blower Run Mode | `blower_run_mode` | select | Schedule vs cycle. |
| Blower Schedule Start / Stop | `blower_schedule_start` / `_stop` | text | Schedule window. |
| Blower Running / Standby Speed | `blower_running_speed` / `blower_standby_speed` | number | In-window / off-window speed. |
| Blower Cycle Start / Run / Off | `blower_cycle_start` / `_run` / `_off` | text | Cycle timing. |
| Blower Cycle Times | `blower_cycle_times` | number | Cycle repeat count. |
| Blower Close CO2 | `blower_close_co2` | switch | Pause blower to let CO2 build. |

## Climate — Heater / Humidifier / Dehumidifier

Each appears when the accessory is reported. All share On/Off, Level, Active, Mode
and schedule/cycle; they differ in the **Level** control and the **fault** sensor.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Heater / Humidifier / Dehumidifier | `heater`, `humidifier`, `dehumidifier` | switch | Manual on/off. |
| Active | `<dev>_active` | binary_sensor | Currently running. |
| Level (read) | `<dev>_level` | sensor | Current gear/level. |
| Heater Level (set) | `heater_level` | number | Heater gear (1–10). |
| Humidifier Level (set) | `humidifier_level` | number | Humidifier gear (1–4). |
| Dehumidifier Level (set) | `dehumidifier_level` | select | Low / High. |
| Mode | `<dev>_mode` | sensor / select | Mode read-back and setter (`<dev>_mode_set`). |
| Heater Status | `heater_status` | sensor | `OK` / `Alarm` (per-device heater fault). |
| Humidifier Tank | `humidifier_tank` | sensor | `Full` / `Empty` (empty = out of water). |
| Dehumidifier Tank | `dehumidifier_tank` | sensor | `Empty` / `Full` (full = collection tank full). |
| Schedule Start / Stop | `<dev>_schedule_start` / `_stop` | text | Time-Slot schedule window. |
| Cycle Start / Run / Off | `<dev>_cycle_start` / `_run` / `_off` | text | Cycle timing. |
| Cycle Times | `<dev>_cycle_times` | number | Cycle repeat count. |

## SE-series standalone light (SE4500 etc.)

A standalone SE light gets its own device. Entity suffixes are `se_*`; the visible
object IDs slugify the names below.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Light | `se_light` | light | On/off + brightness. |
| Mode | `se_mode` (read) / `se_mode_set` | sensor / select | Manual / Automatic. |
| Brightness | `se_brightness` | sensor | Reported brightness. |
| Active | `se_active` | binary_sensor | Currently on. |
| Schedule Start / Stop | `se_schedule_start_set` / `se_schedule_end_set` | text | Schedule window. |
| Schedule Brightness | `se_schedule_brightness_set` | number | Scheduled brightness. |
| Sunrise/Sunset Fade | `se_sunrise_minutes_set` | number | Fade minutes (drives both ends). |
| Schedule | `se_schedule` | sensor | Decoded schedule (period count + `periods` attribute). |

## Power-strip outlets (AC5 / AC10)

One switch + mode selector per reported outlet, plus mode-specific config that
appears **only** while the outlet is in that mode.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Outlet N | `outlet_1` … `outlet_10` | switch | Outlet on/off. |
| Outlet N Mode | `outlet_1_mode` … | select | Manual / Time Slot / Cycle / Temperature / Humidity / CO2 / Drip Irrigation. |
| Outlet N Week | `outlet_N_ts_type` | select | *(Time Slot)* Daily / Custom. |
| Outlet N Start / Stop | `outlet_N_ts_start` / `_ts_stop` | text | *(Time Slot)* window. |
| Outlet N Schedule | `outlet_N_ts_schedule` | sensor | *(Time Slot)* full multi-slot schedule (`periods` attribute; edited via `sf.set_outlet_schedule`). |
| Outlet N Start | `outlet_N_cycle_start` | text | *(Cycle)* start time. |
| Outlet N Run / Off Duration Min | `outlet_N_cycle_run` / `_cycle_off` | number | *(Cycle)* on/off minutes. |
| Outlet N Execution Times | `outlet_N_cycle_times` | number | *(Cycle)* repeat count. |
| Outlet N Device Type | `outlet_N_temp_device` / `_humidity_device` / `_co2_device` | select | *(Temperature/Humidity/CO2)* Cooling/Heating, Dehumidifying/Humidifying, Aeration/Exhaust. |
| Outlet N Sensor / Average Target | `outlet_N_drip_soil` / `_drip_avg` | select / number | *(Drip Irrigation)* soil-probe source and moisture target. |

## Soil probes

Three sensors per detected 3-in-1 probe. IDs are controller-scoped
(`sf_dp1_soil1_*`). Pro probes add a substrate picker (see Calibration).

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| {Probe} Temperature | `soilN_temperature` | sensor | Soil temperature. |
| {Probe} Moisture | `soilN_moisture` | sensor | Soil moisture / water content (%). |
| {Probe} EC | `soilN_ec` | sensor | Soil EC (mS/cm). |

An unplugged probe's three sensors go **unavailable** after ~90 s (per-probe).

## Soil averages

Per-controller aggregate across its probes (the app's `avg` reading). Created when
a controller has soil probes.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Soil Avg Temperature | `soil_avg_temperature` | sensor | Average soil temperature. |
| Soil Avg Moisture | `soil_avg_moisture` | sensor | Average soil moisture. |
| Soil Avg EC | `soil_avg_ec` | sensor | Average soil EC. |

## Environment targets

One block per display panel, grouped on its own **Environment** device
(`SF Display Panel <last4> Environment`). Temps in °F.

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Day Cycle Start / Stop | `env_day_start` / `env_day_end` | text | Day-cycle window. |
| Temp Target Day / Night | `env_temp_day` / `env_temp_night` | number | Temperature targets (°F). |
| Temp Dead Zone | `env_temp_deadband` | number | Temperature dead band (°F). |
| Humidity Target Day / Night | `env_humi_day` / `env_humi_night` | number | Humidity targets (%). |
| Humidity Dead Zone | `env_humi_deadband` | number | Humidity dead band (%). |
| CO2 Target Day / Night | `env_co2_day` / `env_co2_night` | number | CO2 targets (ppm). |
| CO2 Dead Zone | `env_co2_deadband` | number | CO2 dead band (ppm). |

## Calibration

Editable offsets mirroring the SF app; edits write straight back to the controller.

**Air** (per controller with an air sensor):

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| Air Temp Calibration | `cal_air_temp` | number | Air-temperature offset (°F). |
| Air Humidity Calibration | `cal_air_humidity` | number | Humidity offset (%). |
| PPFD Calibration | `cal_ppfd` | number | PPFD offset. |
| CO2 Calibration | `cal_co2` | number | CO2 offset (ppm). |

**Per soil probe:**

| Entity | Suffix | Domain | Description |
|---|---|---|---|
| {Probe} Temp Calibration | `soilN_cal_temp` | number | Soil-temp offset (°F). |
| {Probe} Moisture Calibration | `soilN_cal_moisture` | number | Soil-moisture offset (%). |
| {Probe} EC Calibration | `soilN_cal_ec` | number | Soil-EC offset (mS/cm). |
| {Probe} Substrate | `soilN_substrate` | select | Clay soil / Coco coir / Peat soil (**Pro probes only**). |

## Internal / hidden

The integration uses hidden per-device write-channel (`*_apply`) text entities to
carry staged, atomic config writes (the `sf.apply_bundle` path). They are
`entity_registry_visible_default = False` and swept from the registry, so you
won't normally see them.
