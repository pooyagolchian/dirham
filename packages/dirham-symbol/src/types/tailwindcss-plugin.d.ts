declare module "tailwindcss/plugin" {
	export interface PluginAPI {
		addUtilities(utilities: Record<string, Record<string, string>>): void;
		addComponents(components: Record<string, Record<string, string>>): void;
	}

	export type PluginCreator = (api: PluginAPI) => void;

	export interface PluginWithHandler {
		handler: PluginCreator;
	}

	interface PluginFunction {
		(handler: PluginCreator): PluginWithHandler;
	}

	const plugin: PluginFunction;
	export default plugin;
}
