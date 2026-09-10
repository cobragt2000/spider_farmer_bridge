#!/usr/bin/env bash
# Spider Farmer Hotspot add-on entrypoint.
#
# Brings up a Wi-Fi access point on a dedicated radio and runs dnsmasq so that
# Spider Farmer GGS controllers which join the hotspot resolve
# sf.mqtt.spider-farmer.com to the LOCAL Spider Farmer Bridge proxy (:8883)
# instead of the real cloud. The proxy still relays to the cloud over the
# host's wired uplink, so the phone app keeps working.
#
# Two AP backends:
#   nmcli   - NetworkManager creates the AP connection. Coexists with HAOS.
#   hostapd - raw hostapd owns the radio directly.
#   auto    - nmcli if a running NetworkManager is reachable, else hostapd.
set -uo pipefail

ADDON_VERSION="0.8.5"
OPTIONS=/data/options.json
NM_CON="SF-Bridge-Hotspot"
DNSMASQ_PID=""
HOSTAPD_PID=""
STATUS_PID=""
TCPDUMP_PID=""
NFT_ADDED=""
BACKEND=""
CHOSEN_IFACE=""

# Logs go to stderr so command substitution never captures them by accident.
log() { echo "[sf-hotspot] $*" >&2; }
get() { jq -r "$1" "$OPTIONS"; }

log "Spider Farmer Hotspot add-on v${ADDON_VERSION} starting"

ENABLED=$(get '.hotspot_enabled')
AP_BACKEND=$(get '.ap_backend')
IFACE=$(get '.wifi_interface')
SSID=$(get '.ssid')
PASSWORD=$(get '.password')
CHANNEL=$(get '.channel')
HOTSPOT_IP=$(get '.hotspot_ip')
# sf.mqtt.spider-farmer.com always resolves to the hotspot IP (where the
# integration's proxy listens). The old configurable dns_target override was
# removed in 0.7.2 — it was never needed.
DNS_TARGET="${HOTSPOT_IP}"
COUNTRY=$(get '.country_code')
UNMANAGE=$(get '.unmanage_via_nmcli')
SECURITY=$(get '.security')
DNS_LOGGING=$(get '.dns_logging')
BLOCK_UPDATES=$(get '.block_updates')
PROXY_PORT=$(get '.proxy_port')
[ -z "${PROXY_PORT}" ] || [ "${PROXY_PORT}" = "null" ] && PROXY_PORT=8883
# Internet passthrough (NAT to the uplink) is always on — controllers need it
# to come online. The user-facing toggle was removed in 0.8.0.
INTERNET_ACCESS="true"

# All firewall work goes through native nftables (HAOS's own backend), in a
# single dedicated table "sfhs" so teardown is one command. Helper creates the
# table on demand (idempotent) and records that we own it.
nft_table() {
  command -v nft >/dev/null 2>&1 || return 1
  nft add table ip sfhs 2>/dev/null || true
  NFT_ADDED=1
}

# (Re)assert every nft rule the hotspot needs: the uplink masquerade + forward
# accepts (internet for the clients) and the :8883 -> proxy redirect. Idempotent
# — our own chains are flushed first so a re-assert never stacks duplicate rules.
# Split out so the watchdog can re-apply it if HAOS/Docker/NetworkManager rebuild
# the host nftables and wipe our chains. (v0.8.2)
apply_nft_rules() {
  nft_table || return 1
  nft flush chain ip sfhs post 2>/dev/null || true
  nft flush chain ip sfhs fwdc 2>/dev/null || true
  nft flush chain ip sfhs pre  2>/dev/null || true
  if [ "${INTERNET_ACCESS}" = "true" ]; then
    echo 1 > /proc/sys/net/ipv4/ip_forward 2>/dev/null \
      || sysctl -w net.ipv4.ip_forward=1 >/dev/null 2>&1 || true
    nft add chain ip sfhs post '{ type nat hook postrouting priority 100 ; }' 2>/dev/null
    nft add rule ip sfhs post ip saddr "${PREFIX}.0/24" oifname != "${IFACE}" counter masquerade 2>/dev/null
    nft add chain ip sfhs fwdc '{ type filter hook forward priority 0 ; }' 2>/dev/null
    nft add rule ip sfhs fwdc iifname "${IFACE}" ip saddr "${PREFIX}.0/24" counter accept 2>/dev/null
    nft add rule ip sfhs fwdc oifname "${IFACE}" ct state established,related counter accept 2>/dev/null
  fi
  nft add chain ip sfhs pre '{ type nat hook prerouting priority -150 ; }' 2>/dev/null
  nft add rule ip sfhs pre iifname "${IFACE}" tcp dport 8883 counter redirect to :"${PROXY_PORT}" 2>/dev/null
  apply_docker_user_accept
}

