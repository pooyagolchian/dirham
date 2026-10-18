import { BaseElement } from "./base";
import { parseWeight, symbolSVG } from "./shared";

/**
 * `<dirham-symbol>` — framework-agnostic Web Component.
 *
 * @example
 * ```html
 * <script type="module">
 *   import "dirham/web-component";
 * </script>
 *
 * <dirham-symbol size="24" weight="bold"></dirham-symbol>
 * ```
 *
 * Attributes: size, color, weight, aria-label
 */
export class DirhamSymbolElement extends BaseElement {
	static get observedAttributes() {
		return ["size", "color", "weight", "aria-label"];
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
		this.#shadow.innerHTML = symbolSVG({
			size: this.getAttribute("size") || "24",
			color: this.getAttribute("color") || "currentColor",
			weight: parseWeight(this.getAttribute("weight")),
			label: this.getAttribute("aria-label") || "UAE Dirham",
		});
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-symbol")
) {
	customElements.define("dirham-symbol", DirhamSymbolElement);
}
