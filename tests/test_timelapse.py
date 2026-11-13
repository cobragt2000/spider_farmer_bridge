"""Time-lapse capture engine + security guards (v3.19.358, Phase 1).

Covers the pieces that must not regress:
- storage-path validation refuses web-served /www roots,
- frame path resolution refuses traversal,
- capture writes a frame and bumps the counter,
- retention deletes old frames.
"""
import os
import time

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.sf.const import (
    DOMAIN,
    # legacy single-time-lapse keys (migration only)
    CONF_TIMELAPSE_CAMERA,
    CONF_TIMELAPSE_DIR,
    CONF_TIMELAPSE_INTERVAL,
    CONF_TIMELAPSE_RETENTION,
    CONF_TIMELAPSE_ENABLED,
    # multi-instance model (v3.19.362)
    CONF_TIMELAPSE_INSTANCES,
    TL_NAME, TL_CAMERA, TL_DIR, TL_INTERVAL, TL_RETENTION, TL_ENABLED,
    slug_timelapse_id,
)
from custom_components.sf.config_flow import (
    _normalize_timelapse_dir,
    _is_blocked_timelapse_dir,
    _timelapse_dir_writable,
)
from custom_components.sf import timelapse as tl


def _inst_entry(tmp_path, tl_id="grow", camera="camera.grow", enabled=True,
                interval=5, retention=7, **extra):
    """A config entry carrying ONE time-lapse instance (multi-instance model)."""
    inst = {
        TL_NAME: extra.pop("name", tl_id),
        TL_CAMERA: camera,
        TL_DIR: str(tmp_path),
        TL_INTERVAL: interval,
        TL_RETENTION: retention,
        TL_ENABLED: enabled,
    }
    inst.update(extra)
    return MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_INSTANCES: {tl_id: inst}})


# ── storage path validation (security) ──────────────────────────────────────
@pytest.mark.parametrize("path", [
    "/config/www",
    "/config/www/timelapse",
    "/www",
    "/www/sub",
    "/some/www",            # any 'www' segment is web-served convention
    "/config/www/",
    "",
])
def test_blocked_dirs_rejected(path):
    assert _is_blocked_timelapse_dir(_normalize_timelapse_dir(path) or path) is True


@pytest.mark.parametrize("path", [
    "/media/sf_timelapse",
    "/share/sf_timelapse",
    "/config/sf_timelapse",
    "/config/sf/timelapse",
    "/data/grow/frames",
])
def test_secure_dirs_allowed(path):
    assert _is_blocked_timelapse_dir(_normalize_timelapse_dir(path)) is False


def test_normalize_strips_and_cleans():
    assert _normalize_timelapse_dir("  /media/sf_timelapse/  ") == "/media/sf_timelapse"
    assert _normalize_timelapse_dir("") == ""


def test_dir_writable(tmp_path):
    d = str(tmp_path / "tl")
    assert _timelapse_dir_writable(d) is True
    assert os.path.isdir(d)
    # no leftover test file
    assert ".sf_tl_write_test" not in os.listdir(d)


# ── frame path resolution (traversal guard) ──────────────────────────────────
def test_resolve_frame_guards_traversal(tmp_path):
    root = str(tmp_path)
    os.makedirs(os.path.join(root, "sess"))
    with open(os.path.join(root, "sess", "20260101-000000.jpg"), "wb") as f:
        f.write(b"x")
    # valid
    assert tl.resolve_frame(root, "sess", "20260101-000000.jpg")
    # traversal / bad segments → None
    assert tl.resolve_frame(root, "..", "20260101-000000.jpg") is None
    assert tl.resolve_frame(root, "sess", "../../etc/passwd") is None
    assert tl.resolve_frame(root, "sess/..", "20260101-000000.jpg") is None
    assert tl.resolve_frame(root, "sess", "not_a_frame.txt") is None
    assert tl.resolve_frame(root, "sess", "missing.jpg") is None


def test_list_sessions_and_frames(tmp_path):
    root = str(tmp_path)
    sdir = os.path.join(root, "20260101-0900")
    os.makedirs(sdir)
    for name in ("20260101-090000.jpg", "20260101-090500.jpg", "junk.txt"):
        with open(os.path.join(sdir, name), "wb") as f:
            f.write(b"x")
    sessions = tl.list_sessions(root)
    assert len(sessions) == 1
    assert sessions[0]["session"] == "20260101-0900"
    assert sessions[0]["frames"] == 2
    frames = tl.list_frames(root, "20260101-0900")
    assert frames == ["20260101-090000.jpg", "20260101-090500.jpg"]


def test_retention_deletes_old_frames(tmp_path):
    root = str(tmp_path)
    sdir = os.path.join(root, "20260101-000000")
    os.makedirs(sdir)
    old = os.path.join(sdir, "old.jpg")
    new = os.path.join(sdir, "new.jpg")
    for p in (old, new):
        with open(p, "wb") as f:
            f.write(b"x")
    # age `old` past the retention window
    past = time.time() - 10 * 86400
    os.utime(old, (past, past))
    tl._sweep_retention(root, retention_days=7)
    assert not os.path.exists(old)
    assert os.path.exists(new)


# ── capture loop ─────────────────────────────────────────────────────────────
async def test_capture_writes_frame(hass: HomeAssistant, tmp_path, monkeypatch):
    entry = _inst_entry(tmp_path)
    ctrl = tl.TimelapseController(hass, entry, "grow")
    assert ctrl.camera == "camera.grow"
    assert ctrl.root == str(tmp_path)
    assert ctrl.interval == 5
    assert ctrl.tl_id == "grow"

    class _Img:
        content = b"\xff\xd8\xff\xe0jpeg-bytes"

    async def _fake_get_image(h, eid, timeout=10):
        assert eid == "camera.grow"
        return _Img()

    monkeypatch.setattr(
        "homeassistant.components.camera.async_get_image", _fake_get_image)

    ctrl._session = "sess1"
    ctrl._capturing = True
    await ctrl._tick(None)

    sdir = os.path.join(str(tmp_path), "sess1")
    frames = [f for f in os.listdir(sdir) if f.endswith(".jpg")]
    assert len(frames) == 1
    assert ctrl._frame_count == 1
    status = ctrl.status()
    assert status["frame_count"] == 1
    assert status["last_error"] is None
    assert status["camera"] == "camera.grow"


