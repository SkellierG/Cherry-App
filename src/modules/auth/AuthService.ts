import { supabase } from "@services/supabase";
import {
	GetSessionResponse,
	IAuthService,
	SignInResponse,
	SignUpOptions,
	SignUpResponse,
	//@ts-ignore
} from "@types/User";

export class AuthService implements IAuthService {
	async signInWithPassword(
		email: string,
		password: string,
	): Promise<SignInResponse> {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw error;
		return { ...data };
	}

	async signInWitIdTokend(
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
	): Promise<SignInResponse> {
		const { data, error } = await supabase.auth.signInWithIdToken({
			provider,
			token,
			access_token,
			nonce,
		});
		if (error) throw error;
		return { ...data };
	}

	async signUp(
		email: string,
		password: string,
		options: SignUpOptions,
	): Promise<SignUpResponse> {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options,
		});
		if (error) throw error;
		return { ...data };
	}

	async getSession(): Promise<GetSessionResponse> {
		const { data, error } = await supabase.auth.getSession();
		if (error) throw error;
		return { ...data };
	}

	async signOut(): Promise<{ success: boolean }> {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		return { success: true };
	}
}
