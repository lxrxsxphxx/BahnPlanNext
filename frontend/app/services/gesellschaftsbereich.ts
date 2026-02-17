import { API_ENDPOINTS, apiFetch } from "./api";

export async function fetchCompaniesLoks() {
    const response = await apiFetch(API_ENDPOINTS.myCompaniesLoks);
    if (response.status === 401) {
        throw new Error('Unauthorisiert, bitte zuerst einloggen');
    } else if (!response.ok) {
        throw new Error('Fehler beim Laden der Loks');
    }
    return response.json();
}

export async function fetchCompanyInfo() {
  const res = await apiFetch(API_ENDPOINTS.myCompany);

  if (!res.ok) {
    const text = await res.text();
    console.error("Company API Error:", res.status, text);
    throw new Error(
      `Company API Fehler: ${res.status} - ${text}`
    );
  }

  return res.json();
}
