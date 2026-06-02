import { AssistantService } from "./assistant.service";
import { Request, Response, NextFunction } from "express";

export class AssistantController {
    static async assistantChat(req: Request, res: Response, next: NextFunction) {
        try {
            const message = String(req.query.q ?? "");
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 30);

            if (!message.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Message is required"
                });
            }
            const intent = await AssistantService.getAssistantResponse(message, page, limit);
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