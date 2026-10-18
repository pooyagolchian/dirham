import { describe, expect, it } from "vitest";
import { roundTo } from "../round";
import { addVAT, getVAT, removeVAT } from "../vat";

// Exact half-up rounding of num/den in integer arithmetic, so no floating point
// is involved in the expected values. Everything is counted in fils (cents).
const halfUp = (num: number, den: number) =>
	Math.floor((2 * num + den) / (2 * den));

// Half away from zero: a credit note must mirror its invoice.
const awayFromZero = (cents: number, num: number, den: number) =>
	Math.sign(cents) * halfUp(Math.abs(cents) * num, den);

describe("roundTo", () => {
	it("rounds exact decimal halves up even when binary floats land just below", () => {
		// 0.7 * 0.05 = 0.034999999999999996 in IEEE 754
		expect(roundTo(0.7 * 0.05, 2)).toBe(0.04);
		// 1.005 * 100 = 100.49999999999999
		expect(roundTo(1.005, 2)).toBe(1.01);
		expect(roundTo(4.3 * 1.05, 2)).toBe(4.52);
	});

	it("rounds half away from zero, so negatives mirror positives", () => {
		expect(roundTo(-0.035, 2)).toBe(-0.04);
		expect(roundTo(-1.005, 2)).toBe(-1.01);
		expect(roundTo(-2.5, 0)).toBe(-3);
		expect(roundTo(2.5, 0)).toBe(3);
	});

	it("never returns negative zero", () => {
		expect(Object.is(roundTo(-0.001, 2), 0)).toBe(true);
		expect(Object.is(roundTo(-0, 2), 0)).toBe(true);
	});

	it("honours the requested number of decimals", () => {
		expect(roundTo(1.23456, 4)).toBe(1.2346);
		expect(roundTo(1234.5, 0)).toBe(1235);
		expect(roundTo(0.1 + 0.2, 2)).toBe(0.3);
	});

	it("passes non-finite values through for callers to reject", () => {
		expect(roundTo(Number.NaN, 2)).toBeNaN();
		expect(roundTo(Number.POSITIVE_INFINITY, 2)).toBe(Number.POSITIVE_INFINITY);
	});

	it("rejects an invalid number of decimals", () => {
		expect(() => roundTo(1, -1)).toThrow(RangeError);
		expect(() => roundTo(1, 1.5)).toThrow(RangeError);
		expect(() => roundTo(1, Number.NaN)).toThrow(RangeError);
	});
});

describe("VAT rounding matches exact decimal arithmetic", () => {
	// -200.00 .. 200.00 in 1 fils steps, 40,001 amounts per function.
	const cents = Array.from({ length: 40001 }, (_, i) => i - 20000);

	it("getVAT: 5% of the amount", () => {
		const wrong = cents.filter(
			(c) => Math.round(getVAT(c / 100) * 100) !== awayFromZero(c, 5, 100),
		);
		expect(wrong).toEqual([]);
	});

	it("addVAT: amount plus 5%", () => {
		const wrong = cents.filter(
			(c) => Math.round(addVAT(c / 100) * 100) !== awayFromZero(c, 105, 100),
		);
		expect(wrong).toEqual([]);
	});

	it("removeVAT: amount divided by 1.05", () => {
		const wrong = cents.filter(
			(c) => Math.round(removeVAT(c / 100) * 100) !== awayFromZero(c, 100, 105),
		);
		expect(wrong).toEqual([]);
	});

	it("never produces negative zero", () => {
		for (const c of [-1, -2, -9]) {
			expect(Object.is(getVAT(c / 1000), -0)).toBe(false);
		}
	});

	it("keeps the documented examples", () => {
		expect(addVAT(100)).toBe(105);
		expect(addVAT(99.99)).toBe(104.99);
		expect(removeVAT(105)).toBe(100);
		expect(getVAT(200)).toBe(10);
		expect(addVAT(100, { rate: 0.1 })).toBe(110);
	});

	it("these amounts were off by one fils before the shared rounding", () => {
		expect(getVAT(0.7)).toBe(0.04);
		expect(getVAT(2.9)).toBe(0.15);
		expect(addVAT(4.3)).toBe(4.52);
		expect(addVAT(17.9)).toBe(18.8);
	});
});
