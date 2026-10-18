import { DIRHAM_STROKE_MAP, type DirhamWeight } from "../core/constants";
import { DIRHAM_SVG_PATH, DIRHAM_SVG_VIEWBOX } from "../core/svg";
import { BaseElement } from "./base";

const VALID_WEIGHTS = new Set<string>([
	"thin",
	"extralight",
	"light",
	"regular",
	"medium",
	"semibold",
	"bold",
	"extrabold",
	"black",
]);

const _fmtCache = new Map<string, Intl.NumberFormat>();

function getInputFormatter(
	locale: string,
	decimals: number,
): Intl.NumberFormat {
	const key = `wc-input:${locale}:${decimals}`;
	let fmt = _fmtCache.get(key);
	if (!fmt) {
		fmt = new Intl.NumberFormat(locale, {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		});
		_fmtCache.set(key, fmt);
	}
	return fmt;
}

function stripFormatting(raw: string): string {
	let cleaned = raw.replace(/[\u0660-\u0669]/g, (d) =>
		String(d.charCodeAt(0) - 0x0660),
	);
	cleaned = cleaned.replace(/\u066B/g, ".");
	cleaned = cleaned.replace(/[,\s\u00A0\u066C]/g, "");
	cleaned = cleaned.replace(/[\u20C3]/g, "");
	cleaned = cleaned.replace(/AED/gi, "");
	cleaned = cleaned.replace(/د\.إ/g, "");
	return cleaned.trim();
}

