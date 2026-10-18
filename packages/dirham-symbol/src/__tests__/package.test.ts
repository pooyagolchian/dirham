import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const built = existsSync(resolve(root, "dist/index.js"));
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

/** Every string leaf of an exports map. */
function targets(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (value && typeof value === "object") {
		return Object.values(value).flatMap(targets);
	}
	return [];
}

// These check the build output, so they run after `pnpm build` (as CI does).
describe.skipIf(!built)("published package", () => {
	it("ships every file the exports map and bin point at", () => {
		const all = [
			...targets(pkg.exports),
			...targets(pkg.bin),
			pkg.main,
			pkg.module,
			pkg.types,
		];
		const missing = all.filter((file) => !existsSync(resolve(root, file)));
		expect(missing).toEqual([]);
	});

	it("keeps dirham/og free of React, as its docs promise", () => {
		for (const file of ["dist/og/index.js", "dist/og/index.cjs"]) {
			const code = readFileSync(resolve(root, file), "utf8");
			expect(code, file).not.toMatch(/from\s*["']react|require\(["']react/);
		}
	});

	it("exposes DirhamPriceCard from dirham/og/react", async () => {
		expect(pkg.exports["./og/react"]).toBeDefined();
		const mod = await import(resolve(root, "dist/og/react.js"));
		expect(typeof mod.DirhamPriceCard).toBe("function");
	});
});
