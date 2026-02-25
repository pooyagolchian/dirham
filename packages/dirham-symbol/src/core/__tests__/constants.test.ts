import { describe, expect, it } from "vitest";
import {
	DIRHAM_CODEPOINT,
	DIRHAM_CSS_CLASS,
	DIRHAM_CSS_CONTENT,
	DIRHAM_CURRENCY_CODE,
	DIRHAM_FONT_FAMILY,
	DIRHAM_HTML_ENTITY,
	DIRHAM_SYMBOL_TEXT,
	DIRHAM_UNICODE,
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
