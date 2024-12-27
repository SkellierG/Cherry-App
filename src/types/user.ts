import { User } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";

export interface UserState {
	user: User | null;
	isAuthenticated: boolean;
	isProfiled: boolean;
}

export type UserAction =
	| { type: "SIGNIN"; payload: User }
	| { type: "SIGNOUT" }
	| { type: "PROFILE" };

export interface UserContextType {
	userState: UserState;
	userDispatch: React.Dispatch<UserAction>;
}

export type FetchSessionResponse = Session | null;
