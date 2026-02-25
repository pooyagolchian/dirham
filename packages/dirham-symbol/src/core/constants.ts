/**
 * UAE Dirham currency symbol constants.
 *
 * This package maps the Dirham glyph to the official Unicode codepoint U+20C3
 * (UAE DIRHAM SIGN) via a custom web font. The codepoint was accepted by the
 * Unicode Technical Committee for Unicode 18.0 (expected September 2026).
 *
 * Until system fonts ship native U+20C3 glyphs, the bundled web font provides
 * the rendering. When OS/font support lands, the web font becomes optional;
 * zero migration required.
 *
 * @module dirham
 * @see https://www.unicode.org/alloc/Pipeline.html
 */

/** Unicode character for the Dirham symbol (U+20C3, requires Dirham web font until system fonts support it) */
export const DIRHAM_UNICODE = "\u20C3";

/** HTML entity for the Dirham symbol */
export const DIRHAM_HTML_ENTITY = "&#x20C3;";

/** CSS content value for use in `::before` / `::after` pseudo-elements */
export const DIRHAM_CSS_CONTENT = "\\20C3";

/** ISO 4217 currency code for UAE Dirham */
export const DIRHAM_CURRENCY_CODE = "AED";

/** Arabic text representation of the Dirham symbol (د.إ) */
export const DIRHAM_SYMBOL_TEXT = "د.إ";

/** The font family name used for the Dirham web font */
export const DIRHAM_FONT_FAMILY = "Dirham";

/** CSS class name for the Dirham icon */
export const DIRHAM_CSS_CLASS = "dirham-symbol";

/** Unicode codepoint as a number (0x20C3) */
export const DIRHAM_CODEPOINT = 0x20c3;

// ── Font weight mapping ─────────────────────────────────────────────────

/**
 * Supported visual weights for the Dirham symbol SVG component.
 *
 * Because the Dirham symbol is not yet in standard fonts (until Unicode 18.0),
 * weight simulation is applied via SVG stroke to match surrounding text weight,
 * similar to how $, €, £ adapt to their font's weight.
 */
export type DirhamWeight =
	| "thin"
	| "extralight"
	| "light"
	| "regular"
	| "medium"
	| "semibold"
	| "bold"
	| "extrabold"
	| "black";

/**
 * Map from weight name to CSS `font-weight` numeric value.
 * Used for matching the symbol weight to surrounding text.
 */
export const DIRHAM_WEIGHT_MAP: Record<DirhamWeight, number> = {
	thin: 100,
	extralight: 200,
	light: 300,
	regular: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
	black: 900,
};

/**
 * SVG stroke-width values that simulate font weight.
 * Applied with `paint-order: stroke` so stroke renders behind fill.
 */
export const DIRHAM_STROKE_MAP: Record<DirhamWeight, number> = {
	thin: 0,
	extralight: 0,
	light: 0,
	regular: 0,
	medium: 8,
	semibold: 16,
	bold: 24,
	extrabold: 36,
	black: 48,
};
