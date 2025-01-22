import React, { ReactNode } from "react";
import { View, Text, Dimensions } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import PullToRefresh from "@components/PullToRefresh";
import Drawer from "expo-router/drawer";

export default function WelcomeDrawer({
	children,
	onRefreshCallback,
}: {
	children?: ReactNode;
	onRefreshCallback?: (
		setRefreshing: React.Dispatch<React.SetStateAction<boolean>>,
	) => Promise<void>;
}) {
	const styles = useDynamicStyles((theme) => ({
		container: {
			padding: Dimensions.get("window").height / 3,
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
			paddingHorizontal: 20,
		},
		messageBox: {
			backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
			padding: 20,
			borderRadius: 10,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
			shadowRadius: 4,
			elevation: 5,
			alignItems: "center",
		},
		text: {
			color: theme === "dark" ? "#ffffff" : "#333333",
			fontSize: 16,
			textAlign: "center",
			fontWeight: "bold",
		},
		subText: {
			color: theme === "dark" ? "#bbbbbb" : "#666666",
			fontSize: 14,
			textAlign: "center",
			marginTop: 10,
		},
	}));

	return (
		<Drawer
			drawerContent={() => (
				<PullToRefresh onRefreshCallback={onRefreshCallback}>
					<View style={styles.container}>
						<View style={styles.messageBox}>
							<Text style={styles.text}>¡Bienvenido!</Text>
							<Text style={styles.subText}>
								Parece que aún no tienes ninguna compañía configurada. Crea una
								nueva compañía o únete a una existente para comenzar.
							</Text>
						</View>
					</View>
				</PullToRefresh>
			)}
		></Drawer>
	);
}
