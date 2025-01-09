import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useUser } from "@contexts/user";
import { ProfileService } from "@api/profile";
import DeviceStorage from "@utils/deviceStorage";
import { User } from "@supabase/supabase-js";
//@ts-ignore
import { Profile } from "@types/User";
//@ts-ignore
import { UseProfileHook } from "@types/hooks";
import { routes } from "@utils/constants";

export function useProfile(): UseProfileHook {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { userState, userDispatch } = useUser();

	const handleProfile = async (
		name: string,
		lastname: string,
		avatar_url: string | null = userState.user?.user_metadata.avatar_url,
	) => {
		setIsLoading(true);
		try {
			const userData: User = JSON.parse(
				(await DeviceStorage.getItem("userData")) as string,
			) as User;
			const profileData: Profile = JSON.parse(
				(await DeviceStorage.getItem("profileData")) as string,
			) as Profile;
			const profileService = new ProfileService();

			const newProfile = {
				...profileData,
				name,
				lastname,
				avatar_url,
				is_profiled: true,
			};

			await profileService.updateProfile(userData.id, newProfile);

			userDispatch({
				type: "PROFILE",
				payload: newProfile,
			});

			DeviceStorage.setItem("profileData", JSON.stringify(newProfile));
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
