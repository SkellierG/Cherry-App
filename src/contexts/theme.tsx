import React, {
	createContext,
	useReducer,
	useContext,
	ReactNode,
	useEffect,
} from "react";

import {
	dark_default_theme,
	dark_export_theme,
	light_default_theme,
	light_export_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { MD3Theme } from "react-native-paper";
import { useColorScheme } from "react-native";

// Definir el estado del tema
interface ThemeState {
	theme: MD3Theme;
}

// Definir las acciones posibles para el tema
type ThemeAction = { type: "WHITE_THEME" | "DARK_THEME" };

// Estado inicial del tema (modo claro por defecto)
const initialState: ThemeState = {
	theme: light_default_theme,
};

// Reducer para cambiar entre los temas claro y oscuro
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
	switch (action.type) {
		case "WHITE_THEME":
			return { theme: light_default_theme };
		case "DARK_THEME":
			return { theme: dark_default_theme };
		default:
			return state;
	}
};

// Crear el contexto de tema
const ThemeContext = createContext<
	{ state: ThemeState; dispatch: React.Dispatch<ThemeAction> } | undefined
>(undefined);

// Proveedor de contexto de tema
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(themeReducer, initialState);
	const colorScheme = useColorScheme();

	// Cambiar el tema según el colorScheme del sistema (claro/oscuro)
	useEffect(() => {
		if (colorScheme === "dark") {
			dispatch({ type: "DARK_THEME" });
		} else {
			dispatch({ type: "WHITE_THEME" });
		}
	}, [colorScheme]);

	return (
		<ThemeContext.Provider value={{ state, dispatch }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Hook para acceder al contexto de tema
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
