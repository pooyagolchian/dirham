import type React from "react";
import { forwardRef, memo, useMemo } from "react";
import { formatDirham, type FormatDirhamOptions } from "../core/format";
import type { DirhamWeight } from "../core/constants";
import { DirhamSymbol } from "./DirhamSymbol";

export interface DirhamPriceProps
	extends Omit<React.HTMLProps<HTMLSpanElement>, "children"> {
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
	 * Size of the Dirham symbol when using SVG variant.
	 * @default "1em"
	 */
	symbolSize?: number | string;

	/**
	 * Visual weight of the SVG symbol.
	 * @default "regular"
	 */
	weight?: DirhamWeight;

	/**
	 * Accessible label for the currency symbol.
	 * @default "UAE Dirham"
	 */
	"aria-label"?: string;

	/**
	 * Additional CSS class name(s) to apply to the root `<span>` element.
	 * Useful for custom styling via Tailwind, CSS modules, etc.
	 *
	 * @example
	 * ```tsx
	 * <DirhamPrice amount={100} className="text-green-500 font-bold" />
	 * ```
	 */
	className?: string;
}

const DirhamPriceBase = forwardRef<HTMLSpanElement, DirhamPriceProps>(
	(
		{
			amount,
			locale = "en-AE",
			decimals = 2,
			useCode = false,
			notation = "standard",
			symbolSize = "1em",
			weight = "regular",
			"aria-label": ariaLabel,
			style,
			className,
			...props
		},
		ref,
	) => {
		const symbolFirst = !locale.startsWith("ar");

		const formatted = useMemo(() => {
			if (!Number.isFinite(amount)) return "—";
			return formatDirham(amount, {
				locale,
				decimals,
				useCode: true, // Always use code so we can strip it and render SVG instead
				notation,
			}).replace("AED", "").trim();
		}, [amount, locale, decimals, notation]);

		const symbol = useCode ? (
			<span>AED</span>
		) : (
			<DirhamSymbol
				size={symbolSize}
				weight={weight}
				aria-label={ariaLabel ?? "UAE Dirham"}
			/>
		);

		return (
			<span
				ref={ref}
				className={className}
				dir={locale.startsWith("ar") ? "rtl" : undefined}
				style={{ whiteSpace: "nowrap", ...style }}
				{...props}
			>
				{symbolFirst ? (
					<>
						{symbol}
						{"\u00A0"}
						{formatted}
					</>
				) : (
					<>
						{formatted}
						{"\u00A0"}
						{symbol}
					</>
				)}
			</span>
		);
	},
);

DirhamPriceBase.displayName = "DirhamPrice";

export const DirhamPrice = memo(DirhamPriceBase);
DirhamPrice.displayName = "DirhamPrice";
