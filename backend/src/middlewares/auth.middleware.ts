import { NextFunction, Response } from "express";
import { JwtPayload, verifyAccessToken } from "../utils/jwt";
import { pool } from "../db/db";
import { Request } from "express";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded: JwtPayload = verifyAccessToken(token);

        const { rows } = await pool.query(
            `SELECT token_version FROM users WHERE id = $1`,
            [decoded.sub]
        );

        if (!rows.length || rows[0].token_version !== decoded.token_version) {
            return res.status(401).json({ message: "Token revoked" });
        }

        // Attach user to request
        req.user = {
            id: decoded.sub,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Access token expired or invalid",
        });
    }
};
