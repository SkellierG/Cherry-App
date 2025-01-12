import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AuthForm from "@components/auth/AuthForm";
import { validateEmail, validatePassword } from "@utils/formValidation";
import i18n from "@services/translations";
import { useSignIn } from "@hooks/useSignIn";

export default function CompanyCreateScreen() {
	const [name, setName] = useState("");
	const [slogan, setSlogan] = useState("");
	const [description, setDescription] = useState("");
	const [email, setEmail] = useState("");
	const [number, setNumber] = useState("");
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const { isLoading, handleSignIn } = useSignIn();

	const validateFields = () => {
		const errors: Record<string, string> = {};

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateFields()) return;
	};

	return (
		<AuthForm
			fields={[
				{
					name: "name",
					placeholder: i18n.t("auth.name"),
					setValue: setName,
					error: formErrors.name,
					autoComplete: "name",
					textContentType: "name",
				},
				{
					name: "slogan",
					placeholder: i18n.t("auth.slogan"),
					setValue: setSlogan,
					error: formErrors.slogan,
					autoCapitalize: "words",
				},
				{
					name: "description",
					placeholder: i18n.t("auth.description"),
					setValue: setDescription,
					error: formErrors.description,
					autoCapitalize: "words",
				},
				{
					name: "email",
					placeholder: i18n.t("auth.example_email"),
					setValue: setEmail,
					error: formErrors.email,
					autoComplete: "email",
					textContentType: "emailAddress",
				},
				{
					name: "number",
					placeholder: i18n.t("auth.number"),
					setValue: setNumber,
					error: formErrors.number,
					autoComplete: "tel",
					textContentType: "telephoneNumber",
				},
			]}
			isLoading={isLoading}
			submitLabel={i18n.t("auth.Create_company")}
			onSubmit={handleSubmit}
		/>
	);
}
