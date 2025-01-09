import React from "react";
import { Dimensions, SafeAreaView } from "react-native";
import SignUpScreen from "@screens/SignUpScreen";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";

export default function SignUpPage() {
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
			<SignUpScreen />
		</SafeAreaView>
	);
}
