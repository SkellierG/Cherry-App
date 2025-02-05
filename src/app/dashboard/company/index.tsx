import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import FirstHomeScreen from "@screens/FirstHomeScreen";
import { useAuth } from "@contexts/auth";
import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useCompany } from "@hooks/useCompany";
import LoadingScreen from "@screens/LoadingScreen";
import PullToRefresh from "@components/PullToRefresh";

export default function DashboardPage() {
	const router = useRouter();
	const { authState } = useAuth();
	const { isLoading, handleCompany } = useCompany();
	const [isInCompany, setIsInCompany] = useState(false);

	const fetchCompanies = async () => {
		try {
			const { joined_companies } = await handleCompany();
			setIsInCompany(joined_companies.length > 1);

			if (
				authState &&
				authState.joined_companies &&
				authState.joined_companies[1]
			) {
				//@ts-ignore
				router.replace(`dashboard/company/${authState.joined_companies[1]}`);
			}
		} catch (error) {
			console.error("Error fetching companies:", error);
		}
	};

	useEffect(() => {
		if (!isLoading) {
			fetchCompanies();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onRefresh = async () => {
		await fetchCompanies();
	};

	const styles = useDynamicStyles((theme) => ({
		view: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			height: Dimensions.get("window").height,
		},
	}));

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (!isInCompany) {
		return (
			<SafeAreaView style={styles.view}>
				<PullToRefresh onRefreshCallback={onRefresh}>
					<FirstHomeScreen />
				</PullToRefresh>
			</SafeAreaView>
		);
	}

	return null;
}