# Docker/HAOS run their own `ip filter FORWARD` chain with a DROP policy, letting
# only their bridge networks through (via DOCKER-USER). Our hotspot subnet isn't a
# Docker network, so client->internet forwarding falls through to that DROP: DNS,
# DHCP and the local :8883 redirect keep working (so the app looks connected), but
# clients can't reach the internet — which silently blocks firmware OTA downloads
# and NTP ("connected, but the update won't download"). The add-on's own forward
# ACCEPT can't override another chain's drop, so we whitelist the subnet in
# DOCKER-USER (a terminating ACCEPT, evaluated before the FORWARD drop). Docker
# rebuilds DOCKER-USER, so the watchdog re-adds this too. `ip filter` is
# iptables-nft managed; DOCKER-USER exists specifically for user rules. (v0.8.3)
apply_docker_user_accept() {
  [ "${INTERNET_ACCESS}" = "true" ] || return 0
  command -v nft >/dev/null 2>&1 || return 1
  nft list chain ip filter DOCKER-USER >/dev/null 2>&1 || return 1   # Docker not up yet
  nft list chain ip filter DOCKER-USER 2>/dev/null \
    | grep -q "iifname \"${IFACE}\" ip saddr ${PREFIX}.0/24" \
    || nft insert rule ip filter DOCKER-USER iifname "${IFACE}" ip saddr "${PREFIX}.0/24" counter accept 2>/dev/null
  nft list chain ip filter DOCKER-USER 2>/dev/null \
    | grep -q "oifname \"${IFACE}\" ct state established,related" \
    || nft insert rule ip filter DOCKER-USER oifname "${IFACE}" ct state established,related counter accept 2>/dev/null
}

# True when our DOCKER-USER whitelist is present (both directions).
docker_user_ok() {
  [ "${INTERNET_ACCESS}" = "true" ] || return 0
  nft list chain ip filter DOCKER-USER 2>/dev/null \
    | grep -q "iifname \"${IFACE}\" ip saddr ${PREFIX}.0/24"
}

# Watchdog check: are our key rules still present? The host periodically rebuilds
# nftables (Docker/NM/Supervisor), which silently drops our chains — DNS/DHCP keep
# working (local listeners) but the clients lose their route to the internet, so
# GGS controllers get stuck retrying NTP and never reach the cloud/proxy. When the
# rules go missing we re-assert them so it self-heals without an HA reboot.
reassert_nft_if_missing() {
  command -v nft >/dev/null 2>&1 || return 0
  local ok=1
  nft list chain ip sfhs pre 2>/dev/null | grep -q 'redirect to' || ok=0
  if [ "${INTERNET_ACCESS}" = "true" ]; then
    nft list chain ip sfhs post 2>/dev/null | grep -q 'masquerade' || ok=0
    docker_user_ok || ok=0
  fi
  if [ "${ok}" != "1" ]; then
    log "WATCHDOG: hotspot NAT/forward/redirect rules missing (host rebuilt nftables?) - reasserting."
    apply_nft_rules \
      && log "WATCHDOG: rules reasserted (masquerade + DOCKER-USER forward + 8883->:${PROXY_PORT} redirect)." \
      || log "WATCHDOG: re-assert failed."
  fi
}


if [ "${ENABLED}" != "true" ]; then
  log "hotspot_enabled is false - nothing to do. Sleeping."
  exec sleep infinity
fi

# --- wireless interface detection ---------------------------------------
# Names of all wireless interfaces (from sysfs; works in host_network mode).
list_wifi_ifaces() {
  local p ifc
  for p in /sys/class/net/*/wireless; do
    [ -e "${p}" ] || continue
    ifc=$(basename "$(dirname "${p}")")
    echo "${ifc}"
  done
}

# True if the interface's radio advertises AP mode.
iface_ap_capable() {
  local ifc="$1" phy
  phy=$(iw dev "${ifc}" info 2>/dev/null | sed -n 's/.*wiphy \([0-9]\+\).*/\1/p')
  [ -n "${phy}" ] || return 1
  iw phy "phy${phy}" info 2>/dev/null \
    | grep -A 40 "Supported interface modes" | grep -qw "AP"
}

