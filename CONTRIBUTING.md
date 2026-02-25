# Contributing to dirham

Thank you for your interest in contributing! This guide walks you through the process.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

### Setup

```bash
# Fork & clone the repo
git clone https://github.com/<your-username>/dirham-symbol.git
cd dirham-symbol

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Development Workflow

### Project Structure

```
dirham-symbol/
├── apps/
│   └── docs/            # Vite demo & documentation site
├── packages/
│   ├── dirham-symbol/   # The published npm package
│   └── tsconfig/        # Shared TypeScript config
├── turbo.json           # Turborepo pipeline config
└── biome.json           # Linter & formatter config
```

### Common Commands

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm build`       | Build all packages                   |
| `pnpm dev`         | Start dev servers (docs + watch)     |
| `pnpm test`        | Run all tests                        |
| `pnpm lint`        | Lint all packages                    |
| `pnpm format`      | Format all files with Biome          |
| `pnpm check`       | Lint + format (auto-fix) with Biome  |

### Running the Demo

```bash
pnpm --filter @dirham/docs dev
# Opens http://localhost:3000
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feat/your-feature
```

Use conventional prefixes: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`.

### 2. Make Your Changes

- **Core utilities** — `packages/dirham-symbol/src/core/`
- **React components** — `packages/dirham-symbol/src/react/`
- **SVG source** — `packages/dirham-symbol/src/svg/dirham.svg`
- **Font build** — `packages/dirham-symbol/scripts/build-font.mjs`
- **Demo site** — `apps/docs/src/`

### 3. Write Tests

Tests live alongside source code in `__tests__/` directories. We use [Vitest](https://vitest.dev/):

```bash
# Run tests once
pnpm test

# Run tests in watch mode
cd packages/dirham-symbol
pnpm vitest
```

### 4. Lint & Format

We use [Biome](https://biomejs.dev/) for linting and formatting — no Prettier or ESLint needed:

```bash
# Check for issues
pnpm check

# Format only
pnpm format
```

### 5. Add a Changeset

We use [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
pnpm changeset
```

Select `dirham`, choose the semver bump type, and write a brief summary. This creates a file in `.changeset/` — commit it with your PR.

**When to bump:**

- `patch` — bug fixes, docs, internal refactors
- `minor` — new features, new exports
- `major` — breaking API changes

### 6. Submit a Pull Request

- Ensure CI passes (build + lint + test)
- Fill out the PR template
- Link any related issues
- Keep PRs focused — one feature or fix per PR

## Code Style

- **TypeScript** — strict mode, no `any`
- **Formatting** — Biome handles it (tabs, double quotes, trailing commas)
- **Imports** — organized by Biome (auto-sorted)
- **Components** — `forwardRef` with explicit prop interfaces
- **Docs** — JSDoc on all public exports

## SVG Guidelines

The Dirham symbol SVG follows the [Central Bank of the UAE guidelines](https://www.centralbank.ae/media/jlhi41xu/dirham_currency_symbol_guideline_english.pdf). When modifying the SVG:

- Maintain the original proportions
- Keep the `viewBox="0 0 1000 870"` aspect ratio
- Optimize with SVGO but preserve visual fidelity
- Test rendering at sizes from 12px to 120px

## Reporting Issues

- Use the [issue templates](https://github.com/dirham-symbol/dirham-symbol/issues/new/choose)
- Include browser/Node version, OS, and reproduction steps
- Screenshots help for rendering issues

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
