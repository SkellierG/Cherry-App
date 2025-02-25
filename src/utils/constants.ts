import { Platform } from "react-native";
import { Linking } from "react-native";

const getBaseAddress = async () => {
	if (Platform.OS === "web") {
		const { protocol, hostname, port } = window.location;
		return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
	} else {
		const initialUrl = await Linking.getInitialURL();
		return initialUrl || "Cherry-App://";
	}
};

export const constants = {
	baseAdress: getBaseAddress().then((adress) => adress),
};

export const environment = {
	EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "NULL",
	EXPO_PUBLIC_SUPABASE_ANON_KEY:
		process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "NULL",
	EXPO_PUBLIC_GOOGLE_CLIENT_ID:
		process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "NULL",
};

export const routes = {
	auth: {
		sign_in: "/auth/sign-in" as "/auth/sign-in",
		sign_up: "/auth/sign-up" as "/auth/sign-up",
		profile: "/auth/profile" as "/auth/profile",
		companies: "/auth/companies" as "/auth/companies",
	},
	dashboard: {
		index: "/dashboard/company" as "/dashboard/company",
		notifications: "/dashboard/notifications" as "/dashboard/notifications",
		profile: "/dashboard/profile" as "/dashboard/profile",
	},
};

console.log(JSON.stringify({ environment, routes, constants }, null, 2));
