import React, { useState } from "react";
import AuthForm from "@components/auth/AuthForm";
import { validateName } from "@utils/formValidation";
import i18n from "@services/translations";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import { useProfile } from "@hooks/useProfile";
import { Alert } from "react-native";
import { useUser } from "@contexts/auth";

export default function ProfileScreen() {
	const { userState } = useUser();

	const [NAME, LASTNAME] = (
		userState.user?.user_metadata.full_name as string
	).split(" ");

	const [name, setName] = useState(NAME);
	const [lastname, setLastname] = useState(LASTNAME);

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

	const handleSubmit = async () => {
		if (!validateFields()) return;
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
					text: name,
					autoCapitalize: "words",
					autoComplete: "name",
					textContentType: "name",
				},
				{
					name: "password",
					placeholder: i18n.t("auth.lastname"),
					setValue: setLastname,
					error: formErrors.lastname,
					text: lastname,
					secureTextEntry: true,
					autoCapitalize: "words",
					autoComplete: "family-name",
					textContentType: "familyName",
				},
				{
					name: "email",
					text: userState.user?.email,
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
