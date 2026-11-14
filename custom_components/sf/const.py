"""Constants for Spider Farmer Bridge."""
DOMAIN             = "sf"
CONF_LISTEN_PORT   = "listen_port"
CONF_UPSTREAM_HOST = "upstream_host"
CONF_UPSTREAM_PORT = "upstream_port"
# Local listen port for the MITM proxy. NOT 8883: the Mosquitto/MQTT broker
# add-on binds 8883 on the HA host, so the proxy listens elsewhere and the
# redirect/hotspot forwards the devices' 8883 traffic here.
DEFAULT_LISTEN_PORT   = 8000
DEFAULT_UPSTREAM_HOST = "sf.mqtt.spider-farmer.com"
DEFAULT_UPSTREAM_PORT = 8883   # real Spider Farmer cloud port (unchanged)
CONF_ALLOW_CONTROL = "allow_control"
# Adaptive climate (AI) learning (v3.20.1): opt-in. Requires CONF_ALLOW_CONTROL —
# the AI feature is gated on device control being on (its purpose is control; it
# also needs HA up + reachable). When enabled, the integration learns each panel's
# device→metric response from recorder history and creates the AI Confidence
# sensor; when off, none of that runs or exists. Default off.
CONF_AI_LEARN = "ai_learn"
DEFAULT_AI_LEARN = False
# Durable AI training store (v3.20.5): OPT-IN, user choice. HA's recorder purges
# globally (purge_keep_days, default ~10 days) and an integration can't change
# that or request per-entity retention. When this is ON, the AI layer keeps its
# OWN compact SQLite time-series of SF climate metrics + device efforts (under
# /config/sf/), independent of the recorder, so learning isn't capped at the
# recorder's window — the learner reads from this store instead of the recorder.
# When OFF (default), nothing extra is stored and the learner reads the recorder
# as before — the right choice for users who already keep SF in the recorder
# long-term or have excluded SF from purge. Only meaningful when CONF_AI_LEARN is
# on. Retention is in DAYS; 0 = keep everything (never purge).
CONF_AI_STORE = "ai_store"
DEFAULT_AI_STORE = False
CONF_AI_RETENTION_DAYS = "ai_retention_days"
DEFAULT_AI_RETENTION_DAYS = 0        # 0 = keep all SF data forever
# Adaptive-climate ZONES (v3.20.11). One grow can span several SF controllers (e.g. a
# DP holds the tent sensor while a non-DP AC5/AC10 runs outlets for devices in that
# same tent), plus non-SF HA devices (an external humidifier toggled by automations).
# A zone groups ONE sensor controller with devices gathered from additional
# controllers + external HA entities, learned JOINTLY. A zone's learned result is
# published onto its sensor controller's existing ai_confidence sensor (no new
# entity). Controllers listed as a zone's device_panels are absorbed — not learned on
# their own. Controllers in no zone keep per-panel learning. options[CONF_AI_ZONES] =
#   [{ "id": slug, "name": str, "sensor_panel": slot,
#      "device_panels": [slot, ...],
#      "external": [{"entity_id": "switch.x", "role": "humidifier"}] }]
CONF_AI_ZONES = "ai_zones"
# Roles for an external (non-SF) HA entity, so the learner can label its effect. All
# are treated as on/off actuators for now (dimmable %/numeric is a later enhancement).
AI_EXTERNAL_ROLES = ("heater", "humidifier", "dehumidifier", "cooler", "fan", "light", "other")
CONF_BLOCK_CLOUD = "block_cloud"
CONF_KEEP_OFFLINE = "keep_offline_entities"
# Device offline (data-staleness) timeout in seconds (v3.19.320): a controller
# self-reports every ~6-10s, so if none of its frames arrive for this many
# seconds it's flipped to unavailable (fast "there's a problem" signalling that
# doesn't wait for the TCP/MQTT keepalive to drop on a hard power loss). 0 (or
# unset) disables the heartbeat check — availability then follows the connection
# only, as before. Default 30.
CONF_OFFLINE_TIMEOUT = "offline_timeout"
DEFAULT_OFFLINE_TIMEOUT = 30
# Per-strip external sensor config (v3.19.253): {mac_lc: {source, temp, humi}}.
# source "sf" (default, use the strip's own sensor) or "external" (mirror a
# 3rd-party HA temp/humidity entity onto the strip for outlet automations).
CONF_STRIP_SENSORS = "strip_sensors"
# Per-device smart-control config (v3.19.256): {mac_lc: {enabled, humidity,
# target, deadband, escalate_after_s, escalate_drop, ease_band, min_on_s,
# min_off_s}}. The integration closed-loop-drives the dehumidifier to hold the
# humidity target (full Manual). WARNING to surface in the card: when enabled the
# integration controls the gear, overriding SF's own automation.
CONF_SMART_CONTROL = "smart_control"
# Per-outlet integration-driven env control on a sensorless strip (v3.19.268):
# {mac_lc: {"<n>": {enabled, mode, dir, deadband?, min_on_s?, min_off_s?}}}.
# On an AC5/AC10 using an external temp source, an outlet set to Temperature
# (Cooling/Heating) can't run on the device (no sensor) — the integration drives
# it from the mirrored reading + the strip's env target, holding the chosen mode
# virtually so the card still shows Temperature/Cooling.
CONF_OUTLET_ENV = "outlet_env"
CONF_ENV_ENTITIES = "environment_entities"
CONF_PRESERVE_ON_REMOVE = "preserve_on_remove"
CONF_DIAG_LOG      = "diagnostic_log"
CONF_DIAG_PATH     = "diagnostic_log_path"
# Kept OUTSIDE custom_components/ — that folder is replaced on every integration
# update (HACS/manual), which was wiping the log history. /config/sf/logs also
# lets a user point the log there without the migration clobbering it back.
DEFAULT_DIAG_PATH  = "sf/logs/diagnostic.log"      # relative to /config → /config/sf/logs
CONF_DIAG_DAYS     = "diagnostic_log_days"
CONF_DIAG_PER_BOOT = "diagnostic_log_per_boot"
DEFAULT_DIAG_DAYS  = 7                             # daily files kept, 1-30
CONF_INSTALL_CARD  = "install_lovelace_card"       # opt-in bundled Lovelace card

