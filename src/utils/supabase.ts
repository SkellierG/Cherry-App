import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import environment from "./environment";
import DeviceStorage from "./deviceStorage";

const supabaseUrl = environment.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = environment.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(
	supabaseUrl,
	supabaseAnonKey,
	{
		auth: {
			storage: DeviceStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	},
);
