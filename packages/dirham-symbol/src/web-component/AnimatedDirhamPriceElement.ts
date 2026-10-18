import { formatAmountText, formatDirham } from "../core/format";
import { isArabicLocale } from "../core/locale";
import { BaseElement } from "./base";
import { escapeHTML, parseWeight, symbolSVG } from "./shared";

const EASING_FNS: Record<string, (t: number) => number> = {
	linear: (t: number) => t,
	easeIn: (t: number) => t * t,
	easeOut: (t: number) => t * (2 - t),
	easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

/** Keeps text available to screen readers while taking no space on screen. */
const VISUALLY_HIDDEN =
	"position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0";

function prefersReducedMotion(): boolean {
	return (
		typeof matchMedia === "function" &&
		matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

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
 *
 * Changing `amount` while it is still counting continues from the value on
 * screen. The counting digits are hidden from assistive technology and the final
 * amount is announced once. With `prefers-reduced-motion: reduce`, a `duration`
 * of 0 or less, or while the element is not in the document, the amount changes
 * without animating.
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
	/** The amount on screen right now. */
	#currentAmount = 0;
	#targetAmount = 0;
	#frameId = 0;
	#amountEl: HTMLElement | null = null;
	#liveEl: HTMLElement | null = null;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		const amountStr = this.getAttribute("amount");
		this.#currentAmount = amountStr !== null ? Number(amountStr) : 0;
		this.#targetAmount = this.#currentAmount;
		this.#render();
	}

	disconnectedCallback() {
		// Nobody can see the count now: stop the frame loop and settle on the
		// target, so an element that is put back shows the right amount.
		this.#stop();
		this.#showAmount(this.#targetAmount);
	}

	attributeChangedCallback(name: string) {
		if (name !== "amount") {
			this.#render();
			return;
		}
		const target = Number(this.getAttribute("amount") ?? "0");
		if (Number.isFinite(target) && target !== this.#targetAmount) {
			this.#animateTo(target);
		}
	}

	#stop() {
		if (this.#frameId) cancelAnimationFrame(this.#frameId);
		this.#frameId = 0;
	}

	#animateTo(target: number) {
		this.#stop();
		const from = this.#currentAmount;
		this.#targetAmount = target;
		if (this.#liveEl) this.#liveEl.textContent = this.#announcement();

		const duration = Number(this.getAttribute("duration") ?? "600");
		// `!(duration > 0)` also catches NaN; a negative duration would otherwise
		// never reach progress 1 and loop forever. Frameworks create the element and
		// set its attributes before inserting it, so an element that is not in the
		// document yet takes its initial amount at once, as parsed HTML does.
		if (
			!this.isConnected ||
			prefersReducedMotion() ||
			!(duration > 0) ||
			!Number.isFinite(from)
		) {
			this.#showAmount(target);
			return;
		}

		const easeFn =
			EASING_FNS[this.getAttribute("easing") || "easeOut"] ??
			EASING_FNS.easeOut;
		const start = performance.now();

		const animate = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			this.#showAmount(
				progress < 1 ? from + (target - from) * easeFn(progress) : target,
			);
			this.#frameId = progress < 1 ? requestAnimationFrame(animate) : 0;
		};
		this.#frameId = requestAnimationFrame(animate);
	}

	#showAmount(amount: number) {
		this.#currentAmount = amount;
		if (this.#amountEl) this.#amountEl.textContent = this.#format(amount);
	}

	#numberOptions() {
		return {
			locale: this.getAttribute("locale") || "en-AE",
			decimals: Number(this.getAttribute("decimals") ?? "2"),
			notation: (this.getAttribute("notation") === "compact"
				? "compact"
				: "standard") as "compact" | "standard",
		};
	}

	/** The number part only; the symbol is drawn separately. */
	#format(amount: number): string {
		return formatAmountText(amount, this.#numberOptions());
	}

	/** What a screen reader hears: the final amount, with the currency code. */
	#announcement(): string {
		return Number.isFinite(this.#targetAmount)
			? formatDirham(this.#targetAmount, {
					...this.#numberOptions(),
					useCode: true,
				})
			: "—";
	}

	/**
	 * Build the shadow DOM. Runs when an attribute other than `amount` changes,
	 * never per animation frame: frames only rewrite the digits' text node.
	 */
	#render() {
		const { locale } = this.#numberOptions();
		const useCode = this.hasAttribute("use-code");
		const isRTL = isArabicLocale(locale);
		const dirAttr = isRTL ? ' dir="rtl"' : "";

		const symbol = useCode
			? "AED"
			: symbolSVG({
					size: this.getAttribute("symbol-size") || "1em",
					weight: parseWeight(this.getAttribute("weight")),
					label: "UAE Dirham",
				});
		const amount = `<span data-amount>${escapeHTML(this.#format(this.#currentAmount))}</span>`;
		const visible = isRTL ? `${amount} ${symbol}` : `${symbol} ${amount}`;

		this.#shadow.innerHTML = `<span style="white-space:nowrap"${dirAttr}><span aria-hidden="true">${visible}</span><span style="${VISUALLY_HIDDEN}" aria-live="polite" aria-atomic="true">${escapeHTML(this.#announcement())}</span></span>`;

		this.#amountEl = this.#shadow.querySelector("[data-amount]");
		this.#liveEl = this.#shadow.querySelector("[aria-live]");
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-animated-price")
) {
	customElements.define("dirham-animated-price", AnimatedDirhamPriceElement);
}
