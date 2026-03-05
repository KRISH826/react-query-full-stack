export type UserRole = "customer" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    profileimage: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User | null;
    accessToken: string;
    refreshToken: string;
}

export interface ProfileResponse {
    user: User;
}