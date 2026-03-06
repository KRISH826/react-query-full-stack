import { NextFunction, Response } from "express";
import { AuthService } from "./user.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export async function registerController(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
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

export async function loginController(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const data = await AuthService.login(req.body);
        return res.status(200).json({
            ...data,
            message: "User logged in successfully",
        });
    } catch (error) {
        next(error);
    }
}

export async function logOutController(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        // 🔥 TRUST JWT, NOT PARAMS
        await AuthService.logOut(req.user!.id);

        return res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserController(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await AuthService.findUserById(req.user!.id);

        return res.status(200).json({
            user,
            message: "User fetched successfully",
        });
    } catch (error) {
        next(error);
    }
}

export async function updateProfileController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const files = req.file ? [req.file] : [];
        const user = await AuthService.updateProfile(req.user!.id, req.body, files);
        return res.status(200).json({
            user,
            message: "User updated successfully",
        });
    } catch (error) {
        next(error);
    }
}
