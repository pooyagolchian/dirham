import type React from "react";
import { formatDirham } from "../core/format";
import { DIRHAM_SVG_PATH, DIRHAM_SVG_VIEWBOX } from "../core/svg";

export interface DirhamPriceCardProps {
	amount: number;
	title?: string;
	subtitle?: string;
	locale?: string;
	decimals?: number;
	notation?: "standard" | "compact";
	width?: number;
	height?: number;
	background?: string;
	textColor?: string;
	accentColor?: string;
}

/**
 * React component for generating OG / social media price card images.
 *
 * Designed to work with **@vercel/og** (Satori) for dynamic OG image
 * generation in Next.js API routes & Edge functions. Also renders fine
 * in normal React for preview purposes.
 *
 * Uses only Satori-compatible JSX (flexbox layout, no CSS Grid, inline styles).
 *
 * @example
 * ```tsx
 * // app/api/og/route.tsx  (Next.js App Router)
 * import { ImageResponse } from "next/og";
 * import { DirhamPriceCard } from "dirham/og";
 *
 * export async function GET(request: Request) {
 *   const { searchParams } = new URL(request.url);
 *   const amount = Number(searchParams.get("amount") ?? "0");
 *   const title = searchParams.get("title") ?? undefined;
 *
 *   return new ImageResponse(
 *     <DirhamPriceCard amount={amount} title={title} />,
 *     { width: 1200, height: 630 },
 *   );
 * }
 * ```
 */
export function DirhamPriceCard({
	amount,
	title,
	subtitle,
	locale = "en-AE",
	decimals = 2,
	notation = "standard",
	width = 1200,
	height = 630,
	background = "#0a0a0a",
	textColor = "#ffffff",
	accentColor = "#22c55e",
}: DirhamPriceCardProps): React.JSX.Element {
	const formatted = Number.isFinite(amount)
		? formatDirham(amount, { locale, decimals, notation, useCode: true })
				.replace("AED", "")
				.trim()
		: "—";

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width,
				height,
				background,
				color: textColor,
				fontFamily: "system-ui, -apple-system, sans-serif",
				position: "relative",
			}}
		>
			{/* Title */}
			{title && (
				<div
					style={{
						fontSize: 32,
						fontWeight: 500,
						opacity: 0.7,
						marginBottom: 24,
					}}
				>
					{title}
				</div>
			)}

			{/* Price row */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 16,
					flexDirection: locale.startsWith("ar") ? "row-reverse" : "row",
				}}
			>
				{/* Dirham symbol */}
				<svg
					width={64}
					height={64}
					viewBox={DIRHAM_SVG_VIEWBOX}
					style={{ flexShrink: 0 }}
					role="img"
					aria-label="UAE Dirham"
				>
					<path d={DIRHAM_SVG_PATH} fill={accentColor} />
				</svg>

				{/* Formatted amount */}
				<div
					style={{
						fontSize: 80,
						fontWeight: 700,
						letterSpacing: -2,
						lineHeight: 1,
					}}
				>
					{formatted}
				</div>
			</div>

			{/* AED badge */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 16,
					paddingLeft: 16,
					paddingRight: 16,
					paddingTop: 6,
					paddingBottom: 6,
					borderRadius: 14,
					background: accentColor,
					opacity: 0.2,
				}}
			>
				<span
					style={{
						fontSize: 14,
						fontWeight: 600,
						letterSpacing: 2,
						color: accentColor,
						opacity: 1,
					}}
				>
					AED
				</span>
			</div>

			{/* Subtitle */}
			{subtitle && (
				<div
					style={{
						fontSize: 24,
						fontWeight: 400,
						opacity: 0.5,
						marginTop: 32,
					}}
				>
					{subtitle}
				</div>
			)}

			{/* Bottom accent line */}
			<div
				style={{
					position: "absolute",
					bottom: 40,
					width: 80,
					height: 3,
					borderRadius: 2,
					background: accentColor,
					opacity: 0.6,
				}}
			/>
		</div>
	);
}
