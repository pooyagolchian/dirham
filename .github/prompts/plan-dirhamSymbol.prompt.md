# Dirham Currency Symbol — NPM Font Package

## References

- <https://commons.wikimedia.org/wiki/File:UAE_Dirham_Symbol.svg> (CC0 Public Domain)
- <https://www.centralbank.ae/media/jlhi41xu/dirham_currency_symbol_guideline_english.pdf>
- <https://vercel.com/solutions/turborepo>

## Overview

Build a Turborepo monorepo that converts the UAE Dirham currency symbol SVG into a web font + React/TypeScript component, published as a single npm package (`dirham-symbol`) with subpath exports. The SVG (CC0 licensed) is processed through `svgtofont` to generate WOFF2/WOFF/TTF font files, CSS stylesheets, and a React component. Uses Unicode Private Use Area codepoint **U+E900** with ligature support.

## Decisions

| Decision          | Choice                                                | Rationale                                                      |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| Package strategy  | Single package (`dirham-symbol`) with subpath exports | More stable, less publishing overhead, proven pattern          |
| Package name      | `dirham-symbol` (unscoped)                            | No npm org needed, simple install                              |
| Package manager   | pnpm                                                  | Fastest, strictest hoisting, recommended for Turborepo         |
| Frameworks        | React + TypeScript                                    | Primary target                                                 |
| Font tool         | svgtofont                                             | Built-in React generation, CSS/SCSS output, active maintenance |
| Unicode codepoint | U+E900 (Private Use Area)                             | Safe range, clear of Apple/vendor reservations                 |
| Font formats      | WOFF2 + WOFF + TTF                                    | Modern browser coverage without legacy bloat                   |
| React approach    | SVG-based primary, font-based secondary               | Better SSR, tree-shaking, no FOIT                              |
| Versioning        | Changesets (@changesets/cli)                          | Standard for Turborepo monorepos                               |

## Monorepo Structure

```
dirham-symbol/
├── turbo.json
├── package.json                    # root workspace config
├── pnpm-workspace.yaml
├── .github/
│   └── workflows/
│       ├── ci.yml                  # build + lint + test on PR
│       └── publish.yml             # npm publish on release
├── apps/
│   └── docs/                       # Next.js demo/playground site
│       └── package.json            # @dirham/docs (private)
├── packages/
│   ├── dirham-symbol/              # The publishable npm package
│   │   ├── src/
│   │   │   ├── svg/
│   │   │   │   └── dirham.svg      # Source SVG (optimized with SVGO)
│   │   │   ├── react/
│   │   │   │   ├── DirhamSymbol.tsx # SVG-based React component
│   │   │   │   ├── DirhamIcon.tsx   # Font-based React component
│   │   │   │   └── index.ts
│   │   │   ├── core/
│   │   │   │   ├── constants.ts    # DIRHAM_UNICODE, DIRHAM_CURRENCY_CODE, etc.
│   │   │   │   ├── format.ts       # formatDirham(amount, locale?)
│   │   │   │   └── index.ts
│   │   │   └── index.ts            # Main entry
│   │   ├── dist/                   # Build output
│   │   │   ├── fonts/              # .woff2, .woff, .ttf
│   │   │   ├── css/                # dirham.css, dirham.scss
│   │   │   ├── react/              # Compiled React components
│   │   │   └── index.js
│   │   ├── build.mjs               # svgtofont build script
│   │   ├── tsconfig.json
│   │   └── package.json            # "dirham-symbol"
│   └── tsconfig/                   # Shared TypeScript config
│       ├── base.json
│       ├── react.json
│       └── package.json            # @dirham/tsconfig (private)
├── COPILOT.md
├── LICENSE                         # MIT
└── README.md
```

## package.json Exports Map

```json
{
  "name": "dirham-symbol",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react/index.d.ts",
      "import": "./dist/react/index.mjs",
      "require": "./dist/react/index.js"
    },
    "./css": "./dist/css/dirham.css",
    "./scss": "./dist/css/dirham.scss",
    "./font/woff2": "./dist/fonts/dirham.woff2",
    "./font/woff": "./dist/fonts/dirham.woff",
    "./font/ttf": "./dist/fonts/dirham.ttf"
  }
}
```

## Implementation Steps

### Step 1: Scaffold Turborepo Monorepo

- `pnpm dlx create-turbo@latest` or manual scaffold
- Configure `turbo.json` with build task pipeline (`dependsOn: ["^build"]`)
- Set up `pnpm-workspace.yaml` with `packages/*` and `apps/*`

### Step 2: Obtain and Optimize SVG

