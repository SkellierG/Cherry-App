import { User, Session } from "@supabase/supabase-js";

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
