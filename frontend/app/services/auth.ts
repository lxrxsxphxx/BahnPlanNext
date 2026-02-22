import { API_ENDPOINTS } from './api';

export type CurrentUser = {
  username: string;
  email: string;
  role: string;
};

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

export async function checkLoggedIn(): Promise<boolean> {
  const me = await getCurrentUser();
  return Boolean(me);
}

export async function logout(): Promise<void> {
  const response = await fetch(API_ENDPOINTS.logout, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout fehlgeschlagen.');
  }
}
