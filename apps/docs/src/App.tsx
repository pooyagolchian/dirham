import clsx from "clsx";
import {
	Check,
	ChevronDown,
	Code2,
	Copy,
	Globe,
	Layers,
	Package,
	Shield,
	Sparkles,
	Terminal,
	Type,
	Zap,
} from "lucide-react";
import { useState } from "react";

import "dirham/css";

import { DirhamIcon } from "dirham/react";

import {
	DIRHAM_CODEPOINT,
	DIRHAM_CSS_CONTENT,
	DIRHAM_CURRENCY_CODE,
	DIRHAM_FONT_FAMILY,
	DIRHAM_HTML_ENTITY,
	DIRHAM_UNICODE,
	formatDirham,
} from "dirham";

import type { DirhamWeight } from "dirham";

const WEIGHTS: DirhamWeight[] = [
	"thin",
	"extralight",
	"light",
	"regular",
	"medium",
	"semibold",
	"bold",
	"extrabold",
	"black",
];

const FONT_FAMILIES = [
	{ name: "Geist", family: "'Geist', sans-serif", category: "Sans" },
	{ name: "Inter", family: "'Inter', sans-serif", category: "Sans" },
	{
		name: "Space Grotesk",
		family: "'Space Grotesk', sans-serif",
		category: "Sans",
	},
	{ name: "DM Sans", family: "'DM Sans', sans-serif", category: "Sans" },
	{ name: "Outfit", family: "'Outfit', sans-serif", category: "Sans" },
	{
		name: "Plus Jakarta Sans",
		family: "'Plus Jakarta Sans', sans-serif",
		category: "Sans",
	},
	{
		name: "IBM Plex Sans",
		family: "'IBM Plex Sans', sans-serif",
		category: "Sans",
	},
	{ name: "Roboto", family: "'Roboto', sans-serif", category: "Sans" },
	{ name: "Vazirmatn", family: "'Vazirmatn', sans-serif", category: "Arabic" },
	{ name: "Cairo", family: "'Cairo', sans-serif", category: "Arabic" },
	{
		name: "Noto Sans Arabic",
		family: "'Noto Sans Arabic', sans-serif",
		category: "Arabic",
	},
	{
		name: "Playfair Display",
		family: "'Playfair Display', serif",
		category: "Serif",
	},
	{
		name: "JetBrains Mono",
		family: "'JetBrains Mono', monospace",
		category: "Mono",
	},
	{ name: "Geist Mono", family: "'Geist Mono', monospace", category: "Mono" },
	{
		name: "System UI",
		family: "system-ui, -apple-system, sans-serif",
		category: "System",
	},
];

const WEIGHT_TO_CSS: Record<string, number> = {
	thin: 100,
	extralight: 200,
	light: 300,
	regular: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
	black: 900,
};

/**
 * Maps each font category to the matching Dirham variant font.
 * The browser tries the main typeface first for U+20C3, can't find it,
 * and falls back to the category-matched Dirham variant, like
 * how $, €, £ look different across Sans, Serif, and Mono fonts.
 */
const CATEGORY_TO_DIRHAM_FONT: Record<string, string> = {
	Sans: '"Dirham-Sans"',
	Serif: '"Dirham-Serif"',
	Mono: '"Dirham-Mono"',
	Arabic: '"Dirham-Arabic"',
	System: '"Dirham"',
};

/** Build a font-family stack: <typeface>, <category-matched Dirham variant> */
function dirhamFontStack(font: (typeof FONT_FAMILIES)[number]) {
	const dirham = CATEGORY_TO_DIRHAM_FONT[font.category] || '"Dirham"';
	return `${font.family}, ${dirham}`;
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}}
			className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
			aria-label="Copy code"
		>
			{copied ? <Check size={14} /> : <Copy size={14} />}
		</button>
	);
}

function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
	return (
		<div className="relative group">
			<pre className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm font-mono text-neutral-300 overflow-x-auto">
				<code>{code}</code>
			</pre>
			<CopyButton text={code} />
		</div>
	);
}

function Badge({
	children,
	variant = "default",
}: { children: React.ReactNode; variant?: "default" | "green" | "amber" }) {
	return (
		<span
			className={clsx(
				"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase",
				variant === "default" &&
					"bg-white/5 text-neutral-400 border border-neutral-800",
				variant === "green" &&
					"bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
				variant === "amber" &&
					"bg-amber-500/10 text-amber-400 border border-amber-500/20",
			)}
		>
			{children}
		</span>
	);
}

