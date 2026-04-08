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

### React — Animated price

Count-up / count-down transitions using `requestAnimationFrame`. No external deps.

```tsx
import { AnimatedDirhamPrice } from "dirham/react";

<AnimatedDirhamPrice amount={1250} />
<AnimatedDirhamPrice amount={5000} duration={800} easing="easeInOut" />
<AnimatedDirhamPrice amount={99.9} useCode notation="compact" />
```

| Prop       | Default      | Description                                  |
| ---------- | ------------ | -------------------------------------------- |
| `amount`   | —            | Target value to animate to                   |
| `duration` | `600`        | Animation duration in ms                     |
| `easing`   | `"easeOut"`  | `linear` · `easeIn` · `easeOut` · `easeInOut` |
| `locale`   | `"en-AE"`    | Intl locale                                  |
| `decimals` | `2`          | Decimal places                               |
| `useCode`  | `false`      | Show AED instead of symbol                   |
| `notation` | `"standard"` | `"standard"` or `"compact"`                  |
| `weight`   | `"regular"`  | Symbol weight                                |

### React — Currency input

Masked currency input with auto-formatting, paste handling, and Arabic numeral support:

```tsx
import { DirhamInput } from "dirham/react";

<DirhamInput defaultValue={100} onChange={(v) => console.log(v)} />
<DirhamInput value={amount} onChange={setAmount} min={0} max={999999} />
<DirhamInput locale="ar-AE" useCode />
```

| Prop             | Default     | Description                          |
| ---------------- | ----------- | ------------------------------------ |
| `value`          | —           | Controlled numeric value             |
| `defaultValue`   | —           | Uncontrolled initial value           |
| `onChange`        | —           | `(value: number \| null) => void`    |
| `locale`         | `"en-AE"`   | Intl locale                         |
| `decimals`       | `2`         | Maximum decimal places               |
| `min` / `max`    | —           | Clamps value on blur                 |
| `showSymbol`     | `true`      | Show inline SVG symbol               |
| `useCode`        | `false`     | Show AED text instead of symbol      |
| `selectOnFocus`  | `true`      | Select all text on focus             |

### React — Exchange rate hook

Fetch live exchange rates and convert AED amounts:

```tsx
import { useDirhamRate } from "dirham/react";

function PriceInUSD({ amount }: { amount: number }) {
  const { rate, convert, loading, error } = useDirhamRate("USD");

  if (loading) return <span>Loading…</span>;
  if (error) return <span>Error: {error}</span>;

  return <span>${convert(amount)} USD (rate: {rate})</span>;
}
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

#### `<dirham-animated-price>`

Animated count-up/count-down price display:

```html
<dirham-animated-price amount="1250" duration="600" easing="easeOut"></dirham-animated-price>
```

Attributes: `amount`, `duration`, `easing`, `locale`, `decimals`, `notation`, `use-code`, `symbol-size`, `weight`

#### `<dirham-input>`

Masked currency input with auto-formatting:

```html
<dirham-input value="100" min="0" max="999999" decimals="2"></dirham-input>
<dirham-input locale="ar-AE" placeholder="المبلغ"></dirham-input>
```

Attributes: `value`, `locale`, `decimals`, `min`, `max`, `placeholder`, `disabled`, `readonly`, `show-symbol`, `use-code`, `symbol-size`, `weight`

Fires `dirham-change` event with `{ detail: { value: number | null } }`.

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

### Copy formatted amount

```ts
import { copyDirhamAmount } from "dirham";

await copyDirhamAmount(1234.5);                    // copies "د.إ 1,234.50"
await copyDirhamAmount(1234.5, { useCode: true }); // copies "AED 1,234.50"
await copyDirhamAmount(500, { locale: "ar-AE" });  // copies "٥٠٠٫٠٠ د.إ"
```

### VAT helpers

UAE VAT (5%) calculation utilities with configurable rate and precision:

```ts
import { addVAT, removeVAT, getVAT, UAE_VAT_RATE } from "dirham";

addVAT(100);                        // 105
removeVAT(105);                     // 100
getVAT(100);                        // 5

addVAT(100, { rate: 0.1 });         // 110 (custom 10% rate)
addVAT(99.99, { decimals: 4 });     // 104.9895
```

### Currency conversion

Convert amounts between AED and other currencies. Rates are fetched from a free exchange rate API and cached for 1 hour:

```ts
import { convertFromAED, convertToAED, fetchExchangeRates } from "dirham";

const usd = await convertFromAED(100, "USD");           // e.g. 27.23
const aed = await convertToAED(27.23, "USD");            // e.g. 100
const manual = await convertFromAED(100, "USD", { rate: 0.2723 }); // skip fetch

const rates = await fetchExchangeRates(); // { USD: 0.2723, EUR: 0.2511, ... }
```

### React Native

Requires `react-native-svg` as a peer dependency:

```tsx
import { DirhamSymbol, DirhamPrice } from "dirham/react-native";

<DirhamSymbol size={24} color="#000" weight="bold" />
<DirhamPrice amount={1250} />
<DirhamPrice amount={500} locale="ar-AE" useCode />
```

### Tailwind CSS plugin

Add the Dirham symbol plugin to your Tailwind config:

```js
// tailwind.config.js
import dirhamPlugin from "dirham/tailwind";

