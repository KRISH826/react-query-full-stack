import express from "express";
import {
    getUserController,
    logOutController,
    loginController,
    registerController,
} from "../controllers/user/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// 🔥 SECURE ROUTES
router.get("/me", requireAuth, getUserController);
router.post("/logout", requireAuth, logOutController);

export default router;
