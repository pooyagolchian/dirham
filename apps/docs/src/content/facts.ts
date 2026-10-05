/**
 * Key facts about the UAE Dirham sign, shown in the #facts section.
 *
 * The wording matches the "Unicode status" table in packages/dirham-symbol/README.md,
 * the FAQ in faq.json and public/llms.txt. Change them together, and update
 * LAST_VERIFIED when the facts are re-checked against their sources.
 */

/** When the facts, the FAQ answers and the font-support lines were last checked. */
export const LAST_VERIFIED = { iso: "2026-10-05", label: "5 October 2026" };

export const MAINTAINER = {
	name: "Pooya Golchian",
	url: "https://pooyagolchian.com/",
};

/** Primary sources that crawlers can fetch (the CBUAE web pages return 403 to bots). */
export const SOURCES = {
	unicode18: "https://www.unicode.org/versions/Unicode18.0.0/",
	chart: "https://www.unicode.org/charts/PDF/U20A0.pdf",
	utcMinutes: "https://www.unicode.org/L2/L2025/25181.htm#184-C17",
	proposal: "https://www.unicode.org/L2/L2025/25159-uae-dirham-symbol.pdf",
	sewReport:
		"https://www.unicode.org/L2/L2025/25187-sew-recommendations-utc184.pdf",
	cbuaePressRelease:
		"https://centralbank.ae/media/ckkp3s3f/cbuae-unveils-new-dirham-symbol-en.pdf",
	cbuaeGuidelines:
		"https://centralbank.ae/media/e4ebcgtb/the_guidelines_for_the_national_currency_symbol_uae_dirham_english.pdf",
	iso4217:
		"https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
	notoRequest: "https://github.com/notofonts/latin-greek-cyrillic/issues/571",
};

export interface Fact {
	term: string;
	text: string;
	sources: { label: string; href: string }[];
}

export const FACTS: Fact[] = [
	{
		term: "Character",
		text: "U+20C3 UAE DIRHAM SIGN · Currency Symbols block (U+20A0–U+20CF) · General Category Sc (Symbol, Currency) · added in Unicode 18.0 (2026) · UTF-8 E2 83 83 · decimal 8387.",
		sources: [{ label: "Unicode code chart (PDF)", href: SOURCES.chart }],
	},
	{
		term: "Unicode status",
		text: "Accepted by the Unicode Technical Committee on 22 July 2025 (UTC #184, decision 184-C17) and published in Unicode 18.0 on 16 September 2026.",
		sources: [
			{ label: "UTC #184 minutes", href: SOURCES.utcMinutes },
			{ label: "Unicode 18.0.0", href: SOURCES.unicode18 },
		],
	},
	{
		term: "Origin",
		text: "The Central Bank of the UAE (CBUAE) unveiled the Dirham symbol on 27 March 2025: the Latin letter D, from the English name 'Dirham', crossed by two horizontal lines inspired by the UAE flag.",
		sources: [
			{ label: "CBUAE press release (PDF)", href: SOURCES.cbuaePressRelease },
			{ label: "CBUAE guidelines (PDF)", href: SOURCES.cbuaeGuidelines },
		],
	},
	{
		term: "Why 18.0, not 17.0",
		text: "The Central Bank of the UAE submitted the proposal to Unicode itself (L2/25-159, June 2025). It arrived after Unicode 17.0 had entered beta, so the sign was encoded in Unicode 18.0.",
		sources: [{ label: "Proposal L2/25-159 (PDF)", href: SOURCES.proposal }],
	},
	{
		term: "Native display (October 2026)",
		text: "Apple's system fonts do not include U+20C3 yet (checked on macOS 26.6), though they already include the Saudi riyal sign (U+20C1). Google's Noto and Roboto fonts, the fallback fonts on Android, ChromeOS and most Linux desktops, don't include U+20C3 yet. Windows: not yet announced.",
		sources: [{ label: "Noto font request", href: SOURCES.notoRequest }],
	},
	{
		term: "Browsers",
		text: "Browsers don't need an update to show U+20C3; they need a font that has it. Until system fonts do, a web font that covers it (this package's Dirham font, loaded only for U+20C3 via unicode-range) renders it.",
		sources: [],
	},
	{
		term: "Placement",
		text: "Before the amount, separated by a space, at the same height and weight as the digits (U+20C3 + no-break space + 1,234.50). Use either the symbol or the code AED, never both.",
		sources: [
			{ label: "CBUAE guidelines (PDF)", href: SOURCES.cbuaeGuidelines },
		],
	},
	{
		term: "Currency code",
		text: "ISO 4217 code: AED (numeric 784, 2 decimal places).",
		sources: [{ label: "ISO 4217 list (SIX)", href: SOURCES.iso4217 }],
	},
	{
		term: "Digital Dirham mark",
		text: "The coloured Digital Dirham mark is a logo and has no code point.",
		sources: [{ label: "Unicode SEW report (PDF)", href: SOURCES.sewReport }],
	},
];
