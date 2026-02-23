import { API_BASE_URL } from './api';

export interface Wagon {
  id: number;
  vehicle_number: string;
  owner_company_id: number;
  type_id: number;
  acquired_at: string; // ISO date string
  leasing_model?: string;
  lease_annual_rate_percent?: number;
  lease_weekly_rate_percent?: number;
  lease_start?: string; // optional ISO date string
  condition_percent: number;
  is_leased: boolean;
  img_file: string;

  max_speed?: number; // km/h
  price_standard?: number; // standard price
  price_control?: number; // controlled/adjusted price
  cost_km?: number; // cost per km
  capacity?: number;
}

export async function getWagons() {
  const res = await fetch(`${API_BASE_URL}/wagons`, { credentials: 'include' });

  if (!res.ok) {
    throw new Error(JSON.stringify(res));
  }

  return res.json() as Promise<Wagon[]>;
}
