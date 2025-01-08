//@ts-ignore
import { StorageInterface } from "@types/Auth";
import {
	GetSessionResponse,
	IAuthController,
	IAuthService,
	IProfileService,
	Profile,
	SignInResponse,
	SignUpOptions,
	SignUpResponse,
	//@ts-ignore
} from "@types/User";
import { AuthService } from "./AuthService";
import DeviceStorage from "@utils/deviceStorage";
import { handleError } from "@utils/common";
import { Alert } from "react-native";
import { Session, User } from "@supabase/supabase-js";
// eslint-disable-next-line import/no-unresolved
import { ProfileService } from "@api/profile";

export class AuthController implements IAuthController {
	private authService: IAuthService;
	private cacheService: StorageInterface;
	private profileService: IProfileService;

	constructor(
		authService: IAuthService,
		cacheService: StorageInterface,
		profileService: IProfileService,
	) {
		this.authService = authService;
		this.cacheService = cacheService;
		this.profileService = profileService;
	}

	async getSessionWithCache(): Promise<{
		session: Session;
		user: User;
		profile: Profile;
	}> {
		const getSessionData: GetSessionResponse =
			await this.authService.getSession();

		if (
			!(getSessionData.session?.access_token && getSessionData.session?.user)
		) {
			throw new Error("No session found in Supabase");
		}

		const profileData = await this.profileService.fetchProfileByIdAll(
			getSessionData.session.user.id,
		);

		await this.cacheService.setItem(
			"sessionData",
			JSON.stringify(getSessionData.session),
		);
		await this.cacheService.setItem(
			"userData",
			JSON.stringify(getSessionData.session.user),
		);
		await this.cacheService.setItem("profileData", JSON.stringify(profileData));

		return {
			session: { ...getSessionData.session },
			user: { ...getSessionData.session.user },
			profile: { ...profileData },
		};
	}

	async signInWithCache(
		email: string,
		password: string,
	): Promise<{ signIn: SignInResponse; profile: Profile }> {
		try {
			const signInData: SignInResponse =
				await this.authService.signInWithPassword(email, password);
			if (!signInData.user) throw new Error("Sign In error, user not found");

			const profileData = await this.profileService.fetchProfileByIdAll(
				signInData.user.id,
			);

			if (!profileData)
				throw new Error(
					profileData ? handleError(profileData) : "auth.Profile_not_found",
				);

			await this.cacheService.setItem(
				"sessionData",
				JSON.stringify(signInData.session),
			);
			await this.cacheService.setItem(
				"userData",
				JSON.stringify(signInData.user),
			);
			await this.cacheService.setItem(
				"profileData",
				JSON.stringify(profileData),
			);

			return { signIn: { ...signInData }, profile: { ...profileData } };
		} catch (error: any) {
			Alert.alert(error.message);
			console.error(error);
			throw error;
		}
	}

	async signInWitIdTokendWithCache(
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
	): Promise<{ signIn: SignInResponse; profile: Profile }> {
		try {
			const signInData: SignInResponse =
				await this.authService.signInWitIdTokend(
					provider,
					token,
					access_token,
					nonce,
				);
			if (!signInData.user) throw new Error("Sign In error, user not found");

			const profileData = await this.profileService.fetchProfileByIdAll(
				signInData.user.id,
			);

			if (!profileData)
				throw new Error(
					profileData ? handleError(profileData) : "auth.Profile_not_found",
				);

			if (!profileData.is_oauth) {
				const update = await this.profileService.updateProfile(
					signInData.user.id,
					{ is_oauth: true },
				);

				profileData.is_oauth = true;

				if (!update) {
					console.error("Error updating profiles");
					throw new Error("Unknown error while updating profiles");
				}
			}

			await this.cacheService.setItem(
				"sessionData",
				JSON.stringify(signInData.session),
			);
			await this.cacheService.setItem(
				"userData",
				JSON.stringify(signInData.user),
			);
			await this.cacheService.setItem(
				"profileData",
				JSON.stringify(profileData),
			);

			return { signIn: { ...signInData }, profile: { ...profileData } };
		} catch (error: any) {
			Alert.alert(error.message);
			console.error(error);
			throw error;
		}
	}

	async signUpWithCache(
		email: string,
		password: string,
		options: SignUpOptions,
	): Promise<SignUpResponse> {
		throw new Error("signUpWithCache not implemented.");
		// try {
		// 	const signUpData: SignUpResponse = await this.authService.signUp(
		// 		email,
		// 		password,
		// 		options,
		// 	);

		// 	if (!(signUpData && signUpData.user))
		// 		throw new Error("An error occurred during sign-up, user not found");
		// 	if (signUpData.user.identities && signUpData.user.identities.length > 0) {
		// 	} else {
		// 		console.log("Email address is already taken.");
		// 	}
		// } catch (error: any) {
		// 	Alert.alert(error.message);
		// 	console.error(error);
		// 	throw error;
		// }
	}

	async signOutWithClearCache(): Promise<{ success: boolean }> {
		try {
			const getSessionData = await this.authService.getSession();

			if (!getSessionData.session?.user)
				throw new Error("No user is currently logged in");

			const signOutSuccess = await this.authService.signOut();

			if (!signOutSuccess) throw new Error("Sign Out, Unexpected error");

			await this.cacheService.removeItem("sessionData");
			await this.cacheService.removeItem("userData");
			await this.cacheService.removeItem("profileData");

			return { success: true };
		} catch (error: any) {
			Alert.alert(error.message);
			console.error(error);
			throw error;
		}
	}
}

export const AuthSupabase = new AuthController(
	new AuthService(),
	DeviceStorage,
	new ProfileService(),
);
