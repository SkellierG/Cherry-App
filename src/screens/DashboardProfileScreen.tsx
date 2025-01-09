import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import EraseSession from "@components/ErsaseSessionTest";
import ProfileShow from "@components/ProfileShow";
import PullToRefresh from "@components/PullToRefresh";
import { useUser } from "@contexts/user";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import { AuthSupabase } from "@modules/auth/authController";
import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, Alert } from "react-native";

type ProfileScreenProps = {
	name?: string;
	lastname?: string;
	email?: string;
	imageSource?: { uri: string };
};

const DashboardProfileScreen: React.FC<ProfileScreenProps> = ({
	name,
	lastname,
	email,
	imageSource,
}) => {
	const styles = useDynamicStyles((theme) => ({
		view: {
			flex: 1,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
		},
		text: {
			textAlign: "center",
			fontWeight: "bold",
		},
		bottom: {
			paddingBottom: 30,
			marginBottom: 100,
		},
		content: {
			flex: 1,
			justifyContent: "space-between",
		},
	}));

	const { userState } = useUser();

	const [finalName, setFinalName] = useState(
		name || userState.profile?.name || "",
	);

	const [finalLastname, setFinalLastname] = useState(
		lastname || userState.profile?.lastname || "",
	);

	let [finalEmail, setFinalEmail] = useState(
		email || userState.user?.email || "",
	);

	let [finalImageSource, setFinalImageSource] = useState(
		imageSource ||
			(userState.profile?.avatar_url
				? { uri: userState.profile?.avatar_url }
				: undefined),
	);

	const onRefresh = async () => {
		try {
			const { user, profile } = await AuthSupabase.getSessionWithCache();

			setFinalName(profile.name as string);
			setFinalLastname(profile.lastname as string);
			setFinalEmail(user.email as string);
			setFinalImageSource({ uri: profile.avatar_url as string });
		} catch (error: any) {
			Alert.alert("Error fetching session", error.message);
			console.error(error);
		}
	};

	return (
		<PullToRefresh onRefreshCallback={onRefresh}>
			<KeyboardAvoidingView
				style={styles.view}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View style={styles.content}>
					<ProfileShow
						name={`${finalName} ${finalLastname}`}
						email={finalEmail}
						imageSource={finalImageSource}
					>
						<EraseSession />
					</ProfileShow>
				</View>
			</KeyboardAvoidingView>
		</PullToRefresh>
	);
};

export default DashboardProfileScreen;
