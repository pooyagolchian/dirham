import { formatDirham, type FormatDirhamOptions } from "./format";

/**
 * Copy a formatted Dirham amount to the clipboard.
 *
 * Combines `formatDirham()` with the Clipboard API so users can
 * paste a fully formatted price (e.g. "ৃ 1,234.50") into documents.
 *
 * @example
 * ```ts
 * import { copyDirhamAmount } from "dirham";
 *
 * await copyDirhamAmount(1234.5);                      // copies "ৃ 1,234.50"
 * await copyDirhamAmount(1234.5, { useCode: true });   // copies "AED 1,234.50"
 * await copyDirhamAmount(500, { locale: "ar-AE" });    // copies "500.00 ৃ"
 * ```
 *
 * @returns A promise that resolves when the text is on the clipboard.
 * @throws If the Clipboard API is unavailable or the amount is not finite.
 */
export async function copyDirhamAmount(
	amount: number,
	options: FormatDirhamOptions = {},
): Promise<void> {
	if (typeof navigator === "undefined" || !navigator.clipboard) {
		throw new Error(
			"copyDirhamAmount: Clipboard API is not available in this environment",
		);
	}
	const text = formatDirham(amount, options);
	await navigator.clipboard.writeText(text);
}
