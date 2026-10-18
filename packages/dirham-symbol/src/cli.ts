import { execSync } from "node:child_process";

const SYMBOL = "\u20C3";
const CODEPOINT = "U+20C3";
const HTML_ENTITY = "&#x20C3;";
const CSS_CONTENT = "\\20C3";
const JS_ESCAPE = "\\u20C3";
const ARABIC = "د.إ";
const CURRENCY_CODE = "AED";

const FORMATS = {
	unicode: SYMBOL,
	html: HTML_ENTITY,
	css: CSS_CONTENT,
	js: JS_ESCAPE,
	arabic: ARABIC,
	code: CURRENCY_CODE,
};
type Format = keyof typeof FORMATS;

// Own keys only: "constructor" or "toString" must not look like formats.
const isFormat = (value: string): value is Format =>
	Object.prototype.hasOwnProperty.call(FORMATS, value);

const HELP = `
  dirham — UAE Dirham currency symbol (${SYMBOL}) CLI

  Usage:
    npx dirham              Print symbol info
    npx dirham copy         Copy ${SYMBOL} to clipboard (macOS/Linux)
    npx dirham copy html    Copy HTML entity
    npx dirham copy css     Copy CSS content value
    npx dirham --help       Show this help

  Formats for copy: ${Object.keys(FORMATS).join(", ")} (default: unicode)

  Unicode: ${CODEPOINT} (Unicode 18.0 — UAE DIRHAM SIGN)
  npm:     https://www.npmjs.com/package/dirham
  Docs:    https://dirham.js.org/
`;

const INFO = `
  ┌──────────────────────────────────────────────────┐
  │  UAE Dirham Symbol — ${SYMBOL}                            │
  ├──────────────────────────────────────────────────┤
  │  Symbol:       ${SYMBOL}                                  │
  │  Codepoint:    ${CODEPOINT}                            │
  │  HTML Entity:  ${HTML_ENTITY}                        │
  │  CSS Content:  ${CSS_CONTENT}                           │
  │  JS Escape:    ${JS_ESCAPE}                          │
  │  Arabic:       ${ARABIC}                               │
  │  ISO 4217:     ${CURRENCY_CODE}                              │
  │  Unicode Ver:  18.0 (Sep 2026)                     │
  ├──────────────────────────────────────────────────┤
  │  npm install dirham                                │
  │  https://dirham.js.org/                             │
  └──────────────────────────────────────────────────┘
`;

function main() {
	const args = process.argv.slice(2);

	if (args.includes("--help") || args.includes("-h")) {
		console.log(HELP);
		return;
	}

	if (args[0] === "copy") {
		const format = args[1] ?? "unicode";
		if (!isFormat(format)) {
			console.error(
				`Unknown format "${format}". Choose one of: ${Object.keys(FORMATS).join(", ")}`,
			);
			process.exitCode = 1;
			return;
		}
		const text = FORMATS[format];

		// Use pbcopy (macOS) or xclip/xsel (Linux) — no external deps
		try {
			const platform = process.platform;
			if (platform === "darwin") {
				execSync("pbcopy", { input: text });
			} else if (platform === "linux") {
				try {
					execSync("xclip -selection clipboard", { input: text });
				} catch {
					execSync("xsel --clipboard --input", { input: text });
				}
			} else if (platform === "win32") {
				execSync("clip", { input: text });
			} else {
				console.log(`Copied value (paste manually): ${text}`);
				return;
			}
			console.log(`✓ Copied "${text}" (${format}) to clipboard`);
		} catch {
			console.log(`Could not access clipboard. Here's the value: ${text}`);
		}
		return;
	}

	console.log(INFO);
}

main();
