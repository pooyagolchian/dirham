declare module "react-native" {
	export interface ViewStyle {
		[key: string]: unknown;
	}

	export interface TextStyle {
		[key: string]: unknown;
	}

	export interface ViewProps {
		style?: ViewStyle | ViewStyle[];
		accessibilityLabel?: string;
		accessibilityRole?: string;
		children?: React.ReactNode;
	}

	export interface TextProps {
		style?: TextStyle | TextStyle[];
		accessibilityLabel?: string;
		children?: React.ReactNode;
	}

	export const View: React.FC<ViewProps>;
	export const Text: React.FC<TextProps>;

	export const I18nManager: {
		isRTL: boolean;
		allowRTL: (allow: boolean) => void;
		forceRTL: (force: boolean) => void;
	};
}
