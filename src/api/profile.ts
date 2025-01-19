import { supabase } from "@services/supabase";
//@ts-ignore
import { IProfileService, Profile, ProfileColumns } from "@types/Auth";

export class ProfileService implements IProfileService {
	async fetchProfileById(
		userId: string,
		select: ProfileColumns[] | "*" = "*",
	): Promise<Partial<Profile>> {
		try {
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select(select === "*" ? "*" : select.join(","))
				.eq("user_id", userId)
				.single()
				.setHeader("Accept", "application/json");

			if (profileError) throw profileError;

			return { ...(profileData[0] as unknown as Partial<Profile>) };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async fetchProfileByIdAll(userId: string): Promise<Profile> {
		try {
			const profileData = await this.fetchProfileById(userId);
			return profileData as Profile;
		} catch (error: any) {
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
				.eq("user_id", userId)
				.single()
				.setHeader("Accept", "application/json");

			if (updateError) throw updateError;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async deleteProfile(userId: string): Promise<void> {
		try {
			const { error: deleteError } = await supabase
				.from("profiles")
				.delete()
				.eq("user_id", userId)
				.setHeader("Accept", "application/json");

			if (deleteError) throw deleteError;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}
