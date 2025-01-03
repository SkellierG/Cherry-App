import { View } from "tamagui";
import React from "react";
import DummyScreen from "@screens/dummy";
import { supabase } from "@utils/supabase";
import { useRouter } from "expo-router";
import EraseSession from "@components/eraseSession";
import PullToRefresh from "@components/PullToRefresh";

export default function HomeScreen() {
	return (
		<PullToRefresh>
			<DummyScreen screenName="Settings" />
			<EraseSession />
		</PullToRefresh>
	);
}
