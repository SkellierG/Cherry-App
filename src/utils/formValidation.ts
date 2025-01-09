//@ts-ignore
import { ValidationResult } from "@types/Auth";
import i18n from "@services/translations";

function validateMinLength(
	value: string,
	minLength: number,
	fieldName: string,
): ValidationResult {
	if (value.length < minLength) {
		return {
			isValid: false,
			errorMessage: i18n.t(`auth.validation.${fieldName}.tooShort`, {
				minLength,
			}),
		};
	}
	return { isValid: true };
}

function validateAlpha(value: string, fieldName: string): ValidationResult {
	const alphaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
	if (!alphaRegex.test(value)) {
		return {
			isValid: false,
			errorMessage: i18n.t(`auth.validation.${fieldName}.invalid`),
		};
	}
	return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!email) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.email.empty"),
		};
	}

	if (!emailRegex.test(email)) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.email.invalid"),
		};
	}

	return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
	const minLength = 8; // Longitud mínima
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	if (!password) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.password.empty"),
		};
	}

	const minLengthValidation = validateMinLength(
		password,
		minLength,
		"password",
	);
	if (!minLengthValidation.isValid) return minLengthValidation;

	if (!hasUpperCase) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.password.missingUppercase"),
		};
	}

	if (!hasLowerCase) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.password.missingLowercase"),
		};
	}

	if (!hasNumber) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.password.missingNumber"),
		};
	}

	if (!hasSpecialChar) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.password.missingSpecialChar"),
		};
	}

	return { isValid: true };
}

export function validateName(
	name: string,
	type: "name" | "lastname",
): ValidationResult {
	const minLength = 3;

	if (!name) {
		return {
			isValid: false,
			errorMessage: i18n.t(`auth.validation.${type}.empty`),
		};
	}

	const minLengthValidation = validateMinLength(name, minLength, "name");
	if (!minLengthValidation.isValid) return minLengthValidation;

	const alphaValidation = validateAlpha(name, "name");
	if (!alphaValidation.isValid) return alphaValidation;

	return { isValid: true };
}
