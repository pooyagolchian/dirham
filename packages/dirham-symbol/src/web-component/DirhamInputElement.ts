import { DIRHAM_STROKE_MAP, type DirhamWeight } from "../core/constants";
import { parseDirham } from "../core/format";

const SVG_PATH =
	"m88.3 1c0.4 0.6 2.6 3.3 4.7 5.9 15.3 18.2 26.8 47.8 33 85.1 4.1 24.5 4.3 32.2 4.3 125.6v87h-41.8c-38.2 0-42.6-0.2-50.1-1.7-11.8-2.5-24-9.2-32.2-17.8-6.5-6.9-6.3-7.3-5.9 13.6 0.5 17.3 0.7 19.2 3.2 28.6 4 14.9 9.5 26 17.8 35.9 11.3 13.6 22.8 21.2 39.2 26.3 3.5 1 10.9 1.4 37.1 1.6l32.7 0.5v43.3 43.4l-46.1-0.3-46.3-0.3-8-3.2c-9.5-3.8-13.8-6.6-23.1-14.9l-6.8-6.1 0.4 19.1c0.5 17.7 0.6 19.7 3.1 28.7 8.7 31.8 29.7 54.5 57.4 61.9 6.9 1.9 9.6 2 38.5 2.4l30.9 0.4v89.6c0 54.1-0.3 94-0.8 100.8-0.5 6.2-2.1 17.8-3.5 25.9-6.5 37.3-18.2 65.4-35 83.6l-3.4 3.7h169.1c101.1 0 176.7-0.4 187.8-0.9 19.5-1 63-5.3 72.8-7.4 3.1-0.6 8.9-1.5 12.7-2.1 8.1-1.2 21.5-4 40.8-8.9 27.2-6.8 52-15.3 76.3-26.1 7.6-3.4 29.4-14.5 35.2-18 3.1-1.8 6.8-4 8.2-4.7 3.9-2.1 10.4-6.3 19.9-13.1 4.7-3.4 9.4-6.7 10.4-7.4 4.2-2.8 18.7-14.9 25.3-21 25.1-23.1 46.1-48.8 62.4-76.3 2.3-4 5.3-9 6.6-11.1 3.3-5.6 16.9-33.6 18.2-37.8 0.6-1.9 1.4-3.9 1.8-4.3 2.6-3.4 17.6-50.6 19.4-60.9 0.6-3.3 0.9-3.8 3.4-4.3 1.6-0.3 24.9-0.3 51.8-0.1 53.8 0.4 53.8 0.4 65.7 5.9 6.7 3.1 8.7 4.5 16.1 11.2 9.7 8.7 8.8 10.1 8.2-11.7-0.4-12.8-0.9-20.7-1.8-23.9-3.4-12.3-4.2-14.9-7.2-21.1-9.8-21.4-26.2-36.7-47.2-44l-8.2-3-33.4-0.4-33.3-0.5 0.4-11.7c0.4-15.4 0.4-45.9-0.1-61.6l-0.4-12.6 44.6-0.2c38.2-0.2 45.3 0 49.5 1.1 12.6 3.5 21.1 8.3 31.5 17.8l5.8 5.4v-14.8c0-17.6-0.9-25.4-4.5-37-7.1-23.5-21.1-41-41.1-51.8-13-7-13.8-7.2-58.5-7.5-26.2-0.2-39.9-0.6-40.6-1.2-0.6-0.6-1.1-1.6-1.1-2.4 0-0.8-1.5-7.1-3.5-13.9-23.4-82.7-67.1-148.4-131-197.1-8.7-6.7-30-20.8-38.6-25.6-3.3-1.9-6.9-3.9-7.8-4.5-4.2-2.3-28.3-14.1-34.3-16.6-3.6-1.6-8.3-3.6-10.4-4.4-35.3-15.3-94.5-29.8-139.7-34.3-7.4-0.7-17.2-1.8-21.7-2.2-20.4-2.3-48.7-2.6-209.4-2.6-135.8 0-169.9 0.3-169.4 1zm330.7 43.3c33.8 2 54.6 4.6 78.9 10.5 74.2 17.6 126.4 54.8 164.3 117 3.5 5.8 18.3 36 20.5 42.1 10.5 28.3 15.6 45.1 20.1 67.3 1.1 5.4 2.6 12.6 3.3 16 0.7 3.3 1 6.4 0.7 6.7-0.5 0.4-100.9 0.6-223.3 0.5l-222.5-0.2-0.3-128.5c-0.1-70.6 0-129.3 0.3-130.4l0.4-1.9h71.1c39 0 78 0.4 86.5 0.9zm297.5 350.3c0.7 4.3 0.7 77.3 0 80.9l-0.6 2.7-227.5-0.2-227.4-0.3-0.2-42.4c-0.2-23.3 0-42.7 0.2-43.1 0.3-0.5 97.2-0.8 227.7-0.8h227.2zm-10.2 171.7c0.5 1.5-1.9 13.8-6.8 33.8-5.6 22.5-13.2 45.2-20.9 62-3.8 8.6-13.3 27.2-15.6 30.7-1.1 1.6-4.3 6.7-7.1 11.2-18 28.2-43.7 53.9-73 72.9-10.7 6.8-32.7 18.4-38.6 20.2-1.2 0.3-2.5 0.9-3 1.3-0.7 0.6-9.8 4-20.4 7.8-19.5 6.9-56.6 14.4-86.4 17.5-19.3 1.9-22.4 2-96.7 2h-76.9v-129.7-129.8l220.9-0.4c121.5-0.2 221.6-0.5 222.4-0.7 0.9-0.1 1.8 0.5 2.1 1.2z";

