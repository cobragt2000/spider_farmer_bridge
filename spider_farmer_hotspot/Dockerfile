ARG BUILD_FROM
FROM ${BUILD_FROM}

# hostapd            - AP backend when NetworkManager isn't in play
# dnsmasq            - DHCP for hotspot clients + the local DNS override
# networkmanager-cli - nmcli, the AP backend that coexists with HAOS's NM
# iw / iproute2 / wireless-tools - bring the radio up and into AP mode
# jq                 - read /data/options.json
RUN apk add --no-cache \
    hostapd \
    dnsmasq \
    networkmanager-cli \
    iw \
    rfkill \
    iproute2 \
    wireless-tools \
    jq

COPY run.sh /run.sh
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
