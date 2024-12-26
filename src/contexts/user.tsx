import React, { createContext, useReducer, useContext } from "react";

const initialState = {
	user: null,
	isAuthenticated: false,
	isProfiled: false,
};

const userReducer = (state: any, action: any) => {
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

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(userReducer, initialState);

	return (
		<UserContext.Provider value={{ state, dispatch }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
