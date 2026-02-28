import type React from "react";
import { forwardRef, memo } from "react";

export interface DirhamIconProps
	extends Omit<React.HTMLProps<HTMLElement>, "children" | "size"> {
	/**
	 * Font size of the icon. Applied as the CSS `font-size` property.
	 * @default "inherit"
	 */
	size?: number | string;

	/**
	 * Color of the icon. Applied as the CSS `color` property.
	 * @default "currentColor"
	 */
	color?: string;

	/**
	 * Accessible label for screen readers.
	 * @default "UAE Dirham"
	 */
	"aria-label"?: string;

	/**
	 * HTML tag to render.
	 * @default "i"
	 */
	as?: "i" | "span";
}

/**
 * Font-based UAE Dirham symbol React component.
 *
 * Requires `dirham/css` to be imported for the `@font-face` and
 * `.dirham-symbol` class to be available.
 *
 * @example
 * ```tsx
 * import "dirham/css";
 * import { DirhamIcon } from "dirham/react";
 *
 * <DirhamIcon />
 * <DirhamIcon size={32} color="green" />
 * ```
 */
const DirhamIconBase = forwardRef<HTMLElement, DirhamIconProps>(
	(
		{
			size,
			color = "currentColor",
			"aria-label": ariaLabel = "UAE Dirham",
			as: Tag = "i",
			className = "",
			style,
			...props
		},
		ref,
	) => {
		const classes = `dirham-symbol${className ? ` ${className}` : ""}`;
		const iconStyle: React.CSSProperties = {
			...(size !== undefined && {
				fontSize: typeof size === "number" ? `${size}px` : size,
			}),
			color,
			...style,
		};

		return (
			<Tag
				ref={ref as React.Ref<HTMLElement>}
				className={classes}
				style={iconStyle}
				role="img"
				aria-label={ariaLabel}
				{...(props as React.HTMLProps<HTMLElement>)}
			/>
		);
	},
);

DirhamIconBase.displayName = "DirhamIcon";

// Memoize so the component only re-renders when its own props change.
export const DirhamIcon = memo(DirhamIconBase);
DirhamIcon.displayName = "DirhamIcon";
