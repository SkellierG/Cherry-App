import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { AuthSupabase } from "@modules/auth/authController";
import { useRouter } from "expo-router";
import { useUser } from "@contexts/user";
import { useConnectivity } from "@contexts/internet";
import DeviceStorage from "@utils/deviceStorage";
//@ts-ignore
import { Profile } from "@types/User";
import { Session, User } from "@supabase/supabase-js";
//@ts-ignore
import { UseGetSessionHook } from "@types/hooks";
import { routes } from "@utils/constants";

export function useGetSession(): UseGetSessionHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { userDispatch } = useUser();
	const { isConnected } = useConnectivity();

	const checkAuthNoInternet = async () => {
		const cachedSession: Session | null = (await DeviceStorage.getItem(
			"sessionData",
		)) as Session | null;
		const cachedUser: User | null = (await DeviceStorage.getItem(
			"userData",
		)) as User | null;
		const cachedProfile: Profile | null = (await DeviceStorage.getItem(
			"profileData",
		)) as Profile | null;

		if (cachedSession && cachedUser && cachedProfile) {
			userDispatch({
				type: "SIGNIN",
				payload: {
					user: cachedUser,
					session: cachedSession,
					isAuthenticated: true,
				},
			});
			if (cachedProfile.is_profiled) {
				userDispatch({
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
				const { session, user, profile } =
					await AuthSupabase.getSessionWithCache();

				userDispatch({
					type: "SIGNIN",
					payload: {
						user,
						session,
						isAuthenticated: true,
					},
				});
				if (profile.is_profiled) {
					userDispatch({
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
