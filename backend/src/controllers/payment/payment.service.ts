import razorpay from "../../utils/razorpay";
import { PaymentDB, VerifyPaymentDto } from "../../models/payment";
import {
    createPayment,
    findPaymentByRazorpayOrderId,
    markPaymentFailed,
    markPaymentSuccess,
    updateStatusConfirmedByOrderId,
} from "./payment.repository";
import crypto from "crypto";
import { config } from "../../config/config";
import { pool } from "../../db/db";
import { getOrderWithItems, markOrderFailed } from "../orders/order.repository";
import { HttpError } from "../../middlewares/error.middleware";
import { sendOrderConfirmatinMail } from "../email/email.service";
import { clearCartItems, findCartByUserId } from "../cart/cart.repository";
import { cache } from "../../utils/cache";
import { orderQueue } from "../../queue/order/order.queue";

export class PaymentService {

    static async createPaymentService(orderId: string, amount: string): Promise<PaymentDB> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const razorpayOrder = await razorpay.orders.create({
                amount: Number(amount) * 100,
                currency: "INR",
                receipt: orderId,
            });
            const payment = await createPayment(orderId, Number(amount), razorpayOrder.id, client);
            await client.query("COMMIT");
            return payment;
        } catch (error) {
            await client.query("ROLLBACK");
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

            // ✅ Signature mismatch = payment failed
            // markOrderFailed cancels the order AND deletes all order items
            if (expectedSignature !== data.razorpay_signature) {
                await markPaymentFailed(data.order_id, client);
                await markOrderFailed(data.order_id, client);
                await client.query("COMMIT");
                throw new HttpError("Invalid payment signature", 400);
            }

            // ✅ Payment success = confirm order + all items
            await markPaymentSuccess(
                data.order_id,
                data.razorpay_payment_id,
                data.razorpay_signature,
                client
            );
            await updateStatusConfirmedByOrderId(data.order_id, client);
            const confirmedOrderData = await getOrderWithItems(data.order_id, client);
            const confirmedOrder = confirmedOrderData.order;
            if (confirmedOrder?.user_id) {
                const cart = await findCartByUserId(confirmedOrder.user_id);
                if (cart) {
                    await clearCartItems(cart.id);
                }

                await cache.delete(`cart:${confirmedOrder.user_id}`);
            }
            await client.query("COMMIT");
            if (confirmedOrder?.user_id) {
                await cache.delete(`cart:${confirmedOrder.user_id}`);
            }

            // ✅ Fire confirmation email after commit, non-blocking
            const { order, items } = await getOrderWithItems(data.order_id);
            if (order) {
                setImmediate(() => {
                    sendOrderConfirmatinMail(order, items, order.email).catch((err) => {
                        console.error("[EmailService] Order confirmation email failed:", err);
                    });
                });
            }

            return true;

        } catch (error) {
            // Only rollback if it wasn't a deliberate commit (like the signature failure path)
            if (!(error instanceof HttpError)) {
                await client.query("ROLLBACK");
            }
            throw error;
        } finally {
            client.release();
        }
    }

    static async handlePaymentFaild(orderId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await markPaymentFailed(orderId, client);
            await markOrderFailed(orderId, client);
            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async handleWebHookService(payload: any): Promise<void> {
        const event = payload.event;

        // ✅ PAYMENT SUCCESS
        if (event === "payment.captured") {
            const client = await pool.connect();
            try {
                await client.query("BEGIN");

                const razorpayOrderId = payload.payload.payment.entity.order_id;

                const paymentRecord = await findPaymentByRazorpayOrderId(razorpayOrderId);

                if (!paymentRecord) {
                    await client.query("ROLLBACK");
                    return;
                }

                const orderId = paymentRecord.order_id;

                if (paymentRecord.status === "success") {
                    await client.query("ROLLBACK");
                    return;
                }

                await markPaymentSuccess(
                    orderId,
                    payload.payload.payment.entity.id,
                    "",
                    client
                );

                await updateStatusConfirmedByOrderId(orderId, client);

                await client.query("COMMIT");

                // 🔥 QUEUE EVENT
                await orderQueue.add("order.confirmed", {
                    type: "order.confirmed",
                    orderId,
                });

            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            } finally {
                client.release();
            }
        }

        // ❌ PAYMENT FAILED
        if (event === "payment.failed") {
            const client = await pool.connect();
            try {
                await client.query("BEGIN");

                const razorpayOrderId = payload.payload.payment.entity.order_id;

                const paymentRecord = await findPaymentByRazorpayOrderId(razorpayOrderId);

                if (!paymentRecord) {
                    await client.query("ROLLBACK");
                    return;
                }

                const orderId = paymentRecord.order_id;

                await markPaymentFailed(orderId, client);
                await markOrderFailed(orderId, client);

                await client.query("COMMIT");

                // 🔥 QUEUE EVENT
                await orderQueue.add("order.failed", {
                    type: "order.failed",
                    orderId,
                });

            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            } finally {
                client.release();
            }
        }
    }
}
