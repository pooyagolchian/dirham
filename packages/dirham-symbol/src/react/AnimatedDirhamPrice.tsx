import type React from "react";
import { forwardRef, memo, useEffect, useRef, useState } from "react";
import type { DirhamWeight } from "../core/constants";
import { formatDirham } from "../core/format";
import { isArabicLocale } from "../core/locale";
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

/** Keeps text available to screen readers while taking no space on screen. */
const VISUALLY_HIDDEN: React.CSSProperties = {
	position: "absolute",
	width: 1,
	height: 1,
	margin: -1,
	padding: 0,
	overflow: "hidden",
	clip: "rect(0 0 0 0)",
	whiteSpace: "nowrap",
	border: 0,
};

function prefersReducedMotion(): boolean {
	return (
		typeof window !== "undefined" &&
		typeof window.matchMedia === "function" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

/**
 * Animated Dirham price display with count-up/count-down transitions.
 *
 * Uses `requestAnimationFrame` for smooth 60fps animations.
 * No external dependencies.
 *
 * A new `amount` while one is still counting continues from the value on screen.
 * The counting digits are hidden from assistive technology and the final amount is
 * announced once, so a screen reader does not read every intermediate frame. With
 * `prefers-reduced-motion: reduce`, or a `duration` of 0 or less, the amount
 * changes without animating.
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
		// What is on screen right now. A retarget or a change of duration or easing
		// restarts from here; the previous *target* may not have been reached yet.
		const displayRef = useRef(amount);
		const frameRef = useRef(0);

		useEffect(() => {
			const from = displayRef.current;
			const to = amount;
			if (from === to) return;

			const show = (value: number) => {
				displayRef.current = value;
				setDisplayAmount(value);
			};

			// `!(duration > 0)` also catches NaN; a negative duration would otherwise
			// never reach progress 1 and loop forever.
			if (
				prefersReducedMotion() ||
				!(duration > 0) ||
				!Number.isFinite(from) ||
				!Number.isFinite(to)
			) {
				show(to);
				return;
			}

			const easeFn = EASING_FNS[easing] ?? EASING_FNS.easeOut;
			const start = performance.now();

			const animate = (now: number) => {
				const progress = Math.min((now - start) / duration, 1);
				show(progress < 1 ? from + (to - from) * easeFn(progress) : to);
				if (progress < 1) frameRef.current = requestAnimationFrame(animate);
			};

			frameRef.current = requestAnimationFrame(animate);

			return () => cancelAnimationFrame(frameRef.current);
		}, [amount, duration, easing]);

		const isRTL = isArabicLocale(locale);
		const symbolFirst = !isRTL;

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

		const announcement = Number.isFinite(amount)
			? formatDirham(amount, { locale, decimals, useCode: true, notation })
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
				{...props}
			>
				<span aria-hidden="true">
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
				<span style={VISUALLY_HIDDEN} aria-live="polite" aria-atomic="true">
					{announcement}
				</span>
			</span>
		);
	},
);

AnimatedDirhamPriceBase.displayName = "AnimatedDirhamPrice";

export const AnimatedDirhamPrice = memo(AnimatedDirhamPriceBase);
AnimatedDirhamPrice.displayName = "AnimatedDirhamPrice";
