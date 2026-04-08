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
	// React Native entry
	{
		entry: { "react-native/index": "src/react-native/index.ts" },
		format: ["esm", "cjs"],
		target: "es2021",
		dts: true,
		sourcemap: true,
		clean: false,
		outDir: "dist",
		splitting: false,
		treeshake: true,
		external: ["react", "react-native", "react-native-svg"],
		esbuildOptions(options) {
			options.jsx = "automatic";
		},
	},
	// Tailwind plugin entry
	{
		entry: { "tailwind/index": "src/tailwind/index.ts" },
		format: ["esm", "cjs"],
		target: "es2021",
		dts: true,
		sourcemap: true,
		clean: false,
		outDir: "dist",
		splitting: false,
		treeshake: true,
		external: ["tailwindcss", "tailwindcss/plugin"],
	},
	// Next.js entry
	{
		entry: { "next/index": "src/next/index.ts" },
		format: ["esm", "cjs"],
		target: "es2021",
		dts: true,
		sourcemap: true,
		clean: false,
		outDir: "dist",
		splitting: false,
		treeshake: true,
		external: ["next", "next/font/local"],
	},
	// OG / Social image entry
	{
		entry: { "og/index": "src/og/index.ts" },
		format: ["esm", "cjs"],
		target: "es2021",
		dts: true,
		sourcemap: true,
		clean: false,
		outDir: "dist",
		splitting: false,
		treeshake: true,
		external: ["react"],
		esbuildOptions(options) {
			options.jsx = "automatic";
		},
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
