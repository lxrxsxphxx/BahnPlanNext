import { API_ENDPOINTS } from "./api";


export async function login(username: string, password: string) {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
  const response = await fetch(API_ENDPOINTS.login, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    credentials: 'include',
  });
    if (!response.ok) {
    throw new Error('Login fehlgeschlagen');
  }
    return response.json();
}