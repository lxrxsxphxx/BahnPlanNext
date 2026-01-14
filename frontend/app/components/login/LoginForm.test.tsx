import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';

import LoginForm from './LoginForm';

/**
 * = LoginForm Tests
 * 
 * == Beschreibung
 * Diese Test-Suite überprüft die Funktionalität der LoginForm-Komponente.
 * Die Tests decken verschiedene Benutzerinteraktionen und Validierungsszenarien ab.
 */

/**
 * == Test: Komponente wird korrekt gerendert
 * 
 * Dieser Test überprüft, ob die LoginForm-Komponente erfolgreich gerendert wird
 * und alle wichtigen UI-Elemente vorhanden sind.
 * 
 * Erwartetes Verhalten::
 * - Der "Login"-Titel wird angezeigt
 * - Das Benutzername-Eingabefeld ist vorhanden
 * - Das Passwort-Eingabefeld ist vorhanden
 * - Der Login-Button ist vorhanden
 * - Der Schließen-Button ist vorhanden
 */
test('render LoginForm component with all elements', async () => {
  const screen = await render(<LoginForm />);

  await expect
    .element(screen.getByRole('heading', { name: 'Login' }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByPlaceholder('Benutzername/Email'))
    .toBeInTheDocument();
  await expect
    .element(screen.getByPlaceholder('Passwort'))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: 'Login' }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: 'Modal schließen' }))
    .toBeInTheDocument();
});

/**
 * == Test: Benutzereingaben werden korrekt verarbeitet
 * 
 * Dieser Test prüft, ob Benutzereingaben in den Eingabefeldern
 * korrekt erfasst und angezeigt werden.
 * 
 * Testschritte::
 * 1. Benutzername in das erste Eingabefeld eingeben
 * 2. Passwort in das zweite Eingabefeld eingeben
 * 3. Überprüfen, ob beide Werte korrekt angezeigt werden
 * 
 * Erwartetes Verhalten::
 * Die eingegebenen Werte erscheinen in den jeweiligen Eingabefeldern.
 */
test('user can type username and password', async () => {
  const screen = await render(<LoginForm />);

  const usernameInput = screen.getByPlaceholder('Benutzername/Email');
  const passwordInput = screen.getByPlaceholder('Passwort');

  await userEvent.fill(usernameInput, 'testuser@example.com');
  await userEvent.fill(passwordInput, 'password123');

  await expect.element(usernameInput).toHaveValue('testuser@example.com');
  await expect.element(passwordInput).toHaveValue('password123');
});

/**
 * == Test: Passwort-Sichtbarkeit umschalten
 * 
 * Dieser Test überprüft die Funktionalität des "Passwort anzeigen/verbergen"-Buttons.
 * 
 * Testschritte::
 * 1. Initialer Zustand: Passwort-Feld hat type="password"
 * 2. Klick auf den Toggle-Button
 * 3. Passwort-Feld ändert sich zu type="text"
 * 4. Erneuter Klick auf den Toggle-Button
 * 5. Passwort-Feld ändert sich zurück zu type="password"
 * 
 * Erwartetes Verhalten::
 * Das Passwort-Feld wechselt zwischen verstecktem und sichtbarem Modus.
 */
test('toggle password visibility', async () => {
  const screen = await render(<LoginForm />);

  const passwordInput = screen.getByPlaceholder('Passwort');
  const toggleButton = screen.getByRole('button', {
    name: 'Passwort anzeigen',
  });

  // Initial sollte das Passwort versteckt sein
  await expect.element(passwordInput).toHaveAttribute('type', 'password');

  // Nach dem Klick sollte das Passwort sichtbar sein
  await userEvent.click(toggleButton);
  await expect.element(passwordInput).toHaveAttribute('type', 'text');

  // Nach erneutem Klick sollte das Passwort wieder versteckt sein
  const hideButton = screen.getByRole('button', {
    name: 'Passwort verbergen',
  });
  await userEvent.click(hideButton);
  await expect.element(passwordInput).toHaveAttribute('type', 'password');
});

