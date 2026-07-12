import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    // Handle Token Expiry / 401
    if (error.response?.status === 401) {
        // Logic to refresh token goes here
        // If refresh fails, clear auth store
        useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
});

export default apiClient;
