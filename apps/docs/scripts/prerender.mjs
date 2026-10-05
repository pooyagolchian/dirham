// Puts the server-rendered <App /> into dist/index.html, so crawlers and clients
// without JavaScript get the page content. Runs after `vite build` and
// `vite build --ssr src/entry-server.tsx --outDir dist-ssr` (see the build script).
import { readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ssrDir = new URL("../dist-ssr/", import.meta.url);
const indexHtml = fileURLToPath(new URL("../dist/index.html", import.meta.url));
const ROOT = '<div id="root"></div>';

const { render } = await import(new URL("entry-server.js", ssrDir).href);
const template = await readFile(indexHtml, "utf8");
if (!template.includes(ROOT)) {
	throw new Error(`prerender: ${ROOT} not found in dist/index.html`);
}

const appHtml = render();
if (!appHtml) throw new Error("prerender: the app rendered no HTML");
// Function replacer: a replacement string would expand "$&", "$'" and the like
// if the page text ever contained them.
await writeFile(
	indexHtml,
	template.replace(ROOT, () => `<div id="root">${appHtml}</div>`),
);
await rm(ssrDir, { recursive: true, force: true });
console.log(
	`prerender: injected ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`,
);
