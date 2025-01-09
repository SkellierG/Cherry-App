import { useDynamicStyles } from "@hooks/useDynamicStyles";
import i18n from "@services/translations";
import React from "react";
import { Text } from "react-native";
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
			<Spinner size="large" />

			<Text style={styles.text}>{i18n.t("gui.loeading")}</Text>
		</YStack>
	);
}
