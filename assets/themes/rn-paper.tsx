import React from "react";
import { PaperProvider } from "react-native-paper";
import { useTheme } from "./themeContext"; // Importa el hook useTheme

export default function RNPaperThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Accedemos al tema desde el contexto
	const { state } = useTheme();

	// Use the PaperProvider to provide the current theme to all components inside the app
	return <PaperProvider theme={state.theme}>{children}</PaperProvider>;
}
