import type React from "react";

// A run of Arabic script, allowing dots and spaces inside it ("د.إ", "درهم إماراتي").
const ARABIC_RUN = /(\p{Script=Arabic}(?:[\s.]*\p{Script=Arabic})*)/u;
const STARTS_ARABIC = /^\p{Script=Arabic}/u;

/**
 * Plain text with each run of Arabic script wrapped in <span lang="ar">, so screen
 * readers switch language. The text content stays exactly the same, which keeps the
 * FAQ identical to its JSON-LD copy.
 */
export function ArabicText({ text }: { text: string }) {
	const nodes: React.ReactNode[] = [];
	let offset = 0;
	for (const part of text.split(ARABIC_RUN)) {
		if (part !== "") {
			nodes.push(
				STARTS_ARABIC.test(part) ? (
					<span key={offset} lang="ar">
						{part}
					</span>
				) : (
					part
				),
			);
		}
		offset += part.length;
	}
	return <>{nodes}</>;
}

/** Text in which `backticked` parts render as <code>; the rest goes through ArabicText. */
export function CodeText({ text }: { text: string }) {
	const nodes: React.ReactNode[] = [];
	let offset = 0;
	let isCode = false;
	for (const part of text.split("`")) {
		if (part !== "") {
			nodes.push(
				isCode ? (
					<code key={offset} className="font-mono text-white">
						{part}
					</code>
				) : (
					<ArabicText key={offset} text={part} />
				),
			);
		}
		offset += part.length + 1;
		isCode = !isCode;
	}
	return <>{nodes}</>;
}
