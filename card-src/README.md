# Spider Farmer Card — source & build

Source and build setup for `../custom_components/sf/cards/spider-farmer-card.js`,
the single Lovelace bundle that defines every Spider Farmer Bridge card and its
editor (Spider Farmer card, SE light card, time-lapse card, PPFD 3D card).

The shipped `cards/spider-farmer-card.js` is a minified build of
`src/spider-farmer-card.ts` — it is **reproducible** from this directory.

## Rebuild

```sh
cd card-src
npm install          # installs the pinned versions from package-lock.json
npm run build        # -> dist/spider-farmer-card.js
```

Then install the result into the integration and bump the version marker:

```sh
cp dist/spider-farmer-card.js ../custom_components/sf/cards/spider-farmer-card.js
# set the "version" in ../custom_components/sf/cards/card-version.json to match
# the "version" in package.json
```

A clean `npm install && npm run build` from the committed `package-lock.json`
produces a **byte-identical** `spider-farmer-card.js`.

## Layout

- `src/spider-farmer-card.ts` — the card source (Lit + TypeScript, single file).
- `rollup.config.js` — bundler (rollup + @rollup/plugin-typescript + terser, ES output).
- `package.json` / `package-lock.json` — dependencies and pinned versions.
- `tsconfig.json` — TypeScript compiler options.

## Notes

- three.js (r128) used by the PPFD 3D card is **not** bundled into this file; it is
  shipped separately at `../custom_components/sf/cards/three.min.js` and loaded
  locally from the integration's own route (no CDN).
- `__CARD_VERSION__` in the source is replaced at build time with the `package.json`
  version.
- All dependencies here are **build-time only** — nothing from `node_modules` is
  bundled into `spider-farmer-card.js` except the app's own code plus Lit. The
  `overrides` entry pins `serialize-javascript` to a patched version to clear a
  build-tool advisory; it does not affect the output (the bundle is unchanged).
