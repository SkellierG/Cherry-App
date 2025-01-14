import React, { createContext, useContext, useReducer } from "react";
//@ts-ignore
import { AuthState, AuthAction, AuthContextType } from "@types/Auth";

const initialState: AuthState = {
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

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [authState, authDispatch] = useReducer(AuthReducer, initialState);

	return (
		<AuthContext.Provider value={{ authState, authDispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};