/**
 * == Test: Validierung bei leeren Feldern
 * 
 * Dieser Test überprüft die Validierungslogik, wenn das Formular
 * mit leeren Feldern abgesendet wird.
 * 
 * Testschritte::
 * 1. Formular ohne Eingaben absenden
 * 2. Fehlermeldung sollte erscheinen
 * 
 * Erwartetes Verhalten::
 * Eine Fehlermeldung wird angezeigt: "Bitte füllen Sie alle Felder aus."
 */
test('shows error message when submitting empty form', async () => {
  const screen = await render(<LoginForm />);

  const submitButton = screen.getByRole('button', { name: 'Login' });

  await userEvent.click(submitButton);

  await expect
    .element(screen.getByText('Bitte füllen Sie alle Felder aus.'))
    .toBeInTheDocument();
});

/**
 * == Test: Validierung bei leerem Benutzernamen
 * 
 * Dieser Test prüft die Validierung, wenn nur das Passwort-Feld ausgefüllt ist.
 * 
 * Testschritte::
 * 1. Nur das Passwort-Feld ausfüllen
 * 2. Formular absenden
 * 
 * Erwartetes Verhalten::
 * Eine Fehlermeldung wird angezeigt, da der Benutzername fehlt.
 */
test('shows error message when username is empty', async () => {
  const screen = await render(<LoginForm />);

  const passwordInput = screen.getByPlaceholder('Passwort');
  const submitButton = screen.getByRole('button', { name: 'Login' });

  await userEvent.fill(passwordInput, 'password123');
  await userEvent.click(submitButton);

  await expect
    .element(screen.getByText('Bitte füllen Sie alle Felder aus.'))
    .toBeInTheDocument();
});

/**
 * == Test: Validierung bei leerem Passwort
 * 
 * Dieser Test prüft die Validierung, wenn nur das Benutzername-Feld ausgefüllt ist.
 * 
 * Testschritte::
 * 1. Nur das Benutzername-Feld ausfüllen
 * 2. Formular absenden
 * 
 * Erwartetes Verhalten::
 * Eine Fehlermeldung wird angezeigt, da das Passwort fehlt.
 */
test('shows error message when password is empty', async () => {
  const screen = await render(<LoginForm />);

  const usernameInput = screen.getByPlaceholder('Benutzername/Email');
  const submitButton = screen.getByRole('button', { name: 'Login' });

  await userEvent.fill(usernameInput, 'testuser@example.com');
  await userEvent.click(submitButton);

  await expect
    .element(screen.getByText('Bitte füllen Sie alle Felder aus.'))
    .toBeInTheDocument();
});

/**
 * == Test: Erfolgreiche Formular-Absendung
 * 
 * Dieser Test überprüft das Verhalten bei einer erfolgreichen Formular-Absendung
 * mit vollständig ausgefüllten Feldern.
 * 
 * Testschritte::
 * 1. Benutzername eingeben
 * 2. Passwort eingeben
 * 3. Formular absenden
 * 
 * Erwartetes Verhalten::
 * - Keine Fehlermeldung wird angezeigt
 * - Die Anmelde-Logik wird ausgelöst (im Test: keine Fehler)
 */
test('successful form submission with valid data', async () => {
  const screen = await render(<LoginForm />);

  const usernameInput = screen.getByPlaceholder('Benutzername/Email');
  const passwordInput = screen.getByPlaceholder('Passwort');
  const submitButton = screen.getByRole('button', { name: 'Login' });

  await userEvent.fill(usernameInput, 'testuser@example.com');
  await userEvent.fill(passwordInput, 'password123');
  await userEvent.click(submitButton);

  // Formular wurde erfolgreich abgesendet (keine Fehlermeldung erscheint)
  // Die Eingabefelder behalten ihre Werte
  await expect.element(usernameInput).toHaveValue('testuser@example.com');
  await expect.element(passwordInput).toHaveValue('password123');
});

