import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnimatedDirhamPrice } from "../AnimatedDirhamPrice";
import { DirhamIcon } from "../DirhamIcon";
import { DirhamInput } from "../DirhamInput";
import { DirhamPrice } from "../DirhamPrice";
import { DirhamSymbol } from "../DirhamSymbol";

describe("DirhamSymbol", () => {
	it("renders an SVG element", () => {
		const html = renderToString(React.createElement(DirhamSymbol));
		expect(html).toContain("<svg");
		expect(html).toContain("</svg>");
	});

	it("uses default size of 24", () => {
		const html = renderToString(React.createElement(DirhamSymbol));
		expect(html).toContain('width="24"');
		expect(html).toContain('height="24"');
	});

	it("accepts custom size", () => {
		const html = renderToString(
			React.createElement(DirhamSymbol, { size: 48 }),
		);
		expect(html).toContain('width="48"');
		expect(html).toContain('height="48"');
	});

	it("accepts string size like 1em", () => {
		const html = renderToString(
			React.createElement(DirhamSymbol, { size: "1em" }),
		);
		expect(html).toContain('width="1em"');
		expect(html).toContain('height="1em"');
	});

	it("has role img", () => {
		const html = renderToString(React.createElement(DirhamSymbol));
		expect(html).toContain('role="img"');
	});

	it("has default aria-label", () => {
		const html = renderToString(React.createElement(DirhamSymbol));
		expect(html).toContain('aria-label="UAE Dirham"');
	});

	it("accepts custom aria-label", () => {
		const html = renderToString(
			React.createElement(DirhamSymbol, { "aria-label": "Currency" }),
		);
		expect(html).toContain('aria-label="Currency"');
	});

	it("uses currentColor by default", () => {
		const html = renderToString(React.createElement(DirhamSymbol));
		expect(html).toContain('fill="currentColor"');
	});

	it("accepts custom color", () => {
		const html = renderToString(
			React.createElement(DirhamSymbol, { color: "red" }),
		);
		expect(html).toContain('fill="red"');
	});

	it("contains the dirham SVG path", () => {
		const html = renderToString(React.createElement(DirhamSymbol));
		expect(html).toContain("<path");
	});
});

describe("DirhamIcon", () => {
	it("renders an i element by default", () => {
		const html = renderToString(React.createElement(DirhamIcon));
		expect(html).toContain("<i");
	});

	it("renders a span when as=span", () => {
		const html = renderToString(
			React.createElement(DirhamIcon, { as: "span" }),
		);
		expect(html).toContain("<span");
	});

	it("applies dirham-symbol class", () => {
		const html = renderToString(React.createElement(DirhamIcon));
		expect(html).toContain('class="dirham-symbol"');
	});

	it("merges additional className", () => {
		const html = renderToString(
			React.createElement(DirhamIcon, { className: "custom" }),
		);
		expect(html).toContain('class="dirham-symbol custom"');
	});

	it("has role img", () => {
		const html = renderToString(React.createElement(DirhamIcon));
		expect(html).toContain('role="img"');
	});

	it("has default aria-label", () => {
		const html = renderToString(React.createElement(DirhamIcon));
		expect(html).toContain('aria-label="UAE Dirham"');
	});

	it("applies custom size as font-size", () => {
		const html = renderToString(React.createElement(DirhamIcon, { size: 32 }));
		expect(html).toContain("font-size:32px");
	});

	it("applies string size", () => {
		const html = renderToString(
			React.createElement(DirhamIcon, { size: "2rem" }),
		);
		expect(html).toContain("font-size:2rem");
	});
});
describe("DirhamSymbol weight prop", () => {
	it("regular weight renders no stroke attribute", () => {
		const html = renderToString(
			React.createElement(DirhamSymbol, { weight: "regular" }),
		);
		// DIRHAM_STROKE_MAP.regular === 0, so no stroke props should be applied
		expect(html).not.toContain("stroke-width");
		expect(html).not.toContain('stroke="');
	});

	it("bold weight renders stroke-width", () => {
		const html = renderToString(
			React.createElement(DirhamSymbol, { weight: "bold" }),
		);
		// DIRHAM_STROKE_MAP.bold > 0
		expect(html).toContain("stroke-width");
	});

	it("bold weight renders stroke with paint-order", () => {
		const html = renderToString(
			React.createElement(DirhamSymbol, { weight: "bold" }),
		);
		expect(html).toContain("paint-order");
	});

	it("black weight renders larger stroke-width than bold", () => {
		const boldHtml = renderToString(
			React.createElement(DirhamSymbol, { weight: "bold" }),
		);
		const blackHtml = renderToString(
			React.createElement(DirhamSymbol, { weight: "black" }),
		);
		// Extract stroke-width values and compare numerically
		const extract = (html: string) => {
			const m = html.match(/stroke-width="(\d+)"/);
			return m ? Number(m[1]) : 0;
		};
		expect(extract(blackHtml)).toBeGreaterThan(extract(boldHtml));
	});
});

