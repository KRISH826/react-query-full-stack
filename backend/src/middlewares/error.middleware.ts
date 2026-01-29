import { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
    code?: number;
    details?: unknown;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.code && err.code >= 100 && err.code < 600
        ? err.code
        : 500;

    const response = {
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack,
            details: err.details,
        }),
    };

    console.error("❌ Error:", {
        path: req.path,
        method: req.method,
        statusCode,
        message: err.message,
    });

    res.status(statusCode).json(response);
};

export class HttpError extends Error {
    constructor(
        public message: string,
        public code: number = 500,
        public details?: unknown
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

