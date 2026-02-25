import { defineConfig } from "tsup";

export default defineConfig([
	// Core entry (constants, format utilities)
	{
		entry: { index: "src/index.ts" },
		format: ["esm", "cjs"],
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
]);
