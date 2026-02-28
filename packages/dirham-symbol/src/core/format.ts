import {
	DIRHAM_CURRENCY_CODE,
	DIRHAM_SYMBOL_TEXT,
	DIRHAM_UNICODE,
} from "./constants";

// ─── Intl.NumberFormat cache ─────────────────────────────────────────────────
// Constructing Intl.NumberFormat is expensive (~µs). Cache instances keyed on
// "locale:decimals" so repeated calls (e.g., rendering a price list) reuse
// the same formatter instead of allocating a new object each time.
const _fmtCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, decimals: number): Intl.NumberFormat {
	const key = `${locale}:${decimals}`;
	let fmt = _fmtCache.get(key);
	if (!fmt) {
		fmt = new Intl.NumberFormat(locale, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		});
		_fmtCache.set(key, fmt);
	}
	return fmt;
}

/**
 * Options for formatting a Dirham amount.
 */
export interface FormatDirhamOptions {
	/**
	 * Locale string for number formatting.
	 * @default "en-AE"
	 */
	locale?: string;

	/**
	 * Number of decimal places.
	 * @default 2
	 */
	decimals?: number;

	/**
	 * Whether to place the symbol before the amount.
	 * When `undefined`, determined by locale:
	 * - Arabic locales (ar-*): symbol after amount
	 * - Other locales: symbol before amount
	 */
	symbolFirst?: boolean;

	/**
	 * Use ISO currency code (AED) instead of the symbol.
	 * @default false
	 */
	useCode?: boolean;

	/**
	 * Separator between symbol and amount.
	 * @default " " (non-breaking space)
	 */
	separator?: string;
}

/**
 * Format a number as a Dirham currency string.
 *
 * @example
 * ```ts
 * formatDirham(100);          // "\u20C3 100.00"
 * formatDirham(1234.5);       // "\u20C3 1,234.50"
 * formatDirham(100, { locale: "ar-AE" }); // "100.00 \u20C3"
 * formatDirham(100, { useCode: true });   // "AED 100.00"
 * ```
 */
export function formatDirham(
	amount: number,
	options: FormatDirhamOptions = {},
): string {
	if (!Number.isFinite(amount)) {
		throw new RangeError(
			`formatDirham: amount must be a finite number, got ${amount}`,
		);
	}

	const {
		locale = "en-AE",
		decimals = 2,
		useCode = false,
		separator = "\u00A0", // non-breaking space
	} = options;

	const symbol = useCode ? DIRHAM_CURRENCY_CODE : DIRHAM_UNICODE;

	// Determine symbol placement
	let symbolFirst: boolean;
	if (options.symbolFirst !== undefined) {
		symbolFirst = options.symbolFirst;
	} else {
		// Arabic locales place symbol after amount
		symbolFirst = !locale.startsWith("ar");
	}

	// Format the number (use cached formatter)
	const formatted = getFormatter(locale, decimals).format(amount);

	return symbolFirst
		? `${symbol}${separator}${formatted}`
		: `${formatted}${separator}${symbol}`;
}

/**
 * Options for parsing a Dirham-formatted string.
 */
export interface ParseDirhamOptions {
	/**
	 * Normalize Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩ / U+0660–U+0669) to ASCII
	 * digits before parsing. Enables round-tripping strings produced by
	 * `formatDirham` with Arabic locales (e.g. `"ar-AE"`).
	 * @default true
	 */
	normalizeArabicNumerals?: boolean;
}

/**
 * Parse a Dirham-formatted string back to a number.
 * Strips currency symbols, codes, and formatting characters.
 * By default also normalizes Arabic-Indic digits so strings produced by
 * `formatDirham({ locale: "ar-AE" })` round-trip correctly.
 *
 * @example
 * ```ts
 * parseDirham("\u20C3 1,234.50");                  // 1234.5
 * parseDirham("AED 100.00");                        // 100
 * parseDirham("١٬٢٣٤٫٥٠ \u20C3");                  // 1234.5
 * parseDirham("١٠٠٫٠٠ \u20C3", { normalizeArabicNumerals: false }); // throws
 * ```
 */
export function parseDirham(
	value: string,
	options: ParseDirhamOptions = {},
): number {
	const { normalizeArabicNumerals = true } = options;

	let cleaned = value
		.replaceAll(DIRHAM_UNICODE, "")
		.replaceAll(DIRHAM_SYMBOL_TEXT, "")
		.replaceAll(DIRHAM_CURRENCY_CODE, "")
		.replace(/[,\s\u00A0\u066C]/g, "") // ASCII comma, whitespace, NBSP, Arabic thousands sep
		.trim();

	if (normalizeArabicNumerals) {
		// Arabic-Indic digits U+0660–U+0669 → ASCII 0–9
		cleaned = cleaned.replace(
			/[\u0660-\u0669]/g,
			(d) => String(d.charCodeAt(0) - 0x0660),
		);
		// Arabic decimal separator (U+066B) → '.'
		cleaned = cleaned.replace(/\u066B/g, ".");
	}

	const result = Number.parseFloat(cleaned);
	if (Number.isNaN(result)) {
		throw new Error(`Cannot parse "${value}" as a Dirham amount`);
	}
	return result;
}
