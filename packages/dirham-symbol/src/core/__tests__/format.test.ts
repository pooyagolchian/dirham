import { describe, expect, it } from "vitest";
import { formatDirham, parseDirham } from "../format";

const SYM = "\u20C3"; // U+20C3 — UAE DIRHAM SIGN

describe("formatDirham", () => {
	it("should format basic amount with symbol", () => {
		const result = formatDirham(100);
		expect(result).toContain(SYM);
		expect(result).toContain("100.00");
	});

	it("should format with thousands separator", () => {
		const result = formatDirham(1234567.89);
		expect(result).toContain(SYM);
	});

	it("should use AED code when useCode is true", () => {
		const result = formatDirham(100, { useCode: true });
		expect(result).toContain("AED");
		expect(result).not.toContain(SYM);
	});

	it("should place symbol after amount for Arabic locales", () => {
		const result = formatDirham(100, { locale: "ar-AE" });
		// In Arabic locale, symbol should come after the number
		const parts = result.split("\u00A0");
		expect(parts[parts.length - 1]).toBe(SYM);
	});

	it("should place symbol before amount for English locales", () => {
		const result = formatDirham(100, { locale: "en-AE" });
		expect(result.startsWith(SYM)).toBe(true);
	});

	it("should respect custom decimals", () => {
		const result = formatDirham(100, { decimals: 0 });
		expect(result).toContain("100");
		expect(result).not.toContain("100.00");
	});

	it("should respect symbolFirst override", () => {
		const result = formatDirham(100, {
			locale: "ar-AE",
			symbolFirst: true,
		});
		expect(result.startsWith(SYM)).toBe(true);
	});

	it("should throw on NaN input", () => {
		expect(() => formatDirham(Number.NaN)).toThrow(RangeError);
	});

	it("should throw on Infinity input", () => {
		expect(() => formatDirham(Number.POSITIVE_INFINITY)).toThrow(RangeError);
	});

	it("should throw on -Infinity input", () => {
		expect(() => formatDirham(Number.NEGATIVE_INFINITY)).toThrow(RangeError);
	});

	it("should format with compact notation", () => {
		const result = formatDirham(1500000, { notation: "compact" });
		expect(result).toContain(SYM);
		// Should contain abbreviated form like 1.5M or 2M
		expect(result).toMatch(/[MK]/i);
	});

	it("should format small numbers with compact notation as full digits", () => {
		const result = formatDirham(100, { notation: "compact" });
		expect(result).toContain(SYM);
		expect(result).toContain("100");
	});

	it("should format compact with useCode", () => {
		const result = formatDirham(2000000, {
			notation: "compact",
			useCode: true,
		});
		expect(result).toContain("AED");
		expect(result).toMatch(/[MK]/i);
	});
});

describe("parseDirham", () => {
	it("should parse formatted dirham string", () => {
		expect(parseDirham(`${SYM} 100.00`)).toBe(100);
	});

	it("should parse AED formatted string", () => {
		expect(parseDirham("AED 100.00")).toBe(100);
	});

	it("should parse amounts with thousands separators", () => {
		expect(parseDirham(`${SYM} 1,234.50`)).toBe(1234.5);
	});

	it("should throw on invalid input", () => {
		expect(() => parseDirham("invalid")).toThrow();
	});

	it("should parse string with multiple symbol occurrences", () => {
		// replaceAll fix: previously only first occurrence was stripped
		expect(parseDirham(`${SYM}${SYM} 100.00`)).toBe(100);
	});

	it("should parse string with multiple AED occurrences", () => {
		// replaceAll fix: previously only first AED was stripped
		expect(parseDirham("AED AED 100.00")).toBe(100);
	});

	it("should parse Arabic-Indic digits (ar-AE round-trip)", () => {
		// formatDirham with ar-AE locale produces Arabic-Indic digits
		const formatted = formatDirham(1234.5, { locale: "ar-AE" });
		expect(parseDirham(formatted)).toBe(1234.5);
	});

	it("should parse standalone Arabic-Indic digit string", () => {
		// \u0661\u066C\u0662\u0663\u0664\u066B\u0665\u0660 = ١٬٢٣٤٫٥٠ (1,234.50 in Arabic)
		const arabicValue =
			"\u0661\u066C\u0662\u0663\u0664\u066B\u0665\u0660 \u20C3";
		expect(parseDirham(arabicValue)).toBe(1234.5);
	});

	it("should throw when normalizeArabicNumerals is false and input has Arabic digits", () => {
		const arabicValue = "\u0661\u0660\u0660\u066B\u0660\u0660 \u20C3";
		expect(() =>
			parseDirham(arabicValue, { normalizeArabicNumerals: false }),
		).toThrow();
	});
});

