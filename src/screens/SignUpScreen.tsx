import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import i18n from "@services//translations";
import {
	validateEmail,
	validateName,
	validatePassword,
} from "@utils/formValidation";
import AuthForm from "@components/AuthForm";

export default function SignUpScreen() {
	const [name, setName] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	function validateFields(): boolean {
		const errors: Record<string, string> = {};

		const nameValidation = validateName(name, "name");
		const lastnameValidation = validateName(lastname, "lastname");
		const emailValidation = validateEmail(email);
		const passwordValidation = validatePassword(password);
		const confirmPasswordValidation = validatePassword(confirmPassword);

		if (!nameValidation.isValid)
			errors.name = nameValidation.errorMessage || "";
		if (!lastnameValidation.isValid)
			errors.lastname = lastnameValidation.errorMessage || "";
		if (!emailValidation.isValid)
			errors.email = emailValidation.errorMessage || "";
		if (!passwordValidation.isValid)
			errors.password = passwordValidation.errorMessage || "";
		if (!confirmPasswordValidation.isValid)
			errors.confirmPassword = confirmPasswordValidation.errorMessage || "";
		if (password !== confirmPassword)
			errors.confirmPassword = i18n.t("auth.validation.password_match") || "";

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	}

	async function signUpWithEmail() {
		if (!validateFields()) return;

		setLoading(true);
		Alert.alert("DEV: Sign Up isnt supported yet!");
		setLoading(false);

		return;
		// try {
		// const { data, error } = await supabase.auth.signUp({
		// 	email,
		// 	password,
		// 	options: {
		// 		emailRedirectTo: `${constants.baseAdress}/auth/email-validation`,
		// 		data: {
		// 			avatar_url: null,
		// 			full_name: `${name} ${lastname}`,
		// 			email: email,
		// 		},
		// 	},
		// });

		// 	if (error) {
		// 		Alert.alert(i18n.t("auth.Sign_up_failed"), error.message);
		// 		setLoading(false);
		// 		return;
		// 	}

		// 	Alert.alert(
		// 		i18n.t("auth.Sign_up_success"),
		// 		i18n.t("auth.check_your_email"),
		// 	);
		// 	router.push("/auth/email-verification");
		// } catch (error: any) {
		// 	Alert.alert(i18n.t("auth.Unexpected_error"), error.message);
		// } finally {
		// 	setLoading(false);
		// }
	}

	return (
		<AuthForm
			fields={[
				{
					name: "name",
					placeholder: i18n.t("auth.name"),
					setValue: setName,
					error: formErrors.name,
					maxLength: 40,
					autoCapitalize: "words",
					autoComplete: "name",
					textContentType: "name",
				},
				{
					name: "lastname",
					placeholder: i18n.t("auth.lastname"),
					setValue: setLastname,
					error: formErrors.lastname,
					maxLength: 40,
					autoCapitalize: "words",
					autoComplete: "name",
					textContentType: "familyName",
				},
				{
					name: "email",
					placeholder: i18n.t("auth.example_email"),
					setValue: setEmail,
					error: formErrors.email,
					maxLength: 320,
					autoComplete: "email",
					textContentType: "emailAddress",
				},
				{
					name: "password",
					placeholder: i18n.t("auth.password"),
					setValue: setPassword,
					error: formErrors.password,
					maxLength: 64,
					secureTextEntry: true,
					autoComplete: "password",
					textContentType: "password",
				},
				{
					name: "confirmPassword",
					placeholder: i18n.t("auth.confirm_password"),
					setValue: setConfirmPassword,
					error: formErrors.confirmPassword,
					maxLength: 64,
					secureTextEntry: true,
					autoComplete: "password",
					textContentType: "password",
				},
			]}
			isLoading={isLoading}
			submitLabel={i18n.t("auth.Sign_up")}
			onSubmit={signUpWithEmail}
			redirectText={i18n.t("auth.Already_have_an_account")}
			redirectLinkLabel={i18n.t("auth.Sign_in")}
			onRedirect={() => router.push("/auth/sign-in")}
		/>
	);
}
