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
import * as XLSX from "xlsx";
import { writeSheetFile } from "@services/sheetjs";
import { Button } from "tamagui";

// Función dummy para eliminar un previo (puedes reemplazarla por la lógica real)
async function deletePrevio(id: string): Promise<boolean> {
	return new Promise((resolve) => setTimeout(() => resolve(true), 500));
}

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
		card: {
			backgroundColor: theme === "dark" ? "#2c2c2c" : "#ffffff",
			borderRadius: 8,
			marginBottom: 16,
			padding: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 2,
		},
		cardHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		cardTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: theme === "dark" ? "#fff" : "#000",
		},
		cardBody: {
			marginTop: 8,
		},
		detailText: {
			fontSize: 14,
			color: theme === "dark" ? "#aaa" : "#666",
			marginVertical: 2,
		},
		cardFooter: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginTop: 12,
		},
		button: {
			backgroundColor: theme === "dark" ? "#444" : "#007AFF",
			paddingVertical: 8,
			paddingHorizontal: 12,
			borderRadius: 6,
			alignItems: "center",
			marginHorizontal: 4,
		},
		buttonText: {
			color: "#fff",
			fontSize: 14,
		},
		floatingButton: {
			position: "absolute",
			bottom: 190,
			left: 20,
			right: 20,
			backgroundColor: theme === "dark" ? "#444" : "#007AFF",
			paddingVertical: 12,
			borderRadius: 6,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
			elevation: 5,
			zIndex: 1000,
		},
		floatingButtonText: {
			color: "#fff",
			fontSize: 18,
		},
	}));

	const loadPrevios = async () => {
		setLoading(true);
		try {
			const data =
				await PreviosControllerSupabase.getCompletePreviosByCompanyIdAllWithCache(
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

	const handleExportSingle = async (previo: any, type: "csv" | "xlsx") => {
		if (!previo) {
			Alert.alert("Error", "No hay datos para exportar.");
			return;
		}

		const headers = [
			["Nombre del previo", "Fecha"],
			["Centro Frutal", "Frutos"],
			["Nivel 1", "Nivel 2", "Nivel 1", "Nivel 2"],
		];

		console.log(previo);

		const data = [
			[
				previo.muestras[0].centro_frutal[0].nivel_1 || "",
				previo.muestras[0].centro_frutal[0].nivel_2 || "",
				previo.muestras[0].fruto[0].nivel_1 || "",
				previo.muestras[0].fruto[0].nivel_2 || "",
			],
		];

		console.log(data);

		const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
		console.log(worksheet);
		const workbook = XLSX.utils.book_new();
		console.log(workbook);
		XLSX.utils.book_append_sheet(workbook, worksheet, "Previo");

		try {
			await writeSheetFile(workbook, `previo_${previo.id}.${type}`, type);
			Alert.alert(
				"Exportación completada",
				`Archivo previo_${previo.id}.${type} guardado.`,
			);
		} catch (error) {
			Alert.alert("Error", "No se pudo exportar el previo.");
			console.error(error);
		}
	};

	const handleCreate = () => {
		router.push(`/auth/create/previo?company_id=${params.company_id}`);
	};

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1 }}>
				<PullToRefresh onRefreshCallback={loadPrevios}>
					<ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
						{previos.map((previo) => (
							<View key={previo.id} style={styles.card}>
								<View style={styles.cardHeader}>
									<Text style={styles.cardTitle}>{previo.nombre}</Text>
									<Button
										theme={"red_active"}
										onPress={() => handleDelete(previo.id)}
									>
										<Text style={styles.buttonText}>Eliminar</Text>
									</Button>
								</View>
								<View style={styles.cardBody}>
									<Text style={styles.detailText}>
										Fecha: {new Date(previo.fecha).toLocaleDateString()}
									</Text>
								</View>
								<View style={styles.cardFooter}>
									<TouchableOpacity
										style={styles.button}
										onPress={() => handleExportSingle(previo, "csv")}
									>
										<Text style={styles.buttonText}>Exportar CSV</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.button}
										onPress={() => handleExportSingle(previo, "xlsx")}
									>
										<Text style={styles.buttonText}>Exportar XLSX</Text>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</ScrollView>
				</PullToRefresh>
				<TouchableOpacity style={styles.floatingButton} onPress={handleCreate}>
					<Text style={styles.floatingButtonText}>Crear Previo</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