# Sets CHOSEN_IFACE to the first AP-capable card (or first wireless card),
# and logs every candidate so the user can pick from the dropdown if needed.
detect_interface() {
  CHOSEN_IFACE=""
  local cands ifc report=""
  cands=$(list_wifi_ifaces)
  [ -z "${cands}" ] && return 1
  for ifc in ${cands}; do
    if iface_ap_capable "${ifc}"; then
      report="${report} ${ifc}(AP-capable)"
      [ -z "${CHOSEN_IFACE}" ] && CHOSEN_IFACE="${ifc}"
    else
      report="${report} ${ifc}(no-AP?)"
    fi
  done
  log "detected wireless interfaces:${report}"
  # If capability probing found nothing (some drivers hide modes), fall back
  # to the first wireless interface.
  [ -z "${CHOSEN_IFACE}" ] && CHOSEN_IFACE="${cands%%$'\n'*}"
  return 0
}

if [ "${IFACE}" = "auto" ] || [ -z "${IFACE}" ] || [ "${IFACE}" = "null" ]; then
  if ! detect_interface || [ -z "${CHOSEN_IFACE}" ]; then
    log "ERROR: no wireless interface detected. Set 'wifi_interface' explicitly."
    log "All interfaces:"; ip -o link show | awk -F': ' '{print "  " $2}' >&2
    exec sleep infinity
  fi
  IFACE="${CHOSEN_IFACE}"
  log "auto-selected wifi_interface=${IFACE}"
else
  # Log what's available anyway, so the log confirms the chosen name exists.
  detect_interface || true
  log "using configured wifi_interface=${IFACE}"
fi

# --- sanity checks -------------------------------------------------------
if ! ip link show "${IFACE}" >/dev/null 2>&1; then
  log "ERROR: interface '${IFACE}' not found. Available interfaces:"
  ip -o link show | awk -F': ' '{print "  " $2}' >&2
  log "Set 'wifi_interface' to one of the detected wireless cards above."
  exec sleep infinity
fi
if [ "${PASSWORD}" = "changeme123" ]; then
  log "WARNING: still using the default password 'changeme123' - change it."
fi
if [ "${SECURITY}" != "open" ] && [ "${#PASSWORD}" -lt 8 ]; then
  log "ERROR: WPA/WPA2 password must be at least 8 characters."
  exec sleep infinity
fi

PREFIX="${HOTSPOT_IP%.*}"
DHCP_START="${PREFIX}.10"
DHCP_END="${PREFIX}.100"
NETMASK="255.255.255.0"

# --- regulatory domain --------------------------------------------------
# 2.4GHz AP operation is forbidden in the world ("00") regulatory domain, which
# is why hostapd reports "channel is disabled" and NetworkManager times out with
# "802.1X supplicant took too long". Set a real country domain and report what
# the kernel actually applied so the cause is visible.
setup_regdomain() {
  local before after phy
  before=$(iw reg get 2>/dev/null | awk '/^country/{print $2; exit}')
  log "regulatory domain (before): ${before:-unknown}"
  iw reg set "${COUNTRY}" 2>/dev/null || true
  sleep 1
  after=$(iw reg get 2>/dev/null | awk '/^country/{print $2; exit}')
  log "regulatory domain (after set ${COUNTRY}): ${after:-unknown}"

  phy=$(iw dev "${IFACE}" info 2>/dev/null | sed -n 's/.*wiphy \([0-9]\+\).*/\1/p')

  # radio driver (chipset family) - the biggest predictor of AP support
  local drv
  drv=$(basename "$(readlink -f "/sys/class/net/${IFACE}/device/driver" 2>/dev/null)" 2>/dev/null)
  log "radio driver: ${drv:-unknown} (phy${phy:-?})"

  # self-managed radios ignore the global 'iw reg set'
  if iw reg get 2>/dev/null | grep -qi "self-managed"; then
    log "NOTE: a radio reports self-managed regulatory - 'iw reg set' may not apply;"
    log "the driver itself decides which channels are allowed."
  fi

  # Verbose radio diagnostics (full reg table + per-channel flags) only when
  # dns_logging is on - useful when a radio won't come up, noise otherwise.
  if [ "${DNS_LOGGING}" = "true" ]; then
    log "regulatory state:"
    iw reg get 2>/dev/null | sed 's/^/    /' >&2
    if [ -n "${phy}" ]; then
      log "2.4GHz channels on phy${phy} (look for 'disabled' / 'no IR'):"
      iw phy "phy${phy}" info 2>/dev/null \
        | awk '/Frequencies:/{f=1} /valid interface combinations|Supported commands|Band 2:/{f=0} f && /2[0-9][0-9][0-9] MHz/' \
        | sed 's/^/    /' >&2
    fi
  fi

  case "${after}" in
    00*|""|unknown)
      log "WARNING: still in the world/unset regulatory domain, so 2.4GHz AP"
      log "channels remain DISABLED. Fix this on the HOST: set your country under"
      log "Settings > System > General > Country in Home Assistant (that sets the"
      log "Wi-Fi regulatory domain for the whole system), then restart this add-on."
      ;;
  esac
}

