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
			paddingHorizontal: 16,
		},
		card: {
			backgroundColor: theme === "dark" ? "#2A2A2A" : "#FFF",
			borderRadius: 12,
			marginVertical: 8,
			padding: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 6,
			elevation: 3,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "600",
			color: theme === "dark" ? "#FFF" : "#1A1A1A",
			marginBottom: 12,
		},
		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 12,
		},
		inputLabel: {
			width: 80,
			fontSize: 14,
			color: theme === "dark" ? "#AAA" : "#666",
			marginRight: 8,
		},
		input: {
			flex: 1,
			borderWidth: 1,
			borderColor: theme === "dark" ? "#404040" : "#DDD",
			borderRadius: 8,
			paddingVertical: 10,
			paddingHorizontal: 12,
			fontSize: 16,
			color: theme === "dark" ? "#FFF" : "#000",
			backgroundColor: theme === "dark" ? "#333" : "#FAFAFA",
		},
		floatingButton: {
			position: "absolute",
			bottom: 30,
			right: 20,
			backgroundColor: theme === "dark" ? "#4A90E2" : "#007AFF",
			width: 56,
			height: 56,
			borderRadius: 28,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.2,
			shadowRadius: 6,
			elevation: 5,
		},
		actionBar: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 16,
		},
		deleteButton: {
			backgroundColor: theme === "dark" ? "#D32F2F" : "#FF4444",
			paddingVertical: 8,
			paddingHorizontal: 12,
			borderRadius: 6,
		},
		confirmButton: {
			backgroundColor: theme === "dark" ? "#388E3C" : "#28A745",
			paddingVertical: 10,
			paddingHorizontal: 20,
			borderRadius: 8,
			alignSelf: "flex-end",
		},
		badge: {
			position: "absolute",
			top: -8,
			right: -8,
			backgroundColor: "#FF1744",
			borderRadius: 10,
			width: 20,
			height: 20,
			justifyContent: "center",
			alignItems: "center",
		},
		badgeText: {
			color: "#FFF",
			fontSize: 12,
			fontWeight: "bold",
		},
		placeholderTextColor: {
			color: theme === "dark" ? "#666" : "#AAA",
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

	// Estilos actualizados para MuestrasListScreen

	// Componente actualizado
	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1 }}>
				<PullToRefresh onRefreshCallback={loadMuestras}>
					<ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
						{muestras.map((muestra) => (
							<View key={muestra.id} style={styles.card}>
								<View style={styles.actionBar}>
									<Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
										Muestra #{muestra.id.slice(-4)}
									</Text>
									<TouchableOpacity
										style={styles.deleteButton}
										onPress={() => handleDelete(muestra.id)}
									>
										<Text style={{ color: "#FFF", fontWeight: "500" }}>
											Eliminar
										</Text>
									</TouchableOpacity>
								</View>

								<Text
									style={[
										styles.sectionTitle,
										{ fontSize: 16, marginBottom: 8 },
									]}
								>
									Datos Fruto
								</Text>
								<View style={styles.inputContainer}>
									<Text style={styles.inputLabel}>Nivel 1</Text>
									<TextInput
										style={styles.input}
										keyboardType="numeric"
										value={String(muestra.fruto?.[0]?.nivel_1 || "")}
										onChangeText={(text) =>
											updateMuestraField(muestra.id, "nivel_1", text, "fruto")
										}
										placeholder="Ingrese valor..."
										placeholderTextColor={styles.placeholderTextColor.color}
									/>
								</View>

								<View style={styles.inputContainer}>
									<Text style={styles.inputLabel}>Nivel 2</Text>
									<TextInput
										style={styles.input}
										keyboardType="numeric"
										value={String(muestra.fruto?.[0]?.nivel_2 || "")}
										onChangeText={(text) =>
											updateMuestraField(muestra.id, "nivel_2", text, "fruto")
										}
										placeholder="Ingrese valor..."
										placeholderTextColor={styles.placeholderTextColor.color}
									/>
								</View>

								<Text
									style={[
										styles.sectionTitle,
										{ fontSize: 16, marginBottom: 8 },
									]}
								>
									Datos Centro Frutal
								</Text>
								<View style={styles.inputContainer}>
									<Text style={styles.inputLabel}>Nivel 1</Text>
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
										placeholder="Ingrese valor..."
										placeholderTextColor={styles.placeholderTextColor.color}
									/>
								</View>

								<View style={styles.inputContainer}>
									<Text style={styles.inputLabel}>Nivel 2</Text>
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
										placeholder="Ingrese valor..."
										placeholderTextColor={styles.placeholderTextColor.color}
									/>
								</View>

								{muestra.hasChanges && (
									<TouchableOpacity
										style={styles.confirmButton}
										onPress={() => handleConfirmChanges(muestra.id)}
									>
										<Text style={{ color: "#FFF", fontWeight: "600" }}>
											Guardar Cambios
										</Text>
									</TouchableOpacity>
								)}
							</View>
						))}
					</ScrollView>
				</PullToRefresh>

				<TouchableOpacity style={styles.floatingButton} onPress={handleCreate}>
					<Text style={{ color: "#FFF", fontSize: 24 }}>+</Text>
					{muestras.length > 0 && (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>{muestras.length}</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
