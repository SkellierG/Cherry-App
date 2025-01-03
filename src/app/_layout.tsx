import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";
import { ThemeProvider as RNThemeProvider } from "@contexts/theme";
import { tamaguiConfig } from "../../tamagui.config";
import React from "react";
import { UserProvider } from "@contexts/user";
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
							<UserProvider>
								<Stack
									screenOptions={{
										headerShown: false,
									}}
								></Stack>
							</UserProvider>
						</ConnectivityProvider>
					</RNPaperThemeProvider>
				</RNThemeProvider>
			</ThemeProvider>
		</TamaguiProvider>
	);
}