describe("formatDirham edge cases", () => {
	it("does not print a minus sign for amounts that round to zero", () => {
		expect(formatDirham(-0.001)).toBe(`${SYM} 0.00`);
		expect(formatDirham(-0)).toBe(`${SYM} 0.00`);
	});

	it("still prints the minus sign for real negative amounts", () => {
		expect(formatDirham(-100)).toBe(`${SYM} -100.00`);
	});

	it("treats a locale as Arabic only when its language is Arabic", () => {
		expect(formatDirham(100, { locale: "ar-AE" })).toBe(`100.00 ${SYM}`);
		expect(formatDirham(100, { locale: "AR-ae" })).toBe(`100.00 ${SYM}`);
		// Mapudungun starts with "ar" but is not Arabic
		expect(formatDirham(100, { locale: "arn-CL" }).startsWith(SYM)).toBe(true);
	});
});

describe("parseDirham strictness", () => {
	it("rejects text that is not purely an amount", () => {
		for (const bad of [
			"12abc",
			"1.2.3",
			"AED 100 USD 5",
			"1e3",
			"--5",
			"1-",
			"",
			".",
			"-",
			"AED",
		]) {
			expect(() => parseDirham(bad), JSON.stringify(bad)).toThrow(
				"Cannot parse",
			);
		}
	});

	it("accepts the number shapes people actually type", () => {
		expect(parseDirham("+100")).toBe(100);
		expect(parseDirham("-100.5")).toBe(-100.5);
		expect(parseDirham(".5")).toBe(0.5);
		expect(parseDirham("5.")).toBe(5);
		expect(parseDirham("AED -1,234.50")).toBe(-1234.5);
		expect(parseDirham(`-${SYM} 5`)).toBe(-5);
		expect(parseDirham("12,34,567.50")).toBe(1234567.5); // Indian grouping
	});

	it("never returns negative zero", () => {
		expect(Object.is(parseDirham("-0"), 0)).toBe(true);
		expect(Object.is(parseDirham("-0.00"), 0)).toBe(true);
	});

	it("refuses to guess when separators appear in the European order", () => {
		// "1.234,50" without a locale used to come back as 1.2345, silently
		expect(() => parseDirham("1.234,50")).toThrow(/locale/);
	});
});

describe("parseDirham with a locale", () => {
	it("reads the exact string formatDirham('de-DE') produces", () => {
		const text = `${SYM} 1.234,50`;
		expect(formatDirham(1234.5, { locale: "de-DE" })).toBe(text);
		expect(parseDirham(text, { locale: "de-DE" })).toBe(1234.5);
	});

	it("round-trips formatDirham for positive and negative amounts", () => {
		const locales = [
			"en-AE",
			"en-US",
			"en-IN",
			"ar-AE",
			"ar-EG",
			"ar-SA",
			"de-DE",
			"fr-FR",
			"es-ES",
			"sv-SE",
			"de-CH",
		];
		const amounts = [0, 0.5, 7, 1234.5, 1000000.25, -7, -1234.5, -1000000.25];
		const failures: string[] = [];
		for (const locale of locales) {
			for (const amount of amounts) {
				const text = formatDirham(amount, { locale });
				try {
					const back = parseDirham(text, { locale });
					if (back !== amount) failures.push(`${locale} ${text} -> ${back}`);
				} catch (error) {
					failures.push(`${locale} ${JSON.stringify(text)} threw ${error}`);
				}
			}
		}
		expect(failures).toEqual([]);
	});

	it("round-trips with the code instead of the sign", () => {
		const text = formatDirham(1234.5, { locale: "de-DE", useCode: true });
		expect(parseDirham(text, { locale: "de-DE" })).toBe(1234.5);
	});

	it("rejects the English order when told the locale is German", () => {
		expect(() => parseDirham("1,234.50", { locale: "de-DE" })).toThrow();
	});

	it("keeps the default English reading when no locale is given", () => {
		expect(parseDirham(`${SYM} 1,234.50`)).toBe(1234.5);
	});
});
