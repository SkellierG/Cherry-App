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
	editable?: boolean;
	text?: string;
	customStyle?: any;
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
	editable,
	text,
	customStyle,
	onChangeText = (text) => setValue?.(text as T),
}: AuthTextInputProps<T>) => {
	return (
		<View className={windView}>
			<TextInput
				style={StyleSheet.create(customStyle)?.input || styles.input}
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
				editable={editable}
				value={text}
			/>
			{stateFormError && (
				<HelperText
					style={styles.helperText}
					type="error"
					visible={Boolean(stateFormError)}
				>
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
	helperText: {
		color: "red",
	},
});
