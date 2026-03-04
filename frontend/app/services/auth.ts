import { API_ENDPOINTS } from './api';

export type CurrentUser = {
  username: string;
  email: string;
  role: string;
};

/**
 * **Authentifizierungs-Service**
 * * Zentrale Logik für die Benutzerverwaltung und Sitzungskontrolle. 
 * Nutzt eine **stateless Cookie-Strategie** (HttpOnly), bei der das Token 
 * vom Browser verwaltet wird und nicht im Client-Code zugänglich ist.
 *
 * ### Kernfunktionen
 * - **Sitzungsprüfung**: Validiert über den `/me`-Endpunkt, ob der User aktiv eingeloggt ist.
 * - **Login-Flow**: Verarbeitet Anmeldedaten via `application/x-www-form-urlencoded`.
 * - **Sicherheit**: Erzwingt `credentials: 'include'`, damit der Browser das Auth-Cookie mitsendet.
 * - **Error-Handling**: Übersetzt HTTP-Statuscodes (401, 403)
 *
 * ### Datentypen
 * - `CurrentUser`: Repräsentiert das Benutzerprofil (Username, E-Mail, Rolle).
 *
 * @module Services/Auth
 */

/**
 * Ruft das Profil des aktuell angemeldeten Benutzers ab.
 * @async
 * @returns {Promise<CurrentUser | null>} Benutzerdaten oder `null`, falls nicht authentifiziert.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await fetch(API_ENDPOINTS.usersMe, {
      credentials: 'include',
    });

    if (!response.ok) return null;
    return (await response.json()) as CurrentUser;
  } catch {
    return null;
  }
}

/**
 * Authentifiziert den Benutzer am Backend.
 * @async
 * @param username - Der Benutzername.
 * @param password - Das Passwort im Klartext (wird via POST übertragen).
 * @throws {Error} Bei ungültigen Zugangsdaten oder Serverfehlern.
 */
export async function login(username: string, password: string) {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  const response = await fetch(API_ENDPOINTS.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
    credentials: 'include',
  });
  if (response.status === 401) {
    throw new Error('Login fehlgeschlagen. Die Zugangsdaten sind ungültig.');
  } else if (response.status === 403) {
    throw new Error('Login fehlgeschlagen. Der Zugriff wurde verweigert.');
  } else if (!response.ok) {
    throw new Error(
      `Login fehlgeschlagen. Server antwortete mit Status ${response.status}.`,
    );
  }
  const data = await response.json();
  // Backend setzt das HttpOnly `access_token`-Cookie; das JSON wird hier nur zurückgegeben
  // für optionales Debugging, wir speichern das Token client-seitig nicht.
  return data;
}

/**
 * Prüft einfach, ob eine gültige Sitzung besteht.
 * @async
 * @returns {Promise<boolean>} True, wenn der User eingeloggt ist.
 */
export async function checkLoggedIn(): Promise<boolean> {
  const me = await getCurrentUser();
  return Boolean(me);
}

/**
 * Beendet die aktuelle Sitzung und weist das Backend an, das Auth-Cookie zu löschen.
 * @async
 * @throws {Error} Falls der Logout-Request fehlschlägt.
 */
export async function logout(): Promise<void> {
  const response = await fetch(API_ENDPOINTS.logout, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout fehlgeschlagen.');
  }
}
