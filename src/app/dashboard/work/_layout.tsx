import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Drawer } from "expo-router/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";

// Lista de cuentas simuladas
const accounts = [
	{
		id: 1,
		name: "AgroHarvest Co.",
		email: "Cosechando calidad para el futuro.",
		avatar: "https://placehold.co/100x100/png",
	},
	{
		id: 2,
		name: "FruitCollect Ltd.",
		email: "Frutas frescas directo del campo.",
		avatar: "https://placehold.co/100x100/png",
	},
	{
		id: 3,
		name: "GreenFields Agri.",
		email: "Cultivando soluciones sostenibles.",
		avatar: "https://placehold.co/100x100/png",
	},
	{
		id: 4,
		name: "HarvestPro Inc.",
		email: "Innovación en cada cosecha.",
		avatar: "https://placehold.co/100x100/png",
	},
];

// Screens dinámicos por cuenta
const accountScreens = {
	1: [
		{ name: "index", title: "Inicio", icon: "home" },
		{ name: "profile", title: "Perfil", icon: "person" },
	],
	2: [
		{ name: "index", title: "Dashboard", icon: "dashboard" },
		{ name: "settings", title: "Ajustes", icon: "settings" },
	],
	3: [
		{ name: "index", title: "Dashboard", icon: "dashboard" },
		{ name: "settings", title: "Ajustes", icon: "settings" },
	],
	4: [
		{ name: "index", title: "Dashboard", icon: "dashboard" },
		{ name: "settings", title: "Ajustes", icon: "settings" },
	],
};

export default function TabsLayout() {
	const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

	return (
		<Drawer
			drawerContent={(props: any) => (
				<CustomDrawerComponent
					{...props}
					accounts={accounts}
					selectedAccount={selectedAccount}
					onAccountChange={setSelectedAccount}
				/>
			)}
		>
			{accountScreens[selectedAccount.id].map((screen: any) => (
				<Drawer.Screen
					key={screen.name}
					name={screen.name}
					options={{
						title: screen.title,
						drawerLabel: screen.title,
						drawerIcon: ({ color, size }) => (
							<MaterialIcons name={screen.icon} size={size} color={color} />
						),
					}}
				/>
			))}
		</Drawer>
	);
}

function CustomDrawerComponent({
	accounts,
	selectedAccount,
	onAccountChange,
	...props
}: any) {
	const styles = useDynamicStyles((theme) => ({
		header: {
			backgroundColor: "#d03434",
			padding: 5,
			alignItems: "center",
		},
		profileImage: {
			width: 50,
			height: 50,
			marginBottom: 10,
		},
		accountName: {
			color: theme === "dark" ? "white" : "white",
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
			opacity: 1,
		},
		selectedAvatar: {
			opacity: 1,
			borderWidth: 2,
			borderColor: "#d03434",
		},
	}));

	return (
		<View style={{ flex: 1 }}>
			{/* Encabezado del Drawer con la foto de perfil */}
			<View style={styles.header}>
				<Image
					source={{ uri: selectedAccount.avatar }}
					style={styles.profileImage}
				/>
				<Text style={styles.accountName}>{selectedAccount.name}</Text>
				<Text style={styles.accountEmail}>{selectedAccount.email}</Text>
			</View>

			{/* Selección de cuentas */}
			<View style={styles.accountSwitcher}>
				{accounts.map((account: any) => (
					<TouchableOpacity
						key={account.id}
						onPress={() => onAccountChange(account)}
					>
						<Image
							source={{ uri: account.avatar }}
							style={[
								styles.accountAvatar,
								account.id === selectedAccount.id && styles.selectedAvatar,
							]}
						/>
					</TouchableOpacity>
				))}
			</View>

			{/* Lista de opciones del Drawer */}
			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
		</View>
	);
}
