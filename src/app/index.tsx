import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import "@/global.css";
import LoadingScreen from "@screens/Loading";
import { supabase } from "@utils/supabase";
import { View } from "react-native";
import { useUser } from "@contexts/user";
import { FetchSessionResponse } from "../types/user";

export default function Index() {
	const { userDispatch } = useUser();
	const [sessionData, setSessionData] = useState<FetchSessionResponse>(null);

	const router = useRouter();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [profileData, setProfileData] = useState({
		is_oauth: false,
		is_profiled: false,
	});

	const [isLoading, setIsLoading] = useState(true);

	//obtener informacion
	useEffect(() => {
		const checkAuth = async (): Promise<void> => {
			try {
				const session: FetchSessionResponse = await fetchSession();
				setSessionData(session);

				if (session?.access_token && session?.user) {
					setIsAuthenticated(true);
					const { data: profile, error } = await supabase
						.from("profiles")
						.select("is_oauth, is_profiled")
						.eq("id", session.user.id)
						.single();

					if (error) throw error;
					setProfileData(profile);
				} else {
					setIsAuthenticated(false);
					console.info("not session founded in supabase");
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	//actualizar contexto
	useEffect(() => {
		if (!isLoading) {
			if (isAuthenticated) {
				console.info(sessionData);
				console.info(profileData);

				userDispatch({
					type: "SIGNIN",
					//@ts-ignore
					payload: sessionData.user,
				});
				if (profileData.is_profiled) {
					userDispatch({ type: "PROFILE" });
					router.replace("/home");
					return;
				}
				if (profileData.is_oauth) {
					router.replace("/auth/profile");
					return;
				}
				console.error("something went wrong");
				router.replace("/auth/sign-in");
				return;
			} else {
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
		await new Promise((resolve) => setTimeout(resolve, 5000)); //eliminar despues

		const { data, error } = await supabase.auth.getSession();
		if (error) throw error;
		return data.session;
	} catch (error) {
		console.error("fetchSession", error);
		//TODO: error handler
		return null;
	}
};
