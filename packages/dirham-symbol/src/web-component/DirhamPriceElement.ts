import { formatAmountText } from "../core/format";
import { isArabicLocale } from "../core/locale";
import { BaseElement } from "./base";
import { escapeHTML, parseWeight, symbolSVG } from "./shared";

/**
 * `<dirham-price>` — framework-agnostic Web Component for displaying formatted prices.
 *
 * Works in Vue, Angular, Svelte, or any HTML page.
 *
 * @example
 * ```html
 * <script type="module">
 *   import "dirham/web-component";
 * </script>
 *
 * <dirham-price amount="1250"></dirham-price>
 * <dirham-price amount="5000000" notation="compact"></dirham-price>
 * <dirham-price amount="100" locale="ar-AE"></dirham-price>
 * <dirham-price amount="500" use-code></dirham-price>
 * ```
 *
 * Attributes: amount, locale, decimals, notation, use-code, symbol-size, weight, currency
 */
export class DirhamPriceElement extends BaseElement {
	static get observedAttributes() {
		return [
			"amount",
			"locale",
			"decimals",
			"notation",
			"use-code",
			"symbol-size",
			"weight",
			"currency",
		];
	}

	#shadow: ShadowRoot;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#render();
	}

	attributeChangedCallback() {
		this.#render();
	}

	#render() {
		const amountStr = this.getAttribute("amount");
		const amount = amountStr !== null ? Number(amountStr) : 0;
		const locale = this.getAttribute("locale") || "en-AE";
		const decimals = Number(this.getAttribute("decimals") ?? "2");
		const notation =
			this.getAttribute("notation") === "compact" ? "compact" : "standard";
		const useCode = this.hasAttribute("use-code");
		const symbolSize = this.getAttribute("symbol-size") || "1em";
		const weight = parseWeight(this.getAttribute("weight"));
		const currency = this.getAttribute("currency") || undefined;

		const isRTL = isArabicLocale(locale);
		const symbolFirst = !isRTL;
		const dirAttr = isRTL ? ' dir="rtl"' : "";

		// Only the number: the sign is drawn separately
		const formatted = formatAmountText(amount, { locale, decimals, notation });

		if (useCode) {
			const code = currency || "AED";
			const text = symbolFirst
				? `${code}\u00A0${formatted}`
				: `${formatted}\u00A0${code}`;
			this.#shadow.innerHTML = `<span style="white-space:nowrap"${dirAttr}>${escapeHTML(text)}</span>`;
			return;
		}

		const svg = symbolSVG({ size: symbolSize, weight, label: "UAE Dirham" });

		const parts = symbolFirst
			? `${svg}\u00A0${escapeHTML(formatted)}`
			: `${escapeHTML(formatted)}\u00A0${svg}`;

		this.#shadow.innerHTML = `<span style="white-space:nowrap"${dirAttr}>${parts}</span>`;
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-price")
) {
	customElements.define("dirham-price", DirhamPriceElement);
}
