import { describe, expect, it } from "vitest";
import { UAE_VAT_RATE, addVAT, getVAT, removeVAT } from "../vat";

describe("UAE_VAT_RATE", () => {
	it("is 5%", () => {
		expect(UAE_VAT_RATE).toBe(0.05);
	});
});

describe("addVAT", () => {
	it("adds 5% VAT to a round number", () => {
		expect(addVAT(100)).toBe(105);
	});

	it("rounds to 2 decimals by default", () => {
		expect(addVAT(99.99)).toBe(104.99);
	});

	it("accepts a custom rate", () => {
		expect(addVAT(100, { rate: 0.1 })).toBe(110);
	});

	it("accepts custom decimals", () => {
		expect(addVAT(100, { decimals: 0 })).toBe(105);
	});

	it("handles zero", () => {
		expect(addVAT(0)).toBe(0);
	});

	it("handles negative amounts", () => {
		expect(addVAT(-100)).toBe(-105);
	});

	it("throws on NaN", () => {
		expect(() => addVAT(Number.NaN)).toThrow(RangeError);
	});

	it("throws on Infinity", () => {
		expect(() => addVAT(Number.POSITIVE_INFINITY)).toThrow(RangeError);
	});
});

describe("removeVAT", () => {
	it("removes 5% VAT from an inclusive amount", () => {
		expect(removeVAT(105)).toBe(100);
	});

	it("rounds to 2 decimals by default", () => {
		const result = removeVAT(104.99);
		expect(result).toBeCloseTo(99.99, 2);
	});

	it("accepts a custom rate", () => {
		expect(removeVAT(110, { rate: 0.1 })).toBe(100);
	});

	it("throws on NaN", () => {
		expect(() => removeVAT(Number.NaN)).toThrow(RangeError);
	});

	it("throws on -Infinity", () => {
		expect(() => removeVAT(Number.NEGATIVE_INFINITY)).toThrow(RangeError);
	});
});

describe("getVAT", () => {
	it("returns the VAT amount for a pre-VAT price", () => {
		expect(getVAT(100)).toBe(5);
	});

	it("returns correct VAT for fractional amounts", () => {
		expect(getVAT(200)).toBe(10);
	});

	it("accepts a custom rate", () => {
		expect(getVAT(100, { rate: 0.1 })).toBe(10);
	});

	it("handles zero", () => {
		expect(getVAT(0)).toBe(0);
	});

	it("throws on NaN", () => {
		expect(() => getVAT(Number.NaN)).toThrow(RangeError);
	});
});
