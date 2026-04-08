import { describe, expect, it } from "vitest";

// Web Components extend HTMLElement which isn't available in Node.
// We test the static interface and attribute definitions only.
// Full rendering is tested via the browser (demo page).

describe("DirhamPriceElement", () => {
	it("is exported as a class", async () => {
		// Dynamic import so the module loads lazily — avoids HTMLElement crash at import time in Node
		// We mock HTMLElement first
		const original = globalThis.HTMLElement;
		// @ts-expect-error minimal mock for testing static properties
		globalThis.HTMLElement = class {};
		// @ts-expect-error minimal mock
		globalThis.customElements = { get: () => undefined, define: () => {} };

		const mod = await import("../DirhamPriceElement");
		expect(mod.DirhamPriceElement).toBeDefined();
		expect(typeof mod.DirhamPriceElement).toBe("function");
		expect(mod.DirhamPriceElement.observedAttributes).toEqual([
			"amount",
			"locale",
			"decimals",
			"notation",
			"use-code",
			"symbol-size",
			"weight",
			"currency",
		]);

		globalThis.HTMLElement = original;
	});
});

describe("DirhamSymbolElement", () => {
	it("is exported as a class", async () => {
		const original = globalThis.HTMLElement;
		// @ts-expect-error minimal mock for testing static properties
		globalThis.HTMLElement = class {};
		// @ts-expect-error minimal mock
		globalThis.customElements = { get: () => undefined, define: () => {} };

		const mod = await import("../DirhamSymbolElement");
		expect(mod.DirhamSymbolElement).toBeDefined();
		expect(typeof mod.DirhamSymbolElement).toBe("function");
		expect(mod.DirhamSymbolElement.observedAttributes).toEqual([
			"size",
			"color",
			"weight",
			"aria-label",
		]);

		globalThis.HTMLElement = original;
	});
});

describe("DirhamInputElement", () => {
	it("is exported as a class", async () => {
		const original = globalThis.HTMLElement;
		// @ts-expect-error minimal mock for testing static properties
		globalThis.HTMLElement = class {};
		// @ts-expect-error minimal mock
		globalThis.customElements = { get: () => undefined, define: () => {} };

		const mod = await import("../DirhamInputElement");
		expect(mod.DirhamInputElement).toBeDefined();
		expect(typeof mod.DirhamInputElement).toBe("function");
		expect(mod.DirhamInputElement.observedAttributes).toEqual([
			"value",
			"locale",
			"decimals",
			"min",
			"max",
			"placeholder",
			"disabled",
			"readonly",
			"show-symbol",
			"use-code",
			"symbol-size",
			"weight",
		]);

		globalThis.HTMLElement = original;
	});
});

describe("AnimatedDirhamPriceElement", () => {
	it("is exported as a class", async () => {
		const original = globalThis.HTMLElement;
		// @ts-expect-error minimal mock for testing static properties
		globalThis.HTMLElement = class {};
		// @ts-expect-error minimal mock
		globalThis.customElements = { get: () => undefined, define: () => {} };

		const mod = await import("../AnimatedDirhamPriceElement");
		expect(mod.AnimatedDirhamPriceElement).toBeDefined();
		expect(typeof mod.AnimatedDirhamPriceElement).toBe("function");
		expect(mod.AnimatedDirhamPriceElement.observedAttributes).toEqual([
			"amount",
			"duration",
			"easing",
			"locale",
			"decimals",
			"notation",
			"use-code",
			"symbol-size",
			"weight",
		]);

		globalThis.HTMLElement = original;
	});
});
