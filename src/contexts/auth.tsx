import React, { createContext, useContext, useReducer } from "react";
//@ts-ignore
import { AuthState, AuthAction, AuthContextType } from "@types/Auth";

const initialState: AuthState = {
	user: null,
	session: null,
	profile: {
		is_profiled: false,
		is_oauth: false,
		id: undefined,
		user_id: undefined,
		name: undefined,
		lastname: undefined,
		avatar_url: undefined,
	},
	isAuthenticated: false,
	joined_companies: [],
	roles: [],
	jwt: undefined,
};

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case "SIGNIN":
			return {
				...state,
				user: action.payload.user,
				session: action.payload.session,
				joined_companies: action.payload.joined_companies,
				roles: action.payload.roles,
				isAuthenticated: true,
			};
		case "SIGNOUT":
			return {
				user: null,
				session: null,
				profile: {
					is_profiled: false,
					id: undefined,
					user_id: undefined,
					name: undefined,
					lastname: undefined,
					avatar_url: undefined,
					is_oauth: false,
				},
				joined_companies: [],
				roles: [],
				jwt: undefined,
				isAuthenticated: false,
			};
		case "PROFILE":
			return {
				...state,
				profile: {
					is_profiled: action.payload.is_profiled,
					id: action.payload.id,
					user_id: action.payload.user_id,
					name: action.payload.name,
					lastname: action.payload.lastname,
					avatar_url: action.payload.avatar_url,
					is_oauth: action.payload.is_oauth,
				},
			};
		case "COMPANIES":
			return {
				...state,
				joined_companies: action.payload,
			};
		case "ADD_JOINED_COMPANY":
			return {
				...state,
				joined_companies: [...(state.joined_companies || []), action.payload],
			};
		case "REMOVE_JOINED_COMPANY":
			return {
				...state,
				joined_companies: state.joined_companies?.filter(
					(company) => company !== action.payload,
				),
			};
		case "ROLES":
			return {
				...state,
				roles: action.payload,
			};
		case "ADD_ROLE":
			return {
				...state,
				roles: [...(state.roles || []), action.payload],
			};
		case "UPDATE_ROLE":
			return {
				...state,
				roles: state.roles?.map((role) =>
					role.id === action.payload.id ? { ...role, ...action.payload } : role,
				),
			};
		case "REMOVE_ROLE":
			return {
				...state,
				roles: state.roles?.filter((role) => role.id !== action.payload),
			};
		case "JWT":
			return {
				...state,
				jwt: action.payload,
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
