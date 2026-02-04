import { API_ENDPOINTS } from './api';

const ACCESS_TOKEN_KEY = 'access_token';
// Speichert das Zugriffstoken im lokalen Speicher des Browsers
export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}
// Ruft das Zugriffstoken aus dem lokalen Speicher des Browsers ab
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
// Entfernt das Zugriffstoken aus dem lokalen Speicher des Browsers

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
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
  if (data?.access_token) {
    setAccessToken(data.access_token);
  }
  return data;
}
