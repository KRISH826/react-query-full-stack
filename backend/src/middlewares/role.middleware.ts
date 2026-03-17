import { AuthRequest } from "./auth.middleware";
import { NextFunction, Response } from "express";
import { HttpError } from "./error.middleware";

export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {

        if (!req.user) {
            throw new HttpError("Unauthorized", 401);
        }

        if (!allowedRoles.includes(req.user.role)) {

            const role = req.user.role;

            if (role === "admin") {
                throw new HttpError("This API is only for customers", 403);
            }

            if (role === "customer") {
                throw new HttpError("This API is only for admins", 403);
            }

            throw new HttpError("Forbidden", 403);
        }

        next();
    };
};