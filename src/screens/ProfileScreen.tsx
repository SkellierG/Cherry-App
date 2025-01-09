import React, { useEffect, useState } from "react";
import AuthForm from "@components/AuthForm";
import { validateName } from "@utils/formValidation";
import i18n from "@services/translations";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import DeviceStorage from "@utils/deviceStorage";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@hooks/useProfile";
import { Alert } from "react-native";

export default function ProfileScreen() {
	const [name, setName] = useState("");
	const [lastname, setLastname] = useState("");

	const [email, setEmail] = useState("");

	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const { isLoading, handleProfile } = useProfile();

	const styles = useDynamicStyles((theme) => ({
		input: {
			backgroundColor: theme === "dark" ? "#555555" : "#cccccccc",
		},
	}));

	const validateFields = () => {
		const errors: Record<string, string> = {};

		const nameValidation = validateName(name, "name");

		const lastnameValidation = validateName(lastname, "lastname");
		if (!nameValidation.isValid)
			errors.name = nameValidation.errorMessage || "";
		if (!lastnameValidation.isValid)
			errors.lastname = lastnameValidation.errorMessage || "";

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	useEffect(() => {}, []);

	const handleSubmit = async () => {
		if (!validateFields()) return;
		console.log("chao");
		try {
			await handleProfile(name, lastname);
		} catch (error: any) {
			Alert.alert("Unable to Profile. Please try again.", error.message);
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
					autoCapitalize: "words",
					autoComplete: "name",
					textContentType: "name",
				},
				{
					name: "password",
					placeholder: i18n.t("auth.lastname"),
					setValue: setLastname,
					error: formErrors.lastname,
					secureTextEntry: true,
					autoCapitalize: "words",
					autoComplete: "family-name",
					textContentType: "familyName",
				},
				{
					name: "email",
					setValue: setEmail,
					error: formErrors.email,
					autoComplete: "email",
					textContentType: "emailAddress",
					editable: false,
					customStyle: styles,
				},
			]}
			isLoading={isLoading}
			submitLabel={i18n.t("auth.Confirm")}
			redirectText={i18n.t("auth.Dont_have_an_account")}
			onSubmit={handleSubmit}
		/>
	);
}
