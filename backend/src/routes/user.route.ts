import express from "express";
import {
    getUserController,
    logOutController,
    loginController,
    registerController,
    updateProfileController,
} from "../controllers/user/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// 🔥 SECURE ROUTES
router.get("/profile", requireAuth, getUserController);
router.put("/profile", requireAuth, upload.single("profileimage"), updateProfileController);
router.post("/logout", requireAuth, logOutController);

export default router;
