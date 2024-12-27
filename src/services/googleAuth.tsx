import React, { ReactNode } from "react";
import {
	GoogleSignin,
	GoogleSigninButton,
	SignInResponse,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@utils/supabase";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import environment from "@utils/environment";
import { useUser } from "../contexts/user";

interface GoogleAuthProps {
	children?: ReactNode;
	color?: "dark" | "light";
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({
	children,
	color = "dark",
}) => {
	const router = useRouter();

	const { userDispatch } = useUser();

	GoogleSignin.configure({
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		webClientId: environment.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
	});

	const googleOauth = async (): Promise<void> => {
		try {
			await GoogleSignin.signOut();
			await GoogleSignin.hasPlayServices();
			const userInfo: SignInResponse = await GoogleSignin.signIn();
			if (userInfo.data?.idToken) {
				try {
					const { data, error } = await supabase.auth.signInWithIdToken({
						provider: "google",
						token: userInfo.data.idToken,
					});
					console.log(error, data);
					if (error) {
						throw error;
					}

					const user = data.session.user;

					if (user) {
						// Registrar o actualizar perfil en la base de datos
						const { error: profileError } = await supabase
							.from("profiles")
							.update({
								is_oauth: true,
							})
							.eq("id", user.id);

						if (profileError) {
							console.error("Error updating profiles:", profileError);
							throw profileError;
						}

						userDispatch({
							type: "SIGNIN",
							payload: user,
						});

						// Verificar si el usuario ya tiene un perfil completo
						if (user.user_metadata.isProfiled) {
							userDispatch({
								type: "PROFILE",
							});
							router.replace("/home");
						} else {
							router.replace("/auth/profile");
						}
					} else {
						throw new Error("Unexpected error in Google OAuth");
					}
				} catch (error: any) {
					console.error("OAuth Login Error:", error.message);
					throw error;
				}
			} else {
				throw new Error("No ID token present!");
			}

			//TODO: error handler
		} catch (error: any) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log(error);
				Alert.alert("SIGN_IN_CANCELLED", error.message);
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log(error);
				Alert.alert("IN_PROGRESS", error.message);
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log(error);
				Alert.alert("PLAY_SERVICES_NOT_AVAILABLE", error.message);
			} else {
				console.log(error);
				Alert.alert("UNEXPECTED_ERROR", error.message);
			}
		}
	};

	return (
		<GoogleSigninButton
			size={GoogleSigninButton.Size.Standard}
			color={color}
			onPress={googleOauth}
		/>
	);
};

export default GoogleAuth;
