import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import FirstHomeScreen from "@screens/FirstHomeScreen";
import { useAuth } from "@contexts/auth";
import React from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function DashboardPage() {
	const router = useRouter();
	const { authState } = useAuth();

	//TODO: useCompany
	const isInCompany =
		(authState.joined_companies?.length
			? authState.joined_companies?.length
			: 0) >= 2;

	console.log(authState.joined_companies);

	const styles = useDynamicStyles((theme) => ({
		view: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			height: Dimensions.get("window").height,
		},
	}));

	if (!isInCompany) {
		return (
			<SafeAreaView style={styles.view}>
				<FirstHomeScreen />
			</SafeAreaView>
		);
	}

	router.dismiss();
	router.replace(`dashboard/company/${authState.joined_companies[1]}`);
}