# --- pick the backend ----------------------------------------------------
nm_running() {
  command -v nmcli >/dev/null 2>&1 && \
    [ "$(nmcli -t -f RUNNING general status 2>/dev/null)" = "running" ]
}
case "${AP_BACKEND}" in
  nmcli)   BACKEND="nmcli" ;;
  hostapd) BACKEND="hostapd" ;;
  auto|*)  if nm_running; then BACKEND="nmcli"; else BACKEND="hostapd"; fi ;;
esac
if [ "${BACKEND}" = "nmcli" ] && ! nm_running; then
  log "ap_backend=nmcli but no running NetworkManager - falling back to hostapd."
  BACKEND="hostapd"
fi

log "backend=${BACKEND} interface=${IFACE} ssid='${SSID}' channel=${CHANNEL} ip=${HOTSPOT_IP} security=${SECURITY}"
log "DNS: sf.mqtt.spider-farmer.com -> ${DNS_TARGET}"

setup_regdomain


# --- dnsmasq config (used by BOTH backends) ------------------------------
DNSMASQ_CONF=/tmp/dnsmasq.conf
cat > "${DNSMASQ_CONF}" <<DNSM
interface=${IFACE}
bind-interfaces
except-interface=lo
no-resolv
server=1.1.1.1
server=8.8.8.8
dhcp-range=${DHCP_START},${DHCP_END},${NETMASK},12h
dhcp-option=3,${HOTSPOT_IP}
dhcp-option=6,${HOTSPOT_IP}
address=/sf.mqtt.spider-farmer.com/${DNS_TARGET}
dhcp-leasefile=/data/dnsmasq.leases
log-facility=-
DNSM
# Verbose DHCP/DNS query logging only when dns_logging is on (the lease file,
# which feeds the dashboard's client list, is always written above).
if [ "${DNS_LOGGING}" = "true" ]; then
  printf 'log-dhcp\nlog-queries\n' >> "${DNSMASQ_CONF}"
fi
# Optional: block firmware/OTA downloads on the hotspot. The controllers pull
# firmware over HTTP from Alibaba OSS (mz-iot.oss-accelerate.aliyuncs.com); DNS-
# blackholing that host makes the download fail while MQTT/control (sf.mqtt ->
# local proxy) and NTP keep working. Turn on to keep gear from updating over the
# AP; leave off to allow updates. (v0.8.3)
if [ "${BLOCK_UPDATES}" = "true" ]; then
  {
    echo 'address=/mz-iot.oss-accelerate.aliyuncs.com/0.0.0.0'
    echo 'address=/oss-accelerate.aliyuncs.com/0.0.0.0'
  } >> "${DNSMASQ_CONF}"
  log "block_updates on: firmware host (oss-accelerate.aliyuncs.com) blackholed - OTA downloads blocked, control unaffected."
fi

