# dirham - Copilot Instructions

## Project Overview

Monorepo for the UAE Dirham (د.إ) currency symbol — published as `dirham` on npm.
Provides a web font (WOFF2/WOFF/TTF), CSS/SCSS, and React components.

## Architecture

- **Turborepo** monorepo with `pnpm` workspaces
- `packages/dirham-symbol/` — the npm package (core utilities, React components, font assets)
- `apps/docs/` — Vite + React demo/documentation site

## Key Technical Details

- **SVG source**: `dirham.svg` at repo root — the canonical glyph
- **Font generation**: `svgtofont` converts SVG → WOFF2/WOFF/TTF at Unicode codepoint U+20C3 (UAE DIRHAM SIGN)
- **Unicode**: U+20C3 — accepted for Unicode 18.0 (expected Sept 2026). The custom web font maps the glyph to this official codepoint now; when OS/font support ships, the web font becomes optional.
- **Build**: `tsup` for TypeScript (ESM + CJS + .d.ts), `svgtofont` for fonts, CSS/SCSS emitted manually
- **Exports**: `dirham` (core), `dirham/react` (components), `dirham/css`, `dirham/scss`, `dirham/font/*`

## Code Style

- **Formatter/Linter**: Biome (not Prettier/ESLint)
- **Indentation**: tabs
- **Quotes**: double quotes
- **Semicolons**: always
- **Trailing commas**: all

## Commands

```bash
pnpm build        # Build all packages
pnpm test         # Run all tests (Vitest)
pnpm format       # Format with Biome
pnpm check        # Lint + format check with Biome
pnpm changeset    # Create a changeset for versioning
```

## React Components

- `DirhamSymbol` — SVG-based, zero runtime deps, SSR-safe. Supports `size`, `color`, `weight`, `aria-label`.
- `DirhamIcon` — Font-based, requires CSS import. Supports `size`, `color`, `as`, `className`.
- Both use `forwardRef` and spread remaining props.

## Weight System

The `weight` prop on `DirhamSymbol` simulates font weight via SVG stroke:

- `thin` through `regular` (100–400): no stroke modification
- `medium` through `black` (500–900): progressive `stroke-width` with `paint-order: stroke`

## Testing

- Vitest with jsdom environment
- Tests in `packages/dirham-symbol/src/__tests__/`
- Core tests: constants validation, format/parse functions
- React tests: `@testing-library/react` for component rendering
