import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { AuthSupabase } from "@modules/auth/authController";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useUser } from "@contexts/user";

export function useSignIn() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { userDispatch } = useUser();

	const handleSignIn = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const { signIn: signInData, profile } =
				await AuthSupabase.signInWithCache(email, password);

			userDispatch({
				type: "SIGNIN",
				payload: {
					user: signInData.user,
					session: signInData.session,
					isAuthenticated: true,
				},
			});

			if (profile.is_profiled) {
				router.replace("/home");
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
