import { Drawer } from "expo-router/drawer";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View } from "react-native";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";

export default function TabsLayout() {
	return (
		<Drawer drawerContent={CustomDrawerComponent}>
			<Drawer.Screen
				name="index"
				options={{
					title: "Home",
					drawerLabel: "Home",
					headerShown: true,
					drawerIcon: ({ color, size, focused }) => {
						return <MaterialIcons name="home" size={size} color={color} />;
					},
				}}
			/>
			{/* <Drawer.Screen
				name="administration"
				options={{
					title: "Administration",
					drawerLabel: "Administration",
					drawerIcon: ({ color, size, focused }) => {
						return <Ionicons name="stats-chart" size={size} color={color} />;
					},
				}}
			/>
			<Drawer.Screen
				name="notifications"
				options={{
					title: "Notifications",
					drawerLabel: "Notifications",
					drawerIcon: ({ color, size, focused }) => {
						return <Ionicons name="notifications" size={size} color={color} />;
					},
				}}
			/>
			<Drawer.Screen
				name="profile"
				options={{
					title: "Profile",
					drawerLabel: "Profile",
					drawerIcon: ({ color, size, focused }) => {
						return <FontAwesome5 name="user-alt" size={size} color={color} />;
					},
				}}
			/>
			<Drawer.Screen
				name="settings"
				options={{
					title: "Settings",
					drawerLabel: "Settings",
					drawerIcon: ({ color, size, focused }) => {
						return <Ionicons name="settings" size={size} color={color} />;
					},
				}}
			/> */}
		</Drawer>
	);
}

function CustomDrawerComponent(props: any) {
	return (
		<View className="flex-1">
			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
		</View>
	);
}
