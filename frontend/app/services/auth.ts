import { API_ENDPOINTS } from './api';

// Bei cookie-only Auth benötigt das Frontend kein lesbares Token.
// Login setzt das HttpOnly-Cookie; Logout löscht es.

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

export async function logout() {
  await fetch(API_ENDPOINTS.logout, { method: 'POST', credentials: 'include' });
}
