# Contributing to Spider Farmer Bridge

Thanks for your interest in improving **Spider Farmer Bridge**! This integration
is a community project, and contributions — bug reports, fixes, features, docs —
are very welcome.

If you just have a question or an idea to discuss, the quickest places are the
[Discord](https://discord.gg/YZCcdwXTCp) and the
[GitHub Discussions](https://github.com/cobragt2000/spider_farmer_bridge/discussions).

## Ways to contribute

- **Report a bug** — open an issue using the **Bug report** template. Please
  include your Home Assistant version, the integration version, and the relevant
  log lines (with identifiers redacted — see *Privacy* below).
- **Request a feature** — open an issue using the **Feature request** template.
- **Report a security vulnerability** — please **do not** open a public issue.
  Follow [`SECURITY.md`](SECURITY.md) and report it privately via GitHub's
  security advisory flow.
- **Send a pull request** — see below.

## Repository layout

This repo ships three things:

| Path | What it is |
|------|------------|
| `custom_components/sf/` | The Home Assistant integration (this is what Marketplace/HACS installs). |
| `spider-farmer-card/` | The Lovelace dashboard card (TypeScript/Lit, built with rollup). The built bundle lives at `custom_components/sf/cards/spider-farmer-card.js`. |
| `spider_farmer_hotspot/` | The optional Wi-Fi hotspot add-on (a Home Assistant add-on). |

## Development setup

The integration runs inside Home Assistant, so it targets whatever Python the
current HA release uses. Create a virtual environment and install the test
dependencies:

```bash
python -m pip install --upgrade pip
pip install homeassistant pytest pytest-asyncio pytest-homeassistant-custom-component
```

Run the test suite from the repository root:

```bash
pytest tests/ -q
```

Every push and pull request also runs the **Validate** workflow
(`.github/workflows/validate.yml`): the pytest suite, HACS validation, and
hassfest. A PR needs these green before it can be merged.

### Building the card

If your change touches the dashboard card, edit the TypeScript source under
`spider-farmer-card/src/`, then build and include the rebuilt bundle:

```bash
cd spider-farmer-card
npm install
npm run build
```

## Coding guidelines

- **Match the surrounding code.** Follow the style, structure, and naming already
  used in the file you're editing rather than introducing a new pattern.
- **Keep changes focused.** One logical change per pull request makes review
  (and reverting, if needed) much easier.
- **Bump the version and update the changelog in the same change.** For
  user-facing changes, bump the relevant version — `custom_components/sf/manifest.json`
  (integration), `spider-farmer-card/package.json` (card), or
  `spider_farmer_hotspot/config.yaml` (add-on) — and add a matching entry to the
  relevant `CHANGELOG.md`.
- **Add or update tests** for behavior changes where practical.

## Privacy — no identifiers in the repo

This is important. Anything committed here is public, so **never include
device- or account-specific identifiers** in code, test data, screenshots,
logs, or docs:

- MAC addresses, device serials, product IDs
- IP addresses (local or public) and hostnames
- account IDs, login/UID values, tokens, or emails

Screenshots are the usual offender — black-box any MAC/IP columns and account
IDs before committing an image.

## Pull request process

1. Fork the repo and create a branch from `main` for your change.
2. Make your change, keeping commits tidy.
3. Make sure `pytest tests/` passes locally, and (for card changes) that the
   bundle is rebuilt.
4. Open a pull request and fill in the template. Link any related issue.
5. Wait for the **Validate** checks to pass; address review feedback.

When your change is based on someone else's bug report, please credit them in
the commit or PR description (`Reported-by: <name>`); if you're incorporating
someone else's code, add them as a co-author.

## Translations

Everything users see can be translated; English is the reference.

- **Integration** (`custom_components/sf/translations/`): copy `en.json` to
  `<language>.json` (e.g. `fr.json`) and translate the values; keep the keys and the
  `{placeholders}`. Entity names come from the `entity` section. A new entity name in
  `entity_defs.py` needs an `en.json` entry — `tests/test_i18n.py` names the key and
  the English text to add.
- **Cards** (`card-src/src/translations/`): copy `de.ts` to `<language>.ts`, translate
  the values (the keys are the English texts), add the import + table entry in
  `card-src/src/i18n.ts`, rebuild. Wrap new card texts in `loc("…")` (placeholders:
  `loc("{n} stages", { n })`); `tests/test_card_i18n.py` checks every table covers
  every `loc("…")` text.

## License

By contributing, you agree that your contributions will be licensed under the
same license as this project (see [`LICENSE.md`](LICENSE.md)).
