"""Every Settings option must have a friendly label (not show the raw key)."""
import json
import os


def test_settings_options_all_labeled():
    base = os.path.join(os.path.dirname(__file__), "..",
                        "custom_components", "sf")
    tr = json.load(open(os.path.join(base, "translations", "en.json")))
    labels = tr["options"]["step"]["settings"]["data"]
    expected = {
        "listen_port", "upstream_host", "upstream_port", "allow_control",
        "keep_offline_entities", "environment_entities", "preserve_on_remove",
        "diagnostic_log", "diagnostic_log_path", "diagnostic_log_days",
        "diagnostic_log_per_boot",
    }
    missing = expected - set(labels)
    assert not missing, f"Settings options missing labels: {missing}"
    # labels must be human text, not the raw key
    for k, v in labels.items():
        assert v and v != k and len(v) > 3, f"weak label for {k}: {v!r}"
