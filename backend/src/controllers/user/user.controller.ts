import { NextFunction, Response } from "express";
import { AuthService } from "./user.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/error.middleware";

const isProduction = process.env.NODE_ENV === "production";

// ✅ REGISTER
export async function registerController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const user = await AuthService.register(req.body);

        return res.status(201).json({
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        next(error);
    }
}

// ✅ LOGIN (FIXED)
export async function loginController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { accessToken, refreshToken, user } = await AuthService.login(req.body);

        // 🔥 httpOnly refresh token
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            user,
            accessToken, // only accessToken frontend ko
            message: "User logged in successfully",
        });
    } catch (error) {
        next(error);
    }
}

// ✅ REFRESH (FIXED)
export async function refreshAccessTokenController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken;
        const email = req.cookies.email;

        if (!refreshToken || !email) {
            throw new HttpError("Unauthorized", 401);
        }

        const accessToken = await AuthService.refreshAccessToken(refreshToken, email);

        if (!accessToken) {
            throw new HttpError("Failed to refresh access token", 401);
        }

        return res.status(200).json({
            accessToken,
            message: "Access token refreshed successfully",
        });

    } catch (error) {
        next(error);
    }
}

// ✅ LOGOUT (FIXED)
export async function logOutController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        await AuthService.logOut(req.user!.id);

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}