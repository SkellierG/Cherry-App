import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import React from "react";
import PullToRefresh from "./PullToRefresh";
import { TouchableOpacity, View, Image, Text } from "react-native";

export default function CustomDrawerHeader({
	onRefreshCallback,
	companies,
	selectedCompany,
	onCompanyChange,
	...props
}: any): any {
	const styles = useDynamicStyles((theme) => ({
		header: {
			backgroundColor: "#d03434",
			padding: 10,
			alignItems: "center",
		},
		profileImage: {
			width: 60,
			height: 60,
			borderRadius: 30,
			marginBottom: 10,
		},
		accountName: {
			color: "#fff",
			fontSize: 18,
			fontWeight: "bold",
		},
		accountEmail: {
			color: "#ddd",
			fontSize: 14,
		},
		accountSwitcher: {
			flexDirection: "row",
			justifyContent: "center",
			paddingVertical: 10,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.backdrop
					: light_default_theme.colors.backdrop,
			borderBottomWidth: 1,
			borderBottomColor: "#ddd",
		},
		accountAvatar: {
			width: 40,
			height: 40,
			borderRadius: 20,
			marginHorizontal: 5,
			opacity: 0.8,
		},
		selectedAvatar: {
			opacity: 1,
			borderWidth: 2,
			borderColor: "#d03434",
		},
	}));

	return (
		<PullToRefresh onRefreshCallback={onRefreshCallback}>
			<View style={{ zIndex: 9999 }}>
				<View style={styles.header}>
					<Image
						source={{ uri: selectedCompany.avatar_url }}
						style={styles.profileImage}
					/>
					<Text style={styles.accountName}>{selectedCompany.name}</Text>
					<Text style={styles.accountEmail}>{selectedCompany.slogan}</Text>
				</View>

				<View style={styles.accountSwitcher}>
					{companies.map((company: any) => (
						<TouchableOpacity
							key={company.id}
							onPress={() => onCompanyChange(company)}
						>
							<Image
								source={{ uri: company.avatar_url }}
								style={[
									styles.accountAvatar,
									company.id === selectedCompany.id && styles.selectedAvatar,
								]}
							/>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</PullToRefresh>
	);
}
