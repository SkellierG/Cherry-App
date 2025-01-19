import { Dispatch, SetStateAction } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Props as TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";

export type ValidationResult = {
	isValid: boolean;
	errorMessage?: string;
};

export type SetValue<T> = Dispatch<SetStateAction<T>> | null;

export interface AuthTextInputProps<T> {
	placeholder?: string;
	stateFormError?: string | null;
	setValue?: SetValue<T>;
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

/**
 * AuthFormProps - Interface for the properties of the `AuthForm` component.
 *
 * This interface defines the properties that the `AuthForm` component accepts. Its main purpose is to provide a type for a dynamic form structure with support for validations, redirections, and customization.
 *
 * @template T - The type of the form field values. It allows the data in the form fields to be typed flexibly.
 */
export interface AuthFormProps<T> {
	/**
	 * An array of objects that defines each field in the form.
	 * Each field can have various customizable properties such as name, placeholder, values, and validation rules.
	 *
	 * @type {Array}
	 */
	fields: {
		/**
		 * The unique name of the field. It is used as the key to identify the field in the form.
		 *
		 * @type {string}
		 */
		name: string;

		/**
		 * The transparent placeholder text that appears in the input field when it is empty.
		 *
		 * @type {string}
		 */
		placeholder?: string;

		/**
		 * An optional value that can set a predefined text that appears in the input field.
		 * It can be used to show default values or other purposes like field descriptions.
		 *
		 * @type {string}
		 * @optional
		 */
		text?: string;

		/**
		 * A function used to update the field value. It should be a setter function that modifies the value of a state.
		 * It's important to keep the component in sync with its external state.
		 *
		 * @type {SetValue<T>}
		 */
		setValue?: SetValue<T>;

		/**
		 * An optional error message that is displayed if the field has a validation issue.
		 * If not provided, the field will not show any errors.
		 *
		 * @type {string}
		 * @optional
		 */
		error?: string;

		/**
		 * Determines if the field is a secure input (e.g., passwords).
		 * If true, the text will be hidden for security reasons.
		 *
		 * @type {boolean}
		 * @optional
		 */
		secureTextEntry?: boolean;

		/**
		 * Controls the automatic capitalization of the entered text.
		 * It can be set to "none", "sentences", "words", or "characters".
		 *
		 * @type {TextInputProps["autoCapitalize"]}
		 * @optional
		 */
		autoCapitalize?: TextInputProps["autoCapitalize"];

		/**
		 * Defines the autocomplete behavior of the input field.
		 * This helps browsers or devices to autocomplete common data like emails or addresses.
		 *
		 * @type {TextInputProps["autoComplete"]}
		 * @optional
		 */
		autoComplete?: TextInputProps["autoComplete"];

		/**
		 * Defines the type of content expected in the input field, such as "emailAddress", "password", etc.
		 * It helps devices and browsers understand what kind of data is expected.
		 *
		 * @type {TextInputProps["textContentType"]}
		 * @optional
		 */
		textContentType?: TextInputProps["textContentType"];

		/**
		 * Limits the maximum length of the text the user can enter in the field.
		 *
		 * @type {number}
		 * @optional
		 */
		maxLength?: number;

		/**
		 * Determines whether the input field is editable or not.
		 * If false, the user will not be able to modify the value of the field.
		 *
		 * @type {boolean}
		 * @optional
		 */
		editable?: boolean;

		/**
		 * Allows customizing the style of various parts of the field, such as the input, the container, and the helper text.
		 * - `input`: Style for the text input field.
		 * - `container`: Style for the container of the field.
		 * - `helperText`: Style for the helper or error text.
		 *
		 * @type {Object}
		 * @optional
		 */
		customStyle?: {
			input?: StyleProp<TextStyle>;
			container?: StyleProp<ViewStyle>;
			helperText?: StyleProp<TextStyle>;
		};

		/**
		 * Name for the container view to customize style (optional).
		 *
		 * @type {string}
		 * @optional
		 */
		windView?: string;

		/**
		 * Name for the text input view to customize style (optional).
		 *
		 * @type {string}
		 * @optional
		 */
		windTextInput?: string;

		/**
		 * A function that is called each time the text in the field changes.
		 * It allows performing additional actions on the text as it updates.
		 *
		 * @type {(text: string) => void}
		 * @optional
		 */
		onChangeText?: (text: string) => void;
	}[];

	/**
	 * Indicates if the form is in a loading state (e.g., when the information is being submitted).
	 *
	 * @type {boolean}
	 */
	isLoading: boolean;

	/**
	 * The text displayed on the submit button of the form.
	 *
	 * @type {string}
	 */
	submitLabel: string;

	/**
	 * A function executed when the user presses the submit button.
	 *
	 * @type {Function}
	 */
	onSubmit: () => void;

	/**
	 * The text displayed to indicate a redirection link. Typically used to guide the user to another screen (optional).
	 *
	 * @type {string}
	 * @optional
	 */
	redirectText?: string;

	/**
	 * The text displayed on the redirection link (optional).
	 *
	 * @type {string}
	 * @optional
	 */
	redirectLinkLabel?: string;

	/**
	 * A function executed when the user clicks the redirection link (optional).
	 *
	 * @type {Function}
	 * @optional
	 */
	onRedirect?: () => void;
}

export const StorageKeys = {
	USER: "user",
	SESSION: "session",
	PROFILE: "profile",
	JWT: "jwt",
	COMPANIES: "companies",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export interface StorageInterface {
	/**
	 * Retrieves an item from storage.
	 *
	 * @param key - The key of the item to retrieve.
	 * @param type - The expected type of the item ("string", "number", or "boolean").
	 * @returns The value of the item, or `null` if the item is not found.
	 * @throws {Error} An error if the type is not "string", "number", or "boolean".
	 */
	getItem(
		key: StorageKey,
		type: "string" | "number" | "boolean",
	):
		| (string | undefined)
		| (number | undefined)
		| (boolean | undefined)
		| undefined;

	/**
	 * Stores an item in storage.
	 *
	 * @param key - The key to associate with the stored value.
	 * @param value - The value to store.
	 * @returns Nothing.
	 */
	setItem(key: StorageKey, value: any): void;

	/**
	 * Removes an item from storage.
	 *
	 * @param key - The key of the item to remove.
	 * @returns Nothing.
	 */
	removeItem(key: StorageKey): void;

	/**
	 * Removes an item from storage.
	 *
	 * @returns Nothing.
	 */
	clear(): void;
}
