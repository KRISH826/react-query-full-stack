import express from "express";
import {
    getUserController,
    logOutController,
    loginController,
    registerController,
    updateProfileController,
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

export default router;