const VALID_WEIGHTS = new Set<string>([
	"thin", "extralight", "light", "regular", "medium",
	"semibold", "bold", "extrabold", "black",
]);

const _fmtCache = new Map<string, Intl.NumberFormat>();

function getInputFormatter(locale: string, decimals: number): Intl.NumberFormat {
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
	let cleaned = raw.replace(
		/[\u0660-\u0669]/g,
		(d) => String(d.charCodeAt(0) - 0x0660),
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
export class DirhamInputElement extends HTMLElement {
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
		const min = this.hasAttribute("min") ? Number(this.getAttribute("min")) : undefined;
		const max = this.hasAttribute("max") ? Number(this.getAttribute("max")) : undefined;
		const showSymbol = !this.hasAttribute("show-symbol") || this.getAttribute("show-symbol") !== "false";
		const useCode = this.hasAttribute("use-code");
		const symbolSize = this.getAttribute("symbol-size") || "1em";
		const weightAttr = this.getAttribute("weight") || "regular";
		const weight: DirhamWeight = VALID_WEIGHTS.has(weightAttr)
			? (weightAttr as DirhamWeight)
			: "regular";
		const disabled = this.hasAttribute("disabled");
		const readonly = this.hasAttribute("readonly");
		const isRTL = locale.startsWith("ar");

		return { locale, decimals, min, max, showSymbol, useCode, symbolSize, weight, disabled, readonly, isRTL };
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
				: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 870" width="${escapeHTML(String(config.symbolSize))}" height="${escapeHTML(String(config.symbolSize))}" fill="currentColor" role="img" aria-hidden="true" style="display:inline-block;vertical-align:middle;flex-shrink:0;${config.isRTL ? "margin-left" : "margin-right"}:0.5em"><path d="${SVG_PATH}"${strokeAttrs}/></svg>`
			: "";

		const placeholder = this.getAttribute("placeholder") || getInputFormatter(config.locale, config.decimals).format(0);

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
				const prev = this.#numericValue !== null ? this.#numericValue.toString() : "";
				input.value = prev;
				return;
			}
			const { decimals } = this.#getConfig();
			const dotIndex = cleaned.indexOf(".");
			if (dotIndex !== -1 && cleaned.slice(dotIndex + 1).length > decimals) {
				const prev = this.#numericValue !== null ? this.#numericValue.toString() : "";
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
