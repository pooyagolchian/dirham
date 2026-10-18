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

const EASING_FNS: Record<string, (t: number) => number> = {
	linear: (t: number) => t,
	easeIn: (t: number) => t * t,
	easeOut: (t: number) => t * (2 - t),
	easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

/**
 * `<dirham-animated-price>` — animated price display with count-up/down.
 *
 * @example
 * ```html
 * <dirham-animated-price amount="1250" duration="600"></dirham-animated-price>
 * <dirham-animated-price amount="5000" easing="easeInOut"></dirham-animated-price>
 * ```
 *
 * Attributes: amount, duration, easing, locale, decimals, notation, use-code,
 *             symbol-size, weight
 */
export class AnimatedDirhamPriceElement extends BaseElement {
	static get observedAttributes() {
		return [
			"amount",
			"duration",
			"easing",
			"locale",
			"decimals",
			"notation",
			"use-code",
			"symbol-size",
			"weight",
		];
	}

	#shadow: ShadowRoot;
	#currentAmount = 0;
	#targetAmount = 0;
	#frameId = 0;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		const amountStr = this.getAttribute("amount");
		this.#currentAmount = amountStr !== null ? Number(amountStr) : 0;
		this.#targetAmount = this.#currentAmount;
		this.#renderFrame(this.#currentAmount);
	}

	attributeChangedCallback(name: string) {
		if (name === "amount") {
			const newTarget = Number(this.getAttribute("amount") ?? "0");
			if (Number.isFinite(newTarget) && newTarget !== this.#targetAmount) {
				this.#animateTo(newTarget);
			}
		} else {
			this.#renderFrame(this.#currentAmount);
		}
	}

	#animateTo(target: number) {
		if (this.#frameId) cancelAnimationFrame(this.#frameId);

		const from = this.#currentAmount;
		this.#targetAmount = target;
		const duration = Number(this.getAttribute("duration") ?? "600");
		const easingName = this.getAttribute("easing") || "easeOut";
		const easeFn = EASING_FNS[easingName] ?? EASING_FNS.easeOut;
		const start = performance.now();

		const animate = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeFn(progress);
			this.#currentAmount = from + (target - from) * eased;

			this.#renderFrame(this.#currentAmount);

			if (progress < 1) {
				this.#frameId = requestAnimationFrame(animate);
			} else {
				this.#currentAmount = target;
				this.#renderFrame(target);
				this.#frameId = 0;
			}
		};

		this.#frameId = requestAnimationFrame(animate);
	}

	#escape(str: string): string {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	#renderFrame(amount: number) {
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

		const symbolFirst = !locale.startsWith("ar");
		const isRTL = locale.startsWith("ar");
		const dirAttr = isRTL ? ' dir="rtl"' : "";

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
			const text = symbolFirst
				? `AED\u00A0${formatted}`
				: `${formatted}\u00A0AED`;
			this.#shadow.innerHTML = `<span style="white-space:nowrap"${dirAttr} aria-live="polite" aria-atomic="true">${this.#escape(text)}</span>`;
			return;
		}

		const strokeWidth = DIRHAM_STROKE_MAP[weight];
		const strokeAttrs =
			strokeWidth > 0
				? ` stroke="currentColor" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke"`
				: "";

		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DIRHAM_SVG_VIEWBOX}" width="${this.#escape(String(symbolSize))}" height="${this.#escape(String(symbolSize))}" fill="currentColor" role="img" aria-label="UAE Dirham" style="display:inline-block;vertical-align:middle"><path d="${DIRHAM_SVG_PATH}"${strokeAttrs}/></svg>`;

		const parts = symbolFirst
			? `${svg}\u00A0${this.#escape(formatted)}`
			: `${this.#escape(formatted)}\u00A0${svg}`;

		this.#shadow.innerHTML = `<span style="white-space:nowrap"${dirAttr} aria-live="polite" aria-atomic="true">${parts}</span>`;
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-animated-price")
) {
	customElements.define("dirham-animated-price", AnimatedDirhamPriceElement);
}
