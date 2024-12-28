import { View } from "react-native";
import React from "react";
import GoogleAuth from "@services/googleAuth";
import SignInScreen from "@/src/screens/signIn";

export default function SignIn() {
	return (
		<View className="bg-red-50 h-screen">
			<SignInScreen />
			<View className="flex-1 justify-top items-center mt-5">
				<GoogleAuth />
			</View>
		</View>
	);
}
