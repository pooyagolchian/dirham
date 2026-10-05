#!/usr/bin/env node
// Keeps the GitHub README in step with the npm README (and ships LICENSE in the npm tarball).
//   pnpm readme:sync            rewrite README.md and packages/dirham-symbol/LICENSE
//   pnpm readme:sync --check    exit 1 if either is out of date (used in CI)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const START = "<!-- sync:package-readme:start -->";
const END = "<!-- sync:package-readme:end -->";
const check = process.argv.includes("--check");
const stale = [];

// Paths are relative to the repository root, whatever the working directory.
const path = (file) => fileURLToPath(new URL(`../${file}`, import.meta.url));

function sync(file, next) {
	const current = existsSync(path(file))
		? readFileSync(path(file), "utf8")
		: "";
	if (current === next) return;
	if (check) stale.push(file);
	else writeFileSync(path(file), next);
}

const pkgReadme = readFileSync(
	path("packages/dirham-symbol/README.md"),
	"utf8",
).trim();
const root = readFileSync(path("README.md"), "utf8");
const start = root.indexOf(START);
const end = root.indexOf(END);
if (start === -1 || end < start) {
	console.error(`README.md must contain ${START} and ${END}`);
	process.exit(1);
}
sync(
	"README.md",
	`${root.slice(0, start + START.length)}\n${pkgReadme}\n${root.slice(end)}`,
);
sync("packages/dirham-symbol/LICENSE", readFileSync(path("LICENSE"), "utf8"));

if (stale.length) {
	console.error(`Out of date: ${stale.join(", ")}. Run: pnpm readme:sync`);
	process.exit(1);
}
