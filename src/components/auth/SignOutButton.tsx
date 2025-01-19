import React from "react";
import { Button, View } from "tamagui";
import { supabase } from "@services/supabase";
import { useRouter } from "expo-router";
import { useAuth } from "@contexts/auth";
import { Alert } from "react-native";
import { routes } from "@utils/constants";
import { AuthSupabase } from "@modules/auth/authController";
import i18n from "@services/translations";

const SignOutButton: React.FC = () => {
	const { authDispatch } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			const { data } = await supabase.auth.getSession();
			const user = data.session?.user;

			if (!user) throw new Error("No user is currently logged in");

			const { success } = await AuthSupabase.signOutWithClearCache();
			if (!success) throw new Error("signOutFailed");

			authDispatch({ type: "SIGNOUT" });

			Alert.alert("Success", "You have been logged out");
			router.replace(routes.auth.sign_in);
		} catch (error: any) {
			console.error("Logout Error:", error.message);
			Alert.alert("Error", error.message || "An unexpected error occurred");
		}
	};

	return (
		<View>
			<Button onPress={handleLogout}>{i18n.t("auth.Sign_out")}</Button>
		</View>
	);
};

export default SignOutButton;