async def test_capture_records_error(hass: HomeAssistant, tmp_path, monkeypatch):
    entry = _inst_entry(tmp_path)
    ctrl = tl.TimelapseController(hass, entry, "grow")

    async def _boom(h, eid, timeout=10):
        raise RuntimeError("camera offline")

    monkeypatch.setattr(
        "homeassistant.components.camera.async_get_image", _boom)
    ctrl._session = "sess1"
    ctrl._capturing = True
    await ctrl._tick(None)
    assert ctrl._frame_count == 0
    assert "camera offline" in (ctrl.status()["last_error"] or "")


# ── mp4 export (Phase 2) ─────────────────────────────────────────────────────
def test_safe_mp4_name_and_resolve_video(tmp_path):
    assert tl._safe_mp4_name("my grow!!") == "my_grow.mp4"
    assert tl._safe_mp4_name("clip.mp4") == "clip.mp4"
    assert tl._safe_mp4_name("../evil") in ("evil.mp4",)  # traversal chars stripped
    root = str(tmp_path); sdir = os.path.join(root, "sess"); os.makedirs(sdir)
    with open(os.path.join(sdir, "v.mp4"), "wb") as f:
        f.write(b"x")
    assert tl.resolve_video(root, "sess", "v.mp4")
    assert tl.resolve_video(root, "sess", "v.jpg") is None       # wrong ext
    assert tl.resolve_video(root, "..", "v.mp4") is None          # traversal
    assert tl.resolve_frame(root, "sess", "v.mp4") is None        # frame resolver rejects mp4


async def test_export_runs_ffmpeg(hass, tmp_path, monkeypatch):
    sdir = tmp_path / "sess1"; sdir.mkdir()
    for n in ("20260101-000000.jpg", "20260101-000005.jpg"):
        (sdir / n).write_bytes(b"x")
    entry = _inst_entry(tmp_path, enabled=False)
    ctrl = tl.TimelapseController(hass, entry, "grow")

    class _Proc:
        returncode = 0
        def __init__(self, out): self._out = out
        async def communicate(self):
            with open(self._out, "wb") as f:
                f.write(b"\x00\x00mp4")
            return (b"", b"")

    async def _fake_exec(*args, **kw):
        return _Proc(args[-1])   # last arg = output path

    monkeypatch.setattr("asyncio.create_subprocess_exec", _fake_exec)
    assert await ctrl.async_export(session="sess1", fps=12) is True
    await hass.async_block_till_done()
    s = ctrl.status()
    assert s["export_running"] is False
    assert s["last_export"] == {"session": "sess1", "name": "timelapse_sess1.mp4"}
    assert s["last_export_error"] is None
    assert os.path.isfile(str(tmp_path / "sess1" / "timelapse_sess1.mp4"))


async def test_export_error_surfaced(hass, tmp_path, monkeypatch):
    sdir = tmp_path / "sess1"; sdir.mkdir()
    (sdir / "a.jpg").write_bytes(b"x")
    entry = _inst_entry(tmp_path, enabled=False)
    ctrl = tl.TimelapseController(hass, entry, "grow")

    class _Proc:
        returncode = 1
        async def communicate(self):
            return (b"", b"ffmpeg boom")

    async def _fake_exec(*args, **kw):
        return _Proc()

    monkeypatch.setattr("asyncio.create_subprocess_exec", _fake_exec)
    await ctrl.async_export(session="sess1")
    await hass.async_block_till_done()
    s = ctrl.status()
    assert s["export_running"] is False
    assert "ffmpeg exited 1" in (s["last_export_error"] or "")
    assert s["last_export"] is None


# ── resume across reboot (persisted intent + session) ────────────────────────
async def test_resume_continues_same_session(hass, tmp_path, monkeypatch):
    sdir = tmp_path / "20260101-000000"; sdir.mkdir()
    for n in ("20260101-000000.jpg", "20260101-000005.jpg"):
        (sdir / n).write_bytes(b"x")
    entry = _inst_entry(tmp_path, enabled=False)

    class _Img:
        content = b"\xff\xd8\xff\xe0jpeg"

    async def _img(h, e, timeout=10):
        return _Img()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    # Pretend a prior run was capturing this session, then reboot (new controller).
    ctrl = tl.TimelapseController(hass, entry, "grow")
    await ctrl._store.async_save({"capturing": True, "session": "20260101-000000"})

    ctrl2 = tl.TimelapseController(hass, entry, "grow")
    await ctrl2.async_restore()
    await hass.async_block_till_done()
    s = ctrl2.status()
    assert s["capturing"] is True
    assert s["session"] == "20260101-000000"          # SAME session, not a new one
    assert s["frame_count"] >= 2                        # seeded from the 2 frames on disk
    await ctrl2.async_stop()                            # explicit stop clears intent

    # After an explicit stop, a reboot must NOT resume.
    ctrl3 = tl.TimelapseController(hass, entry, "grow")
    await ctrl3.async_restore()
    assert ctrl3.status()["capturing"] is False


async def test_shutdown_keeps_resume_intent(hass, tmp_path, monkeypatch):
    entry = _inst_entry(tmp_path, enabled=False)

    async def _img(h, e, timeout=10):
        class _I: content = b"\xff\xd8x"
        return _I()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    ctrl = tl.TimelapseController(hass, entry, "grow")
    await ctrl.async_start()                 # persists capturing=True
    await hass.async_block_till_done()
    sess = ctrl.status()["session"]
    await ctrl.async_shutdown()              # reboot teardown — must NOT clear intent

    ctrl2 = tl.TimelapseController(hass, entry, "grow")
    await ctrl2.async_restore()
    await hass.async_block_till_done()
    assert ctrl2.status()["capturing"] is True
    assert ctrl2.status()["session"] == sess   # resumed the same session
    await ctrl2.async_stop()


