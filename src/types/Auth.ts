import { User, Session, WeakPassword } from "@supabase/supabase-js";

export interface Profile {
	id: string;
	user_id: string;
	name: string;
	lastname: string;
	avatar_url: string | null;
	is_profiled: boolean;
	is_oauth: boolean;
}

export interface BaseCompany {
	id: string;
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
	| { type: "COMPANIES"; payload: string[] }
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
	): Promise<{ signIn: SignInResponse; profile: Profile; jwt: Jwt }>;

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
	): Promise<{ signIn: SignInResponse; profile: Profile; jwt: Jwt }>;

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
export interface ICompanyService {
	/**
	 * Retrieves a company's profile by its ID, selecting specific columns.
	 *
	 * @param companyId - The unique ID of the company.
	 * @param select - An array of columns to select or "*" to fetch all columns.
	 * @returns A promise that resolves to a partial company profile.
	 */
	fetchCompanyById(
		companyId: string[],
		select: CompanyColumns[] | "*",
	): Promise<Partial<Company>[]>;

	/**
	 * Retrieves the full profile of a company by its ID.
	 *
	 * @param companyId - The unique ID of the company.
	 * @returns A promise that resolves to the complete company profile.
	 */
	fetchCompanyByIdAll(companyId: string[]): Promise<Company[]>;

	/**
	 * Updates a company's profile.
	 *
	 * @param companyId - The unique ID of the company.
	 * @param updates - A partial object containing the fields to be updated.
	 * @returns A promise that resolves to an object indicating whether the operation was successful.
	 */
	updateCompany(
		companyId: string,
		updates: Partial<Company>,
	): Promise<{ success: boolean }>;

	/**
	 * Deletes a company's profile.
	 *
	 * @param companyId - The unique ID of the company.
	 * @returns A promise that resolves when the company profile is deleted.
	 */
	deleteCompany(companyId: string): Promise<{ success: boolean }>;

	insertCompany(inserts: Company): Promise<{ success: boolean }>;

	/**
	 * Fetches all companies a user has joined.
	 */
	fetchJoinedCompaniesByUserId(
		userId: string,
		select: CompanyColumns[] | "*",
	): Promise<{ companies: Partial<Company>[]; roles: Role[] }>;

	/**
	 * Fetches all companies a user has joined.
	 */
	fetchJoinedCompaniesByUserIdAll(
		userId: string,
	): Promise<{ companies: Company[]; roles: Role[] }>;
}

export interface ICompanyController {
	/**
	 * Allows a user to leave a company.
	 */
	exitCompany(userId: string, companyId: string): Promise<void>;

	/**
	 * Creates a new company and associates it with a user.
	 */
	createCompanyForUser(userId: string, companyData: Company): Promise<Company>;

	/**
	 * Returns a cached version of the user's joined companies.
	 */
	getJoinedCompaniesByUserIdWithCache(
		userId: string,
		select: CompanyColumns[] | "*",
	): Promise<{
		companies: Partial<Company>[];
		roles: Role[];
		joined_companies: (string | null)[];
	}>;

	/**
	 * Returns a cached version of the user's joined companies.
	 */
	getJoinedCompaniesByUserIdAllWithCache(userId: string): Promise<Company[]>;

	/**
	 * Allows a user to leave a company.
	 */
	exitCompanyWithCache(userId: string, companyId: string): Promise<void>;

	/**
	 * Creates a new company and associates it with a user.
	 */
	createCompanyForUserWithCache(
		userId: string,
		companyData: Partial<Company>,
	): Promise<Company>;
}
