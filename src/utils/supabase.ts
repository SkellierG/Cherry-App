import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import environment from "./environment";

const supabaseUrl = environment.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = environment.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(
	supabaseUrl,
	supabaseAnonKey,
	{
		auth: {
			storage: AsyncStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	},
);
