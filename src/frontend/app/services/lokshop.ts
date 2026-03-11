import { API_ENDPOINTS, apiFetch } from './api';

export interface ShopLok {
  id: number;
  name: string;
  kind: string;
  new_price: number;
  km_cost: number;
  energy_cost_base: number;
  traction_type?: string;
  suitable_passenger_max_wagons?: number;
  suitable_freight_max_tons?: number;
  countries_allowed?: string;
  power_kw?: number;
  max_speed_kmh?: number;
  depot_category?: number;
  max_traction_units?: number;
  image_key?: string;
  total_stock?: number;
  available_stock?: number;
}

/**
 * Service Funktion um Loks aus dem Lokshop zu holen
 */
export async function fetchLoks() {
  const response = await apiFetch(API_ENDPOINTS.fetchLoks);
  if (response.status === 401) {
    throw new Error('Unauthorisiert, bitte zuerst einloggen');
  } else if (!response.ok) {
    throw new Error('Fehler beim Abrufen der Loks');
  }
  return response.json() as Promise<ShopLok[]>;
}

/**
 * Service Funktion um eine Lok zu leasen
 * @param lokId ID der Lok
 * @param leasingModel ausgewähltes Leasingmodell
 * @returns
 */
export async function leaseLok(lokId: number, leasingModel: number) {
  const response = await apiFetch(API_ENDPOINTS.leaseLok(lokId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leasing_model: leasingModel }),
  });
  if (response.status === 401) {
    throw new Error('Unauthorisiert, bitte zuerst einloggen');
  } else if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Fehler beim Leasen der Lok');
  }
  return response.json();
}
