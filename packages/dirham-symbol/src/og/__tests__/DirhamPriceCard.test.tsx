import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { DirhamPriceCard } from "../DirhamPriceCard";

describe("DirhamPriceCard", () => {
	it("returns a React element", () => {
		const el = createElement(DirhamPriceCard, { amount: 100 });
		expect(el).toBeDefined();
		expect(el.type).toBe(DirhamPriceCard);
	});

	it("passes amount through props", () => {
		const el = createElement(DirhamPriceCard, { amount: 250.75 });
		expect(el.props.amount).toBe(250.75);
	});

	it("accepts all optional props", () => {
		const el = createElement(DirhamPriceCard, {
			amount: 500,
			title: "Monthly Rent",
			subtitle: "April 2026",
			locale: "ar-AE",
			decimals: 0,
			notation: "compact",
			width: 800,
			height: 400,
			background: "#111",
			textColor: "#eee",
			accentColor: "#0070f3",
		});
		expect(el.props.title).toBe("Monthly Rent");
		expect(el.props.locale).toBe("ar-AE");
	});

	it("has correct displayName / function name", () => {
		expect(DirhamPriceCard.name).toBe("DirhamPriceCard");
	});
});
