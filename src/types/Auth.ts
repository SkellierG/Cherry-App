import { User, Session, WeakPassword } from "@supabase/supabase-js";

export interface Profile {
	id: string | null;
	name: string | null;
	lastname: string | null;
	avatar_url: string | null;
	is_profiled: boolean;
	is_oauth?: boolean;
}
export interface AuthState {
	user: User | null;
	session: Session | null;
	profile?: Profile;
	isAuthenticated: boolean;
}

export type AuthAction =
	| { type: "SIGNIN"; payload: AuthState }
	| { type: "SIGNOUT" }
	| { type: "PROFILE"; payload: Profile };

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
	): Promise<{ signIn: SignInResponse; profile: Profile }>;

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
	): Promise<{ signIn: SignInResponse; profile: Profile }>;

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

export type ProfileColumns = "id" | "name" | "lastname" | "avatar_url";

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
	): Promise<Profile>;

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
