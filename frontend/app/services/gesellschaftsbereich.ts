import { API_ENDPOINTS, apiFetch } from "./api";

export async function fetchCompaniesLoks() {
    const response = await apiFetch(API_ENDPOINTS.myCompaniesLoks);
    if (response.status === 401) {
        throw new Error('Unauthorized - Please login first');
    } else if (!response.ok) {
        throw new Error('Failed to fetch loks');
    }
    return response.json();
}

export async function fetchCompanyInfo() {
    const response = await apiFetch(API_ENDPOINTS.myCompany);
    if (response.status === 401) {
        throw new Error('Unauthorized - Please login first');
    } else if (!response.ok) {
        throw new Error('Failed to fetch company info');
    }
    return response.json();
}