import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { type HtmlTagDescriptor, type Plugin, defineConfig } from "vite";

const SITE_URL = "https://dirham.js.org/";
const PERSON_ID = "https://pooyagolchian.com/#person";
const appDir = fileURLToPath(new URL(".", import.meta.url));
const pkgDir = new URL("../../packages/dirham-symbol/", import.meta.url);
/** Optional: an array of { id, question, answer }, mirrored as FAQPage JSON-LD when present. */
const faqFile = fileURLToPath(new URL("src/content/faq.json", import.meta.url));

// The package version is the single source for the nav badge and the JSON-LD.
const { version } = JSON.parse(
	readFileSync(new URL("package.json", pkgDir), "utf8"),
) as { version: string };

/**
 * Copies of packages/dirham-symbol/llms.txt (the full reference, also shipped in the npm
 * tarball) written to dist: llms-full.txt is the conventional name, index.md is the Markdown
 * alternate linked from index.html, and llms-package.txt keeps existing links working.
 */
const REFERENCE_COPIES = ["llms-full.txt", "llms-package.txt", "index.md"];

/** Primary sources for the facts on the page. */
const SOURCES = [
	"https://www.unicode.org/versions/Unicode18.0.0/",
	"https://www.unicode.org/charts/PDF/U20A0.pdf",
	"https://www.unicode.org/L2/L2025/25181.htm#184-C17",
	"https://centralbank.ae/media/ckkp3s3f/cbuae-unveils-new-dirham-symbol-en.pdf",
	"https://centralbank.ae/media/e4ebcgtb/the_guidelines_for_the_national_currency_symbol_uae_dirham_english.pdf",
];

