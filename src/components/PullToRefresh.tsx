import React, { useState } from "react";
import { ScrollView, RefreshControl, View } from "react-native";

type PullToRefreshProps = {
	children: React.ReactNode;
	onRefreshCallback?: (
		setRefreshing: React.Dispatch<React.SetStateAction<boolean>>,
	) => void;
};

const PullToRefresh: React.FC<PullToRefreshProps> = ({
	children,
	onRefreshCallback,
}) => {
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = () => {
		setRefreshing(true);
		if (onRefreshCallback) {
			onRefreshCallback(setRefreshing);
		}
		setTimeout(() => setRefreshing(false), 1000);
	};

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
			}}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={["#6200ee"]}
					title="Cargando..."
					titleColor="#000000"
				/>
			}
		>
			{children}
		</ScrollView>
	);
};

export default PullToRefresh;