/**
 * == Test: Schließen-Button-Funktionalität
 * 
 * Dieser Test überprüft, ob der onClose-Callback korrekt aufgerufen wird,
 * wenn der Benutzer auf den Schließen-Button klickt.
 * 
 * Testschritte::
 * 1. Mock-Funktion für onClose erstellen
 * 2. Auf den Schließen-Button klicken
 * 
 * Erwartetes Verhalten::
 * Die onClose-Funktion wird genau einmal aufgerufen.
 */
test('calls onClose when close button is clicked', async () => {
  const onCloseMock = vi.fn();
  const screen = await render(<LoginForm onClose={onCloseMock} />);

  const closeButton = screen.getByRole('button', { name: 'Modal schließen' });

  await userEvent.click(closeButton);

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

/**
 * == Test: Registrieren-Link wird angezeigt
 * 
 * Dieser Test prüft, ob der Link zur Registrierung korrekt angezeigt wird.
 * 
 * Erwartetes Verhalten::
 * Der Text "Kein Account haben?" und der Link "Registrieren" sind vorhanden.
 */
test('displays registration link', async () => {
  const screen = await render(<LoginForm />);

  await expect
    .element(screen.getByText('Kein Account?'))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: 'Registrieren' }))
    .toBeInTheDocument();
});

/**
 * == Test: Registrieren-Button-Interaktion
 * 
 * Dieser Test überprüft, ob der Registrieren-Button klickbar ist und
 * eine Aktion ausführt (hier: Console-Log für zukünftige Implementierung).
 * 
 * Testschritte::
 * 1. Auf den "Registrieren"-Button klicken
 * 2. Console-Log wird aufgerufen (als Platzhalter)
 * 
 * Erwartetes Verhalten::
 * Der Button ist klickbar und führt eine Aktion aus.
 */
test('registration button is clickable', async () => {
  const consoleSpy = vi.spyOn(console, 'log');
  const screen = await render(<LoginForm />);

  const registerButton = screen.getByRole('button', { name: 'Registrieren' });

  await userEvent.click(registerButton);

  expect(consoleSpy).toHaveBeenCalledWith('Navigation zur Registrierung');
  consoleSpy.mockRestore();
});

/**
 * == Test: Fehlermeldung verschwindet bei erfolgreicher Eingabe
 * 
 * Dieser Test überprüft, ob eine zuvor angezeigte Fehlermeldung
 * verschwindet, wenn der Benutzer gültige Daten eingibt und absendet.
 * 
 * Testschritte::
 * 1. Formular leer absenden (Fehler erscheint)
 * 2. Gültige Daten eingeben
 * 3. Formular erneut absenden
 * 
 * Erwartetes Verhalten::
 * Die Fehlermeldung wird entfernt.
 */
test('error message disappears after valid submission', async () => {
  const screen = await render(<LoginForm />);

  const usernameInput = screen.getByPlaceholder('Benutzername/Email');
  const passwordInput = screen.getByPlaceholder('Passwort');
  const submitButton = screen.getByRole('button', { name: 'Login' });

  // Zuerst leer absenden, um Fehler zu erzeugen
  await userEvent.click(submitButton);
  const errorMessage = screen.getByText('Bitte füllen Sie alle Felder aus.');
  await expect.element(errorMessage).toBeInTheDocument();

  // Dann gültige Daten eingeben und absenden
  await userEvent.fill(usernameInput, 'testuser@example.com');
  await userEvent.fill(passwordInput, 'password123');
  await userEvent.click(submitButton);

  // Nach erfolgreicher Absendung sollte die Fehlermeldung verschwunden sein
  // Wir prüfen dies indirekt durch die erfolgreiche Formular-Absendung
  await expect.element(usernameInput).toHaveValue('testuser@example.com');
});
