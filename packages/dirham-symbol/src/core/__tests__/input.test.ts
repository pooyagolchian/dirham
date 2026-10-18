import { describe, expect, it } from "vitest";
import {
	cleanPaste,
	formatEntry,
	isValidEntry,
	parseEntry,
	plainEntry,
	stripFormatting,
} from "../input";

describe("stripFormatting", () => {
	it("removes grouping, whitespace and currency marks", () => {
		expect(stripFormatting("⃃ 1,234.50")).toBe("1234.50");
		expect(stripFormatting("AED 1 234.5")).toBe("1234.5");
		expect(stripFormatting("1,234.50 د.إ")).toBe("1234.50");
	});

	it("converts Arabic-Indic digits and separators", () => {
		expect(stripFormatting("١٬٢٣٤٫٥٠")).toBe("1234.50");
	});
});

describe("isValidEntry", () => {
	it("accepts entries in progress", () => {
		for (const ok of ["", "-", ".", "5.", "-.5", "12", "1234.56", "-0.5"]) {
			expect(isValidEntry(ok, 2), JSON.stringify(ok)).toBe(true);
		}
	});

	it("rejects letters, a second dot or sign, and extra decimals", () => {
		for (const bad of ["a", "1a", "1.2.3", "--1", "1-", "1.234", "1e3"]) {
			expect(isValidEntry(bad, 2), JSON.stringify(bad)).toBe(false);
		}
	});

	it("allows no decimals when decimals is 0", () => {
		expect(isValidEntry("5.", 0)).toBe(true);
		expect(isValidEntry("5.5", 0)).toBe(false);
	});
});

describe("parseEntry", () => {
	it("returns undefined for an empty or sign-only entry", () => {
		for (const empty of ["", "-", ".", "-."]) {
			expect(parseEntry(empty, 2), JSON.stringify(empty)).toBeUndefined();
		}
	});

	it("parses and rounds to the allowed decimals", () => {
		expect(parseEntry("1234.5", 2)).toBe(1234.5);
		expect(parseEntry("-0.5", 2)).toBe(-0.5);
		expect(parseEntry("1.005", 2)).toBe(1.01);
		expect(parseEntry("5.", 2)).toBe(5);
	});

	it("never returns negative zero", () => {
		expect(Object.is(parseEntry("-0", 2), 0)).toBe(true);
	});
});

describe("cleanPaste", () => {
	it("cleans and truncates", () => {
		expect(cleanPaste("AED 1,234.567", 2)).toBe("1234.56");
		expect(cleanPaste("١٢٫٣٤٥", 2)).toBe("12.34");
		expect(cleanPaste("99", 0)).toBe("99");
		expect(cleanPaste("9.9", 0)).toBe("9.");
	});

	it("ignores empty or unusable text", () => {
		expect(cleanPaste("", 2)).toBeUndefined();
		expect(cleanPaste("AED", 2)).toBeUndefined();
		expect(cleanPaste("abc", 2)).toBeUndefined();
		expect(cleanPaste("1.2.3", 2)).toBeUndefined();
	});
});

describe("formatEntry / plainEntry", () => {
	it("formats with grouping and no forced decimals", () => {
		expect(formatEntry(1234.5, "en-AE", 2)).toBe("1,234.5");
		expect(formatEntry(1234, "en-AE", 2)).toBe("1,234");
	});

	it("is empty for no value", () => {
		for (const none of [null, undefined, Number.NaN]) {
			expect(formatEntry(none, "en-AE", 2)).toBe("");
			expect(plainEntry(none)).toBe("");
		}
	});

	it("shows the bare number for editing", () => {
		expect(plainEntry(1234.5)).toBe("1234.5");
	});
});
