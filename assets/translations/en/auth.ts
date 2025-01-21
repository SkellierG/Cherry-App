export default {
	name: "name",
	lastname: "lastname",
	example_email: "example@adress.com",
	password: "password",
	confirm_password: "confirm password",
	phone: "phone",
	slogan: "slogan",
	description: "description",
	Sign_in: "Sign In",
	Sign_up: "Sign Up",
	Sign_out: "Sign Out",
	Dont_have_an_account: "Don't have an account? ",
	Already_have_an_account: "Already have an account? ",
	Create_company: "Create company",
	validation: {
		email: {
			empty: "Email cannot be empty.",
			invalid: "The email format is invalid.",
		},
		password: {
			empty: "Password cannot be empty.",
			tooShort: "Password must be at least {{minLength}} characters long.",
			missingUppercase: "Password must contain at least one uppercase letter.",
			missingLowercase: "Password must contain at least one lowercase letter.",
			missingNumber: "Password must contain at least one number.",
			missingSpecialChar:
				"Password must contain at least one special character.",
		},
		name: {
			empty: "Name cannot be empty.",
			tooShort: "Name must be at least {{minLength}} characters long.",
			invalid: "Name cannot contain special characters or spaces.",
		},
		lastname: {
			empty: "Last name cannot be empty.",
			tooShort: "Last name must be at least {{minLength}} characters long.",
			invalid: "Last name cannot contain special characters or spaces.",
		},
		phone: {
			invalid: "Phone number is invalid.",
		},
		companyName: {
			empty: "Company name cannot be empty.",
			invalidChars: "Company name contains invalid characters.",
		},
		slogan: {
			tooShort: "Slogan must be at least {{minLength}} characters long.",
			invalidChars: "Slogan contains invalid characters.",
		},
		description: {
			tooShort: "Description must be at least {{minLength}} characters long.",
			invalidChars: "Description contains invalid characters.",
		},
	},
};
