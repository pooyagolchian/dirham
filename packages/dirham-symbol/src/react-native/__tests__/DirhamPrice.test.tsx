import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// react-native and react-native-svg are optional peers and not installed here, so
// replace them with host elements that expose the props under test.
vi.mock("react-native", async () => {
	const { createElement } = await import("react");
	return {
		View: ({
			children,
			accessibilityLabel,
		}: { children?: React.ReactNode; accessibilityLabel?: string }) =>
			createElement("div", { "data-label": accessibilityLabel }, children),
		Text: ({ children }: { children?: React.ReactNode }) =>
			createElement("span", null, children),
	};
});
vi.mock("react-native-svg", async () => {
	const { createElement } = await import("react");
	return {
		Svg: ({ children }: { children?: React.ReactNode }) =>
			createElement("svg", null, children),
		Path: () => createElement("path"),
	};
});

describe("react-native DirhamPrice", () => {
	it("labels the price for screen readers", async () => {
		const { DirhamPrice } = await import("../DirhamPrice");
		const { createElement } = await import("react");
		const html = renderToString(createElement(DirhamPrice, { amount: 1250 }));
		expect(html).toContain("1,250.00");
		expect(html).toContain('data-label="');
	});

	it("renders a dash instead of crashing for an amount that is not finite", async () => {
		const { DirhamPrice } = await import("../DirhamPrice");
		const { createElement } = await import("react");
		for (const amount of [Number.NaN, Number.POSITIVE_INFINITY]) {
			const render = () =>
				renderToString(createElement(DirhamPrice, { amount }));
			expect(render, String(amount)).not.toThrow();
			expect(render()).toContain("—");
		}
	});
});