- Download SVG from Wikimedia Commons
- Validate against Central Bank guideline PDF (proportions, spacing)
- Optimize with SVGO: remove metadata, simplify paths, normalize viewBox
- Place in `packages/dirham-symbol/src/svg/dirham.svg`

### Step 3: Configure svgtofont Build Pipeline

- Install `svgtofont` as devDependency
- Create `build.mjs` with configuration:
  - Input: `src/svg/`
  - Output: `dist/fonts/` (WOFF2, WOFF, TTF)
  - Codepoint: `startUnicode: 0xE900`
  - Ligatures: `useNameAsUnicode: true`
  - CSS: `@font-face` with `font-display: swap`
  - Font metrics: `fontHeight: 1000`, `normalize: true`, `centerHorizontally: true`
  - React output: `outSVGReact: true`

### Step 4: Create TypeScript Core

```typescript
// constants.ts
export const DIRHAM_UNICODE = "\uE900";
export const DIRHAM_HTML_ENTITY = "&#xE900;";
export const DIRHAM_CSS_CONTENT = "\\E900";
export const DIRHAM_CURRENCY_CODE = "AED";
export const DIRHAM_SYMBOL_TEXT = "د.إ";

// format.ts
export function formatDirham(amount: number, locale?: string): string;
```

### Step 5: Build React Components

- `DirhamSymbol` — SVG-based (inline SVG, SSR-safe, tree-shakeable)
  - Props: `size`, `color`, `className`, `aria-label` (default: "UAE Dirham")
  - `role="img"` for accessibility
- `DirhamIcon` — Font-based (CSS class wrapper)
  - Requires `dirham-symbol/css` to be imported

### Step 6: CSS Stylesheet Generation

```css
@font-face {
  font-family: "Dirham";
  src:
    url("./fonts/dirham.woff2") format("woff2"),
    url("./fonts/dirham.woff") format("woff"),
    url("./fonts/dirham.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.dirham-symbol::before {
  font-family: "Dirham";
  content: "\E900";
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 7: Accessibility & RTL

- React: `aria-label="UAE Dirham"`, `role="img"`
- CSS: `.sr-only` text alongside icon class
- RTL: test symbol before/after amounts in `dir="ltr"` and `dir="rtl"`
- `formatDirham()` respects locale for symbol positioning

### Step 8: Docs Site (apps/docs)

- Next.js app with live symbol preview
- Interactive size/color controls
- Copy-paste code snippets for each integration method
- RTL/LTR rendering demo
- Font metrics visualization

### Step 9: CI/CD (GitHub Actions)

- **ci.yml**: build + lint + test on every PR
- **publish.yml**: `pnpm publish` on tag/release
- Changesets for version management
- Font file size assertion (WOFF2 < 5KB for single glyph)

### Step 10: Turbo Pipeline

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
    },
    "dev": {
      "cache": false,
      "persistent": true,
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"],
    },
  },
}
```

## Consumer Usage Examples

### Install

```bash
npm install dirham-symbol
```

### React Component (SVG-based)

```tsx
import { DirhamSymbol } from "dirham-symbol/react";

function Price() {
  return (
    <span>
      100 <DirhamSymbol size={16} />
    </span>
  );
}
```

### CSS Class (Font-based)

```html
<link rel="stylesheet" href="node_modules/dirham-symbol/dist/css/dirham.css" />
<span>100 <i class="dirham-symbol"></i></span>
```

### JavaScript Constants

```typescript
import { DIRHAM_UNICODE, formatDirham } from "dirham-symbol";

console.log(formatDirham(100)); // "د.إ 100.00"
```

### HTML Entity

```html
<span style="font-family: 'Dirham'">&#xE900;</span>
```

## Verification Checklist

- [ ] `pnpm build` — all packages build without errors
- [ ] Visual test: symbol renders inline at 12px–72px with correct baseline
- [ ] `npm pack` — exports map works in test consumer project
- [ ] CJS and ESM both work
- [ ] React SSR renders correctly (Next.js)
- [ ] `pnpm lint` and `pnpm test` pass
- [ ] WOFF2 font file < 5KB
- [ ] RTL rendering correct in Arabic context
- [ ] Accessibility: screen reader announces "UAE Dirham"

## Dependencies

| Package             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| turbo               | Monorepo build orchestration                 |
| svgtofont           | SVG → font conversion + React/CSS generation |
| svgo                | SVG optimization                             |
| typescript          | Type checking + compilation                  |
| tsup                | TypeScript bundling (CJS + ESM + .d.ts)      |
| @changesets/cli     | Version management                           |
| react, @types/react | React component development                  |
| next                | Documentation site                           |
| vitest              | Testing                                      |
| eslint              | Linting                                      |
