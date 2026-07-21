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

ADDON_VERSION="0.5.4"
OPTIONS=/data/options.json
NM_CON="SF-Bridge-Hotspot"
DNSMASQ_PID=""
HOSTAPD_PID=""
STATUS_PID=""
PORT_RULE_ADDED=""
INET_RULES_ADDED=""
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
DNS_TARGET=$(get '.dns_target')
COUNTRY=$(get '.country_code')
UNMANAGE=$(get '.unmanage_via_nmcli')
SECURITY=$(get '.security')
DNS_LOGGING=$(get '.dns_logging')
PROXY_PORT=$(get '.proxy_port')
[ -z "${PROXY_PORT}" ] || [ "${PROXY_PORT}" = "null" ] && PROXY_PORT=8883
INTERNET_ACCESS=$(get '.internet_access')

# Prefer the nft-backed iptables: HAOS processes nftables, so rules added with
# the legacy backend land in a table the kernel never evaluates (they "succeed"
# but match 0 packets). iptables-nft writes to the ruleset the kernel uses.
IPT=iptables
command -v iptables-nft >/dev/null 2>&1 && IPT=iptables-nft
log "using iptables backend: ${IPT}"

if [ -z "${DNS_TARGET}" ] || [ "${DNS_TARGET}" = "null" ]; then
  DNS_TARGET="${HOTSPOT_IP}"
fi

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

  # dump the full regulatory state and the actual 2.4GHz channel flags so a
  # disabled/no-IR channel is visible in the log
  log "regulatory state:"
  iw reg get 2>/dev/null | sed 's/^/    /' >&2
  if [ -n "${phy}" ]; then
    log "2.4GHz channels on phy${phy} (look for 'disabled' / 'no IR'):"
    iw phy "phy${phy}" info 2>/dev/null \
      | awk '/Frequencies:/{f=1} /valid interface combinations|Supported commands|Band 2:/{f=0} f && /2[0-9][0-9][0-9] MHz/' \
      | sed 's/^/    /' >&2
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
log-dhcp
log-facility=-
DNSM
# Optional: log every DNS query (noisy) to see the controller's cloud lookups.
if [ "${DNS_LOGGING}" = "true" ]; then
  echo "log-queries" >> "${DNSMASQ_CONF}"
fi

# --- cleanup on exit -----------------------------------------------------
cleanup() {
  log "Shutting down hotspot..."
  [ -n "${DNSMASQ_PID}" ] && kill "${DNSMASQ_PID}" 2>/dev/null || true
  [ -n "${STATUS_PID}" ] && kill "${STATUS_PID}" 2>/dev/null || true
  [ -n "${PORT_RULE_ADDED}" ] && "${IPT}" -t nat -D PREROUTING -i "${IFACE}" \
    -p tcp --dport 8883 -j REDIRECT --to-ports "${PROXY_PORT}" 2>/dev/null || true
  if [ -n "${INET_RULES_ADDED}" ]; then
    "${IPT}" -t nat -D POSTROUTING -s "${PREFIX}.0/24" ! -o "${IFACE}" -j MASQUERADE 2>/dev/null || true
    "${IPT}" -D FORWARD -i "${IFACE}" -s "${PREFIX}.0/24" -j ACCEPT 2>/dev/null || true
    "${IPT}" -D FORWARD -d "${PREFIX}.0/24" -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT 2>/dev/null || true
  fi
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
  echo 1 > /proc/sys/net/ipv4/ip_forward 2>/dev/null || \
    sysctl -w net.ipv4.ip_forward=1 >/dev/null 2>&1 || true
  if command -v "${IPT}" >/dev/null 2>&1 \
     && "${IPT}" -t nat -A POSTROUTING -s "${PREFIX}.0/24" ! -o "${IFACE}" -j MASQUERADE 2>/dev/null \
     && "${IPT}" -A FORWARD -i "${IFACE}" -s "${PREFIX}.0/24" -j ACCEPT 2>/dev/null \
     && "${IPT}" -A FORWARD -d "${PREFIX}.0/24" -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT 2>/dev/null; then
    INET_RULES_ADDED=1
    log "internet access: NAT ${PREFIX}.0/24 -> uplink enabled."
  else
    log "WARNING: could not enable internet NAT for the hotspot. Devices that need"
    log "internet before connecting to the cloud may stay offline."
  fi
fi

# Devices always dial the cloud on tcp/8883. If the integration's proxy listens
# on a different port (proxy_port), redirect the hotspot's inbound 8883 to it so
# the device actually reaches the proxy. (Was handled by the router in the NAT
# method; the host does it here.)
if [ "${PROXY_PORT}" != "8883" ]; then
  if command -v "${IPT}" >/dev/null 2>&1 && "${IPT}" -t nat -A PREROUTING \
        -i "${IFACE}" -p tcp --dport 8883 -j REDIRECT --to-ports "${PROXY_PORT}" 2>/dev/null; then
    PORT_RULE_ADDED=1
    log "port redirect: ${IFACE} tcp/8883 -> local :${PROXY_PORT}"
  else
    log "WARNING: could not add the 8883 -> ${PROXY_PORT} redirect. Devices expect"
    log ":8883; without it they can't reach a proxy on :${PROXY_PORT}."
  fi
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

log "Hotspot running. Waiting on services..."
while true; do
  [ -n "${DNSMASQ_PID}" ] && ! kill -0 "${DNSMASQ_PID}" 2>/dev/null && { log "dnsmasq exited."; break; }
  [ -n "${HOSTAPD_PID}" ] && ! kill -0 "${HOSTAPD_PID}" 2>/dev/null && { log "hostapd exited."; break; }
  sleep 5
done
