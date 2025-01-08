import { AuthError, PostgrestError } from "@supabase/supabase-js";

export function handleError(error: AuthError | PostgrestError | any): never {
	throw new Error(`${error.code}: ${error?.status || "500"}: ${error.message}`);
}
