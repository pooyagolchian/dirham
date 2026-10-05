---
"dirham": patch
---

**SSR-safe Web Components and Unicode 18.0 docs** — `dirham/web-component` can now be imported during server-side rendering, and the docs reflect the Unicode 18.0 release.

- **Web Components:** importing `dirham/web-component` in Node no longer throws `HTMLElement is not defined`. Where `HTMLElement` and `customElements` don't exist, the import registers nothing.
- **JSDoc:** examples in the type definitions write the sign as `\u{20C3}` or `&#x20C3;` instead of a look-alike character (U+09C3 BENGALI VOWEL SIGN VOCALIC R), and show the exact strings `formatDirham` returns, including the no-break space. `DIRHAM_SYMBOL_TEXT` is now described as the Arabic abbreviation د.إ, not the sign.
- **README and llms.txt:** updated for Unicode 18.0 (released 16 September 2026) with corrected `formatDirham` and `copyDirhamAmount` outputs, a quick reference, a dated Unicode status table with sources, usage rules and an FAQ. The README shows the sign as an image, so it no longer appears as an empty box on npm and GitHub.
- **Package metadata:** new description and keywords, `repository.directory`, and the LICENSE file now ships in the package.
