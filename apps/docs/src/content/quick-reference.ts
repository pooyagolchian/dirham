/**
 * Rows of the quick-reference table (#quick-reference). Text between backticks renders
 * as code. Where a row also appears in the Quick reference of
 * packages/dirham-symbol/README.md, the wording is the same.
 *
 * Escapes are written with an escaped backslash ("\\u20C3"), so the page shows the
 * ASCII escape, never the raw glyph.
 */
export interface ReferenceRow {
	label: string;
	value: string;
}

export const QUICK_REFERENCE: ReferenceRow[] = [
	{ label: "Code point", value: "U+20C3 UAE DIRHAM SIGN" },
	{
		label: "Block, category",
		value:
			"Currency Symbols (U+20A0–U+20CF), General Category Sc (Symbol, Currency)",
	},
	{ label: "Unicode version", value: "18.0, released 16 September 2026" },
	{
		label: "HTML",
		value:
			"`&#x20C3;` or `&#8387;` (numeric character reference; there is no named entity)",
	},
	{ label: "CSS", value: '`content: "\\20C3";`' },
	{
		label: "JavaScript / JSON",
		value: '`"\\u20C3"` (JavaScript also accepts `"\\u{20C3}"`)',
	},
	{ label: "URL encoding", value: "`%E2%83%83`" },
	{ label: "UTF-8 bytes", value: "`E2 83 83`" },
	{ label: "UTF-16, decimal", value: "`20C3`, `8387`" },
	{ label: "Excel", value: "`=UNICHAR(8387)`" },
	{ label: "Word for Windows", value: "Type `20C3`, then press Alt+X" },
	{
		label: "Currency code",
		value: "AED (ISO 4217, numeric 784, 2 decimal places)",
	},
	{
		label: "Arabic abbreviation",
		value: "د.إ, short for درهم إماراتي (Emirati dirham); it is not the sign",
	},
	{
		label: "Placement",
		value:
			"Before the amount, with a space: `formatDirham(1234.5)` returns the sign, a no-break space, then `1,234.50`",
	},
	{
		label: "Emoji",
		value:
			"None. U+20C3 is a currency symbol (General Category Sc), not an emoji",
	},
	{
		label: "Native display",
		value:
			"Not yet in Apple's or Google's system fonts (October 2026); use the web font or `<DirhamSymbol />`",
	},
];
