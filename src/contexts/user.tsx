import React, { createContext, useReducer, useContext } from "react";
import { User } from "@supabase/supabase-js";

export interface UserState {
	user: User | null;
	isAuthenticated: boolean;
	isProfiled: boolean;
}

export type UserAction =
	| { type: "SIGNIN"; payload: User }
	| { type: "SIGNOUT" }
	| { type: "PROFILE" };

const initialState: UserState = {
	user: null,
	isAuthenticated: false,
	isProfiled: false,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
	switch (action.type) {
		case "SIGNIN":
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
			};
		case "SIGNOUT":
			return {
				...state,
				user: null,
				isAuthenticated: false,
				isProfiled: false,
			};
		case "PROFILE":
			return {
				...state,
				isProfiled: true,
			};
		default:
			return state;
	}
};

interface UserContextType {
	userState: UserState;
	userDispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [userState, userDispatch] = useReducer(userReducer, initialState);

	return (
		<UserContext.Provider value={{ userState, userDispatch }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
