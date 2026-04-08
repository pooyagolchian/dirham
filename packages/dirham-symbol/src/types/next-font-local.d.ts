declare module "next/font/local" {
	interface LocalFontSrc {
		path: string;
		weight?: string;
		style?: string;
	}

	interface LocalFontOptions {
		src: string | LocalFontSrc[];
		display?: "auto" | "block" | "swap" | "fallback" | "optional";
		preload?: boolean;
		variable?: string;
		weight?: string;
		style?: string;
		fallback?: string[];
		adjustFontFallback?: string | false;
	}

	interface NextFont {
		className: string;
		style: {
			fontFamily: string;
			fontWeight?: number;
			fontStyle?: string;
		};
		variable: string;
	}

	export default function localFont(options: LocalFontOptions): NextFont;
}
