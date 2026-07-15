"""Constants for Spider Farmer Bridge."""
DOMAIN             = "sf"
CONF_LISTEN_PORT   = "listen_port"
CONF_UPSTREAM_HOST = "upstream_host"
CONF_UPSTREAM_PORT = "upstream_port"
DEFAULT_LISTEN_PORT   = 8883
DEFAULT_UPSTREAM_HOST = "sf.mqtt.spider-farmer.com"
DEFAULT_UPSTREAM_PORT = 8883
CONF_ALLOW_CONTROL = "allow_control"
CONF_KEEP_OFFLINE = "keep_offline_entities"
CONF_ENV_ENTITIES = "environment_entities"
CONF_PRESERVE_ON_REMOVE = "preserve_on_remove"
CONF_DIAG_LOG      = "diagnostic_log"
CONF_DIAG_PATH     = "diagnostic_log_path"
DEFAULT_DIAG_PATH  = "custom_components/sf/logs/diagnostic.log"  # relative to /config
CONF_DIAG_DAYS     = "diagnostic_log_days"
CONF_DIAG_PER_BOOT = "diagnostic_log_per_boot"
DEFAULT_DIAG_DAYS  = 7                             # daily files kept, 1-30
CONF_INSTALL_CARD  = "install_lovelace_card"       # opt-in bundled Lovelace card
DATA_PROXY_TASK = "proxy_task"
DATA_PROXY      = "proxy"
DATA_BUS        = "bus"

PLATFORMS = ["binary_sensor", "fan", "light", "number", "select", "sensor", "switch", "text"]

# Dispatcher signals
SIGNAL_AVAILABILITY = "sf_availability"
SIGNAL_DEVICE_AVAIL_FMT = "sf_avail_{}"   # .format(mac)
SIGNAL_STATE_FMT    = "sf_state_{}"     # .format(state_topic)
SIGNAL_NEW_FMT      = "sf_new_{}"       # .format(platform)
SIGNAL_REMOVE_FMT   = "sf_remove_{}"    # .format(unique_id) — dynamic hide
