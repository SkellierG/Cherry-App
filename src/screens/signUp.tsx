import React, { useState } from "react";
import { Alert, View, Text } from "react-native";
import { supabase } from "@utils/supabase";
import { useRouter } from "expo-router";
import i18n from "@utils/translations";
import AuthTextInput from "@components/AuthTextInput";
import { Button } from "tamagui";
import {
	validateEmail,
	validateName,
	validatePassword,
} from "@utils/checkFormsData";
import constants from "@utils/constants";

export default function SignUpScreen() {
	const [name, setName] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [nameFormError, setNameFormError] = useState("");
	const [lastnameFormError, setLastnameFormError] = useState("");
	const [emailFormError, setEmailFormError] = useState("");
	const [passwordFormError, setPasswordFormError] = useState("");
	const [confirmPasswordFormError, setConfirmPasswordFormError] = useState("");

	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	function validateFields() {
		const { isValid: isValidName, errorMessage: errorMessageName } =
			validateName(name);
		const { isValid: isValidLastname, errorMessage: errorMessageLastname } =
			validateName(lastname);
		const { isValid: isValidEmail, errorMessage: errorMessageEmail } =
			validateEmail(email);
		const { isValid: isValidPassword, errorMessage: errorMessagePassword } =
			validatePassword(password);
		const {
			isValid: isValidConfirmPassword,
			errorMessage: errorMessageConfirmPassword,
		} = validatePassword(confirmPassword);

		if (!isValidName) {
			setNameFormError(errorMessageName || "");
			return false;
		}
		if (!isValidLastname) {
			setLastnameFormError(errorMessageLastname || "");
			return false;
		}
		if (!isValidEmail) {
			setEmailFormError(errorMessageEmail || "");
			return false;
		}
		if (!isValidPassword) {
			setPasswordFormError(errorMessagePassword || "");
			return false;
		}
		if (!isValidConfirmPassword) {
			setConfirmPasswordFormError(errorMessageConfirmPassword || "");
			return false;
		}

		if (password !== confirmPassword) {
			const trans = i18n.t("auth.validation.password_match");
			setPasswordFormError(trans);
			setConfirmPasswordFormError(trans);
			return false;
		}

		setNameFormError("");
		setLastnameFormError("");
		setEmailFormError("");
		setPasswordFormError("");
		setConfirmPasswordFormError("");
		return true;
	}

	async function signUpWithEmail() {
		if (!validateFields()) return;

		Alert.alert("dev: EMAIL SIGN UP IS NOT SUPPORTED YET!");
		setLoading(false);
		return;

		setLoading(true);

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: `${constants.baseAdress}/auth/email-validation`,
				data: {
					avatar_url: null,
					full_name: `${name} ${lastname}`,
					email: email,
				},
			},
		});

		console.log("Sign-up response:", JSON.stringify(data, null, 2));
		setLoading(false);

		if (data && data.user) {
			console.log(
				"Identities array:",
				JSON.stringify(data.user.identities, null, 2),
			);

			if (data.user.identities && data.user.identities.length > 0) {
				console.log("Sign-up successful!");
			} else {
				console.log("Email address is already taken.");
				router.push("/auth/email-verification");
			}
		} else {
			console.error("An error occurred during sign-up:", error?.message);
		}

		setLoading(false);
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
				placeholder={i18n.t("auth.example_email")}
				stateFormError={emailFormError}
				setValue={setEmail}
				maxLength={320}
				autoComplete="email"
				textContentType="emailAddress"
			></AuthTextInput>
			<AuthTextInput
				placeholder={i18n.t("auth.password")}
				stateFormError={passwordFormError}
				setValue={setPassword}
				maxLength={64}
				autoComplete="password"
				textContentType="password"
				secureTextEntry
			></AuthTextInput>
			<AuthTextInput
				placeholder={i18n.t("auth.confirm_password")}
				stateFormError={confirmPasswordFormError}
				setValue={setConfirmPassword}
				maxLength={64}
				autoComplete="password"
				textContentType="password"
				secureTextEntry
			></AuthTextInput>
			<View className="pl-3 pr-3">
				<Button
					theme={"red_active"}
					disabled={isLoading}
					onPress={signUpWithEmail}
				>
					{i18n.t("auth.Sign_up")}
				</Button>
			</View>
			<View className="mt-4 flex items-center justify-center">
				<Text className="text-default">
					{i18n.t("auth.Already_have_an_account")}
					<Text
						className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
						disabled={isLoading}
						onPress={() => {
							router.dismiss();
						}}
					>
						{i18n.t("auth.Sign_in")}
					</Text>
				</Text>
			</View>
		</View>
	);
}
