import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "@/tamagui.config";
import React from "react";
import { UserProvider } from "@contexts/user";

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<UserProvider>
					<Stack
						screenOptions={{
							headerShown: false,
						}}
					></Stack>
				</UserProvider>
			</ThemeProvider>
		</TamaguiProvider>
	);
}
