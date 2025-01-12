import React from "react";
import { View, Text, Image } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { H1 } from "tamagui";

export default function DefaultHomeScreen() {
	const styles = useDynamicStyles((theme) => ({
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			padding: 20,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
		},
		textContainer: {
			alignItems: "center",
			marginBottom: 30,
		},
		greetingText: {
			color: theme === "dark" ? "white" : "black",
			fontSize: 20,
			textAlign: "center",
			marginBottom: 10,
		},
		instructionText: {
			color: theme === "dark" ? "white" : "black",
			fontSize: 16,
			textAlign: "center",
		},
		image: {
			marginBottom: 20,
		},
	}));

	return (
		<View style={styles.container}>
			<Image style={styles.image} />
			<View style={styles.textContainer}>
				<H1>¡Bienvenido de nuevo!</H1>
				<Text style={styles.greetingText}>
					Nos alegra verte otra vez en nuestra app.
				</Text>
				<Text style={styles.instructionText}>
					Puedes deslizar hacia la derecha para acceder al menú o usar los
					botones en la parte inferior para ver tus notificaciones o revisar tus
					configuraciones y perfil.
				</Text>
			</View>
		</View>
	);
}
