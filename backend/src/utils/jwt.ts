import jwt from "jsonwebtoken";
import { config } from "../config/config";

const ACCESS_TOKEN_SECRET = config.jwt.secret!;
const REFRESH_TOKEN_SECRET = config.jwt.refresh_secret!;

export interface JwtPayload {
    sub: string;
    role: string;
    token_version: number;
}

export const signAccessToken = (user: {
    id: string;
    role: string;
    token_version: number;
}) => {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role,
            token_version: user.token_version,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
};

export const signRefreshToken = (user: {
    id: string;
    role: string;
    token_version: number;
}) => {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role,
            token_version: user.token_version,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};
