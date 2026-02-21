const SERVER_API_BASE_URL =
  import.meta.env.INTERNAL_API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000';

export const API_BASE_URL = import.meta.env.SSR
  ? SERVER_API_BASE_URL
  : import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  logout: `${API_BASE_URL}/logout`,
  fetchLoks: `${API_BASE_URL}/shop/vehicle-types?kind=locomotive`,
  leaseLok: (lokId: number) => `${API_BASE_URL}/shop/vehicle-types/${lokId}/lease`,
  users: `${API_BASE_URL}/users`,
  secured: `${API_BASE_URL}/secured`,
  usersMe: `${API_BASE_URL}/users/me`,
  myCompany: `${API_BASE_URL}/users/company`,
  myCompaniesLoks: `${API_BASE_URL}/users/company/vehicles`,
  // no refresh endpoint when using only long-lived access cookie
} as const;

// Zentraler Fetch-Wrapper für alle API-Aufrufe.
// - sendet standardmäßig `credentials: 'include'`
// - verwendet Cookie-basierte Auth (keine Authorization-Header vom Client)
export async function apiFetch(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const mergedInit: RequestInit = {
    ...init,
    credentials: 'include',
  };

  return fetch(input, mergedInit);
}
