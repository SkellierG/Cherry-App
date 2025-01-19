import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { AuthSupabase } from "@modules/auth/authController";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@contexts/auth";
//@ts-ignore
import { UseSignInHook } from "@types/hooks";
import { routes } from "@utils/constants";

export function useSignIn(): UseSignInHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { authDispatch } = useAuth();

	const handleSignIn = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const {
				signIn: signInData,
				profile,
				jwt,
			} = await AuthSupabase.signInWithCache(email, password);

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
