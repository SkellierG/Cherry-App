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
		if (!companyService) {
			throw new Error("Invalid parameter: companyService is required.");
		}
		if (!cacheService) {
			throw new Error("Invalid parameter: cacheService is required.");
		}
		this.companyService = companyService;
		this.cacheService = cacheService;
	}

	async createCompanyForUser(
		userId: string,
		companyData: Company,
	): Promise<Company> {
		if (typeof userId !== "string" || userId.trim() === "") {
			throw new Error("Invalid parameter: userId must be a non-empty string.");
		}
		if (!companyData || typeof companyData !== "object") {
			throw new Error("Invalid parameter: companyData must be an object.");
		}
		if (!companyData.email) {
			throw new Error(
				"Invalid parameter: companyData must have an email property.",
			);
		}

		try {
			const insertResult = await this.companyService.insertCompany(companyData);
			if (!insertResult || !insertResult.success) {
				throw new Error("Error inserting company data.");
			}

			const { companies } =
				await this.companyService.fetchJoinedCompaniesByUserIdAll(userId);

			if (!Array.isArray(companies)) {
				throw new Error(
					"Unexpected data format: companies should be an array.",
				);
			}

			if (companies.length === 1 && companies[0] === null) {
				throw new Error("The newly created company could not be found.");
			}

			const createdCompany = companies.find(
				(company) => company && company.email === companyData.email,
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
		if (typeof userId !== "string" || userId.trim() === "") {
			throw new Error("Invalid parameter: userId must be a non-empty string.");
		}
		try {
			const companiesData =
				await this.companyService.fetchJoinedCompaniesByUserId(userId, select);

			if (
				!companiesData ||
				!Array.isArray(companiesData.companies) ||
				!Array.isArray(companiesData.roles)
			) {
				throw new Error(
					"Unexpected data format from fetchJoinedCompaniesByUserId.",
				);
			}

			const joined_companies: (string | null)[] = companiesData.companies.map(
				(company) => (company && company.id ? String(company.id) : null),
			);

			this.cacheService.setItem("companies", companiesData);

			return {
				companies: companiesData.companies,
				roles: companiesData.roles,
				joined_companies: joined_companies,
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
		if (typeof userId !== "string" || userId.trim() === "") {
			throw new Error("Invalid parameter: userId must be a non-empty string.");
		}
		try {
			const companiesData =
				await this.companyService.fetchJoinedCompaniesByUserIdAll(userId);

			if (
				!companiesData ||
				!Array.isArray(companiesData.companies) ||
				!Array.isArray(companiesData.roles)
			) {
				throw new Error(
					"Unexpected data format from fetchJoinedCompaniesByUserIdAll.",
				);
			}

			const joined_companies: (string | null)[] = companiesData.companies.map(
				(company) => (company && company.id ? String(company.id) : null),
			);

			this.cacheService.setItem("companies", companiesData);

			return {
				companies: [...companiesData.companies],
				roles: [...companiesData.roles],
				joined_companies: joined_companies,
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
		if (typeof userId !== "string" || userId.trim() === "") {
			throw new Error("Invalid parameter: userId must be a non-empty string.");
		}
		if (typeof companyId !== "string" || companyId.trim() === "") {
			throw new Error(
				"Invalid parameter: companyId must be a non-empty string.",
			);
		}
		try {
			const { success } = await this.companyService.exitCompany(
				userId,
				companyId,
			);
			if (!success) {
				throw new Error("Cannot exit the company.");
			}

			const cachedItem = this.cacheService.getItem(
				"companies",
				"string",
			) as string;
			const oldCompanies: { companies: Company[]; roles: Role[] } | null =
				cachedItem ? JSON.parse(cachedItem) : null;

			if (!oldCompanies || !Array.isArray(oldCompanies.companies)) {
				throw new Error("Error in the cache: companies data is invalid.");
			}

			const newCompanies: { companies: Company[]; roles: Role[] } = {
				companies: oldCompanies.companies.filter(
					(company) => company && company.id !== companyId,
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

	async createCompanyForUserWithCache(
		userId: string,
		companyData: Company,
	): Promise<{
		company: Company;
		roles: Role[];
		joined_company: string | null;
	}> {
		if (typeof userId !== "string" || userId.trim() === "") {
			throw new Error("Invalid parameter: userId must be a non-empty string.");
		}
		if (!companyData || typeof companyData !== "object") {
			throw new Error("Invalid parameter: companyData must be an object.");
		}
		if (!companyData.email) {
			throw new Error(
				"Invalid parameter: companyData must have an email property.",
			);
		}

		try {
			const insertResult = await this.companyService.insertCompany(companyData);
			if (!insertResult || !insertResult.success) {
				throw new Error("Create company failed: insertion unsuccessful.");
			}

			const fetchCompaniesWithRetry = async (
				retries: number,
				delay: number,
			) => {
				try {
					await new Promise((resolve) => setTimeout(resolve, delay));
					const result =
						await this.getJoinedCompaniesByUserIdAllWithCache(userId);
					if (
						Array.isArray(result.companies) &&
						result.companies.length === 1 &&
						result.companies[0] === null
					) {
						throw new Error("Companies data is invalid (only NULL returned).");
					}
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

			const { companies, roles } = await fetchCompaniesWithRetry(1, 3000);
			this.cacheService.setItem("companies", { companies, roles });

			const newCompany = companies.find(
				(comp) => comp && comp.email === companyData.email,
			);
			if (!newCompany || !newCompany.id) {
				throw new Error("Cannot find the recently created company.");
			}

			return {
				company: newCompany,
				roles: roles.filter((role) => role.company_id === newCompany.id),
				joined_company: newCompany.id,
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
