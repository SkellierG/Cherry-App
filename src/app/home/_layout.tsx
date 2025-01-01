import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Animated,
} from "react-native";
import { Drawer, IconButton } from "react-native-paper";
import { useRouter, Slot } from "expo-router";
import { dark_export } from "@assets/themes/theme-output";

export default function Layout() {
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [active, setActive] = useState("home");
	const router = useRouter();
	const slideAnimation = React.useRef(new Animated.Value(-250)).current;

	// Función para abrir el Drawer
	const openDrawer = () => {
		setDrawerVisible(true);
		Animated.timing(slideAnimation, {
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	// Función para cerrar el Drawer
	const closeDrawer = () => {
		Animated.timing(slideAnimation, {
			toValue: -250,
			duration: 300,
			useNativeDriver: false,
		}).start(() => setDrawerVisible(false));
	};

	return (
		<View style={{ flex: 1 }}>
			{/* Header global con el icono del Drawer */}
			<View style={styles.header}>
				<IconButton
					icon="menu"
					size={24}
					onPress={openDrawer}
					style={styles.menuButton}
				/>
			</View>

			{/* Drawer deslizante */}
			{drawerVisible && (
				<TouchableWithoutFeedback onPress={closeDrawer}>
					<View style={styles.overlay} />
				</TouchableWithoutFeedback>
			)}

			<Animated.View style={[styles.drawer, { left: slideAnimation }]}>
				<Drawer.Section>
					<Drawer.Item
						label="Inicio"
						active={active === "home"}
						onPress={() => {
							setActive("home");
							router.push("/home");
							closeDrawer();
						}}
					/>
					<Drawer.Item
						label="Configuración"
						active={active === "settings"}
						onPress={() => {
							setActive("settings");
							router.push("/home/settings");
							closeDrawer();
						}}
					/>
				</Drawer.Section>
			</Animated.View>

			{/* Contenido de las pantallas con margen superior */}
			<Slot />
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: dark_export.color2,
		height: 56,
		paddingLeft: 10,
		zIndex: 2,
	},
	menuButton: {
		marginTop: 10,
		marginLeft: 10,
		zIndex: 3,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		zIndex: 1,
	},
	drawer: {
		position: "absolute",
		top: 0,
		bottom: 0,
		width: 250,
		backgroundColor: dark_export.color2,
		zIndex: 2,
		paddingTop: 50,
	},
});
