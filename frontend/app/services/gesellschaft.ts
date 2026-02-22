import { API_ENDPOINTS, apiFetch } from './api';

/* holt Gesellschaft, wenn Nutzer eingeloggt ist */
export async function fetchGesellschaft() {
  const response = await apiFetch(API_ENDPOINTS.myCompany);
  if (!response.ok) {
    throw new Error('Fehler beim Abrufen der Gesellschaft');
  }
  return response.json();
}

export async function createGesellschaft(name: string) {
  const response = await apiFetch(`${API_ENDPOINTS.myCompanyPost}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (response.status == 400) {
    throw new Error('Du besitzt bereits eine Gesellschaft');
  } else if (!response.ok) {
    throw new Error('Erstellung der Gesellschaft fehlgeschlagen');
  }

  return response.json();
}