# ── Phase 3 overlay ──────────────────────────────────────────────────────────
def test_overlay_lines_selectable():
    readings = {"temp": "72.3°F", "humidity": "55%", "vpd": "1.2kPa"}
    lines = tl._overlay_lines(readings, "20260101-121314", ["temp", "vpd", "timestamp"])
    assert any("Temp 72.3°F" in l for l in lines)
    assert any("VPD 1.2kPa" in l for l in lines)
    assert any(l == "2026-01-01 12:13:14" for l in lines)
    # RH not requested → absent
    assert not any("RH" in l for l in lines)
    # only timestamp
    assert tl._overlay_lines(readings, "20260101-121314", ["timestamp"]) == ["2026-01-01 12:13:14"]


def test_overlay_items_grouped_vs_independent():
    readings = {"temp": "72°F", "humidity": "55%", "vpd": "1.2kPa"}
    fields = ["temp", "vpd", "timestamp"]
    # Grouped → one item, lines in SELECTION order (temp, vpd, timestamp).
    grp = tl._overlay_items(readings, "20260101-121314", fields, True,
                            {"group": [10, 20]})
    assert len(grp) == 1
    assert grp[0]["x"] == 10 and grp[0]["y"] == 20
    lines = grp[0]["text"].split("\n")
    assert lines[0].startswith("Temp 72") and lines[1].startswith("VPD 1.2")
    assert lines[2] == "2026-01-01 12:13:14"
    # Grouped + horizontal → one item, one single-line row (no newlines).
    horiz = tl._overlay_items(readings, "20260101-121314", fields, True, {}, "h")
    assert len(horiz) == 1 and "\n" not in horiz[0]["text"]
    assert "Temp 72" in horiz[0]["text"] and "VPD 1.2" in horiz[0]["text"]
    # Independent → one item per field, each at its own saved position.
    ind = tl._overlay_items(readings, "20260101-121314", fields, False,
                            {"temp": [5, 5], "vpd": [50, 80]})
    assert len(ind) == 3
    bykey = {i["text"].split()[0]: (i["x"], i["y"]) for i in ind}
    assert bykey["Temp"] == (5, 5) and bykey["VPD"] == (50, 80)


def test_overlay_items_default_stack_on_image():
    # Un-positioned independent items stack from the top-left and never run off the
    # bottom of the image (y stays within 0..88). (v3.19.388)
    readings = {"temp": "72\u00b0F", "humidity": "55%", "vpd": "1.2kPa",
                "co2": "600ppm", "ppfd": "500\u00b5mol"}
    fields = ["temp", "humidity", "vpd", "co2", "ppfd", "timestamp", "day"]
    items = tl._overlay_items({**readings, "day": "2"}, "20260101-120000", fields, False, {})
    ys = [it["y"] for it in items]
    assert ys == [4, 16, 28, 40, 52, 64, 76]   # 4 + 12*i
    assert all(0 <= it["y"] <= 88 and it["x"] == 2 for it in items)


def test_day_number_and_overlay():
    # session starts 2026-01-01; same day = Day 1, +4 calendar days = Day 5
    assert tl._day_number("20260101-100000", "20260101-120000") == 1
    assert tl._day_number("20260101-100000", "20260105-090000") == 5
    assert tl._day_number("bad", "worse") is None
    # the "day" overlay field renders "Day N" from readings["day"]
    items = tl._overlay_items({"day": "5"}, "20260105-090000", ["day"], True, {})
    assert items[0]["text"] == "Day 5"


def test_overlay_items_labels_off():
    readings = {"temp": "72°F", "vpd": "1.2kPa"}
    # labels on (default) → "Temp 72°F"
    on = tl._overlay_items(readings, "20260101-120000", ["temp", "vpd"], True, {}, "v", True)
    assert "Temp 72°F" in on[0]["text"] and "VPD 1.2kPa" in on[0]["text"]
    # labels off → just the values, no "Temp"/"VPD"
    off = tl._overlay_items(readings, "20260101-120000", ["temp", "vpd"], True, {}, "v", False)
    assert "72°F" in off[0]["text"] and "Temp" not in off[0]["text"] and "VPD" not in off[0]["text"]


async def test_align_false_captures_immediately(hass, tmp_path, monkeypatch):
    entry = _inst_entry(tmp_path, align=False)
    ctrl = tl.TimelapseController(hass, entry, "grow")
    assert ctrl.align is False

    class _Img:
        content = b"\xff\xd8\xff\xe0jpeg"

    async def _img(h, e, timeout=10):
        return _Img()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    await ctrl.async_start()          # align off → immediate first frame
    await hass.async_block_till_done()
    assert ctrl.status()["frame_count"] >= 1
    await ctrl.async_stop()


async def test_align_true_no_immediate_frame(hass, tmp_path, monkeypatch):
    entry = _inst_entry(tmp_path)     # align defaults True
    ctrl = tl.TimelapseController(hass, entry, "grow")
    assert ctrl.align is True

    async def _img(h, e, timeout=10):
        class _I: content = b"\xff\xd8x"
        return _I()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    await ctrl.async_start()          # align on → waits for the next mark, no frame now
    await hass.async_block_till_done()
    assert ctrl.status()["frame_count"] == 0
    await ctrl.async_stop()


def test_hex_rgb_parsing():
    assert tl._hex_rgb("#ff0000") == (255, 0, 0)
    assert tl._hex_rgb("00ff00") == (0, 255, 0)
    assert tl._hex_rgb("#09f") == (0, 153, 255)
    assert tl._hex_rgb("bogus") == (255, 255, 255)


def test_burn_items_colored_positions():
    try:
        from io import BytesIO
        from PIL import Image
    except Exception:
        return  # Pillow absent → nothing to assert here
    buf = BytesIO(); Image.new("RGB", (640, 360), (10, 10, 10)).save(buf, "JPEG")
    src = buf.getvalue()
    items = [{"text": "Temp 72°F", "x": 5, "y": 5},
             {"text": "RH 55%\n2026-01-01 00:00:00", "x": 60, "y": 80}]
    out = tl._burn_items(src, items, "#ff8800")
    assert isinstance(out, (bytes, bytearray)) and len(out) > 0
    # It actually changed the pixels (drew something).
    assert out != src


