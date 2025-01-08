import React from "react";
import { View, Text } from "react-native";
import { Button } from "tamagui";
import AuthTextInput from "@components/AuthTextInput";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
//@ts-ignore
import { AuthFormProps } from "@types/Auth";

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
	const styles = useDynamicStyles(() => ({
		formContainer: {
			marginTop: 20,
		},
		buttonContainer: {
			paddingHorizontal: 12,
		},
		redirectContainer: {
			marginTop: 16,
			alignItems: "center",
			justifyContent: "center",
		},
		redirectText: {
			color: "black",
			fontSize: 14,
		},
		redirectLink: {
			textDecorationLine: "underline",
			color: "blue",
			fontWeight: "bold",
		},
	}));

	return (
		<View style={styles.formContainer}>
			{fields.map((field, index) => (
				<AuthTextInput
					key={field.name || index.toString()}
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
			))}
			<View style={styles.buttonContainer}>
				<Button theme={"red_active"} disabled={isLoading} onPress={onSubmit}>
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
