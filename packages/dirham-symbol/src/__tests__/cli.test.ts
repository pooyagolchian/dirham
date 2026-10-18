import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const cli = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"../../dist/cli.cjs",
);

// Runs the built CLI, so it needs `pnpm build` first.
describe.skipIf(!existsSync(cli))("dirham CLI", () => {
	// An empty PATH means no pbcopy/xclip/xsel/clip, so a valid `copy` takes the
	// "could not access the clipboard" path and never touches the real clipboard.
	const run = (...args: string[]) =>
		spawnSync(process.execPath, [cli, ...args], {
			encoding: "utf8",
			env: { ...process.env, PATH: "" },
		});

	it("prints the symbol info with no arguments", () => {
		const result = run();
		expect(result.status).toBe(0);
		expect(result.stdout).toContain("U+20C3");
	});

	it("falls back to printing the value when there is no clipboard tool", () => {
		const result = run("copy", "html");
		expect(result.stdout).toContain("&#x20C3;");
		expect(result.stdout).not.toContain("Copied");
	});

	it.each(["bogus", "constructor", "toString", "__proto__", "hasOwnProperty"])(
		"rejects the unknown format %s with a message and a failing exit code",
		(format) => {
			const result = run("copy", format);
			expect(result.status).toBe(1);
			expect(result.stderr).toContain(`Unknown format "${format}"`);
			expect(result.stdout).not.toContain("Copied");
			expect(result.stdout).not.toContain("native code");
		},
	);

	it("lists every format in --help", () => {
		const result = run("--help");
		expect(result.status).toBe(0);
		for (const format of ["unicode", "html", "css", "js", "arabic", "code"]) {
			expect(result.stdout).toContain(format);
		}
	});
});