# --- cleanup on exit -----------------------------------------------------
cleanup() {
  log "Shutting down hotspot..."
  [ -n "${DNSMASQ_PID}" ] && kill "${DNSMASQ_PID}" 2>/dev/null || true
  [ -n "${STATUS_PID}" ] && kill "${STATUS_PID}" 2>/dev/null || true
  [ -n "${TCPDUMP_PID}" ] && kill "${TCPDUMP_PID}" 2>/dev/null || true
  # One table holds the redirect + NAT + forward rules, so this removes them all.
  [ -n "${NFT_ADDED}" ] && nft delete table ip sfhs 2>/dev/null || true
  # Remove the whitelist we inserted into Docker's shared DOCKER-USER chain so we
  # don't orphan rules there when the add-on stops. (v0.8.3)
  while nft -a list chain ip filter DOCKER-USER 2>/dev/null \
        | grep -E "(iifname \"${IFACE}\" ip saddr ${PREFIX}.0/24|oifname \"${IFACE}\" ct state established,related)" \
        | grep -oE 'handle [0-9]+' | head -1 | grep -q .; do
    h=$(nft -a list chain ip filter DOCKER-USER 2>/dev/null \
        | grep -E "(iifname \"${IFACE}\" ip saddr ${PREFIX}.0/24|oifname \"${IFACE}\" ct state established,related)" \
        | grep -oE 'handle [0-9]+' | head -1 | awk '{print $2}')
    [ -n "${h}" ] && nft delete rule ip filter DOCKER-USER handle "${h}" 2>/dev/null || break
  done
  [ -n "${HOSTAPD_PID}" ] && kill "${HOSTAPD_PID}" 2>/dev/null || true
  if [ "${BACKEND}" = "nmcli" ]; then
    nmcli con down "${NM_CON}" 2>/dev/null || true
    nmcli con delete "${NM_CON}" 2>/dev/null || true
  else
    ip addr flush dev "${IFACE}" 2>/dev/null || true
    ip link set "${IFACE}" down 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

start_dnsmasq() {
  log "Starting dnsmasq..."
  dnsmasq --keep-in-foreground --conf-file="${DNSMASQ_CONF}" &
  DNSMASQ_PID=$!
  sleep 1
  if ! kill -0 "${DNSMASQ_PID}" 2>/dev/null; then
    log "ERROR: dnsmasq failed to start. Is port 53 already bound on the host?"
    DNSMASQ_PID=""
    return 1
  fi
}

# --- backend: nmcli ------------------------------------------------------
start_nmcli() {
  log "Configuring AP via NetworkManager..."
  nmcli dev set "${IFACE}" managed yes 2>/dev/null || true
  nmcli con down "${NM_CON}" 2>/dev/null || true
  nmcli con delete "${NM_CON}" 2>/dev/null || true

  # Create the whole AP connection in ONE 'con add' so 802-11-wireless.mode=ap
  # is set at creation time. (If mode were applied by a later 'modify' that
  # failed, NM would activate the radio in client mode and report
  # "Wi-Fi network could not be found".) No per-connection country property -
  # that is a system-wide regulatory setting, not an NM connection property,
  # and including it silently poisons the whole command.
  local out
  local sec_args=()
  case "${SECURITY}" in
    open) sec_args=() ;;
    wpa)  sec_args=(wifi-sec.key-mgmt wpa-psk wifi-sec.psk "${PASSWORD}" \
                    wifi-sec.proto wpa wifi-sec.pairwise tkip wifi-sec.group tkip) ;;
    *)    sec_args=(wifi-sec.key-mgmt wpa-psk wifi-sec.psk "${PASSWORD}" \
                    wifi-sec.proto rsn wifi-sec.pairwise ccmp wifi-sec.group ccmp) ;;
  esac
  if ! out=$(nmcli con add type wifi ifname "${IFACE}" con-name "${NM_CON}" \
        autoconnect yes ssid "${SSID}" \
        802-11-wireless.mode ap \
        802-11-wireless.band bg \
        802-11-wireless.channel "${CHANNEL}" \
        ${sec_args[@]+"${sec_args[@]}"} \
        ipv4.method manual \
        ipv4.addresses "${HOTSPOT_IP}/24" \
        ipv6.method ignore 2>&1); then
    log "ERROR creating NM AP connection: ${out}"
    return 1
  fi

  # Disable Wi-Fi powersave on the AP interface (brcmfmac / Raspberry Pi radios
  # are more stable as an AP with it off). Safe/best-effort - never fatal.
  nmcli con modify "${NM_CON}" 802-11-wireless.powersave 2 2>/dev/null || true

  if ! out=$(nmcli con up "${NM_CON}" 2>&1); then
    log "ERROR bringing up NM AP connection: ${out}"
    return 1
  fi
  sleep 2
  start_dnsmasq || return 1
  log "NetworkManager AP '${SSID}' is up."
}

