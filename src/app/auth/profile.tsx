import React from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import ProfileScreen from "@screens/ProfileScreen";

export default function ProfilePage() {
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
			<ProfileScreen />
		</SafeAreaView>
	);
}
