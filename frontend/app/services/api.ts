export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  logout: `${API_BASE_URL}/logout`,
  users: `${API_BASE_URL}/users`,
  secured: `${API_BASE_URL}/secured`,
  myCompany: `${API_BASE_URL}/users/me/company`,
} as const;
