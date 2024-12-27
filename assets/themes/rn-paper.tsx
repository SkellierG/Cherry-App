import React from "react";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
	MD3LightTheme as DefaultTheme,
	MD3Theme,
	PaperProvider,
} from "react-native-paper";
import { light_export } from "./theme-output";

const theme: MD3Theme = {
	...DefaultTheme,
	// Specify custom property in nested object
	colors: {
		...DefaultTheme.colors,
		//The primary key color is used to derive roles for key components across the UI,
		//such as the FAB, prominent buttons, active states, as well as the tint of elevated
		//surfaces.
		primary: light_export.color10,
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
		onSurface: light_export.color4,
		//The neutral variant key color is used to derive medium emphasis text and icons,
		//surface variants, and component outlines.
		surfaceVariant: light_export.color4,
		outline: light_export.color4,
		onSurfaceVariant: light_export.color4,

		backdrop: light_export.color4,
		outlineVariant: light_export.color4,
	},
};

export default function RNPaperThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const colorScheme = useColorScheme();
	useEffect(() => {
		if (colorScheme === "dark") {
			theme.dark = true;
		} else {
			theme.dark = false;
		}
	}, [colorScheme]);

	return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
