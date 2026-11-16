// Card translations. The English text is the key: loc("Save") returns the text
// from the table for the user's Home Assistant language, or the English text
// itself when there is no table or no entry. Placeholders: loc("{n} slots", { n }).
// (Named loc, not t: the card uses t as a local variable in many places.)
//
// Adding a language: copy translations/de.ts to translations/<code>.ts,
// translate the values, add one import + one TABLES entry below, rebuild.
// tests/test_card_i18n.py checks that every table covers every loc("…") key.
import de from "./translations/de";

const TABLES: Record<string, Record<string, string>> = { de };

let table: Record<string, string> | undefined;
let current = "";

/** Follow the user's HA language (profile setting, else the server language). */
export function setLanguage(hass: any): void {
  const lang = String(hass?.locale?.language || hass?.language || "en").toLowerCase();
  if (lang === current) return;
  current = lang;
  table = TABLES[lang] || TABLES[lang.split("-")[0]];
}

/** Translate an English UI text; unknown texts pass through unchanged. */
export function loc(text: string, vars?: Record<string, string | number>): string {
  let out = (table && table[text]) || text;
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return out;
}
