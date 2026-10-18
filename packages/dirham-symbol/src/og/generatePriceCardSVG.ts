import { formatAmountText } from "../core/format";
import { isArabicLocale } from "../core/locale";
import { DIRHAM_SVG_PATH, DIRHAM_SVG_VIEWBOX } from "../core/svg";

export interface PriceCardSVGOptions {
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
	borderRadius?: number;
}

/**
 * Generate a self-contained SVG string for a shareable Dirham price card.
 *
 * Works server-side with zero dependencies on React or a browser DOM.
 * The returned SVG can be embedded in HTML meta tags, saved to a file, or
 * converted to PNG via sharp / resvg / Inkscape.
 *
 * @example
 * ```ts
 * import { generatePriceCardSVG } from "dirham/og";
 *
 * const svg = generatePriceCardSVG({
 *   amount: 1234.5,
 *   title: "Total Due",
 * });
 * // → <svg …>…</svg>
 * ```
 */
export function generatePriceCardSVG(options: PriceCardSVGOptions): string {
	const {
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
		borderRadius = 0,
	} = options;

	const formatted = formatAmountText(amount, { locale, decimals, notation });

	const isRTL = isArabicLocale(locale);
	const cx = width / 2;

	// Scale elements proportionally to card size
	const scale = Math.min(width / 1200, height / 630);
	const fontSize = Math.round(80 * scale);
	const capHeight = fontSize * 0.72;
	const symbolSize = Math.round(capHeight);
	const titleFontSize = Math.round(32 * scale);
	const subtitleFontSize = Math.round(24 * scale);
	const badgeFontSize = Math.round(14 * scale);

	// Vertical positions
	const titleY = height * 0.2;
	const centerY = height * 0.46;
	const amountBaseline = centerY + capHeight / 2;
	const subtitleY = height * 0.78;

	// Approximate the half-width of the formatted text
	const avgCharWidth = fontSize * 0.48;
	const textHalfWidth = (formatted.length * avgCharWidth) / 2;

	// Place symbol to the left (or right for RTL) of the text with a visible gap
	const gap = Math.round(20 * scale);
	const symbolLeftX = isRTL
		? cx + textHalfWidth + gap
		: cx - textHalfWidth - symbolSize - gap;
	const symbolTopY = centerY - symbolSize / 2;

	const escHtml = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	// Hex to RGB helper for gradient
	const hexToRgb = (hex: string) => {
		const h = hex.replace("#", "");
		return `${Number.parseInt(h.substring(0, 2), 16)},${Number.parseInt(h.substring(2, 4), 16)},${Number.parseInt(h.substring(4, 6), 16)}`;
	};
	const accentRgb = hexToRgb(accentColor);

	let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

	// Background
	if (borderRadius > 0) {
		svg += `<rect width="${width}" height="${height}" rx="${borderRadius}" fill="${escHtml(background)}" />`;
	} else {
		svg += `<rect width="${width}" height="${height}" fill="${escHtml(background)}" />`;
	}

	// Defs: grid + radial glow + vignette
	svg += "<defs>";
	svg += `<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">`;
	svg += `<path d="M 40 0 L 0 0 0 40" fill="none" stroke="${escHtml(textColor)}" stroke-opacity="0.03" stroke-width="1"/>`;
	svg += "</pattern>";
	svg += `<radialGradient id="glow" cx="50%" cy="44%" r="35%"><stop offset="0%" stop-color="rgb(${accentRgb})" stop-opacity="0.08"/><stop offset="100%" stop-color="rgb(${accentRgb})" stop-opacity="0"/></radialGradient>`;
	svg += `<radialGradient id="vignette" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="${escHtml(background)}" stop-opacity="0"/><stop offset="100%" stop-color="${escHtml(background)}" stop-opacity="0.5"/></radialGradient>`;
	svg += "</defs>";

	// Grid
	svg += `<rect width="${width}" height="${height}" fill="url(#grid)" />`;
	// Accent glow behind price area
	svg += `<rect width="${width}" height="${height}" fill="url(#glow)" />`;

	// Top accent line
	const topLineW = Math.round(120 * scale);
	svg += `<rect x="${cx - topLineW / 2}" y="0" width="${topLineW}" height="3" fill="${escHtml(accentColor)}" opacity="0.5" />`;

	// Title
	if (title) {
		svg += `<text x="${cx}" y="${titleY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${titleFontSize}" font-weight="500" fill="${escHtml(textColor)}" opacity="0.7">${escHtml(title)}</text>`;
	}

	// Dirham symbol + price
	const priceGroup = isRTL ? "rtl" : "ltr";
	svg += `<g direction="${priceGroup}">`;

	// Dirham symbol icon — vertically centered with price text
	svg += `<svg x="${symbolLeftX}" y="${symbolTopY}" width="${symbolSize}" height="${symbolSize}" viewBox="${DIRHAM_SVG_VIEWBOX}">`;
	svg += `<path d="${DIRHAM_SVG_PATH}" fill="${escHtml(accentColor)}" />`;
	svg += "</svg>";

	// Price text
	svg += `<text x="${cx}" y="${amountBaseline}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="${escHtml(textColor)}" letter-spacing="-2">${escHtml(formatted)}</text>`;

	svg += "</g>";

	// "AED" badge
	const badgeW = Math.round(60 * scale);
	const badgeH = Math.round(28 * scale);
	const badgeY = amountBaseline + Math.round(20 * scale);
	svg += `<rect x="${cx - badgeW / 2}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="${badgeH / 2}" fill="${escHtml(accentColor)}" opacity="0.15" />`;
	svg += `<text x="${cx}" y="${badgeY + badgeH * 0.68}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${badgeFontSize}" font-weight="600" fill="${escHtml(accentColor)}" letter-spacing="2">AED</text>`;

	// Subtitle
	if (subtitle) {
		svg += `<text x="${cx}" y="${subtitleY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${subtitleFontSize}" font-weight="400" fill="${escHtml(textColor)}" opacity="0.45">${escHtml(subtitle)}</text>`;
	}

	// Bottom branding + accent line
	const bottomY = height - Math.round(36 * scale);
	svg += `<text x="${cx}" y="${bottomY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.round(12 * scale)}" font-weight="500" fill="${escHtml(textColor)}" opacity="0.15" letter-spacing="4">DIRHAM.JS.ORG</text>`;
	const lineW = Math.round(80 * scale);
	svg += `<rect x="${cx - lineW / 2}" y="${height - Math.round(16 * scale)}" width="${lineW}" height="${Math.round(3 * scale)}" rx="1.5" fill="${escHtml(accentColor)}" opacity="0.5" />`;

	// Vignette overlay
	svg += `<rect width="${width}" height="${height}" fill="url(#vignette)" />`;

	svg += "</svg>";

	return svg;
}
