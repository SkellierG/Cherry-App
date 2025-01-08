import { User, Session, WeakPassword } from "@supabase/supabase-js";

export interface Profile {
	id: string | null;
	name: string | null;
	lastname: string | null;
	avatar_url: string | null;
	is_profiled: boolean;
	is_oauth?: boolean;
}
export interface UserState {
	user: User | null;
	session: Session | null;
	profile?: Profile;
	isAuthenticated: boolean;
}

export type UserAction =
	| { type: "SIGNIN"; payload: UserState }
	| { type: "SIGNOUT" }
	| { type: "PROFILE"; payload: Profile };

export interface UserContextType {
	userState: UserState;
	userDispatch: React.Dispatch<UserAction>;
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
	 * Retrieves the session from cache if available, otherwise fetches it from the service.
	 * @returns {Promise<{session: Session; user: User; profile: Profile;}>} The session data.
	 */
	getSessionWithCache(): Promise<{
		session: Session;
		user: User;
		profile: Profile;
	}>;

	/**
	 * Signs in the user and caches the session for future use.
	 * @param email - The email of the user.
	 * @param password - The password of the user.
	 * @returns {Promise<{ signIn: SignInResponse; profile: Profile }>} The result of the sign-in operation.
	 */
	signInWithCache(
		email: string,
		password: string,
	): Promise<{ signIn: SignInResponse; profile: Profile }>;

	/**
	 * Signs up a new user and caches the session if auto-login is enabled.
	 * @param email - The email of the user.
	 * @param password - The password of the user.
	 * @param options - Additional sign-up options.
	 * @returns {Promise<SignUpResponse>} The result of the sign-up operation.
	 */
	signUpWithCache(
		email: string,
		password: string,
		options: SignUpOptions,
	): Promise<SignUpResponse>;

	/**
	 * Signs out the user and clears any cached session data.
	 * @returns {Promise<{ success: boolean }>} Resolves when the operation is complete.
	 */
	signOutWithClearCache(): Promise<{ success: boolean }>;
}
