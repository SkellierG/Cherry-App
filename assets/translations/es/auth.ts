export default {
	name: "nombre",
	lastname: "apellido",
	example_email: "ejemplo@dominio.com",
	password: "contraseña",
	confirm_password: "confirmar contraseña",
	phone: "teléfono",
	slogan: "eslogan",
	description: "descripción",
	Sign_in: "Iniciar sesión",
	Sign_up: "Registrarse",
	Sign_out: "Cerrar sesión",
	Dont_have_an_account: "¿No tienes una cuenta? ",
	Already_have_an_account: "¿Ya tienes una cuenta? ",
	Create_company: "Crear compañia",
	validation: {
		email: {
			empty: "El correo no puede estar vacío.",
			invalid: "El formato del correo es inválido.",
		},
		password: {
			empty: "La contraseña no puede estar vacía.",
			tooShort: "La contraseña debe tener al menos {{minLength}} caracteres.",
			missingUppercase:
				"La contraseña debe contener al menos una letra mayúscula.",
			missingLowercase:
				"La contraseña debe contener al menos una letra minúscula.",
			missingNumber: "La contraseña debe contener al menos un número.",
			missingSpecialChar:
				"La contraseña debe contener al menos un carácter especial.",
		},
		name: {
			empty: "El nombre no puede estar vacío.",
			tooShort: "El nombre debe tener al menos {{minLength}} caracteres.",
			invalid: "El nombre no puede contener caracteres especiales o espacios.",
		},
		lastname: {
			empty: "El apellido no puede estar vacío.",
			tooShort: "El apellido debe tener al menos {{minLength}} caracteres.",
			invalid:
				"El apellido no puede contener caracteres especiales o espacios.",
		},
		phone: {
			invalid: "El número de teléfono no es válido.",
		},
		companyName: {
			empty: "El nombre de la empresa no puede estar vacío.",
			invalidChars: "El nombre de la empresa contiene caracteres no válidos.",
		},
		slogan: {
			tooShort: "El eslogan debe tener al menos {{minLength}} caracteres.",
			invalidChars: "El eslogan contiene caracteres no válidos.",
		},
		description: {
			tooShort: "La descripción debe tener al menos {{minLength}} caracteres.",
			invalidChars: "La descripción contiene caracteres no válidos.",
		},
	},
};
