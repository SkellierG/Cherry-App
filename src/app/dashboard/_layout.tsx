import React from "react";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@contexts/auth";

export default function DashboardLayout() {
	const { authState } = useAuth();
	return (
		<Tabs>
			<Tabs.Screen
				name="work"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ color, size, focused }) => {
						return <MaterialIcons name="home" size={size} color={color} />;
					},
				}}
			/>
			<Tabs.Screen
				name="notifications"
				options={{
					title: "Notifications",
					headerShown: false,
					tabBarIcon: ({ color, size, focused }) => {
						return <Ionicons name="notifications" size={size} color={color} />;
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ focused, color, size }) => (
						<Image
							height={size}
							width={size}
							borderRadius={100}
							source={{ uri: authState.profile?.avatar_url as string }}
						></Image>
					),
				}}
			/>
		</Tabs>
	);
}
