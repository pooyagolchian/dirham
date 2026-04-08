import type React from "react";
import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import type { DirhamWeight } from "../core/constants";
import { parseDirham } from "../core/format";
import { DirhamSymbol } from "./DirhamSymbol";

// ─── Formatting helper (scoped to this module) ──────────────────────────────

const _fmtCache = new Map<string, Intl.NumberFormat>();

function getInputFormatter(locale: string, decimals: number): Intl.NumberFormat {
	const key = `input:${locale}:${decimals}`;
	let fmt = _fmtCache.get(key);
	if (!fmt) {
		fmt = new Intl.NumberFormat(locale, {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		});
		_fmtCache.set(key, fmt);
	}
	return fmt;
}

function formatInputValue(
	value: number | undefined,
	locale: string,
	decimals: number,
): string {
	if (value === undefined || !Number.isFinite(value)) return "";
	return getInputFormatter(locale, decimals).format(value);
}

function stripFormatting(raw: string): string {
	// Normalize Arabic-Indic digits to ASCII
	let cleaned = raw.replace(
		/[\u0660-\u0669]/g,
		(d) => String(d.charCodeAt(0) - 0x0660),
	);
	// Arabic decimal separator → dot
	cleaned = cleaned.replace(/\u066B/g, ".");
	// Remove thousands separators (comma, NBSP, Arabic thousands sep, space)
	cleaned = cleaned.replace(/[,\s\u00A0\u066C]/g, "");
	// Remove any currency symbols/text
	cleaned = cleaned.replace(/[\u20C3]/g, "");
	cleaned = cleaned.replace(/AED/gi, "");
	cleaned = cleaned.replace(/د\.إ/g, "");
	return cleaned.trim();
}

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
		const isControlled = controlledValue !== undefined;
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
				else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
			},
			[ref],
		);

		const isRTL = locale.startsWith("ar");

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
			: formatInputValue(numericValue, locale, decimals);

		// When entering focus, show the raw numeric value
		const handleFocus = useCallback(
			(e: React.FocusEvent<HTMLInputElement>) => {
				setIsFocused(true);
				// Show plain number for editing
				const plain =
					numericValue !== undefined && Number.isFinite(numericValue)
						? numericValue.toString()
						: "";
				setRawText(plain);

				if (selectOnFocus) {
					// setTimeout so the value is set before selection
					setTimeout(() => inputRef.current?.select(), 0);
				}
				onFocus?.(e);
			},
			[numericValue, selectOnFocus, onFocus],
		);

		// On blur, parse+clamp+format
		const handleBlur = useCallback(
			(e: React.FocusEvent<HTMLInputElement>) => {
				setIsFocused(false);

				const stripped = stripFormatting(rawText);
				if (stripped === "" || stripped === "." || stripped === "-") {
					if (!isControlled) setInternalValue(undefined);
					onChange?.(undefined);
				} else {
					let parsed = Number.parseFloat(stripped);
					if (Number.isNaN(parsed)) {
						if (!isControlled) setInternalValue(undefined);
						onChange?.(undefined);
					} else {
						// Enforce decimal precision
						const factor = 10 ** decimals;
						parsed = Math.round(parsed * factor) / factor;
						parsed = clamp(parsed);
						if (!isControlled) setInternalValue(parsed);
						onChange?.(parsed);
					}
				}

				onBlur?.(e);
			},
			[rawText, decimals, clamp, isControlled, onChange, onBlur],
		);

		// Handle typing
		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				let text = e.target.value;

				// Allow only digits, one decimal point, optional leading minus
				const cleaned = stripFormatting(text);

				// Validate: optional minus, digits, optional single dot + digits
				if (cleaned !== "" && !/^-?\d*\.?\d*$/.test(cleaned)) {
					return; // reject invalid input
				}

				// Enforce max decimal places while typing
				const dotIndex = cleaned.indexOf(".");
				if (dotIndex !== -1) {
					const decimalPart = cleaned.slice(dotIndex + 1);
					if (decimalPart.length > decimals) {
						return; // too many decimal places
					}
				}

				setRawText(cleaned);

				// Emit intermediate value for controlled components
				if (cleaned === "" || cleaned === "." || cleaned === "-") {
					if (!isControlled) setInternalValue(undefined);
					onChange?.(undefined);
				} else {
					const parsed = Number.parseFloat(cleaned);
					if (!Number.isNaN(parsed)) {
						if (!isControlled) setInternalValue(parsed);
						onChange?.(parsed);
					}
				}
			},
			[decimals, isControlled, onChange],
		);

		// Handle paste — support formatted and Arabic numeral values
		const handlePaste = useCallback(
			(e: React.ClipboardEvent<HTMLInputElement>) => {
				e.preventDefault();
				const pasted = e.clipboardData.getData("text/plain");
				const stripped = stripFormatting(pasted);

				if (stripped === "") return;

				// Enforce decimal places
				const dotIndex = stripped.indexOf(".");
				let final = stripped;
				if (dotIndex !== -1) {
					final = `${stripped.slice(0, dotIndex)}.${stripped.slice(dotIndex + 1, dotIndex + 1 + decimals)}`;
				}

				if (!/^-?\d*\.?\d*$/.test(final)) return;

				setRawText(final);

				const parsed = Number.parseFloat(final);
				if (!Number.isNaN(parsed)) {
					const clamped = clamp(
						Math.round(parsed * 10 ** decimals) / 10 ** decimals,
					);
					if (!isControlled) setInternalValue(clamped);
					onChange?.(clamped);
				}
			},
			[decimals, clamp, isControlled, onChange],
		);

		// Sync controlled value when it changes externally
		useEffect(() => {
			if (isControlled && !isFocused) {
				// Value updated from parent while not editing
			}
		}, [controlledValue, isControlled, isFocused]);

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
					placeholder={placeholder ?? formatInputValue(0, locale, decimals)}
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