function escapeHTML(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
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
 * Events: `dirham-change` — fires with `{ detail: { value: number | null } }`
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
	#isFocused = false;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#render();
		this.#attachListeners();
	}

	get numericValue(): number | null {
		return this.#numericValue;
	}

	attributeChangedCallback() {
		if (!this.#isFocused) {
			this.#render();
			this.#attachListeners();
		}
	}

	#getConfig() {
		const locale = this.getAttribute("locale") || "en-AE";
		const decimals = Number(this.getAttribute("decimals") ?? "2");
		const min = this.hasAttribute("min")
			? Number(this.getAttribute("min"))
			: undefined;
		const max = this.hasAttribute("max")
			? Number(this.getAttribute("max"))
			: undefined;
		const showSymbol =
			!this.hasAttribute("show-symbol") ||
			this.getAttribute("show-symbol") !== "false";
		const useCode = this.hasAttribute("use-code");
		const symbolSize = this.getAttribute("symbol-size") || "1em";
		const weightAttr = this.getAttribute("weight") || "regular";
		const weight: DirhamWeight = VALID_WEIGHTS.has(weightAttr)
			? (weightAttr as DirhamWeight)
			: "regular";
		const disabled = this.hasAttribute("disabled");
		const readonly = this.hasAttribute("readonly");
		const isRTL = locale.startsWith("ar");

		return {
			locale,
			decimals,
			min,
			max,
			showSymbol,
			useCode,
			symbolSize,
			weight,
			disabled,
			readonly,
			isRTL,
		};
	}

	#clamp(v: number): number {
		const { min, max } = this.#getConfig();
		let result = v;
		if (min !== undefined && result < min) result = min;
		if (max !== undefined && result > max) result = max;
		return result;
	}

	#formatDisplay(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return "";
		const { locale, decimals } = this.#getConfig();
		return getInputFormatter(locale, decimals).format(value);
	}

	#render() {
		const config = this.#getConfig();
		const valAttr = this.getAttribute("value");
		if (valAttr !== null && !this.#isFocused) {
			const parsed = Number(valAttr);
			this.#numericValue = Number.isFinite(parsed) ? parsed : null;
		}

		const displayVal = this.#isFocused
			? undefined // keep current input value
			: this.#formatDisplay(this.#numericValue);

		const strokeWidth = DIRHAM_STROKE_MAP[config.weight];
		const strokeAttrs =
			strokeWidth > 0
				? ` stroke="currentColor" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke"`
				: "";

		const symbolHTML = config.showSymbol
			? config.useCode
				? `<span style="user-select:none;flex-shrink:0;${config.isRTL ? "margin-left" : "margin-right"}:0.5em" aria-hidden="true">AED</span>`
				: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DIRHAM_SVG_VIEWBOX}" width="${escapeHTML(String(config.symbolSize))}" height="${escapeHTML(String(config.symbolSize))}" fill="currentColor" role="img" aria-hidden="true" style="display:inline-block;vertical-align:middle;flex-shrink:0;${config.isRTL ? "margin-left" : "margin-right"}:0.5em"><path d="${DIRHAM_SVG_PATH}"${strokeAttrs}/></svg>`
			: "";

		const placeholder =
			this.getAttribute("placeholder") ||
			getInputFormatter(config.locale, config.decimals).format(0);

		const html = `
<style>
:host { display: inline-flex; align-items: center; direction: ${config.isRTL ? "rtl" : "ltr"}; }
input { min-width: 0; flex: 1; border: none; background: transparent; font: inherit; color: inherit; outline: none; padding: 0; direction: ${config.isRTL ? "rtl" : "ltr"}; }
</style>
${config.isRTL ? "" : symbolHTML}
<input type="text" inputmode="decimal" aria-label="Amount in AED" placeholder="${escapeHTML(placeholder)}"${config.disabled ? " disabled" : ""}${config.readonly ? " readonly" : ""}${displayVal !== undefined ? ` value="${escapeHTML(displayVal)}"` : ""}/>
${config.isRTL ? symbolHTML : ""}`;

		// Preserve input value during focus
		if (!this.#isFocused) {
			this.#shadow.innerHTML = html;
			this.#input = this.#shadow.querySelector("input");
		}
	}

	#attachListeners() {
		const input = this.#shadow.querySelector("input");
		if (!input || input === this.#input) return;
		this.#input = input;

		input.addEventListener("focus", () => {
			this.#isFocused = true;
			const plain =
				this.#numericValue !== null && Number.isFinite(this.#numericValue)
					? this.#numericValue.toString()
					: "";
			input.value = plain;
			setTimeout(() => input.select(), 0);
		});

		input.addEventListener("blur", () => {
			this.#isFocused = false;
			const stripped = stripFormatting(input.value);
			const { decimals } = this.#getConfig();

			if (stripped === "" || stripped === "." || stripped === "-") {
				this.#numericValue = null;
			} else {
				let parsed = Number.parseFloat(stripped);
				if (Number.isNaN(parsed)) {
					this.#numericValue = null;
				} else {
					const factor = 10 ** decimals;
					parsed = Math.round(parsed * factor) / factor;
					parsed = this.#clamp(parsed);
					this.#numericValue = parsed;
				}
			}

			this.#render();
			this.#attachListeners();
			this.dispatchEvent(
				new CustomEvent("dirham-change", {
					detail: { value: this.#numericValue },
					bubbles: true,
					composed: true,
				}),
			);
		});

		input.addEventListener("input", () => {
			const cleaned = stripFormatting(input.value);
			if (cleaned !== "" && !/^-?\d*\.?\d*$/.test(cleaned)) {
				// Reject by reverting
				const prev =
					this.#numericValue !== null ? this.#numericValue.toString() : "";
				input.value = prev;
				return;
			}
			const { decimals } = this.#getConfig();
			const dotIndex = cleaned.indexOf(".");
			if (dotIndex !== -1 && cleaned.slice(dotIndex + 1).length > decimals) {
				const prev =
					this.#numericValue !== null ? this.#numericValue.toString() : "";
				input.value = prev;
				return;
			}
			input.value = cleaned;
		});

		input.addEventListener("paste", (e: ClipboardEvent) => {
			e.preventDefault();
			const pasted = e.clipboardData?.getData("text/plain") ?? "";
			const stripped = stripFormatting(pasted);
			if (stripped === "") return;
			const { decimals } = this.#getConfig();

			let final = stripped;
			const dotIndex = stripped.indexOf(".");
			if (dotIndex !== -1) {
				final = `${stripped.slice(0, dotIndex)}.${stripped.slice(dotIndex + 1, dotIndex + 1 + decimals)}`;
			}
			if (!/^-?\d*\.?\d*$/.test(final)) return;

			input.value = final;
			const parsed = Number.parseFloat(final);
			if (!Number.isNaN(parsed)) {
				const factor = 10 ** decimals;
				this.#numericValue = this.#clamp(Math.round(parsed * factor) / factor);
			}
		});
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-input")
) {
	customElements.define("dirham-input", DirhamInputElement);
}
