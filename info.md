# Spider Farmer Bridge

Native Home Assistant control and monitoring for **Spider Farmer GGS**
devices — Display Paneles, AC5/AC10 power strips, light controllers, climate
gear, and 3-in-1 soil probes — with **no cloud API and no MQTT broker**.

A transparent TLS proxy sits between your devices and the Spider Farmer
cloud: the app keeps working normally, while every status update becomes a
live HA entity and (optionally) HA can send commands back.

## Highlights

- **Evidence-based entities** — a device gets exactly the entities for the
  hardware it actually reports; nothing phantom, and new hardware appears on
  its own
- **Full device coverage** — air sensors (temp/humidity/CO2/VPD/PPFD),
  outlets, dual lights with brightness, fan (with working oscillation),
  blower, humidifier / dehumidifier / heater, and auto-discovered soil probes
  (per-probe plus per-device averages)
- **Logical slot entity IDs** — `sensor.sf_dp1_temperature`,
  `switch.sf_ac10_outlet_3`, `sensor.sf_dp1_soil2_moisture`; physical display
  names stay intact, IDs are editable in a mappings screen
- **Hardware replacement** — swap a device or probe and keep its entity IDs,
  history, and automations
- **Near-real-time** config changes, per-device availability, customization
  preservation across reinstall, and a diagnostic log with novel-field
  detection
- **Read-only by default** — device control is opt-in

## Setup

1. Install and restart Home Assistant
2. Add the **Spider Farmer Bridge** integration
3. Redirect the GGS devices' `TCP 8883` traffic to your HA host at your
   router/firewall (e.g. a pfSense port-forward)

TLS certificates are generated automatically on first setup — each install
gets its own local CA.

See the full README for architecture, network setup, and the entity-ID
scheme.

## Credits

An independent implementation, with thanks to the community projects that first
reverse-engineered the Spider Farmer GGS protocol:
[Schedule 4 Real](https://github.com/EddiePiazza/schedule-4-real) and
[iceboerg/spiderfarmer-bridge](https://github.com/iceboerg00/spiderfarmer-bridge).
Not affiliated with Spider Farmer.
