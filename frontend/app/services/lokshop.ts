export async function fetchLoks() {
    const baseUrl = 'http://localhost:8000'; // Change this to your API URL
    const response = await fetch(`${baseUrl}/shop/vehicle-types?kind=locomotive`, {
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
    const baseUrl = 'http://localhost:8000'; // Change this to your API URL
    const response = await fetch(`${baseUrl}/shop/vehicle-types/${lokId}/lease`, {
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