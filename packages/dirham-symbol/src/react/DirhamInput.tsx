import type React from "react";
import { forwardRef, memo, useCallback, useRef, useState } from "react";
import type { DirhamWeight } from "../core/constants";
import {
	cleanPaste,
	formatEntry,
	isValidEntry,
	parseEntry,
	plainEntry,
	stripFormatting,
} from "../core/input";
import { isArabicLocale } from "../core/locale";
import { DirhamSymbol } from "./DirhamSymbol";

// ─── Component Props ────────────────────────────────────────────────────────

export interface DirhamInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "defaultValue" | "onChange" | "type"
	> {
	/**
	 * Controlled numeric value.
	 */
	value?: number;

	/**
	 * Default numeric value (uncontrolled mode).
	 */
	defaultValue?: number;

	/**
	 * Called when the numeric value changes.
	 * Receives the parsed number, or `undefined` when the input is cleared.
	 */
	onChange?: (value: number | undefined) => void;

	/**
	 * Locale for number formatting.
	 * @default "en-AE"
	 */
	locale?: string;

	/**
	 * Maximum decimal places allowed.
	 * @default 2
	 */
	decimals?: number;

	/**
	 * Minimum allowed value.
	 */
	min?: number;

	/**
	 * Maximum allowed value.
	 */
	max?: number;

	/**
	 * Whether to show the Dirham symbol inside the input.
	 * @default true
	 */
	showSymbol?: boolean;

	/**
	 * Use ISO code "AED" instead of the symbol.
	 * @default false
	 */
	useCode?: boolean;

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
	 * Accessible label for the input.
	 * @default "Amount in AED"
	 */
	"aria-label"?: string;

	/**
	 * Additional CSS class name(s) for the wrapper element.
	 */
	className?: string;

	/**
	 * Additional inline styles for the wrapper element.
	 */
	style?: React.CSSProperties;

	/**
	 * Additional CSS class name(s) for the `<input>` element.
	 */
	inputClassName?: string;

	/**
	 * Additional inline styles for the `<input>` element.
	 */
	inputStyle?: React.CSSProperties;

	/**
	 * Called on blur after value is clamped/formatted.
	 */
	onBlur?: React.FocusEventHandler<HTMLInputElement>;

	/**
	 * Called on focus.
	 */
	onFocus?: React.FocusEventHandler<HTMLInputElement>;

	/**
	 * Select all text on focus.
	 * @default true
	 */
	selectOnFocus?: boolean;
}

/**
 * Masked currency input with auto-formatting for AED.
 *
 * Features:
 * - Auto-formats with thousands separators on blur
 * - Decimal precision enforcement
 * - Min/max clamping
 * - Paste handling (including Arabic numerals)
 * - Mobile-friendly with `inputMode="decimal"`
 * - RTL support for Arabic locales
 * - Controlled and uncontrolled modes
 *
 * @example
 * ```tsx
 * import { DirhamInput } from "dirham/react";
 *
 * function PaymentForm() {
 *   const [amount, setAmount] = useState<number | undefined>(0);
 *   return (
 *     <DirhamInput
 *       value={amount}
 *       onChange={setAmount}
 *       min={0}
 *       max={999999}
 *       placeholder="Enter amount"
 *     />
 *   );
 * }
 * ```
 */
