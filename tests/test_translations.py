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
        "block_cloud",
        "keep_offline_entities", "environment_entities", "preserve_on_remove",
        "diagnostic_log_path", "diagnostic_log_days",
        "diagnostic_log_per_boot",
    }
    missing = expected - set(labels)
    assert not missing, f"Settings options missing labels: {missing}"
    # labels must be human text, not the raw key
    for k, v in labels.items():
        assert v and v != k and len(v) > 3, f"weak label for {k}: {v!r}"


def _flatten(node, prefix=""):
    """{dotted.key: text} for every string leaf of a translation file."""
    if isinstance(node, dict):
        out = {}
        for k, v in node.items():
            out.update(_flatten(v, f"{prefix}{k}."))
        return out
    return {prefix[:-1]: node}


def test_translations_match_english():
    """Every translation carries exactly the English keys, with the same
    {placeholders}, so no form shows a raw key or a broken placeholder."""
    import re

    tdir = os.path.join(os.path.dirname(__file__), "..",
                        "custom_components", "sf", "translations")
    with open(os.path.join(tdir, "en.json"), encoding="utf-8") as fh:
        en = _flatten(json.load(fh))
    others = sorted(f for f in os.listdir(tdir)
                    if f.endswith(".json") and f != "en.json")
    assert others, "expected at least one translation besides en.json"
    for name in others:
        with open(os.path.join(tdir, name), encoding="utf-8") as fh:
            tr = _flatten(json.load(fh))
        assert set(tr) == set(en), (
            f"{name}: missing {sorted(set(en) - set(tr))}, "
            f"extra {sorted(set(tr) - set(en))}")
        for key, text in en.items():
            assert tr[key].strip(), f"{name}: empty text for {key}"
            assert (sorted(re.findall(r"\{\w+\}", tr[key]))
                    == sorted(re.findall(r"\{\w+\}", text))), (
                f"{name}: placeholders differ for {key}")
