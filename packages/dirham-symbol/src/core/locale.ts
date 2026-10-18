/**
 * Whether a BCP 47 tag names the Arabic language (`ar`, `ar-AE`, `AR-ae`, `ar-u-nu-latn`).
 *
 * A bare `startsWith("ar")` is case-sensitive and also matches unrelated languages such
 * as `arn` (Mapudungun), so compare the language subtag itself.
 */
export function isArabicLocale(locale: string): boolean {
	return /^ar(?:-|$)/i.test(locale);
}
