import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// U+09C3 (Bengali vowel sign) and U+2103 (degree Celsius) have been pasted
// where the UAE Dirham sign U+20C3 was meant. Neither renders as the sign.
const LOOK_ALIKES = /[\u{9C3}\u{2103}]/u;

const pkgRoot = fileURLToPath(new URL("../../../", import.meta.url));
const walk = (dir: string): string[] =>
	readdirSync(join(pkgRoot, dir)).flatMap((name) => {
		const path = join(dir, name);
		return statSync(join(pkgRoot, path)).isDirectory() ? walk(path) : [path];
	});

describe("published text uses U+20C3, not look-alikes", () => {
	it.each([...walk("src"), "README.md", "llms.txt"])("%s", (file) => {
		expect(readFileSync(join(pkgRoot, file), "utf8")).not.toMatch(LOOK_ALIKES);
	});
});
