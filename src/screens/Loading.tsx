import i18n from "@utils/translations";
import React from "react";
import { Text } from "react-native";
import { useTheme } from "react-native-paper";
import { YStack, Spinner } from "tamagui";

export default function LoadingScreen() {
	const { colors } = useTheme(); // React Native Paper's theme

	return (
		<YStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			bg={colors.background}
			padding={16}
		>
			<Spinner size="large" />

			<Text className={"mt-4 text-lg text-center text-default"}>
				{i18n.t("gui.loeading")}
			</Text>
		</YStack>
	);
}
