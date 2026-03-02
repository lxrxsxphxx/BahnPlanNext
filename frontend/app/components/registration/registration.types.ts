/**
 * **Registration Types**
 * * Definiert die Datenstrukturen für den Registrierungsprozess.
 * * ### Interfaces
 * - **RegistrationFormValues**: Das Datenmodell für alle Eingabefelder (Name, E-Mail, Passwörter).
 * - **RegistrationErrors**: Ein Mapping-Objekt für Validierungsfehler (Key-Value-Paare).
 * * @module Registration/Types
 */

/**
 * Rohdaten des Registrierungsformulars.
 */
export interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
  passwordWied: string;
}

/**
 * Optionale Fehlermeldungen für jedes Feld der `RegistrationFormValues`.
 */
export interface RegistrationErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordWied?: string;
}
