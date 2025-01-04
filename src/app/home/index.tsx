import React from "react";
import DummyScreen from "@screens/dummy";
import { View } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";

export default function HomeScreen() {
	const styles = useDynamicStyles((theme) => ({
		view: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
		},
	}));
	return (
		<View style={styles.view}>
			<DummyScreen screenName="Home" />
		</View>
	);
}
