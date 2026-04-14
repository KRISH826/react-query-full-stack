import { CookieOptions } from "express";
import { Response } from "express";

export function setCookie(
  res: Response,
  name: string,
  value: string,
  options?: CookieOptions
) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction ? true : false, // dev me false
    sameSite: isProduction ? "none" : "lax", // 🔥 IMPORTANT
    maxAge: options?.maxAge ?? 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}