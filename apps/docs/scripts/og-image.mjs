// Generates the social card and the icon set for dirham.js.org into apps/docs/public/:
//   og.png (1200x630), favicon.ico (32px), favicon.svg, apple-touch-icon.png (180px),
//   icon-192.png and icon-512.png.
//
// The files are committed; this script is not part of `pnpm build`. Run it again after
// changing the design below or the glyph (packages/dirham-symbol/src/svg/dirham.svg).
// The renderer is a native module, so install it outside the repository and point
// NODE_PATH at it (this script loads its dependencies with require, which honours NODE_PATH;
// --legacy-peer-deps skips geist's Next.js peer, which this script does not use):
//
//   npm install --prefix /tmp/dirham-og --legacy-peer-deps @resvg/resvg-js@2.6.2 geist@1.7.2
//   NODE_PATH=/tmp/dirham-og/node_modules node apps/docs/scripts/og-image.mjs
//
// System fonts are disabled and the text uses the Geist TTFs from the `geist` package,
// so the output does not depend on the machine it runs on.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { Resvg } = require("@resvg/resvg-js");

// `geist` hides its font files from its exports map, so look them up on the resolver paths.
const fontDir = require.resolve
	.paths("geist")
	.map((dir) => join(dir, "geist", "dist", "fonts"))
	.find((dir) => existsSync(dir));
if (!fontDir) {
	throw new Error(
		"Geist TTFs not found: install the `geist` package (see above).",
	);
}

// Glyph outline from the package sources; the path fills its whole 1000x870 viewBox.
const glyphPath = readFileSync(
	new URL(
		"../../../packages/dirham-symbol/src/svg/dirham.svg",
		import.meta.url,
	),
	"utf8",
).match(/ d="([^"]+)"/)[1];
const ASPECT = 1000 / 870;

/**
 * The glyph centred in a `size` x `size` square at (x, y), with clear space of one third
 * of its height on every side (CBUAE Dirham Currency Symbol Guidelines, p.8).
 * Plain white, no effects (p.9).
 */
function glyph(x, y, size) {
	const h = size / (ASPECT + 2 / 3);
	const w = h * ASPECT;
	const at = (n) => n.toFixed(2);
	return `<svg x="${at(x + (size - w) / 2)}" y="${at(y + (size - h) / 2)}" width="${at(w)}" height="${at(h)}" viewBox="0 0 1000 870"><path fill="#fff" d="${glyphPath}"/></svg>`;
}

function png(svg, width) {
	return new Resvg(svg, {
		fitTo: { mode: "width", value: width },
		font: {
			loadSystemFonts: false,
			defaultFontFamily: "Geist",
			fontFiles: [
				"geist-sans/Geist-Regular.ttf",
				"geist-sans/Geist-Medium.ttf",
				"geist-sans/Geist-Bold.ttf",
				"geist-mono/GeistMono-Regular.ttf",
				"geist-mono/GeistMono-Medium.ttf",
			].map((file) => join(fontDir, file)),
		},
	})
		.render()
		.asPng();
}

const out = (name) =>
	fileURLToPath(new URL(`../public/${name}`, import.meta.url));

// Social card. No version number or date, so cached previews never go stale.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#fff" fill-opacity="0.06"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect x="80" y="155" width="320" height="320" rx="56" fill="#111" stroke="#262626" stroke-width="2"/>
  ${glyph(80, 155, 320)}
  <text x="460" y="250" font-family="Geist" font-weight="700" font-size="68" fill="#fff" letter-spacing="-2">UAE Dirham Symbol</text>
  <text x="460" y="318" font-family="Geist Mono" font-weight="500" font-size="40" fill="#22c55e">U+20C3</text>
  <text x="460" y="386" font-family="Geist" font-size="30" fill="#a3a3a3">Web font · CSS · React · Web Components</text>
  <rect x="460" y="420" width="300" height="56" rx="12" fill="#171717" stroke="#262626"/>
  <text x="484" y="457" font-family="Geist Mono" font-size="26" fill="#e5e5e5">npm i dirham</text>
  <text x="80" y="570" font-family="Geist" font-weight="500" font-size="24" fill="#737373" letter-spacing="3">DIRHAM.JS.ORG</text>
  <text x="1120" y="570" text-anchor="end" font-family="Geist Mono" font-size="22" fill="#737373">MIT · Unicode 18.0</text>
</svg>`;
writeFileSync(out("og.png"), png(og, 1200));

// Icons: the white glyph on the site's #0a0a0a tile. Rounded corners for browser tabs;
// square for iOS (which rounds the corners itself) and for the web manifest.
const icon = (rx) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="${rx}" fill="#0a0a0a"/>${glyph(0, 0, 64)}</svg>\n`;
writeFileSync(out("favicon.svg"), icon(14));
writeFileSync(out("apple-touch-icon.png"), png(icon(0), 180));
writeFileSync(out("icon-192.png"), png(icon(0), 192));
writeFileSync(out("icon-512.png"), png(icon(0), 512));

// favicon.ico: one 32x32 PNG in an ICO container (6-byte header + one 16-byte entry).
const png32 = png(icon(14), 32);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
writeFileSync(out("favicon.ico"), Buffer.concat([header, png32]));

console.log(
	"wrote og.png, favicon.ico, favicon.svg, apple-touch-icon.png, icon-192.png, icon-512.png to apps/docs/public/",
);
