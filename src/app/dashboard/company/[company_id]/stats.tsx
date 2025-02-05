import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	Text,
	View,
	Dimensions,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadingScreen from "@screens/LoadingScreen";
import PullToRefresh from "last-old-src/components/PullToRefresh";
import { PreviosControllerSupabase } from "@modules/previos/previosController";

const fetchPrevios = async (): Promise<any[]> => {
	return new Promise((resolve) =>
		setTimeout(() => {
			resolve([
				{
					id: "1",
					name: "El previesito",
					fecha: "2023-01-01T12:00:00Z",
					created_at: "2023-01-01T12:00:00Z",
				},
				{
					id: "2",
					name: "LOLOLOLOL",
					fecha: "2023-02-15T09:30:00Z",
					created_at: "2023-02-15T09:30:00Z",
				},
				{
					id: "3",
					name: "mi papu miau",
					fecha: "2023-03-20T17:45:00Z",
					created_at: "2023-03-20T17:45:00Z",
				},
			]);
		}, 1000),
	);
};

const deletePrevio = async (id: string): Promise<boolean> => {
	return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};

export default function PreviosListScreen() {
	const params = useLocalSearchParams();
	const [previos, setPrevios] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const styles = useDynamicStyles((theme) => ({
		container: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			minHeight: Dimensions.get("window").height,
			padding: 16,
			flex: 1,
		},
		item: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: theme === "dark" ? "#aaa" : "#888",
		},
		itemTextContainer: {
			flex: 1,
		},
		itemName: {
			fontSize: 18,
			color: theme === "dark" ? "#fff" : "#000",
		},
		itemDate: {
			fontSize: 14,
			color: theme === "dark" ? "#ddd" : "#666",
			marginTop: 4,
		},
		itemCreated: {
			fontSize: 10,
			color: theme === "dark" ? "#aaa" : "#888",
			marginTop: 4,
		},
		deleteButton: {
			backgroundColor: "red",
			paddingVertical: 6,
			paddingHorizontal: 12,
			borderRadius: 4,
			marginLeft: 8,
		},
		deleteButtonText: {
			color: "#fff",
			fontSize: 14,
		},
		createButton: {
			marginTop: 20,
			backgroundColor: theme === "dark" ? "#444" : "#007AFF",
			paddingVertical: 12,
			borderRadius: 6,
			alignItems: "center",
		},
		createButtonText: {
			color: "#fff",
			fontSize: 18,
		},
	}));

	const loadPrevios = async () => {
		setLoading(true);
		try {
			const data =
				await PreviosControllerSupabase.getPreviosByCompanyIdAllWithCache(
					params.company_id as string,
				);
			setPrevios(data);
		} catch (err) {
			console.error("Error fetching previos", err);
			Alert.alert("Error", "No se pudieron obtener los previos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPrevios();
	}, []);

	const handleDelete = (id: string) => {
		Alert.alert(
			"Confirmar Eliminación",
			"¿Estás seguro de eliminar este previo?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Eliminar",
					style: "destructive",
					onPress: async () => {
						try {
							const success = await deletePrevio(id);
							if (success) {
								setPrevios((prev) => prev.filter((p) => p.id !== id));
							} else {
								Alert.alert("Error", "No se pudo eliminar el previo.");
							}
						} catch (error) {
							console.error("Error deleting previo:", error);
							Alert.alert("Error", "No se pudo eliminar el previo.");
						}
					},
				},
			],
		);
	};

	const handleCreate = () => {
		router.push("/previos/create");
	};

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<PullToRefresh>
				<ScrollView>
					{previos.map((previo) => (
						<View key={previo.id} style={styles.item}>
							<View style={styles.itemTextContainer}>
								<Text style={styles.itemName}>{previo.name}</Text>
								<Text style={styles.itemCreated}>
									{new Date(previo.created_at).toLocaleDateString()}
								</Text>
								<Text style={styles.itemDate}>
									{new Date(previo.fecha).toLocaleDateString()}
								</Text>
							</View>
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={() => handleDelete(previo.id)}
							>
								<Text style={styles.deleteButtonText}>Eliminar</Text>
							</TouchableOpacity>
						</View>
					))}
				</ScrollView>
				<TouchableOpacity style={styles.createButton} onPress={handleCreate}>
					<Text style={styles.createButtonText}>Crear Previo</Text>
				</TouchableOpacity>
			</PullToRefresh>
		</SafeAreaView>
	);
}