# --- backend: hostapd ----------------------------------------------------
start_hostapd() {
  if [ "${UNMANAGE}" = "true" ] && command -v nmcli >/dev/null 2>&1; then
    log "Marking ${IFACE} unmanaged in NetworkManager (best effort)."
    nmcli dev set "${IFACE}" managed no 2>/dev/null || true
  fi

  # Best effort: clear any rfkill soft-block and set the regulatory domain so
  # the chosen channel is permitted (fixes "channel is disabled").
  command -v rfkill >/dev/null 2>&1 && rfkill unblock all 2>/dev/null || true

  HOSTAPD_CONF=/tmp/hostapd.conf
  cat > "${HOSTAPD_CONF}" <<HAPD
interface=${IFACE}
driver=nl80211
ssid=${SSID}
country_code=${COUNTRY}
ieee80211d=1
hw_mode=g
channel=${CHANNEL}
auth_algs=1
HAPD
  case "${SECURITY}" in
    open) : ;;
    wpa)
      cat >> "${HOSTAPD_CONF}" <<HSEC
wpa=1
wpa_passphrase=${PASSWORD}
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
HSEC
      ;;
    *)
      cat >> "${HOSTAPD_CONF}" <<HSEC
wpa=2
wpa_passphrase=${PASSWORD}
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP
HSEC
      ;;
  esac
  log "Configuring ${IFACE}..."
  ip link set "${IFACE}" down || true
  pkill -f "wpa_supplicant.*${IFACE}" 2>/dev/null || true
  ip addr flush dev "${IFACE}" || true
  ip link set "${IFACE}" up
  ip addr add "${HOTSPOT_IP}/24" dev "${IFACE}"
  start_dnsmasq || return 1
  log "Starting hostapd..."
  hostapd "${HOSTAPD_CONF}" &
  HOSTAPD_PID=$!
  sleep 1
  if ! kill -0 "${HOSTAPD_PID}" 2>/dev/null; then
    log "ERROR: hostapd failed to start. If NetworkManager owns ${IFACE}, set"
    log "ap_backend=nmcli or unmanage_via_nmcli=true."
    HOSTAPD_PID=""
    return 1
  fi
}

# --- run -----------------------------------------------------------------
if [ "${BACKEND}" = "nmcli" ]; then
  if ! start_nmcli; then
    log "nmcli backend failed - retrying with hostapd."
    BACKEND="hostapd"
    start_hostapd || { log "Both backends failed."; exec sleep infinity; }
  fi
else
  start_hostapd || { log "hostapd backend failed."; exec sleep infinity; }
fi

# Give the hotspot general internet (IP forward + NAT to the uplink), the same
# as devices have on the normal LAN in the router-NAT method. Many controllers
# won't attempt their cloud MQTT connection until they can reach the internet,
# so an isolated hotspot leaves them "connected but offline". The :8883 redirect
# below still intercepts the cloud connection to the local proxy regardless.
if [ "${INTERNET_ACCESS}" = "true" ]; then
  echo 1 > /proc/sys/net/ipv4/ip_forward 2>/dev/null \
    || sysctl -w net.ipv4.ip_forward=1 >/dev/null 2>&1 || true
  log "ip_forward = $(cat /proc/sys/net/ipv4/ip_forward 2>/dev/null || echo '?') (1 = internet routing on)"
  if nft_table \
     && nft add chain ip sfhs post '{ type nat hook postrouting priority 100 ; }' 2>/dev/null \
     && nft add rule ip sfhs post ip saddr "${PREFIX}.0/24" oifname != "${IFACE}" counter masquerade 2>/dev/null \
     && nft add chain ip sfhs fwdc '{ type filter hook forward priority 0 ; }' 2>/dev/null \
     && nft add rule ip sfhs fwdc iifname "${IFACE}" ip saddr "${PREFIX}.0/24" counter accept 2>/dev/null \
     && nft add rule ip sfhs fwdc oifname "${IFACE}" ct state established,related counter accept 2>/dev/null; then
    log "internet access: NAT ${PREFIX}.0/24 -> uplink enabled (nft)."
  else
    log "WARNING: could not enable internet NAT for the hotspot. Devices that need"
    log "internet before connecting to the cloud may stay offline."
  fi
  # Docker's FORWARD chain default-drops non-Docker subnets, which silently blocks
  # client internet (firmware OTA downloads, NTP) even though DNS + the :8883
  # redirect keep working. Whitelist our subnet in DOCKER-USER so forwarding is
  # allowed. (v0.8.3)
  if apply_docker_user_accept; then
    log "internet access: DOCKER-USER forward whitelist for ${PREFIX}.0/24 added."
  else
    log "note: DOCKER-USER not present yet; the watchdog will add the forward"
    log "whitelist once Docker's chain exists (needed for OTA/NTP over the AP)."
  fi