/**
 * Renders a string that may contain U+20C3 by splitting it and wrapping
 * each occurrence in a <span> with font-family: "Dirham" so the custom
 * web font glyph renders correctly regardless of the surrounding typeface.
 */
function DirhamText({
	children,
	className,
	style,
	variant,
}: {
	children: string;
	className?: string;
	style?: React.CSSProperties;
	/** Which Dirham font variant to use (defaults to "Dirham") */
	variant?: string;
}) {
	const CHAR = "\u20C3";
	const dirhamFont = variant || '"Dirham"';
	if (!children.includes(CHAR)) {
		return (
			<span className={className} style={style}>
				{children}
			</span>
		);
	}
	const parts = children.split(CHAR);
	return (
		<span className={className} style={style}>
			{parts.map((part, i) => (
				<span key={`p${i}`}>
					{part}
					{i < parts.length - 1 && (
						<span style={{ fontFamily: dirhamFont }}>{CHAR}</span>
					)}
				</span>
			))}
		</span>
	);
}

function SectionHeader({
	icon: Icon,
	title,
	description,
}: {
	icon: React.ElementType;
	title: string;
	description: string;
}) {
	return (
		<div className="mb-12">
			<div className="flex items-center gap-3 mb-3">
				<div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] border border-neutral-800">
					<Icon size={17} className="text-neutral-400" />
				</div>
				<h2 className="text-2xl font-semibold tracking-tight text-white">
					{title}
				</h2>
			</div>
			<p className="text-neutral-500 leading-relaxed ml-12">{description}</p>
		</div>
	);
}

