import { supabase } from "@services/supabase";
import { AuthError } from "@supabase/supabase-js";
import {
	GetSessionResponse,
	IAuthService,
	SignInResponse,
	SignUpOptions,
	SignUpResponse,
	//@ts-ignore
} from "@types/User";
import { handleError } from "@utils/common";

export class AuthService implements IAuthService {
	async signInWithPassword(
		email: string,
		password: string,
	): Promise<SignInResponse> {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) handleError(error);
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
		if (error) handleError(error);
		return { ...data };
	}

	async getSession(): Promise<GetSessionResponse> {
		const { data, error } = await supabase.auth.getSession();
		if (error) handleError(error);
		return { ...data };
	}

	async signOut(): Promise<{ success: boolean }> {
		const { error } = await supabase.auth.signOut();
		if (error) handleError(error);
		return { success: true };
	}
}
