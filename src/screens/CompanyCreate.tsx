import React, { useState } from "react";
import { Alert } from "react-native";
import AuthForm from "@components/auth/AuthForm";
import {
	validateCompanyName,
	validateDescription,
	validateEmail,
	validatePhone,
	validateSlogan,
} from "@utils/formValidation";
import i18n from "@services/translations";
import { useCompany } from "@hooks/useCompany";

export default function CompanyCreateScreen() {
	const { isLoading, handleCreateCompany } = useCompany();

	const [name, setName] = useState("");
	const [slogan, setSlogan] = useState("");
	const [description, setDescription] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	const validateFields = () => {
		const errors: Record<string, string> = {};

		const nameValidation = validateCompanyName(name);
		const sloganValidation = validateSlogan(slogan);
		const descriptionValidation = validateDescription(description);
		const emailValidation = validateEmail(email);
		const phoneValidation = validatePhone(phone);
		if (!nameValidation.isValid)
			errors.name = nameValidation.errorMessage || "";
		if (!sloganValidation.isValid)
			errors.slogan = sloganValidation.errorMessage || "";
		if (!descriptionValidation.isValid)
			errors.description = descriptionValidation.errorMessage || "";
		if (!emailValidation.isValid)
			errors.email = emailValidation.errorMessage || "";
		if (!phoneValidation.isValid)
			errors.phone = phoneValidation.errorMessage || "";

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateFields()) return;

		try {
			await handleCreateCompany(
				name,
				slogan,
				description,
				email,
				phone,
				"https://placehold.co/200x200/png",
			);
		} catch (error: any) {
			Alert.alert("Unexpected error", error);
			throw error;
		}
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
					name: "phone",
					placeholder: i18n.t("auth.phone"),
					setValue: setPhone,
					error: formErrors.phone,
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
