import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import type { DirhamWeight } from "../core/constants";
import { formatAmountText, formatDirham } from "../core/format";
import { isArabicLocale } from "../core/locale";
import { DirhamSymbol } from "./DirhamSymbol";

export interface DirhamPriceProps {
	/**
	 * Numeric amount to display.
	 */
	amount: number;

	/**
	 * Locale string for number formatting.
	 * @default "en-AE"
	 */
	locale?: string;

	/**
	 * Number of decimal places.
	 * @default 2
	 */
	decimals?: number;

	/**
	 * Use ISO currency code (AED) instead of the symbol.
	 * @default false
	 */
	useCode?: boolean;

	/**
	 * Number notation style.
	 * @default "standard"
	 */
	notation?: "standard" | "compact";

	/**
	 * Size of the Dirham symbol.
	 * @default 16
	 */
	symbolSize?: number;

	/**
	 * Visual weight of the SVG symbol.
	 * @default "regular"
	 */
	weight?: DirhamWeight;

	/**
	 * Text color.
	 * @default "#000"
	 */
	color?: string;

	/**
	 * Font size for the amount text.
	 * @default 16
	 */
	fontSize?: number;

	/**
	 * Accessible label for screen readers.
	 */
	accessibilityLabel?: string;
}

/**
 * React Native component for displaying formatted Dirham prices.
 *
 * @example
 * ```tsx
 * import { DirhamPrice } from "dirham/react-native";
 *
 * <DirhamPrice amount={1250} />
 * <DirhamPrice amount={500} locale="ar-AE" />
 * ```
 */
function DirhamPriceBase({
	amount,
	locale = "en-AE",
	decimals = 2,
	useCode = false,
	notation = "standard",
	symbolSize = 16,
	weight = "regular",
	color = "#000",
	fontSize = 16,
	accessibilityLabel,
}: DirhamPriceProps) {
	const isRTL = isArabicLocale(locale);
	const symbolFirst = !isRTL;

	const formatted = useMemo(
		() => formatAmountText(amount, { locale, decimals, notation }),
		[amount, locale, decimals, notation],
	);

	// formatDirham throws for a value that is not finite; the visible text already
	// falls back to a dash, so the label must too or the whole screen crashes.
	const label =
		accessibilityLabel ??
		(Number.isFinite(amount)
			? formatDirham(amount, { locale, decimals, useCode: true, notation })
			: formatted);

	const symbol = useCode ? (
		<Text style={{ color, fontSize }}>AED</Text>
	) : (
		<DirhamSymbol size={symbolSize} color={color} weight={weight} />
	);

	return (
		<View
			style={{
				flexDirection: isRTL ? "row-reverse" : "row",
				alignItems: "center",
			}}
			accessibilityLabel={label}
			accessibilityRole="text"
		>
			{symbolFirst ? (
				<>
					{symbol}
					<Text style={{ color, fontSize }}>
						{"\u00A0"}
						{formatted}
					</Text>
				</>
			) : (
				<>
					<Text style={{ color, fontSize }}>
						{formatted}
						{"\u00A0"}
					</Text>
					{symbol}
				</>
			)}
		</View>
	);
}

export const DirhamPrice = memo(DirhamPriceBase);
