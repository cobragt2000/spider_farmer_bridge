# Security Policy

## Supported Versions

Only the current `3.19.x` release line receives security fixes. Always update to
the latest release before reporting an issue.

| Version | Supported |
| ------- | --------- |
| 3.19.x (latest) | :white_check_mark: |
| 3.19.0 – 3.19.(latest-1) | :warning: update first |
| 3.18.9 or earlier | :x: |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for a security problem.**

Report it privately via GitHub's **Security → Report a vulnerability** (private
security advisory) on this repository. If that isn't available to you, reach the
maintainer through the community Discord (linked in the README) and ask for a
private channel — do **not** post details in a public channel.

Please include:

- The affected version (`custom_components/sf/manifest.json` → `version`).
- A description of the issue and its impact.
- Steps to reproduce (and a proof-of-concept if you have one).
- Any relevant logs — **with MACs, IPs, and `uid` values redacted**.

What to expect:

- Acknowledgement within about a week (this is a hobby project — please be patient).
- Coordinated disclosure: we'll agree on a fix and a disclosure timeline before
  any public write-up. Credit is given unless you prefer to stay anonymous.

## Security model

This integration is a **local, cloud-free bridge**. It runs entirely on your Home
Assistant host and adds no third-party services. It works as a transparent
**TLS man-in-the-middle (MITM) proxy**: each Spider Farmer GGS device's own TLS
connection to the Spider Farmer cloud is terminated locally so status frames can
be decoded into HA entities and (optionally) commands injected back. Understanding
that design is the key to using it safely.

### Certificates & TLS

- **Device-facing side (the bridge acts as the "cloud").** The device only trusts
  a specific CA that is baked into its firmware trust store, so the bridge must
  present the matching, **bundled** certificate and key (`server.pem`,
  `server_key.pem`, `ca.pem`, written under your HA `config` dir on first start).
  Because that key is shipped with the integration, it is **not secret** — anyone
  who can both (a) reach a GGS device on your LAN and (b) redirect its traffic
  (DNS/router redirect or the Spider Farmer Hotspot add-on) could impersonate the
  cloud to that device. Treat LAN access and traffic-redirect control as the real
  trust boundary. This is inherent to the device's design, not a defect the bridge
  can remove.
- **Cloud-facing side.** When the bridge forwards a device's traffic upstream to
  the real Spider Farmer cloud, it **verifies the cloud's certificate**
  (`check_hostname = True`, `verify_mode = CERT_REQUIRED`). The bridge does not
  weaken or bypass upstream TLS.

### Network exposure

- The proxy listens on a LAN port (default **8000**, configurable). **Keep it on a
  trusted network and never port-forward it to the internet.** It speaks the GGS
  device protocol, not a hardened public service.
- Nothing new is sent off your network by the integration. The devices themselves
  still reach the Spider Farmer cloud through the bridge unless you separately
  firewall them; the bridge does not add or remove that.

### Device control

- Writing commands back to devices is **disabled by default** (`allow_control` =
  off). Read-only monitoring never injects anything. Enable control only if you
  want HA to change device settings, and only on a trusted network.
- Config writes are block-preserving and staged/atomic (the `sf.apply_bundle`
  path), reducing the chance of a partial write corrupting a device's config.

### Credentials & data

- The integration stores **no Spider Farmer account credentials, passwords, or API
  tokens** — it proxies each device's own already-authenticated connection rather
  than logging in on your behalf.
- Data handled is grow-environment telemetry and device configuration (temps,
  humidity, soil, schedules, alarms). Device identifiers (MAC, `uid`) pass through
  and may appear in the optional diagnostic log — **redact these before sharing a
  log.**

## Scope

In scope: the integration code (`custom_components/sf/`), the bundled Lovelace
cards, and the Spider Farmer Hotspot add-on in this repository. Out of scope:
vulnerabilities in Home Assistant itself, the Spider Farmer devices or their
firmware, and the Spider Farmer cloud service.
