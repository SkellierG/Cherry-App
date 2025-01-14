import React from "react";
import { View, TextStyle } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
//@ts-ignore
import { AuthTextInputProps } from "@types/Components";

const AuthTextInput = <T extends unknown>({
	placeholder = "Enter text",
	text,
	setValue = null,
	stateFormError = null,
	secureTextEntry = false,
	maxLength = 100,
	autoCapitalize = "none",
	autoComplete,
	textContentType,
	editable = true,
	customStyle = {},
	onChangeText = (text) => setValue?.(text as T),
	windView = "",
	windTextInput = "",
}: AuthTextInputProps<T>) => {
	const styles = useDynamicStyles((theme) => ({
		input: {
			backgroundColor:
				theme === "dark" ? dark_default_theme.colors.backdrop : "#eeeeee",
		},
		helperText: {
			color: theme === "dark" ? "salmon" : "red",
		},
		container: {},
	}));

	return (
		<View
			style={customStyle?.container ? customStyle.container : styles.container}
			className={windView}
		>
			<TextInput
				style={customStyle?.input ? customStyle.input : styles.input}
				className={windTextInput}
				mode="outlined"
				placeholder={placeholder}
				value={text}
				onChangeText={onChangeText}
				error={Boolean(stateFormError)}
				maxLength={maxLength}
				autoCapitalize={autoCapitalize}
				autoComplete={autoComplete}
				textContentType={textContentType}
				secureTextEntry={secureTextEntry}
				editable={editable}
			/>
			{stateFormError && (
				<HelperText
					style={
						(customStyle?.container as TextStyle)
							? (customStyle?.container as TextStyle)
							: styles.helperText || {}
					}
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
