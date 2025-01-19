import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { AuthSupabase } from "@modules/auth/authController";
import { useRouter } from "expo-router";
import { useAuth } from "@contexts/auth";
import { useConnectivity } from "@contexts/internet";
import DeviceStorage from "@utils/deviceStorage";
//@ts-ignore
import { Jwt, Profile } from "@types/Auth";
import { Session, User } from "@supabase/supabase-js";
//@ts-ignore
import { UseGetSessionHook } from "@types/hooks";
import { routes } from "@utils/constants";

export function useGetSession(): UseGetSessionHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { authDispatch } = useAuth();
	const { isConnected } = useConnectivity();

	const checkAuthNoInternet = () => {
		const cachedSession: Session | null = JSON.parse(
			(DeviceStorage.getItem("session", "string") as string) || "null",
		);
		const cachedUser: User | null = JSON.parse(
			(DeviceStorage.getItem("user", "string") as string) || "null",
		);
		const cachedProfile: Profile | null = JSON.parse(
			(DeviceStorage.getItem("profile", "string") as string) || "null",
		);
		const cachedJwt: Jwt | null = JSON.parse(
			(DeviceStorage.getItem("jwt", "string") as string) || "null",
		);

		if (cachedSession && cachedUser && cachedProfile && cachedJwt) {
			authDispatch({
				type: "SIGNIN",
				payload: {
					user: cachedUser,
					session: cachedSession,
					isAuthenticated: true,
				},
			});
			authDispatch({
				type: "JWT",
				payload: cachedJwt,
			});

			authDispatch({
				type: "ROLES",
				payload: cachedJwt.roles,
			});
			authDispatch({
				type: "COMPANIES",
				payload: cachedJwt.joined_companies,
			});

			if (cachedProfile.is_profiled) {
				authDispatch({
					type: "PROFILE",
					payload: cachedProfile,
				});
				router.dismiss();
				router.replace(routes.dashboard.index);
			} else if (cachedProfile.is_oauth) {
				router.replace(routes.auth.sign_in);
				router.push(routes.auth.profile);
			} else {
				router.replace(routes.auth.sign_in);
				throw new Error("Something went wrong");
			}
		} else {
			throw new Error("No session saved in cache");
		}
	};

	const handleGetSession = async () => {
		try {
			setIsLoading(true);
			if (!isConnected) {
				checkAuthNoInternet();
			} else {
				const { session, user, profile, jwt } =
					await AuthSupabase.getSessionWithCache();

				authDispatch({
					type: "SIGNIN",
					payload: {
						user,
						session,
						isAuthenticated: true,
					},
				});

				authDispatch({
					type: "JWT",
					payload: jwt,
				});

				if (profile.is_profiled) {
					authDispatch({
						type: "PROFILE",
						payload: profile,
					});
					router.dismiss();
					router.replace(routes.dashboard.index);
				} else if (profile.is_oauth) {
					router.replace(routes.auth.sign_in);
					router.push(routes.auth.profile);
				} else {
					router.dismiss();
					router.replace(routes.auth.sign_in);
					throw new Error("Something went wrong");
				}
			}
		} catch (error: any) {
			router.dismiss();
			router.replace(routes.auth.sign_in);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleGetSession };
}
