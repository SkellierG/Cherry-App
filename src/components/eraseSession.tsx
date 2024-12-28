import React from "react";
import { Button, View } from "tamagui";
import { supabase } from "@utils/supabase";
import { useRouter } from "expo-router";
import { useUser } from "@contexts/user";
import { Alert } from "react-native";

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
					id: undefined,
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

			userDispatch({ type: "SIGNOUT" });
			Alert.alert("Success", "You have been logged out");
			router.replace("/auth/sign-in");
		} catch (error: any) {
			console.error("Logout Error:", error.message);
			Alert.alert("Error", error.message || "An unexpected error occurred");
		}
	};

	return (
		<View>
			<Button onPress={handleLogout}>erase Session</Button>
		</View>
	);
};

export default EraseSession;
