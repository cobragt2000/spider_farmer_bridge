"""The bundled-blueprint installer never overwrites an edited copy and writes atomically."""

from __future__ import annotations

import hashlib
import logging
import os

import pytest

from custom_components.sf import blueprints_install as bi

DST = ("blueprints", "automation", "spider_farmer", "grow_alerts.yaml")
NOTE = os.path.join(*DST)


def _version(n: str) -> str:
    return ("blueprint:\n  name: Spider Farmer - Grow Alerts\n"
            "  source_url: https://github.com/cobragt2000/spider_farmer_bridge/blob/main/"
            f"custom_components/sf/blueprints/grow_alerts.yaml\n# version {n}\n")


@pytest.fixture(autouse=True)
def _fresh_module_state():
    getattr(bi, "_ANNOUNCED", set()).clear()
    yield
    getattr(bi, "_ANNOUNCED", set()).clear()


@pytest.fixture
def dirs(tmp_path):
    integration = tmp_path / "custom_components" / "sf"
    (integration / "blueprints").mkdir(parents=True)
    config = tmp_path / "config"
    config.mkdir()

    def ship(text: str) -> list[str]:
        """Ship `text` as the bundled blueprint and run the installer."""
        (integration / "blueprints" / "grow_alerts.yaml").write_text(text, encoding="utf-8")
        return bi.install_bundled_blueprints(str(integration), str(config))

    return ship, config / os.path.join(*DST)


def _leftovers(dst) -> list[str]:
    return [n for n in os.listdir(dst.parent) if n.endswith(".tmp")]


def test_edited_copy_is_never_overwritten(dirs, caplog):
    ship, dst = dirs
    caplog.set_level(logging.INFO, logger=bi.__name__)
    assert ship(_version("1")) == [f"installed {NOTE}"]
    assert ship(_version("1")) == []                          # restart, nothing changed
    assert ship(_version("2")) == [f"updated {NOTE}"]         # untouched copy follows the release
    dst.write_text(_version("2") + "# my edit\n", encoding="utf-8")
    assert ship(_version("2")) == []                          # restart: the edit survives
    assert not [r for r in caplog.records if "left as is" in r.getMessage()]
    assert ship(_version("3")) == []                          # new release: still kept, and said so
    assert dst.read_text(encoding="utf-8").endswith("# my edit\n")
    kept = [r for r in caplog.records if "left as is" in r.getMessage()]
    assert len(kept) == 1 and kept[0].levelno == logging.INFO
    ship(_version("3"))                                       # told once per release
    bi._ANNOUNCED.clear()                                     # also across restarts (kept in the record)
    ship(_version("3"))
    assert len([r for r in caplog.records if "left as is" in r.getMessage()]) == 1
    dst.unlink()                                              # delete it to get the bundled one again
    assert ship(_version("3")) == [f"installed {NOTE}"]
    assert dst.read_text(encoding="utf-8") == _version("3")


def test_corrupt_record_never_leads_to_overwriting(dirs):
    ship, dst = dirs
    ship(_version("1"))
    dst.write_text(_version("1") + "# my edit\n", encoding="utf-8")
    (dst.parent / ".installed.json").write_text("{not json", encoding="utf-8")
    assert ship(_version("2")) == []
    assert dst.read_text(encoding="utf-8").endswith("# my edit\n")


def test_copies_from_before_the_record_existed(dirs, monkeypatch):
    """3.20.50/51 kept no record: an unedited copy of a shipped version is still
    updated, an edited one is kept."""
    ship, dst = dirs
    legacy = _version("3.20.51")
    monkeypatch.setattr(bi, "_SHIPPED_SHA256",
                        frozenset({hashlib.sha256(legacy.encode()).hexdigest()}), raising=False)
    dst.parent.mkdir(parents=True)
    dst.write_text(legacy, encoding="utf-8")
    assert ship(_version("new")) == [f"updated {NOTE}"]
    (dst.parent / ".installed.json").unlink(missing_ok=True)
    dst.write_text(legacy + "# my edit\n", encoding="utf-8")
    assert ship(_version("newer")) == []
    assert dst.read_text(encoding="utf-8").endswith("# my edit\n")


def test_known_shipped_versions_are_listed():
    assert "800487a765b6a8f2f5c71d1a8ba3517013d5d55140f8f2a6fdc7979fcd45ee85" in bi._SHIPPED_SHA256  # 3.20.51


def test_update_is_atomic_and_never_raises(dirs, monkeypatch):
    ship, dst = dirs
    ship(_version("1"))
    inode = dst.stat().st_ino
    assert ship(_version("2")) == [f"updated {NOTE}"]
    assert dst.stat().st_ino != inode                         # replaced, not rewritten in place
    assert _leftovers(dst) == []

    def boom(*_args, **_kwargs):
        raise OSError("disk full")

    monkeypatch.setattr(os, "replace", boom)
    assert ship(_version("3")) == []                          # no exception
    assert dst.read_text(encoding="utf-8") == _version("2")   # old copy intact
    assert _leftovers(dst) == []
