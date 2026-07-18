import apiClient from '@/lib/api/client';
import { LoginCredentials, AuthResponse, RegisterData } from '../types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('auth/login/', credentials);
        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('auth/register/', data);
        return response.data;
    },

    async logout(refreshToken: string): Promise<void> {
        await apiClient.post('auth/logout/', { refresh_token: refreshToken });
    },
    
    async logoutAllDevices(): Promise<void> {
        await apiClient.post('sessions/logout_all_devices/');
    },

    async updateProfile(data: any): Promise<any> {
        const response = await apiClient.patch('auth/me/', data);
        return response.data;
    }
};
