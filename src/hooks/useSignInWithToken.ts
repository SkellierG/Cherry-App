import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { AuthSupabase } from "@modules/auth/authController";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useUser } from "@contexts/user";
//@ts-ignore
import { UseSignInWithTokenHook } from "@types/hooks";

export function useSignInWithToken(): UseSignInWithTokenHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { userDispatch } = useUser();

	const handleSignIn = async (
		provider:
			| "google"
			| "apple"
			| "azure"
			| "facebook"
			| "kakao"
			| (string & {}),
		token: string,
		access_token?: string,
		nonce?: string,
	) => {
		setIsLoading(true);
		try {
			const { signIn: signInData, profile } =
				await AuthSupabase.signInWitIdTokendWithCache(
					provider,
					token,
					access_token,
					nonce,
				);

			userDispatch({
				type: "SIGNIN",
				payload: {
					user: signInData.user,
					session: signInData.session,
					isAuthenticated: true,
				},
			});

			if (profile.is_profiled) {
				userDispatch({ type: "PROFILE", payload: profile });
				router.replace("/dashboard");
			} else {
				router.replace("/auth/profile");
			}
		} catch (error: any) {
			Alert.alert("Sign-In Error", error.message);
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleSignIn };
}
