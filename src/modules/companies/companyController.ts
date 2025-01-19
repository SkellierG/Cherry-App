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

export class CompanyController implements ICompanyController {
	private companyService: ICompanyService;
	private cacheService: StorageInterface;

	constructor(companyService: ICompanyService, cacheService: StorageInterface) {
		this.companyService = companyService;
		this.cacheService = cacheService;
	}
	async exitCompany(userId: string, companyId: string): Promise<void> {
		throw new Error("Method not implemented.");
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
	async getJoinedCompaniesByUserIdAllWithCache(
		userId: string,
	): Promise<Company[]> {
		throw new Error("Method not implemented.");
	}
	async exitCompanyWithCache(userId: string, companyId: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async createCompanyForUserWithCache(
		userId: string,
		companyData: Partial<Company>,
	): Promise<Company> {
		throw new Error("Method not implemented.");
	}
}
