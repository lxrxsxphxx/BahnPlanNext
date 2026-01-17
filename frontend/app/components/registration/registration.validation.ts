import type {
  RegistrationErrors,
  RegistrationFormValues,
} from './registration.types';

export function validateRegistration(
  values: RegistrationFormValues,
): RegistrationErrors {
  const errors: RegistrationErrors = {};

  if (!values.name.trim()) errors.name = 'Benutzername ist erforderlich';
  else if (!/^[a-zA-Z0-9]+$/.test(values.name))
    errors.name = 'Nur Buchstaben und Zahlen erlaubt';
  else if (values.name.length < 3) errors.name = 'Benutzername ist zu kurz';

  if (!values.email.trim()) errors.email = 'E-Mail ist erforderlich';
  else if (!/\S+@\S+\.\S+/.test(values.email))
    errors.email = 'Ungültige E-Mail-Adresse';

  if (!values.password) errors.password = 'Passwort ist erforderlich';
  else if (values.password.length < 10)
    errors.password = 'Mindestens 10 Zeichen';

  if (!values.passwordWied) errors.passwordWied = 'Bitte Passwort wiederholen';
  else if (values.password !== values.passwordWied)
    errors.passwordWied = 'Passwörter stimmen nicht überein';

  return errors;
}
