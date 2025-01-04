import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";

type Company = {
	id: string;
	name: string;
	description: string;
	email: string;
	telefono: string;
	imageSource?: { uri: string };
};

type CompanyProfileListProps = {
	companies: Company[];
};

const CompanyProfileList: React.FC<CompanyProfileListProps> = ({
	companies,
}) => {
	const router = useRouter();

	const styles = useDynamicStyles((theme) => ({
		container: {
			padding: 16,
		},
		card: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.backdrop
					: light_default_theme.colors.backdrop,
			borderRadius: 8,
			padding: 16,
			marginBottom: 12,
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.2,
			shadowRadius: 1.41,
		},
		textContainer: {
			flex: 1,
			marginRight: 12,
		},
		name: {
			fontSize: 16,
			fontWeight: "bold",
		},
		description: {
			fontSize: 14,
			color:
				theme === "dark"
					? dark_default_theme.colors.onBackground
					: light_default_theme.colors.onBackground,
		},
		contact: {
			fontSize: 12,
			color:
				theme === "dark"
					? dark_default_theme.colors.onBackground
					: light_default_theme.colors.onBackground,
		},
		image: {
			width: 80,
			height: 80,
			borderRadius: 8,
		},
		createCard: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.tertiary
					: light_default_theme.colors.tertiary,
			alignItems: "center",
			justifyContent: "center",
		},
		createText: {
			fontSize: 16,
			fontWeight: "bold",
			color:
				theme === "dark"
					? dark_default_theme.colors.onTertiary
					: light_default_theme.colors.onTertiary,
		},
	}));

	return (
		<FlatList
			data={[
				...companies,
				{
					id: "create-new",
					name: "Create a new company",
					description: "",
					telefono: "",
					email: "",
				},
				{
					id: "join-new",
					name: "Join a company",
					description: "",
					telefono: "",
					email: "",
				},
			]}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => {
				if (item.id === "create-new") {
					return (
						<TouchableOpacity
							style={[styles.card, styles.createCard]}
							onPress={() => router.push("/home/profile")}
						>
							<Text style={styles.createText}>+ Create a new company</Text>
						</TouchableOpacity>
					);
				} else if (item.id === "join-new") {
					return (
						<TouchableOpacity
							style={[styles.card, styles.createCard]}
							onPress={() => router.push("/home/profile")}
						>
							<Text style={styles.createText}>Join a company</Text>
						</TouchableOpacity>
					);
				} else {
					return (
						<View style={styles.card}>
							<View style={styles.textContainer}>
								<Text className="text-default" style={styles.name}>
									{item.name}
								</Text>
								<Text style={styles.description}>{item.description}</Text>
								<Text style={styles.contact}>Email: {item.email}</Text>
								<Text style={styles.contact}>Phone: {item.telefono}</Text>
							</View>
							{item.imageSource && (
								<Image style={styles.image} source={item.imageSource} />
							)}
						</View>
					);
				}
			}}
			contentContainerStyle={styles.container}
		/>
	);
};

export default CompanyProfileList;
