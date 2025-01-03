import React, { createContext, useState, useEffect, useContext } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

type ConnectivityContextType = {
	isConnected: boolean;
};

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(
	undefined,
);

export const ConnectivityProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isConnected, setIsConnected] = useState(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
			setIsConnected(state.isConnected || false);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<ConnectivityContext.Provider value={{ isConnected }}>
			{children}
		</ConnectivityContext.Provider>
	);
};

export const useConnectivity = (): ConnectivityContextType => {
	const context = useContext(ConnectivityContext);
	if (!context) {
		throw new Error(
			"useConnectivity must be used within a ConnectivityProvider",
		);
	}
	return context;
};
