//@ts-ignore
import { StorageInterface } from "@types/Auth";
import {
	IAuthController,
	IAuthService,
	Profile,
	SignInResponse,
	SignUpOptions,
	SignUpResponse,
	//@ts-ignore
} from "@types/User";
import { AuthService } from "./AuthService";
import DeviceStorage from "@utils/deviceStorage";
import { supabase } from "@services/supabase";
import { handleError } from "@utils/common";
import { Alert } from "react-native";
import { Session, User } from "@supabase/supabase-js";

export class AuthController implements IAuthController {
	private authService: IAuthService;
	private cacheService: StorageInterface;

	constructor(authService: IAuthService, cacheService: StorageInterface) {
		this.authService = authService;
		this.cacheService = cacheService;
	}

	async getSessionWithCache(): Promise<{
		session: Session;
		user: User;
		profile: Profile;
	}> {
		const getSessionData = await this.authService.getSession();

		if (
			!(getSessionData.session?.access_token && getSessionData.session?.user)
		) {
			throw new Error("No session found in Supabase");
		}

		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.select("id, is_oauth, is_profiled, name, lastname, avatar_url")
			.eq("id", getSessionData.session.user.id)
			.single();

		if (profileError) throw profileError;

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
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", signInData.user.id)
				.single();

			if (!profileData || profileError)
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

	signUpWithCache(
		email: string,
		password: string,
		options: SignUpOptions,
	): Promise<SignUpResponse> {
		throw new Error("Method not implemented.");
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
);
