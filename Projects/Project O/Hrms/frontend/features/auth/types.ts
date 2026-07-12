export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
    organization: string | null;
    mfa_enabled: boolean;
}

export interface Tokens {
    access_token: string;
    refresh_token: string;
}

export interface AuthResponse {
    user: User;
    tokens: Tokens;
}

export interface LoginCredentials {
    email: string;
    password: string;
    device_info?: string;
}

export interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    organization_id?: string;
}
