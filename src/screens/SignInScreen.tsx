import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@services/supabase";
import AuthForm from "@components/AuthForm";
import { validateEmail, validatePassword } from "@utils/formValidation";
import i18n from "@services/translations";
import DeviceStorage from "@utils/deviceStorage";
import { useUser } from "@contexts/user";

export default function SignInScreen() {
	const router = useRouter();
	const { userDispatch } = useUser();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [isLoading, setLoading] = useState(false);

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
			setLoading(true);

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw new Error(error.message);

			const user = data?.user;
			if (!user) {
				Alert.alert(
					i18n.t("auth.Login_failed"),
					i18n.t("auth.Unexpected_error"),
				);
				return;
			}

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("id, is_oauth, is_profiled, name, lastname, avatar_url")
				.eq("id", user.id)
				.single();

			if (!profileData || profileError) {
				Alert.alert(
					i18n.t("auth.Profile_error"),
					profileData ? profileError : i18n.t("auth.Profile_not_found"),
				);
				return;
			}

			userDispatch({
				type: "SIGNIN",
				payload: {
					user: data.user,
					session: data.session,
					isAuthenticated: true,
				},
			});

			if (profileData.is_profiled) {
				userDispatch({ type: "PROFILE", payload: profileData });
				router.replace("/home");
			} else {
				router.replace("/auth/profile");
			}

			await DeviceStorage.setItem("sessionData", JSON.stringify(data.session));
			await DeviceStorage.setItem("userData", JSON.stringify(data.user));
			await DeviceStorage.setItem("profileData", JSON.stringify(profileData));
		} catch (error: any) {
			console.error(error);
			Alert.alert(i18n.t("auth.Unexpected_error"), error.message);
		} finally {
			setLoading(false);
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