export default {
  plugins: [dirhamPlugin],
};
```

Available utility classes:

| Class              | Description                                     |
| ------------------ | ----------------------------------------------- |
| `.dirham`          | Base — sets font-family to Dirham               |
| `.dirham-thin`     | Thin weight                                     |
| `.dirham-light`    | Light weight                                    |
| `.dirham-regular`  | Regular weight (default)                        |
| `.dirham-bold`     | Bold weight                                     |
| `.dirham-black`    | Black weight                                    |
| `.dirham-xs`       | Extra small size (0.75rem)                      |
| `.dirham-sm`       | Small size (0.875rem)                           |
| `.dirham-base`     | Base size (1rem)                                |
| `.dirham-lg`       | Large size (1.25rem)                            |
| `.dirham-xl`       | Extra large size (1.5rem)                       |
| `.dirham-2xl`      | 2× large size (2rem)                            |
| `.dirham-3xl`      | 3× large size (2.5rem)                          |
| `.dirham-4xl`      | 4× large size (3rem)                            |
| `.dirham-before`   | Pseudo-element `::before` with `\20C3` content  |
| `.dirham-after`    | Pseudo-element `::after` with `\20C3` content   |
| `.dirham-price`    | Component class (nowrap + tabular-nums)         |

### Next.js font optimization

Pre-configured `next/font/local` instance with the Dirham WOFF2 font:

```tsx
import { dirhamFont } from "dirham/next";

// In your layout:
<html className={dirhamFont.className}>
  {children}
</html>

// Or use the CSS variable:
<div style={{ fontFamily: "var(--font-dirham)" }}>
  &#x20C3;
</div>
```

For manual configuration, use the raw config:

```ts
import { dirhamFontConfig } from "dirham/next";
import localFont from "next/font/local";

const myDirham = localFont(dirhamFontConfig);
```

### CLI

```bash
npx dirham              # Print symbol info
npx dirham copy         # Copy \u20C3 to clipboard
npx dirham copy html    # Copy HTML entity
```

### OG / Social Media Price Cards

Generate shareable price card images for Open Graph and Twitter Cards.

#### Server-side SVG (zero dependencies)

```ts
import { generatePriceCardSVG } from "dirham/og";

const svg = generatePriceCardSVG({
  amount: 12500,
  title: "Monthly Rent",
  subtitle: "Dubai Marina, Studio",
  accentColor: "#22c55e",
});
// Returns a self-contained <svg> string (1200×630 by default)
```

#### Next.js OG Image Route (`@vercel/og`)

```tsx
// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { DirhamPriceCard } from "dirham/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = Number(searchParams.get("amount") ?? "0");
  const title = searchParams.get("title") ?? undefined;

  return new ImageResponse(
    <DirhamPriceCard amount={amount} title={title} />,
    { width: 1200, height: 630 },
  );
}
```

Then in your page `<head>`:

```html
<meta property="og:image" content="/api/og?amount=12500&title=Monthly+Rent" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amount` | `number` | — | Price amount (required) |
| `title` | `string` | — | Header text above the price |
| `subtitle` | `string` | — | Footer text below the price |
| `locale` | `string` | `"en-AE"` | Intl locale (RTL auto-detected) |
| `decimals` | `number` | `2` | Decimal places |
| `notation` | `"standard" \| "compact"` | `"standard"` | Number notation |
| `width` | `number` | `1200` | Image width in px |
| `height` | `number` | `630` | Image height in px |
| `background` | `string` | `"#0a0a0a"` | Background color |
| `textColor` | `string` | `"#ffffff"` | Text color |
| `accentColor` | `string` | `"#22c55e"` | Dirham symbol & badge color |

## Exports

| Import path                | Description                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `dirham`                   | Core utilities, constants, clipboard, VAT, conversion                               |
| `dirham/react`             | `DirhamSymbol`, `DirhamIcon`, `DirhamPrice`, `AnimatedDirhamPrice`, `DirhamInput`, `useDirhamRate` |
| `dirham/react-native`      | `DirhamSymbol`, `DirhamPrice` (requires `react-native-svg`)                         |
| `dirham/web-component`     | `<dirham-symbol>`, `<dirham-price>`, `<dirham-animated-price>`, `<dirham-input>`    |
| `dirham/tailwind`          | Tailwind CSS plugin with Dirham utility classes                                     |
| `dirham/next`              | Next.js `next/font/local` wrapper (`dirhamFont`, `dirhamFontConfig`)                |
| `dirham/og`                | OG image generation (`DirhamPriceCard`, `generatePriceCardSVG`)                     |
| `dirham/css`               | CSS with `@font-face`                                                               |
| `dirham/scss`              | SCSS with `@font-face`                                                              |
| `dirham/font/woff2`        | WOFF2 font file (default)                                                           |
| `dirham/font/woff`         | WOFF font file                                                                      |
| `dirham/font/ttf`          | TTF font file                                                                       |
| `dirham/font/sans/woff2`   | Sans-serif variant WOFF2                                                            |
| `dirham/font/serif/woff2`  | Serif variant WOFF2                                                                 |
| `dirham/font/mono/woff2`   | Monospace variant WOFF2                                                             |
| `dirham/font/arabic/woff2` | Arabic variant WOFF2                                                                |

## Unicode

U+20C3 (UAE DIRHAM SIGN) was accepted by the Unicode Technical Committee on 2025-Jul-22 and is scheduled for Unicode 18.0 (September 2026). This package already uses that codepoint, so when system fonts gain native support the custom web font simply becomes unused — no API or template changes needed.

## License

MIT. The Dirham symbol glyph is sourced from the [Central Bank of UAE](https://www.centralbank.ae/en/our-operations/currency-and-coins/).
