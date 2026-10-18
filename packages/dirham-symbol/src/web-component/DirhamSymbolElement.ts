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
		const size = this.getAttribute("size") || "24";
		const color = this.getAttribute("color") || "currentColor";
		const weightAttr = this.getAttribute("weight") || "regular";
		const weight: DirhamWeight = VALID_WEIGHTS.has(weightAttr)
			? (weightAttr as DirhamWeight)
			: "regular";
		const ariaLabel = this.getAttribute("aria-label") || "UAE Dirham";
		const strokeWidth = DIRHAM_STROKE_MAP[weight];

		const strokeAttrs =
			strokeWidth > 0
				? `stroke="${color}" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke"`
				: "";

		this.#shadow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DIRHAM_SVG_VIEWBOX}" width="${size}" height="${size}" fill="${color}" role="img" aria-label="${ariaLabel}" style="display:inline-block;vertical-align:middle"><path d="${DIRHAM_SVG_PATH}" ${strokeAttrs}/></svg>`;
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("dirham-symbol")
) {
	customElements.define("dirham-symbol", DirhamSymbolElement);
}