describe("DirhamPrice", () => {
	it("renders a span with formatted amount", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, { amount: 100 }),
		);
		expect(html).toContain("<span");
		expect(html).toContain("100");
	});

	it("renders inline SVG symbol by default", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, { amount: 250 }),
		);
		expect(html).toContain("<svg");
		expect(html).toContain("250");
	});

	it("renders AED code when useCode is true", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, { amount: 100, useCode: true }),
		);
		expect(html).toContain("AED");
		expect(html).not.toContain("<svg");
	});

	it("accepts custom decimals", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, { amount: 100, decimals: 0 }),
		);
		expect(html).toContain("100");
		expect(html).not.toContain("100.00");
	});

	it("renders em dash for non-finite amount", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, { amount: Number.NaN }),
		);
		expect(html).toContain("—");
	});

	it("has white-space nowrap by default", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, { amount: 100 }),
		);
		expect(html).toContain("white-space:nowrap");
	});

	it("applies custom className", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, {
				amount: 100,
				className: "text-green-500 font-bold",
			}),
		);
		expect(html).toContain('class="text-green-500 font-bold"');
	});

	it("renders compact notation", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, {
				amount: 5000000,
				notation: "compact",
			}),
		);
		expect(html).toContain("5M");
	});

	it("sets dir=rtl for Arabic locale", () => {
		const html = renderToString(
			React.createElement(DirhamPrice, { amount: 100, locale: "ar-AE" }),
		);
		expect(html).toContain('dir="rtl"');
	});
});

describe("DirhamInput", () => {
	it("renders an input element", () => {
		const html = renderToString(React.createElement(DirhamInput));
		expect(html).toContain("<input");
	});

	it("renders with inputMode=decimal", () => {
		const html = renderToString(React.createElement(DirhamInput));
		expect(html).toContain('inputMode="decimal"');
	});

	it("renders SVG symbol when showSymbol is true (default)", () => {
		const html = renderToString(React.createElement(DirhamInput));
		expect(html).toContain("<svg");
	});

	it("renders without symbol when showSymbol is false", () => {
		const html = renderToString(
			React.createElement(DirhamInput, { showSymbol: false }),
		);
		expect(html).not.toContain("<svg");
	});

	it("renders AED code when useCode is true", () => {
		const html = renderToString(
			React.createElement(DirhamInput, { useCode: true }),
		);
		expect(html).toContain("AED");
	});

	it("renders with a default value", () => {
		const html = renderToString(
			React.createElement(DirhamInput, { defaultValue: 100 }),
		);
		expect(html).toContain("100");
	});
});

describe("AnimatedDirhamPrice", () => {
	it("renders a span element", () => {
		const html = renderToString(
			React.createElement(AnimatedDirhamPrice, { amount: 100 }),
		);
		expect(html).toContain("<span");
	});

	it("renders with aria-live for accessibility", () => {
		const html = renderToString(
			React.createElement(AnimatedDirhamPrice, { amount: 100 }),
		);
		expect(html).toContain('aria-live="polite"');
	});

	it("renders initial amount value", () => {
		const html = renderToString(
			React.createElement(AnimatedDirhamPrice, { amount: 0 }),
		);
		// Initial SSR render starts at 0, so should contain formatted 0
		expect(html).toContain("0");
	});

	it("renders with AED code when useCode is true", () => {
		const html = renderToString(
			React.createElement(AnimatedDirhamPrice, {
				amount: 100,
				useCode: true,
			}),
		);
		expect(html).toContain("AED");
	});
});