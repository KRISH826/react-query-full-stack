import { AuthRequest } from "../../middlewares/auth.middleware";
import { AuthService } from "../user/user.service";
import { AssistantService } from "./assistant.service";
import { Request, Response, NextFunction } from "express";

export class AssistantController {
    static async assistantChat(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const message = String(req.query.q ?? "");
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 30);
            const userId = req.user?.id;

            let userGender: "MALE" | "FEMALE" | "UNISEX" | null = null;
            const user = await AuthService.findUserById(userId as string);
            if (user) {
                userGender = user.gender ?? null;
            }


            if (!message.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Message is required"
                });
            }
            const intent = await AssistantService.getAssistantResponse(message, page, limit, undefined, userGender);
            if (!intent.success) {
                return res.status(400).json({ success: false, message: "Failed to process the assistant query." });
            }
            return res.json({
                success: true,
                message: intent.message,
                products: intent.products,
                page: intent.page,
                totalPages: intent.totalPages,
                intent: intent.intent.intent,
            });
        } catch (error) {
            console.error("Error in AssistantController:", error);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }
    }
}