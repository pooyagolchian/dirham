import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DirhamIcon } from "../DirhamIcon";
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