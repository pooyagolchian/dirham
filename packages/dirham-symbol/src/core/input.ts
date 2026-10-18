import { DIRHAM_SYMBOL_TEXT, DIRHAM_UNICODE } from "./constants";
import { roundTo } from "./round";

// Text handling shared by the React <DirhamInput> and the <dirham-input> Web
// Component, so the two accept, reject and round exactly the same entries.

/** An entry in progress: optional minus, digits, at most one dot. */
const ENTRY = /^-?\d*\.?\d*$/;

const _formatters = new Map<string, Intl.NumberFormat>();

/** Format a committed value for display while the field is not focused. */
export function formatEntry(
	value: number | null | undefined,
	locale: string,
	decimals: number,
): string {
	if (value === null || value === undefined || !Number.isFinite(value)) {
		return "";
	}
	const key = `${locale}:${decimals}`;
	let formatter = _formatters.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		});
		_formatters.set(key, formatter);
	}
	return formatter.format(value);
}

/** The text shown for editing: the bare number, with no grouping. */
export function plainEntry(value: number | null | undefined): string {
	return value === null || value === undefined || !Number.isFinite(value)
		? ""
		: String(value);
}

/**
 * Reduce typed or pasted text to digits, an optional minus and a dot: Arabic-Indic
 * digits and separators become ASCII, grouping, spaces and currency marks go.
 */
export function stripFormatting(raw: string): string {
	return raw
		.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
		.replace(/٫/g, ".")
		.replace(/[,\s٬]/g, "")
		.replaceAll(DIRHAM_UNICODE, "")
		.replaceAll(DIRHAM_SYMBOL_TEXT, "")
		.replace(/AED/gi, "");
}

/** Whether `cleaned` is a legal entry in progress with at most `decimals` places. */
export function isValidEntry(cleaned: string, decimals: number): boolean {
	if (!ENTRY.test(cleaned)) return false;
	const dot = cleaned.indexOf(".");
	return dot === -1 || cleaned.length - dot - 1 <= decimals;
}

/**
 * The number a finished entry stands for, rounded to `decimals`, or `undefined`
 * when the field is empty or holds only a lone "-" or ".".
 */
export function parseEntry(
	cleaned: string,
	decimals: number,
): number | undefined {
	if (!/\d/.test(cleaned)) return undefined;
	const parsed = Number.parseFloat(cleaned);
	return Number.isNaN(parsed) ? undefined : roundTo(parsed, decimals);
}

/**
 * What a paste contributes: the text cleaned, with decimals beyond `decimals` cut
 * off. `undefined` when nothing usable is left, so the paste is ignored.
 */
export function cleanPaste(raw: string, decimals: number): string | undefined {
	const stripped = stripFormatting(raw);
	if (stripped === "") return undefined;
	const dot = stripped.indexOf(".");
	const text =
		dot === -1
			? stripped
			: `${stripped.slice(0, dot)}.${stripped.slice(dot + 1, dot + 1 + decimals)}`;
	return ENTRY.test(text) ? text : undefined;
}
