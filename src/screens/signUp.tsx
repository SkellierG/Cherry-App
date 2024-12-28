import React, { useState } from "react";
import { Alert, View, Text } from "react-native";
import { supabase } from "@utils/supabase";
import { useRouter } from "expo-router";
import i18n from "@utils/translations";
import AuthTextInput from "@components/AuthTextInput";
import { Button } from "tamagui";

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
		if (!name) {
			setNameFormError(i18n.t("auth.Name_required"));
			return false;
		}
		if (!lastname) {
			setLastnameFormError(i18n.t("auth.Lastname_required"));
			return false;
		}
		if (!email) {
			setEmailFormError(i18n.t("auth.Email_required"));
			return false;
		}
		if (!password) {
			setPasswordFormError(i18n.t("auth.Password_required"));
			return false;
		}
		if (!confirmPassword) {
			setConfirmPasswordFormError(i18n.t("auth.Confirmpassword_required"));
			return false;
		}
		if (password !== confirmPassword) {
			setPasswordFormError(i18n.t("auth.passwod_dont_match"));
			setConfirmPasswordFormError(i18n.t("auth.passwod_dont_match"));
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

		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					avatar_url: null,
					full_name: `${name} ${lastname}`,
					email: email,
				},
			},
		});
		console.log(data);
		if (error) {
			Alert.alert(error.message);
			console.error(
				"code",
				error?.code,
				"message",
				error?.message,
				"name",
				error?.name,
				"stack",
				error?.stack,
				"status",
				error?.status,
			);
		}
		if (data.session)
			Alert.alert("Please check your inbox for email verification!");
		setLoading(false);
	}

	return (
		<View className="mt-20">
			<AuthTextInput
				placeholder={i18n.t("auth.name")}
				stateErrorForm={nameFormError}
				onChangeText={(nam) => setName(nam)}
			></AuthTextInput>
			<AuthTextInput
				placeholder={i18n.t("auth.lastname")}
				stateErrorForm={lastnameFormError}
				onChangeText={(las) => setLastname(las)}
			></AuthTextInput>
			<AuthTextInput
				placeholder={i18n.t("auth.example_email")}
				stateErrorForm={emailFormError}
				onChangeText={(ema) => setEmail(ema)}
			></AuthTextInput>
			<AuthTextInput
				placeholder={i18n.t("auth.password")}
				stateErrorForm={passwordFormError}
				onChangeText={(pass) => setPassword(pass)}
			></AuthTextInput>
			<AuthTextInput
				placeholder={i18n.t("auth.confirm_password")}
				stateErrorForm={confirmPasswordFormError}
				onChangeText={(pass) => setConfirmPassword(pass)}
			></AuthTextInput>
			<View className="pl-3 pr-3">
				<Button disabled={isLoading} onPress={signUpWithEmail}>
					{i18n.t("auth.Sign_up")}
				</Button>
			</View>
			<View className="mt-4 flex items-center justify-center">
				<Text>
					{i18n.t("auth.Already_have_an_account")}
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
