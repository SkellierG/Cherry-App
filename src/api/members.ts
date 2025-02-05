import { supabase } from "@services/supabase";
//@ts-ignore
import { Profile, Role, Member } from "@types/Auth";

export class MembersService {
	async fetchRolesByCompanyId(companyId: string): Promise<Role[]> {
		if (!companyId) throw new Error("Invalid company_id provided");
		const { data, error } = await supabase
			.from("roles")
			.select("*")
			.eq("company_id", companyId)
			.order("priority", { ascending: true })
			.setHeader("Accept", "application/json");
		if (error) throw error;
		return [...data];
	}

	async fetchMembersWithRolesByCompanyId(companyId: string): Promise<Member[]> {
		if (!companyId) throw new Error("Invalid company_id provided");

		const { data: rolesData, error: rolesError } = await supabase
			.from("roles")
			.select("*, user_roles(*)")
			.eq("company_id", companyId)
			.order("priority", { ascending: true })
			.setHeader("Accept", "application/json");
		if (rolesError) throw rolesError;
		if (!rolesData) return [];

		const membersMap: Record<string, Member> = {};
		rolesData.forEach((role: any) => {
			if (!role.user_roles || role.user_roles.length === 0) return;
			role.user_roles.forEach((ur: any) => {
				const userId = ur.user_id;
				if (!userId) return;
				if (!membersMap[userId]) {
					membersMap[userId] = {
						profile: {
							id: "",
							user_id: userId,
							avatar_url: null,
							is_profiled: false,
							is_oauth: false,
							name: "",
							lastname: "",
						},
						roles: [],
					};
				}
				membersMap[userId].roles.push({
					id: role.id,
					name: role.name,
					priority: role.priority,
					permissions: role.permissions,
					company_id: companyId,
				});
			});
		});

		console.log("membersMap", membersMap);

		const userIds = Object.keys(membersMap);
		if (userIds.length === 0) return [];

		console.log("userIds", userIds);

		const { data: profilesData, error: profilesError } = await supabase
			.from("profiles")
			.select("*")
			.in("user_id", userIds)
			.setHeader("Accept", "application/json");
		if (profilesError) throw profilesError;

		console.log("profilesData", profilesData);

		const profilesMap: Record<string, any> = {};
		profilesData.forEach((profile: any) => {
			profilesMap[profile.user_id] = profile;
		});

		console.log("profilesMap", profilesMap);

		const members: Member[] = Object.keys(membersMap).map((userId) => {
			console.log("userId", userId);

			console.log("profilesMap", profilesMap);
			const member = membersMap[userId];
			const profile = profilesMap[userId];
			console.log("memeber-profile", { member, profile });
			if (profile) {
				member.profile = {
					id: profile.id,
					public_id: profile.public_id,
					user_id: profile.user_id,
					name: profile.name,
					lastname: profile.lastname,
					avatar_url: profile.avatar_url,
					is_oauth: profile.is_oauth,
					is_profiled: profile.is_profiled,
				};
			}
			return member;
		});

		return [...members];
	}
}