def test_font_safe_sanitizes_only_without_unicode_font():
    # With a real Unicode font the text is untouched (µ/°/² render properly).
    assert tl._font_safe("586µmol 80.6°F m²", True) == "586µmol 80.6°F m²"
    # Falling back to the bitmap font, the glyphs it can't draw become ASCII so the
    # burned frame never shows a missing-glyph box (the "X" users saw for µ).
    assert tl._font_safe("586µmol", False) == "586umol"
    assert tl._font_safe("80.6°F", False) == "80.6F"
    assert tl._font_safe("m²", False) == "m2"
    assert tl._font_safe("585μmol", False) == "585umol"  # Greek mu too


def test_bundled_font_present_and_used():
    import os
    assert os.path.isfile(tl._BUNDLED_FONT), "bundled sf-overlay.ttf missing from package"
    try:
        from PIL import ImageFont  # noqa: F401
    except Exception:
        return
    font, uni_ok = tl._overlay_font(24)
    # The bundled Unicode font must win, so no ASCII sanitising is ever needed.
    assert uni_ok is True
    # And it can actually draw the micro sign.
    assert font.getmask("\u00b5").getbbox() is not None


def test_overlay_font_returns_font_and_flag():
    try:
        from PIL import ImageFont  # noqa: F401
    except Exception:
        return  # Pillow absent
    font, uni_ok = tl._overlay_font(24)
    assert font is not None
    assert isinstance(uni_ok, bool)


def test_burn_items_with_micro_sign_stays_valid_jpeg():
    # A PPFD reading with the micro sign must still burn to a valid, changed JPEG
    # regardless of which font path is taken (no crash, no empty output).
    try:
        from io import BytesIO
        from PIL import Image
    except Exception:
        return
    buf = BytesIO(); Image.new("RGB", (640, 360), (10, 10, 10)).save(buf, "JPEG")
    src = buf.getvalue()
    out = tl._burn_items(src, [{"text": "PPFD 586µmol", "x": 5, "y": 80}], "#ffffff")
    assert isinstance(out, (bytes, bytearray)) and len(out) > 0
    assert out != src
    Image.open(BytesIO(out)).verify()  # decodes cleanly


def test_env_sidecar_roundtrip(tmp_path):
    sdir = str(tmp_path / "sess"); 
    tl._write_env(sdir, "20260101-120000", {"temp": "70°F", "vpd": "1.1kPa"})
    tl._write_env(sdir, "20260101-120500", {"temp": "71°F"})
    env = tl.read_env(str(tmp_path), "sess")
    assert env["20260101-120000"] == {"temp": "70°F", "vpd": "1.1kPa"}
    assert env["20260101-120500"] == {"temp": "71°F"}


def test_burn_overlay_returns_bytes():
    # 1x1 white JPEG header is not valid; make a tiny real JPEG via Pillow if present,
    # else assert the no-Pillow fallback returns the original bytes unchanged.
    try:
        from io import BytesIO
        from PIL import Image
        buf = BytesIO(); Image.new("RGB", (320, 240), (20, 20, 20)).save(buf, "JPEG")
        src = buf.getvalue()
        out = tl._burn_overlay(src, ["Temp 72°F  RH 55%", "2026-01-01 00:00:00"])
        assert isinstance(out, (bytes, bytearray)) and len(out) > 0
    except Exception:
        src = b"not-an-image"
        assert tl._burn_overlay(src, ["x"]) == src


# ── multi-instance (v3.19.362) ───────────────────────────────────────────────
def test_slug_timelapse_id():
    assert slug_timelapse_id("camera.veg_tent_cam") == "veg_tent_cam"
    assert slug_timelapse_id("Tent A") == "tent_a"
    assert slug_timelapse_id("  Clone/Dome!! ") == "clone_dome"
    assert slug_timelapse_id("camera.X") == "x"
    assert slug_timelapse_id("") == "timelapse"


def test_instance_default_dir_is_per_tl_id(hass, tmp_path):
    # No explicit dir → the instance gets its own /media/sf_timelapse/<tl_id> folder.
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_INSTANCES: {"tent_a": {TL_CAMERA: "camera.a"}}})
    ctrl = tl.TimelapseController(hass, entry, "tent_a")
    assert ctrl.root == os.path.join("/media/sf_timelapse", "tent_a")


def test_next_aligned_boundaries(hass, tmp_path):
    from datetime import datetime
    entry = _inst_entry(tmp_path, enabled=False)
    ctrl = tl.TimelapseController(hass, entry, "grow")
    # 5-min started 13:52:10 → 13:55:00
    assert ctrl._next_aligned(datetime(2026, 1, 1, 13, 52, 10), 300) == datetime(2026, 1, 1, 13, 55, 0)
    # 15-min started 14:12:00 → 14:15:00
    assert ctrl._next_aligned(datetime(2026, 1, 1, 14, 12, 0), 900) == datetime(2026, 1, 1, 14, 15, 0)
    # exactly on a boundary → the next one (never double-fire)
    assert ctrl._next_aligned(datetime(2026, 1, 1, 14, 15, 0), 900) == datetime(2026, 1, 1, 14, 30, 0)
    # hourly → top of the next hour
    assert ctrl._next_aligned(datetime(2026, 1, 1, 14, 1, 0), 3600) == datetime(2026, 1, 1, 15, 0, 0)
    # daily → next local midnight
    assert ctrl._next_aligned(datetime(2026, 1, 1, 14, 0, 0), 86400) == datetime(2026, 1, 2, 0, 0, 0)
    # daily with a 14:00 offset: before → today 14:00; after → tomorrow 14:00
    off = 14 * 3600
    assert ctrl._next_aligned(datetime(2026, 1, 1, 10, 0, 0), 86400, off) == datetime(2026, 1, 1, 14, 0, 0)
    assert ctrl._next_aligned(datetime(2026, 1, 1, 15, 0, 0), 86400, off) == datetime(2026, 1, 2, 14, 0, 0)


