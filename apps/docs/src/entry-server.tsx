import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";

/** Build-time render used by scripts/prerender.mjs. Must match the tree main.tsx hydrates. */
export function render(): string {
	return renderToString(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
