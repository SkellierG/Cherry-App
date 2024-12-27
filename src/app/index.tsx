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
	const [isProfiled, setIsProfiled] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	//obtener informacion
	useEffect(() => {
		const checkAuth = async (): Promise<void> => {
			const session: FetchSessionResponse = await fetchSession();
			setSessionData(session);
			setIsAuthenticated(
				Boolean(sessionData?.access_token) && Boolean(sessionData?.user),
			);
			setIsProfiled(Boolean(sessionData?.user.user_metadata?.isProfiled));

			setIsLoading(false);
		};

		checkAuth();
	}, [sessionData?.access_token, sessionData?.user]);

	//actualizar contexto
	useEffect(() => {
		if (!isLoading) {
			if (isAuthenticated) {
				userDispatch({
					type: "SIGNIN",
					//@ts-ignore
					payload: sessionData.user,
				});
				if (isProfiled) {
					userDispatch({ type: "PROFILE" });
					router.replace("/home");
				}
				if (
					sessionData?.user.user_metadata.isOauth &&
					!sessionData?.user.user_metadata.isProfiled
				) {
					router.replace("/auth/profile");
				}
				router.replace("/auth/sign-up");
			} else {
				userDispatch({ type: "SIGNOUT" });
				router.replace("/auth/sign-in");
			}
		}
	}, [
		isAuthenticated,
		isLoading,
		isProfiled,
		router,
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
