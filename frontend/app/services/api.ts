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

/**
 * **API-Konfiguration & Fetch-Wrapper**
 * * Verwaltung der API-Endpunkte und Basis-URLs für Client- und Server-seitiges Rendering (SSR).
 * * ### Funktionalitäten
 * - **SSR-Awareness**: Unterscheidet automatisch zwischen internen Server-URLs und öffentlichen Client-URLs.
 * - **Zentrales Endpoint-Mapping**: Verwaltet alle Routen (Auth, Shop, Company) an einem Ort (`API_ENDPOINTS`).
 * - **Cookie-basierte Auth**: Der `apiFetch`-Wrapper sorgt dafür, dass Anmeldedaten (`credentials: 'include'`) bei jedem Aufruf mitgesendet werden.
 * * ### Konstanten & Endpunkte
 * - `API_BASE_URL`: Die dynamisch ermittelte Basis für alle Anfragen.
 * - `API_ENDPOINTS`: Typisierter Katalog aller verfügbaren Routen (z. B. `login`, `fetchLoks`).
 * * ### Logik-Details
 * - **Credentials**: Es wird bewusst auf manuelle `Authorization`-Header verzichtet, da die Authentifizierung rein über HttpOnly-Cookies gesteuert wird.
 * - **SSR-Fallback**: Verwendet `INTERNAL_API_URL` für Server-zu-Server Kommunikation, um Latenzen zu minimieren.
 * * @module Infrastructure/API
 */

/**
 * Ein zentraler Wrapper um die native `fetch`-API.
 * Erweitert jede Anfrage automatisch um `credentials: 'include'`, um Cookie-Auth zu ermöglichen.
 * * @async
 * @param input - Die Ziel-URL oder ein Request-Objekt.
 * @param init - Zusätzliche Fetch-Optionen (Method, Body, Headers).
 * @returns {Promise<Response>} Das Response-Objekt des Servers.
 */

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
