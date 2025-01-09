import LoadingScreen from "@screens/LoadingScreen";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useGetSession } from "@hooks/useGetSession";

export default function Index() {
	const { isLoading, handleGetSession } = useGetSession();

	useEffect(() => {
		const checkAuth = async () => {
			await handleGetSession();
		};
		checkAuth();
	}, [handleGetSession]);

	if (isLoading) {
		return <LoadingScreen />;
	}
	return <View />;
}
