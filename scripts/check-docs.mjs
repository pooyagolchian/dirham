// Fails CI when public docs drift from verified facts or from the real API output.
// Usage (repo root, after `pnpm build`): node scripts/check-docs.mjs
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
	"README.md",
	"packages/dirham-symbol/README.md",
	"packages/dirham-symbol/llms.txt",
	"packages/dirham-symbol/package.json",
	"packages/dirham-symbol/src/core/constants.ts",
	"packages/dirham-symbol/src/cli.ts",
	"apps/docs/index.html",
	"apps/docs/src/App.tsx",
	"apps/docs/src/Faq.tsx",
	"apps/docs/src/content/faq.json",
	"apps/docs/public/llms.txt",
];

const RULES = [
	[
		/(expected|scheduled|\bship\b|\bships\b|until)[^\n]{0,60}Sep(t|tember)?\.? 2026/i,
		"Unicode 18.0 was released on 2026-09-16 and system fonts have not shipped U+20C3 yet",
	],
	[/After Sep(t|tember)? 2026|Zero Migration in 2026/i, "stale 'Sep 2026' framing"],
	[/scheduled for Unicode 18/i, "Unicode 18.0 is released"],
	[/only npm package/i, "uniqueness claim is refuted (arabicfmt also emits U+20C3)"],
	[
		/unicode\.org\/alloc\/Pipeline\.html/,
		"U+20C3 left the Pipeline when Unicode 18.0 shipped; link https://www.unicode.org/charts/PDF/U20A0.pdf",
	],
	[
		/centralbank\.ae\/en\/our-operations\/currency-and-coins/,
		"returns HTTP 403 to crawlers; link the CBUAE guidelines PDF",
	],
	[/Dirham \(د\.إ\) currency symbol/, "د.إ is the Arabic abbreviation, not the U+20C3 sign"],
	[/"emoji"/, "U+20C3 is a currency symbol (gc=Sc), not an emoji"],
];

const LOOKALIKES = new Map([
	["\u{9C3}", "U+09C3 BENGALI VOWEL SIGN VOCALIC R"],
	["\u{2103}", "U+2103 DEGREE CELSIUS"],
]);

let problems = 0;
const report = (msg) => {
	problems++;
	console.log(msg);
};

for (const file of FILES) {
	const path = join(root, file);
	if (!existsSync(path)) continue;
	readFileSync(path, "utf8")
		.split("\n")
		.forEach((line, i) => {
			for (const [re, why] of RULES) {
				if (re.test(line)) report(`${file}:${i + 1}: ${why}\n    ${line.trim().slice(0, 140)}`);
			}
			for (const [ch, name] of LOOKALIKES) {
				if (line.includes(ch)) {
					report(`${file}:${i + 1}: ${name} where U+20C3 is meant; use &#x20C3; (HTML) or an escape (JS)`);
				}
			}
		});
}

// Tab titles, search snippets and link previews use system fonts that lack U+20C3,
// so the sign in the page head shows as a box.
const head = readFileSync(join(root, "apps/docs/index.html"), "utf8");
if (head.includes("\u{20C3}") || /&#x0*20c3;|&#0*8387;/i.test(head)) {
	report("apps/docs/index.html: the U+20C3 sign in the page head renders as a box; spell it out (U+20C3)");
}

// Documented outputs must equal the real output of the built package.
const require = createRequire(import.meta.url);
const distEntry = join(root, "packages/dirham-symbol/dist/index.cjs");
if (existsSync(distEntry)) {
	const d = require(distEntry);
	const call = /((?:formatDirham|parseDirham)\([^;\n]*?\));?\s*\/\/\s*("(?:[^"\\]|\\.)*"|[\d.]+)/g;
	const copy = /copyDirhamAmount\(([^)]*)\);\s*\/\/\s*copies\s*("(?:[^"\\]|\\.)*")/g;
	for (const file of FILES.filter((f) => /\.(md|txt)$/.test(f))) {
		const path = join(root, file);
		if (!existsSync(path)) continue;
		const src = readFileSync(path, "utf8");
		for (const m of src.matchAll(call)) {
			const actual = new Function("d", `return d.${m[1]}`)(d);
			const documented = new Function(`return ${m[2]}`)();
			if (actual !== documented) report(`${file}: ${m[1]} returns ${JSON.stringify(actual)}, docs say ${m[2]}`);
		}
		for (const m of src.matchAll(copy)) {
			const actual = d.formatDirham(...new Function(`return [${m[1]}]`)());
			const documented = new Function(`return ${m[2]}`)();
			if (actual !== documented) {
				report(`${file}: copyDirhamAmount(${m[1]}) copies ${JSON.stringify(actual)}, docs say ${m[2]}`);
			}
		}
	}
} else {
	console.log("note: build the package first to check documented outputs");
}

if (problems) {
	console.log(`\n${problems} problem(s) found.`);
	process.exit(1);
}
console.log("docs check passed");