# Time-lapse (v3.19.358+). Capture a camera.* entity on an interval into a SECURE,
# user-chosen folder; scrub/export from the card. NEVER under /config/www (served
# unauthenticated). See _backlog_private/TIMELAPSE_DESIGN.md.
CONF_TIMELAPSE_CAMERA    = "timelapse_camera"       # camera.* entity to snapshot
CONF_TIMELAPSE_DIR       = "timelapse_dir"          # storage root (absolute path)
CONF_TIMELAPSE_INTERVAL  = "timelapse_interval"     # seconds between frames
CONF_TIMELAPSE_RETENTION = "timelapse_retention"    # days of frames to keep
CONF_TIMELAPSE_ENABLED   = "timelapse_enabled"      # capture on/off
DEFAULT_TIMELAPSE_DIR      = "/media/sf_timelapse"
DEFAULT_TIMELAPSE_INTERVAL = 300                    # 5 min
DEFAULT_TIMELAPSE_RETENTION = 7                     # days
# Phase 3 overlay — burn selected SF env readings onto each frame at capture (so the
# exported video carries them; each frame shows the data from when it was taken).
CONF_TIMELAPSE_OVERLAY        = "timelapse_overlay"          # on/off
CONF_TIMELAPSE_OVERLAY_BURN   = "timelapse_overlay_burn"     # burn into frames/video vs card-only
CONF_TIMELAPSE_OVERLAY_PANEL  = "timelapse_overlay_panel"    # dp1/dp2/... to read env from
CONF_TIMELAPSE_OVERLAY_FIELDS = "timelapse_overlay_fields"   # list: temp,humidity,vpd,co2,ppfd,timestamp
DEFAULT_TIMELAPSE_OVERLAY_FIELDS = ["temp", "humidity", "vpd", "timestamp"]
DEFAULT_TIMELAPSE_OVERLAY_COLOR = "#ffffff"
# Paths we refuse as a time-lapse root (served unauthenticated at /local/...).
TIMELAPSE_BLOCKED_ROOTS = ("/config/www", "/www", "config/www", "www")

