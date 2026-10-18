// @vitest-environment jsdom
//
// Interactive behaviour of <DirhamInput> in a real DOM. The sibling
// components.test.tsx uses renderToString, which cannot focus, type or paste.
import { act, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DirhamInput } from "../DirhamInput";
import { useRoot } from "./helpers";

const { container, render } = useRoot();

const input = () => container().querySelector("input") as HTMLInputElement;

// React ignores `input.value = x`; go through the native setter so its value
// tracker sees a real change.
function type(text: string) {
	const setValue = Object.getOwnPropertyDescriptor(
		HTMLInputElement.prototype,
		"value",
	)?.set;
	act(() => {
		setValue?.call(input(), text);
		input().dispatchEvent(new Event("input", { bubbles: true }));
	});
}

const focus = () => act(() => input().focus());
const blur = () => act(() => input().blur());

describe("DirhamInput", () => {
	function Harness() {
		const [amount, setAmount] = useState<number | undefined>(undefined);
		return (
			<>
				<DirhamInput value={amount} onChange={setAmount} />
				<button type="button" id="reset" onClick={() => setAmount(undefined)}>
					reset
				</button>
				<button type="button" id="set" onClick={() => setAmount(42)}>
					set
				</button>
			</>
		);
	}
	const click = (id: string) =>
		act(() => {
			(container().querySelector(`#${id}`) as HTMLButtonElement).click();
		});

	it("is emptied when the parent resets value to undefined after typing", () => {
		render(<Harness />);
		focus();
		type("5");
		blur();
		expect(input().value).toBe("5");

		click("reset");
		expect(input().value).toBe("");
	});

	it("follows the parent through set, reset, set", () => {
		render(<Harness />);
		click("set");
		expect(input().value).toBe("42");
		click("reset");
		expect(input().value).toBe("");
		click("set");
		expect(input().value).toBe("42");
	});

	it("shows an empty field when the user clears a controlled value", () => {
		render(<Harness />);
		focus();
		type("12");
		type("");
		blur();
		expect(input().value).toBe("");
	});

	it("keeps working uncontrolled when value is never provided", () => {
		const onChange = vi.fn();
		render(<DirhamInput defaultValue={10} onChange={onChange} />);
		expect(input().value).toBe("10");
		focus();
		type("7");
		blur();
		expect(input().value).toBe("7");
		expect(onChange).toHaveBeenLastCalledWith(7);
	});

	it("keeps working when value is passed but always undefined", () => {
		// A wrapper that forwards an optional `value` it never updates.
		render(<DirhamInput value={undefined} />);
		focus();
		type("7");
		blur();
		expect(input().value).toBe("7");
	});

	it("clamps to min and max on blur", () => {
		const onChange = vi.fn();
		render(<DirhamInput min={0} max={500} onChange={onChange} />);
		focus();
		type("900");
		blur();
		expect(onChange).toHaveBeenLastCalledWith(500);
		expect(input().value).toBe("500");
	});

	it("ignores paste when readOnly", () => {
		const onChange = vi.fn();
		render(<DirhamInput value={100} readOnly onChange={onChange} />);
		focus();
		const event = new Event("paste", { bubbles: true, cancelable: true });
		Object.defineProperty(event, "clipboardData", {
			value: { getData: () => "999" },
		});
		act(() => {
			input().dispatchEvent(event);
		});
		expect(onChange).not.toHaveBeenCalled();
	});
});
