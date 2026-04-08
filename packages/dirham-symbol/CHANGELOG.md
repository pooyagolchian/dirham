# dirham

## 1.5.0

### Minor Changes

- **OG / Social media price cards** — new `dirham/og` entry point for generating shareable Dirham price card images for social media (Open Graph, Twitter Cards).

  - `generatePriceCardSVG()` — framework-agnostic SVG string generator. Works server-side with zero DOM/React dependencies. Returns a self-contained `<svg>` string suitable for embedding, saving to file, or converting to PNG via sharp/resvg.
  - `<DirhamPriceCard />` — Satori-compatible React component for use with `@vercel/og` / `next/og` in Next.js API routes and Edge functions.
  - Both support: custom title, subtitle, locale (LTR/RTL), compact notation, custom colors (background, text, accent), and dimensions (default 1200×630 for OG).

  ```tsx
  // Server-side SVG
  import { generatePriceCardSVG } from "dirham/og";
  const svg = generatePriceCardSVG({ amount: 5000, title: "Monthly Rent" });

  // Next.js OG image route
  import { ImageResponse } from "next/og";
  import { DirhamPriceCard } from "dirham/og";
  export async function GET(req: Request) {
    const amount = Number(new URL(req.url).searchParams.get("amount") ?? "0");
    return new ImageResponse(<DirhamPriceCard amount={amount} />, { width: 1200, height: 630 });
  }
  ```

## 1.4.0

### Minor Changes

- **Animated price component** — new `<AnimatedDirhamPrice />` React component and `<dirham-animated-price>` Web Component for count-up/count-down price transitions using `requestAnimationFrame`. Configurable duration, easing (`linear`, `easeIn`, `easeOut`, `easeInOut`), and all standard formatting props.

  ```tsx
  import { AnimatedDirhamPrice } from "dirham/react";
  <AnimatedDirhamPrice amount={1250} duration={600} easing="easeOut" />
  ```

  ```html
  <dirham-animated-price amount="1250" duration="600" easing="easeOut"></dirham-animated-price>
  ```

- **React Native support** — new `dirham/react-native` entry with `DirhamSymbol` and `DirhamPrice` components using `react-native-svg`. Same SVG path data as the web version.

  ```tsx
  import { DirhamSymbol, DirhamPrice } from "dirham/react-native";
  <DirhamPrice amount={100} />
  ```

- **Tailwind CSS plugin** — new `dirham/tailwind` entry with utility classes for font weight (`.dirham-thin` … `.dirham-black`), size (`.dirham-xs` … `.dirham-4xl`), pseudo-elements (`.dirham-before`, `.dirham-after`), and a `.dirham-price` component class.

  ```js
  // tailwind.config.js
  import dirhamPlugin from "dirham/tailwind";
  export default { plugins: [dirhamPlugin] };
  ```

- **Next.js font optimization** — new `dirham/next` entry with `dirhamFont` (pre-configured `next/font/local` instance) and `dirhamFontConfig` for manual setup.

  ```tsx
  import { dirhamFont } from "dirham/next";
  <div className={dirhamFont.className}>...</div>
  ```

- **Currency conversion utilities** — new `convertFromAED()`, `convertToAED()`, and `fetchExchangeRates()` in the core entry, plus `useDirhamRate()` React hook for live exchange rates.

  ```ts
  import { convertFromAED } from "dirham";
  const usd = await convertFromAED(100, "USD");
  ```

  ```tsx
  import { useDirhamRate } from "dirham/react";
  const { rate, convert, loading } = useDirhamRate("USD");
  ```

- **VAT helpers** — `addVAT()`, `removeVAT()`, `getVAT()` with UAE's standard 5% rate and configurable precision.

  ```ts
  import { addVAT, removeVAT, getVAT } from "dirham";
  addVAT(100);     // 105
  removeVAT(105);  // 100
  getVAT(100);     // 5
  ```

- **Copy formatted amount** — `copyDirhamAmount()` combines `formatDirham()` with the Clipboard API.

  ```ts
  import { copyDirhamAmount } from "dirham";
  await copyDirhamAmount(1234.5); // copies "د.إ 1,234.50"
  ```

- **`<dirham-input>` Web Component** — masked currency input with auto-formatting, Arabic numeral support, min/max validation.

  ```html
  <dirham-input value="100" min="0" max="999999" decimals="2"></dirham-input>
  ```

- **`DirhamInput` React component** — controlled/uncontrolled masked currency input with `inputMode="decimal"`, paste handling, and integrated symbol display.

  ```tsx
  import { DirhamInput } from "dirham/react";
  <DirhamInput value={100} onChange={(v) => setAmount(v)} />
  ```

- **RTL fix** — `<DirhamPrice>` and `<dirham-price>` now set `dir="rtl"` on the wrapper element for Arabic locales, ensuring correct bidirectional layout.

## 1.3.0

### Minor Changes

- **`<dirham-price>` Web Component** — new framework-agnostic custom element for displaying formatted prices. Works in Vue, Angular, Svelte, and vanilla HTML/JS without any wrapper.

  ```html
  <dirham-price amount="1250"></dirham-price>
  <dirham-price amount="5000000" notation="compact"></dirham-price>
  <dirham-price amount="500" use-code></dirham-price>
  ```

  Attributes: `amount`, `locale`, `decimals`, `notation`, `use-code`, `symbol-size`, `weight`, `currency`

- **Framework integration docs** — added complete Vue, Angular, and Svelte examples for both `<dirham-symbol>` and `<dirham-price>` Web Components

- **`DirhamPrice` className prop** — explicitly documented `className` support for custom styling (Tailwind, CSS modules, etc.)

- **Demo page** — new "Framework Integration" section with code examples for Vue (v2/v3), Angular (v14+), Svelte (v3/v4/v5), and Vanilla JS, plus a `<dirham-price>` attributes reference table

## 1.2.0

### Minor Changes

- Performance & quality improvements

  **Core (`dirham`)**

  - `formatDirham`: cache `Intl.NumberFormat` instances keyed on `locale:decimals` — eliminates repeated object allocation on list renders
  - `parseDirham`: support Arabic-Indic digits (U+0660–U+0669) and Arabic decimal/thousands separators so strings produced by `formatDirham({ locale: "ar-AE" })` round-trip correctly. Accepts an optional `ParseDirhamOptions` argument (`normalizeArabicNumerals`, default `true`) — all existing one-argument calls are unchanged
  - `DIRHAM_WEIGHT_MAP`: now exported from the main `dirham` entry point

  **React (`dirham/react`)**

  - `DirhamSymbol` and `DirhamIcon` are now wrapped with `React.memo` — prevents unnecessary re-renders when parent components re-render with identical props
  - `DirhamIcon` now exports `displayName = "DirhamIcon"`

  **Build**

  - Font variants now build concurrently (`Promise.all`) instead of sequentially — faster CI on multi-core machines

## 1.1.1

### Patch Changes

- [`279a538`](https://github.com/pooyagolchian/dirham/commit/279a5387f43b538d7cb582f83a8279dbd546eb1e) Thanks [@pooyagolchian](https://github.com/pooyagolchian)! - Update demo URL from dirham.vercel.app to pooya.blog/dirham and add missing font variant exports to README.
