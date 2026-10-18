import {
	cleanPaste,
	formatEntry,
	isValidEntry,
	parseEntry,
	plainEntry,
	stripFormatting,
} from "../core/input";
import { isArabicLocale } from "../core/locale";
import { BaseElement } from "./base";
import { escapeHTML, parseWeight, symbolSVG } from "./shared";

/** A number from the `value` attribute, or null when absent or not numeric. */
function parseValueAttribute(attr: string | null): number | null {
	if (attr === null || attr.trim() === "") return null;
	const parsed = Number(attr);
	return Number.isFinite(parsed) ? parsed : null;
}

/**
 * `<dirham-input>` — framework-agnostic masked currency input.
 *
 * Works in Vue, Angular, Svelte, or any HTML page.
 *
 * @example
 * ```html
 * <script type="module">
 *   import "dirham/web-component";
 * </script>
 *
 * <dirham-input value="100" min="0" max="999999"></dirham-input>
 * <dirham-input locale="ar-AE" decimals="2"></dirham-input>
 * ```
 *
 * While the field is focused it holds the plain number being typed; on blur the
 * value is rounded to `decimals`, clamped to `min`/`max` and formatted.
 *
 * Events: `dirham-change` — fires on blur when the committed value changed, with
 * `{ detail: { value: number | null } }` (`null` when the field was cleared).
 * Setting the `value` attribute afterwards replaces whatever the user entered.
 */
export class DirhamInputElement extends BaseElement {
	static get observedAttributes() {
		return [
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
		];
	}

	#shadow: ShadowRoot;
	#input: HTMLInputElement | null = null;
	#numericValue: number | null = null;
	#valueAtFocus: number | null = null;
	#isFocused = false;
	/** The last text the field was allowed to hold, restored when a keystroke is rejected. */
	#acceptedText = "";

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#render();
	}

	/** The committed value: updated on blur, not while typing. */
	get numericValue(): number | null {
		return this.#numericValue;
	}

	attributeChangedCallback(name: string) {
		if (name === "value") {
			this.#numericValue = parseValueAttribute(this.getAttribute("value"));
		}
		if (!this.#isFocused) {
			this.#render();
		} else if (name === "value" && this.#input) {
			// Re-rendering now would drop the caret and the text being typed.
			this.#acceptedText = plainEntry(this.#numericValue);
			this.#input.value = this.#acceptedText;
		}
	}

	#getConfig() {
		const locale = this.getAttribute("locale") || "en-AE";
		return {
			locale,
			decimals: Number(this.getAttribute("decimals") ?? "2"),
			min: this.hasAttribute("min")
				? Number(this.getAttribute("min"))
				: undefined,
			max: this.hasAttribute("max")
				? Number(this.getAttribute("max"))
				: undefined,
			showSymbol: this.getAttribute("show-symbol") !== "false",
			useCode: this.hasAttribute("use-code"),
			symbolSize: this.getAttribute("symbol-size") || "1em",
			weight: parseWeight(this.getAttribute("weight")),
			disabled: this.hasAttribute("disabled"),
			readonly: this.hasAttribute("readonly"),
			isRTL: isArabicLocale(locale),
		};
	}

	#clamp(v: number): number {
		const { min, max } = this.#getConfig();
		let result = v;
		if (min !== undefined && result < min) result = min;
		if (max !== undefined && result > max) result = max;
		return result;
	}

	#render() {
		const config = this.#getConfig();
		const direction = config.isRTL ? "rtl" : "ltr";
		const gap = `margin-${config.isRTL ? "left" : "right"}:0.5em`;

		let symbolHTML = "";
		if (config.showSymbol) {
			symbolHTML = config.useCode
				? `<span style="user-select:none;flex-shrink:0;${gap}" aria-hidden="true">AED</span>`
				: symbolSVG({
						size: config.symbolSize,
						weight: config.weight,
						style: `display:inline-block;vertical-align:middle;flex-shrink:0;${gap}`,
					});
		}

		const placeholder =
			this.getAttribute("placeholder") ||
			formatEntry(0, config.locale, config.decimals);
		const display = formatEntry(
			this.#numericValue,
			config.locale,
			config.decimals,
		);

		this.#shadow.innerHTML = `
<style>
:host { display: inline-flex; align-items: center; direction: ${direction}; }
input { min-width: 0; flex: 1; border: none; background: transparent; font: inherit; color: inherit; outline: none; padding: 0; direction: ${direction}; }
</style>
${config.isRTL ? "" : symbolHTML}
<input type="text" inputmode="decimal" aria-label="Amount in AED" placeholder="${escapeHTML(placeholder)}" value="${escapeHTML(display)}"${config.disabled ? " disabled" : ""}${config.readonly ? " readonly" : ""}/>
${config.isRTL ? symbolHTML : ""}`;

		// Every render replaces the input, so its listeners are attached right here.
		this.#input = this.#shadow.querySelector("input");
		if (this.#input) this.#bind(this.#input);
	}

	#bind(input: HTMLInputElement) {
		input.addEventListener("focus", () => this.#onFocus(input));
		input.addEventListener("blur", () => this.#onBlur(input));
		input.addEventListener("input", () => this.#onInput(input));
		input.addEventListener("paste", (event) => this.#onPaste(event, input));
	}

	#onFocus(input: HTMLInputElement) {
		this.#isFocused = true;
		this.#valueAtFocus = this.#numericValue;
		this.#acceptedText = plainEntry(this.#numericValue);
		input.value = this.#acceptedText;
		setTimeout(() => input.select(), 0);
	}

	#onInput(input: HTMLInputElement) {
		const cleaned = stripFormatting(input.value);
		if (!isValidEntry(cleaned, this.#getConfig().decimals)) {
			input.value = this.#acceptedText; // reject this keystroke, keep the rest
			return;
		}
		this.#acceptedText = cleaned;
		input.value = cleaned;
	}

	#onPaste(event: Event, input: HTMLInputElement) {
		event.preventDefault();
		if (input.readOnly || input.disabled) return;
		const pasted = (event as ClipboardEvent).clipboardData?.getData(
			"text/plain",
		);
		const cleaned = cleanPaste(pasted ?? "", this.#getConfig().decimals);
		if (cleaned === undefined) return;
		this.#acceptedText = cleaned;
		input.value = cleaned;
	}

	#onBlur(input: HTMLInputElement) {
		this.#isFocused = false;
		const parsed = parseEntry(
			stripFormatting(input.value),
			this.#getConfig().decimals,
		);
		this.#numericValue = parsed === undefined ? null : this.#clamp(parsed);
		this.#render();

		if (this.#numericValue !== this.#valueAtFocus) {
			this.dispatchEvent(
				new CustomEvent("dirham-change", {
					detail: { value: this.#numericValue },
					bubbles: true,
					composed: true,
				}),
			);
		}
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-input")
) {
	customElements.define("dirham-input", DirhamInputElement);
}
