import { useDynamicStyles } from "@hooks/useDynamicStyles";
import i18n from "@services/translations";
import React from "react";
import { Text, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { YStack, Spinner } from "tamagui";

export default function LoadingScreen() {
	const { colors } = useTheme();
	const styles = useDynamicStyles((theme) => ({
		text: {
			color: theme === "dark" ? "white" : "dark",
		},
	}));

	return (
		<YStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			bg={colors.background}
			padding={16}
		>
			<Image source={require("./../../assets/images/cherryappp_XXXHDPI.png")} />
			<Spinner size="large" />

			<Text style={styles.text}>{i18n.t("gui.loading")}</Text>
		</YStack>
	);
}
