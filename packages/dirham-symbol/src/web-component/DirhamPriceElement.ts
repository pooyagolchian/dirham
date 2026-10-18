import { DIRHAM_STROKE_MAP, type DirhamWeight } from "../core/constants";
import { formatDirham } from "../core/format";
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
		const weightAttr = this.getAttribute("weight") || "regular";
		const weight: DirhamWeight = VALID_WEIGHTS.has(weightAttr)
			? (weightAttr as DirhamWeight)
			: "regular";
		const currency = this.getAttribute("currency") || undefined;

		const symbolFirst = !locale.startsWith("ar");

		// Format the numeric part (strip AED code — we render the SVG instead)
		let formatted: string;
		if (!Number.isFinite(amount)) {
			formatted = "—";
		} else {
			formatted = formatDirham(amount, {
				locale,
				decimals,
				useCode: true,
				notation,
			})
				.replace("AED", "")
				.trim();
		}

		if (useCode) {
			const code = currency || "AED";
			const text = symbolFirst
				? `${code}\u00A0${formatted}`
				: `${formatted}\u00A0${code}`;
			const dirAttr = locale.startsWith("ar") ? ' dir="rtl"' : "";
			this.#shadow.innerHTML = `<span style="white-space:nowrap"${dirAttr}>${this.#escape(text)}</span>`;
			return;
		}

		const strokeWidth = DIRHAM_STROKE_MAP[weight];
		const strokeAttrs =
			strokeWidth > 0
				? ` stroke="currentColor" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke"`
				: "";

		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DIRHAM_SVG_VIEWBOX}" width="${this.#escape(String(symbolSize))}" height="${this.#escape(String(symbolSize))}" fill="currentColor" role="img" aria-label="UAE Dirham" style="display:inline-block;vertical-align:middle"><path d="${DIRHAM_SVG_PATH}"${strokeAttrs}/></svg>`;

		const dirAttr = locale.startsWith("ar") ? ' dir="rtl"' : "";

		const parts = symbolFirst
			? `${svg}\u00A0${this.#escape(formatted)}`
			: `${this.#escape(formatted)}\u00A0${svg}`;

		this.#shadow.innerHTML = `<span style="white-space:nowrap"${dirAttr}>${parts}</span>`;
	}

	#escape(str: string): string {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-price")
) {
	customElements.define("dirham-price", DirhamPriceElement);
}
