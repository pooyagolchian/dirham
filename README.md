# dirham

[![npm version](https://img.shields.io/npm/v/dirham)](https://www.npmjs.com/package/dirham)
[![npm downloads](https://img.shields.io/npm/dm/dirham)](https://www.npmjs.com/package/dirham)
[![license](https://img.shields.io/npm/l/dirham)](./LICENSE)
[![Unicode 18.0](https://img.shields.io/badge/Unicode_18.0-U%2B20C3-16a34a)](https://www.unicode.org/charts/PDF/U20A0.pdf)

UAE Dirham (د.إ) currency symbol as a web font, CSS, and React component.

The glyph is based on the official UAE Dirham symbol as defined by the [Central Bank of UAE](https://www.centralbank.ae/en/our-operations/currency-and-coins/).

[Live Demo](https://dirham.vercel.app) · [GitHub](https://github.com/pooyagolchian/dirham) · [npm](https://www.npmjs.com/package/dirham)

## Installation

```bash
npm install dirham
# or
pnpm add dirham
# or
yarn add dirham
```

## Usage

### CSS / Web Font

Import the CSS to register the `@font-face` and use the `.dirham-symbol` class:

```html
<link rel="stylesheet" href="node_modules/dirham/dist/css/dirham-symbol.css" />

<i class="dirham-symbol" aria-label="UAE Dirham"></i>
```

Or import in JavaScript/TypeScript:

```ts
import "dirham/css";
```

### SCSS

```scss
@use "dirham/scss";
```

### React — SVG Component (Recommended)

Zero-config, SSR-safe, tree-shakeable. No font loading required.

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

| Prop         | Type               | Default          | Description                                     |
| ------------ | ------------------ | ---------------- | ----------------------------------------------- |
| `size`       | `number \| string` | `24`             | Width & height (px or CSS)                      |
| `color`      | `string`           | `"currentColor"` | Fill color                                      |
| `weight`     | `DirhamWeight`     | `"regular"`      | Visual weight — matches surrounding font weight |
| `aria-label` | `string`           | `"UAE Dirham"`   | Accessible label                                |

**Weight values:** `thin`, `extralight`, `light`, `regular`, `medium`, `semibold`, `bold`, `extrabold`, `black`

```tsx
// Match a bold heading
<h1>
  <DirhamSymbol size="1em" weight="bold" /> Premium Plan
</h1>

// Match light body text
<p style={{ fontWeight: 300 }}>
  Only <DirhamSymbol size="1em" weight="light" /> 9.99/month
</p>
```

### React — Font Icon Component

Requires `dirham/css` to be imported.

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

| Prop         | Type               | Default          | Description            |
| ------------ | ------------------ | ---------------- | ---------------------- |
| `size`       | `number \| string` | `"inherit"`      | Font size (px or CSS)  |
| `color`      | `string`           | `"currentColor"` | Icon color             |
| `aria-label` | `string`           | `"UAE Dirham"`   | Accessible label       |
| `as`         | `"i" \| "span"`    | `"i"`            | HTML tag to render     |
| `className`  | `string`           | `""`             | Additional CSS classes |

### JavaScript Utilities

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

// Format amounts
formatDirham(1234.5);
// => "د.إ 1,234.50"

formatDirham(1234.5, { locale: "ar-AE" });
// => "١٬٢٣٤٫٥٠ د.إ"

formatDirham(100, { useCode: true });
// => "AED 100.00"

// Parse formatted strings
parseDirham("د.إ 1,234.50");
// => 1234.5
```

### Direct Font Files

Font files are available at `dirham/font/*`:

- `dirham/font/dirham-symbol.woff2`
- `dirham/font/dirham-symbol.woff`
- `dirham/font/dirham-symbol.ttf`

## Package Exports

| Subpath         | Description            |
| --------------- | ---------------------- |
| `dirham`        | Core JS/TS utilities   |
| `dirham/react`  | React components       |
| `dirham/css`    | CSS with `@font-face`  |
| `dirham/scss`   | SCSS with `@font-face` |
| `dirham/font/*` | Raw font files         |

## Unicode Status

The UAE Dirham sign has been **accepted for Unicode 18.0** at codepoint **U+20C3** (UAE DIRHAM SIGN), approved by the UTC on 2025-Jul-22. It is expected to ship in September 2026.

This package **already uses U+20C3** — the glyph is mapped to the official codepoint via a custom web font. When operating systems and fonts adopt Unicode 18.0, the web font gracefully becomes unnecessary with zero migration.

|                       | Codepoint | Status                                                      |
| --------------------- | --------- | ----------------------------------------------------------- |
| **This package**      | U+20C3    | Custom web font mapping the glyph to the official codepoint |
| **Native OS support** | U+20C3    | Expected with Unicode 18.0 (Sept 2026)                      |

```ts
import {
	DIRHAM_UNICODE, // "\u20C3"
	DIRHAM_CODEPOINT, // 0x20C3
} from "dirham";
```

## Monorepo Structure

This project uses [Turborepo](https://turbo.build/) with pnpm workspaces.

```
dirham/
├── apps/
│   └── docs/              # Demo & documentation site (Vite + React)
├── packages/
│   ├── dirham-symbol/     # npm package (published as "dirham")
│   └── tsconfig/          # Shared TypeScript configuration
├── turbo.json             # Turborepo configuration
├── pnpm-workspace.yaml    # pnpm workspace definition
└── biome.json             # Biome formatter/linter config
```

| Package                                          | Path                     | Description                              |
| ------------------------------------------------ | ------------------------ | ---------------------------------------- |
| [`dirham`](https://www.npmjs.com/package/dirham) | `packages/dirham-symbol` | The npm package — `npm install dirham`   |
| `@dirham/docs`                                   | `apps/docs`              | Interactive demo site with live examples |
| `@dirham/tsconfig`                               | `packages/tsconfig`      | Shared TypeScript base configs           |

### Running the Demo Site

```bash
pnpm install
pnpm --filter @dirham/docs dev
# Opens at http://localhost:5173
```

## Publishing

> Always publish from the package directory, **not** the monorepo root.

```bash
# 1. Build
cd packages/dirham-symbol
pnpm build

# 2. Set your npm auth token (granular token with bypass 2FA)
npm config set //registry.npmjs.org/:_authToken <your-token>

# 3. Dry-run to confirm what will be included
npm pack --dry-run

# 4. Publish
npm publish --access public
```

The monorepo root `package.json` is marked `private: true` to prevent accidental publishing from the root.

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Format code
pnpm format
```

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before submitting a PR.

## License

MIT — see [LICENSE](./LICENSE)

The Dirham symbol glyph is sourced from the [Central Bank of UAE](https://www.centralbank.ae/en/our-operations/currency-and-coins/).
