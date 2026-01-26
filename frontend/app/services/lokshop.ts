import { API_BASE_URL } from './api';

export async function fetchLoks() {
    const response = await fetch(`${API_BASE_URL}/shop/vehicle-types?kind=locomotive`, {
        credentials: 'include', // Include cookies for authentication
    });
    if (response.status === 401) {
        throw new Error('Unauthorized - Please login first');
    } else if (!response.ok) {
        throw new Error('Failed to fetch loks');
    }
    return response.json();
}

export async function leaseLok(lokId: number, leasingModel: number) {
    const response = await fetch(`${API_BASE_URL}/shop/vehicle-types/${lokId}/lease`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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