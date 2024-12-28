import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, HelperText } from "react-native-paper";

interface AuthTextInputProps {
	placeholder?: string;
	stateErrorForm?: string | null;
	value?: string;
	windView?: string;
	windTextInput?: string;
	onChangeText?: (text: string) => void;
}

const AuthTextInput: React.FC<AuthTextInputProps> = ({
	placeholder = "Enter text",
	stateErrorForm = null,
	value,
	windView = "mb-4 pl-3 pr-3",
	windTextInput = "",
	onChangeText,
}) => {
	return (
		<View className={windView}>
			<TextInput
				style={styles.input}
				className={windTextInput}
				mode="outlined"
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				error={!!stateErrorForm}
			/>
			{stateErrorForm && (
				<HelperText type="error" visible={!!stateErrorForm}>
					{stateErrorForm}
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
