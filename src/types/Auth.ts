import { User, Session, WeakPassword } from "@supabase/supabase-js";

export interface Profile {
	id?: string;
	user_id: string;
	name: string;
	lastname: string;
	avatar_url: string | null;
	is_profiled: boolean;
	is_oauth: boolean;
}

export interface BaseCompany {
	id?: string;
	name: string;
	slogan: string | null;
	avatar_url: string | null;
	description: string | null;
	email: string;
	phone: string | null;
}

export type Company = BaseCompany | null;

export interface Role {
	id: number;
	name: string;
	company_id: string | null;
	permissions: string[];
}

export type Jwt = any;

export interface AuthState {
	user: User | null;
	session: Session | null;
	profile?: Partial<Profile>;
	joined_companies?: string[];
	roles?: Partial<Role>[];
	jwt?: Jwt;
	isAuthenticated: boolean;
}

export type AuthAction =
	| { type: "SIGNIN"; payload: AuthState }
	| { type: "SIGNOUT" }
	| { type: "PROFILE"; payload: Partial<Profile> }
	| { type: "COMPANIES"; payload: (string | null)[] }
	| { type: "ADD_JOINED_COMPANY"; payload: string }
	| { type: "REMOVE_JOINED_COMPANY"; payload: string }
	| { type: "ROLES"; payload: Partial<Role>[] }
	| { type: "ADD_ROLE"; payload: Role }
	| { type: "UPDATE_ROLE"; payload: Partial<Role> & { id: number } }
	| { type: "REMOVE_ROLE"; payload: number }
	| { type: "JWT"; payload: Jwt };

export interface AuthContextType {
	authState: AuthState;
	authDispatch: React.Dispatch<AuthAction>;
}

export type FetchSessionResponse = Session | null;

export type SignUpOptions =
	| {
			/** The redirect url embedded in the email link */
			emailRedirectTo?: string;
			/**
			 * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
			 *
			 * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
			 */
			data?: object;
			/** Verification token received when the user completes the captcha on the site. */
			captchaToken?: string;
	  }
	| {
			/**
			 * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
			 *
			 * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
			 */
			data?: object;
			/** Verification token received when the user completes the captcha on the site. Requires a configured WhatsApp sender on Twilio */
			captchaToken?: string;
			/** Messaging channel to use (e.g. whatsapp or sms) */
			channel?: "sms" | "whatsapp";
	  };

export type GetSessionResponse = {
	session: Session | null;
};

export type SignInResponse = {
	user: User;
	session: Session;
	weakPassword?: WeakPassword;
};

export type SignUpResponse = {
	user: User | null;
	session: Session | null;
};

export interface IAuthService {
	signInWithPassword(email: string, password: string): Promise<SignInResponse>;

	signInWitIdTokend(
		provider:
			| "google"
			| "apple"
			| "azure"
			| "facebook"
			| "kakao"
			| (string & {}),
		token: string,
		access_token?: string,
		nonce?: string,
	): Promise<SignInResponse>;

	signUp(
		email: string,
		password: string,
		options: SignUpOptions,
	): Promise<SignUpResponse>;

	getSession(): Promise<GetSessionResponse>;

	signOut(): Promise<{ success: boolean }>;
}

export interface IAuthController {
	/**
	 * Retrieves the current session from cache if available, otherwise fetches it from the service.
	 * The session includes user and profile data.
	 *
	 * @returns A promise that resolves with the session, user, and profile data.
	 * @throws Throws an error if no session is found or profile fetching fails.
	 */
	getSessionWithCache(): Promise<{
		session: Session;
		user: User;
		profile: Profile;
		jwt: Jwt;
		companies: Company[];
		roles: Role[];
	}>;

	/**
	 * Signs in the user with email and password, then caches the session, user, and profile data.
	 *
	 * @param email - The user's email address.
	 * @param password - The user's password.
	 * @returns A promise that resolves with the sign-in response and profile data.
	 * @throws Throws an error if sign-in or profile fetching fails.
	 */
	signInWithCache(
		email: string,
		password: string,
	): Promise<{
		signIn: SignInResponse;
		profile: Profile;
		jwt: Jwt;
	}>;

	/**
	 * Signs in the user using a provider (e.g., Google, Apple) and an identity token, then caches the session, user, and profile data.
	 *
	 * @param provider - The OAuth provider (e.g., "google", "apple").
	 * @param token - The identity token from the provider.
	 * @param access_token - (Optional) The access token for the provider.
	 * @param nonce - (Optional) A nonce value for added security.
	 * @returns A promise that resolves with the sign-in response and profile data.
	 * @throws Throws an error if sign-in or profile fetching fails.
	 */
	signInWitIdTokendWithCache(
		provider:
			| "google"
			| "apple"
			| "azure"
			| "facebook"
			| "kakao"
			| (string & {}),
		token: string,
		access_token?: string,
		nonce?: string,
	): Promise<{
		signIn: SignInResponse;
		profile: Profile;
		jwt: Jwt;
		companies: Company[];
		roles: Role[];
	}>;

