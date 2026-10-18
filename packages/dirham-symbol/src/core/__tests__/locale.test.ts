import { describe, expect, it } from "vitest";
import { isArabicLocale } from "../locale";

describe("isArabicLocale", () => {
	it("recognises Arabic with and without a region", () => {
		for (const tag of ["ar", "ar-AE", "ar-EG", "ar-SA", "ar-u-nu-latn"]) {
			expect(isArabicLocale(tag), tag).toBe(true);
		}
	});

	it("is case-insensitive, as BCP 47 tags are", () => {
		expect(isArabicLocale("AR-ae")).toBe(true);
		expect(isArabicLocale("Ar")).toBe(true);
	});

	it("does not mistake other languages that merely start with 'ar'", () => {
		// arn = Mapudungun, arp = Arapaho, arw = Arawak
		for (const tag of ["arn-CL", "arn", "arp", "arw-SR"]) {
			expect(isArabicLocale(tag), tag).toBe(false);
		}
	});

	it("is false for everything else", () => {
		for (const tag of ["en-AE", "en", "fa-IR", "he-IL", "de-DE", ""]) {
			expect(isArabicLocale(tag), tag).toBe(false);
		}
	});
});
