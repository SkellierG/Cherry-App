import React from "react";
import { Button, View } from "tamagui";
import { supabase } from "@services/supabase";
import { useRouter } from "expo-router";
import { useUser } from "@contexts/auth";
import { Alert } from "react-native";
import DeviceStorage from "@utils/deviceStorage";
import { routes } from "@utils/constants";

const EraseSession: React.FC = () => {
	const { userState, userDispatch } = useUser();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			const { data } = await supabase.auth.getSession();
			const user = data.session?.user;

			console.log(userState);
			if (!user) throw new Error("No user is currently logged in");

			const { error: signOutError } = await supabase.auth.signOut();
			if (signOutError) throw signOutError;

			const { error: profileError } = await supabase
				.from("profiles")
				.update({
					id: user.id,
					updated_at: undefined,
					avatar_url: undefined,
					name: undefined,
					lastname: undefined,
					is_oauth: false,
					is_profiled: false,
				})
				.eq("id", user.id);

			if (profileError) {
				console.error("Error updating profile:", profileError);
				throw profileError;
			}

			await DeviceStorage.removeItem("sessionData");
			await DeviceStorage.removeItem("userData");
			await DeviceStorage.removeItem("profileData");

			userDispatch({ type: "SIGNOUT" });
			Alert.alert("Success", "You have been logged out");
			router.replace(routes.auth.sign_in);
		} catch (error: any) {
			console.error("Logout Error:", error.message);
			Alert.alert("Error", error.message || "An unexpected error occurred");
			await DeviceStorage.removeItem("sessionData");
			await DeviceStorage.removeItem("userData");
			await DeviceStorage.removeItem("profileData");
			router.replace(routes.auth.sign_in);
		}
	};

	return (
		<View>
			<Button onPress={handleLogout}>erase Session</Button>
		</View>
	);
};

export default EraseSession;
