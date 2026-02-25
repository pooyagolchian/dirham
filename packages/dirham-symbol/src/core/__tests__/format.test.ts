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
});
