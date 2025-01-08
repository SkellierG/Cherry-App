export interface UseSignInHook {
	/**
	 * Indicates whether the sign-in process is currently loading.
	 */
	isLoading: boolean;

	/**
	 * Handles the user sign-in process using the provided email and password.
	 * Updates the user state and navigates the user based on their profile status.
	 *
	 * @param email - The email address of the user.
	 * @param password - The password of the user.
	 * @returns A promise that resolves when the sign-in process is complete.
	 * @throws Throws an error if sign-in fails.
	 */
	handleSignIn(email: string, password: string): Promise<void>;
}

/**
 * Interface for the `useGetSession` custom hook.
 * Provides functionality to retrieve the user session,
 * either from the cache or from the server, and handles
 * authentication states.
 */
export interface UseGetSessionHook {
	/**
	 * Indicates whether the session retrieval process is currently loading.
	 */
	isLoading: boolean;

	/**
	 * Function to retrieve the user session.
	 * Attempts to fetch the session from the cache if the device is offline,
	 * or from the server if the device is online. Updates the authentication
	 * and profile states based on the retrieved data.
	 *
	 * @returns {Promise<void>} A promise that resolves once the session retrieval is complete.
	 */
	handleGetSession: () => Promise<void>;
}

/**
 * Interface for the `useSignIn` custom hook when signing in with an external provider.
 * Provides functionality to handle OAuth-based sign-in processes, cache management,
 * and user state updates.
 */
export interface UseSignInWithTokenHook {
	/**
	 * Indicates whether the sign-in process is currently loading.
	 */
	isLoading: boolean;

	/**
	 * Function to handle the sign-in process using an external provider's token.
	 * Accepts multiple OAuth providers and their respective tokens to authenticate
	 * the user and update the application state accordingly.
	 *
	 * @param provider - The name of the OAuth provider used for authentication.
	 *                   Examples include "google", "apple", "azure", "facebook", "kakao",
	 *                   or any custom provider string.
	 * @param token - The ID token provided by the external authentication provider.
	 * @param access_token - (Optional) The access token provided by the authentication provider.
	 * @param nonce - (Optional) A one-time value used for additional security during authentication.
	 *
	 * @returns {Promise<void>} A promise that resolves once the sign-in process is complete.
	 */
	handleSignIn: (
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
	) => Promise<void>;
}
