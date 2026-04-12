import { CookieOptions, Response } from "express";
export function setCookie(res: Response, name: string, value: string, options?: CookieOptions) {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie(name, value, {
        httpOnly: options?.httpOnly ?? true,
        secure: isProduction,
        sameSite: options?.sameSite ?? "strict",
        maxAge: options?.maxAge ?? 7 * 24 * 60 * 60 * 1000,
        path: options?.path ?? "/",
    });
}