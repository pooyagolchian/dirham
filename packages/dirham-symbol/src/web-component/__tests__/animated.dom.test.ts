// @vitest-environment jsdom
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

beforeAll(async () => {
	await import("../index");
});

let clock = 0;
let nextId = 0;
const frames = new Map<number, FrameRequestCallback>();

beforeEach(() => {
	clock = 0;
	nextId = 0;
	frames.clear();
	vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
		frames.set(++nextId, cb);
		return nextId;
	});
	vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
	vi.spyOn(performance, "now").mockImplementation(() => clock);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
	document.body.replaceChildren();
});

/** Advance the fake clock and run every frame callback that was waiting. */
function advance(ms: number) {
	clock += ms;
	const due = [...frames.values()];
	frames.clear();
	for (const frame of due) frame(clock);
}

function mount(attrs: Record<string, string>): HTMLElement {
	const el = document.createElement("dirham-animated-price");
	for (const [name, value] of Object.entries(attrs)) {
		el.setAttribute(name, value);
	}
	document.body.append(el);
	return el;
}

const visible = (el: HTMLElement) =>
	el.shadowRoot?.querySelector('[aria-hidden="true"]')?.textContent ?? "";
const announced = (el: HTMLElement) =>
	el.shadowRoot?.querySelector("[aria-live]")?.textContent ?? "";

const base = {
	amount: "0",
	duration: "1000",
	easing: "linear",
	"use-code": "",
};

describe("<dirham-animated-price>", () => {
	it("counts up and lands exactly on the target", () => {
		const el = mount(base);
		el.setAttribute("amount", "100");
		advance(500);
		expect(visible(el)).toContain("50.00");
		advance(600);
		expect(visible(el)).toContain("100.00");
		expect(frames.size).toBe(0);
	});

	it("restarts from what is on screen when the amount changes mid-count", () => {
		const el = mount(base);
		el.setAttribute("amount", "100");
		advance(500);
		el.setAttribute("amount", "200");
		advance(100); // 50 -> 200, 100 ms in: 65
		const shown = Number.parseFloat(visible(el).replace(/[^\d.]/g, ""));
		expect(shown).toBeGreaterThan(50);
		expect(shown).toBeLessThan(80);
	});

	it("jumps to the target for a non-positive duration instead of looping", () => {
		const el = mount({ ...base, duration: "-5" });
		el.setAttribute("amount", "100");
		expect(visible(el)).toContain("100.00");
		expect(frames.size).toBe(0);
	});

	it("jumps to the target when reduced motion is requested", () => {
		vi.stubGlobal("matchMedia", (query: string) => ({
			matches: query.includes("prefers-reduced-motion"),
		}));
		const el = mount(base);
		el.setAttribute("amount", "100");
		expect(visible(el)).toContain("100.00");
		expect(frames.size).toBe(0);
	});

	it("announces the final amount once, not every frame", () => {
		const el = mount(base);
		el.setAttribute("amount", "100");
		const atStart = announced(el);
		expect(atStart).toContain("100.00");
		advance(250);
		advance(250);
		expect(announced(el)).toBe(atStart);
		expect(visible(el)).not.toBe("");
	});

	it("updates the digits in place instead of rebuilding the symbol every frame", () => {
		const el = mount({ amount: "0", duration: "1000", easing: "linear" });
		el.setAttribute("amount", "100");
		const svg = el.shadowRoot?.querySelector("svg");
		expect(svg).not.toBeNull();
		advance(100);
		advance(100);
		expect(el.shadowRoot?.querySelector("svg")).toBe(svg);
	});

	it("stops animating when removed from the page", () => {
		const el = mount(base);
		el.setAttribute("amount", "100");
		expect(frames.size).toBe(1);
		el.remove();
		expect(frames.size).toBe(0);
	});

	it("shows the target when it is put back after being removed mid-count", () => {
		const el = mount(base);
		el.setAttribute("amount", "100");
		advance(300);
		el.remove();
		document.body.append(el);
		expect(visible(el)).toContain("100.00");
	});

	it("keeps counting when another attribute changes", () => {
		const el = mount(base);
		el.setAttribute("amount", "100");
		advance(500);
		el.setAttribute("locale", "en-US");
		advance(600);
		expect(visible(el)).toContain("100.00");
	});

	it("shows the initial amount at once, as parsed HTML does, rather than counting up from 0", () => {
		// Frameworks create the element, set attributes, then insert it.
		const el = mount({ ...base, amount: "75" });
		expect(visible(el)).toContain("75.00");
		expect(frames.size).toBe(0);
	});

	it("ignores an amount that is not a number", () => {
		const el = mount({ ...base, amount: "40" });
		el.setAttribute("amount", "abc");
		expect(visible(el)).toContain("40.00");
		expect(frames.size).toBe(0);
	});
});
