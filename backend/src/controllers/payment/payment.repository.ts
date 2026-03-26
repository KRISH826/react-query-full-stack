import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { PaymentDB } from "../../models/payment";

export async function createPayment(orderId: string, amount: number, razorpayOrderId: string, db: Pool | PoolClient = pool): Promise<PaymentDB> {
    const { rows } = await db.query(
        `INSERT INTO payments (order_id, amount, razorpay_order_id) VALUES ($1, $2, $3) RETURNING *`,
        [orderId, amount, razorpayOrderId]
    )
    return rows[0];
}

export async function markPaymentSuccess(orderId: string, razorpay_payment_id: string, signature: string, db: Pool | PoolClient = pool): Promise<PaymentDB> {
    const { rows } = await db.query(
        `UPDATE payments SET razorpay_payment_id=$1,
     razorpay_signature=$2, status='success' WHERE order_id=$3 RETURNING *`,
        [razorpay_payment_id, signature, orderId]
    )
    return rows[0];
}

export async function markPaymentFailed(orderId: string, db: Pool | PoolClient = pool): Promise<PaymentDB> {
    const { rows } = await db.query(
        `UPDATE payments SET status='failed' WHERE order_id=$1 RETURNING *`,
        [orderId]
    );
    await db.query(
        `UPDATE order_items SET status='cancelled', updated_at=CURRENT_TIMESTAMP WHERE order_id=$1`,
        [orderId]
    );
    return rows[0];
}

export async function updateStatusConfirmedByOrderId(orderId: string, db: Pool | PoolClient = pool) {
    await db.query(
        `UPDATE orders SET status='confirmed', updated_at=CURRENT_TIMESTAMP WHERE id=$1`,
        [orderId]
    );
    await db.query(
        `UPDATE order_items SET status='confirmed', updated_at=CURRENT_TIMESTAMP WHERE order_id=$1 AND status != 'cancelled'`,
        [orderId]
    );
}