import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AuthForm from "@components/AuthForm";
import { validateEmail, validatePassword } from "@utils/formValidation";
import i18n from "@services/translations";
import { useSignIn } from "@hooks/useSignIn";

export default function SignInScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const { isLoading, handleSignIn } = useSignIn();

	const validateFields = () => {
		const errors: Record<string, string> = {};

		const passwordValidation = validatePassword(password);

		const emailValidation = validateEmail(email);
		if (!emailValidation.isValid)
			errors.email = emailValidation.errorMessage || "";
		if (!passwordValidation.isValid)
			errors.password = passwordValidation.errorMessage || "";

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateFields()) return;

		try {
			await handleSignIn(email, password);
		} catch (error: any) {
			Alert.alert("Unable to sign in. Please try again.", error.message);
		}
	};

	return (
		<AuthForm
			fields={[
				{
					name: "email",
					placeholder: i18n.t("auth.example_email"),
					setValue: setEmail,
					error: formErrors.email,
					autoComplete: "email",
					textContentType: "emailAddress",
				},
				{
					name: "password",
					placeholder: i18n.t("auth.password"),
					setValue: setPassword,
					error: formErrors.password,
					secureTextEntry: true,
					autoComplete: "password",
					textContentType: "password",
				},
			]}
			isLoading={isLoading}
			submitLabel={i18n.t("auth.Sign_in")}
			onSubmit={handleSubmit}
			redirectText={i18n.t("auth.Dont_have_an_account")}
			redirectLinkLabel={i18n.t("auth.Sign_up")}
			onRedirect={() => router.push("/auth/sign-up")}
		/>
	);
}
