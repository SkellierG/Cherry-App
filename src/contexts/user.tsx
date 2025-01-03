import React, { createContext, useReducer, useContext } from "react";
import { UserState, UserAction, UserContextType } from "../types/users";

const initialState: UserState = {
	user: null,
	session: null,
	profile: {
		is_profiled: false,
		is_oauth: false,
		id: null,
		name: null,
		lastname: null,
		avatar_url: null,
	},
	isAuthenticated: false,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
	switch (action.type) {
		case "SIGNIN":
			return {
				...state,
				user: action.payload.user,
				session: action.payload.session,
				isAuthenticated: true,
			};
		case "SIGNOUT":
			return {
				user: null,
				session: null,
				profile: {
					is_profiled: false,
					id: null,
					name: null,
					lastname: null,
					avatar_url: null,
					is_oauth: false,
				},
				isAuthenticated: false,
			};
		case "PROFILE":
			return {
				...state,
				profile: {
					is_profiled: action.payload.is_profiled,
					id: action.payload.id,
					name: action.payload.name,
					lastname: action.payload.lastname,
					avatar_url: action.payload.avatar_url,
					is_oauth: action.payload.is_oauth,
				},
			};
		default:
			return state;
	}
};

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
