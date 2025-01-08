import { Platform } from "react-native";
import { Linking } from "react-native";

const getBaseAddress = async () => {
	if (Platform.OS === "web") {
		const { protocol, hostname, port } = window.location;
		return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
	} else {
		const initialUrl = await Linking.getInitialURL();
		return initialUrl || "Cherry=App://"; // Deep link base por defecto
	}
};

export const constants = {
	baseAdress: getBaseAddress().then((adress) => adress),
};

console.info(JSON.stringify(constants, null, 2));

export const environment = {
	EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "NULL",
	EXPO_PUBLIC_SUPABASE_ANON_KEY:
		process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "NULL",
	EXPO_PUBLIC_GOOGLE_CLIENT_ID:
		process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "NULL",
};

console.log(JSON.stringify(environment, null, 2));
