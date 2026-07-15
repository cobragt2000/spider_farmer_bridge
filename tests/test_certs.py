

def test_upstream_ca_bundled_and_distinct():
    """The cloud CA is bundled (public cert, no key) and is NOT our
    generated device-facing CA — verifying upstream against our own CA was
    the 3.4.1 outage."""
    from cryptography import x509
    from custom_components.sf.cert_manager import upstream_ca_path
    import os

    p = upstream_ca_path()
    assert os.path.isfile(p)
    data = open(p, "rb").read()
    assert b"PRIVATE KEY" not in data          # public cert only
    ca = x509.load_pem_x509_certificate(data)
    # It's the cloud's private CA (self-signed C=CN, O=MZ), not ours
    org = ca.subject.get_attributes_for_oid(
        x509.oid.NameOID.ORGANIZATION_NAME
    )[0].value
    assert org != "Spider Farmer Bridge"
