import { supabase } from "@services/supabase";
//@ts-ignore
import { Company, CompanyColumns, ICompanyService, Role } from "@types/Auth";

export class CompanyService implements ICompanyService {
	async fetchCompanyById(
		companyId: string[],
		select: CompanyColumns[] | "*" = "*",
	): Promise<Partial<Company>[]> {
		try {
			const { data: companyData, error: companyError } = await supabase
				.from("companies")
				.select(select === "*" ? "*" : select.join(","))
				.in("id", companyId)
				.single();

			if (companyError) throw companyError;

			return { ...(companyData as unknown as Partial<Company>[]) };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async fetchCompanyByIdAll(companyId: string[]): Promise<Company[]> {
		try {
			const companyData = await this.fetchCompanyById(companyId);
			return companyData as Company[];
		} catch (error: any) {
			throw error;
		}
	}

	async updateCompany(
		companyId: string,
		updates: Partial<Company>,
	): Promise<{ success: boolean }> {
		try {
			const { error: updateError } = await supabase
				.from("companies")
				.update(updates)
				.eq("id", companyId)
				.single();

			if (updateError) throw updateError;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async deleteCompany(companyId: string): Promise<{ success: boolean }> {
		try {
			const { error: deleteError } = await supabase
				.from("companies")
				.delete()
				.eq("id", companyId);

			if (deleteError) throw deleteError;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
	async insertCompany(inserts: Company): Promise<{ success: boolean }> {
		try {
			const { error: insertError } = await supabase
				.from("companies")
				.insert(inserts)
				.single();

			if (insertError) throw insertError;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
	async fetchJoinedCompaniesByUserId(
		userId: string,
		select: CompanyColumns[] | "*" = "*",
	): Promise<{ companies: Partial<Company>[]; roles: Role[] }> {
		try {
			const { data: rolesId, error: rolesIdError } = await supabase
				.from("user_roles")
				.select("role_id")
				.eq("user_id", userId);

			if (rolesIdError) throw rolesIdError;
			if (!rolesId || rolesId.length === 0) return { companies: [], roles: [] };

			const { data: rolesTable, error: rolesTableError } = await supabase
				.from("roles")
				.select("*")
				.in(
					"id",
					rolesId.map((role) => role.role_id),
				);

			if (rolesTableError) throw rolesTableError;

			const uniqueCompanyIds = Array.from(
				new Set(rolesTable.map((role) => role.company_id)),
			);

			let companies: Partial<Company>[];
			if (!(uniqueCompanyIds.length === 1 && uniqueCompanyIds[0] === null)) {
				const { data: companiesTable, error: companiesTableError } =
					await supabase
						.from("companies")
						.select(select === "*" ? "*" : select.join(","))
						.in("id", uniqueCompanyIds);

				if (companiesTableError) throw companiesTableError;
				companies = companiesTable as Partial<Company>[];
			} else {
				companies = [null];
			}

			const { data: permissionsId, error: permissionsIdError } = await supabase
				.from("role_permissions")
				.select("*")
				.in(
					"role_id",
					rolesTable.map((roles) => roles.id),
				);

			if (permissionsIdError) throw permissionsIdError;

			const { data: permissions, error: permissionsError } = await supabase
				.from("permissions")
				.select("*")
				.in(
					"id",
					permissionsId.map((permission) => permission.id),
				);

			if (permissionsError) throw permissionsError;

			const finalRoles: Role[] = rolesTable.map((role) => {
				const rolePermissions = permissionsId
					.filter((perId) => perId.role_id === role.id)
					.map(
						(perId) =>
							permissions.find((permission) => permission.id === perId.id)
								?.name || "",
					);
				return {
					id: role.id,
					name: role.name,
					company_id: role.company_id,
					permissions: rolePermissions,
				};
			});

			return {
				companies: { ...(companies as Partial<Company>[]) },
				roles: { ...finalRoles },
			};
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
	async fetchJoinedCompaniesByUserIdAll(
		userId: string,
	): Promise<{ companies: Company[]; roles: Role[] }> {
		try {
			const { companies, roles } =
				await this.fetchJoinedCompaniesByUserId(userId);
			return {
				companies: { ...(companies as Company[]) },
				roles: { ...roles },
			};
		} catch (error: any) {
			throw error;
		}
	}
}
