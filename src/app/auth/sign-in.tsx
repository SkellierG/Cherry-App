import { View } from "tamagui";
import React from "react";
import DummyScreen from "@screens/dummy";
import GoogleAuth from "@/src/services/googleAuth";

export default function SignInScreen() {
	return (
		<View>
			<DummyScreen screenName="sign-in" />
			<GoogleAuth />
		</View>
	);
}