/** Committer date (YYYY-MM-DD) of the commit being built; the build date outside git. */
function lastModified(): string {
	try {
		const date = execFileSync("git", ["log", "-1", "--format=%cs"], {
			cwd: appDir,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
	} catch {
		// No git binary or repository: fall back to the build date.
	}
	return new Date().toISOString().slice(0, 10);
}

interface FaqEntry {
	id: string;
	question: string;
	answer: string;
}

function isFaqEntry(value: unknown): value is FaqEntry {
	if (typeof value !== "object" || value === null) return false;
	const entry = value as Record<string, unknown>;
	return ["id", "question", "answer"].every((key) => {
		const field = entry[key];
		return typeof field === "string" && field.trim() !== "";
	});
}

/** Reads src/content/faq.json when it exists; a malformed file fails the build. */
function readFaq(): FaqEntry[] {
	if (!existsSync(faqFile)) return [];
	const data: unknown = JSON.parse(readFileSync(faqFile, "utf8"));
	if (!Array.isArray(data) || !data.every(isFaqEntry)) {
		throw new Error(
			`${faqFile}: expected an array of { id, question, answer }`,
		);
	}
	const ids = data.map((entry) => entry.id);
	const duplicate = ids.find((entryId, i) => ids.indexOf(entryId) !== i);
	if (duplicate) throw new Error(`${faqFile}: duplicate id "${duplicate}"`);
	return data;
}

const id = (fragment: string) => `${SITE_URL}#${fragment}`;

function structuredData(page: {
	title: string;
	description: string;
	dateModified: string;
	faq: FaqEntry[];
}) {
	const graph: Record<string, unknown>[] = [
		{
			"@type": "WebSite",
			"@id": id("website"),
			url: SITE_URL,
			name: "dirham",
			description:
				"Documentation and live demos for dirham, an open-source npm package for the UAE Dirham sign (U+20C3).",
			inLanguage: "en",
			publisher: { "@id": PERSON_ID },
		},
		{
			"@type": "WebPage",
			"@id": id("webpage"),
			url: SITE_URL,
			name: page.title,
			description: page.description,
			isPartOf: { "@id": id("website") },
			about: [
				{ "@id": id("uae-dirham-sign") },
				{
					"@type": "Thing",
					name: "United Arab Emirates dirham",
					sameAs: [
						"https://www.wikidata.org/wiki/Q200294",
						"https://en.wikipedia.org/wiki/United_Arab_Emirates_dirham",
					],
				},
			],
			mainEntity: { "@id": id("software") },
			...(page.faq.length > 0 ? { hasPart: { "@id": id("faq") } } : {}),
			primaryImageOfPage: {
				"@type": "ImageObject",
				url: `${SITE_URL}og.png`,
				width: 1200,
				height: 630,
			},
			author: { "@id": PERSON_ID },
			citation: SOURCES,
			dateModified: page.dateModified,
			inLanguage: "en",
		},
		{
			"@type": "DefinedTerm",
			"@id": id("uae-dirham-sign"),
			name: "UAE Dirham sign",
			alternateName: [
				"UAE DIRHAM SIGN",
				"U+20C3",
				"Emirati dirham sign",
				"dirham symbol",
				"AED symbol",
			],
			termCode: "U+20C3",
			description:
				"Currency sign of the UAE dirham (ISO 4217: AED), unveiled by the Central Bank of the UAE on 27 March 2025 and encoded in Unicode 18.0, released on 16 September 2026.",
			inDefinedTermSet: "https://www.unicode.org/charts/PDF/U20A0.pdf",
			sameAs: [
				"https://www.wikidata.org/wiki/Q133571820",
				"https://en.wikipedia.org/wiki/Emirati_dirham_sign",
			],
		},
		{
			// Not SoftwareApplication: Google's software-app rich result requires ratings or
			// reviews, and without them Search Console reports every item as invalid.
			"@type": "SoftwareSourceCode",
			"@id": id("software"),
			name: "dirham",
			description:
				"Open-source npm package that renders and formats the UAE Dirham sign (U+20C3): a web font mapped to U+20C3, SVG components for React and React Native, Web Components, a Tailwind CSS plugin and AED formatting helpers.",
			url: SITE_URL,
			codeRepository: "https://github.com/pooyagolchian/dirham",
			sameAs: [
				"https://www.npmjs.com/package/dirham",
				"https://github.com/pooyagolchian/dirham",
			],
			programmingLanguage: ["TypeScript", "JavaScript", "CSS"],
			runtimePlatform: ["Web browsers", "Node.js", "React Native"],
			version,
			license: "https://opensource.org/licenses/MIT",
			isAccessibleForFree: true,
			datePublished: "2026-02-25",
			about: { "@id": id("uae-dirham-sign") },
			author: { "@id": PERSON_ID },
			maintainer: { "@id": PERSON_ID },
			keywords:
				"UAE dirham symbol, dirham sign, U+20C3, AED symbol, currency symbol, web font, React, Web Components",
		},
		{
			// Same @id as the Person on the maintainer's own site.
			"@type": "Person",
			"@id": PERSON_ID,
			name: "Pooya Golchian",
			url: "https://pooyagolchian.com/",
			sameAs: [
				"https://github.com/pooyagolchian",
				"https://www.npmjs.com/~pooya",
				"https://linkedin.com/in/pooyagolchian",
				"https://orcid.org/0000-0003-0176-2536",
			],
		},
	];
	if (page.faq.length > 0) {
		graph.push({
			"@type": "FAQPage",
			"@id": id("faq"),
			url: id("faq"),
			isPartOf: { "@id": id("webpage") },
			inLanguage: "en",
			dateModified: page.dateModified,
			mainEntity: page.faq.map((entry) => ({
				"@type": "Question",
				url: id(entry.id),
				name: entry.question,
				acceptedAnswer: { "@type": "Answer", text: entry.answer },
			})),
		});
	}
	return { "@context": "https://schema.org", "@graph": graph };
}

/** JSON for an inline <script>: each "<" becomes a JSON escape, so no value can end the element. */
function jsonForScript(data: unknown): string {
	return JSON.stringify(data, null, "\t").replace(
		/</g,
		(char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
	);
}

const ENTITIES: Record<string, string> = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	"#39": "'",
};

/** Text captured by `pattern` in index.html, entity-decoded; fails the build when missing. */
function htmlText(html: string, pattern: RegExp, what: string): string {
	const captured = html.match(pattern)?.[1];
	if (captured === undefined) {
		throw new Error(`dirham-seo: ${what} not found in index.html`);
	}
	return captured
		.replace(/\s+/g, " ")
		.trim()
		.replace(/&(amp|lt|gt|quot|#39);/g, (_, name: string) => ENTITIES[name]);
}

function sitemap(lastmod: string): string {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		"\t<url>",
		`\t\t<loc>${SITE_URL}</loc>`,
		`\t\t<lastmod>${lastmod}</lastmod>`,
		"\t</url>",
		"</urlset>",
		"",
	].join("\n");
}

/** JSON-LD, font preload, sitemap.xml and the llms reference files, all derived at build time. */
function seo(): Plugin {
	const dateModified = lastModified();
	return {
		name: "dirham-seo",
		// Client build and dev server only; the SSR build that feeds the prerender needs none of it.
		apply: (_config, env) => !env.isSsrBuild,
		transformIndexHtml: {
			order: "post",
			handler(html, ctx) {
				const tags: HtmlTagDescriptor[] = [];
				// Preload the Geist latin subset used by the first paint (Vite hashes the file name).
				const font = Object.keys(ctx.bundle ?? {}).find((file) =>
					/geist-latin-wght-normal-[\w-]+\.woff2$/.test(file),
				);
				if (font) {
					tags.push({
						tag: "link",
						attrs: {
							rel: "preload",
							href: `/${font}`,
							as: "font",
							type: "font/woff2",
							crossorigin: true,
						},
						injectTo: "head",
					});
				}
				const title = htmlText(html, /<title>([^<]*)<\/title>/, "<title>");
				const descriptionTag =
					html.match(/<meta\b[^>]*\bname="description"[^>]*>/)?.[0] ?? "";
				const description = htmlText(
					descriptionTag,
					/\bcontent="([^"]*)"/,
					'<meta name="description">',
				);
				tags.push({
					tag: "script",
					attrs: { type: "application/ld+json" },
					children: jsonForScript(
						structuredData({
							title,
							description,
							dateModified,
							faq: readFaq(),
						}),
					),
					injectTo: "head",
				});
				return { html, tags };
			},
		},
		generateBundle() {
			const reference = readFileSync(new URL("llms.txt", pkgDir), "utf8");
			for (const fileName of REFERENCE_COPIES) {
				this.emitFile({ type: "asset", fileName, source: reference });
			}
			this.emitFile({
				type: "asset",
				fileName: "sitemap.xml",
				source: sitemap(dateModified),
			});
		},
	};
}

export default defineConfig({
	base: "/",
	// Shared by the client and SSR builds, so the prerendered badge hydrates without a mismatch.
	define: { __DIRHAM_VERSION__: JSON.stringify(version) },
	plugins: [tailwindcss(), react(), seo()],
	build: {
		// Keep woff2 inline but emit the dirham fonts' woff/ttf fallbacks as files: every browser
		// that runs this app supports woff2, so inlined fallbacks only bloat the render-blocking CSS.
		assetsInlineLimit: (file) =>
			/\.(woff|ttf)$/.test(file) ? false : undefined,
	},
	server: {
		port: 3000,
		open: true,
	},
});
