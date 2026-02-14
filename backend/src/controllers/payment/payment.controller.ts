import { AuthRequest } from "../../middlewares/auth.middleware";
import { Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";

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
}