import express from "express";
import {
    forgetPasswordController,
    getUserController,
    logOutController,
    loginController,
    registerController,
    resendVerificationController,
    resetPasswordController,
    updateProfileController,
    verifyEmailController,
} from "../controllers/user/user.controller";
import { authLimiter } from "../middlewares/limiter.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const router = express.Router();



router.post("/register", registerController);
router.post("/login", authLimiter, loginController);

// 🔥 SECURE ROUTES
router.get("/profile", requireAuth, getUserController);
router.put("/profile", requireAuth, upload.single("profileimage"), updateProfileController);
router.post("/logout", requireAuth, logOutController);
router.post("/verify-email", verifyEmailController);
router.post("/resend-mail", resendVerificationController);
router.post("/forget-password", forgetPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
