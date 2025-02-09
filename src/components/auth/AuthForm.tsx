import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "tamagui";
import AuthTextInput from "@components/auth/AuthTextInput";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import i18n from "@services/translations";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
//@ts-ignore
import { AuthFormProps } from "@types/Components";

/**
 * AuthForm - A reusable form component to render multiple input fields with validation and a submit button.
 *
 * This component handles rendering a form with dynamic fields, custom validation errors, and a submission button.
 * It also supports redirecting the user to another screen via a redirect link.
 *
 * @template T - The type of the values in the form fields. This allows flexibility in defining the field data structure.
 * @param {Object} props - The props object.
 * @param {Array} props.fields - The array of form field configurations. Each field is an object with properties like `name`, `placeholder`, `setValue`, etc.
 * @param {boolean} props.isLoading - Indicates whether the form is in a loading state, usually when submitting data.
 * @param {string} props.submitLabel - The text displayed on the submit button.
 * @param {Function} props.onSubmit - The function that is called when the submit button is pressed.
 * @param {string} [props.redirectText] - The text to display above the redirect link (optional).
 * @param {string} [props.redirectLinkLabel] - The text to display for the redirect link (optional).
 * @param {Function} [props.onRedirect] - The function that is called when the redirect link is pressed (optional).
 *
 * @returns {JSX.Element} A JSX element that renders the dynamic form with fields and submit functionality.
 */

const AuthForm = <T extends unknown>({
	fields,
	isLoading,
	submitLabel,
	onSubmit,
	redirectText,
	redirectLinkLabel,
	onRedirect,
}: AuthFormProps<T>) => {
	// Estado interno solo para controlar la visibilidad del selector de fecha
	const [showDatePicker, setShowDatePicker] = useState(false);

	const styles = useDynamicStyles((theme) => ({
		formContainer: {
			marginTop: 40,
			paddingHorizontal: 20,
		},
		fieldContainer: {
			marginVertical: 5,
		},
		buttonContainer: {
			paddingHorizontal: 12,
			marginVertical: 10,
		},
		redirectContainer: {
			marginTop: 16,
			alignItems: "center",
			justifyContent: "center",
		},
		redirectText: {
			color: theme === "dark" ? "white" : "black",
			fontSize: 14,
		},
		redirectLink: {
			textDecorationLine: "underline",
			color: "blue",
			fontWeight: "bold",
		},
		imagePreview: {
			width: 100,
			height: 100,
			borderRadius: 50,
			marginBottom: 10,
			backgroundColor: theme === "dark" ? "white" : "black",
		},
		imageContainer: {
			alignItems: "center",
		},
		dateInput: {
			padding: 10,
			borderWidth: 1,
			borderRadius: 8,
			borderColor:
				theme === "dark"
					? dark_default_theme.colors.onBackground
					: light_default_theme.colors.onBackground,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.backdrop
					: light_default_theme.colors.backdrop,
			textAlign: "center",
			color: theme === "dark" ? "white" : "black",
		},
	}));

	// Función para seleccionar la imagen y actualizarla vía el setValue pasado en el campo
	const pickImage = async (setValue: (value: string) => void) => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		if (!result.canceled) {
			setValue(result.assets[0].uri);
		}
	};

	return (
		<View style={styles.formContainer}>
			{fields.map((field: any, index: number) => (
				<View
					key={field.name || index.toString()}
					style={styles.fieldContainer}
				>
					{field.type === "image" ? (
						<View style={styles.imageContainer}>
							<Image
								source={{
									uri: field.text || "https://placehold.co/400",
								}}
								style={styles.imagePreview}
							/>
							<Button onPress={() => pickImage(field.setValue)}>
								{i18n.t("auth.form.image")}
							</Button>
						</View>
					) : field.type === "date" ? (
						<View>
							<TouchableOpacity onPress={() => setShowDatePicker(true)}>
								<Text style={styles.dateInput}>
									{field.text ? field.text : i18n.t("auth.form.selectDate")}
								</Text>
							</TouchableOpacity>
							{showDatePicker && (
								<DateTimePicker
									value={field.text ? new Date(field.text) : new Date()}
									mode="date"
									display="default"
									onChange={(event, selectedDate) => {
										if (selectedDate) {
											field.setValue(selectedDate.toISOString().split("T")[0]);
										}
										setShowDatePicker(false);
									}}
								/>
							)}
						</View>
					) : (
						<AuthTextInput
							placeholder={field.placeholder}
							stateFormError={field.error || null}
							setValue={field.setValue}
							text={field.text}
							secureTextEntry={field.secureTextEntry}
							autoCapitalize={field.autoCapitalize}
							autoComplete={field.autoComplete}
							textContentType={field.textContentType}
							maxLength={field.maxLength}
							editable={field.editable}
							customStyle={field.customStyle}
							onChangeText={field.onChangeText}
						/>
					)}
				</View>
			))}
			<View style={styles.buttonContainer}>
				<Button theme="red_active" disabled={isLoading} onPress={onSubmit}>
					{submitLabel}
				</Button>
			</View>
			{redirectText && redirectLinkLabel && onRedirect && (
				<View style={styles.redirectContainer}>
					<Text style={styles.redirectText}>
						{redirectText}{" "}
						<Text
							style={styles.redirectLink}
							onPress={onRedirect}
							accessibilityRole="link"
						>
							{redirectLinkLabel}
						</Text>
					</Text>
				</View>
			)}
		</View>
	);
};

export default AuthForm;
