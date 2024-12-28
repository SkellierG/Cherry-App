import { View } from "tamagui";
import React from "react";
import DummyScreen from "@screens/dummy";
import EraseSession from "@components/eraseSession";

export default function Profile() {
	return (
		<View>
			<DummyScreen screenName="profile" />
			<EraseSession />
		</View>
	);
}
