import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import CompanyProfileList from "@components/companyProfile";
import ProfileComponent from "@components/profile";
import { useUser } from "@contexts/user";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import React, { useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { H1, H2 } from "tamagui";

type ProfileScreenProps = {
	name?: string;
	lastname?: string;
	email?: string;
	imageSource?: { uri: string };
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
	name,
	lastname,
	email,
	imageSource,
}) => {
	const styles = useDynamicStyles((theme) => ({
		view: {
			height: Dimensions.get("window").height,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
		},
		text: {
			textAlign: "center",
			fontWeight: "bold",
		},
	}));

	const { userState } = useUser();

	const finalName = name || userState.profile?.name || "";

	const finalLastname = lastname || userState.profile?.lastname || "";

	const finalEmail = email || userState.user?.email || "";

	const finalImageSource =
		imageSource ||
		(userState.profile?.avatar_url
			? { uri: userState.profile?.avatar_url }
			: undefined);

	const companies = [
		{
			id: "1",
			name: "AgroVita S.A.",
			description:
				"Proveedores de soluciones agropecuarias para el sector agrícola y ganadero.",
			email: "contacto@agrovita.com",
			telefono: "+1 234-567-8901",
			imageSource: { uri: "https://via.placeholder.com/80" },
		},
		{
			id: "2",
			name: "Hacienda Los Pinos",
			description:
				"Especialistas en producción de ganado de alta calidad y cultivos orgánicos.",
			email: "info@haciendalospinos.com",
			telefono: "+1 876-543-2109",
			imageSource: { uri: "https://via.placeholder.com/80" },
		},
		{
			id: "3",
			name: "AgroCultura Verde",
			description:
				"Cultivos orgánicos y sostenibles para una mejor alimentación.",
			email: "ventas@agroculturaverde.com",
			telefono: "+1 555-123-4567",
			imageSource: { uri: "https://via.placeholder.com/80" },
		},
		{
			id: "4",
			name: "Finca Los Molinos",
			description:
				"Expertos en la producción de productos lácteos y cultivos de maíz.",
			email: "contacto@fincalosmolinos.com",
			telefono: "+1 333-987-6543",
			imageSource: { uri: "https://via.placeholder.com/80" },
		},
	];

	return (
		<View style={styles.view}>
			<ProfileComponent
				name={`${finalName} ${finalLastname}`}
				email={finalEmail}
				imageSource={finalImageSource}
			/>
			<H2 style={styles.text}>Companyes</H2>
			<CompanyProfileList companies={companies} />
		</View>
	);
};

export default ProfileScreen;
