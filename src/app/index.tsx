import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import "@/global.css";
import LoadingScreen from "@screens/Loading";
import { supabase } from "@utils/supabase";
import { View } from "react-native";
import { useUser } from "@contexts/user";

export default function Index() {
	const userContext = useUser();

	const router = useRouter();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			const userToken = await checkPreviusAuth();
			setIsAuthenticated(Boolean(userToken));
			setIsLoading(false);
		};

		checkAuth();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			if (isAuthenticated) {
				router.replace("/home");
			} else {
				router.replace("/auth/sign-in");
			}
		}
	}, [isAuthenticated, isLoading]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return <View />;
}

const checkPreviusAuth = async () => {
	const { data, error } = await supabase.auth.getSession();

	if (data.session) {
		return data.session?.access_token;
	}
};
