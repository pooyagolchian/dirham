import { describe, expect, it } from "vitest";

// Server-side rendering frameworks import "dirham/web-component" in Node,
// where neither HTMLElement nor customElements exists.
describe("dirham/web-component on the server", () => {
	it("imports without HTMLElement or customElements", async () => {
		expect(typeof globalThis.HTMLElement).toBe("undefined");
		expect(typeof globalThis.customElements).toBe("undefined");

		const mod = await import("../index");
		expect(typeof mod.DirhamSymbolElement).toBe("function");
		expect(typeof mod.DirhamPriceElement).toBe("function");
		expect(typeof mod.DirhamInputElement).toBe("function");
		expect(typeof mod.AnimatedDirhamPriceElement).toBe("function");
	});
});
