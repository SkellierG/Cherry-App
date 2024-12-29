import i18n from "@utils/translations";

type ValidationResult = {
	isValid: boolean;
	errorMessage?: string;
};

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

	if (password.length < minLength) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.password.tooShort", { minLength }),
		};
	}

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

export function validateName(name: string): ValidationResult {
	const minLength = 3; // Longitud mínima para un nombre
	const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/; // Aceptar solo letras, espacios y guiones

	if (!name) {
		return { isValid: false, errorMessage: i18n.t("auth.validation.name.empty") };
	}

	if (name.length < minLength) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.name.tooShort", { minLength }),
		};
	}

	if (!nameRegex.test(name)) {
		return {
			isValid: false,
			errorMessage: i18n.t("auth.validation.name.invalid"),
		};
	}

	return { isValid: true };
}
