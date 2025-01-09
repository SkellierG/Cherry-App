import React, { useState, ReactNode } from "react";
import { FlatList, RefreshControl, View, StyleSheet } from "react-native";

type PullToRefreshProps = {
	children: ReactNode;
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
		setTimeout(() => setRefreshing(false), 1000); // Fallback timeout
	};

	const renderChildren = () => <View style={styles.container}>{children}</View>;

	return (
		<FlatList
			data={[]}
			renderItem={null}
			ListHeaderComponent={renderChildren}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={["#6200ee"]}
					title="Cargando..."
					titleColor="#000000"
				/>
			}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
	},
});

export default PullToRefresh;
