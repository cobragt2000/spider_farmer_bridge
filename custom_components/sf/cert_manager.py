"""
cert_manager.py — Spider Farmer Bridge

The bundled certificates are REQUIRED, not regenerable: the CA that signs
server.pem is baked into the GGS devices' trust store. The devices only
complete the TLS handshake with the proxy because they already trust this
specific CA. Generating a fresh CA would produce a server cert the devices
reject — breaking every device connection. So these ship with the
integration and are used as-is.
"""
from __future__ import annotations

import logging
import os

_LOGGER = logging.getLogger(__name__)

_BUNDLE_DIR = os.path.join(os.path.dirname(__file__), "certs")
# .pem extensions (v3.6.1): identical PEM content, renamed because
# Windows' attachment manager flags .crt/.key files extracted from
# downloaded zips as potentially harmful, scaring users at install.
CERT_FILES = ("server.pem", "server_key.pem", "ca.pem")


def ensure_certs(config_dir: str) -> str:
    """Return the bundled certs directory. These must match what the devices
    trust, so they are used as shipped — never regenerated."""
    for f in CERT_FILES:
        path = os.path.join(_BUNDLE_DIR, f)
        if not os.path.isfile(path):
            raise FileNotFoundError(
                f"Bundled certificate missing from integration package: {path}\n"
                "Re-install the integration to restore bundled certs."
            )
    _LOGGER.debug("Spider Farmer Bridge: using bundled certs from %s", _BUNDLE_DIR)
    return _BUNDLE_DIR


def cert_paths(cert_dir: str) -> tuple[str, str, str]:
    """Return (server_cert, server_key, ca_cert) absolute paths.
    ca.pem here is OUR generated device-facing CA. The upstream (cloud) CA
    is separate — see upstream_ca_path()."""
    return (
        os.path.join(cert_dir, "server.pem"),
        os.path.join(cert_dir, "server_key.pem"),
        os.path.join(cert_dir, "ca.pem"),
    )


def upstream_ca_path() -> str:
    """Path to the bundled Spider Farmer cloud CA (public cert, no key).
    The cloud uses a private CA; we verify the upstream leg against it."""
    return os.path.join(os.path.dirname(__file__), "upstream_ca", "upstream_ca.pem")
