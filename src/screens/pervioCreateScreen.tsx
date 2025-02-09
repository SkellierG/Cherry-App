import React, { useState } from "react";
import { Alert } from "react-native";
import AuthForm from "@components/auth/AuthForm";
import { validateCompanyName } from "@utils/formValidation";
import i18n from "@services/translations";
import { PreviosControllerSupabase } from "@modules/previos/previosController";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";

export default function PrevioCreateScreen() {
	const params = useLocalSearchParams();

	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	const validateFields = () => {
		const errors: Record<string, string> = {};

		const nameValidation = validateCompanyName(name);
		if (!nameValidation.isValid)
			errors.name = nameValidation.errorMessage || "";

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateFields()) return;

		setIsLoading(true);

		try {
			console.log(params.company_id);
			console.log(date);
			if (!params.company_id) throw new Error("company_id not found");
			await PreviosControllerSupabase.createPrevioByCompanyIdWithCache(
				//@ts-ignore
				params.company_id as string,
				name,
				date,
			);
			router.back();
		} catch (error: any) {
			Alert.alert("Unexpected error", error);
		} finally {
			setIsLoading(false);
			return;
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
					autoCapitalize: "words",
				},
				{
					name: "date",
					type: "date",
					text: date,
					setValue: setDate,
				},
			]}
			isLoading={isLoading}
			submitLabel={i18n.t("auth.Create_previo")}
			onSubmit={handleSubmit}
		/>
	);
}