	/**
	 * Signs up a new user with the provided email, password, and options.
	 * If auto-login is enabled, the session is cached.
	 *
	 * @param email - The user's email address.
	 * @param password - The user's password.
	 * @param options - Additional options for sign-up.
	 * @returns A promise that resolves with the sign-up response.
	 * @throws Throws an error if the sign-up operation fails.
	 */
	signUpWithCache(
		email: string,
		password: string,
		options: SignUpOptions,
	): Promise<SignUpResponse>;

	/**
	 * Signs out the currently logged-in user and clears cached session, user, and profile data.
	 *
	 * @returns A promise that resolves with a success object indicating the operation's completion.
	 * @throws Throws an error if no user is logged in or the sign-out operation fails.
	 */
	signOutWithClearCache(): Promise<{ success: boolean }>;
}

export type ProfileColumns = "user_id" | "name" | "lastname" | "avatar_url";

/**
 * Interface for managing user profiles.
 */
export interface IProfileService {
	/**
	 * Fetch a profile by its user ID with specific columns.
	 *
	 * @param userId - The unique ID of the user.
	 * @param select - An array of columns to fetch or "*" to fetch all columns.
	 * @returns A promise that resolves to the user's profile.
	 */
	fetchProfileById(
		userId: string,
		select: ProfileColumns[] | "*",
	): Promise<Partial<Profile>>;

	/**
	 * Fetch all columns of a profile by its user ID.
	 *
	 * @param userId - The unique ID of the user.
	 * @returns A promise that resolves to the user's profile with all columns.
	 */
	fetchProfileByIdAll(userId: string): Promise<Profile>;

	/**
	 * Update a user's profile.
	 *
	 * @param userId - The unique ID of the user.
	 * @param updates - A partial object containing the fields to update.
	 * @returns A promise that resolves to the updated profile.
	 */
	updateProfile(
		userId: string,
		updates: Partial<Profile>,
	): Promise<{ success: boolean }>;

	/**
	 * Delete a user's profile.
	 *
	 * @param userId - The unique ID of the user.
	 * @returns A promise that resolves when the profile is deleted.
	 */
	deleteProfile(userId: string): Promise<void>;
}

export type CompanyColumns =
	| "name"
	| "slogan"
	| "avatar_url"
	| "description"
	| "email"
	| "name";
/**
 * Interface for managing operations related to companies and their associated data.
 */
export interface ICompanyService {
	/**
	 * Fetches company data based on a list of company IDs and selected fields.
	 *
	 * @param companyId - An array of company IDs to retrieve.
	 * @param select - An array of column names to retrieve or `*` to fetch all columns.
	 * @returns A promise resolving to an array of partial `Company` objects.
	 * @throws Throws an error if the fetch operation fails.
	 */
	fetchCompanyById(
		companyId: string[],
		select: CompanyColumns[] | "*",
	): Promise<Partial<Company>[]>;

	/**
	 * Fetches complete data for companies based on a list of IDs.
	 *
	 * @param companyId - An array of company IDs to retrieve.
	 * @returns A promise resolving to an array of `Company` objects with full data.
	 * @throws Throws an error if the fetch operation fails.
	 */
	fetchCompanyByIdAll(companyId: string[]): Promise<Company[]>;

	/**
	 * Updates a company's information based on its ID.
	 *
	 * @param companyId - The ID of the company to update.
	 * @param updates - An object containing the fields to update with their new values.
	 * @returns A promise resolving to an object indicating the success of the operation.
	 * @throws Throws an error if the update operation fails.
	 */
	updateCompany(
		companyId: string,
		updates: Partial<Company>,
	): Promise<{ success: boolean }>;

	/**
	 * Deletes a company from the database using its ID.
	 *
	 * @param companyId - The ID of the company to delete.
	 * @returns A promise resolving to an object indicating the success of the operation.
	 * @throws Throws an error if the delete operation fails.
	 */
	deleteCompany(companyId: string): Promise<{ success: boolean }>;

	/**
	 * Inserts a new company into the database.
	 *
	 * @param inserts - A `Company` object containing the details of the new company.
	 * @returns A promise resolving to an object indicating the success of the insertion.
	 * @throws Throws an error if the insert operation fails.
	 */
	insertCompany(inserts: Company): Promise<{ success: boolean }>;

	/**
	 * Retrieves companies joined by a specific user along with their associated roles.
	 *
	 * @param userId - The ID of the user whose joined companies are being retrieved.
	 * @param select - An array of column names to retrieve for companies or `*` to fetch all columns.
	 * @returns A promise resolving to an object containing:
	 * - `companies`: An array of partial `Company` objects.
	 * - `roles`: An array of `Role` objects associated with the user.
	 * @throws Throws an error if the fetch operation fails.
	 */
	fetchJoinedCompaniesByUserId(
		userId: string,
		select: CompanyColumns[] | "*",
	): Promise<{ companies: Partial<Company>[]; roles: Role[] }>;

