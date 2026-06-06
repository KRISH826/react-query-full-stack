import { AuthRequest } from "../../middlewares/auth.middleware";
import { AuthService } from "../user/user.service";
import { AssistantService } from "./assistant.service";
import { Request, Response, NextFunction } from "express";

type AssistantGender = "Male" | "Female" | "Unisex" | null;

const toAssistantGender = (gender: "male" | "female" | "unisex" | null): AssistantGender => {
    if (!gender) return null;
    const genderMap: Record<Exclude<typeof gender, null>, Exclude<AssistantGender, null>> = {
        male: "Male",
        female: "Female",
        unisex: "Unisex",
    };
    return genderMap[gender];
};

export class AssistantController {
    static async assistantChat(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const message = String(req.query.q ?? "");
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 30);
            const userId = req.user?.id;

            let userGender: AssistantGender = null;
            const user = await AuthService.findUserById(userId as string);
            if (user) {
                userGender = toAssistantGender(user.gender);
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
