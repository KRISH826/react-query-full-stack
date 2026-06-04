/**
 * Matches PostgreSQL ENUM: public.user_role
 */
export type UserRole = "customer" | "admin";

export type Gender = "male" | "female" | "unisex" | null;

/**
 * Exact representation of DB row (internal use only)
 */
export interface UserDB {
    id: string; // uuid
    name: string;
    email: string;
    password: string;
    role: UserRole;
    profileimage: string | null;
    address: string | null;
    postcode: string | null;
    country: string | null;
    city: string | null;
    state: string | null;
    gender: Gender;
    created_at: Date;
    updated_at: Date;
    expires_at: Date;
    token_version: number;
    isverified: Boolean;
}

/**
 * DTO for creating a user (API input)
 */
export interface CreateUserDTO {
    id: string;
    name: string;
    email: string;
    password?: string; // optional → managed by Cognito, not stored in DB
    role?: UserRole;   // optional → default handled by DB
}

/**
 * DTO returned to client (password NEVER exposed)
 */
export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profileimage: string | null;
    postcode: string | null;
    country: string | null;
    city: string | null;
    state: string | null;
    gender: Gender;
    address: string | null;
    created_at: Date;
    updated_at: Date;
    expires_at: Date;
    token_version?: number;
    isverified: Boolean;
}

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginDTO {
    email: string;
    password: string;
    token_version: number;
}

export interface LoginResponseDTO {
    user: UserResponseDTO | null;
    accessToken: string;
    refreshToken: string;
}

export interface ProfileDto {
    name: string;
    profileimage: string | null;
    postcode: string | null;
    country: string | null;
    city: string | null;
    address: string | null;
    state: string | null;
    gender: Gender;
}