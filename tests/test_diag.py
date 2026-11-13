"""Tests for the dedicated diagnostic log."""
import json
import time

import pytest

from custom_components.sf.diag import SfDiag


def test_retention_sweeps_old_perboot_files(tmp_path):
    """Retention deletes diagnostic files older than N days across ALL per-boot
    files + dated backups — not just the current handler's own backups."""
    import os
    d = tmp_path
    active = d / "diagnostic-3.19.113-20260804-120000.log"
    old_boot = d / "diagnostic-3.19.100-20260601-120000.log"
    old_dated = d / "diagnostic-3.19.100-20260601-120000.log.2026-06-01"
    recent = d / "diagnostic-3.19.112-20260803-120000.log"
    for f in (active, old_boot, old_dated, recent):
        f.write_text("x")
    old = time.time() - 40 * 86400
    os.utime(old_boot, (old, old))
    os.utime(old_dated, (old, old))
    rec = time.time() - 2 * 86400
    os.utime(recent, (rec, rec))

    SfDiag._sweep_old_logs(str(active), 30)

    assert active.exists()          # the file we're about to write — kept
    assert recent.exists()          # within 30 days — kept
    assert not old_boot.exists()    # >30 days — deleted
    assert not old_dated.exists()   # >30 days dated backup — deleted


def test_consumed_blocks_not_flagged_novel(tmp_path):
    """Fields/blocks the integration consumes downstream (under renamed entities)
    must NOT be flagged NOVEL — that log line was misleading. A genuinely unknown
    field still fires."""
    diag = SfDiag()
    log = str(tmp_path / "diag.log")
    diag.setup(log, days=5)
    frame = {
        "method": "getDevSta",
        "data": {
            "sensor": {"temp": 24.5, "tempSoil": 20.0, "humiSoil": 55,
                       "ECSoil": 1.2, "humiSoilAlarm": 0, "reallyNewField": 1},
            "light": {"mOnOff": 1, "ppfdMinBrightness": 11, "ppfdMaxBrightness": 100},
            "blower": {"mOnOff": 1, "closeCO2": 0, "cycleTime": {"openDur": 10}},
            "sensors": [{"id": "AA01", "tempSoil": 20, "type": 2,
                         "mst_fw_ver": 4, "ECSoilAlarm": 0}],
            "outlet": {"O1": {"mOnOff": 1, "tempAdd": 1, "humiAdd": 1,
                              "co2Add": 1, "addWater": {"time": 60},
                              "timePeriod": [], "cycleTime": {}}},
            "target": {"dayTime": {"startTime": 18000, "endTime": 82800},
                       "temp": {"targetDay": 26, "targetNight": 22, "deadband": 1}},
            "calibration": {"temp": 0, "humi": 5, "co2": 0, "ppfd": 0},
            "alarm": {"temp": {"enabled": 0, "vmin": 20, "vmax": 27}},
            "configFile": {"light": {"modeType": 1}, "outlet": {}},
            "senConfig": [{"id": "AA01", "label": "Mother Plant"}],
        },
    }
    diag.frame("4e01", "4e01", "4e01", "getDevSta", frame)
    diag.shutdown()
    content = _read(log)

    for token in ("unknown top-level block 'target'",
                  "unknown top-level block 'calibration'",
                  "unknown top-level block 'alarm'",
                  "unknown top-level block 'configFile'",
                  "unknown top-level block 'senConfig'",
                  "light.ppfdMinBrightness", "light.ppfdMaxBrightness",
                  "blower.closeCO2", "blower.cycleTime",
                  "sensor.tempSoil", "sensor.humiSoilAlarm",
                  "_soil.type", "_soil.mst_fw_ver", "_soil.ECSoilAlarm",
                  "_outlet.tempAdd", "_outlet.addWater", "_outlet.cycleTime",
                  "target.", "configFile."):
        assert token not in content, f"should NOT be flagged NOVEL: {token}"
    # A genuinely unknown field still fires — the detector isn't just muted.
    assert content.count("NOVEL   [4e01] sensor.reallyNewField") == 1


def _read(path):
    deadline = time.time() + 2
    while time.time() < deadline:
        try:
            with open(path) as f:
                content = f.read()
            if content:
                return content
        except FileNotFoundError:
            pass
        time.sleep(0.05)
    return ""