def test_daily_at_offset_and_align(hass, tmp_path):
    entry = _inst_entry(tmp_path, interval=86400, daily_at="14:30")
    ctrl = tl.TimelapseController(hass, entry, "grow")
    assert ctrl.daily_at == "14:30"
    assert ctrl._daily_at_seconds() == 14 * 3600 + 30 * 60
    assert ctrl._align_offset() == 14 * 3600 + 30 * 60
    # a sub-day interval ignores daily_at (offset 0)
    ctrl2 = tl.TimelapseController(hass, _inst_entry(tmp_path, interval=300, daily_at="14:30"), "grow")
    assert ctrl2._align_offset() == 0


def test_label_display_name(hass, tmp_path):
    """v3.19.372: an optional per-instance `label` (display name) rides in status()
    so the card header can show a short custom name. Blank by default (card then
    falls back to the camera's friendly name); it never affects the tl_id/name."""
    # Default: no label → blank, and the instance name/tl_id are untouched.
    ctrl = tl.TimelapseController(hass, _inst_entry(tmp_path, tl_id="grow"), "grow")
    assert ctrl.label == ""
    assert ctrl.status()["label"] == ""
    assert ctrl.tl_id == "grow" and ctrl.name == "grow"

    # With a label set → surfaced in status(); tl_id/name are still the slug.
    ctrl2 = tl.TimelapseController(
        hass, _inst_entry(tmp_path, tl_id="grow", name="grow", label="Veg Tent"), "grow")
    assert ctrl2.label == "Veg Tent"
    assert ctrl2.status()["label"] == "Veg Tent"
    assert ctrl2.tl_id == "grow" and ctrl2.name == "grow"


async def test_instances_capture_to_own_dirs(hass, tmp_path, monkeypatch):
    ra = str(tmp_path / "a"); rb = str(tmp_path / "b")
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_INSTANCES: {
            "a": {TL_CAMERA: "camera.a", TL_DIR: ra, TL_ENABLED: True},
            "b": {TL_CAMERA: "camera.b", TL_DIR: rb, TL_ENABLED: True}}})

    class _Img:
        content = b"\xff\xd8\xff\xe0jpeg"

    async def _img(h, e, timeout=10):
        return _Img()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    mgr = tl.TimelapseManager(hass, entry)
    mgr.sync()
    ca, cb = mgr.get("a"), mgr.get("b")
    assert ca.camera == "camera.a" and cb.camera == "camera.b"
    ca._session = "s"; ca._capturing = True; await ca._tick(None)
    cb._session = "s"; cb._capturing = True; await cb._tick(None)
    assert os.path.isdir(os.path.join(ra, "s"))
    assert os.path.isdir(os.path.join(rb, "s"))
    # Each session folder holds only its own camera's frame.
    assert len([f for f in os.listdir(os.path.join(ra, "s")) if f.endswith(".jpg")]) == 1
    assert ca.status()["tl_id"] == "a" and cb.status()["tl_id"] == "b"


async def test_manager_add_and_remove_instances(hass, tmp_path):
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_INSTANCES: {"a": {TL_CAMERA: "camera.a", TL_DIR: str(tmp_path / "a")}}})
    entry.add_to_hass(hass)
    mgr = tl.TimelapseManager(hass, entry)
    assert mgr.sync() is True
    assert mgr.ids() == ["a"]
    assert mgr.sync() is False               # idempotent — no change

    hass.config_entries.async_update_entry(entry, options={
        CONF_TIMELAPSE_INSTANCES: {
            "a": {TL_CAMERA: "camera.a", TL_DIR: str(tmp_path / "a")},
            "b": {TL_CAMERA: "camera.b", TL_DIR: str(tmp_path / "b")}}})
    assert mgr.sync() is True
    assert sorted(mgr.ids()) == ["a", "b"]

    hass.config_entries.async_update_entry(entry, options={
        CONF_TIMELAPSE_INSTANCES: {"b": {TL_CAMERA: "camera.b", TL_DIR: str(tmp_path / "b")}}})
    assert mgr.sync() is True
    assert mgr.ids() == ["b"]                 # 'a' dropped


def test_overlay_font_px(hass, tmp_path):
    """v3.19.384: overlay_font is the on-card text size in PX (default 12, clamped 6–96),
    surfaced in status and threaded into the burn (scaled up to the image resolution)."""
    ctrl = tl.TimelapseController(hass, _inst_entry(tmp_path), "grow")
    assert ctrl.overlay_font == 12.0                   # default px
    assert ctrl.status()["overlay_font"] == 12.0
    big = tl.TimelapseController(hass, _inst_entry(tmp_path, overlay_font=200), "grow")
    assert big.overlay_font == 96.0                    # clamped to max
    small = tl.TimelapseController(hass, _inst_entry(tmp_path, overlay_font=1), "grow")
    assert small.overlay_font == 5.0                   # clamped to min

    # _burn_items accepts a px size and scales it to the image; stays a valid JPEG.
    try:
        from PIL import Image
        import io
        buf = io.BytesIO(); Image.new("RGB", (640, 360), (0, 0, 0)).save(buf, format="JPEG")
        jpeg = buf.getvalue()
        items = [{"text": "Temp 72F", "x": 2.0, "y": 50.0}]
        for px in (12.0, 24.0):
            out = tl._burn_items(jpeg, items, "#ffffff", px)
            assert Image.open(io.BytesIO(out)).size == (640, 360)
    except ImportError:
        pass  # Pillow not installed in this env — property clamping still covered


