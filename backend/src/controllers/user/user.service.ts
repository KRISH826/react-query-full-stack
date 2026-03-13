import { PoolClient } from "pg";
import { pool } from "../../db/db";
import { HttpError } from "../../middlewares/error.middleware";
import {
    LoginDTO,
    LoginResponseDTO,
    ProfileDto,
    RegisterDTO,
    UserDB,
    UserResponseDTO,
} from "../../models/user";
import { findByEmail, findById, logout, updateProfile, verifyUser } from "./user.repository";
import { deleteFromS3, extractKeyFromS3Url, uploadSingleImage } from "../../middlewares/upload";
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    AuthFlowType,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { config } from "../../config/config";
import { computeSecretHash } from "../../helper/user";

const cognitoClient = new CognitoIdentityProviderClient({ region: config.cognito.region });

function toUserResponse(user: UserDB | null): UserResponseDTO | null {
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
}

export class AuthService {
    static async register(payload: RegisterDTO): Promise<UserResponseDTO | null> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const existingUser = await findByEmail(payload.email);
            if (existingUser) {
                throw new HttpError("User already exists", 400);
            }

            // 1. Sign up user in Cognito
            const signUpResponse = await cognitoClient.send(new SignUpCommand({
                ClientId: config.cognito.client_id,
                Username: payload.email,
                Password: payload.password,
                SecretHash: computeSecretHash(payload.email),
                UserAttributes: [
                    { Name: "email", Value: payload.email },
                    { Name: "name", Value: payload.name },
                ],
            }));

            const cognitoSub = signUpResponse.UserSub;

            const user = await client.query<UserDB>(
                `INSERT INTO users (id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *`,
                [cognitoSub, payload.name, payload.email, payload.role]
            );

            await client.query('COMMIT');
            return toUserResponse(user.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async login(payload: LoginDTO): Promise<LoginResponseDTO> {
        try {
            const response = await cognitoClient.send(new InitiateAuthCommand({
                AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                ClientId: config.cognito.client_id,
                AuthParameters: {
                    USERNAME: payload.email,
                    PASSWORD: payload.password,
                    SECRET_HASH: computeSecretHash(payload.email),
                },
            }));

            if (!response.AuthenticationResult) {
                throw new HttpError("Authentication failed", 401);
            }

            const { AccessToken, RefreshToken } = response.AuthenticationResult;
            const user = await findByEmail(payload.email);
            if (!user?.isverified) {
                throw new HttpError("Please verify your email first", 403);
            }

            return {
                user: toUserResponse(user),
                accessToken: AccessToken!,
                refreshToken: RefreshToken!,
                // You can also return IdToken if needed
            };
        } catch (error: any) {
            if (error.name === "NotAuthorizedException") {
                throw new HttpError("Invalid email or password", 401);
            }
            throw error;
        }
    }

    static async verifyEmail(email: string, code: string): Promise<void> {
        try {
            await cognitoClient.send(new ConfirmSignUpCommand({
                ClientId: config.cognito.client_id,
                Username: email,
                ConfirmationCode: code,
                SecretHash: computeSecretHash(email),
            }))
            await verifyUser(email);
        } catch (error: any) {
            if (error.name === "CodeMismatchException") {
                throw new HttpError("Invalid verification code", 400);
            }
            if (error.name === "ExpiredCodeException") {
                throw new HttpError("Code expired, request a new one", 400);
            }
        }
    }

    static async resenedVerification(email: string): Promise<void> {
        try {
            const user = await findByEmail(email);
            if (!user) {
                throw new HttpError("User not found", 404);
            }
            if (user.isverified) {
                throw new HttpError("User already verified", 400);
            }

            await cognitoClient.send(
                new ResendConfirmationCodeCommand({
                    ClientId: config.cognito.client_id,
                    Username: email,
                    SecretHash: computeSecretHash(email),
                })
            )

        } catch (error: any) {
            if (error.name === "UserNotFoundException") {
                throw new HttpError("User not found", 404);
            }
            if (error.name === "LimitExceededException") {
                throw new HttpError("Too many attempts, try later", 429);
            }
            throw error;
        }
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
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const user = await logout(id, client);
            if (!user) {
                throw new HttpError("User not found", 404);
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateProfile(id: string, data: ProfileDto, files: Express.Multer.File[]): Promise<UserResponseDTO | null> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const existingUser = await findById(id, client);

            if (!existingUser) {
                throw new HttpError("User not found", 404);
            }
            let profileImageUrl = existingUser.profileimage;
            const validFile = files.find((f) => f.size > 0);

            if (validFile) {
                if (existingUser.profileimage) {
                    const key = extractKeyFromS3Url(existingUser.profileimage);
                    if (key) {
                        await deleteFromS3(key);
                    }
                }
                const uploadProfileImageUrl = await uploadSingleImage(validFile);
                profileImageUrl = uploadProfileImageUrl.url;
            }
            const user = await updateProfile(id, {
                name: data.name ?? existingUser.name,
                profileimage: profileImageUrl,
                address: data.address ?? existingUser.address,
                postcode: data.postcode ?? existingUser.postcode,
                country: data.country ?? existingUser.country,
                city: data.city ?? existingUser.city,
            }, client);

            if (!user) {
                throw new HttpError("User not found", 404);
            }
            await client.query('COMMIT');
            return toUserResponse(user);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
