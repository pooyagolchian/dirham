import type React from "react";
import { forwardRef, memo } from "react";
import { DIRHAM_STROKE_MAP, type DirhamWeight } from "../core/constants";
import { DIRHAM_SVG_PATH, DIRHAM_SVG_VIEWBOX } from "../core/svg";

export interface DirhamSymbolProps
	extends Omit<React.SVGProps<SVGSVGElement>, "children"> {
	/**
	 * Size of the symbol in pixels. Sets both width and height.
	 * @default 24
	 */
	size?: number | string;

	/**
	 * Color of the symbol. Uses `currentColor` by default to inherit text color.
	 * @default "currentColor"
	 */
	color?: string;

	/**
	 * Accessible label for screen readers.
	 * @default "UAE Dirham"
	 */
	"aria-label"?: string;

	/**
	 * Visual weight of the symbol. Simulates font-weight via SVG stroke
	 * so the symbol matches surrounding text weight.
	 *
	 * @example
	 * ```tsx
	 * <h1 style={{ fontWeight: 700 }}>
	 *   Price: 100 <DirhamSymbol size="1em" weight="bold" />
	 * </h1>
	 * ```
	 *
	 * @default "regular"
	 */
	weight?: DirhamWeight;
}

/**
 * SVG-based UAE Dirham symbol React component.
 *
 * Renders the Dirham symbol as an inline SVG. No font loading required.
 * Works with SSR, is tree-shakeable, and avoids FOIT.
 *
 * @example
 * ```tsx
 * import { DirhamSymbol } from "dirham/react";
 *
 * <DirhamSymbol size={16} />
 * <DirhamSymbol size={24} color="green" />
 * <span>100 <DirhamSymbol size="1em" /></span>
 * ```
 */
const DirhamSymbolBase = forwardRef<SVGSVGElement, DirhamSymbolProps>(
	(
		{
			size = 24,
			color = "currentColor",
			"aria-label": ariaLabel = "UAE Dirham",
			weight = "regular",
			style,
			...props
		},
		ref,
	) => {
		const strokeWidth = DIRHAM_STROKE_MAP[weight];

		return (
			<svg
				ref={ref}
				xmlns="http://www.w3.org/2000/svg"
				viewBox={DIRHAM_SVG_VIEWBOX}
				width={size}
				height={size}
				fill={color}
				role="img"
				aria-label={ariaLabel}
				style={{
					display: "inline-block",
					verticalAlign: "-0.125em",
					...style,
				}}
				{...props}
			>
				<path
					d={DIRHAM_SVG_PATH}
					{...(strokeWidth > 0 && {
						stroke: color,
						strokeWidth,
						strokeLinejoin: "round" as const,
						paintOrder: "stroke",
					})}
				/>
			</svg>
		);
	},
);

DirhamSymbolBase.displayName = "DirhamSymbol";

// Memoize so the component only re-renders when its own props change.
// This is important when DirhamSymbol is used inside list items or tables
// that re-render frequently due to unrelated parent state changes.
export const DirhamSymbol = memo(DirhamSymbolBase);
DirhamSymbol.displayName = "DirhamSymbol";