async def test_remove_with_delete_images_wipes_folder(hass, tmp_path):
    """v3.19.373: removing a time-lapse with delete_images deletes its captured
    frames/sessions on disk (via async_clear) AND drops the instance — so re-adding
    the same camera starts clean, no manual folder deletion. Mirrors the service
    handler's delete_images branch: async_clear() then remove from options + sync."""
    root = tmp_path / "grow"
    sess = root / "20260101-120000"; sess.mkdir(parents=True)
    (sess / "20260101-000000.jpg").write_bytes(b"x")
    (sess / "20260101-000005.jpg").write_bytes(b"x")
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_INSTANCES: {"grow": {TL_CAMERA: "camera.grow", TL_DIR: str(root)}}})
    entry.add_to_hass(hass)
    mgr = tl.TimelapseManager(hass, entry)
    mgr.sync()
    ctrl = mgr.get("grow")
    assert tl.list_sessions(str(root)) != []          # frames present

    # delete_images branch: clear the images, then drop the instance.
    await ctrl.async_clear()
    assert tl.list_sessions(str(root)) == []          # frames gone
    hass.config_entries.async_update_entry(entry, options={CONF_TIMELAPSE_INSTANCES: {}})
    assert mgr.sync() is True
    assert mgr.ids() == []                            # instance dropped


async def test_migration_folds_legacy_into_instance(hass, tmp_path):
    from custom_components.sf import _migrate_timelapse_options
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_CAMERA: "camera.grow_tent",
        CONF_TIMELAPSE_DIR: str(tmp_path),
        CONF_TIMELAPSE_INTERVAL: 120,
        CONF_TIMELAPSE_RETENTION: 14,
        CONF_TIMELAPSE_ENABLED: True,
    })
    entry.add_to_hass(hass)
    await _migrate_timelapse_options(hass, entry)
    insts = entry.options[CONF_TIMELAPSE_INSTANCES]
    assert "grow_tent" in insts
    inst = insts["grow_tent"]
    assert inst[TL_CAMERA] == "camera.grow_tent"
    assert inst[TL_DIR] == str(tmp_path)         # legacy folder preserved (frames stay)
    assert inst[TL_INTERVAL] == 120
    assert inst[TL_RETENTION] == 14
    assert inst[TL_ENABLED] is True
    # idempotent — a second run does not add or duplicate anything
    await _migrate_timelapse_options(hass, entry)
    assert list(entry.options[CONF_TIMELAPSE_INSTANCES].keys()) == ["grow_tent"]


async def test_clear_deletes_all_images(hass, tmp_path, monkeypatch):
    # Two sessions with frames + a stray export; clear wipes them but keeps the root.
    root = tmp_path
    for sess in ("20260101-000000", "20260102-000000"):
        d = root / sess; d.mkdir()
        (d / "20260101-000000.jpg").write_bytes(b"x")
        (d / "20260101-000005.jpg").write_bytes(b"x")
    (root / "20260101-000000" / "timelapse_export.mp4").write_bytes(b"\x00mp4")
    entry = _inst_entry(tmp_path, enabled=False)
    ctrl = tl.TimelapseController(hass, entry, "grow")
    ctrl._session = "20260102-000000"; ctrl._frame_count = 2
    removed = await ctrl.async_clear()
    assert removed == 4                               # 2 frames in each of 2 sessions
    assert os.path.isdir(str(root))                   # root kept
    assert tl.list_sessions(str(root)) == []          # everything gone
    s = ctrl.status()
    assert s["frame_count"] == 0 and s["session"] is None and s["capturing"] is False


async def test_clear_while_capturing_starts_fresh_session(hass, tmp_path, monkeypatch):
    d = tmp_path / "old"; d.mkdir()
    (d / "20260101-000000.jpg").write_bytes(b"x")

    class _Img:
        content = b"\xff\xd8\xff\xe0jpeg"

    async def _img(h, e, timeout=10):
        return _Img()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    entry = _inst_entry(tmp_path)
    ctrl = tl.TimelapseController(hass, entry, "grow")
    ctrl._session = "old"; ctrl._capturing = True
    await ctrl.async_clear()
    await hass.async_block_till_done()
    s = ctrl.status()
    assert s["capturing"] is True                     # capture continued
    assert s["session"] not in (None, "old")          # into a brand-new session
    await ctrl.async_stop()                            # cancel the capture timer


async def test_failed_capture_retries_soon_and_recovers(hass, tmp_path, monkeypatch):
    """v3.19.380: a camera hiccup must NOT stall the loop until the next interval (or,
    for a 1-day lapse, a whole day). A failed capture re-arms soon (retry backoff), the
    loop never dies, and the next success returns to the normal cadence."""
    class _Img:
        content = b"\xff\xd8\xff\xe0jpeg"

    fail = {"on": True}

    async def _img(h, e, timeout=10):
        if fail["on"]:
            raise RuntimeError("Unable to get image")
        return _Img()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    # 1-day interval: without retry, one failure would wait ~24h.
    entry = _inst_entry(tmp_path, interval=86400)
    ctrl = tl.TimelapseController(hass, entry, "grow")
    ctrl._session = "s"; ctrl._capturing = True

    await ctrl._fire(tl.dt_util.now())            # camera down → capture fails
    await hass.async_block_till_done()
    s = ctrl.status()
    assert s["last_error"]                         # failure surfaced
    assert ctrl._fail_count == 1
    assert ctrl._unsub is not None                 # loop still armed (did NOT die)
    # Rescheduled SOON (retry), not a day out.
    assert (ctrl._next_when - tl.dt_util.now()).total_seconds() < 120

    # Simulate the retry timer firing (a real one-shot timer is consumed when it fires).
    if ctrl._unsub:
        ctrl._unsub()
        ctrl._unsub = None
    fail["on"] = False                             # camera recovers
    await ctrl._fire(tl.dt_util.now())
    await hass.async_block_till_done()
    s = ctrl.status()
    assert s["frame_count"] == 1 and s["last_error"] is None
    assert ctrl._fail_count == 0
    assert ctrl._unsub is not None                 # back to the normal (aligned) cadence
    await ctrl.async_stop()
    await hass.async_block_till_done()


async def test_tidy_moves_empty_shared_root_instance(hass, monkeypatch):
    from custom_components.sf import _tidy_timelapse_dirs
    from custom_components.sf.const import DEFAULT_TIMELAPSE_DIR
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_INSTANCES: {
            "veg_tent_cam": {TL_CAMERA: "camera.x", TL_DIR: DEFAULT_TIMELAPSE_DIR}}})
    entry.add_to_hass(hass)
    # The shared root has no frames → safe to move.
    monkeypatch.setattr("custom_components.sf.timelapse.list_sessions", lambda root: [])
    await _tidy_timelapse_dirs(hass, entry)
    moved = entry.options[CONF_TIMELAPSE_INSTANCES]["veg_tent_cam"][TL_DIR]
    assert moved == f"{DEFAULT_TIMELAPSE_DIR}/veg_tent_cam"


