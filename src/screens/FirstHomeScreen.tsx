import React, { useState } from "react";
import {
	View,
	H1,
	Paragraph,
	Button,
	Dialog,
	Input,
	Fieldset,
	Label,
	XStack,
	Unspaced,
	H4,
} from "tamagui";
import Feather from "@expo/vector-icons/Feather";
import { Dimensions, Image } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useRouter } from "expo-router";
import { routes } from "@utils/constants";

export default function FirstHomeScreen() {
	const router = useRouter();
	const [companyId, setCompanyId] = useState("");

	const styles = useDynamicStyles((theme) => ({
		container: {
			height: Dimensions.get("window").height,
			alignItems: "center",
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			padding: 20,
		},
		buttonGroup: {
			marginTop: 30,
			width: "100%",
			alignItems: "center",
		},
		button: {
			marginVertical: 10,
		},
		dialogContent: {
			width: 400,
			height: 200,
			padding: 10,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.surface
					: light_default_theme.colors.surface,
			borderRadius: 15,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.5,
			shadowRadius: 10,
			elevation: 20,
			alignItems: "center",
			justifyContent: "center",
		},
		inputField: {
			marginVertical: 10,
			width: "100%",
		},
		overlay: {
			flex: 1,
			position: "absolute",
			height: Dimensions.get("window").height * 2,
			width: Dimensions.get("window").width * 2,
			top: -Dimensions.get("window").height,
			right: -Dimensions.get("window").width / 1.85,
			left: -Dimensions.get("window").width / 1.85,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			justifyContent: "center",
			alignItems: "center",
		},
		image: {
			marginBottom: 20,
			height: 200,
			width: 200,
		},
	}));

	const handleJoinCompany = () => {
		if (companyId.trim()) {
			alert(`Joining company with ID: ${companyId}`);
			setCompanyId("");
		} else {
			alert("Please enter a valid company ID.");
		}
	};

	return (
		<View style={styles.container}>
			<Image
				style={styles.image}
				source={require("./../../assets/images/cherryapp_1024.png")}
			/>
			<H1>Welcome</H1>
			<Paragraph>
				Join our team and start collaborating! Create or join a company to begin
				your journey.
			</Paragraph>
			<View style={styles.buttonGroup}>
				<Button
					style={styles.button}
					theme="red_active"
					onPress={() => router.push(routes.auth.companies)}
				>
					Create a Company
				</Button>
				<Dialog modal>
					<Dialog.Trigger asChild>
						<Button style={styles.button} theme="surface1">
							Join a Company
						</Button>
					</Dialog.Trigger>

					<Dialog.Portal>
						<Dialog.Overlay style={styles.overlay}>
							<Dialog.Content style={styles.dialogContent}>
								<H4>Join a Company</H4>
								<Paragraph>
									Enter the company invitation code to join.
								</Paragraph>
								<Fieldset gap="$4" horizontal>
									<Label width={100} justifyContent="flex-end" htmlFor="id">
										Invitation Code
									</Label>
									<Input
										flex={1}
										id="id"
										placeholder="Enter company code"
										value={companyId}
										onChangeText={setCompanyId}
										style={styles.inputField}
									/>
								</Fieldset>
								<XStack alignSelf="flex-end" gap="$4" marginTop="$4">
									<Dialog.Close asChild>
										<Button theme="red_active" onPress={handleJoinCompany}>
											Join
										</Button>
									</Dialog.Close>
								</XStack>
								<Unspaced>
									<Dialog.Close asChild>
										<Button
											position="absolute"
											top={10}
											right={10}
											size="$3"
											circular
											icon={<Feather name="x-circle" size={24} color="black" />}
										/>
									</Dialog.Close>
								</Unspaced>
							</Dialog.Content>
						</Dialog.Overlay>
					</Dialog.Portal>
				</Dialog>
			</View>
		</View>
	);
}
