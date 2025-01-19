import React from "react";
import { Button, View } from "tamagui";
import { supabase } from "@services/supabase";
import { useRouter } from "expo-router";
import { useAuth } from "@contexts/auth";
import { Alert } from "react-native";
import DeviceStorage from "@utils/deviceStorage";
import { routes } from "@utils/constants";

const EraseSession: React.FC = () => {
	const { authDispatch } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			const { data } = await supabase.auth.getSession();
			const user = data.session?.user;

			if (!user) throw new Error("No user is currently logged in");

			const { error: signOutError } = await supabase.auth.signOut();
			if (signOutError) throw signOutError;

			const { error: profileError } = await supabase
				.from("profiles")
				.update({
					user_id: undefined,
					updated_at: undefined,
					avatar_url: undefined,
					name: undefined,
					lastname: undefined,
					is_oauth: false,
					is_profiled: false,
				})
				.eq("user_id", user.id);

			if (profileError) {
				console.error("Error updating profile:", profileError);
				throw profileError;
			}

			DeviceStorage.removeItem("session");
			DeviceStorage.removeItem("user");
			DeviceStorage.removeItem("profile");

			authDispatch({ type: "SIGNOUT" });
			Alert.alert("Success", "You have been logged out");
			router.replace(routes.auth.sign_in);
		} catch (error: any) {
			console.error("Logout Error:", error.message);
			Alert.alert("Error", error.message || "An unexpected error occurred");
			DeviceStorage.removeItem("session");
			DeviceStorage.removeItem("user");
			DeviceStorage.removeItem("profile");
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
