declare module "react-native-svg" {
	export interface SvgProps {
		width?: number | string;
		height?: number | string;
		viewBox?: string;
		fill?: string;
		stroke?: string;
		strokeWidth?: number | string;
		accessibilityLabel?: string;
		accessibilityRole?: string;
		children?: React.ReactNode;
	}

	export interface PathProps {
		d: string;
		fill?: string;
		stroke?: string;
		strokeWidth?: number | string;
		strokeLinejoin?: "miter" | "round" | "bevel";
		paintOrder?: string;
	}

	export const Svg: React.FC<SvgProps>;
	export const Path: React.FC<PathProps>;

	export default Svg;
}
