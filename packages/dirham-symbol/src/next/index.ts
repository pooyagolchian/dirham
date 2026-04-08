/**
 * Next.js `next/font`-compatible local font loader for the Dirham web font.
 *
 * Provides automatic font preloading, self-hosting, and CSS variable generation
 * when used with Next.js 13+.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { dirhamFont } from "dirham/next";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html className={dirhamFont.variable}>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 *
 * Then use the CSS variable in your styles:
 * ```css
 * .dirham-symbol {
 *   font-family: var(--font-dirham);
 * }
 * ```
 *
 * Or with Tailwind:
 * ```tsx
 * <span className={`${dirhamFont.className} text-2xl`}>ৃ</span>
 * ```
 */

import localFont from "next/font/local";

/**
 * Pre-configured Dirham font instance for Next.js.
 *
 * Uses `next/font/local` for automatic preloading, self-hosting,
 * and zero layout shift (no FOIT/FOUT).
 */
export const dirhamFont = localFont({
	src: [
		{
			path: "../dist/fonts/dirham.woff2",
			weight: "400",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-dirham",
	preload: true,
});

/**
 * Font configuration for manual setup with `next/font/local`.
 * Use this if you need to customize the font loading behavior.
 *
 * @example
 * ```tsx
 * import localFont from "next/font/local";
 * import { dirhamFontConfig } from "dirham/next";
 *
 * const myDirham = localFont({
 *   ...dirhamFontConfig,
 *   display: "optional",
 * });
 * ```
 */
export const dirhamFontConfig = {
	src: [
		{
			path: "../dist/fonts/dirham.woff2",
			weight: "400" as const,
			style: "normal" as const,
		},
	],
	display: "swap" as const,
	variable: "--font-dirham",
	preload: true,
};
