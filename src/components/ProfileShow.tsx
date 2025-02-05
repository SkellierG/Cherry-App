import React from "react";
import { Text, View, Image, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useDynamicStyles } from "@hooks/useDynamicStyles";

type ProfileComponentProps = {
	children?: React.ReactNode;
	name?: string;
	publicId?: string;
	email?: string;
	imageSource?: any;
};

export default function ProfileShow({
	children,
	name = "Lorem Ipsum",
	publicId = "ABCDEFGHIJ",
	email = "name@domain.com",
	imageSource = require("../../assets/images/cherryapp_1024.png"),
}: ProfileComponentProps) {
	const styles = useDynamicStyles((theme) => ({
		main: {
			marginTop: 10,
		},
		imageContainer: {
			justifyContent: "center",
			alignItems: "center",
		},
		image: {
			width: 150,
			height: 150,
			borderRadius: 50,
			marginBottom: 5,
		},
		name: {
			fontSize: 16,
			fontWeight: "bold",
			color: theme === "dark" ? "white" : "black",
			marginBottom: 4,
		},
		email: {
			fontSize: 16,
			fontWeight: "500",
			color: theme === "dark" ? "white" : "black",
			marginBottom: 4,
		},
		publicIdContainer: {
			paddingHorizontal: 12,
			paddingVertical: 6,
			backgroundColor: theme === "dark" ? "#333" : "#f0f0f0",
			borderRadius: 6,
			marginBottom: 4,
		},
		publicIdText: {
			fontSize: 14,
			fontFamily: "monospace",
			color: theme === "dark" ? "#ddd" : "#555",
		},
		middleSectionTextContainer: {
			flexDirection: "row",
			justifyContent: "space-evenly",
			marginTop: 20,
		},
		middleSectionText: {
			justifyContent: "center",
			alignItems: "center",
		},
		toptext: {
			fontSize: 16,
			color: "white",
			fontWeight: "bold",
		},
		bottomtext: {
			fontSize: 16,
			color: "darkgrey",
			fontWeight: "700",
		},
	}));

	const copyPublicId = async () => {
		await Clipboard.setStringAsync(publicId);
		Alert.alert("Copied", "Public ID copied to clipboard");
	};

	return (
		<View style={styles.main}>
			<View style={styles.imageContainer}>
				<Image style={styles.image} source={imageSource} />
				<Text style={styles.name}>{name}</Text>
				<TouchableOpacity onPress={copyPublicId} activeOpacity={0.7}>
					<View style={styles.publicIdContainer}>
						<Text style={styles.publicIdText}>{publicId}</Text>
					</View>
				</TouchableOpacity>
				<Text style={styles.email}>{email}</Text>
			</View>
			<View style={styles.middleSectionTextContainer}></View>
			{children}
		</View>
	);
}
