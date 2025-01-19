import { useDynamicStyles } from "@hooks/useDynamicStyles";
import { useSignInWithToken } from "@hooks/useSignInWithToken";
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import { environment } from "@utils/constants";
import React from "react";
import { Alert } from "react-native";

export default function AuthGoogle() {
	const { handleSignIn } = useSignInWithToken();

	const styles = useDynamicStyles((theme) => ({
		buttom: {
			color: theme === "dark" ? "dark" : "light",
		},
	}));

	GoogleSignin.configure({
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		webClientId: environment.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
		offlineAccess: true,
	});

	const handleSubmit = async () => {
		try {
			await GoogleSignin.signOut();
			await GoogleSignin.hasPlayServices();
			const { type, data } = await GoogleSignin.signIn();
			console.error(data);
			if (type === "cancelled")
				throw new Error("Unexpected error in Google OAuth");

			await handleSignIn("google", data.idToken as string);
		} catch (error: any) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.error(error);
				Alert.alert("SIGN_IN_CANCELLED", error.message);
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.error(error);
				Alert.alert("IN_PROGRESS", error.message);
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.error(error);
				Alert.alert("PLAY_SERVICES_NOT_AVAILABLE", error.message);
			} else {
				console.error(error);
				Alert.alert("UNEXPECTED_ERROR", error.message);
			}
		}
	};
	return (
		<GoogleSigninButton
			size={GoogleSigninButton.Size.Standard}
			color={styles.buttom.color as "light" | "dark"}
			onPress={handleSubmit}
		/>
	);
}