def test_diag_capture_and_novel_fields(tmp_path):
    diag = SfDiag()
    log = str(tmp_path / "sub" / "diag.log")
    diag.setup(log, days=5)
    assert diag.enabled
    # Daily rotation configured with the requested retention
    handler = diag._listener.handlers[0]
    assert handler.when.upper() == "MIDNIGHT"
    assert handler.backupCount == 5

    frame = {
        "method": "getDevSta",
        "data": {
            "sensor": {"temp": 24.5, "humi": 61.0, "brandNewField": 42},
            "fan": {"mOnOff": 1, "mLevel": 7},
            "mysteryBlock": {"foo": 1},
        },
    }
    diag.frame("4e01", "4e01", "4e01", "getDevSta", frame)
    diag.frame("4e01", "4e01", "4e01", "getDevSta", frame)  # dedupe check
    diag.app_command("4e01", ["device", "fan"], {"keyPath": ["device", "fan"], "fan": {"shakeLevel": 5}})
    diag.inject("4e01", {"method": "setConfigField", "params": {"light": {"mLevel": 50}}})
    diag.session("4e01", "CONNECT", "peer=x")
    try:
        raise ValueError("boom")
    except ValueError as exc:
        diag.error("4e01", "frame processing failed", exc)

    diag.shutdown()
    content = _read(log)

    assert "FRAME   [4e01]" in content
    assert "CAPTURE [4e01] getDevSta" in content
    # Novel detection: unknown field and unknown block, each flagged ONCE
    assert content.count("NOVEL   [4e01] sensor.brandNewField") == 1
    assert content.count("unknown top-level block 'mysteryBlock'") == 1
    # Known fields not flagged
    assert "sensor.temp" not in content.split("NOVEL")[1] if "NOVEL" in content else True
    assert "APPCMD  [4e01]" in content and "shakeLevel" in content
    assert "INJECT  [4e01]" in content
    assert "SESSION [4e01] CONNECT" in content
    assert "ValueError: boom" in content   # traceback captured

    # Structure-change capture: same signature logged full only once
    assert content.count("CAPTURE [4e01] getDevSta") == 1

    # Disabled → hooks are no-ops (no exception, no file growth)
    diag.frame("4e01", "", "", "getDevSta", frame)


def test_diag_disabled_is_noop(tmp_path):
    diag = SfDiag()
    assert not diag.enabled
    # None of these may raise when disabled
    diag.frame("x", "", "", "getDevSta", {"data": {}})
    diag.app_command("x", [], {})
    diag.inject("x", {})
    diag.session("x", "CONNECT")
    diag.error("x", "nope")
    diag.bus_event("nothing")
    diag.shutdown()


def test_diag_days_clamped(tmp_path):
    diag = SfDiag()
    diag.setup(str(tmp_path / "d.log"), days=99)
    assert diag._listener.handlers[0].backupCount == 30
    diag.shutdown()
    diag.setup(str(tmp_path / "d.log"), days=0)
    assert diag._listener.handlers[0].backupCount == 1
    diag.shutdown()


def test_diag_creates_nested_log_dir(tmp_path):
    diag = SfDiag()
    log = str(tmp_path / "sf" / "logs" / "diagnostic.log")
    diag.setup(log, days=7)
    diag.session("x", "CONNECT")
    diag.shutdown()
    import os
    assert os.path.isfile(log)


def test_down_command_logs_every_method(tmp_path):
    """v3.10.1: any cloud→device method is captured, not just setConfigField."""
    log = str(tmp_path / "d.log")
    diag = SfDiag()
    diag.setup(log, days=7)
    diag.down_command("aabbccddeeff", "setDevSta", {"method": "setDevSta", "params": {"brightness": 40}})
    diag.shutdown()   # flush the queue listener before reading
    content = _read(log)
    assert "DOWNCMD [aabbccddeeff] method=setDevSta" in content
    assert '"brightness": 40' in content or '"brightness":40' in content


def test_se_frames_capture_on_value_change(tmp_path):
    """Flat SE frames: same keys, different brightness → both captured."""
    log = str(tmp_path / "d.log")
    diag = SfDiag()
    diag.setup(log, days=7)
    base = {"mode": 0, "brightness": 0, "pwm": 0, "lightModel": 3,
            "lastOnBrightness": 0, "lastManualBrightness": 0}
    diag.frame("aabbccddeeff", "aabbccddeeff", "AABBCCDDEEFF", "getDevSta", {"data": dict(base)})
    diag.frame("aabbccddeeff", "aabbccddeeff", "AABBCCDDEEFF", "getDevSta",
               {"data": {**base, "brightness": 55, "pwm": 55}})
    # identical repeat → not captured a third time
    diag.frame("aabbccddeeff", "aabbccddeeff", "AABBCCDDEEFF", "getDevSta",
               {"data": {**base, "brightness": 55, "pwm": 55}})
    diag.shutdown()   # flush the queue listener before reading
    content = _read(log)
    assert content.count("CAPTURE [aabbccddeeff] getDevSta") == 2
    assert '"brightness": 55' in content or '"brightness":55' in content
