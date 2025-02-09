import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	Alert,
	TextInput,
} from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "@screens/LoadingScreen";
import PullToRefresh from "last-old-src/components/PullToRefresh";
import { PreviosControllerSupabase } from "@modules/previos/previosController";
import { FrutosService } from "@api/frutos";
import { CentrosFrutalesService } from "@api/centros_frutales";

const deleteMuestra = async (id: string): Promise<boolean> => {
	return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};

export default function MuestrasListScreen() {
	const params = useLocalSearchParams();
	const [muestras, setMuestras] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const styles = useDynamicStyles((theme) => ({
		container: {
			flex: 1,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			padding: 16,
		},
		card: {
			backgroundColor: theme === "dark" ? "#2c2c2c" : "#ffffff",
			borderRadius: 8,
			marginBottom: 12,
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
			fontSize: 16,
			fontWeight: "bold",
			color: theme === "dark" ? "#fff" : "#000",
		},
		deleteButton: {
			backgroundColor: "red",
			paddingVertical: 6,
			paddingHorizontal: 12,
			borderRadius: 4,
		},
		deleteButtonText: {
			color: "#fff",
			fontSize: 14,
		},
		cardBody: {
			marginTop: 8,
		},
		label: {
			fontSize: 14,
			fontWeight: "600",
			color: theme === "dark" ? "#ddd" : "#333",
			marginBottom: 4,
		},
		detail: {
			fontSize: 14,
			color: theme === "dark" ? "#aaa" : "#666",
			marginBottom: 4,
		},
		input: {
			borderWidth: 1,
			borderColor: theme === "dark" ? "#555" : "#ccc",
			borderRadius: 4,
			padding: 4,
			marginBottom: 4,
			color: theme === "dark" ? "#fff" : "#000",
			fontSize: 14,
			flex: 1,
		},
		floatingButton: {
			position: "absolute",
			bottom: 20,
			left: 20,
			right: 20,
			backgroundColor: theme === "dark" ? "#444" : "#007AFF",
			paddingVertical: 12,
			borderRadius: 6,
			alignItems: "center",
		},
		floatingButtonText: {
			color: "#fff",
			fontSize: 18,
		},
		row: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 4,
		},
		confirmButton: {
			backgroundColor: "green",
			paddingVertical: 8,
			paddingHorizontal: 16,
			borderRadius: 4,
			marginTop: 8,
			alignSelf: "flex-start",
		},
		confirmButtonText: {
			color: "#fff",
			fontSize: 14,
		},
	}));

	const checkHasChanges = (m: any): boolean => {
		const frutoOriginal = m.original.fruto?.[0] || {};
		const centroOriginal = m.original.centro_frutal?.[0] || {};

		const frutoActual = m.fruto?.[0] || {};
		const centroActual = m.centro_frutal?.[0] || {};

		const frutoChanged =
			String(frutoActual.nivel_1 || "") !==
				String(frutoOriginal.nivel_1 || "") ||
			String(frutoActual.nivel_2 || "") !== String(frutoOriginal.nivel_2 || "");
		const centroChanged =
			String(centroActual.nivel_1 || "") !==
				String(centroOriginal.nivel_1 || "") ||
			String(centroActual.nivel_2 || "") !==
				String(centroOriginal.nivel_2 || "");

		return frutoChanged || centroChanged;
	};

	const updateMuestraField = (
		muestraId: string,
		key: "nivel_1" | "nivel_2",
		value: string,
		section: "fruto" | "centro_frutal",
	) => {
		const numericValue = value.replace(/[^0-9]/g, "");
		setMuestras((prev) =>
			prev.map((m) => {
				if (m.id === muestraId) {
					const updatedM = { ...m };
					if (section === "fruto") {
						updatedM.fruto = Array.isArray(updatedM.fruto)
							? [...updatedM.fruto]
							: [{}];
						updatedM.fruto[0] = { ...(updatedM.fruto[0] || {}) };
						updatedM.fruto[0][key] = numericValue;
					} else if (section === "centro_frutal") {
						updatedM.centro_frutal = Array.isArray(updatedM.centro_frutal)
							? [...updatedM.centro_frutal]
							: [{}];
						updatedM.centro_frutal[0] = {
							...(updatedM.centro_frutal[0] || {}),
						};
						updatedM.centro_frutal[0][key] = numericValue;
					}
					updatedM.hasChanges = checkHasChanges(updatedM);
					return updatedM;
				}
				return m;
			}),
		);
	};

	const updateMuestra = async (muestra: any): Promise<boolean> => {
		try {
			console.log(JSON.stringify(muestra, null, 2));
			if (!muestra.hasChanges) throw new Error("changes not found");

			const frutosService = new FrutosService();
			const centrosFrutalesService = new CentrosFrutalesService();

			let updateFruto: any = {};
			if (muestra.fruto[0].nivel_1 !== muestra.original.fruto[0].nivel_1) {
				updateFruto.nivel_1 = muestra.fruto[0].nivel_1;
			}
			if (muestra.fruto[0].nivel_2 !== muestra.original.fruto[0].nivel_2) {
				updateFruto.nivel_2 = muestra.fruto[0].nivel_2;
			}

			let updateCentro: any = {};
			if (
				muestra.centro_frutal[0].nivel_1 !==
				muestra.original.centro_frutal[0].nivel_1
			) {
				updateCentro.nivel_1 = muestra.centro_frutal[0].nivel_1;
			}
			if (
				muestra.centro_frutal[0].nivel_2 !==
				muestra.original.centro_frutal[0].nivel_2
			) {
				updateCentro.nivel_2 = muestra.centro_frutal[0].nivel_2;
			}

			console.log(updateFruto, updateCentro);

			if (Object.keys(updateFruto).length > 0) {
				await frutosService.updateFrutoById(muestra.fruto[0].id, updateFruto);
			}

			if (Object.keys(updateCentro).length > 0) {
				await centrosFrutalesService.updateCentroFrutalById(
					muestra.centro_frutal[0].id,
					updateCentro,
				);
			}

			return true;
		} catch (error: any) {
			console.error(error);
			return false;
		}
	};

	const loadMuestras = async () => {
		setLoading(true);
		try {
			const data =
				await PreviosControllerSupabase.getCompletePreviosByCompanyIdAllWithCache(
					params.company_id as string,
				);
			console.log("data", JSON.stringify(data, null, 2));
			let previo: any;
			console.log("params.previo_id", params.previo_id);
			data.forEach((prev) => {
				if (prev.id === params.previo_id) {
					previo = prev.muestras;
				}
			});
			if (!Array.isArray(previo)) {
				previo = [];
			}
			const muestrasConOriginal = previo.map((m: any) => ({
				...m,
				original: JSON.parse(JSON.stringify(m)),
				hasChanges: false,
			}));
			console.log("previo", JSON.stringify(muestrasConOriginal, null, 2));
			setMuestras(muestrasConOriginal);
		} catch (err) {
			console.error("Error fetching muestras", err);
			Alert.alert("Error", "No se pudieron obtener las muestras.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMuestras();
	}, []);

	const handleDelete = (id: string) => {
		Alert.alert(
			"Confirmar Eliminación",
			"¿Estás seguro de eliminar esta muestra?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Eliminar",
					style: "destructive",
					onPress: async () => {
						try {
							const success = await deleteMuestra(id);
							if (success) {
								setMuestras((prev) => prev.filter((m) => m.id !== id));
							} else {
								Alert.alert("Error", "No se pudo eliminar la muestra.");
							}
						} catch (error) {
							console.error("Error deleting muestra:", error);
							Alert.alert("Error", "No se pudo eliminar la muestra.");
						}
					},
				},
			],
		);
	};

	const handleCreate = async () => {
		if (params.previo_id) {
			await PreviosControllerSupabase.createMuestraByPrevioIdWithCache(
				params.previo_id as string,
			);
			Alert.alert("Muestra creada con éxito");
			loadMuestras();
		} else {
			console.warn("no param previo_id");
		}
	};

	const handleConfirmChanges = async (muestraId: string) => {
		const muestraToUpdate = muestras.find((m) => m.id === muestraId);
		if (!muestraToUpdate) return;
		try {
			const success = await updateMuestra(muestraToUpdate);
			if (success) {
				setMuestras((prev) =>
					prev.map((m) => {
						if (m.id === muestraId) {
							return {
								...m,
								original: JSON.parse(JSON.stringify(m)),
								hasChanges: false,
							};
						}
						return m;
					}),
				);
				Alert.alert("Actualizado", "Los cambios se han subido correctamente.");
			} else {
				Alert.alert("Error", "No se pudieron actualizar los cambios.");
			}
		} catch (error) {
			console.error("Error updating muestra:", error);
			Alert.alert("Error", "No se pudieron actualizar los cambios.");
		}
	};

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1 }}>
				<PullToRefresh onRefreshCallback={loadMuestras}>
					<ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
						{muestras.map((muestra) => (
							<View key={muestra.id} style={styles.card}>
								<View style={styles.cardHeader}>
									<Text style={styles.cardTitle}>Muestra:</Text>
									<TouchableOpacity
										style={styles.deleteButton}
										onPress={() => handleDelete(muestra.id)}
									>
										<Text style={styles.deleteButtonText}>Eliminar</Text>
									</TouchableOpacity>
								</View>
								<View style={styles.cardBody}>
									<Text style={styles.detail}>{muestra.id}</Text>
									<Text style={styles.label}>Fruto:</Text>
									<Text style={styles.detail}>
										ID: {muestra.fruto?.[0]?.id || "N/A"}
									</Text>
									<View style={styles.row}>
										<Text style={styles.detail}>Nivel 1:</Text>
										<TextInput
											style={styles.input}
											keyboardType="numeric"
											value={String(muestra.fruto?.[0]?.nivel_1 || "")}
											onChangeText={(text) =>
												updateMuestraField(muestra.id, "nivel_1", text, "fruto")
											}
										/>
									</View>
									<View style={styles.row}>
										<Text style={styles.detail}>Nivel 2:</Text>
										<TextInput
											style={styles.input}
											keyboardType="numeric"
											value={String(muestra.fruto?.[0]?.nivel_2 || "")}
											onChangeText={(text) =>
												updateMuestraField(muestra.id, "nivel_2", text, "fruto")
											}
										/>
									</View>
									<Text style={styles.label}>Centro Frutal:</Text>
									<Text style={styles.detail}>
										ID: {muestra.centro_frutal?.[0]?.id || "N/A"}
									</Text>
									<View style={styles.row}>
										<Text style={styles.detail}>Nivel 1:</Text>
										<TextInput
											style={styles.input}
											keyboardType="numeric"
											value={String(muestra.centro_frutal?.[0]?.nivel_1 || "")}
											onChangeText={(text) =>
												updateMuestraField(
													muestra.id,
													"nivel_1",
													text,
													"centro_frutal",
												)
											}
										/>
									</View>
									<View style={styles.row}>
										<Text style={styles.detail}>Nivel 2:</Text>
										<TextInput
											style={styles.input}
											keyboardType="numeric"
											value={String(muestra.centro_frutal?.[0]?.nivel_2 || "")}
											onChangeText={(text) =>
												updateMuestraField(
													muestra.id,
													"nivel_2",
													text,
													"centro_frutal",
												)
											}
										/>
									</View>
									{muestra.hasChanges && (
										<TouchableOpacity
											style={styles.confirmButton}
											onPress={() => handleConfirmChanges(muestra.id)}
										>
											<Text style={styles.confirmButtonText}>
												Confirmar cambios
											</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						))}
					</ScrollView>
				</PullToRefresh>
				<TouchableOpacity style={styles.floatingButton} onPress={handleCreate}>
					<Text style={styles.floatingButtonText}>Crear Muestra</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
