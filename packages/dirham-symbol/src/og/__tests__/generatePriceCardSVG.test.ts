import { describe, expect, it } from "vitest";
import { generatePriceCardSVG, type PriceCardSVGOptions } from "../generatePriceCardSVG";

describe("generatePriceCardSVG", () => {
	it("returns a valid SVG string with default options", () => {
		const svg = generatePriceCardSVG({ amount: 1234.5 });
		expect(svg).toMatch(/^<svg/);
		expect(svg).toMatch(/<\/svg>$/);
		expect(svg).toContain('width="1200"');
		expect(svg).toContain('height="630"');
	});

	it("includes the formatted amount", () => {
		const svg = generatePriceCardSVG({ amount: 99.99 });
		expect(svg).toContain("99.99");
	});

	it("renders title when provided", () => {
		const svg = generatePriceCardSVG({ amount: 50, title: "Invoice Total" });
		expect(svg).toContain("Invoice Total");
	});

	it("renders subtitle when provided", () => {
		const svg = generatePriceCardSVG({ amount: 50, subtitle: "Due by Dec 2026" });
		expect(svg).toContain("Due by Dec 2026");
	});

	it("omits title/subtitle elements when not provided", () => {
		const svg = generatePriceCardSVG({ amount: 100 });
		// Only the price text, AED badge, and structural elements should be present
		const textMatches = svg.match(/<text /g);
		// price text + AED badge = 2 text elements
		expect(textMatches?.length).toBe(2);
	});

	it("respects custom dimensions", () => {
		const svg = generatePriceCardSVG({ amount: 1, width: 800, height: 400 });
		expect(svg).toContain('width="800"');
		expect(svg).toContain('height="400"');
	});

	it("applies custom colors", () => {
		const svg = generatePriceCardSVG({
			amount: 1,
			background: "#1e3a5f",
			textColor: "#f0f0f0",
			accentColor: "#ff6600",
		});
		expect(svg).toContain("#1e3a5f");
		expect(svg).toContain("#f0f0f0");
		expect(svg).toContain("#ff6600");
	});

	it("uses compact notation", () => {
		const svg = generatePriceCardSVG({ amount: 1500000, notation: "compact" });
		// Should contain a compact form like "1.5M" or similar
		expect(svg).not.toContain("1,500,000");
	});

	it("handles Arabic locale (RTL)", () => {
		const svg = generatePriceCardSVG({ amount: 100, locale: "ar-AE" });
		expect(svg).toContain('direction="rtl"');
	});

	it("includes the Dirham SVG path", () => {
		const svg = generatePriceCardSVG({ amount: 1 });
		expect(svg).toContain("m88.3 1c0.4");
	});

	it("renders the AED badge", () => {
		const svg = generatePriceCardSVG({ amount: 1 });
		expect(svg).toContain(">AED<");
	});

	it("applies border radius when provided", () => {
		const svg = generatePriceCardSVG({ amount: 1, borderRadius: 16 });
		expect(svg).toContain('rx="16"');
	});

	it("handles dash for non-finite amounts", () => {
		const svg = generatePriceCardSVG({ amount: Number.NaN });
		expect(svg).toContain("—");
	});

	it("escapes HTML in title", () => {
		const svg = generatePriceCardSVG({ amount: 1, title: '<script>alert("xss")</script>' });
		expect(svg).not.toContain("<script>");
		expect(svg).toContain("&lt;script&gt;");
	});

	it("escapes HTML in subtitle", () => {
		const svg = generatePriceCardSVG({ amount: 1, subtitle: "A & B" });
		expect(svg).toContain("A &amp; B");
	});

	it("respects custom decimals", () => {
		const svg = generatePriceCardSVG({ amount: 42, decimals: 0 });
		expect(svg).toContain(">42<");
	});
});
