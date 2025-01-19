import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "@utils/constants";
import { supabaseDeviceStorage } from "@utils/deviceStorage";

const supabaseUrl = environment.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = environment.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(
	supabaseUrl,
	supabaseAnonKey,
	{
		auth: {
			storage: supabaseDeviceStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	},
);
