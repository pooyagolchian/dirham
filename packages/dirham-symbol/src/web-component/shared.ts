import { DIRHAM_STROKE_MAP, type DirhamWeight } from "../core/constants";
import { DIRHAM_SVG_PATH, DIRHAM_SVG_VIEWBOX } from "../core/svg";

const WEIGHTS = new Set<string>(Object.keys(DIRHAM_STROKE_MAP));

/**
 * Escape text for an HTML text node or a double-quoted attribute value.
 * The elements build their shadow DOM as an HTML string, so everything that
 * originates in an attribute must pass through here.
 */
export function escapeHTML(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** The `weight` attribute, or "regular" when it is missing or not a known weight. */
export function parseWeight(attr: string | null): DirhamWeight {
	return attr !== null && WEIGHTS.has(attr)
		? (attr as DirhamWeight)
		: "regular";
}

export interface SymbolSVGOptions {
	/** Width and height, any CSS length or number (e.g. "1em", "24"). */
	size: string;
	weight: DirhamWeight;
	/** Fill and stroke colour. @default "currentColor" */
	color?: string;
	/** Accessible name. Omit to hide the sign from assistive technology. */
	label?: string;
	/** Inline style. A trusted literal from the element, never an attribute value. */
	style?: string;
}

/** The sign as inline SVG markup. Every value taken from an attribute is escaped. */
export function symbolSVG({
	size,
	weight,
	color = "currentColor",
	label,
	style = "display:inline-block;vertical-align:middle",
}: SymbolSVGOptions): string {
	const strokeWidth = DIRHAM_STROKE_MAP[weight];
	const safeColor = escapeHTML(color);
	const stroke =
		strokeWidth > 0
			? ` stroke="${safeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke"`
			: "";
	const accessibility =
		label === undefined
			? 'aria-hidden="true"'
			: `role="img" aria-label="${escapeHTML(label)}"`;
	const safeSize = escapeHTML(size);
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DIRHAM_SVG_VIEWBOX}" width="${safeSize}" height="${safeSize}" fill="${safeColor}" ${accessibility} style="${style}"><path d="${DIRHAM_SVG_PATH}"${stroke}/></svg>`;
}
