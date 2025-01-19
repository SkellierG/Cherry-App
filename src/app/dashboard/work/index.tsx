import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import DefaultHomeScreen from "@screens/DefaultHomeScreen";
import FirstHomeScreen from "@screens/FirstHomeScreen";
import DeviceStorage from "@utils/deviceStorage";
import React from "react";
import { Dimensions, SafeAreaView } from "react-native";

export default function DashboardPage() {
	const isInCompany = false;

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
			{isInCompany ? <FirstHomeScreen /> : <DefaultHomeScreen />}
		</SafeAreaView>
	);
}
