<!--
Thanks for contributing! Please fill this out so the change is easy to review.
For security issues, do NOT open a PR — follow SECURITY.md to report privately.
-->

## Summary

<!-- What does this change do, and why? -->

Closes #<!-- issue number, if any -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor / chore (no user-facing change)
- [ ] CI / build

## Component

- [ ] Integration (`custom_components/sf/`)
- [ ] Dashboard card (`card-src/`)
- [ ] Hotspot add-on (`spider_farmer_hotspot/`)
- [ ] Docs / CI only

## How was this tested?

<!-- e.g. "pytest tests/ passes", HA version tested against, manual steps on the card -->

## Checklist

- [ ] `pytest tests/` passes locally
- [ ] Version bumped **and** `CHANGELOG.md` updated (for user-facing changes)
- [ ] Card rebuilt (`npm run build`) if the card source changed
- [ ] No device/account identifiers (MACs, IPs, hostnames, UIDs, tokens, emails) in code, logs, or screenshots
- [ ] Follows the style of the surrounding code
