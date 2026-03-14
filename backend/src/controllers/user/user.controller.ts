import { NextFunction, Response } from "express";
import { AuthService } from "./user.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/error.middleware";

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

export async function verifyEmailController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            throw new HttpError("Email and code are required", 400);
        }
        await AuthService.verifyEmail(email, code);
        return res.status(200).json({
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error)
    }
}

export async function resendVerificationController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        if (!email) {
            throw new HttpError("Email is required", 400);
        }
        await AuthService.resenedVerification(email);
        return res.status(200).json({
            message: "Verification email sent successfully",
        });
    } catch (error) {
        next(error)
    }
}

export async function forgetPasswordController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        if (!email) {
            throw new HttpError("Email is required", 400);
        }
        await AuthService.forgetPassword(email);
        return res.status(200).json({
            message: "Forget password email sent successfully",
        });
    } catch (error) {
        next(error)
    }
}

export async function resetPasswordController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            throw new HttpError("Email, code and new password are required", 400);
        }
        await AuthService.resetPassword(email, code, newPassword);
        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (error) {
        next(error)
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
