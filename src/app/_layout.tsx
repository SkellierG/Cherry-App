import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";
import { ThemeProvider as RNThemeProvider } from "@contexts/theme";
import { tamaguiConfig } from "../../tamagui.config";
import React from "react";
import { AuthProvider } from "@contexts/auth";
import RNPaperThemeProvider from "@assets/themes/rn-paper";
import { ConnectivityProvider } from "@contexts/internet";

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<RNThemeProvider>
					<RNPaperThemeProvider>
						<ConnectivityProvider>
							<AuthProvider>
								<Slot />
							</AuthProvider>
						</ConnectivityProvider>
					</RNPaperThemeProvider>
				</RNThemeProvider>
			</ThemeProvider>
		</TamaguiProvider>
	);
}
