import { API_ENDPOINTS, apiFetch } from "./api";

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
    return response.json();
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
        // FastAPI returns { detail: '...' } for HTTPException; prefer detail, fallback to message
        throw new Error(errorData.detail || errorData.message || 'Fehler beim Leasen der Lok');
    }
    return response.json();
}