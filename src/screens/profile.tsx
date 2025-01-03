import { View, Text, Alert } from "react-native";
import { Button } from "tamagui";
import React, { useState } from "react";
import i18n from "@utils/translations";
import AuthTextInput from "@components/AuthTextInput";
import { router } from "expo-router";
import { validateName } from "@utils/checkFormsData";
import { useUser } from "@contexts/user";
import { supabase } from "@utils/supabase";

export default function ProfileScreen() {
	const { userState, userDispatch } = useUser();

	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState("");
	const [lastname, setLastname] = useState("");

	const [nameFormError, setNameFormError] = useState("");
	const [lastnameFormError, setLastnameFormError] = useState("");

	function validateFields() {
		const { isValid: isValidName, errorMessage: errorMessageName } =
			validateName(name);
		const { isValid: isValidLastname, errorMessage: errorMessageLastname } =
			validateName(lastname);

		if (!isValidName) {
			setNameFormError(errorMessageName || "");
			return false;
		}
		if (!isValidLastname) {
			setLastnameFormError(errorMessageLastname || "");
			return false;
		}

		setNameFormError("");
		setLastnameFormError("");

		return true;
	}
	async function completeProfile() {
		if (!validateFields()) return;

		try {
			if (userState.user?.id) {
				const { error: updateError } = await supabase
					.from("profiles")
					.update({ is_profiled: true })
					.eq("id", userState.user.id);

				if (updateError) {
					console.error("Error updating profiles:", updateError);
					throw updateError;
				}
				userDispatch({
					type: "PROFILE",
				});
				router.replace("/home");
			} else throw new Error("User id not found");
		} catch (error) {
			Alert.alert("Unexpected error", JSON.stringify(error, null, 2));
		}
	}

	return (
		<View className="mt-20">
			<AuthTextInput
				placeholder={i18n.t("auth.name")}
				stateFormError={nameFormError}
				setValue={setName}
				maxLength={40}
				autoCapitalize="words"
				autoComplete="name"
				textContentType="name"
			></AuthTextInput>
			<AuthTextInput
				placeholder={i18n.t("auth.lastname")}
				stateFormError={lastnameFormError}
				setValue={setLastname}
				maxLength={40}
				autoCapitalize="words"
				autoComplete="name"
				textContentType="familyName"
			></AuthTextInput>
			<AuthTextInput
				text={userState.user?.email}
				editable={false}
				customStyle={{ input: { backgroundColor: "lightgray" } }}
			></AuthTextInput>
			<View className="pl-3 pr-3">
				<Button disabled={isLoading} onPress={completeProfile}>
					{i18n.t("auth.Complete_profile")}
				</Button>
			</View>
			<View className="mt-4 flex items-center justify-center">
				<Text className="text-center">
					{i18n.t("auth.In_other_moment")}
					<Text
						className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
						disabled={isLoading}
						onPress={() => router.replace("/auth/sign-in")}
					>
						{i18n.t("auth.Sign_in")}
					</Text>
				</Text>
			</View>
		</View>
	);
}
