import express from "express";
import { AssistantController } from "../controllers/ai_assistant/assistant.controller";

const router = express.Router();

router.post("/chat", AssistantController.assistantChat);

export default router;