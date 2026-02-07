import { API_ENDPOINTS, apiFetch } from "./api";

/**
 * Service Funktion um Loks aus dem Lokshop zu holen 
 */
export async function fetchLoks() {
    const response = await apiFetch(API_ENDPOINTS.fetchLoks);
    if (response.status === 401) {
        throw new Error('Unauthorized - Please login first');
    } else if (!response.ok) {
        throw new Error('Failed to fetch loks');
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
        throw new Error('Unauthorized - Please login first');
    } else if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to lease lok');
    }
    return response.json();
}