import {
	DIRHAM_CURRENCY_CODE,
	DIRHAM_SYMBOL_TEXT,
	DIRHAM_UNICODE,
} from "./constants";

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

	// Format the number
	const formatted = new Intl.NumberFormat(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(amount);

	return symbolFirst
		? `${symbol}${separator}${formatted}`
		: `${formatted}${separator}${symbol}`;
}

/**
 * Parse a Dirham-formatted string back to a number.
 * Strips currency symbols, codes, and formatting characters.
 *
 * @example
 * ```ts
 * parseDirham("\u20C3 1,234.50"); // 1234.5
 * parseDirham("AED 100.00");      // 100
 * ```
 */
export function parseDirham(value: string): number {
	const cleaned = value
		.replace(DIRHAM_UNICODE, "")
		.replace(DIRHAM_SYMBOL_TEXT, "")
		.replace(DIRHAM_CURRENCY_CODE, "")
		.replace(/[,\s\u00A0]/g, "")
		.trim();

	const result = Number.parseFloat(cleaned);
	if (Number.isNaN(result)) {
		throw new Error(`Cannot parse "${value}" as a Dirham amount`);
	}
	return result;
}
