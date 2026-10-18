import { roundTo } from "./round";
import { assertFiniteAmount } from "./validate";

/**
 * UAE VAT rate (5%).
 * @see https://tax.gov.ae/en/taxes/vat.aspx
 */
export const UAE_VAT_RATE = 0.05;

/**
 * Options for VAT calculation.
 */
export interface VATOptions {
	/**
	 * VAT rate as a decimal (e.g. 0.05 for 5%).
	 * @default 0.05 (UAE standard rate)
	 */
	rate?: number;

	/**
	 * Number of decimal places to round the result to.
	 * Rounds half away from zero, so a refund mirrors its invoice.
	 * @default 2
	 */
	decimals?: number;
}

/**
 * Add VAT to an amount.
 *
 * @example
 * ```ts
 * addVAT(100);           // 105
 * addVAT(100, { rate: 0.1 }); // 110
 * addVAT(99.99);         // 104.99
 * ```
 */
export function addVAT(amount: number, options: VATOptions = {}): number {
	assertFiniteAmount("addVAT", amount);
	const { rate = UAE_VAT_RATE, decimals = 2 } = options;
	return roundTo(amount * (1 + rate), decimals);
}

/**
 * Remove VAT from a VAT-inclusive amount.
 * Returns the original pre-VAT amount.
 *
 * @example
 * ```ts
 * removeVAT(105);         // 100
 * removeVAT(110, { rate: 0.1 }); // 100
 * ```
 */
export function removeVAT(amount: number, options: VATOptions = {}): number {
	assertFiniteAmount("removeVAT", amount);
	const { rate = UAE_VAT_RATE, decimals = 2 } = options;
	return roundTo(amount / (1 + rate), decimals);
}

/**
 * Get the VAT amount from a pre-VAT price.
 *
 * @example
 * ```ts
 * getVAT(100);  // 5
 * getVAT(200);  // 10
 * ```
 */
export function getVAT(amount: number, options: VATOptions = {}): number {
	assertFiniteAmount("getVAT", amount);
	const { rate = UAE_VAT_RATE, decimals = 2 } = options;
	return roundTo(amount * rate, decimals);
}