fi

# The device dials the cloud on :8883, but HA's Mosquitto broker owns :8883 on
# the host - so we intercept the device's :8883 with a native nft REDIRECT and
# send it straight to the integration's proxy (proxy_port). The rule runs in
# PREROUTING at an EARLY priority (ahead of Docker/HAOS's own nat chains and
# before the socket layer), so it grabs the packet before Mosquitto sees it.
# The proxy listens on 0.0.0.0:proxy_port, so it receives the redirected packet
# on the hotspot IP - no userspace forwarder needed.
if nft_table \
   && nft add chain ip sfhs pre '{ type nat hook prerouting priority -150 ; }' 2>/dev/null \
   && nft add rule ip sfhs pre iifname "${IFACE}" tcp dport 8883 counter redirect to :"${PROXY_PORT}" 2>/tmp/nft.err; then
  log "cloud redirect: ${IFACE} tcp/8883 -> :${PROXY_PORT} (nft, pre-empts Mosquitto)"
else
  log "WARNING: could not add the 8883 -> ${PROXY_PORT} redirect: $(head -1 /tmp/nft.err 2>/dev/null)"
fi

# Health check: is the integration's proxy actually listening on proxy_port? A
# device can join the hotspot and resolve the redirect, yet still be offline if
# nothing answers.
if command -v ss >/dev/null 2>&1 && ss -ltn 2>/dev/null | grep -q ":${PROXY_PORT} "; then
  log "proxy port :${PROXY_PORT} is listening (Spider Farmer Bridge integration up)."
else
  log "WARNING: nothing is listening on :${PROXY_PORT}. Devices will join the hotspot"
  log "but stay OFFLINE until the Spider Farmer Bridge integration is running and its"
  log "proxy is reachable (DNS target ${DNS_TARGET}, device port 8883 -> :${PROXY_PORT})."
fi

# Status dashboard (HA ingress): connected clients, redirect + proxy health.
log "Starting status dashboard on ingress port 8099..."
INGRESS_PORT=8099 python3 /status_server.py &
STATUS_PID=$!

# Diagnostic: with dns_logging on, capture TCP SYNs on the hotspot so we can see
# exactly where the device tries to connect (IP:port) and whether it gets a
# reply. Shows up in the add-on log prefixed [tcpdump].
if [ "${DNS_LOGGING}" = "true" ] && command -v tcpdump >/dev/null 2>&1; then
  log "dns_logging on: capturing TCP SYNs on ${IFACE} ([tcpdump] lines)..."
  tcpdump -i "${IFACE}" -n -l 'tcp[tcpflags] & tcp-syn != 0' 2>/dev/null \
    | awk '{ print "[tcpdump] " $0; fflush(); }' >&2 &
  TCPDUMP_PID=$!
fi

log "Hotspot running. Waiting on services..."
WATCH=0
while true; do
  [ -n "${DNSMASQ_PID}" ] && ! kill -0 "${DNSMASQ_PID}" 2>/dev/null && { log "dnsmasq exited."; break; }
  [ -n "${HOSTAPD_PID}" ] && ! kill -0 "${HOSTAPD_PID}" 2>/dev/null && { log "hostapd exited."; break; }
  # Every ~20s, make sure the host didn't rebuild nftables out from under us and
  # drop our masquerade/redirect (clients stay associated but lose internet, so
  # GGS controllers get stuck retrying NTP and never reach the cloud). Re-assert
  # them so it self-heals without an add-on/HA reload. (v0.8.2)
  WATCH=$((WATCH + 1))
  if [ "${WATCH}" -ge 4 ]; then WATCH=0; reassert_nft_if_missing; fi
  sleep 5
done
