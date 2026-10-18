// @vitest-environment jsdom
//
// Behavioural tests for the Web Components, run against a real DOM. The sibling
// web-components.test.ts runs in Node and only checks class shape, which is how a
// <dirham-input> whose event listeners were never attached went unnoticed.
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
	await import("../index");
});

function mount(tag: string, attrs: Record<string, string> = {}): HTMLElement {
	const el = document.createElement(tag);
	for (const [name, value] of Object.entries(attrs)) {
		el.setAttribute(name, value);
	}
	document.body.append(el);
	return el;
}

// The shadow DOM is re-rendered on blur, so always look the input up afresh.
const inputOf = (el: HTMLElement) =>
	el.shadowRoot?.querySelector("input") as HTMLInputElement;

function type(input: HTMLInputElement, text: string) {
	input.value = text;
	input.dispatchEvent(new Event("input", { bubbles: true }));
}

function paste(input: HTMLInputElement, text: string) {
	const event = new Event("paste", { bubbles: true, cancelable: true });
	Object.defineProperty(event, "clipboardData", {
		value: { getData: () => text },
	});
	input.dispatchEvent(event);
	return event;
}

const focus = (el: HTMLElement) =>
	inputOf(el).dispatchEvent(new Event("focus"));
const blur = (el: HTMLElement) => inputOf(el).dispatchEvent(new Event("blur"));

function changes(el: HTMLElement): Array<number | null> {
	const seen: Array<number | null> = [];
	el.addEventListener("dirham-change", (e) =>
		seen.push((e as CustomEvent).detail.value),
	);
	return seen;
}

describe("<dirham-input>", () => {
	it("formats the value attribute on first render", () => {
		const el = mount("dirham-input", { value: "1234.5" });
		expect(inputOf(el).value).toBe("1,234.5");
	});

	it("shows the plain number for editing on focus", () => {
		const el = mount("dirham-input", { value: "1234.5" });
		focus(el);
		expect(inputOf(el).value).toBe("1234.5");
	});

	it("rejects an invalid keystroke without wiping what was typed", () => {
		const el = mount("dirham-input");
		focus(el);
		type(inputOf(el), "250");
		type(inputOf(el), "250a");
		expect(inputOf(el).value).toBe("250");
	});

	it("stops at the configured number of decimals", () => {
		const el = mount("dirham-input");
		focus(el);
		type(inputOf(el), "1.23");
		type(inputOf(el), "1.234");
		expect(inputOf(el).value).toBe("1.23");
	});

	it("commits on blur: formats, exposes numericValue and emits dirham-change", () => {
		const el = mount("dirham-input", { value: "100" });
		const seen = changes(el);
		focus(el);
		type(inputOf(el), "2500");
		blur(el);

		expect(seen).toEqual([2500]);
		expect((el as unknown as { numericValue: number }).numericValue).toBe(2500);
		// The value attribute is still "100"; the user's edit must win over it.
		expect(inputOf(el).value).toBe("2,500");
	});

	it("clamps to min and max on blur", () => {
		const el = mount("dirham-input", { min: "0", max: "500" });
		const seen = changes(el);
		focus(el);
		type(inputOf(el), "900");
		blur(el);

		expect(seen).toEqual([500]);
		expect(inputOf(el).value).toBe("500");
	});

	it("does not emit when focus and blur leave the value unchanged", () => {
		const el = mount("dirham-input", { value: "100" });
		const seen = changes(el);
		focus(el);
		blur(el);
		expect(seen).toEqual([]);
	});

	it("commits null when the field is cleared", () => {
		const el = mount("dirham-input", { value: "100" });
		const seen = changes(el);
		focus(el);
		type(inputOf(el), "");
		blur(el);
		expect(seen).toEqual([null]);
		expect(inputOf(el).value).toBe("");
	});

	it("lets a later value attribute replace the user's edit", () => {
		const el = mount("dirham-input", { value: "100" });
		focus(el);
		type(inputOf(el), "250");
		blur(el);

		el.setAttribute("value", "300");
		expect(inputOf(el).value).toBe("300");
		expect((el as unknown as { numericValue: number }).numericValue).toBe(300);
	});

	it("cleans pasted text (separators, currency, extra decimals)", () => {
		const el = mount("dirham-input");
		const seen = changes(el);
		focus(el);
		const event = paste(inputOf(el), "AED 1,234.567");
		blur(el);

		expect(event.defaultPrevented).toBe(true);
		expect(seen).toEqual([1234.56]);
		expect(inputOf(el).value).toBe("1,234.56");
	});

	it("ignores paste when readonly or disabled", () => {
		for (const attr of ["readonly", "disabled"]) {
			const el = mount("dirham-input", { value: "100", [attr]: "" });
			const seen = changes(el);
			focus(el);
			paste(inputOf(el), "999");
			blur(el);
			expect(seen).toEqual([]);
			expect(inputOf(el).value).toBe("100");
		}
	});
});

describe("<dirham-symbol>", () => {
	const payload = 'x"><img src=x onerror=alert(1)>';

	for (const weight of ["regular", "bold"]) {
		for (const attr of ["color", "size", "aria-label"]) {
			it(`treats ${attr}="${payload}" as text (weight ${weight})`, () => {
				const el = mount("dirham-symbol", { weight, [attr]: payload });
				expect(el.shadowRoot?.querySelector("img")).toBeNull();
				expect(el.shadowRoot?.querySelectorAll("svg")).toHaveLength(1);
			});
		}
	}

	it("still renders a normal colour and label", () => {
		const el = mount("dirham-symbol", {
			color: "#16a34a",
			"aria-label": "Dirham",
			weight: "bold",
		});
		const svg = el.shadowRoot?.querySelector("svg");
		expect(svg?.getAttribute("fill")).toBe("#16a34a");
		expect(svg?.getAttribute("aria-label")).toBe("Dirham");
		expect(el.shadowRoot?.querySelector("path")?.getAttribute("stroke")).toBe(
			"#16a34a",
		);
	});
});