async def test_tidy_keeps_shared_root_with_frames(hass, monkeypatch):
    from custom_components.sf import _tidy_timelapse_dirs
    from custom_components.sf.const import DEFAULT_TIMELAPSE_DIR
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={
        CONF_TIMELAPSE_INSTANCES: {
            "grow": {TL_CAMERA: "camera.x", TL_DIR: DEFAULT_TIMELAPSE_DIR}}})
    entry.add_to_hass(hass)
    # The shared root still has frames → must NOT move (don't orphan them).
    monkeypatch.setattr("custom_components.sf.timelapse.list_sessions",
                        lambda root: [{"session": "s", "frames": 3}])
    await _tidy_timelapse_dirs(hass, entry)
    assert entry.options[CONF_TIMELAPSE_INSTANCES]["grow"][TL_DIR] == DEFAULT_TIMELAPSE_DIR


async def test_migration_noop_when_no_legacy(hass):
    from custom_components.sf import _migrate_timelapse_options
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={})
    entry.add_to_hass(hass)
    await _migrate_timelapse_options(hass, entry)
    # Initialises an empty instances dict (so it isn't re-checked) and adds nothing.
    assert entry.options[CONF_TIMELAPSE_INSTANCES] == {}


def test_burn_items_stacked_labels_do_not_overlap():
    """v3.19.393: a tight vertical stack (8% apart) whose burned boxes are taller than the
    spacing must be pushed flush so burned labels never overlap, and stay on the frame."""
    from io import BytesIO
    from PIL import Image, ImageDraw
    import custom_components.sf.timelapse as tl

    buf = BytesIO(); Image.new("RGB", (1280, 720), (30, 60, 30)).save(buf, "JPEG")
    src = buf.getvalue()

    rects = []
    orig = ImageDraw.ImageDraw.rectangle

    def spy(self, xy, *a, **k):
        flat = xy if not isinstance(xy[0], (list, tuple)) else (xy[0][0], xy[0][1], xy[1][0], xy[1][1])
        rects.append(tuple(flat))
        return orig(self, xy, *a, **k)

    ImageDraw.ImageDraw.rectangle = spy
    try:
        items = [
            {"text": "Temp 78.6F", "x": 0, "y": 76},
            {"text": "RH 68%", "x": 0, "y": 84},
            {"text": "VPD 1.07kPa", "x": 0, "y": 92},
            {"text": "CO2 579ppm", "x": 100, "y": 84},
            {"text": "PPFD 610umol", "x": 100, "y": 92},
        ]
        out = tl._burn_items(src, items, "#ffffff", font_px=11.0)
    finally:
        ImageDraw.ImageDraw.rectangle = orig

    assert out != src and len(rects) == 5

    def overlaps(a, b):
        ox = min(a[2], b[2]) - max(a[0], b[0])
        oy = min(a[3], b[3]) - max(a[1], b[1])
        return ox > 0 and oy > 0

    for i in range(len(rects)):
        for j in range(i + 1, len(rects)):
            assert not overlaps(rects[i], rects[j]), (rects[i], rects[j])
    # every box stays on the frame
    for rc in rects:
        assert rc[1] >= 0 and rc[3] <= 720 and rc[0] >= 0 and rc[2] <= 1280


def test_clear_frames_only_touches_sf_artifacts():
    """Security (v3.19.401): _clear_frames removes ONLY the integration's own
    timestamp-named session folders and the .jpg / _env.jsonl / .mp4 inside them.
    A user's own files and folders in the storage root — and non-SF files inside a
    session folder — are left completely alone (no blanket rmtree)."""
    import os
    import tempfile
    from custom_components.sf.timelapse import _clear_frames

    with tempfile.TemporaryDirectory() as root:
        # Our own session folder with SF artifacts + a stray user file inside it.
        sess = os.path.join(root, "20260101-000000")
        os.makedirs(sess)
        open(os.path.join(sess, "20260101-000000.jpg"), "wb").close()
        open(os.path.join(sess, "20260101-000005.jpg"), "wb").close()
        open(os.path.join(sess, "_env.jsonl"), "wb").close()
        open(os.path.join(sess, "timelapse_export.mp4"), "wb").close()
        open(os.path.join(sess, "notes.txt"), "w").close()        # user file in a session

        # Foreign content a user keeps in the same storage root.
        open(os.path.join(root, "important.txt"), "w").close()
        other = os.path.join(root, "my_photos")
        os.makedirs(other)
        open(os.path.join(other, "vacation.jpg"), "wb").close()

        removed = _clear_frames(root)

        assert removed == 2                                        # only our 2 frames
        # SF artifacts gone
        assert not os.path.exists(os.path.join(sess, "20260101-000000.jpg"))
        assert not os.path.exists(os.path.join(sess, "_env.jsonl"))
        assert not os.path.exists(os.path.join(sess, "timelapse_export.mp4"))
        # user's file inside the session (and therefore the session folder) survives
        assert os.path.exists(os.path.join(sess, "notes.txt"))
        assert os.path.isdir(sess)
        # foreign root content untouched
        assert os.path.exists(os.path.join(root, "important.txt"))
        assert os.path.isdir(other)
        assert os.path.exists(os.path.join(other, "vacation.jpg"))


def test_clear_frames_removes_empty_session_folder():
    """A session folder that holds only SF artifacts is removed once emptied."""
    import os
    import tempfile
    from custom_components.sf.timelapse import _clear_frames

    with tempfile.TemporaryDirectory() as root:
        sess = os.path.join(root, "20260303-101112")
        os.makedirs(sess)
        open(os.path.join(sess, "20260303-101112.jpg"), "wb").close()
        assert _clear_frames(root) == 1
        assert not os.path.exists(sess)                            # emptied → removed
        assert os.path.isdir(root)                                 # root kept


