import { NextFunction, Response, Request } from "express";
import { pool } from "../db/db";
import { verifyCognitoToken } from "../utils/cognito";

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
        
        // 🔥 Verify with Cognito
        const payload = await verifyCognitoToken(token);

        // We still check our DB for the user's role and existence
        // payload.sub is the unique ID from Cognito
        const { rows } = await pool.query(
            `SELECT id, role FROM users WHERE id = $1`,
            [payload.sub]
        );

        if (!rows.length) {
            return res.status(401).json({ message: "User not found in local database" });
        }

        // Attach user to request
        req.user = {
            id: rows[0].id,
            role: rows[0].role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Access token expired or invalid",
        });
    }
};
