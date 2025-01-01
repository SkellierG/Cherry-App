import { light_export, dark_export } from "./theme-output";
import {
	MD3LightTheme as DefaultTheme,
	MD3DarkTheme as DarkDefaultTheme,
	MD3Theme,
} from "react-native-paper";

export const light_export_theme: MD3Theme = {
	...DefaultTheme,
	// Specify custom property in nested object
	colors: {
		...DefaultTheme.colors,
		//The primary key color is used to derive roles for key components across the UI,
		//such as the FAB, prominent buttons, active states, as well as the tint of elevated
		//surfaces.
		primary: light_export.color8, //text selection color
		onPrimary: light_export.color4,
		primaryContainer: light_export.color4,
		onPrimaryContainer: light_export.color4,
		//The secondary key color is used for less prominent components in the UI
		//such as filter chips, while expanding the opportunity for color expression.
		secondary: light_export.color4,
		onSecondary: light_export.color4,
		secondaryContainer: light_export.color4,
		onSecondaryContainer: light_export.color4,
		//The tertiary key color is used to derive the roles of contrasting accents
		//that can be used to balance primary and secondary colors or bring heightened
		//attention to an element.
		//The tertiary color role is left for teams to use at their discretion and is
		//intended to support broader color expression in products.
		tertiary: light_export.color4,
		onTertiary: light_export.color4,
		tertiaryContainer: light_export.color4,
		onTertiaryContainer: light_export.color4,
		//The neutral key color is used to derive the roles of surface and background,
		//as well as high emphasis text and icons.
		background: light_export.color4,
		onBackground: light_export.color4,
		surface: light_export.color4,
		onSurface: dark_export.color1, //text color
		//The neutral variant key color is used to derive medium emphasis text and icons,
		//surface variants, and component outlines.
		surfaceVariant: light_export.color0,
		outline: light_export.color4,
		onSurfaceVariant: light_export.color4,

		backdrop: light_export.color4,
		outlineVariant: light_export.color4,
	},
};

export const dark_export_theme: MD3Theme = {
	...DarkDefaultTheme,
	// Specify custom property in nested object
	colors: {
		...DefaultTheme.colors,
		//The primary key color is used to derive roles for key components across the UI,
		//such as the FAB, prominent buttons, active states, as well as the tint of elevated
		//surfaces.
		primary: dark_export.color8, //text selection color
		onPrimary: dark_export.color4,
		primaryContainer: dark_export.color4,
		onPrimaryContainer: dark_export.color4,
		//The secondary key color is used for less prominent components in the UI
		//such as filter chips, while expanding the opportunity for color expression.
		secondary: dark_export.color4,
		onSecondary: dark_export.color4,
		secondaryContainer: dark_export.color4,
		onSecondaryContainer: dark_export.color4,
		//The tertiary key color is used to derive the roles of contrasting accents
		//that can be used to balance primary and secondary colors or bring heightened
		//attention to an element.
		//The tertiary color role is left for teams to use at their discretion and is
		//intended to support broader color expression in products.
		tertiary: dark_export.color4,
		onTertiary: dark_export.color4,
		tertiaryContainer: dark_export.color4,
		onTertiaryContainer: dark_export.color4,
		//The neutral key color is used to derive the roles of surface and background,
		//as well as high emphasis text and icons.
		background: dark_export.color4,
		onBackground: dark_export.color4,
		surface: dark_export.color4,
		onSurface: dark_export.color1, //text color
		//The neutral variant key color is used to derive medium emphasis text and icons,
		//surface variants, and component outlines.
		surfaceVariant: dark_export.color0,
		outline: dark_export.color4,
		onSurfaceVariant: dark_export.color4,

		backdrop: dark_export.color4,
		outlineVariant: dark_export.color4,
	},
};
