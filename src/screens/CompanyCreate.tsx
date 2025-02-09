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
import { supabase } from "@services/supabase";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

async function uriToBuffer(uri: string): Promise<Buffer> {
	try {
		console.info("URI:", uri);
		const base64 = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.Base64,
		});
		console.info("base64", base64);
		const buffer = Buffer.from(base64, "base64");
		console.info("buffer", buffer);
		return buffer;
	} catch (error: any) {
		console.error("uriToBuffer error", error);
		throw error;
	}
}

async function uploadAvatarToSupabase(uri: string): Promise<string> {
	try {
		console.log("URI:", uri);
		const buffer = await uriToBuffer(uri);
		console.log("Buffer obtenido:", buffer);

		let fileExt = uri.split(".").pop();
		if (!fileExt) {
			fileExt = "jpeg";
		}
		const fileName = `${Math.floor(Math.random() * 1e16)}.${fileExt}`;
		const filePath = fileName;
		console.log("Subiendo archivo:", filePath);

		const { data, error } = await supabase.storage
			.from("avatars")
			.upload(filePath, buffer, {
				contentType: "image/jpeg",
			});

		if (error) {
			throw error;
		}
		console.log("Archivo subido en:", data?.path);
		return data.path;
	} catch (error: any) {
		throw new Error(`Error uploading image: ${error.message}`);
	}
}

export default function CompanyCreateScreen() {
	const { isLoading, handleCreateCompany } = useCompany();

	const [name, setName] = useState("");
	const [slogan, setSlogan] = useState("");
	const [description, setDescription] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [image, setImage] = useState("");
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	const validateFields = () => {
		console.log("Validando campos...");
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
		console.log("Enviando formulario...");

		try {
			let uploadedAvatarPath = image;
			if (image && image !== "https://placehold.co/400") {
				uploadedAvatarPath = await uploadAvatarToSupabase(image);
			}
			await handleCreateCompany(
				name,
				slogan,
				description,
				email,
				phone,
				uploadedAvatarPath,
			);
		} catch (error: any) {
			Alert.alert("Unexpected error", error.message);
			throw error;
		}
	};

	return (
		<AuthForm
			fields={[
				{
					name: "avatar",
					type: "image",
					text: image,
					setValue: setImage,
				},
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
