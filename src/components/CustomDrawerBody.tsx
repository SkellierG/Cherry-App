import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
//@ts-ignore
import { BaseCompany } from "@types/Auth";
import { useRouter } from "expo-router";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { routes } from "@utils/constants";

export default function CustomDrawerBody({
	companiesChats,
	selectedCompany,
	navigation,
}: {
	companiesChats: Record<
		string,
		{ name: string; title: string; icon: string }[]
	>;
	selectedCompany: BaseCompany;
	navigation: any;
}) {
	const router = useRouter();

	const styles = useDynamicStyles((theme) => ({
		container: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
		},
		drawerItem: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: 12,
			paddingHorizontal: 16,
			marginVertical: 4,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.backdrop
					: light_default_theme.colors.backdrop,
			borderRadius: 8,
			marginHorizontal: 8,
		},
		drawerLabel: {
			marginLeft: 16,
			fontSize: 16,
			color: theme === "dark" ? "white" : "black",
		},
		icon: {
			color:
				theme === "dark"
					? dark_default_theme.colors.onBackground
					: light_default_theme.colors.onBackground,
		},
	}));

	const screens = companiesChats[selectedCompany.id as string] || [];

	return (
		<View style={styles.container}>
			{screens.map((screen) => (
				<TouchableOpacity
					key={screen.name}
					style={styles.drawerItem}
					onPress={() => {
						if (screen.name === "index") {
							router.push(routes.dashboard.index);
						} else {
							router.push(
								`${routes.dashboard.index}/${selectedCompany.id}/${screen.name}`,
							);
						}
					}}
				>
					<MaterialIcons
						name={screen.icon}
						size={24}
						color={styles.icon.color}
					/>
					<Text style={styles.drawerLabel}>{screen.title}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}
