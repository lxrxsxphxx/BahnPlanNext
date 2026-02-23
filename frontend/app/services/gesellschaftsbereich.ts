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
  // Delivery-related fields (from backend)
  delivery_status?: string;
  delivery_end_at?: string | null; // ISO string from backend
  delivered_at?: string | null; // ISO string from backend
  // parsed Date objects (optional convenience)
  delivery_end_at_date?: Date | null;
  delivered_at_date?: Date | null;
}

export async function fetchCompaniesLoks(): Promise<CompanyLok[]> {
  const response = await apiFetch(API_ENDPOINTS.myCompaniesLoks);
  if (response.status === 401) {
    throw new Error('Unauthorisiert, bitte zuerst einloggen');
  } else if (!response.ok) {
    throw new Error('Fehler beim Laden der Loks');
  }
  console.debug('API-Antwort für Unternehmensloks:', response);
  const raw = (await response.json()) as CompanyLok[];
  // parse delivery date strings into Date objects for convenience
  for (const lok of raw) {
    lok.delivery_end_at_date = lok.delivery_end_at ? new Date(lok.delivery_end_at) : null;
    lok.delivered_at_date = lok.delivered_at ? new Date(lok.delivered_at) : null;
  }
  return raw as CompanyLok[];
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
