import { AuthRequest } from "../../middlewares/auth.middleware";
import { Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import crypto from "crypto";
import { config } from "../../config/config";

export class PaymentController {
    static async createPaymentController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { order_id, amount } = req.body;
            const payment = await PaymentService.createPaymentService(order_id, amount);
            res.status(201).json({
                message: "Payment created successfully",
                payment
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyPaymentController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payment = await PaymentService.verifyPaymentService(req.body);
            res.status(200).json({
                message: "Payment verified successfully",
                payment
            });
        } catch (error) {
            next(error);
        }
    }

    static async handlePaymentFailedController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { order_id } = req.body;
            if (!order_id) {
                return res.status(400).json({ message: "Order Id is not found" });
            }
            await PaymentService.handlePaymentFaild(order_id);
            res.status(200).json({ message: "Payment failed successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async webHookController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            console.log("[Webhook] Headers:", req.headers["x-razorpay-signature"])
            console.log("[Webhook] Body type:", typeof req.body)
            console.log("[Webhook] Body:", req.body?.toString?.())
            const signature = req.headers["x-razorpay-signature"] as string;
            const rawBody = req.body;
            const expectedSignature = crypto
                .createHmac("sha256", config.razorpay.webhook_secret as string)
                .update(rawBody)
                .digest("hex");

            console.log("[Webhook] Headers:", req.headers["x-razorpay-signature"])
            console.log("[Webhook] Body type:", typeof req.body)
            console.log("[Webhook] Body:", req.body?.toString?.())
            
            if (signature !== expectedSignature) {
                return res.status(400).json({ message: "Invalid webhook signature" });
            }
            const parsedBody = JSON.parse(rawBody.toString());
            await PaymentService.handleWebHookService(parsedBody);
            res.status(200).json({ message: "Webhook handled successfully" });
        } catch (error) {
            next(error);
        }
    }
}