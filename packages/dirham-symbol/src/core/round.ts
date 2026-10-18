/**
 * Round `value` to `decimals` places, half away from zero, the way an invoice does.
 *
 * `Math.round(x * 100) / 100` mishandles exact halves whenever the product lands just
 * under them in binary floating point: `0.7 * 0.05` is `0.034999999999999996`, so 3.5
 * fils rounds down to 3. It also rounds negative halves toward positive infinity, so a
 * refund would not mirror its invoice. Trimming the scaled value to 15 significant
 * digits first removes the binary noise, and rounding the absolute value makes the
 * result symmetric. Never returns `-0`.
 *
 * Non-finite values pass through unchanged so callers can reject them with their own
 * error message.
 */
export function roundTo(value: number, decimals: number): number {
	if (!Number.isInteger(decimals) || decimals < 0 || decimals > 100) {
		throw new RangeError(
			`decimals must be an integer from 0 to 100, got ${decimals}`,
		);
	}
	const factor = 10 ** decimals;
	const scaled = Number((Math.abs(value) * factor).toPrecision(15));
	const rounded = Math.round(scaled) / factor;
	return value < 0 && rounded !== 0 ? -rounded : rounded;
}
