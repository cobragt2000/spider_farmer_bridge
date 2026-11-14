"""Card translations: every text the card passes to loc("…") has an entry in every
translation table under card-src/src/translations/, with the same {placeholders}."""
import json
import os
import re

CARD = os.path.join(os.path.dirname(__file__), "..", "card-src", "src")


def _js_string(raw: str, quote: str) -> str:
    """Decode the body of a JS "…" or '…' literal."""
    if quote == "'":
        raw = re.sub(r'(?<!\\)"', '\\"', raw.replace("\\'", "'"))
    return json.loads('"' + raw + '"')


def _loc_keys(src: str) -> set:
    """String literals inside the first argument of every loc(…) call, including
    both branches of a ?: inside it. Scans with bracket and quote tracking, so
    nested parentheses and template literals don't confuse it."""
    keys = set()
    for m in re.finditer(r"\bloc\(", src):
        i, depth, arg_end, quote, start = m.end(), 1, None, None, 0
        literals = []
        while i < len(src) and depth:
            c = src[i]
            if quote:
                if c == "\\":
                    i += 2
                    continue
                if c == quote:
                    if quote != "`":
                        literals.append((start, _js_string(src[start + 1:i], quote)))
                    quote = None
            elif c in "\"'`":
                quote, start = c, i
            elif c in "([{":
                depth += 1
            elif c in ")]}":
                depth -= 1
            elif c == "," and depth == 1 and arg_end is None:
                arg_end = i
            i += 1
        end = arg_end if arg_end is not None else i
        keys |= {text for pos, text in literals if pos < end}
    return keys


def _table(path: str) -> dict:
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    return json.loads(text[text.index("{"):text.rindex("}") + 1])


def test_card_translation_tables_cover_every_text():
    with open(os.path.join(CARD, "spider-farmer-card.ts"), encoding="utf-8") as fh:
        src = fh.read()
    keys = _loc_keys(src)
    assert len(keys) > 400
    tdir = os.path.join(CARD, "translations")
    tables = sorted(f for f in os.listdir(tdir) if f.endswith(".ts"))
    assert tables, "no card translation tables"
    ph = lambda s: sorted(re.findall(r"\{(\w+)\}", s))
    for name in tables:
        table = _table(os.path.join(tdir, name))
        missing = sorted(k for k in keys if k not in table)
        assert not missing, f"{name} is missing {len(missing)} texts: {missing[:20]}"
        for k, v in table.items():
            assert v.strip(), f"{name}: empty text for {k!r}"
            assert ph(k) == ph(v), f"{name}: placeholders differ for {k!r}"


def test_card_overlay_words_match_burned_frames():
    """The live overlay (card) and the burned frames (timelapse.py) use the same words."""
    from custom_components.sf import timelapse as tl
    tdir = os.path.join(CARD, "translations")
    for name in sorted(f for f in os.listdir(tdir) if f.endswith(".ts")):
        lang = name[:-3]
        table = _table(os.path.join(tdir, name))
        assert table.get("RH", "RH") == tl._overlay_label("humidity", lang), name
        assert table.get("Temp", "Temp") == tl._overlay_label("temp", lang), name
        assert table.get("Day {n}", "Day {n}") == tl._overlay_label("day", lang), name
