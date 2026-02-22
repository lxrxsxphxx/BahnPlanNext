import { API_ENDPOINTS, apiFetch } from './api';

export interface CompanyInfo {
  id?: number;
  name?: string;
  capital?: number;
}

export interface CompanyLok {
  id: number;
  type_name?: string;
  traction_type?: string;
  image_key?: string;
  suitable_passenger_max_wagons?: number;
  suitable_freight_max_tons?: number;
  countries_allowed?: string;
  power_kw?: number;
  max_speed_kmh?: number;
  depot_category?: string | number;
  max_traction_units?: number;
  new_price?: number | string;
  km_cost?: number;
  energy_cost_base?: number;
  is_leased?: boolean;
}

export async function fetchCompaniesLoks(): Promise<CompanyLok[]> {
  const response = await apiFetch(API_ENDPOINTS.myCompaniesLoks);
  if (response.status === 401) {
    throw new Error('Unauthorisiert, bitte zuerst einloggen');
  } else if (!response.ok) {
    throw new Error('Fehler beim Laden der Loks');
  }
  console.debug('API-Antwort für Unternehmensloks:', response);
  return (await response.json()) as Promise<CompanyLok[]>;
}

export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  const response = await apiFetch(API_ENDPOINTS.myCompany);
  if (response.status === 401) {
    throw new Error('Unauthorisiert, bitte zuerst einloggen');
  } else if (!response.ok) {
    throw new Error('Fehler beim Laden der Unternehmensinformationen');
  }
  console.debug('API-Antwort für Unternehmensinformationen:', response);
  return (await response.json()) as Promise<CompanyInfo>;
}

export async function createCompany(name: string) {
  const response = await apiFetch(`${API_ENDPOINTS.myCompany}`, {
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
