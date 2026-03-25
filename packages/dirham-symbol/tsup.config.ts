import { defineConfig } from "tsup";

export default defineConfig([
	// Core entry (constants, format utilities)
	{
		entry: { index: "src/index.ts" },
		format: ["esm", "cjs"],
		target: "es2021",
		dts: true,
		sourcemap: true,
		clean: false, // Don't clean — font build runs first
		outDir: "dist",
		splitting: false,
		treeshake: true,
	},
	// React entry (components)
	{
		entry: { "react/index": "src/react/index.ts" },
		format: ["esm", "cjs"],
		target: "es2021",
		dts: true,
		sourcemap: true,
		clean: false,
		outDir: "dist",
		splitting: false,
		treeshake: true,
		external: ["react", "react-dom"],
		esbuildOptions(options) {
			options.jsx = "automatic";
		},
	},
	// Web Component entry (framework-agnostic)
	{
		entry: { "web-component/index": "src/web-component/index.ts" },
		format: ["esm", "cjs"],
		target: "es2021",
		dts: true,
		sourcemap: true,
		clean: false,
		outDir: "dist",
		splitting: false,
		treeshake: true,
	},
	// CLI entry
	{
		entry: { cli: "src/cli.ts" },
		format: ["cjs"],
		target: "node18",
		dts: false,
		sourcemap: false,
		clean: false,
		outDir: "dist",
		splitting: false,
		banner: { js: "#!/usr/bin/env node" },
	},
]);
