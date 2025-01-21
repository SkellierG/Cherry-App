//@ts-ignore
import { ValidationResult } from "@types/Components";
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

export function validateCompanyName(name: string): ValidationResult {
	const minLength = 3;

	const invalidCharsRegex = /[^a-zA-Z0-9\s,.-]/;
	if (invalidCharsRegex.test(name)) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.companyName.invalidChars"),
		};
	}

	if (!name) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.companyName.empty"),
		};
	}

	const minLengthValidation = validateMinLength(name, minLength, "companyName");
	if (!minLengthValidation.isValid) return minLengthValidation;

	return { isValid: true };
}

export function validateSlogan(slogan: string): ValidationResult {
	if (slogan && slogan.length < 3) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.slogan.tooShort", {
				minLength: 3,
			}),
		};
	}

	const invalidCharsRegex = /[^a-zA-Z0-9\s,.-]/;
	if (slogan && invalidCharsRegex.test(slogan)) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.slogan.invalidChars"),
		};
	}

	return { isValid: true };
}

export function validateDescription(description: string): ValidationResult {
	if (description && description.length < 10) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.description.tooShort", {
				minLength: 10,
			}),
		};
	}

	const invalidCharsRegex = /[^a-zA-Z0-9\s,.-]/;
	if (description && invalidCharsRegex.test(description)) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.description.invalidChars"),
		};
	}

	return { isValid: true };
}

export function validatePhone(phone: string): ValidationResult {
	if (phone && !/^[0-9]{10}$/.test(phone)) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.phone.invalid"),
		};
	}

	return { isValid: true };
}
