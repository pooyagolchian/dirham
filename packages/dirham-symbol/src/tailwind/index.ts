import plugin from "tailwindcss/plugin";

/**
 * Tailwind CSS plugin for the UAE Dirham symbol.
 *
 * Provides utility classes for rendering the Dirham symbol (U+20C3)
 * with proper font-family, weight, and sizing.
 *
 * @example
 * ```ts
 * // tailwind.config.ts
 * import dirhamPlugin from "dirham/tailwind";
 *
 * export default {
 *   plugins: [dirhamPlugin],
 * };
 * ```
 *
 * Then in HTML:
 * ```html
 * <span class="dirham">ৃ</span>
 * <span class="dirham dirham-bold dirham-lg">ৃ</span>
 * <span class="dirham-before">1,234.50</span>
 * ```
 */
const dirhamPlugin = plugin(({ addUtilities, addComponents }) => {
	// Base class — sets font-family so the U+20C3 glyph renders
	addUtilities({
		".dirham": {
			fontFamily: "Dirham, sans-serif",
			fontStyle: "normal",
			display: "inline-block",
			verticalAlign: "middle",
		},
	});

	// Weight utilities
	addUtilities({
		".dirham-thin": { fontWeight: "100" },
		".dirham-extralight": { fontWeight: "200" },
		".dirham-light": { fontWeight: "300" },
		".dirham-regular": { fontWeight: "400" },
		".dirham-medium": { fontWeight: "500" },
		".dirham-semibold": { fontWeight: "600" },
		".dirham-bold": { fontWeight: "700" },
		".dirham-extrabold": { fontWeight: "800" },
		".dirham-black": { fontWeight: "900" },
	});

	// Size utilities
	addUtilities({
		".dirham-xs": { fontSize: "0.75rem" },
		".dirham-sm": { fontSize: "0.875rem" },
		".dirham-base": { fontSize: "1rem" },
		".dirham-lg": { fontSize: "1.125rem" },
		".dirham-xl": { fontSize: "1.25rem" },
		".dirham-2xl": { fontSize: "1.5rem" },
		".dirham-3xl": { fontSize: "1.875rem" },
		".dirham-4xl": { fontSize: "2.25rem" },
	});

	// Pseudo-element utilities — prepend/append the symbol
	addUtilities({
		".dirham-before::before": {
			content: '"\\20C3\\00A0"',
			fontFamily: "Dirham, sans-serif",
			fontStyle: "normal",
		},
		".dirham-after::after": {
			content: '"\\00A0\\20C3"',
			fontFamily: "Dirham, sans-serif",
			fontStyle: "normal",
		},
	});

	// Component: price display with nowrap
	addComponents({
		".dirham-price": {
			whiteSpace: "nowrap",
			fontVariantNumeric: "tabular-nums",
		},
	});
});

export default dirhamPlugin;
