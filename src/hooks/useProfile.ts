import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@contexts/auth";
import { ProfileService } from "@api/profile";
import DeviceStorage from "@utils/deviceStorage";
import { User } from "@supabase/supabase-js";
//@ts-ignore
import { Profile } from "@types/Auth";
//@ts-ignore
import { UseProfileHook } from "@types/hooks";
import { routes } from "@utils/constants";

export function useProfile(): UseProfileHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { authState, authDispatch } = useAuth();

	const handleProfile = async (
		name: string,
		lastname: string,
		avatar_url: string | null = authState.user?.user_metadata.avatar_url,
	) => {
		setIsLoading(true);
		try {
			const userData: User | null = JSON.parse(
				(DeviceStorage.getItem("user", "string") as string) || "null",
			);
			const profileData: Profile | null = JSON.parse(
				(DeviceStorage.getItem("profile", "string") as string) || "null",
			);
			const profileService = new ProfileService();

			if (!(userData && profileData))
				throw new Error("use or profile not exists in deviceStorage");

			const newProfile = {
				...profileData,
				name,
				lastname,
				avatar_url,
				is_profiled: true,
			};

			await profileService.updateProfile(userData.id, newProfile);

			authDispatch({
				type: "PROFILE",
				payload: newProfile,
			});

			DeviceStorage.setItem("profile", newProfile);
			router.dismiss();
			router.replace(routes.dashboard.index);
		} catch (error: any) {
			Alert.alert("Profile Error", error.message);
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleProfile };
}
