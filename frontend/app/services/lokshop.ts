import { API_ENDPOINTS } from "./api";
import { getAccessToken } from "./auth";
// Hilfsfunktion um die Authentifizierungs-Header zu erstellen
function getAuthHeaders() {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Service Funktion um Loks aus dem Lokshop zu holen 
 */
export async function fetchLoks() {
    const response = await fetch(API_ENDPOINTS.fetchLoks, {
        headers: {
            ...getAuthHeaders(),
        },
        credentials: 'include', // Include cookies for authentication
    });
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
    const response = await fetch(API_ENDPOINTS.leaseLok(lokId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        credentials: 'include', // Include cookies for authentication
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