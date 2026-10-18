import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const built = existsSync(resolve(root, "dist/fonts/dirham.woff2"));

// next/font/local resolves `path` relative to the file that calls it, which for
// the published package is dist/next/index.js, not src/next/index.ts. The build
// output must therefore contain it, so this only runs after `pnpm build`.
describe.skipIf(!built)("dirham/next font path", () => {
	const source = readFileSync(resolve(root, "src/next/index.ts"), "utf8");
	// Only the call made from this package. dirhamFontConfig is spread into the
	// consumer's own localFont() call, so its path resolves from their file.
	const call = source.slice(
		source.indexOf("export const dirhamFont = localFont("),
		source.indexOf("export const dirhamFontConfig"),
	);
	const paths = [...call.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]);

	it("finds the font paths in the source", () => {
		expect(paths.length).toBeGreaterThan(0);
	});

	it.each(paths)("%s exists when resolved from dist/next", (path) => {
		expect(existsSync(resolve(root, "dist/next", path))).toBe(true);
	});
});
