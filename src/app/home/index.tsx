import { View } from "tamagui";
import React from "react";
import DummyScreen from "@screens/dummy";
import { supabase } from "@utils/supabase";
import { useRouter } from "expo-router";

export default function HomeScreen() {
	const router = useRouter();
	const signout = () => {
		supabase.auth.signOut();
		router.replace("/auth/sign-in");
		console.log("cerrar sesion");
	};

	return (
		<View className=" bg-primary">
			<DummyScreen
				screenName="home"
				buttonTitle="cerrar sesion"
				buttonFunction={signout}
			/>
		</View>
	);
}
