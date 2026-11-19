"""Card translations: every text the card passes to loc("…") has an entry in every
translation table under card-src/src/translations/, with the same {placeholders};
texts that reach loc() through a variable are covered too, and loc() output is
never used as data (option values, comparisons, service calls, saved settings)."""
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


def _call_args(src: str, i: int) -> tuple:
    """(top-level argument texts, index of the closing ")") of the call whose "(" is
    at src[i - 1]. Tracks brackets and quotes like _loc_keys."""
    depth, quote, start, args, j = 1, None, i, [], i
    while j < len(src):
        c = src[j]
        if quote:
            if c == "\\":
                j += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c in "([{":
            depth += 1
        elif c in ")]}":
            depth -= 1
            if depth == 0:
                args.append(src[start:j])
                return args, j
        elif c == "," and depth == 1:
            args.append(src[start:j])
            start = j + 1
        j += 1
    return args, j


def _card_src() -> str:
    with open(os.path.join(CARD, "spider-farmer-card.ts"), encoding="utf-8") as fh:
        return fh.read()


def _tables() -> dict:
    tdir = os.path.join(CARD, "translations")
    return {f: _table(os.path.join(tdir, f)) for f in sorted(os.listdir(tdir)) if f.endswith(".ts")}


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


def test_card_never_uses_translated_text_as_data():
    """loc() output is display text only. The S-Station Device Type select had
    <option value=${loc(t.label)}> while apply() compares the English labels, so in
    German the sub-controls never showed and Apply threw half-way (3.20.51)."""
    src = _card_src()
    line = lambda pos: src.count("\n", 0, pos) + 1
    bad = []
    # bound as an element value: value=${loc(…)}, .value=${loc(…)}, value="${loc(…)}"
    bad += [(line(m.start()), "value") for m in re.finditer(r'\bvalue="?\$\{\s*loc\(', src)]
    # compared with something
    bad += [(line(m.start()), "compared") for m in re.finditer(r"(?:===|!==|==|!=)\s*loc\(", src)]
    for m in re.finditer(r"\bloc\(", src):
        _, end = _call_args(src, m.end())
        if re.match(r"\s*(?:===|!==|==|!=)", src[end + 1:]):
            bad.append((line(m.start()), "compared"))
    # sent to Home Assistant or persisted
    for fn in ("callService", "sendMessagePromise", "persistColorOption", "_persistOpt",
               "persistBlob", "setItem", "_setCfg"):
        for m in re.finditer(r"\b" + fn + r"\(", src):
            args, _ = _call_args(src, m.end())
            if any(re.search(r"\bloc\(", a) for a in args):
                bad.append((line(m.start()), fn))
    # stored in the PPFD card's saved settings (this.s is persisted as a blob)
    bad += [(line(m.start()), "saved setting") for m in re.finditer(r"\bthis\.s\.\w+\s*=\s*loc\(", src)]
    assert not bad, f"loc() output used as data at (line, use): {sorted(set(bad))}"


_STR = r'"((?:[^"\\\n]|\\.)*)"'


def _definition(src: str, head: str) -> str:
    """Value of `const NAME … = {…}` / `[…]` (bracket-matched), or the body of
    `function NAME(…) {…}` (up to its closing brace at column 0)."""
    at = src.find(head + (":" if head.startswith("const ") else "("))
    if at < 0:
        at = src.find(head + " =")
    if at < 0:
        return ""
    if head.startswith("function "):
        return src[at:src.index("\n}", at)]
    eq = src.index("=", at)
    i = min(x for x in (src.find("{", eq), src.find("[", eq)) if x >= 0)
    _, end = _call_args(src, i + 1)
    return src[i:end + 1]


def _uncompared(expr: str) -> str:
    """The expression without the string literals it only compares against."""
    e = re.sub(r"(?:===|!==|==|!=)\s*" + _STR, " ", expr)
    return re.sub(_STR + r"\s*(?:===|!==|==|!=)", " ", e)


def _branches(expr: str) -> set:
    """String literals an expression can evaluate to (ternary / || branches)."""
    return {_js_string(m.group(1), '"') for m in re.finditer(_STR, _uncompared(expr))}


