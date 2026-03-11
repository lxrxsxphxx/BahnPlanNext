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

/**
 * **Gesellschaftsbereich Service**
 * * verwaltet die Kerndaten der Spieler-Gesellschaft, einschließlich Unternehmensprofil, Kapitalstand und der eigenen Fahrzeuge.
 *
 * ### Datenstrukturen
 * - **CompanyInfo**: Basisdaten der Gesellschaft (Name, ID, aktuelles Kapital).
 * - **CompanyLok**: Umfangreiches Modell einer Lokomotive im Besitz, inklusive technischer 
 * Spezifikationen, Einsatzgebiete und Kostenfaktoren.
 *
 * ### Funktionalitäten
 * - **Unternehmens-Management**: Abrufen (`fetchCompanyInfo`) und Erstellen (`createCompany`) 
 * einer Eisenbahngesellschaft.
 * - **Flotten-Verwaltung**: Abrufen aller Lokomotiven, die der Gesellschaft zugeordnet sind.
 * - **Fehlerbehandlung**: Validiert Statuscodes (401, 404, 400) und liefert kontextbezogene 
 * Fehlermeldungen für das Frontend.
 * * ### Technische Details
 * - Nutzt den zentralen `apiFetch`-Wrapper für automatische Cookie-Authentifizierung.
 * - Beinhaltet Debug-Logs für die API-Payloads zur Unterstützung bei der Entwicklung.
 *
 * @module Services/Gesellschaft
 */

/**
 * Ruft die Liste aller Lokomotiven ab, die sich im Besitz der Gesellschaft befinden.
 * @async
 * @returns {Promise<CompanyLok[]>} Array von Lokomotiven.
 * @throws {Error} Bei fehlender Authentifizierung oder Serverfehlern.
 */
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

/**
 * Standard-Methoden zum Abrufen der Unternehmensinformationen.
 * `fetchCompanyInfo2` nutzt den `/me/company` Endpunkt für eine spezifischere Abfrage.
 * @async
 * @returns {Promise<CompanyInfo | null>} Die Firmendaten oder `null`, falls keine Gesellschaft existiert.
 */
export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
  const response = await apiFetch(API_ENDPOINTS.myCompany);
  if (response.status === 401) {
    throw new Error('Unauthorisiert, bitte zuerst einloggen');
  } else if (response.status === 404) {
    return null; // keine Gesellschaft
  } else if (!response.ok) {
    throw new Error('Fehler beim Laden der Unternehmensinformationen');
  }
  console.debug('API-Antwort für Unternehmensinformationen:', response);
  return (await response.json()) as Promise<CompanyInfo>;
}

export async function fetchCompanyInfo2(): Promise<CompanyInfo | null> {
  const response = await apiFetch(API_ENDPOINTS.myCompany2);
  if (response.status === 401) {
    throw new Error('Unauthorisiert, bitte zuerst einloggen');
  } else if (response.status === 404) {
    return null; // keine Gesellschaft
  } else if (!response.ok) {
    throw new Error('Fehler beim Laden der Unternehmensinformationen');
  }
  console.debug('API-Antwort für Unternehmensinformationen:', response);
  //return (await response.json()) as Promise<CompanyInfo>;
  return await response.json();
}

export async function createCompany(name: string) {
  /*const response = await apiFetch(`${API_ENDPOINTS.myCompany}`, {*/
  const response = await apiFetch(API_ENDPOINTS.createCompany, {
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
