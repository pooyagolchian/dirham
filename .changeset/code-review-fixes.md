---
"dirham": minor
---

**Fixes from a code review: money rounding, `<dirham-input>`, `dirham/next`, accessibility and more** — each bug fix has a regression test, and most were reproduced first (in jsdom, or against the built package) before being changed.

**Behavior changes to know about**

- **`parseDirham` is stricter.** It now requires the text to be purely an amount. `"12abc"` (was `12`), `"AED 100 USD 5"` (was `100`), `"1.2.3"` and `"1e3"` throw. `"1.234,50"` without a locale throws instead of returning `1.2345`. A new `locale` option reads the locale's own separators: `parseDirham("\u{20C3}\u{A0}1.234,50", { locale: "de-DE" })` is `1234.5`. Negative Arabic and Swedish amounts now round-trip through `formatDirham`.
- **VAT and conversion round exactly.** `Math.round(x * 100) / 100` was one fils low for 26 of every 20,000 two-decimal amounts (`getVAT(0.7)` was `0.03`, `addVAT(4.3)` was `4.51`). Results now round half away from zero, so refunds mirror invoices, and never return `-0`.
- **`rate` is validated.** A zero, negative, `NaN` or `Infinity` `rate` option in `convertFromAED` / `convertToAED` now throws a `RangeError` instead of returning `0`, a negated amount, `NaN` or `Infinity`. The `rate` docs said "AED per 1 unit of target"; the maths and every example use units of target per 1 AED, so the docs were corrected, not the code.
- **`formatDirham`** no longer prints `-0.00` for tiny negatives, and detects Arabic by language subtag (`arn-CL` is no longer treated as Arabic; `AR-ae` is).
- **`dirham/og`'s `DirhamPriceCard` moves to `dirham/og/react`.** The README documented `import { DirhamPriceCard } from "dirham/og"`, which has never worked: the entry only exported `generatePriceCardSVG`. The card is now in a separate entry so `dirham/og` stays free of React.

**Fixes**

- **`<dirham-input>` now works.** No event listener was ever attached, so there was no masking, no clamping and no `dirham-change`. It also reset to its `value` attribute on every blur and wiped the field on a rejected keystroke. `dirham-change` fires on blur when the value changed.
- **`<dirham-symbol>` escapes its attributes.** `color`, `size` and `aria-label` went into `innerHTML` unescaped.
- **`dirham/next` builds in a real Next.js app.** The font path pointed at `dist/dist/fonts/...`, and the bundle turned `const dirhamFont` into `var`, which Next rejects ("Font loader calls must be assigned to a const"). `dirhamFontConfig` cannot work with `localFont()` (Next requires literals) and is deprecated; the README shows the working pattern.
- **`<DirhamInput>`** no longer shows a stale value after the parent resets `value` to `undefined`, and ignores paste when `readOnly` or `disabled`.
- **Animated price (React and Web Component):** an interrupted count continues from the number on screen (it jumped from 50 to 110); changing `duration` or `easing` mid-count no longer freezes it; `duration="-5"` no longer loops forever. The digits are hidden from screen readers and the final amount is announced once instead of every frame, and `prefers-reduced-motion` is respected. The Web Component no longer rebuilds its SVG every frame, stops when removed, and shows its initial amount at once.
- **React Native `<DirhamPrice>`** no longer crashes on a `NaN` or infinite amount.
- **CLI:** `npx dirham copy constructor` printed `function Object() { [native code] }`; unknown formats now print an error and exit 1, and `--help` lists every format.
- **OG SVG:** `width`, `height` and `borderRadius` are coerced to numbers, so a query-string value can no longer inject markup.

**Maintenance:** the SVG path lives in one module (the web-component entry is 7.5 KB smaller, 33.5 KB to 26.0 KB; the core entry grows by 0.9 KB and the React entry by 0.6 KB for the new rounding, parsing and input logic), and the typing, paste and number-formatting logic shared by the React and Web Component inputs and price components is no longer copy-pasted. The READMEs and `llms.txt` are updated to match.
