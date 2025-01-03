import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import ProfileComponent from "@components/profile";
import { useUser } from "@contexts/user";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import React from "react";
import { Dimensions, View } from "react-native";

export default function ProfileScreen() {
	const styles = useDynamicStyles((theme) => ({
		view: {
			height: Dimensions.get("window").height,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
		},
	}));
	const { userState } = useUser();
	return (
		<View style={styles.view}>
			<ProfileComponent
				name={
					`${userState.profile?.name} ${userState.profile?.lastname}` ||
					undefined
				}
				email={userState.user?.email}
				imageSource={{ uri: userState.profile?.avatar_url }}
			/>
		</View>
	);
}
