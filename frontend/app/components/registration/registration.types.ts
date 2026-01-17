export interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
  passwordWied: string;
}

export interface RegistrationErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordWied?: string;
}
