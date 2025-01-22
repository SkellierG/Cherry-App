import React from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import DummyScreen from "@screens/DummyScreen";

export default function DashboardPage() {
	const styles = useDynamicStyles((theme) => ({
		view: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			height: Dimensions.get("window").height,
		},
	}));
	return (
		<SafeAreaView style={styles.view}>
			<DummyScreen screenName="Index de company" />
		</SafeAreaView>
	);
}