export function App() {
	const [size, setSize] = useState(64);
	const [selectedFont, setSelectedFont] = useState(FONT_FAMILIES[0]);
	const [selectedWeight, setSelectedWeight] = useState<DirhamWeight>("regular");
	const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
	const [amount, setAmount] = useState(1250.0);

	return (
		<div className="min-h-screen bg-neutral-950 [background-image:radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px]">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/90 backdrop-blur-2xl">
				<div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<DirhamIcon size={22} color="white" />
						<span className="font-semibold tracking-tight text-white">
							dirham
						</span>
						<Badge>v1.0</Badge>
					</div>
					<div className="flex items-center gap-6">
						<a
							href="https://www.npmjs.com/package/dirham"
							target="_blank"
							rel="noreferrer"
							className="text-sm text-neutral-500 hover:text-white transition-colors"
						>
							npm
						</a>
						<a
							href="https://github.com/pooyagolchian/dirham"
							target="_blank"
							rel="noreferrer"
							className="text-sm text-neutral-500 hover:text-white transition-colors"
						>
							GitHub
						</a>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_-15%,rgba(255,255,255,0.07),transparent)]" />

				<div className="relative max-w-6xl mx-auto px-8 pt-36 pb-32">
					<div className="flex flex-col items-center text-center">
						{/* Symbol showcase */}
						<div className="relative mb-14">
							<div className="absolute inset-0 blur-3xl bg-white/[0.05] rounded-full scale-[2]" />
							<div className="relative flex items-center justify-center w-32 h-32 rounded-[28px] bg-neutral-900/80 border border-neutral-800 shadow-2xl shadow-black/60">
								<DirhamIcon size={68} color="white" />
							</div>
						</div>

						<div className="mb-5">
							<Badge variant="green">Unicode 18.0 · U+20C3</Badge>
						</div>

						<h1 className="text-7xl sm:text-8xl font-bold tracking-[-0.04em] text-white mb-6">
							dirham
						</h1>
						<p className="text-xl text-neutral-400 max-w-xl leading-relaxed mb-12">
							The UAE Dirham currency symbol as a web font, CSS, and React
							component.
							<br />
							Built on the official Unicode 18.0 codepoint — future-proof from
							day one.
						</p>

						{/* Install command */}
						<div className="relative flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl px-6 py-4 mb-14">
							<Terminal size={16} className="text-neutral-600" />
							<code className="text-base font-mono text-neutral-200">
								npm install dirham
							</code>
							<CopyButton text="npm install dirham" />
						</div>

						{/* Quick stats */}
						<div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm text-neutral-500">
							{[
								"Tree-shakeable",
								"SSR Ready",
								"Zero Dependencies",
								"TypeScript",
								"9 Weights",
								"5 Font Variants",
							].map((stat) => (
								<span key={stat} className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
									{stat}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
			</section>

			{/* How It Works */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Layers}
					title="How It Works"
					description="This package maps the Dirham glyph to the official Unicode codepoint U+20C3 via a custom web font. When system fonts catch up, it just works — zero migration."
				/>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					{[
						{
							icon: Zap,
							title: "Unicode-Native",
							desc: "Uses the official U+20C3 codepoint — not a Private Use Area hack. Your content is semantically correct from day one.",
							color: "text-emerald-400",
						},
						{
							icon: Shield,
							title: "Future-Proof",
							desc: "When Unicode 18.0 ships (Sep 2026) and OS fonts support U+20C3, the web font becomes optional. No code changes needed.",
							color: "text-blue-400",
						},
						{
							icon: Layers,
							title: "Multiple Approaches",
							desc: "Font-based component for typography-native rendering. CSS ::before content. Format utilities for currency strings.",
							color: "text-violet-400",
						},
					].map(({ icon: Icon, title, desc, color }) => (
						<div
							key={title}
							className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors"
						>
							<div className={clsx("mb-3", color)}>
								<Icon size={20} />
							</div>
							<h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
							<p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
						</div>
					))}
				</div>

				{/* Architecture diagram */}
				<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
					<p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-4">
						Architecture
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
						<div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5">
							<span className="text-neutral-400 font-mono">dirham.svg</span>
						</div>
						<span className="text-neutral-700">→</span>
						<div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5">
							<span className="text-neutral-400 font-mono">svgtofont</span>
						</div>
						<span className="text-neutral-700">→</span>
						<div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5">
							<span className="text-emerald-400 font-mono">U+20C3</span>
							<span className="text-neutral-500">WOFF2</span>
						</div>
						<span className="text-neutral-700">→</span>
						<div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5">
							<span className="text-neutral-400 font-mono">
								React / CSS / JS
							</span>
						</div>
					</div>
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* Why dirham */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Sparkles}
					title="Why dirham?"
					description="The only npm package built on the officially assigned Unicode 18.0 codepoint — not a Private Use Area workaround."
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
					{[
						{
							icon: Globe,
							title: "Official U+20C3 — Not a Hack",
							desc: "Uses the codepoint ratified by the Unicode Technical Committee for Unicode 18.0. Other packages like dirham-symbol use Private Use Area codepoints (U+E900) that will never render natively in any OS font.",
							color: "text-cyan-400",
							glow: true,
						},
						{
							icon: Layers,
							title: "5 Adaptive Font Variants",
							desc: "Separate fonts for Sans, Serif, Monospace, Arabic, and Default — the Dirham symbol adapts to surrounding typography the same way $, €, and £ look different across typefaces.",
							color: "text-violet-400",
							glow: false,
						},
						{
							icon: Shield,
							title: "Zero Migration in 2026",
							desc: "When OS fonts ship native U+20C3 support with Unicode 18.0 (Sep 2026), the custom web font silently becomes optional. No find-and-replace, no API changes, no breaking updates.",
							color: "text-emerald-400",
							glow: false,
						},
						{
							icon: Zap,
							title: "SSR-Safe SVG Component",
							desc: "DirhamSymbol renders as a pure inline SVG — FOIT-free, works in React Server Components, Next.js App Router, and static site generators out of the box.",
							color: "text-amber-400",
							glow: false,
						},
					].map(({ icon: Icon, title, desc, color, glow }) => (
						<div
							key={title}
							className={clsx(
								"rounded-2xl p-7 border transition-all",
								glow
									? "bg-cyan-500/[0.04] border-cyan-500/20 hover:border-cyan-500/40"
									: "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900",
							)}
						>
							<div className={clsx("mb-4", color)}>
								<Icon size={22} />
							</div>
							<h3 className="text-base font-semibold text-white mb-2">
								{title}
							</h3>
							<p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
						</div>
					))}
				</div>

				{/* Comparison table */}
				<div className="overflow-hidden rounded-2xl border border-neutral-800">
					<div className="grid grid-cols-3 bg-neutral-900/80 px-6 py-4 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest border-b border-neutral-800">
						<span>Feature</span>
						<span className="text-center text-cyan-400">dirham</span>
						<span className="text-center">dirham&#8209;symbol</span>
					</div>
					{[
						["Unicode codepoint", "U+20C3 (official)", "U+E900 (PUA)"],
						[
							"Future-proof",
							"becomes native in 2026",
							"PUA never becomes native",
						],
						["Font variants", "5 (Sans / Serif / Mono / Arabic)", "1"],
						[
							"Adaptive glyph style",
							"matches surrounding font",
							"one shape only",
						],
						["SVG React component", "✓ FOIT-free", "✗"],
						["SSR / React Server", "✓ full support", "partial"],
						["Weight variants", "9 weights", "none"],
						["TypeScript types", "✓ full types", "partial"],
					].map(([feature, ours, theirs], i, arr) => (
						<div
							key={feature}
							className={clsx(
								"grid grid-cols-3 px-6 py-4 items-center",
								i % 2 === 0 ? "bg-neutral-950/50" : "bg-transparent",
								i < arr.length - 1 && "border-b border-neutral-800/50",
							)}
						>
							<span className="text-neutral-400 text-xs">{feature}</span>
							<span className="text-center text-xs font-medium text-cyan-400">
								{ours}
							</span>
							<span className="text-center text-xs text-neutral-600">
								{theirs}
							</span>
						</div>
					))}
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* Unicode Integration */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Code2}
					title="Unicode Integration"
					description="Use U+20C3 across every layer of your stack — HTML, CSS, JavaScript, and React."
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<h3 className="text-sm font-medium text-white">HTML</h3>
							<Badge>Entity</Badge>
						</div>
						<CodeBlock
							code={`<!-- Load the font -->
<link rel="stylesheet" href="dirham/css" />

<!-- Use the HTML entity -->
<span class="dirham-symbol">${DIRHAM_HTML_ENTITY}</span>

<!-- Or use the CSS class (auto ::before) -->
<i class="dirham-symbol" aria-label="Dirham"></i>`}
							lang="html"
						/>
					</div>

					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<h3 className="text-sm font-medium text-white">CSS</h3>
							<Badge>Content</Badge>
						</div>
						<CodeBlock
							code={`.price::before {
  font-family: "${DIRHAM_FONT_FAMILY}";
  content: "${DIRHAM_CSS_CONTENT}";
}

/* Or use the built-in class */
@import "dirham/css";
/* .dirham-symbol::before { content: "\\20C3" } */`}
							lang="css"
						/>
					</div>

					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<h3 className="text-sm font-medium text-white">JavaScript</h3>
							<Badge>Constants</Badge>
						</div>
						<CodeBlock
							code={`import {
  DIRHAM_UNICODE,   // "\\u20C3"
  DIRHAM_CODEPOINT, // 0x20C3 (${DIRHAM_CODEPOINT})
  formatDirham,
} from "dirham";

console.log(formatDirham(1250));
// => "\\u20C3 1,250.00"`}
							lang="ts"
						/>
					</div>

					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<h3 className="text-sm font-medium text-white">
								React / Next.js
							</h3>
							<Badge variant="green">Recommended</Badge>
						</div>
						<CodeBlock
							code={`import "dirham/css";
import { DirhamIcon } from "dirham/react";

function Price({ amount }: { amount: number }) {
  return (
    <span>
      <DirhamIcon size="1em" />
      {" "}{amount.toLocaleString()}
    </span>
  );
}`}
						/>
					</div>
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* Font Playground */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Type}
					title="Font Playground"
					description="Explore how the Dirham symbol pairs with different typefaces and weights. Select a font to see it in action."
				/>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
					{/* Controls panel */}
					<div className="space-y-4">
						{/* Font selector dropdown */}
						<div className="relative">
							<label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
								Typeface
							</label>
							<button
								type="button"
								onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
								className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white hover:border-neutral-700 transition-colors cursor-pointer"
							>
								<div className="flex items-center gap-3">
									<span
										style={{ fontFamily: selectedFont.family }}
										className="text-base"
									>
										Aa
									</span>
									<span>{selectedFont.name}</span>
								</div>
								<ChevronDown
									size={16}
									className={clsx(
										"text-neutral-500 transition-transform",
										fontDropdownOpen && "rotate-180",
									)}
								/>
							</button>

							{fontDropdownOpen && (
								<div className="absolute z-40 mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden max-h-80 overflow-y-auto">
									{["Sans", "Arabic", "Serif", "Mono", "System"].map((cat) => {
										const fonts = FONT_FAMILIES.filter(
											(f) => f.category === cat,
										);
										if (fonts.length === 0) return null;
										return (
											<div key={cat}>
												<div className="px-4 py-2 text-[10px] font-medium text-neutral-600 uppercase tracking-widest bg-neutral-950/50">
													{cat}
												</div>
												{fonts.map((font) => (
													<button
														type="button"
														key={font.name}
														onClick={() => {
															setSelectedFont(font);
															setFontDropdownOpen(false);
														}}
														className={clsx(
															"w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors cursor-pointer",
															selectedFont.name === font.name
																? "text-white bg-white/[0.03]"
																: "text-neutral-400",
														)}
													>
														<span style={{ fontFamily: font.family }}>
															{font.name}
														</span>
														{selectedFont.name === font.name && (
															<Check size={14} className="text-white" />
														)}
													</button>
												))}
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Weight selector */}
						<div>
							<label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
								Weight
							</label>
							<div className="grid grid-cols-3 gap-1.5">
								{WEIGHTS.map((w) => (
									<button
										type="button"
										key={w}
										onClick={() => setSelectedWeight(w)}
										className={clsx(
											"px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
											selectedWeight === w
												? "bg-white text-black"
												: "bg-neutral-900 text-neutral-500 border border-neutral-800 hover:border-neutral-700 hover:text-neutral-300",
										)}
									>
										{w}
									</button>
								))}
							</div>
						</div>

						{/* Size slider */}
						<div>
							<label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
								Size — {size}px
							</label>
							<input
								type="range"
								min="16"
								max="128"
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
								className="w-full accent-white h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
							/>
						</div>

						{/* Amount */}
						<div>
							<label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
								Amount
							</label>
							<input
								type="number"
								value={amount}
								step="0.01"
								onChange={(e) => setAmount(Number(e.target.value))}
								className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-neutral-600 transition-colors"
							/>
						</div>
					</div>

					{/* Preview panel */}
					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[320px]">
						<div
							style={{
								fontFamily: dirhamFontStack(selectedFont),
								fontWeight: WEIGHT_TO_CSS[selectedWeight],
								fontSize: `${size}px`,
								lineHeight: 1.2,
							}}
							className="text-white mb-6 text-center break-all"
						>
							{DIRHAM_UNICODE}{" "}
							{amount.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</div>

						<div className="text-center space-y-1">
							<p className="text-xs text-neutral-600 font-mono">
								{selectedFont.name} · {selectedWeight} · {size}px ·{" "}
								<span className="text-emerald-500">
									Dirham-{selectedFont.category}
								</span>
							</p>
							<DirhamText
								className="text-sm text-neutral-400 font-mono"
								variant={CATEGORY_TO_DIRHAM_FONT[selectedFont.category]}
							>
								{formatDirham(amount)}
							</DirhamText>
						</div>
					</div>
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* Unicode Sizes */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Sparkles}
					title="Unicode Sizes"
					description="The font-based glyph scales naturally with font-size, same as $, € and £."
				/>

				<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
					<div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-6">
						{[12, 16, 20, 24, 32, 40, 48, 64, 80].map((s) => (
							<div key={s} className="flex flex-col items-center gap-3">
								<div className="w-16 h-16 flex items-center justify-center rounded-xl bg-neutral-950 border border-neutral-800">
									<DirhamIcon size={s} />
								</div>
								<div className="text-center">
									<p className="text-[10px] text-neutral-700 font-mono">
										{s}px
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<CodeBlock code={`<DirhamIcon size={32} />`} />
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* Font Pairing Grid */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Type}
					title="Font Pairing"
					description="See how the Dirham symbol harmonizes with different typefaces across weights."
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{FONT_FAMILIES.filter((f) => f.category !== "System").map((font) => (
						<div
							key={font.name}
							className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors group"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-medium text-white">{font.name}</h3>
								<Badge>{font.category}</Badge>
							</div>
							<div
								className="space-y-2"
								style={{ fontFamily: dirhamFontStack(font) }}
							>
								{(["light", "regular", "medium", "bold"] as DirhamWeight[]).map(
									(w) => (
										<div
											key={w}
											className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-950/60"
											style={{ fontWeight: WEIGHT_TO_CSS[w] }}
										>
											<span className="text-white text-base">
												{DIRHAM_UNICODE} 1,250.00
											</span>
											<span
												className="text-[10px] text-neutral-600 font-mono capitalize"
												style={{ fontFamily: "var(--font-sans)" }}
											>
												{w}
											</span>
										</div>
									),
								)}
							</div>
						</div>
					))}
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* React Components */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Code2}
					title="React Component"
					description="Font-based Unicode component — inherits size and color from surrounding styles, works with any typeface."
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* DirhamIcon component */}
					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
						<div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<h3 className="text-sm font-medium text-white">DirhamIcon</h3>
								<Badge variant="green">Unicode U+20C3</Badge>
							</div>
						</div>
						<div className="p-6">
							{/* Size demos */}
							<p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
								Sizes
							</p>
							<div className="flex items-end gap-4 mb-6">
								{[12, 16, 24, 32, 48, 64].map((s) => (
									<div key={s} className="flex flex-col items-center gap-1.5">
										<DirhamIcon size={s} />
										<span className="text-[10px] text-neutral-600 font-mono">
											{s}
										</span>
									</div>
								))}
							</div>

							{/* Inline */}
							<p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
								Inline with text
							</p>
							<p className="text-lg text-white mb-6">
								Price: <DirhamIcon size="1em" /> 100
							</p>

							<CodeBlock
								code={`import "dirham/css";
import { DirhamIcon } from "dirham/react";

<DirhamIcon size={24} />
<DirhamIcon size="1em" />`}
							/>
						</div>
					</div>

					{/* CSS Class usage */}
					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
						<div className="px-6 py-4 border-b border-neutral-800 flex items-center gap-2">
							<h3 className="text-sm font-medium text-white">CSS Class</h3>
							<Badge>No JS</Badge>
						</div>
						<div className="p-6">
							<p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
								Sizes via font-size
							</p>
							<div className="flex items-end gap-4 mb-6">
								{[16, 24, 32, 48].map((s) => (
									<div key={s} className="flex flex-col items-center gap-1.5">
										<i
											className="dirham-symbol"
											style={{ fontSize: `${s}px` }}
											aria-label="UAE Dirham"
										/>
										<span className="text-[10px] text-neutral-600 font-mono">
											{s}
										</span>
									</div>
								))}
							</div>

							{/* CSS class */}
							<p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
								Markup
							</p>
							<div className="flex items-center gap-3 mb-6">
								<i
									className="dirham-symbol"
									style={{ fontSize: "32px" }}
									aria-label="UAE Dirham"
								/>
								<code className="text-xs text-neutral-500 font-mono">
									&lt;i class="dirham-symbol"&gt;&lt;/i&gt;
								</code>
							</div>

							<CodeBlock
								code={`<!-- Just import the CSS -->
<link rel="stylesheet" href="dirham/css" />

<!-- Use the class — renders U+20C3 via ::before -->
<i class="dirham-symbol"></i>
<span class="dirham-symbol" style="font-size: 32px"></span>`}
								lang="html"
							/>
						</div>
					</div>
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* Formatting & Constants */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Package}
					title="Formatting & Constants"
					description="Built-in currency formatting and exported constants for every use case."
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* formatDirham */}
					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
						<h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
							<code className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2 py-1 rounded-md">
								formatDirham()
							</code>
						</h3>
						<div className="space-y-2">
							{[
								{ input: "100", output: formatDirham(100) },
								{ input: "1234.5", output: formatDirham(1234.5) },
								{
									input: "100, { useCode: true }",
									output: formatDirham(100, { useCode: true }),
								},
								{
									input: '100, { locale: "ar-AE" }',
									output: formatDirham(100, { locale: "ar-AE" }),
								},
								{ input: "999999.99", output: formatDirham(999999.99) },
							].map(({ input, output }) => (
								<div
									key={input}
									className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-950"
								>
									<span className="text-xs font-mono text-neutral-500">
										formatDirham({input})
									</span>
									<DirhamText className="text-sm font-mono text-white">
										{output}
									</DirhamText>
								</div>
							))}
						</div>
					</div>

					{/* Constants */}
					<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
						<h3 className="text-sm font-medium text-white mb-4">Constants</h3>
						<div className="space-y-2">
							{[
								{
									name: "DIRHAM_UNICODE",
									value: JSON.stringify(DIRHAM_UNICODE),
								},
								{ name: "DIRHAM_HTML_ENTITY", value: DIRHAM_HTML_ENTITY },
								{ name: "DIRHAM_CSS_CONTENT", value: DIRHAM_CSS_CONTENT },
								{ name: "DIRHAM_CURRENCY_CODE", value: DIRHAM_CURRENCY_CODE },
								{ name: "DIRHAM_FONT_FAMILY", value: DIRHAM_FONT_FAMILY },
							].map(({ name, value }) => (
								<div
									key={name}
									className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-950"
								>
									<span className="text-xs font-mono text-neutral-500">
										{name}
									</span>
									<span className="text-sm font-mono text-white">{value}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* RTL Support */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Globe}
					title="RTL / LTR"
					description="First-class support for both text directions — essential for Arabic-speaking markets."
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div
						className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
						dir="ltr"
					>
						<p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
							English — LTR
						</p>
						<DirhamText className="text-2xl text-white">
							{formatDirham(250)}
						</DirhamText>
					</div>
					<div
						className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
						dir="rtl"
					>
						<p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
							العربية — RTL
						</p>
						<p
							className="text-2xl text-white"
							style={{ fontFamily: "'Vazirmatn', 'Cairo', sans-serif" }}
						>
							<DirhamText>{formatDirham(250, { locale: "ar-AE" })}</DirhamText>
						</p>
					</div>
				</div>
			</section>

			<div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

			{/* Unicode Status */}
			<section className="max-w-6xl mx-auto px-8 py-28">
				<SectionHeader
					icon={Sparkles}
					title="Unicode Status"
					description="U+20C3 is the official UAE Dirham Sign codepoint. This package uses it today via a custom web font — native OS support arrives with Unicode 18.0."
				/>

				<div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
					<div className="grid grid-cols-1 sm:grid-cols-2">
						{/* This package */}
						<div className="p-8 border-b sm:border-b-0 sm:border-r border-neutral-800">
							<Badge variant="green">Active</Badge>
							<p className="text-4xl font-mono font-bold text-emerald-400 mt-4 mb-2">
								U+20C3
							</p>
							<p className="text-sm text-neutral-500">
								UAE DIRHAM SIGN — this package maps the glyph to the official
								Unicode codepoint via a custom web font
							</p>
						</div>

						{/* Native support */}
						<div className="p-8">
							<Badge variant="amber">Unicode 18.0</Badge>
							<p className="text-4xl font-mono font-bold text-amber-400 mt-4 mb-2">
								Sep 2026
							</p>
							<p className="text-sm text-neutral-500">
								Native OS &amp; font support expected when Unicode 18.0 ships —
								then the web font becomes optional
							</p>
						</div>
					</div>

					{/* Note */}
					<div className="px-8 py-4 bg-neutral-950 border-t border-neutral-800">
						<p className="text-xs text-neutral-500 leading-relaxed">
							<span className="text-emerald-400 font-medium">
								Future-proof:
							</span>{" "}
							This package already uses U+20C3. When system fonts add native
							support, the web font gracefully becomes unnecessary — zero
							migration needed. The Dirham symbol will work natively like $, €,
							and £.
						</p>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-neutral-800/60">
				<div className="max-w-5xl mx-auto px-6 py-10">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<DirhamIcon size={16} color="#525252" />
							<span className="text-xs text-neutral-600">
								Unicode U+20C3 ·{" "}
								<a
									href="https://commons.wikimedia.org/wiki/File:UAE_Dirham_Symbol.svg"
									target="_blank"
									rel="noreferrer"
									className="text-neutral-500 hover:text-white transition-colors underline underline-offset-2"
								>
									SVG source (CC0)
								</a>
							</span>
						</div>
						<div className="flex items-center gap-6 text-xs text-neutral-600">
							<a
								href="https://www.npmjs.com/package/dirham"
								target="_blank"
								rel="noreferrer"
								className="hover:text-white transition-colors"
							>
								npm
							</a>
							<a
								href="https://github.com/pooyagolchian/dirham"
								target="_blank"
								rel="noreferrer"
								className="hover:text-white transition-colors"
							>
								GitHub
							</a>
							<span className="text-neutral-700">·</span>
							<span>MIT License</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
