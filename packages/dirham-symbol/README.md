# dirham

UAE Dirham (د.إ) currency symbol as a web font, CSS, and React component.

See the [full documentation](https://github.com/AhmedAlsudworker/dirham-symbol#readme).

## Quick Start

```bash
pnpm add dirham
```

```tsx
// SVG Component (recommended — SSR-safe, no font loading)
import { DirhamSymbol } from "dirham/react";
<DirhamSymbol size={16} />;

// Font Icon (requires CSS import)
import "dirham/css";
import { DirhamIcon } from "dirham/react";
<DirhamIcon size={16} />;

// Utilities
import { formatDirham } from "dirham";
formatDirham(100); // => "د.إ 100.00"
```

## License

MIT — SVG source is CC0 Public Domain.
