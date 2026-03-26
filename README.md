# dirham

[![npm version](https://img.shields.io/npm/v/dirham)](https://www.npmjs.com/package/dirham)
[![npm downloads](https://img.shields.io/npm/dm/dirham)](https://www.npmjs.com/package/dirham)
[![license](https://img.shields.io/npm/l/dirham)](./LICENSE)
[![Unicode 18.0](https://img.shields.io/badge/Unicode_18.0-U%2B20C3-16a34a)](https://www.unicode.org/charts/PDF/U20A0.pdf)
[![Demo](https://img.shields.io/badge/Demo-dirham.js.org-0ea5e9)](https://dirham.js.org/)

The UAE Dirham currency symbol (&#x20C3;) as a web font, CSS utility, and React component.

The glyph uses **U+20C3**, the codepoint assigned to the UAE Dirham Sign in Unicode 18.0, rendered today through a custom web font. When operating systems ship native Unicode 18.0 support (September 2026), the web font is no longer needed and can be dropped without any code changes.

[Live Demo](https://dirham.js.org/) &nbsp;&middot;&nbsp; [npm](https://www.npmjs.com/package/dirham) &nbsp;&middot;&nbsp; [GitHub](https://github.com/pooyagolchian/dirham)

---

## Installation

```bash
npm install dirham
# or
pnpm add dirham
# or
yarn add dirham
```

---

## Usage

### React — SVG component

Renders an inline SVG. SSR-compatible, tree-shakeable, no font loading required.

```tsx
import { DirhamSymbol } from "dirham/react";

function Price() {
	return (
		<span>
			100 <DirhamSymbol size={16} />
		</span>
	);
}
```

#### Props

| Prop         | Type               | Default          | Description                              |
| ------------ | ------------------ | ---------------- | ---------------------------------------- |
| `size`       | `number \| string` | `24`             | Width and height in px, or any CSS value |
| `color`      | `string`           | `"currentColor"` | Fill color                               |
| `weight`     | `DirhamWeight`     | `"regular"`      | Stroke weight to match surrounding text  |
| `aria-label` | `string`           | `"UAE Dirham"`   | Accessible label for screen readers      |

**Weight values:** `thin` `extralight` `light` `regular` `medium` `semibold` `bold` `extrabold` `black`

```tsx
// Matches a bold heading
<h1>
  <DirhamSymbol size="1em" weight="bold" /> Premium Plan
</h1>

// Matches light body text
<p style={{ fontWeight: 300 }}>
  Only <DirhamSymbol size="1em" weight="light" /> 9.99/month
</p>
```

### React — Font icon component

Font-based alternative. Requires `dirham/css` to be imported.

```tsx
import "dirham/css";
import { DirhamIcon } from "dirham/react";

function Price() {
	return (
		<span>
			100 <DirhamIcon size={16} />
		</span>
	);
}
```

#### Props

| Prop         | Type               | Default          | Description                         |
| ------------ | ------------------ | ---------------- | ----------------------------------- |
| `size`       | `number \| string` | `"inherit"`      | Font size in px, or any CSS value   |
| `color`      | `string`           | `"currentColor"` | Text color                          |
| `aria-label` | `string`           | `"UAE Dirham"`   | Accessible label for screen readers |
| `as`         | `"i" \| "span"`    | `"i"`            | HTML element to render              |
| `className`  | `string`           | `""`             | Additional CSS class names          |

### CSS / Web Font

Import the stylesheet to register the `@font-face` and `.dirham-symbol` helper class.

```ts
import "dirham/css";
```

```html
<i class="dirham-symbol" aria-label="UAE Dirham"></i>
```

### SCSS

```scss
@use "dirham/scss";
```

### React — Price component

Combines formatting + symbol into a single component:

```tsx
import { DirhamPrice } from "dirham/react";

<DirhamPrice amount={1250} />
<DirhamPrice amount={5000000} notation="compact" weight="bold" />
<DirhamPrice amount={100} useCode />
```

### Web Component

Framework-agnostic — works in Vue, Angular, Svelte, or vanilla HTML:

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/dirham/dist/web-component/index.js"
></script>

<dirham-symbol size="24" weight="bold"></dirham-symbol>
<dirham-price amount="1250"></dirham-price>
<dirham-price amount="5000000" notation="compact"></dirham-price>
```

Or import in a bundler:

```ts
import "dirham/web-component";
```

**Vue** — `<dirham-price amount="1250" />` · **Angular** — add `CUSTOM_ELEMENTS_SCHEMA` · **Svelte** — works out of the box.

See the [package README](packages/dirham-symbol/README.md) for full framework examples.

### JavaScript utilities

```ts
import {
	DIRHAM_UNICODE,
	DIRHAM_SYMBOL_TEXT,
	DIRHAM_CURRENCY_CODE,
	DIRHAM_CSS_CONTENT,
	DIRHAM_HTML_ENTITY,
	formatDirham,
	parseDirham,
} from "dirham";

// Format a number as a Dirham amount
formatDirham(1234.5); // "\u20C3 1,234.50"
formatDirham(1234.5, { locale: "ar-AE" }); // "١٬٢٣٤٫٥٠ \u20C3"
formatDirham(100, { useCode: true }); // "AED 100.00"
formatDirham(5000000, { notation: "compact" }); // "\u20C3 5M"

// Parse a formatted string back to a number
parseDirham("\u20C3 1,234.50"); // 1234.5
```

### CDN (no bundler)

```html
<!-- CSS web font -->
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/dirham/dist/css/dirham.css"
/>
<i class="dirham-symbol" aria-label="UAE Dirham"></i>

<!-- Web Component -->
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/dirham/dist/web-component/index.js"
></script>
<dirham-symbol size="20"></dirham-symbol>
```

### Clipboard utility

```ts
import { copyDirhamSymbol } from "dirham";

await copyDirhamSymbol(); // copies \u20C3 to clipboard
await copyDirhamSymbol("html"); // copies &#x20C3;
await copyDirhamSymbol("css"); // copies \20C3
```

### CLI

```bash
npx dirham              # Print symbol info
npx dirham copy         # Copy \u20C3 to clipboard
npx dirham copy html    # Copy HTML entity
```

### Direct font files

Font files are available via named subpaths:

- `dirham/font/woff2`
- `dirham/font/woff`
- `dirham/font/ttf`

---

## Package exports

| Import path            | Description                                 |
| ---------------------- | ------------------------------------------- |
| `dirham`               | Core utilities, constants, clipboard        |
| `dirham/react`         | `DirhamSymbol`, `DirhamIcon`, `DirhamPrice` |
| `dirham/web-component` | `<dirham-symbol>` custom element            |
| `dirham/css`           | CSS with `@font-face`                       |
| `dirham/scss`          | SCSS with `@font-face`                      |
| `dirham/font/*`        | Raw font files (woff2, woff, ttf, variants) |

---

## Unicode

U+20C3 (UAE DIRHAM SIGN) was accepted by the Unicode Technical Committee on 2025-Jul-22 and is scheduled for Unicode 18.0 (September 2026).

This package already uses that codepoint. The custom web font renders the glyph today, and when system fonts gain native U+20C3 support the font file can simply be removed — existing usages of `&#x20C3;`, `\u20C3`, and all React components remain valid.

|                   | Codepoint | Status                                 |
| ----------------- | --------- | -------------------------------------- |
| This package      | U+20C3    | Rendered via custom web font           |
| Native OS support | U+20C3    | Expected with Unicode 18.0 (Sept 2026) |

```ts
import {
	DIRHAM_UNICODE, // "\u20C3"
	DIRHAM_CODEPOINT, // 0x20C3
} from "dirham";
```

---

## Repository structure

This project uses [Turborepo](https://turbo.build/) with pnpm workspaces.

```
dirham/
├── apps/
│   └── docs/              # Demo and documentation site (Vite + React)
├── packages/
│   ├── dirham-symbol/     # The published npm package
│   └── tsconfig/          # Shared TypeScript configuration
├── turbo.json
├── pnpm-workspace.yaml
└── biome.json
```

| Package                                          | Path                     | Description               |
| ------------------------------------------------ | ------------------------ | ------------------------- |
| [`dirham`](https://www.npmjs.com/package/dirham) | `packages/dirham-symbol` | The npm package           |
| `@dirham/docs`                                   | `apps/docs`              | Interactive demo site     |
| `@dirham/tsconfig`                               | `packages/tsconfig`      | Shared TypeScript configs |

### Running the demo site locally

```bash
pnpm install
pnpm --filter @dirham/docs dev
# Opens at http://localhost:3000
```

---

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

---

## Publishing

Publish from the package directory, not the monorepo root.

```bash
# 1. Build
cd packages/dirham-symbol
pnpm build

# 2. Set your npm auth token
npm config set //registry.npmjs.org/:_authToken <your-token>

# 3. Dry run
npm pack --dry-run

# 4. Publish
npm publish --access public
```

The monorepo root `package.json` is marked `private: true` to prevent accidental publishing.

---

## Contributing

Contributions are welcome. Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before opening a pull request.

---

## License

MIT. See [LICENSE](./LICENSE).

The Dirham symbol glyph is sourced from the [Central Bank of UAE](https://www.centralbank.ae/en/our-operations/currency-and-coins/).
