import { memo } from "react";
import { Path, Svg } from "react-native-svg";
import { DIRHAM_STROKE_MAP, type DirhamWeight } from "../core/constants";
import { DIRHAM_SVG_PATH, DIRHAM_SVG_VIEWBOX } from "../core/svg";

export interface DirhamSymbolProps {
	/**
	 * Size in logical pixels.
	 * @default 24
	 */
	size?: number;

	/**
	 * Color of the symbol.
	 * @default "currentColor" (falls back to #000)
	 */
	color?: string;

	/**
	 * Accessible label for screen readers.
	 * @default "UAE Dirham"
	 */
	accessibilityLabel?: string;

	/**
	 * Visual weight of the symbol.
	 * @default "regular"
	 */
	weight?: DirhamWeight;
}

/**
 * React Native SVG-based UAE Dirham symbol.
 *
 * Requires `react-native-svg` as a peer dependency.
 *
 * @example
 * ```tsx
 * import { DirhamSymbol } from "dirham/react-native";
 *
 * <DirhamSymbol size={24} />
 * <DirhamSymbol size={32} color="#00A86B" weight="bold" />
 * ```
 */
function DirhamSymbolBase({
	size = 24,
	color = "#000",
	accessibilityLabel = "UAE Dirham",
	weight = "regular",
}: DirhamSymbolProps) {
	const strokeWidth = DIRHAM_STROKE_MAP[weight];

	return (
		<Svg
			viewBox={DIRHAM_SVG_VIEWBOX}
			width={size}
			height={size}
			fill={color}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="image"
		>
			<Path
				d={DIRHAM_SVG_PATH}
				{...(strokeWidth > 0 && {
					stroke: color,
					strokeWidth,
					strokeLinejoin: "round",
					paintOrder: "stroke",
				})}
			/>
		</Svg>
	);
}

export const DirhamSymbol = memo(DirhamSymbolBase);
