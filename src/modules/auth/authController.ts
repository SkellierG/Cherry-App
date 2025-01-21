//@ts-ignore
import { StorageInterface } from "@types/Components";
import {
	Company,
	GetSessionResponse,
	IAuthController,
	IAuthService,
	ICompanyService,
	IProfileService,
	Jwt,
	Profile,
	Role,
	SignInResponse,
	SignUpOptions,
	SignUpResponse,
	//@ts-ignore
} from "@types/Auth";
import { AuthService } from "./AuthService";
import DeviceStorage from "@utils/deviceStorage";
import { handleError } from "@utils/common";
import { Session, User } from "@supabase/supabase-js";
// eslint-disable-next-line import/no-unresolved
import { ProfileService } from "@api/profile";
import { jwtDecode } from "jwt-decode";
import { CompanyService } from "@api/company";

export class AuthController implements IAuthController {
	private authService: IAuthService;
	private cacheService: StorageInterface;
	private profileService: IProfileService;
	private companyService: ICompanyService;

	constructor(
		authService: IAuthService,
		cacheService: StorageInterface,
		profileService: IProfileService,
		companyService: ICompanyService,
	) {
		this.authService = authService;
		this.cacheService = cacheService;
		this.profileService = profileService;
		this.companyService = companyService;
	}

	async getSessionWithCache(): Promise<{
		session: Session;
		user: User;
		profile: Profile;
		jwt: Jwt;
		companies: Company[];
		roles: Role[];
	}> {
		try {
			const getSessionData: GetSessionResponse =
				await this.authService.getSession();

			if (
				!(getSessionData.session?.access_token && getSessionData.session?.user)
			) {
				throw new Error(
					"no previous session founded, probably user is signOut or first signIn",
				);
			}

			const profileData = await this.profileService.fetchProfileByIdAll(
				getSessionData.session.user.id,
			);

			const jwt: Jwt = jwtDecode(getSessionData.session.access_token);

			this.cacheService.setItem("session", getSessionData.session);
			this.cacheService.setItem("user", getSessionData.session.user);
			this.cacheService.setItem("profile", profileData);
			this.cacheService.setItem("jwt", jwt);

			const { companies, roles } =
				await this.companyService.fetchJoinedCompaniesByUserIdAll(
					getSessionData.session.user.id,
				);

			console.log(companies, roles);

			this.cacheService.setItem("companies", {
				companies: companies,
				roles: roles,
			});

			console.log(
				JSON.stringify(
					{
						session: getSessionData.session,
						user: getSessionData.session.user,
						profile: profileData,
						jwt,
						companies,
						roles,
					},
					null,
					2,
				),
			);

			return {
				session: { ...getSessionData.session },
				user: { ...getSessionData.session.user },
				profile: { ...profileData },
				jwt: { ...jwt },
				companies: [...companies],
				roles: [...roles],
			};
		} catch (error: any) {
			throw error;
		}
	}

	async signInWithCache(
		email: string,
		password: string,
	): Promise<{ signIn: SignInResponse; profile: Profile; jwt: Jwt }> {
		try {
			const signInData: SignInResponse =
				await this.authService.signInWithPassword(email, password);
			if (!signInData.user)
				throw new Error(
					"user not found in the database after signInWithPassword method",
				);

			const profileData = await this.profileService.fetchProfileByIdAll(
				signInData.user.id,
			);

			if (!profileData)
				throw new Error(
					"no profile data founded in the database after fetching",
				);

			const jwt: Jwt = jwtDecode(signInData.session.access_token);

			this.cacheService.setItem("session", signInData.session);
			this.cacheService.setItem("user", signInData.user);
			this.cacheService.setItem("profile", profileData);
			this.cacheService.setItem("jwt", jwt);

			return {
				signIn: { ...signInData },
				profile: { ...profileData },
				jwt: { ...jwt },
			};
		} catch (error: any) {
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
	): Promise<{
		signIn: SignInResponse;
		profile: Profile;
		jwt: Jwt;
		companies: Company[];
		roles: Role[];
	}> {
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

				if (!update.success) {
					console.error("Error updating profiles");
					throw new Error("Unknown error while updating profiles");
				}
			}

			const jwt: Jwt = jwtDecode(signInData.session.access_token);

			this.cacheService.setItem("session", signInData.session);
			this.cacheService.setItem("user", signInData.user);
			this.cacheService.setItem("profile", profileData);
			this.cacheService.setItem("jwt", jwt);

			const { companies, roles } =
				await this.companyService.fetchJoinedCompaniesByUserIdAll(
					signInData.session.user.id,
				);

			this.cacheService.setItem("companies", {
				companies: companies,
				roles: roles,
			});

			console.log(
				JSON.stringify(
					{
						session: signInData.session,
						user: signInData.session.user,
						profile: profileData,
						jwt,
						companies,
						roles,
					},
					null,
					2,
				),
			);

			return {
				signIn: { ...signInData },
				profile: { ...profileData },
				jwt: { ...jwt },
				companies: [...companies],
				roles: [...roles],
			};
		} catch (error: any) {
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

			this.cacheService.removeItem("session");
			this.cacheService.removeItem("user");
			this.cacheService.removeItem("profile");
			this.cacheService.removeItem("jwt");

			return { success: true };
		} catch (error: any) {
			throw error;
		}
	}
}

export const AuthSupabase = new AuthController(
	new AuthService(),
	DeviceStorage,
	new ProfileService(),
	new CompanyService(),
);
