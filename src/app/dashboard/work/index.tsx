import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import DefaultHomeScreen from "@screens/DefaultHomeScreen";
import FirstHomeScreen from "@screens/FirstHomeScreen";
import LoadingScreen from "@screens/LoadingScreen";
import DeviceStorage from "@utils/deviceStorage";
import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";

export default function DashboardPage() {
	const [isInCompanie, setIsInCompnie] = useState(null);
	const [loading, setLoading] = useState(true);

	const styles = useDynamicStyles((theme) => ({
		view: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			height: Dimensions.get("window").height,
		},
	}));

	useEffect(() => {
		const fetchData = async () => {
			const value = JSON.parse(
				(await DeviceStorage.getItem("isInCompnie")) || "true",
			);
			setIsInCompnie(value);
			setLoading(false);
		};
		fetchData();
	}, []);

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<SafeAreaView style={styles.view}>
			{isInCompanie ? <FirstHomeScreen /> : <DefaultHomeScreen />}
		</SafeAreaView>
	);
}
