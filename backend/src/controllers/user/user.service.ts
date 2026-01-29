import { HttpError } from "../../middlewares/error.middleware";
import {
    LoginDTO,
    LoginResponseDTO,
    RegisterDTO,
    UserDB,
    UserResponseDTO,
} from "../../models/user";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { createUser, findByEmail, findById, logout } from "./user.repository";
import argon2 from "argon2";

function toUserResponse(user: UserDB | null): UserResponseDTO | null {
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
}

export class AuthService {
    static async register(payload: RegisterDTO): Promise<UserResponseDTO | null> {
        const existingUser = await findByEmail(payload.email);
        if (existingUser) {
            throw new HttpError("User already exists", 409);
        }

        if (!payload.email || !payload.name || !payload.password || !payload.role) {
            throw new HttpError("All fields are required", 400);
        }

        const hashedPassword = await argon2.hash(payload.password);
        const user = await createUser({ ...payload, password: hashedPassword });

        return toUserResponse(user);
    }

    static async login(payload: LoginDTO): Promise<LoginResponseDTO> {
        const user = await findByEmail(payload.email);
        if (!user) {
            throw new HttpError("User not found", 404);
        }

        if (!payload.email || !payload.password) {
            throw new HttpError("All fields are required", 400);
        }

        const isPasswordValid = await argon2.verify(
            user.password,
            payload.password
        );

        if (!isPasswordValid) {
            throw new HttpError("Invalid password", 401);
        }

        return {
            user: toUserResponse(user),
            accessToken: signAccessToken({
                id: user.id,
                role: user.role,
                token_version: user.token_version,
            }),
            refreshToken: signRefreshToken({
                id: user.id,
                role: user.role,
                token_version: user.token_version,
            }),
        };
    }

    static async findUserById(id: string): Promise<UserResponseDTO | null> {
        const user = await findById(id);

        if (!user) {
            throw new HttpError("User not found", 404);
        }

        return toUserResponse(user);
    }

    // 🔥 REAL LOGOUT (token invalidation)
    static async logOut(id: string): Promise<void> {
        const user = await logout(id);
        if (!user) {
            throw new HttpError("User not found", 404);
        }
    }
}
