# dirham

[![npm version](https://img.shields.io/npm/v/dirham)](https://www.npmjs.com/package/dirham)
[![npm downloads](https://img.shields.io/npm/dm/dirham)](https://www.npmjs.com/package/dirham)
[![license](https://img.shields.io/npm/l/dirham)](https://github.com/pooyagolchian/dirham/blob/main/LICENSE)
[![Unicode 18.0](https://img.shields.io/badge/Unicode_18.0-U%2B20C3-16a34a)](https://www.unicode.org/charts/PDF/U20A0.pdf)
[![Demo](https://img.shields.io/badge/Demo-dirham.vercel.app-0ea5e9)](https://dirham.vercel.app)

UAE Dirham (د.إ) currency symbol as a web font, CSS, and React component — built on the official Unicode 18.0 codepoint **U+20C3**.

[Live Demo](https://dirham.vercel.app) · [Documentation](https://github.com/pooyagolchian/dirham#readme) · [GitHub](https://github.com/pooyagolchian/dirham) · [npm](https://www.npmjs.com/package/dirham)

## Installation

```bash
npm install dirham
# or
pnpm add dirham
# or
yarn add dirham
```

## Usage

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

**Weight variants:** `thin` · `extralight` · `light` · `regular` · `medium` · `semibold` · `bold` · `extrabold` · `black`

```tsx
<DirhamSymbol size="1em" weight="bold" />
```

### CSS / Web Font

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

### JavaScript Utilities

```ts
import { formatDirham, parseDirham, DIRHAM_UNICODE } from "dirham";

formatDirham(1234.5); // "د.إ 1,234.50"
formatDirham(1234.5, { locale: "ar-AE" }); // "١٬٢٣٤٫٥٠ د.إ"
formatDirham(100, { useCode: true }); // "AED 100.00"
parseDirham("د.إ 1,234.50"); // 1234.5
```

## Package Exports

| Subpath         | Description                       |
| --------------- | --------------------------------- |
| `dirham`        | Core JS/TS utilities              |
| `dirham/react`  | React SVG + icon components       |
| `dirham/css`    | CSS with `@font-face`             |
| `dirham/scss`   | SCSS with `@font-face`            |
| `dirham/font/*` | Raw font files (woff2, woff, ttf) |

## Unicode

This package uses **U+20C3** (UAE DIRHAM SIGN), accepted for Unicode 18.0 (UTC, 2025-Jul-22). When OS/browser fonts adopt Unicode 18.0, the web font gracefully becomes unnecessary with zero migration.

## License

MIT — Dirham symbol glyph sourced from the [Central Bank of UAE](https://www.centralbank.ae/en/our-operations/currency-and-coins/).
