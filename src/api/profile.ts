import { supabase } from "@services/supabase";
import { Alert } from "react-native";
//@ts-ignore
import { IProfileService, Profile, ProfileColumns } from "@types/User";

export class ProfileService implements IProfileService {
	async fetchProfileById(
		userId: string,
		select: ProfileColumns[] | "*" = "*",
	): Promise<Profile> {
		try {
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select(select.toString())
				.eq("id", userId)
				.single();

			if (profileError) throw profileError;

			return { ...(profileData as unknown as Profile) };
		} catch (error: any) {
			Alert.alert("Error fetching profile", error.message);
			console.error(error);
			throw error;
		}
	}

	async fetchProfileByIdAll(userId: string) {
		try {
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();
			if (profileError) throw profileError;
			return { ...(profileData as Profile) };
		} catch (error: any) {
			Alert.alert(error.message);
			console.error(error);
			throw error;
		}
	}

	async updateProfile(
		userId: string,
		updates: Partial<Profile>,
	): Promise<{ success: boolean }> {
		try {
			const { error: updateError } = await supabase
				.from("profiles")
				.update(updates)
				.eq("id", userId)
				.single();

			if (updateError) throw updateError;

			return { success: true };
		} catch (error: any) {
			Alert.alert("Error updating profile", error.message);
			console.error(error);
			throw error;
		}
	}

	async deleteProfile(userId: string): Promise<void> {
		try {
			const { error: deleteError } = await supabase
				.from("profiles")
				.delete()
				.eq("id", userId);

			if (deleteError) throw deleteError;
		} catch (error: any) {
			Alert.alert("Error deleting profile", error.message);
			console.error(error);
			throw error;
		}
	}
}
