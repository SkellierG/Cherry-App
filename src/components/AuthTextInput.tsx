import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, HelperText, TextInputProps } from "react-native-paper";

type setValue<T> = Dispatch<SetStateAction<T>> | null;

interface AuthTextInputProps<T> {
	placeholder?: string;
	stateFormError?: string | null;
	setValue?: setValue<T>;
	windView?: string;
	windTextInput?: string;
	maxLength?: number;
	autoCapitalize?: TextInputProps["autoCapitalize"];
	autoComplete?: TextInputProps["autoComplete"];
	textContentType?: TextInputProps["textContentType"];
	secureTextEntry?: boolean;
	onChangeText?: (text: string) => void;
}

const AuthTextInput = <T extends unknown>({
	placeholder = "Enter text",
	stateFormError = null,
	setValue = null,
	windView = "mb-4 pl-3 pr-3",
	windTextInput = "",
	maxLength = 100,
	autoCapitalize = "none",
	autoComplete,
	textContentType,
	secureTextEntry,
	onChangeText = (text) => setValue?.(text as T),
}: AuthTextInputProps<T>) => {
	return (
		<View className={windView}>
			<TextInput
				style={styles.input}
				className={windTextInput}
				mode="outlined"
				placeholder={placeholder}
				onChangeText={onChangeText}
				error={Boolean(stateFormError)}
				maxLength={maxLength}
				autoCapitalize={autoCapitalize}
				autoComplete={autoComplete}
				textContentType={textContentType}
				secureTextEntry={secureTextEntry}
			/>
			{stateFormError && (
				<HelperText type="error" visible={Boolean(stateFormError)}>
					{stateFormError}
				</HelperText>
			)}
		</View>
	);
};

export default AuthTextInput;

const styles = StyleSheet.create({
	input: {
		backgroundColor: "white",
	},
});
