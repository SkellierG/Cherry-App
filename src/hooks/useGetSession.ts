import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { AuthSupabase } from "@modules/auth/authController";
import { useRouter } from "expo-router";
import { useAuth } from "@contexts/auth";
import { useConnectivity } from "@contexts/internet";
import DeviceStorage from "@utils/deviceStorage";
//@ts-ignore
import { Company, Jwt, Profile, Role } from "@types/Auth";
import { Session, User } from "@supabase/supabase-js";
//@ts-ignore
import { UseGetSessionHook } from "@types/hooks";
import { routes } from "@utils/constants";

const navigateSafely = async (
	router: any,
	route: string,
	options?: any,
	maxAttempts: number = 3,
	delay: number = 1000,
): Promise<void> => {
	let attempts = 0;

	return new Promise(async (resolve) => {
		while (attempts < maxAttempts) {
			try {
				if (router && router.replace) {
					router.replace(route, options);
					resolve();
					return;
				} else {
					throw new Error("Router not ready for navigation");
				}
			} catch (error) {
				attempts++;
				if (attempts >= maxAttempts) {
					console.warn(
						`Navigation failed after ${maxAttempts} attempts: ${error}`,
					);
					resolve(); // Resolve after all attempts fail
				} else {
					await new Promise((r) => setTimeout(r, delay)); // Wait before retrying
				}
			}
		}
	});
};

export function useGetSession(): UseGetSessionHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { authDispatch } = useAuth();
	const { isConnected } = useConnectivity();

	const checkAuthNoInternet = async (): Promise<void> => {
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
		const cachedCompanies: { companies: Company[]; roles: Role[] } | null =
			JSON.parse(
				(DeviceStorage.getItem("companies", "string") as string) || "null",
			);

		if (
			cachedSession &&
			cachedUser &&
			cachedProfile &&
			cachedJwt &&
			cachedCompanies
		) {
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
				payload: cachedCompanies.roles,
			});
			authDispatch({
				type: "COMPANIES",
				payload: cachedCompanies.companies.map(
					(company) => company?.id || null,
				),
			});

			if (cachedProfile.is_profiled) {
				authDispatch({
					type: "PROFILE",
					payload: cachedProfile,
				});
				await navigateSafely(router, routes.dashboard.index);
			} else if (cachedProfile.is_oauth) {
				await navigateSafely(router, routes.auth.sign_in);
				await navigateSafely(router, routes.auth.profile);
			} else {
				await navigateSafely(router, routes.auth.sign_in);
				throw new Error("Something went wrong");
			}
		} else {
			throw new Error("No session saved in cache");
		}
	};

	const handleGetSession = async (): Promise<void> => {
		try {
			setIsLoading(true);
			if (!isConnected) {
				await checkAuthNoInternet();
			} else {
				const { session, user, profile, jwt, companies, roles } =
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
				authDispatch({
					type: "ROLES",
					payload: roles,
				});
				authDispatch({
					type: "COMPANIES",
					payload: companies.map((company) => company?.id || null),
				});

				if (profile.is_profiled) {
					authDispatch({
						type: "PROFILE",
						payload: profile,
					});
					await navigateSafely(router, routes.dashboard.index);
				} else if (profile.is_oauth) {
					await navigateSafely(router, routes.auth.sign_in);
					await navigateSafely(router, routes.auth.profile);
				} else {
					await navigateSafely(router, routes.auth.sign_in);
					throw new Error("Something went wrong");
				}
			}
		} catch (error: any) {
			await navigateSafely(router, routes.auth.sign_in);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleGetSession };
}
