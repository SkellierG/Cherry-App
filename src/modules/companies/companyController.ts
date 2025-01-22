import { CompanyService } from "@api/company";
import {
	Company,
	CompanyColumns,
	ICompanyController,
	ICompanyService,
	Role,
	//@ts-ignore
} from "@types/Auth";
//@ts-ignore
import { StorageInterface } from "@types/Components";
import DeviceStorage from "@utils/deviceStorage";

export class CompanyController implements ICompanyController {
	private companyService: ICompanyService;
	private cacheService: StorageInterface;

	constructor(companyService: ICompanyService, cacheService: StorageInterface) {
		this.companyService = companyService;
		this.cacheService = cacheService;
	}
	async createCompanyForUser(
		userId: string,
		companyData: Company,
	): Promise<Company> {
		try {
			await this.companyService.insertCompany(companyData);

			const { companies } =
				await this.companyService.fetchJoinedCompaniesByUserIdAll(userId);

			if (companies.length === 1 && companies[0] === null)
				throw new Error("The newly created company could not be found.");

			if (typeof companies !== "object")
				throw new Error("The newly created company could not be found.");

			const createdCompany = companies.find(
				(company) => company?.email === companyData?.email,
			);

			if (!createdCompany) {
				throw new Error("The newly created company could not be found.");
			}

			return createdCompany;
		} catch (error: any) {
			console.error("Error creating company for user:", error);
			throw error;
		}
	}
	async getJoinedCompaniesByUserIdWithCache(
		userId: string,
		select: CompanyColumns[] | "*" = "*",
	): Promise<{
		companies: Partial<Company>[];
		roles: Role[];
		joined_companies: (string | null)[];
	}> {
		try {
			const companiesData =
				await this.companyService.fetchJoinedCompaniesByUserId(userId, select);

			const joined_companies: (string | null)[] = companiesData.companies.map(
				(company) => (company?.id as string) || null,
			);

			this.cacheService.setItem("companies", companiesData);

			return {
				companies: { ...companiesData.companies },
				roles: { ...companiesData.roles },
				joined_companies: { ...joined_companies },
			};
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
	async getJoinedCompaniesByUserIdAllWithCache(userId: string): Promise<{
		companies: Company[];
		roles: Role[];
		joined_companies: (string | null)[];
	}> {
		try {
			const companiesData =
				await this.companyService.fetchJoinedCompaniesByUserIdAll(userId);

			console.warn(companiesData);

			const joined_companies: (string | null)[] = companiesData.companies.map(
				(company) => company?.id || null,
			);

			this.cacheService.setItem("companies", companiesData);

			return {
				companies: [...companiesData.companies],
				roles: [...companiesData.roles],
				joined_companies: { ...joined_companies },
			};
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
	async exitCompanyWithCache(
		userId: string,
		companyId: string,
	): Promise<{ success: boolean }> {
		try {
			const { success } = await this.companyService.exitCompany(
				userId,
				companyId,
			);
			if (!success) throw new Error("cannot exit the company");

			const oldCompanies: { companies: Company[]; roles: Role[] } | null =
				JSON.parse(
					(this.cacheService.getItem("companies", "string") as string) ||
						"null",
				);

			if (!oldCompanies) throw new Error("error in the cache");

			const newCompanies: { companies: Company[]; roles: Role[] } = {
				companies: oldCompanies.companies.filter(
					(company) => company?.id !== companyId,
				),
				roles: oldCompanies.roles.filter(
					(role) => role.company_id !== companyId,
				),
			};

			this.cacheService.setItem("companies", newCompanies);

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
	//TODO: optimize this method in the future
	async createCompanyForUserWithCache(
		userId: string,
		companyData: Company,
	): Promise<{
		company: Company;
		roles: Role[];
		joined_company: string | null;
	}> {
		try {
			const { success } = await this.companyService.insertCompany(companyData);

			if (!success) throw new Error("create company failed");

			const fetchCompaniesWithRetry = async (
				retries: number,
				delay: number,
			) => {
				console.log(userId);
				try {
					await new Promise((resolve) => setTimeout(resolve, delay));

					const result =
						await this.getJoinedCompaniesByUserIdAllWithCache(userId);

					if (result.companies.length === 1 && result.companies[0] === null)
						throw new Error("companies is just NULL");

					console.log(result);
					return result;
				} catch (error) {
					if (retries > 0) {
						console.warn(`Retrying... (${retries} retries left)`);
						return fetchCompaniesWithRetry(retries - 1, delay);
					} else {
						throw error;
					}
				}
			};

			const { companies, roles, joined_companies } =
				await fetchCompaniesWithRetry(1, 3000);

			console.log(companies);

			if (!companies || !roles || !joined_companies)
				throw new Error("error fetching companies");

			this.cacheService.setItem("companies", { companies, roles });

			if (typeof companies !== "object")
				throw new Error("error fetching companies");

			const newCompany: Company | undefined = companies.find(
				(comp) => comp?.email === companyData?.email,
			);

			if (!newCompany || !newCompany.id)
				throw new Error(
					"cannot find recently created company, please Refresh main Page",
				);

			let newRoles: Role[] | undefined = roles.filter(
				(role) => role.company_id === newCompany?.id,
			);

			if (newRoles.length === 0)
				throw new Error("cannot find recently created roles");

			const result: {
				company: Company;
				roles: Role[];
				joined_company: string | null;
			} = {
				company: newCompany,
				roles: newRoles,
				joined_company: newCompany.id,
			};

			return {
				company: result.company,
				roles: result.roles,
				joined_company: result.joined_company,
			};
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}

export const CompanySupabase = new CompanyController(
	new CompanyService(),
	DeviceStorage,
);
