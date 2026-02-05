import { pool } from "../../db/db";
import { CreateOrderDTO, OrderDB, OrderItemDB, OrderItemResponseDTO, OrderStatus } from "../../models/order";

export async function createOrder(userId: string, data: CreateOrderDTO, totalamount: number): Promise<OrderDB | null> {
    const { rows } = await pool.query(
        `INSERT INTO orders (
            user_id,
            order_number,
            total_amount,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_postal_code,
            shipping_country,
            phone,
            email,
        )
        VALUES ($1, generate_order_number(), $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
            userId,
            totalamount,
            data.shippingAddress.shipping_address,
            data.shippingAddress.city,
            data.shippingAddress.state,
            data.shippingAddress.postalcode,
            data.shippingAddress.country,
            data.phone,
            data.email,
        ]
    )

    return rows[0] || null;
}

export async function findOrderById(orderId: string): Promise<OrderDB | null> {
    const { rows } = await pool.query(
        `SELECT * FROM orders WHERE id = $1`,
        [orderId]
    )

    return rows[0] || null;
}

export async function findUsersOrders(user_id: string): Promise<OrderDB[] | null> {
    const { rows } = await pool.query(
        `SELECT * FROM orders WHERE user_id = $1`,
        [user_id]
    )

    return rows;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderDB | null> {
    const { rows } = await pool.query(
        `UPDATE orders SET status= $1, $
        {status === 'delivered' ? 'delivered_at = CURRENT_TIMESTAMP' : ''}
        {status === 'cancelled' ? 'cancelled_at = CURRENT_TIMESTAMP' : ''}
        WHERE id = $2
        RETURNING *
        `,
        [
            status,
            orderId
        ]
    )

    return rows[0] || null;
}

export async function createOrderItem(orderId: string, productId: string, productName: string, productBrand: string, quantity: number, price: number, subtotal: number, image_url: string | null): Promise<OrderItemDB | null> {
    const { rows } = await pool.query(
        `INSERT into order_items(
            order_id,
            product_id,
            product_name,
            product_brand,
            quantity,
            price_at_purchase,
            subtotal,
            image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [
            orderId,
            productId,
            productName,
            productBrand,
            quantity,
            price,
            subtotal,
            image_url
        ]
    )

    return rows[0] || null;
}

export async function findOrderItems(orderId: string): Promise<OrderItemDB[]> {
    const { rows } = await pool.query(
        `SELECT 
            oi.*,
            pi.image_url
         FROM order_items oi
         LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.isprimary = true
         WHERE oi.order_id = $1 
         ORDER BY oi.created_at ASC`,
        [orderId]
    )

    return rows;
}

export async function getOrderWithItems(orderId: string): Promise<{ order: OrderDB | null, items: OrderItemDB[] }> {
    const order = await findOrderById(orderId);
    const items = order ? await findOrderItems(orderId) : [];

    return { order, items };
}