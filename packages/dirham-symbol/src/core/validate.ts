/** Throw a `RangeError` naming `caller` unless `amount` is a finite number. */
export function assertFiniteAmount(caller: string, amount: number): void {
	if (!Number.isFinite(amount)) {
		throw new RangeError(
			`${caller}: amount must be a finite number, got ${amount}`,
		);
	}
}
