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
    },
    courses: {
        getAll: (page: number, size: number) => `${API_URL}/courses/findAll?page=${page}&size=${size}`,
        getById: (id: string) => `${API_URL}/courses/${id}`,
        create: `${API_URL}/courses/create`,
        getByInstructorId: (instructorId: number) => `${API_URL}/courses/findByInstructor?instructorId=${instructorId}`,
    },
    sections: {
        create: `${API_URL}/courses/createSection`,
    },
    lessons: {
        create: `${API_URL}/courses/createLesson`,
    }
}