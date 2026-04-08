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
	if (!Number.isFinite(amount)) {
		throw new RangeError(
			`addVAT: amount must be a finite number, got ${amount}`,
		);
	}
	const { rate = UAE_VAT_RATE, decimals = 2 } = options;
	const factor = 10 ** decimals;
	return Math.round(amount * (1 + rate) * factor) / factor;
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
	if (!Number.isFinite(amount)) {
		throw new RangeError(
			`removeVAT: amount must be a finite number, got ${amount}`,
		);
	}
	const { rate = UAE_VAT_RATE, decimals = 2 } = options;
	const factor = 10 ** decimals;
	return Math.round((amount / (1 + rate)) * factor) / factor;
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
	if (!Number.isFinite(amount)) {
		throw new RangeError(
			`getVAT: amount must be a finite number, got ${amount}`,
		);
	}
	const { rate = UAE_VAT_RATE, decimals = 2 } = options;
	const factor = 10 ** decimals;
	return Math.round(amount * rate * factor) / factor;
}
