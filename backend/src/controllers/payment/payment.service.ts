import razorpay from "../../utils/razorpay";
import { PaymentDB, VerifyPaymentDto } from "../../models/payment";
import { createPayment, markPaymentFailed, markPaymentSuccess, updateStatusConfirmedByOrderId } from "./payment.repository";
import crypto from "crypto";
import { config } from "../../config/config";
import { pool } from "../../db/db";
import { createOrderItem, getOrderWithItems, markOrderFailed } from "../orders/order.repository";
import { HttpError } from "../../middlewares/error.middleware";
import { OrderService } from "../orders/order.service";
import { sendOrderConfirmatinMail } from "../email/email.service";

export class PaymentService {

    static async createPaymentService(orderId: string, amount: string): Promise<PaymentDB> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");  // ✅ await lagao
            const razorpayOrder = await razorpay.orders.create({
                amount: Number(amount) * 100,
                currency: "INR",
                receipt: orderId,
            });
            const payment = await createPayment(orderId, Number(amount), razorpayOrder.id, client);
            await client.query("COMMIT"); // ✅ await lagao
            return payment;
        } catch (error) {
            await client.query("ROLLBACK"); // ✅ await lagao
            throw error;
        } finally {
            client.release();
        }
    }

    static async verifyPaymentService(data: VerifyPaymentDto): Promise<boolean> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;

            const expectedSignature = crypto
                .createHmac("sha256", config.razorpay.key_secret as string)
                .update(body)
                .digest("hex");

            if (expectedSignature !== data.razorpay_signature) {
                await markPaymentFailed(data.order_id, client);
                await markOrderFailed(data.order_id, client);
                await client.query("COMMIT");
                throw new HttpError("Invalid payment signature", 400);
            }
            await markPaymentSuccess(
                data.order_id,
                data.razorpay_payment_id,
                data.razorpay_signature,
                client
            );
            await updateStatusConfirmedByOrderId(data.order_id, client);
            await client.query("COMMIT");

            const { order, items } = await getOrderWithItems(data.order_id);

            if (order) {
                setImmediate(() => {
                    sendOrderConfirmatinMail(order, items, order.email).catch(err => {
                        console.error("Failed to send order confirmation email:", err);
                    })
                })
            }

            return true;

        } catch (error) {
            if (!(error instanceof HttpError)) {
                await client.query("ROLLBACK");
            }
            throw error;
        } finally {
            client.release();
        }
    }
}