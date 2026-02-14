import razorpay from "../../utils/razorpay";
import { PaymentDB, VerifyPaymentDto } from "../../models/payment";
import { createPayment, markPaymentFailed, markPaymentSuccess, updateStatusConfirmedByOrderId } from "./payment.repository";
import crypto from "crypto";
import { config } from "../../config/config";
import { pool } from "../../db/db";

export class PaymentService {
    static async createPaymentService(orderId: string, amount: string): Promise<PaymentDB> {
        const client = await pool.connect();
        try {
            client.query("BEGIN");
            const razorpayOrder = await razorpay.orders.create({
                amount: Number(amount) * 100,
                currency: "INR",
                receipt: orderId,
            })
            const payment = await createPayment(orderId, Number(amount), razorpayOrder.id, client);
            client.query("COMMIT");
            return payment;
        } catch (error) {
            client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async verifyPaymentService(data: VerifyPaymentDto) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const body =
                data.razorpay_order_id + "|" + data.razorpay_payment_id;

            const expectedSignature = crypto
                .createHmac("sha256", config.razorpay.key_secret as string)
                .update(body)
                .digest("hex");

            if (expectedSignature !== data.razorpay_signature) {
                await markPaymentFailed(data.order_id, client);
                await client.query("ROLLBACK");
                throw new Error("Invalid payment signature");
            }

            await markPaymentSuccess(
                data.order_id,
                data.razorpay_payment_id,
                data.razorpay_signature,
                client
            );

            await updateStatusConfirmedByOrderId(data.order_id, client);

            await client.query("COMMIT");

            return true;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

}