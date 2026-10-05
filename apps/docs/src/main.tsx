import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import { App } from "./App";
import "./styles.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in the document.");

const app = (
	<StrictMode>
		<App />
	</StrictMode>
);

// `pnpm build` prerenders #root (scripts/prerender.mjs), so hydrate it;
// `vite dev` serves an empty #root, so render from scratch.
if (rootEl.hasChildNodes()) {
	hydrateRoot(rootEl, app);
} else {
	createRoot(rootEl).render(app);
}
