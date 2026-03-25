import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CreateOrderDTO, OrderDB, OrderItemDB, OrderItemResponseDTO, OrderStatus } from "../../models/order";

export async function createOrder(
    userId: string,
    data: CreateOrderDTO,
    totalamount: number,
    db: Pool | PoolClient = pool
): Promise<OrderDB | null> {
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
        RETURNING *`,
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
    );
    return rows[0] || null;
}

export async function findOrderById(
    orderId: string,
    db: Pool | PoolClient = pool
): Promise<OrderDB | null> {
    const { rows } = await db.query(
        `SELECT * FROM orders WHERE id = $1 AND deleted_at IS NULL`,
        [orderId]
    );
    return rows[0] || null;
}

export async function findUsersOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
    db: Pool | PoolClient = pool
): Promise<{ data: (OrderDB & { items: OrderItemDB[] })[]; total: number }> {
    const offset = (page - 1) * limit;

    const countResult = await db.query(
        `SELECT COUNT(*) 
         FROM orders 
         WHERE user_id = $1
           AND deleted_at IS NULL`,
        [userId]
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const { rows } = await db.query(
        `SELECT 
            o.*,
            COALESCE(items.items, '[]') AS items
        FROM orders o
        LEFT JOIN LATERAL (
            SELECT json_agg(
                    json_build_object(
                        'id',                       oi.id,
                        'order_id',                 oi.order_id,
                        'product_id',               oi.product_id,
                        'variant_id',               oi.variant_id,
                        'product_name',             oi.product_name,
                        'product_brand',            oi.product_brand,
                        'quantity',                 oi.quantity,
                        'price_at_purchase',        oi.price_at_purchase,
                        'offer_price_at_purchase',  oi.offer_price_at_purchase,
                        'subtotal',                 oi.subtotal,
                        'size',                     oi.size,
                        'image_url',                oi.image_url,
                        'created_at',               oi.created_at
                    ) ORDER BY oi.created_at ASC
                ) AS items
            FROM order_items oi
            WHERE oi.order_id = o.id
        ) items ON true
        WHERE o.user_id = $1
          AND o.deleted_at IS NULL
        ORDER BY o.created_at DESC
        LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );
    return { data: rows, total };
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    db: Pool | PoolClient = pool
): Promise<OrderDB | null> {
    const { rows } = await db.query(
        `UPDATE orders 
         SET status = $1
             ${status === 'delivered' ? ', delivered_at = CURRENT_TIMESTAMP' : ''}
             ${status === 'cancelled' ? ', cancelled_at = CURRENT_TIMESTAMP' : ''},
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, orderId]
    );
    return rows[0] || null;
}

export async function createOrderItem(
    orderId: string,
    productId: string,
    variantId: string | null,
    productName: string,
    productBrand: string,
    quantity: number,
    price: number,
    offerPrice: number | null,
    subtotal: number,
    size: string | null,
    status: OrderStatus,
    imageUrl: string | null,
    db: Pool | PoolClient = pool
): Promise<OrderItemDB | null> {
    const { rows } = await db.query(
        `INSERT INTO order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            product_brand,
            quantity,
            price_at_purchase,
            offer_price_at_purchase,
            subtotal,
            size,
            status,
            image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
            orderId,
            productId,
            variantId,
            productName,
            productBrand,
            quantity,
            price,
            offerPrice,
            subtotal,
            size,
            status,
            imageUrl,
        ]
    );
    return rows[0] || null;
}

export async function findOrderItems(
    orderId: string,
    db: Pool | PoolClient = pool
): Promise<OrderItemDB[]> {
    const { rows } = await db.query(
        `SELECT * FROM order_items 
         WHERE order_id = $1 
         ORDER BY created_at ASC`,
        [orderId]
    );
    return rows;
}

export async function getOrderWithItems(
    orderId: string,
    db: Pool | PoolClient = pool
): Promise<{ order: OrderDB | null; items: OrderItemDB[] }> {
    const { rows } = await db.query(
        `SELECT 
            o.*,
            COALESCE(items.items, '[]') AS items
        FROM orders o
        LEFT JOIN LATERAL (
            SELECT json_agg(
                    json_build_object(
                        'id',                       oi.id,
                        'order_id',                 oi.order_id,
                        'product_id',               oi.product_id,
                        'variant_id',               oi.variant_id,
                        'product_name',             oi.product_name,
                        'product_brand',            oi.product_brand,
                        'quantity',                 oi.quantity,
                        'price_at_purchase',        oi.price_at_purchase,
                        'offer_price_at_purchase',  oi.offer_price_at_purchase,
                        'subtotal',                 oi.subtotal,
                        'size',                     oi.size,
                        'status',                   oi.status,
                        'image_url',                oi.image_url,
                        'created_at',               oi.created_at
                    ) ORDER BY oi.created_at ASC
                ) AS items
            FROM order_items oi
            WHERE oi.order_id = o.id
        ) items ON true
        WHERE o.id = $1
          AND o.deleted_at IS NULL`,
        [orderId]
    );

    if (!rows[0]) return { order: null, items: [] };
    const { items, ...order } = rows[0];
    return { order, items };
}

export async function buyNowProductByid(
    productId: string,
    variantId: string,
    db: Pool | PoolClient = pool
) {
    const { rows } = await db.query(
        `SELECT 
            p.id,
            p.productname,
            p.brand,
            pi.image_url,
            v.id                    AS variant_id,
            v.size,
            v.price_override        AS price,        -- ✅ IS the price
            v.offer_price_override  AS offer_price   -- ✅ IS the offer price
         FROM products p
         JOIN product_variants v ON v.id = $2 AND v.product_id = $1
         LEFT JOIN product_images pi 
            ON p.id = pi.product_id AND pi.isprimary = true
         WHERE p.id = $1 AND p.deleted_at IS NULL`,
        [productId, variantId]
    );
    return rows[0] || null;
}

export async function markOrderFailed(
    orderId: string,
    db: Pool | PoolClient = pool
): Promise<void> {
    await db.query(
        `UPDATE orders 
         SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [orderId]
    );
}

export async function cancelOrderItem(
    orderItemId: string,
    db: Pool | PoolClient = pool
): Promise<OrderItemDB | null> {
    const { rows } = await db.query(
        `UPDATE order_items
         SET status = 'cancelled',
             cancelled_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [orderItemId]
    );
    return rows[0] || null;
}
