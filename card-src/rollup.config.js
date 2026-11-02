import { readFileSync } from "fs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

export default {
  input: "src/spider-farmer-card.ts",
  output: {
    file: "dist/spider-farmer-card.js",
    format: "es",
    inlineDynamicImports: true,
    banner: `/*! spider-farmer-card v${pkg.version} | MIT */`,
  },
  plugins: [
    replace({ preventAssignment: true, values: { __CARD_VERSION__: pkg.version } }),
    resolve(),
    typescript(),
    terser(),
  ],
};
