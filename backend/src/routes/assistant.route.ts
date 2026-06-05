import express from "express";
import { AssistantController } from "../controllers/ai_assistant/assistant.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/chat", requireAuth, AssistantController.assistantChat);

export default router;