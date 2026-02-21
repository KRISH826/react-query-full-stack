import razorpay from "../../utils/razorpay";
import { PaymentDB, VerifyPaymentDto } from "../../models/payment";
import { createPayment, markPaymentFailed, markPaymentSuccess, updateStatusConfirmedByOrderId } from "./payment.repository";
import crypto from "crypto";
import { config } from "../../config/config";
import { pool } from "../../db/db";
import { markOrderFailed } from "../orders/order.repository";
import { HttpError } from "../../middlewares/error.middleware";

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

            // 🔍 DEBUG — ye sab print karo
            console.log("=== VERIFY PAYMENT DEBUG ===")
            console.log("order_id:", data.order_id)
            console.log("razorpay_order_id:", data.razorpay_order_id)
            console.log("razorpay_payment_id:", data.razorpay_payment_id)
            console.log("razorpay_signature:", data.razorpay_signature)
            console.log("key_secret:", config.razorpay.key_secret ? "EXISTS ✅" : "UNDEFINED ❌")
            console.log("============================")

            const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;
            console.log("body string:", body)

            const expectedSignature = crypto
                .createHmac("sha256", config.razorpay.key_secret as string)
                .update(body)
                .digest("hex");

            console.log("expectedSignature:", expectedSignature)
            console.log("receivedSignature:", data.razorpay_signature)
            console.log("match:", expectedSignature === data.razorpay_signature)

            if (expectedSignature !== data.razorpay_signature) {
                // ✅ COMMIT karo taaki failed status DB mein save ho
                await markPaymentFailed(data.order_id, client);
                await markOrderFailed(data.order_id, client);
                await client.query("COMMIT");  // ✅ ROLLBACK nahi — save karna hai
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

            return true;

        } catch (error) {
            // ✅ Sirf tab ROLLBACK karo jab unexpected error ho
            if (!(error instanceof HttpError)) {
                await client.query("ROLLBACK");
            }
            throw error;
        } finally {
            client.release();
        }
    }
}