import SignUpScreen from "@screens/signUp";
import GoogleAuth from "@services/googleAuth";
import React from "react";
import { View } from "react-native";

export default function SignUp() {
	return (
		<View className="bg-default h-screen">
			<SignUpScreen />
			<View className="flex-1 justify-top items-center mt-5">
				<GoogleAuth />
			</View>
		</View>
	);
}