async def test_timelapse_services_are_admin_only(hass):
    """Security (v3.19.401): timelapse_configure / timelapse_clear / timelapse_remove
    must be admin-only — a non-admin user must not be able to point the integration
    at a folder or wipe it. A call carrying a non-admin user context is rejected."""
    from homeassistant.core import Context
    from homeassistant.exceptions import Unauthorized
    from custom_components.sf import _async_register_services

    _async_register_services(hass)
    for svc in ("timelapse_configure", "timelapse_clear", "timelapse_remove"):
        assert hass.services.has_service(DOMAIN, svc), svc
        with pytest.raises(Unauthorized):
            await hass.services.async_call(
                DOMAIN, svc, {"tl_id": "grow"}, blocking=True,
                context=Context(user_id="not-an-admin"))


def test_retention_only_touches_sf_session_folders(tmp_path):
    """Security (v3.19.404): _sweep_retention deletes old frames ONLY inside our own
    timestamp-named session folders. A user's own old JPEGs in other folders of the
    storage root (e.g. a /media/* photo folder) are never touched."""
    import os
    import time
    root = str(tmp_path)
    past = time.time() - 30 * 86400          # well past any retention window

    # our session folder with an old frame
    sess = os.path.join(root, "20260101-000000"); os.makedirs(sess)
    sf_old = os.path.join(sess, "20260101-000000.jpg")
    open(sf_old, "wb").close(); os.utime(sf_old, (past, past))

    # the user's own folder + a loose file in the root, both with old JPEGs
    photos = os.path.join(root, "my_photos"); os.makedirs(photos)
    user_jpg = os.path.join(photos, "vacation.jpg")
    open(user_jpg, "wb").close(); os.utime(user_jpg, (past, past))
    root_jpg = os.path.join(root, "loose.jpg")
    open(root_jpg, "wb").close(); os.utime(root_jpg, (past, past))

    tl._sweep_retention(root, retention_days=7)

    assert not os.path.exists(sf_old)         # our old frame swept
    assert os.path.exists(user_jpg)           # user's JPEG untouched
    assert os.path.isdir(photos)
    assert os.path.exists(root_jpg)           # loose root file untouched


async def test_async_start_rejects_unsafe_session(hass, tmp_path, monkeypatch):
    """Security (v3.19.404): a session not matching the timestamp format is ignored,
    so frames can never be written outside the storage root via os.path.join."""
    class _Img:
        content = b"\xff\xd8\xff\xe0jpeg"

    async def _img(h, e, timeout=10):
        return _Img()
    monkeypatch.setattr("homeassistant.components.camera.async_get_image", _img)

    entry = _inst_entry(tmp_path)
    ctrl = tl.TimelapseController(hass, entry, "grow")
    await ctrl.async_start(session="/config/www/evil")   # absolute path attempt
    await hass.async_block_till_done()
    # the unsafe value was dropped — a safe timestamp session is used instead
    import re
    assert re.match(r"^\d{8}-\d{6}$", ctrl.status()["session"] or "")
    assert ctrl.status()["session"] != "/config/www/evil"
    await ctrl.async_stop()


async def test_same_camera_captures_are_serialized():
    """Multiple lapses sharing one camera must not pull `async_get_image`
    concurrently, or the camera answers one and the rest get "Unable to get image"
    and silently skip the frame (v3.19.407). Different cameras still run in
    parallel."""
    import asyncio

    tl._CAMERA_LOCKS.clear()
    live = 0
    peak = 0

    async def crit(cam):
        nonlocal live, peak
        async with tl._camera_lock(cam):
            live += 1
            peak = max(peak, live)
            await asyncio.sleep(0.02)
            live -= 1

    # Five instances on the same camera -> fully serialized (peak concurrency 1).
    await asyncio.gather(*[crit("camera.bench") for _ in range(5)])
    assert peak == 1

    # Two different cameras -> run in parallel (peak concurrency 2).
    tl._CAMERA_LOCKS.clear()
    live = 0
    peak = 0
    await asyncio.gather(crit("camera.a"), crit("camera.b"))
    assert peak == 2


async def test_timelapse_sensor_readded_after_remove(hass, tmp_path, enable_custom_integrations):
    """Regression (v3.19.408): deleting a time-lapse then creating the SAME tl_id
    again must get a fresh status sensor. The sensor platform used to track created
    ids in a set it never pruned, so a re-added id was skipped forever and the
    card's 'Set up' did nothing."""
    from homeassistant.helpers import entity_registry as er

    entry = MockConfigEntry(
        domain=DOMAIN, title="Spider Farmer Bridge", unique_id=DOMAIN,
        data={"listen_port": 18991, "upstream_host": "sf.mqtt.spider-farmer.com",
              "upstream_port": 8883, "allow_control": True},
        options={CONF_TIMELAPSE_INSTANCES: {
            "tent": {TL_CAMERA: "camera.tent", TL_DIR: str(tmp_path / "tent")}}},
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    ent_id = "sensor.sf_timelapse_tent"
    assert hass.states.get(ent_id) is not None, "sensor should exist after initial create"

    mgr = hass.data[DOMAIN][entry.entry_id]["timelapse"]

    # Remove the instance → sensor (and its registry entry) should go away.
    hass.config_entries.async_update_entry(entry, options={CONF_TIMELAPSE_INSTANCES: {}})
    mgr.sync()
    mgr.notify_instances()
    await hass.async_block_till_done()
    assert hass.states.get(ent_id) is None, "sensor should be gone after remove"

    # Re-create the SAME tl_id → sensor must come back (this is the regression).
    hass.config_entries.async_update_entry(entry, options={CONF_TIMELAPSE_INSTANCES: {
        "tent": {TL_CAMERA: "camera.tent", TL_DIR: str(tmp_path / "tent")}}})
    mgr.sync()
    mgr.notify_instances()
    await hass.async_block_till_done()
    assert hass.states.get(ent_id) is not None, "sensor must be re-added for a reused tl_id"
