import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================
// SPRINT APIs
// ============================================
export const sprintAPI = {
    getAll: (projectId) => api.get(`/sprints?projectId=${projectId}`),
    getOne: (id) => api.get(`/sprints/${id}`),
    create: (data) => api.post('/sprints', data),
    update: (id, data) => api.put(`/sprints/${id}`, data),
    delete: (id) => api.delete(`/sprints/${id}`),
    start: (id) => api.post(`/sprints/${id}/start`),
    complete: (id) => api.post(`/sprints/${id}/complete`),
    getVelocity: (id) => api.get(`/sprints/${id}/velocity`),
    getBurndown: (id) => api.get(`/sprints/${id}/burndown`),
};

// ============================================
// TICKET LINK APIs
// ============================================
export const ticketLinkAPI = {
    getLinks: (ticketId) => api.get(`/ticket-links?ticketId=${ticketId}`),
    create: (data) => api.post('/ticket-links', data),
    delete: (id) => api.delete(`/ticket-links/${id}`),
    getDependencies: (ticketId) => api.get(`/ticket-links/dependencies/${ticketId}`),
};

// ============================================
// TIME LOG APIs
// ============================================
export const timeLogAPI = {
    logTime: (data) => api.post('/time-logs', data),
    getLogs: (params) => api.get('/time-logs', { params }),
    getReport: (params) => api.get('/time-logs/report', { params }),
    update: (id, data) => api.put(`/time-logs/${id}`, data),
    delete: (id) => api.delete(`/time-logs/${id}`),
};

// ============================================
// LABEL APIs
// ============================================
export const labelAPI = {
    getAll: (projectId) => api.get(`/labels?projectId=${projectId}`),
    create: (data) => api.post('/labels', data),
    update: (id, data) => api.put(`/labels/${id}`, data),
    delete: (id) => api.delete(`/labels/${id}`),
    addToTicket: (data) => api.post('/labels/add-to-ticket', data),
    removeFromTicket: (data) => api.post('/labels/remove-from-ticket', data),
};

// ============================================
// NOTIFICATION APIs
// ============================================
export const notificationAPI = {
    getAll: (unreadOnly = false) => api.get(`/notifications?unreadOnly=${unreadOnly}`),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
    create: (data) => api.post('/notifications', data),
};

// ============================================
// ACTIVITY APIs
// ============================================
export const activityAPI = {
    getActivities: (params) => api.get('/activities', { params }),
    getFeed: (limit = 50) => api.get(`/activities/feed?limit=${limit}`),
    create: (data) => api.post('/activities', data),
};

// ============================================
// RELEASE APIs
// ============================================
export const releaseAPI = {
    getAll: (projectId) => api.get(`/releases?projectId=${projectId}`),
    getOne: (id) => api.get(`/releases/${id}`),
    create: (data) => api.post('/releases', data),
    update: (id, data) => api.put(`/releases/${id}`, data),
    delete: (id) => api.delete(`/releases/${id}`),
    getNotes: (id) => api.get(`/releases/${id}/notes`),
};

// ============================================
// ATTACHMENT APIs
// ============================================
export const attachmentAPI = {
    upload: (formData) => api.post('/attachments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: (ticketId) => api.get(`/attachments?ticketId=${ticketId}`),
    download: (id) => api.get(`/attachments/${id}/download`, { responseType: 'blob' }),
    delete: (id) => api.delete(`/attachments/${id}`),
};

// Default export MUST come last
export default api;
