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
        forgotPassword: `${API_URL}/auth/forgot-password`,
        validateResetToken: (token: string) => `${API_URL}/auth/validate-reset-token?token=${token}`,
        resetPassword: `${API_URL}/auth/reset-password`,
    },
    courses: {
        getAll: (page: number, size: number) => `${API_URL}/courses/findAll?page=${page}&size=${size}`,
        getById: (id: string) => `${API_URL}/courses/${id}`,
        create: `${API_URL}/courses/create`,
        createBatch: `${API_URL}/courses/create-batch`,
        update: `${API_URL}/courses/update`,
        delete: (id: number) => `${API_URL}/courses/${id}`,
        getByInstructorId: (instructorId: number) => `${API_URL}/courses/findByInstructor?instructorId=${instructorId}`,
        getCoursesByStudentId: `${API_URL}/student/dashboard`,
        enroll: `${API_URL}/enroll/`,
    },
    enroll: {
        base: `${API_URL}/enroll`,
        markLesson: `${API_URL}/enroll/markLesson`,
        myCourses: `${API_URL}/enroll/my-courses`,
    },
    sections: {
        create: `${API_URL}/courses/createSection`,
        update: `${API_URL}/courses/updateSection`,
        delete: (id: number) => `${API_URL}/courses/sections/${id}`,
    },
    lessons: {
        create: `${API_URL}/courses/createLesson`,
        update: `${API_URL}/courses/updateLesson`,
        delete: (id: number) => `${API_URL}/courses/lessons/${id}`,
    },
    reviews: {
        create: `${API_URL}/reviews`,
        update: (reviewId: number) => `${API_URL}/reviews/${reviewId}`,
        delete: (reviewId: number) => `${API_URL}/reviews/${reviewId}`,
        getByCourse: (cursoId: number) => `${API_URL}/reviews/course/${cursoId}`,
        getByUser: (userId: number) => `${API_URL}/reviews/user/${userId}`,
        getStats: (cursoId: number) => `${API_URL}/reviews/course/${cursoId}/stats`,
        checkUserReview: (cursoId: number, userId: number) => `${API_URL}/reviews/check/${cursoId}/${userId}`,
    },
    payments: {
        getMethods: `${API_URL}/payments/methods`,
        process: `${API_URL}/payments/process`,
        getById: (id: number) => `${API_URL}/payments/${id}`,
        getByEnrollment: (inscripcionId: number) => `${API_URL}/payments/enrollment/${inscripcionId}`,
        getMyPayments: `${API_URL}/payments/my-payments`,
    },
    categories: {
        getAll: `${API_URL}/categories/findAll`,
        getActive: `${API_URL}/categories/active`,
        getById: (id: number) => `${API_URL}/categories/${id}`,
        create: `${API_URL}/categories`,
        update: (id: number) => `${API_URL}/categories/${id}`,
        delete: (id: number) => `${API_URL}/categories/${id}`,
        toggleStatus: (id: number) => `${API_URL}/categories/${id}/toggle-status`,
    },
    discounts: {
        getAll: `${API_URL}/discounts/findAll`,
        getById: (id: number) => `${API_URL}/discounts/${id}`,
        getByCourse: (cursoId: number) => `${API_URL}/discounts/course/${cursoId}`,
        create: `${API_URL}/discounts`,
        update: (id: number) => `${API_URL}/discounts/${id}`,
        delete: (id: number) => `${API_URL}/discounts/${id}`,
        toggleStatus: (id: number) => `${API_URL}/discounts/${id}/toggle-status`,
        validateCode: (code: string, cursoId: number) => `${API_URL}/discounts/validate/${code}/${cursoId}`,
    },
    admin: {
        stats: `${API_URL}/admin/stats`,
        users: `${API_URL}/admin/users`,
        createUser: `${API_URL}/admin/users`,
        toggleUserStatus: (userId: number) => `${API_URL}/admin/users/${userId}/toggle-status`,
    }
}