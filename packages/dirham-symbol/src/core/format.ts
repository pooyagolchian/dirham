import {
	DIRHAM_CURRENCY_CODE,
	DIRHAM_SYMBOL_TEXT,
	DIRHAM_UNICODE,
} from "./constants";
import { isArabicLocale } from "./locale";
import { assertFiniteAmount } from "./validate";

// ─── Intl.NumberFormat cache ─────────────────────────────────────────────────
// Constructing Intl.NumberFormat is expensive (~µs). Cache instances keyed on
// "locale:decimals" so repeated calls (e.g., rendering a price list) reuse
// the same formatter instead of allocating a new object each time.
const _fmtCache = new Map<string, Intl.NumberFormat>();

// Without this, -0.001 prints as "-0.00", which reads as a negative amount.
// "negative" is newer than this project's ES2021 typings, hence the cast;
// runtimes that predate the option ignore it and keep the old output.
const HIDE_NEGATIVE_ZERO = {
	signDisplay: "negative",
} as unknown as Intl.NumberFormatOptions;

function getFormatter(
	locale: string,
	decimals: number,
	notation: "standard" | "compact" = "standard",
): Intl.NumberFormat {
	const key = `${locale}:${decimals}:${notation}`;
	let fmt = _fmtCache.get(key);
	if (!fmt) {
		fmt = new Intl.NumberFormat(locale, {
			minimumFractionDigits: notation === "compact" ? 0 : decimals,
			maximumFractionDigits: decimals,
			...HIDE_NEGATIVE_ZERO,
			...(notation === "compact" && {
				notation: "compact",
				compactDisplay: "short",
			}),
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
	 * @default "\u{A0}" (no-break space)
	 */
	separator?: string;

	/**
	 * Number notation style.
	 * - `"standard"` — full digits (e.g. 1,500,000.00)
	 * - `"compact"` — abbreviated (e.g. 1.5M)
	 * @default "standard"
	 */
	notation?: "standard" | "compact";
}

/**
 * Format a number as a Dirham currency string.
 *
 * @example
 * ```ts
 * formatDirham(100);          // "\u{20C3}\u{A0}100.00"
 * formatDirham(1234.5);       // "\u{20C3}\u{A0}1,234.50"
 * formatDirham(100, { locale: "ar-AE" }); // "100.00\u{A0}\u{20C3}"
 * formatDirham(100, { useCode: true });   // "AED\u{A0}100.00"
 * formatDirham(1500000, { notation: "compact" }); // "\u{20C3}\u{A0}1.5M"
 * ```
 */
export function formatDirham(
	amount: number,
	options: FormatDirhamOptions = {},
): string {
	assertFiniteAmount("formatDirham", amount);

	const {
		locale = "en-AE",
		decimals = 2,
		useCode = false,
		separator = "\u00A0", // non-breaking space
		notation = "standard",
	} = options;

	const symbol = useCode ? DIRHAM_CURRENCY_CODE : DIRHAM_UNICODE;

	// Arabic locales place the symbol after the amount
	const symbolFirst = options.symbolFirst ?? !isArabicLocale(locale);

	const formatted = getFormatter(locale, decimals, notation).format(amount);

	return symbolFirst
		? `${symbol}${separator}${formatted}`
		: `${formatted}${separator}${symbol}`;
}

/**
 * The number part of a price, without the sign, for components that draw the
 * sign themselves. Shows "\u2014" for a value that is not finite, so a bad prop
 * renders a dash instead of throwing from inside a render.
 *
 * Internal: not exported from the package entry points.
 */
export function formatAmountText(
	amount: number,
	options: Pick<FormatDirhamOptions, "locale" | "decimals" | "notation"> = {},
): string {
	if (!Number.isFinite(amount)) return "\u2014";
	const { locale = "en-AE", decimals = 2, notation = "standard" } = options;
	return getFormatter(locale, decimals, notation).format(amount);
}

/**
 * Options for parsing a Dirham-formatted string.
 */
export interface ParseDirhamOptions {
	/**
	 * Normalize Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩ / U+0660–U+0669) to ASCII
	 * digits before parsing. Enables round-tripping strings produced by
	 * `formatDirham` with Arabic locales (e.g. `"ar-EG"`).
	 * @default true
	 */
	normalizeArabicNumerals?: boolean;

	/**
	 * Locale whose number format the text is written in, for example `"de-DE"`
	 * for `"1.234,50"`. Pass the same `locale` you gave `formatDirham`.
	 *
	 * Without it the text is read in the English format (`,` groups digits, `.`
	 * starts the decimals). Text that is clearly in the opposite order, such as
	 * `"1.234,50"`, is then rejected instead of being misread as `1.2345`.
	 */
	locale?: string;
}

/** The group and decimal separators `locale` writes numbers with (English when unset). */
function getSeparators(locale: string | undefined): {
	group: string;
	decimal: string;
} {
	if (locale === undefined) return { group: ",", decimal: "." };
	const parts = new Intl.NumberFormat(locale).formatToParts(11111.1);
	return {
		group: parts.find((part) => part.type === "group")?.value ?? "",
		decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
	};
}

const PLAIN_NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;

/**
 * Parse a Dirham-formatted string back to a number.
 * Strips the currency sign, code and Arabic abbreviation, the digit group
 * separators and any whitespace, then requires what is left to be a plain
 * number. Text that is not purely an amount (`"12abc"`, `"1.2.3"`, `"1e3"`)
 * throws instead of being read as its leading digits.
 *
 * By default also normalizes Arabic-Indic digits so strings produced by
 * `formatDirham` with an Arabic locale round-trip. For locales that group with
 * `.` and use `,` for decimals (German, Spanish, Turkish...) pass `locale`.
 *
 * @example
 * ```ts
 * parseDirham("\u20C3 1,234.50");                  // 1234.5
 * parseDirham("AED 100.00");                        // 100
 * parseDirham("١٬٢٣٤٫٥٠ \u20C3");                  // 1234.5
 * parseDirham("\u20C3\u00A01.234,50", { locale: "de-DE" }); // 1234.5
 * parseDirham("1.234,50");                          // throws: pass { locale }
 * parseDirham("12abc");                             // throws
 * ```
 */
export function parseDirham(
	value: string,
	options: ParseDirhamOptions = {},
): number {
	const { normalizeArabicNumerals = true, locale } = options;
	const { group, decimal } = getSeparators(locale);

	let text = value
		.replaceAll(DIRHAM_UNICODE, "")
		.replaceAll(DIRHAM_SYMBOL_TEXT, "")
		.replaceAll(DIRHAM_CURRENCY_CODE, "")
		// Whitespace (including the no-break and narrow no-break spaces some locales
		// group with) and the invisible bidi marks Arabic locales put around a sign.
		.replace(/[\s\u200E\u200F\u061C]/g, "")
		// The typographic minus that sv-SE, nb-NO and others use.
		.replaceAll("\u2212", "-")
		// Arabic thousands separator
		.replaceAll("\u066C", group);

	if (normalizeArabicNumerals) {
		text = text
			.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
			// Arabic decimal separator
			.replaceAll("\u066B", decimal);
	}

	const [integer, fraction, ...extra] = text.split(decimal);
	// A group separator after the decimal point means the separators are in the
	// wrong order for this format ("1.234,50" read as English).
	const misordered =
		group !== "" && fraction !== undefined && fraction.includes(group);
	const digits = group === "" ? integer : integer.split(group).join("");
	const plain = fraction === undefined ? digits : `${digits}.${fraction}`;

	if (misordered || extra.length > 0 || !PLAIN_NUMBER.test(plain)) {
		const hint = misordered
			? `; its separators are in the wrong order for ${locale ?? "the English format"}, pass { locale } to read other formats`
			: "";
		throw new Error(`Cannot parse "${value}" as a Dirham amount${hint}`);
	}

	const result = Number(plain);
	// Number("-0") is -0; an amount of zero has no sign.
	return result === 0 ? 0 : result;
}