	/**
	 * Retrieves all companies joined by a specific user along with their associated roles.
	 *
	 * @param userId - The ID of the user whose joined companies are being retrieved.
	 * @returns A promise resolving to an object containing:
	 * - `companies`: An array of `Company` objects with full data.
	 * - `roles`: An array of `Role` objects associated with the user.
	 * @throws Throws an error if the fetch operation fails.
	 */
	fetchJoinedCompaniesByUserIdAll(
		userId: string,
	): Promise<{ companies: Company[]; roles: Role[] }>;

	/**
	 * Removes a user from a specific company.
	 *
	 * @param userId - The ID of the user to be removed.
	 * @param companyId - The ID of the company from which the user is being removed.
	 * @returns A promise resolving to an object indicating the success of the operation.
	 * @throws Throws an error if the operation fails.
	 */
	exitCompany(userId: string, companyId: string): Promise<{ success: boolean }>;
}

/**
 * Interface defining the methods for managing companies and their associated data.
 */
export interface ICompanyController {
	/**
	 * Creates a new company for a specific user.
	 *
	 * @param userId - The ID of the user creating the company.
	 * @param companyData - The data of the company to be created.
	 * @returns A promise that resolves to the created company object.
	 * @throws Will throw an error if the company cannot be created.
	 */
	createCompanyForUser(userId: string, companyData: Company): Promise<Company>;

	/**
	 * Retrieves companies joined by a user, along with roles and joined company IDs, using cached data if available.
	 *
	 * @param userId - The ID of the user whose joined companies are being retrieved.
	 * @param select - The columns to select from the company data (can be specific columns or `*` for all columns).
	 * @returns A promise that resolves to an object containing the following keys:
	 * - `companies`: An array of companies the user has joined. Each company contains partial information (limited to the selected columns).
	 * - `roles`: An array of roles associated with the user in each company. Each role includes details such as role ID, role name, and associated company ID.
	 * - `joined_companies`: An array of company IDs as strings, where `null` represents a global company (accessible to all users).
	 * @throws Will throw an error if the companies cannot be retrieved.
	 */
	getJoinedCompaniesByUserIdWithCache(
		userId: string,
		select: CompanyColumns[] | "*",
	): Promise<{
		companies: Partial<Company>[]; // Array of companies with partial information
		roles: Role[]; // Array of roles for the user in these companies
		joined_companies: (string | null)[]; // Array of company IDs, with null for global companies
	}>;

	/**
	 * Retrieves all companies joined by a user, along with roles and joined company IDs, using cached data if available.
	 *
	 * @param userId - The ID of the user whose joined companies are being retrieved.
	 * @returns A promise that resolves to an object containing the following keys:
	 * - `companies`: An array of all companies the user has joined. Each company includes complete information (e.g., ID, name, email, etc.).
	 * - `roles`: An array of all roles associated with the user across all companies. Each role includes details like role ID, role name, and associated company ID.
	 * - `joined_companies`: An array of company IDs as strings, where `null` represents a global company (accessible to all users).
	 * @throws Will throw an error if the companies cannot be retrieved.
	 */
	getJoinedCompaniesByUserIdAllWithCache(userId: string): Promise<{
		companies: Company[]; // Full list of companies joined by the user
		roles: Role[]; // List of roles across all companies
		joined_companies: (string | null)[]; // Array of company IDs, with null for global companies
	}>;

	/**
	 * Removes a user from a company and updates the cache accordingly.
	 *
	 * @param userId - The ID of the user leaving the company.
	 * @param companyId - The ID of the company to be exited.
	 * @returns A promise that resolves to an object containing the following key:
	 * - `success`: A boolean indicating whether the operation was successful (`true`) or not (`false`).
	 * @throws Will throw an error if the operation fails or the cache is invalid.
	 */
	exitCompanyWithCache(
		userId: string,
		companyId: string,
	): Promise<{ success: boolean }>;

	/**
	 * Creates a new company for a user and updates the cache with the newly created company and its associated data.
	 *
	 * @param userId - The ID of the user creating the company.
	 * @param companyData - The data of the company to be created.
	 * @returns A promise that resolves to an object containing the following keys:
	 * - `company`: The newly created company object, including properties such as ID, name, email, and other company details.
	 * - `roles`: An array of roles assigned to the user in the newly created company. Each role includes details such as role ID and role name.
	 * - `joined_company`: The ID of the newly created company (as a string), where `null` represents a global company (accessible to all users).
	 * @throws Will throw an error if the company cannot be created or if roles are not found.
	 */
	createCompanyForUserWithCache(
		userId: string,
		companyData: Company,
	): Promise<{
		company: Company; // The created company object
		roles: Role[]; // Roles assigned to the user in the new company
		joined_company: string | null; // ID of the new company or null for global companies
	}>;
}
