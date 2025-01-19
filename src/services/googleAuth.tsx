import React, { ReactNode } from "react";
import {
	GoogleSignin,
	GoogleSigninButton,
	SignInResponse,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@services/supabase";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { environment, routes } from "@utils/constants";
import { useAuth } from "@contexts/auth";
import DeviceStorage from "@utils/deviceStorage";
//@ts-ignore

interface GoogleAuthProps {
	children?: ReactNode;
	color?: "dark" | "light";
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({
	children,
	color = "dark",
}) => {
	const router = useRouter();

	const { authState, authDispatch } = useAuth();

	GoogleSignin.configure({
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		webClientId: environment.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
		offlineAccess: true,
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
					if (error) {
						console.error("Error with id token:", error);
						throw error;
					}

					console.info("data", data);
					const user = data.session.user;

					if (user) {
						const { data: profileData, error: profileError } = await supabase
							.from("profiles")
							.select(
								"id, user_id, is_oauth, is_profiled, name, lastname, avatar_url",
							)
							.eq("user_id", user.id)
							.single();

						if (!profileData || profileError) {
							console.error("Error fetching profiles:", profileError);
							throw profileError;
						}

						if (!profileData.is_oauth) {
							const { error: updateError } = await supabase
								.from("profiles")
								.update({ is_oauth: true })
								.eq("user_id", user.id);

							profileData.is_oauth = true;

							if (updateError) {
								console.error("Error updating profiles:", updateError);
								throw updateError;
							}
						}

						console.info("profile", JSON.stringify(profileData, null, 2));

						authDispatch({
							type: "SIGNIN",
							payload: {
								user: user,
								session: data.session,
								isAuthenticated: true,
							},
						});

						DeviceStorage.setItem("session", data.session);
						DeviceStorage.setItem("user", data.user);
						DeviceStorage.setItem("profile", profileData);

						if (profileData.is_profiled) {
							authDispatch({ type: "PROFILE", payload: profileData });
							router.replace(routes.dashboard.index);
						} else {
							router.push(routes.auth.profile);
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
		} finally {
			console.info("authState", authState);
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
