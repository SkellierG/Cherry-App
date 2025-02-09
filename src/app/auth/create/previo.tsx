import React from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import PrevioCreateScreen from "@screens/pervioCreateScreen";

export default function CompanyCreatePage() {
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
			<PrevioCreateScreen />
		</SafeAreaView>
	);
}
