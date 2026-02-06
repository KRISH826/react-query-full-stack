import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CreateOrderDTO, OrderDB, OrderItemDB, OrderItemResponseDTO, OrderStatus } from "../../models/order";
import { ProductWithImagesResponseDTO } from "../../models/product";

export async function createOrder(userId: string, data: CreateOrderDTO, totalamount: number, db: Pool | PoolClient = pool): Promise<OrderDB | null> {
    const { rows } = await db.query(
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
            email
        )
        VALUES ($1, generate_order_number(), $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
            userId,
            totalamount,
            data.shippingAddress.shipping_address || (data.shippingAddress as any).shippingAddress || (data.shippingAddress as any).address,
            data.shippingAddress.city,
            data.shippingAddress.state,
            data.shippingAddress.postalcode || (data.shippingAddress as any).postalCode || (data.shippingAddress as any).zip,
            data.shippingAddress.country,
            data.phone,
            data.email,
        ]
    )

    return rows[0] || null;
}

export async function findOrderById(orderId: string, db: Pool | PoolClient = pool): Promise<OrderDB | null> {
    const { rows } = await db.query(
        `SELECT * FROM orders WHERE id = $1`,
        [orderId]
    )

    return rows[0] || null;
}

export async function findUsersOrders(user_id: string, db: Pool | PoolClient = pool): Promise<OrderDB[] | null> {
    const { rows } = await db.query(
        `SELECT * FROM orders WHERE user_id = $1`,
        [user_id]
    )

    return rows;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, db: Pool | PoolClient = pool): Promise<OrderDB | null> {
    const { rows } = await db.query(
        `UPDATE orders SET status= $1 ${status === 'delivered' ? ', delivered_at = CURRENT_TIMESTAMP' : ''} ${status === 'cancelled' ? ', cancelled_at = CURRENT_TIMESTAMP' : ''}
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

export async function createOrderItem(orderId: string, productId: string, productName: string, productBrand: string, quantity: number, price: number, subtotal: number, image_url: string | null, db: Pool | PoolClient = pool): Promise<OrderItemDB | null> {
    const { rows } = await db.query(
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

export async function findOrderItems(orderId: string, db: Pool | PoolClient = pool): Promise<OrderItemDB[]> {
    const { rows } = await db.query(
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

export async function buyNowProductByid(productId: string, db: Pool | PoolClient = pool): Promise<ProductWithImagesResponseDTO | null> {
    const { rows } = await db.query(
        `
            SELECT p.id, p.productname, p.price, p.brand, pi.image_url
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.isprimary = true
            WHERE p.id = $1 AND p.deleted_at IS NULL 
        `,
        [productId]
    )
    return rows[0] || null;
}
