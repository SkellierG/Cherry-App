import React from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import SignInScreen from "@screens/SignInScreen";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import AuthGoogle from "@services/AuthGoogle";

export default function SignInPage() {
	const styles = useDynamicStyles((theme) => ({
		view: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			height: Dimensions.get("window").height,
		},
		authGoogleContainer: {
			marginTop: 20,
			alignItems: "center",
		},
	}));
	return (
		<SafeAreaView style={styles.view}>
			<SignInScreen />
			<View style={styles.authGoogleContainer}>
				<AuthGoogle />
			</View>
		</SafeAreaView>
	);
}