def _only_literals(expr: str) -> bool:
    """True if every value the expression can take is a string literal: each one
    stands where a result goes (start, after ? : || ??, before : or the end), and
    there are no template literals."""
    e = _uncompared(expr).strip()
    lits = list(re.finditer(_STR, e))
    if not lits or "`" in e:
        return False
    for m in lits:
        before, after = e[:m.start()].rstrip(), e[m.end():].lstrip()
        if not (before == "" or before.endswith(("?", ":", "||", "??"))):
            return False
        if not (after == "" or after.startswith(":")):
            return False
    return True


# Label tables whose texts reach loc() through a variable — loc(t.label),
# loc(PLACE_LABEL[m]), loc(cap(r)) … — as (definition, how to read the shown text).
_LABEL_TABLES = {
    "const ST_DEVICE_TYPES": (r'label:\s*' + _STR, None),
    "const ST_BLOWER_MODE": (r'(?m)^\s*' + _STR + r":", None),            # keys are shown
    "const PLACE_LABEL": (r":\s*" + _STR, None),
    "const AI_DEVICE_LABEL": (r":\s*" + _STR, None),
    "const AI_METRIC_META": (r"label:\s*" + _STR, None),
    "const AI_OUTLET_ROLES": (_STR, lambda v: v[:1].upper() + v[1:]),      # loc(cap(r))
    "const RUN_MODE_LABELS": (r":\s*" + _STR, None),
    "const PPFD_SERIES": (r",\s*" + _STR + r"\s*\]", None),
    "function ppfdZone": (r"label:\s*" + _STR, None),
}


def _dynamic_loc_values(src: str) -> dict:
    """Every text that reaches a loc(<variable>) call, by source: the label tables
    above, `const x = c ? "a" : "b"` variables passed to loc(x), and literal
    arguments for a label parameter of a (uniquely named) method that does
    loc(<parameter>), e.g. this.infoRow("…", v)."""
    found = {}
    for head, (pattern, shown) in _LABEL_TABLES.items():
        block = _definition(src, head)
        assert block, f"label table {head!r} not found — update _LABEL_TABLES"
        vals = {_js_string(m.group(1), '"') for m in re.finditer(pattern, block)}
        assert vals, f"no texts read from {head!r} — update _LABEL_TABLES"
        found[head] = {shown(v) if shown else v for v in vals}
    for m in re.finditer(r"\bloc\(\s*(\w+)\s*[,)]", src):
        defs = list(re.finditer(r"\bconst\s+" + m.group(1) + r"\s*=\s*", src[:m.start()]))
        if defs:
            expr = src[defs[-1].end():src.index(";", defs[-1].end())]
            if _only_literals(expr):
                found.setdefault(f"const {m.group(1)}", set()).update(_branches(expr))
    for m in re.finditer(r"\n  (?:private |protected |public )?(\w+)\(([^()]*)\)\s*(?::\s*[^{;]+)?\{", src):
        name = m.group(1)
        if len(re.findall(r"\n  (?:private |protected |public )?" + name + r"\(", src)) != 1:
            continue                                   # overloaded name: can't tell the calls apart
        body = src[m.end():src.find("\n  }", m.end())]
        params = [p.group(1) for p in (re.match(r"\s*(\w+)", x) for x in m.group(2).split(",")) if p]
        for k, param in enumerate(params):
            if not re.search(r"\bloc\(\s*" + param + r"\s*[,)]", body):
                continue
            for cm in re.finditer(r"\bthis\." + name + r"\(", src):
                args, _ = _call_args(src, cm.end())
                if len(args) > k and _only_literals(args[k]):
                    found.setdefault(f"{name}({param})", set()).update(_branches(args[k]))
    return found


def test_card_dynamic_loc_texts_have_translations():
    """Texts that reach loc() through a variable are invisible to the literal scan
    above — "range" (tile target line when colouring by alarm limits) was missing."""
    found = _dynamic_loc_values(_card_src())
    assert sum(len(v) for v in found.values()) > 80
    for name, table in _tables().items():
        missing = {src: sorted(v for v in vals if v not in table) for src, vals in found.items()}
        missing = {k: v for k, v in missing.items() if v}
        assert not missing, f"{name} is missing texts reached through loc(<variable>): {missing}"
