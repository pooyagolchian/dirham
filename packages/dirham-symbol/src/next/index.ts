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
 * The options `dirhamFont` is built with, for reference.
 *
 * @deprecated `next/font/local` only accepts an object literal written in your own
 * file, so this cannot be passed (or spread) into `localFont()`: a real Next.js
 * build fails with "Font loader values must be explicitly written literals". To
 * customize loading, write the call yourself, with `src` pointing at the font in
 * `node_modules`:
 *
 * @example
 * ```tsx
 * // app/fonts.ts
 * import localFont from "next/font/local";
 *
 * export const myDirham = localFont({
 *   src: "../node_modules/dirham/dist/fonts/dirham.woff2",
 *   display: "optional",
 *   variable: "--font-dirham",
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
