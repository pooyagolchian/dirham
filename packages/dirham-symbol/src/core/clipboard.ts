import {
	DIRHAM_CSS_CONTENT,
	DIRHAM_HTML_ENTITY,
	DIRHAM_SYMBOL_TEXT,
	DIRHAM_UNICODE,
} from "./constants";

/**
 * Format of the Dirham symbol to copy.
 *
 * - `"unicode"` — the character itself (`\u20C3`)
 * - `"html"` — HTML entity (`&#x20C3;`)
 * - `"css"` — CSS content value (`\\20C3`)
 * - `"arabic"` — Arabic text (د.إ)
 */
export type DirhamCopyFormat = "unicode" | "html" | "css" | "arabic";

const FORMAT_MAP: Record<DirhamCopyFormat, string> = {
	unicode: DIRHAM_UNICODE,
	html: DIRHAM_HTML_ENTITY,
	css: DIRHAM_CSS_CONTENT,
	arabic: DIRHAM_SYMBOL_TEXT,
};

/**
 * Copy the Dirham symbol to the clipboard in the specified format.
 *
 * @returns A promise that resolves when the text is on the clipboard.
 * @throws If the Clipboard API is unavailable (e.g. non-browser environment).
 *
 * @example
 * ```ts
 * import { copyDirhamSymbol } from "dirham";
 *
 * await copyDirhamSymbol();          // copies "\u20C3"
 * await copyDirhamSymbol("html");    // copies "&#x20C3;"
 * await copyDirhamSymbol("css");     // copies "\\20C3"
 * ```
 */
export async function copyDirhamSymbol(
	format: DirhamCopyFormat = "unicode",
): Promise<void> {
	const text = FORMAT_MAP[format];
	if (typeof navigator === "undefined" || !navigator.clipboard) {
		throw new Error(
			"copyDirhamSymbol: Clipboard API is not available in this environment",
		);
	}
	await navigator.clipboard.writeText(text);
}
