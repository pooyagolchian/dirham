import type React from "react";
import { forwardRef, memo, useEffect, useRef, useState } from "react";
import type { DirhamWeight } from "../core/constants";
import { formatDirham } from "../core/format";
import { DirhamSymbol } from "./DirhamSymbol";

export interface AnimatedDirhamPriceProps
	extends Omit<React.HTMLProps<HTMLSpanElement>, "children"> {
	/**
	 * Target numeric amount to animate to.
	 */
	amount: number;

	/**
	 * Animation duration in milliseconds.
	 * @default 600
	 */
	duration?: number;

	/**
	 * Easing function.
	 * @default "easeOut"
	 */
	easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";

	/**
	 * Locale for number formatting.
	 * @default "en-AE"
	 */
	locale?: string;

	/**
	 * Number of decimal places.
	 * @default 2
	 */
	decimals?: number;

	/**
	 * Use ISO code "AED" instead of the symbol.
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
	 * @default "1em"
	 */
	symbolSize?: number | string;

	/**
	 * Weight of the Dirham symbol.
	 * @default "regular"
	 */
	weight?: DirhamWeight;

	/**
	 * Accessible label.
	 * @default "UAE Dirham"
	 */
	"aria-label"?: string;

	/**
	 * CSS class name(s).
	 */
	className?: string;
}

const EASING_FNS: Record<string, (t: number) => number> = {
	linear: (t: number) => t,
	easeIn: (t: number) => t * t,
	easeOut: (t: number) => t * (2 - t),
	easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

/**
 * Animated Dirham price display with count-up/count-down transitions.
 *
 * Uses `requestAnimationFrame` for smooth 60fps animations.
 * No external dependencies.
 *
 * @example
 * ```tsx
 * import { AnimatedDirhamPrice } from "dirham/react";
 *
 * <AnimatedDirhamPrice amount={1250} />
 * <AnimatedDirhamPrice amount={total} duration={1000} easing="easeInOut" />
 * ```
 */
const AnimatedDirhamPriceBase = forwardRef<
	HTMLSpanElement,
	AnimatedDirhamPriceProps
>(
	(
		{
			amount,
			duration = 600,
			easing = "easeOut",
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
		const [displayAmount, setDisplayAmount] = useState(amount);
		const prevAmountRef = useRef(amount);
		const frameRef = useRef<number>(0);

		useEffect(() => {
			const from = prevAmountRef.current;
			const to = amount;
			prevAmountRef.current = to;

			if (from === to) return;

			const easeFn = EASING_FNS[easing] ?? EASING_FNS.easeOut;
			const start = performance.now();

			const animate = (now: number) => {
				const elapsed = now - start;
				const progress = Math.min(elapsed / duration, 1);
				const eased = easeFn(progress);
				const current = from + (to - from) * eased;

				setDisplayAmount(current);

				if (progress < 1) {
					frameRef.current = requestAnimationFrame(animate);
				} else {
					setDisplayAmount(to); // ensure we land exactly on target
				}
			};

			frameRef.current = requestAnimationFrame(animate);

			return () => {
				if (frameRef.current) cancelAnimationFrame(frameRef.current);
			};
		}, [amount, duration, easing]);

		const symbolFirst = !locale.startsWith("ar");
		const isRTL = locale.startsWith("ar");

		const formatted = Number.isFinite(displayAmount)
			? formatDirham(displayAmount, {
					locale,
					decimals,
					useCode: true,
					notation,
				})
					.replace("AED", "")
					.trim()
			: "—";

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
				dir={isRTL ? "rtl" : undefined}
				style={{ whiteSpace: "nowrap", ...style }}
				aria-live="polite"
				aria-atomic="true"
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

AnimatedDirhamPriceBase.displayName = "AnimatedDirhamPrice";

export const AnimatedDirhamPrice = memo(AnimatedDirhamPriceBase);
AnimatedDirhamPrice.displayName = "AnimatedDirhamPrice";