# Multi-instance (v3.19.362+): each camera/time-lapse is an independent instance
# keyed by a stable slug (tl_id). One card = one instance (named in the card, with a
# camera-derived default when left blank). The options dict:
#   options[CONF_TIMELAPSE_INSTANCES] = {
#       tl_id: {name, camera, dir, interval, retention, enabled,
#               overlay, overlay_burn, overlay_panel, overlay_fields}
#   }
# The legacy single-time-lapse top-level keys above are migrated into one instance on
# first setup of this version (see _migrate_timelapse_options in __init__.py).
CONF_TIMELAPSE_INSTANCES = "timelapse_instances"
# Per-instance config dict keys (kept short; distinct from the legacy CONF_* keys).
TL_NAME = "name"                          # instance name (drives tl_id slug — DON'T change for display)
TL_LABEL = "label"                        # optional display name for the card header; blank ⇒ card falls back to the camera's friendly name
TL_CAMERA = "camera"
TL_DIR = "dir"
TL_INTERVAL = "interval"
TL_RETENTION = "retention"
TL_ENABLED = "enabled"
TL_OVERLAY = "overlay"
TL_OVERLAY_BURN = "overlay_burn"
TL_OVERLAY_PANEL = "overlay_panel"
TL_OVERLAY_FIELDS = "overlay_fields"
TL_OVERLAY_COLOR = "overlay_color"        # hex text colour, e.g. "#ffffff"
TL_OVERLAY_GROUPED = "overlay_grouped"    # True = one box; False = place each field
TL_OVERLAY_POS = "overlay_pos"            # {field|"group": [xPct, yPct]} anchor positions
TL_OVERLAY_ORIENT = "overlay_orient"      # grouped layout: "v" (stacked) or "h" (one row)
TL_ALIGN = "align"                        # True: first frame on the next clock mark;
                                          # False: capture immediately, then every interval
TL_OVERLAY_LABELS = "overlay_labels"      # True: "Temp 72°F"; False: just "72°F" (less on screen)
TL_OVERLAY_FONT = "overlay_font"          # overlay text size multiplier (1.0 = default)
TL_DAILY_AT = "daily_at"                  # "HH:MM" time-of-day for a 1-day interval capture


def slug_timelapse_id(value: str) -> str:
    """Stable, filesystem/URL-safe id for a time-lapse instance, derived from the
    user's name (or a camera entity id when the name is blank). Lowercase, with
    non-alphanumeric runs collapsed to a single underscore. MUST stay in lockstep
    with the card's _slugId() so the card and backend agree on the key."""
    import re
    s = (value or "").strip().lower()
    if s.startswith("camera."):
        s = s[len("camera."):]
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s or "timelapse"

DATA_PROXY_TASK = "proxy_task"
DATA_PROXY      = "proxy"
DATA_BUS        = "bus"

PLATFORMS = ["binary_sensor", "button", "fan", "light", "number", "select", "sensor", "switch", "text"]

# Dispatcher signals
SIGNAL_AVAILABILITY = "sf_availability"
SIGNAL_DEVICE_AVAIL_FMT = "sf_avail_{}"   # .format(mac)
SIGNAL_STATE_FMT    = "sf_state_{}"     # .format(state_topic)
SIGNAL_NEW_FMT      = "sf_new_{}"       # .format(platform)
SIGNAL_REMOVE_FMT   = "sf_remove_{}"    # .format(unique_id) — dynamic hide
SIGNAL_SOIL_LABEL_FMT = "sf_soil_label_{}"  # .format(soil serial) — app rename
