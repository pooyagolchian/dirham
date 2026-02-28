import { describe, expect, it } from "vitest";
import {
	DIRHAM_CODEPOINT,
	DIRHAM_CSS_CLASS,
	DIRHAM_CSS_CONTENT,
	DIRHAM_CURRENCY_CODE,
	DIRHAM_FONT_FAMILY,
	DIRHAM_HTML_ENTITY,
	DIRHAM_STROKE_MAP,
	DIRHAM_SYMBOL_TEXT,
	DIRHAM_UNICODE,
	DIRHAM_WEIGHT_MAP,
} from "../constants";

describe("constants", () => {
	it("should export correct unicode value", () => {
		expect(DIRHAM_UNICODE).toBe("\u20C3");
	});

	it("should export correct HTML entity", () => {
		expect(DIRHAM_HTML_ENTITY).toBe("&#x20C3;");
	});

	it("should export correct CSS content value", () => {
		expect(DIRHAM_CSS_CONTENT).toBe("\\20C3");
	});

	it("should export correct currency code", () => {
		expect(DIRHAM_CURRENCY_CODE).toBe("AED");
	});

	it("should export correct Arabic symbol text", () => {
		expect(DIRHAM_SYMBOL_TEXT).toBe("د.إ");
	});

	it("should export correct font family", () => {
		expect(DIRHAM_FONT_FAMILY).toBe("Dirham");
	});

	it("should export correct CSS class", () => {
		expect(DIRHAM_CSS_CLASS).toBe("dirham-symbol");
	});

	it("should export correct codepoint number", () => {
		expect(DIRHAM_CODEPOINT).toBe(0x20c3);
	});
});

describe("DIRHAM_WEIGHT_MAP", () => {
	it("maps thin to 100", () => expect(DIRHAM_WEIGHT_MAP.thin).toBe(100));
	it("maps regular to 400", () => expect(DIRHAM_WEIGHT_MAP.regular).toBe(400));
	it("maps bold to 700", () => expect(DIRHAM_WEIGHT_MAP.bold).toBe(700));
	it("maps black to 900", () => expect(DIRHAM_WEIGHT_MAP.black).toBe(900));
	it("covers all 9 weight steps", () =>
		expect(Object.keys(DIRHAM_WEIGHT_MAP)).toHaveLength(9));
});

describe("DIRHAM_STROKE_MAP", () => {
	it("regular weight has no stroke (strokeWidth 0)", () =>
		expect(DIRHAM_STROKE_MAP.regular).toBe(0));
	it("thin weight has no stroke", () =>
		expect(DIRHAM_STROKE_MAP.thin).toBe(0));
	it("bold weight has positive stroke", () =>
		expect(DIRHAM_STROKE_MAP.bold).toBeGreaterThan(0));
	it("black weight has the largest stroke", () =>
		expect(DIRHAM_STROKE_MAP.black).toBeGreaterThan(DIRHAM_STROKE_MAP.bold));
	it("covers all 9 weight steps", () =>
		expect(Object.keys(DIRHAM_STROKE_MAP)).toHaveLength(9));
});
