# dirham

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
