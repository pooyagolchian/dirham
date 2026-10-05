/**
 * `HTMLElement` in browsers; an inert stand-in on the server so importing
 * "dirham/web-component" during SSR (Next.js, Nuxt, SvelteKit, Angular) never throws.
 */
export const BaseElement: typeof HTMLElement =
	typeof HTMLElement === "undefined"
		? (class {} as unknown as typeof HTMLElement)
		: HTMLElement;
