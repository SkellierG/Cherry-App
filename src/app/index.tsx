import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import "../../global.css";
import LoadingScreen from "@screens/Loading";
import { supabase } from "@utils/supabase";
import { Alert, View } from "react-native";
import { useUser } from "@contexts/user";
import { FetchSessionResponse } from "../types/users";
import DeviceStorage from "@utils/deviceStorage";
import { useConnectivity } from "@contexts/internet";

export default function Index() {
	const { userDispatch } = useUser();
	const { isConnected } = useConnectivity();
	const [sessionData, setSessionData] = useState<FetchSessionResponse>(null);
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [profileData, setProfileData] = useState({
		id: null,
		is_oauth: false,
		is_profiled: false,
		name: null,
		lastname: null,
		avatar_url: null,
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async (): Promise<void> => {
			try {
				const session: FetchSessionResponse = await fetchSession();
				setSessionData(session);

				if (session?.access_token && session?.user) {
					setIsAuthenticated(true);
					const { data: profile, error } = await supabase
						.from("profiles")
						.select("id, is_oauth, is_profiled, name, lastname, avatar_url")
						.eq("id", session.user.id)
						.single();

					if (error) throw error;
					setProfileData(profile);

					await DeviceStorage.setItem("sessionData", JSON.stringify(session));
					await DeviceStorage.setItem("userData", JSON.stringify(session.user));
					await DeviceStorage.setItem("profileData", JSON.stringify(profile));
				} else {
					setIsAuthenticated(false);
					console.info("No session found in Supabase");
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		const checkAuthNoInternet = async () => {
			const cachedSession: string | null =
				await DeviceStorage.getItem("sessionData");
			const cachedProfile: string | null =
				await DeviceStorage.getItem("profileData");

			if (cachedSession && cachedProfile) {
				setSessionData(JSON.parse(cachedSession));
				setProfileData(JSON.parse(cachedProfile));
				setIsAuthenticated(true);
				console.log(sessionData, profileData, isAuthenticated);
			} else {
				setIsAuthenticated(false);
				console.log(isAuthenticated);
			}
			setIsLoading(false);
		};

		if (!isConnected) {
			checkAuthNoInternet();
		} else {
			checkAuth();
		}
	}, [isAuthenticated, isConnected, profileData, sessionData]);

	// Actualizar el contexto
	useEffect(() => {
		if (!isLoading) {
			if (isAuthenticated) {
				console.info(sessionData);
				console.info(profileData);

				userDispatch({
					type: "SIGNIN",
					payload: {
						//@ts-ignore
						user: sessionData.user,
						session: sessionData,
						isAuthenticated: true,
					},
				});
				if (profileData.is_profiled) {
					userDispatch({
						type: "PROFILE",
						payload: profileData,
					});
					router.replace("/home");
					return;
				}
				if (profileData.is_oauth) {
					router.replace("/auth/profile");
					return;
				}
				Alert.alert("dev:SOMETHING WENT GRONG");
				console.error("Something went wrong");
				router.replace("/auth/sign-in");
				return;
			} else {
				Alert.alert("dev: NO SESSION FOUNDED");
				userDispatch({ type: "SIGNOUT" });
				router.replace("/auth/sign-in");
				return;
			}
		}
	}, [
		isAuthenticated,
		isLoading,
		profileData,
		profileData.is_oauth,
		profileData.is_profiled,
		router,
		sessionData,
		sessionData?.user,
		userDispatch,
	]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return <View />;
}

const fetchSession = async (): Promise<FetchSessionResponse> => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 5000)); // Eliminar después

		const { data, error } = await supabase.auth.getSession();
		if (error) throw error;
		return data.session;
	} catch (error) {
		console.error("fetchSession", error);
		//TODO: error handler
		return null;
	}
};
