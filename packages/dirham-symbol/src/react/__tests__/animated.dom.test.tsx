// @vitest-environment jsdom
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnimatedDirhamPrice } from "../AnimatedDirhamPrice";
import { useRoot } from "./helpers";

const { container, render } = useRoot();

describe("AnimatedDirhamPrice", () => {
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

	/** Advance the fake clock and run every frame callback that was waiting. */
	const advance = (ms: number) => {
		clock += ms;
		const due = [...frames.values()];
		frames.clear();
		act(() => {
			for (const frame of due) frame(clock);
		});
	};

	const visible = () =>
		container().querySelector('[aria-hidden="true"]')?.textContent ?? "";
	const announced = () =>
		container().querySelector("[aria-live]")?.textContent ?? "";
	const shown = () => Number.parseFloat(visible().replace(/[^\d.]/g, ""));

	const price = (amount: number, extra = {}) => (
		<AnimatedDirhamPrice
			amount={amount}
			duration={1000}
			easing="linear"
			useCode
			{...extra}
		/>
	);

	it("counts up and lands exactly on the target", () => {
		render(price(0));
		render(price(100));
		advance(500);
		expect(shown()).toBeCloseTo(50, 5);
		advance(600);
		expect(visible()).toContain("100.00");
		expect(frames.size).toBe(0);
	});

	it("restarts from what is on screen when interrupted, not from the old target", () => {
		render(price(0));
		render(price(100));
		advance(500); // on screen: 50
		expect(shown()).toBeCloseTo(50, 5);

		render(price(200));
		advance(100); // 100 ms into a 50 -> 200 animation: 65
		expect(shown()).toBeGreaterThan(50);
		expect(shown()).toBeLessThan(80);
	});

	it("does not freeze when duration changes mid-animation", () => {
		render(price(0));
		render(price(100));
		advance(500);
		render(price(100, { duration: 2000 }));
		advance(2100);
		expect(visible()).toContain("100.00");
	});

	it("jumps to the target for a non-positive duration instead of looping", () => {
		render(price(0));
		render(price(100, { duration: -5 }));
		expect(visible()).toContain("100.00");
		expect(frames.size).toBe(0);
	});

	it("jumps to the target when reduced motion is requested", () => {
		vi.stubGlobal("matchMedia", (query: string) => ({
			matches: query.includes("prefers-reduced-motion"),
		}));
		render(price(0));
		render(price(100));
		expect(visible()).toContain("100.00");
		expect(frames.size).toBe(0);
	});

	it("announces the final amount once, not every frame", () => {
		render(price(0));
		render(price(100));
		const atStart = announced();
		expect(atStart).toContain("100.00");
		advance(250);
		advance(250);
		expect(announced()).toBe(atStart);
		// ...while the animated text is hidden from assistive technology
		expect(container().querySelector('[aria-live] [aria-hidden="true"]')).toBe(
			null,
		);
		expect(visible()).not.toBe("");
	});
});
