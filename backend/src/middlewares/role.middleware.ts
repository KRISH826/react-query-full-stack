import { AuthRequest } from "./auth.middleware"
import { NextFunction, Response } from "express"

export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        next();
    }
}