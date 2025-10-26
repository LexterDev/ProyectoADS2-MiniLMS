import { environment } from "../environments/environment";

const API_URL = environment.apiUrl;

/**
 * Centralized configuration for all API endpoints.
 * 
 **/

export const API_ENDPOINTS = {
    auth: {
        login: `${API_URL}/auth/login`,
        register: `${API_URL}/auth/register`,
        refreshToken: `${API_URL}/auth/refresh-token`,
    }
}