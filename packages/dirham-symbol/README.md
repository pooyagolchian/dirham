# dirham

[![npm version](https://img.shields.io/npm/v/dirham)](https://www.npmjs.com/package/dirham)
[![npm downloads](https://img.shields.io/npm/dm/dirham)](https://www.npmjs.com/package/dirham)
[![license](https://img.shields.io/npm/l/dirham)](https://github.com/pooyagolchian/dirham/blob/main/LICENSE)
[![Unicode 18.0](https://img.shields.io/badge/Unicode_18.0-U%2B20C3-16a34a)](https://www.unicode.org/charts/PDF/U20A0.pdf)
[![Demo](https://img.shields.io/badge/Demo-dirham.vercel.app-0ea5e9)](https://dirham.vercel.app)

The UAE Dirham currency symbol (&#x20C3;) as a web font, CSS utility, and React component.

Built on **U+20C3**, the codepoint assigned to the UAE Dirham Sign in Unicode 18.0. Because the package renders the symbol through a custom web font today, it will continue working without any code changes when operating systems ship native Unicode 18.0 support in September 2026.

[Live Demo](https://dirham.vercel.app) &nbsp;&middot;&nbsp; [GitHub](https://github.com/pooyagolchian/dirham) &nbsp;&middot;&nbsp; [npm](https://www.npmjs.com/package/dirham)

## Installation

```bash
npm install dirham
# or
pnpm add dirham
# or
yarn add dirham
```

## Usage

### React — SVG component

Renders an inline SVG. No font loading required; works with SSR and React Server Components.

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

**Weight variants** match the symbol stroke to surrounding text weight:

`thin` `extralight` `light` `regular` `medium` `semibold` `bold` `extrabold` `black`

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

### JavaScript utilities

```ts
import { formatDirham, parseDirham, DIRHAM_UNICODE } from "dirham";

formatDirham(1234.5); // "\u20C3 1,234.50"
formatDirham(1234.5, { locale: "ar-AE" }); // "١٬٢٣٤٫٥٠ \u20C3"
formatDirham(100, { useCode: true }); // "AED 100.00"
parseDirham("\u20C3 1,234.50"); // 1234.5
```

## Exports

| Import path         | Description                                  |
| ------------------- | -------------------------------------------- |
| `dirham`            | Core utilities and constants                 |
| `dirham/react`      | `DirhamSymbol` (SVG) and `DirhamIcon` (font) |
| `dirham/css`        | CSS with `@font-face`                        |
| `dirham/scss`       | SCSS with `@font-face`                       |
| `dirham/font/woff2` | WOFF2 font file                              |
| `dirham/font/woff`  | WOFF font file                               |
| `dirham/font/ttf`   | TTF font file                                |

## Unicode

U+20C3 (UAE DIRHAM SIGN) was accepted by the Unicode Technical Committee on 2025-Jul-22 and is scheduled for Unicode 18.0 (September 2026). This package already uses that codepoint, so when system fonts gain native support the custom web font simply becomes unused — no API or template changes needed.

## License

MIT. The Dirham symbol glyph is sourced from the [Central Bank of UAE](https://www.centralbank.ae/en/our-operations/currency-and-coins/).
