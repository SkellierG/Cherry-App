import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { AuthSupabase } from "@modules/auth/authController";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@contexts/auth";
//@ts-ignore
import { UseSignInWithTokenHook } from "@types/hooks";
import { routes } from "@utils/constants";

export function useSignInWithToken(): UseSignInWithTokenHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { authDispatch } = useAuth();

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
			const {
				signIn: signInData,
				profile,
				jwt,
			} = await AuthSupabase.signInWithIdTokendWithCache(
				provider,
				token,
				access_token,
				nonce,
			);

			authDispatch({
				type: "SIGNIN",
				payload: {
					user: signInData.user,
					session: signInData.session,
					isAuthenticated: true,
				},
			});

			authDispatch({
				type: "JWT",
				payload: jwt,
			});

			authDispatch({
				type: "ROLES",
				payload: jwt.roles,
			});
			authDispatch({
				type: "COMPANIES",
				payload: jwt.joined_companies,
			});

			if (profile.is_profiled) {
				authDispatch({ type: "PROFILE", payload: profile });
				router.dismiss();
				router.replace(routes.dashboard.index);
			} else {
				router.push(routes.auth.profile);
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
