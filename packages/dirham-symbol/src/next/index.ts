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
 * <span className={`${dirhamFont.className} text-2xl`}>&#x20C3;</span>
 * ```
 */

import localFont from "next/font/local";

/**
 * Pre-configured Dirham font instance for Next.js.
 *
 * Uses `next/font/local` for automatic preloading, self-hosting,
 * and zero layout shift (no FOIT/FOUT).
 *
 * The font `path` is relative to this file in the published package
 * (`dist/next/index.js`), so it points at `dist/fonts/dirham.woff2`.
 */
export const dirhamFont = localFont({
	src: [
		{
			path: "../fonts/dirham.woff2",
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
 * Note: `next/font/local` resolves `path` relative to the file that calls it. The
 * path here is relative to this package's `dist/next/`, so when you spread this
 * into `localFont()` in your own file, override `src` with a path from your file to
 * `node_modules/dirham/dist/fonts/dirham.woff2`.
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
			path: "../fonts/dirham.woff2",
			weight: "400" as const,
			style: "normal" as const,
		},
	],
	display: "swap" as const,
	variable: "--font-dirham",
	preload: true,
};
