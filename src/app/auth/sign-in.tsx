import { View } from "tamagui";
import React from "react";
import DummyScreen from "@screens/dummy";

export default function SignInScreen() {
	return (
		<View>
			<DummyScreen screenName="sign-in" buttonFunction={null} />
		</View>
	);
}
