# dirham

[![npm version](https://img.shields.io/npm/v/dirham)](https://www.npmjs.com/package/dirham)
[![npm downloads](https://img.shields.io/npm/dm/dirham)](https://www.npmjs.com/package/dirham)
[![license](https://img.shields.io/npm/l/dirham)](https://github.com/pooyagolchian/dirham/blob/main/LICENSE)
[![Unicode 18.0](https://img.shields.io/badge/Unicode_18.0-U%2B20C3-16a34a)](https://www.unicode.org/charts/PDF/U20A0.pdf)
[![Demo](https://img.shields.io/badge/Demo-dirham.js.org-0ea5e9)](https://dirham.js.org/)

The UAE Dirham currency symbol (&#x20C3;) as a web font, CSS utility, React component, and **Web Component** for Vue, Angular, Svelte & vanilla JS.

Built on **U+20C3**, the codepoint assigned to the UAE Dirham Sign in Unicode 18.0. Because the package renders the symbol through a custom web font today, it will continue working without any code changes when operating systems ship native Unicode 18.0 support in September 2026.

[Live Demo](https://dirham.js.org/) &nbsp;&middot;&nbsp; [GitHub](https://github.com/pooyagolchian/dirham) &nbsp;&middot;&nbsp; [npm](https://www.npmjs.com/package/dirham)

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
formatDirham(1500000, { notation: "compact" }); // "\u20C3 1.5M"
parseDirham("\u20C3 1,234.50"); // 1234.5
```

### React — Price component

Combines formatting + symbol into a single component. Accepts `className` for custom styling:

```tsx
import { DirhamPrice } from "dirham/react";

<DirhamPrice amount={1250} />
<DirhamPrice amount={1500000} notation="compact" weight="bold" />
<DirhamPrice amount={100} useCode />
<DirhamPrice amount={750} className="text-emerald-400 text-2xl" />
```

### Web Component

Framework-agnostic — works in Vue, Angular, Svelte, or vanilla HTML:

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/dirham/dist/web-component/index.js"
></script>

<!-- Symbol only -->
<dirham-symbol size="24" weight="bold"></dirham-symbol>

<!-- Formatted price -->
<dirham-price amount="1250"></dirham-price>
<dirham-price amount="5000000" notation="compact"></dirham-price>
<dirham-price amount="100" locale="ar-AE"></dirham-price>
<dirham-price amount="500" use-code></dirham-price>
```

Or import in a bundler:

```ts
import "dirham/web-component";
```

#### `<dirham-price>` Attributes

| Attribute     | Default      | Description                               |
| ------------- | ------------ | ----------------------------------------- |
| `amount`      | `0`          | Numeric value to display                  |
| `locale`      | `"en-AE"`    | Intl locale string (e.g. `ar-AE`)         |
| `decimals`    | `2`          | Number of decimal places                  |
| `notation`    | `"standard"` | `"standard"` or `"compact"`               |
| `use-code`    | —            | Boolean attr — show AED instead of symbol |
| `symbol-size` | `"1em"`      | SVG symbol width/height                   |
| `weight`      | `"regular"`  | `thin` · `light` · `regular` · `bold` …   |
| `currency`    | `"AED"`      | Currency code when `use-code` is set      |

#### Vue

```vue
<script setup>
import "dirham/web-component";
</script>

<template>
	<dirham-symbol size="24" weight="bold" />
	<dirham-price amount="1250" />
	<dirham-price amount="5000000" notation="compact" />
</template>
```

#### Angular

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "dirham/web-component";

@Component({
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	template: `
		<dirham-symbol size="24" weight="bold"></dirham-symbol>
		<dirham-price amount="1250"></dirham-price>
	`,
})
export class AppComponent {}
```

#### Svelte

```svelte
<script>
  import "dirham/web-component";
</script>

<dirham-symbol size="24" weight="bold"></dirham-symbol>
<dirham-price amount="1250"></dirham-price>
```

### CDN (no bundler)

```html
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/dirham/dist/css/dirham.css"
/>
<i class="dirham-symbol" aria-label="UAE Dirham"></i>
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

## Exports

| Import path                | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `dirham`                   | Core utilities, constants, clipboard                   |
| `dirham/react`             | `DirhamSymbol`, `DirhamIcon`, `DirhamPrice`            |
| `dirham/web-component`     | `<dirham-symbol>` and `<dirham-price>` custom elements |
| `dirham/css`               | CSS with `@font-face`                                  |
| `dirham/scss`              | SCSS with `@font-face`                                 |
| `dirham/font/woff2`        | WOFF2 font file (default)                              |
| `dirham/font/woff`         | WOFF font file                                         |
| `dirham/font/ttf`          | TTF font file                                          |
| `dirham/font/sans/woff2`   | Sans-serif variant WOFF2                               |
| `dirham/font/serif/woff2`  | Serif variant WOFF2                                    |
| `dirham/font/mono/woff2`   | Monospace variant WOFF2                                |
| `dirham/font/arabic/woff2` | Arabic variant WOFF2                                   |

## Unicode

U+20C3 (UAE DIRHAM SIGN) was accepted by the Unicode Technical Committee on 2025-Jul-22 and is scheduled for Unicode 18.0 (September 2026). This package already uses that codepoint, so when system fonts gain native support the custom web font simply becomes unused — no API or template changes needed.

## License

MIT. The Dirham symbol glyph is sourced from the [Central Bank of UAE](https://www.centralbank.ae/en/our-operations/currency-and-coins/).
