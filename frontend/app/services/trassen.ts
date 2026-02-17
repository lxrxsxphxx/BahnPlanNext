import { API_BASE_URL } from './api';

export class UserFacingError extends Error {
  cause: undefined;
  stack: undefined;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export interface Trasse {
  name: string;
  zugart: string;
  zugnummer: string;
  details: Record<string, any>;
  label: string;
  stops: TrassenStops[]

}

export interface TrassenStops {
  seq: number;
  station_name: string;
  arr_a: string | null;
  dep_a: string | null;
  arr_b: string | null;
  dep_b: string | null;

}

export interface TrassenGruppe {
  label: string;
  trassen: Trasse[];
}

export type TrassenResponse = TrassenGruppe[];

/**
 * Anfrage für Trassen
 * @throws {UserFacingError}
 * @returns Liste mit TrassenGruppen
 */
export async function getTrassen(): Promise<TrassenGruppe[]> {
  const response = await fetch(`${API_BASE_URL}/trassen`, { credentials: 'include' });

  if (!response.ok) {
    throw new UserFacingError(JSON.stringify(response))
  }

  return response.json() as Promise<TrassenGruppe[]>;
}
