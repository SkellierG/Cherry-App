import React, { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@utils/supabase";
import { useRouter } from "expo-router";
import i18n from "@utils/translations";
import { useUser } from "@contexts/user";
import { Button } from "tamagui";
import { Text, View } from "react-native";
import AuthTextInput from "@components/AuthTextInput";
import { validateEmail, validatePassword } from "@utils/checkFormsData";

export default function SignInScreen() {
	const router = useRouter();
	const { userDispatch } = useUser();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailFormError, setEmailFormError] = useState("");
	const [passwordFormError, setPasswordFormError] = useState("");
	const [isLoading, setLoading] = useState(false);

	function validateFields() {
		const { isValid: isValidEmail, errorMessage: errorMessageEmail } =
			validateEmail(email);
		const { isValid: isValidPassword, errorMessage: errorMessagePassword } =
			validatePassword(password);

		if (!isValidEmail) {
			setEmailFormError(errorMessageEmail || "");
			return false;
		}
		if (!isValidPassword) {
			setPasswordFormError(errorMessagePassword || "");
			return false;
		}

		setEmailFormError("");
		setPasswordFormError("");
		return true;
	}

	async function signInWithSupabase() {
		try {
			if (!validateFields()) return;

			setLoading(true);

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				Alert.alert(i18n.t("auth.Login_failed"), error.message);
				return;
			}

			const user = data?.user;
			if (!user) {
				Alert.alert(i18n.t("auth.Login_failed"), i18n.t("auth.Unexpected_error"));
				return;
			}

			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("is_oauth, is_profiled")
				.eq("id", user.id)
				.single();
			if (profileError || !profile) {
				Alert.alert(
					i18n.t("auth.Profile_error"),
					profileError?.message || i18n.t("auth.Profile_not_found"),
				);
				return;
			}

			userDispatch({ type: "SIGNIN", payload: user });

			if (profile.is_profiled) {
				userDispatch({ type: "PROFILE" });
				router.replace("/home");
			} else {
				router.replace("/auth/profile");
			}
		} catch (error: any) {
			console.error(error);
			Alert.alert(i18n.t("auth.Unexpected_error"), error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View className=" mt-20">
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
			<View className="pl-3 pr-3">
				<Button disabled={isLoading} onPress={() => signInWithSupabase()}>
					{i18n.t("auth.Sign_in")}
				</Button>
			</View>
			<View className="mt-4 flex items-center justify-center">
				<Text className="text-default">
					{i18n.t("auth.Dont_have_an_account")}
					<Text
						className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
						disabled={isLoading}
						onPress={() => router.push("/auth/sign-up")}
					>
						{i18n.t("auth.Sign_up")}
					</Text>
				</Text>
			</View>
		</View>
	);
}