const DirhamInputBase = forwardRef<HTMLInputElement, DirhamInputProps>(
	(
		{
			value: controlledValue,
			defaultValue,
			onChange,
			locale = "en-AE",
			decimals = 2,
			min,
			max,
			showSymbol = true,
			useCode = false,
			symbolSize = "1em",
			weight = "regular",
			"aria-label": ariaLabel = "Amount in AED",
			className,
			style,
			inputClassName,
			inputStyle,
			onBlur,
			onFocus,
			selectOnFocus = true,
			placeholder,
			disabled,
			readOnly,
			...inputProps
		},
		ref,
	) => {
		// `value` going from a number to `undefined` means the parent cleared it, not
		// that the input became uncontrolled. Once controlled, stay controlled, or the
		// stale internal state from before would reappear. An input that is never
		// given a value (or always `undefined`) stays uncontrolled.
		const wasControlled = useRef(false);
		if (controlledValue !== undefined) wasControlled.current = true;
		const isControlled = wasControlled.current;
		const [internalValue, setInternalValue] = useState<number | undefined>(
			defaultValue,
		);
		const numericValue = isControlled ? controlledValue : internalValue;

		// Raw text the user is typing (only used while focused)
		const [rawText, setRawText] = useState<string>("");
		const [isFocused, setIsFocused] = useState(false);
		const inputRef = useRef<HTMLInputElement>(null);

		// Merge refs
		const mergedRef = useCallback(
			(node: HTMLInputElement | null) => {
				(inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
					node;
				if (typeof ref === "function") ref(node);
				else if (ref)
					(ref as React.MutableRefObject<HTMLInputElement | null>).current =
						node;
			},
			[ref],
		);

		const isRTL = isArabicLocale(locale);

		// Clamp value within min/max
		const clamp = useCallback(
			(v: number): number => {
				let result = v;
				if (min !== undefined && result < min) result = min;
				if (max !== undefined && result > max) result = max;
				return result;
			},
			[min, max],
		);

		// The display text when not focused
		const displayText = isFocused
			? rawText
			: formatEntry(numericValue, locale, decimals);

		// When entering focus, show the raw numeric value
		const handleFocus = useCallback(
			(e: React.FocusEvent<HTMLInputElement>) => {
				setIsFocused(true);
				setRawText(plainEntry(numericValue));

				if (selectOnFocus) {
					// setTimeout so the value is set before selection
					setTimeout(() => inputRef.current?.select(), 0);
				}
				onFocus?.(e);
			},
			[numericValue, selectOnFocus, onFocus],
		);

		// Publish a new value from every path that changes it
		const commit = useCallback(
			(next: number | undefined) => {
				if (!isControlled) setInternalValue(next);
				onChange?.(next);
			},
			[isControlled, onChange],
		);

		// On blur, parse+clamp+format
		const handleBlur = useCallback(
			(e: React.FocusEvent<HTMLInputElement>) => {
				setIsFocused(false);
				const parsed = parseEntry(stripFormatting(rawText), decimals);
				commit(parsed === undefined ? undefined : clamp(parsed));
				onBlur?.(e);
			},
			[rawText, decimals, clamp, commit, onBlur],
		);

		// Handle typing: only digits, one dot, optional leading minus, at most
		// `decimals` places. Anything else is rejected and the field keeps its text.
		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const cleaned = stripFormatting(e.target.value);
				if (!isValidEntry(cleaned, decimals)) return;

				setRawText(cleaned);
				// Intermediate values are emitted unclamped; blur clamps.
				commit(parseEntry(cleaned, decimals));
			},
			[decimals, commit],
		);

		// Handle paste — support formatted and Arabic numeral values
		const handlePaste = useCallback(
			(e: React.ClipboardEvent<HTMLInputElement>) => {
				e.preventDefault();
				if (readOnly || disabled) return;
				const cleaned = cleanPaste(
					e.clipboardData.getData("text/plain"),
					decimals,
				);
				if (cleaned === undefined) return;

				setRawText(cleaned);
				const parsed = parseEntry(cleaned, decimals);
				commit(parsed === undefined ? undefined : clamp(parsed));
			},
			[readOnly, disabled, decimals, clamp, commit],
		);

		const symbolElement = showSymbol ? (
			useCode ? (
				<span
					style={{
						userSelect: "none",
						flexShrink: 0,
						...(isRTL ? { marginLeft: "0.5em" } : { marginRight: "0.5em" }),
					}}
					aria-hidden="true"
				>
					AED
				</span>
			) : (
				<DirhamSymbol
					size={symbolSize}
					weight={weight}
					aria-hidden="true"
					style={{
						flexShrink: 0,
						...(isRTL ? { marginLeft: "0.5em" } : { marginRight: "0.5em" }),
					}}
				/>
			)
		) : null;

		return (
			<span
				className={className}
				style={{
					display: "inline-flex",
					alignItems: "center",
					direction: isRTL ? "rtl" : "ltr",
					...style,
				}}
			>
				{!isRTL && symbolElement}
				<input
					{...inputProps}
					ref={mergedRef}
					type="text"
					inputMode="decimal"
					dir={isRTL ? "rtl" : "ltr"}
					aria-label={ariaLabel}
					className={inputClassName}
					style={{
						minWidth: 0,
						flex: 1,
						...inputStyle,
					}}
					value={displayText}
					placeholder={placeholder ?? formatEntry(0, locale, decimals)}
					disabled={disabled}
					readOnly={readOnly}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onPaste={handlePaste}
				/>
				{isRTL && symbolElement}
			</span>
		);
	},
);

DirhamInputBase.displayName = "DirhamInput";

export const DirhamInput = memo(DirhamInputBase);
DirhamInput.displayName = "DirhamInput";
