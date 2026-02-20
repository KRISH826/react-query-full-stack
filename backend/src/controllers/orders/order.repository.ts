import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { CreateOrderDTO, OrderDB, OrderItemDB, OrderStatus } from "../../models/order";
import { ProductWithImagesResponseDTO } from "../../models/product";

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

// ✅ Single query — no N+1, returns orders with items already joined
export async function findUsersOrders(
    userId: string,
    db: Pool | PoolClient = pool
): Promise<(OrderDB & { items: OrderItemDB[] })[]> {
    const { rows } = await db.query(
        `SELECT 
            o.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id',               oi.id,
                        'order_id',         oi.order_id,
                        'product_id',       oi.product_id,
                        'product_name',     oi.product_name,
                        'product_brand',    oi.product_brand,
                        'quantity',         oi.quantity,
                        'price_at_purchase',oi.price_at_purchase,
                        'subtotal',         oi.subtotal,
                        'image_url',        oi.image_url,
                        'created_at',       oi.created_at
                    ) ORDER BY oi.created_at ASC
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        [userId]
    );
    return rows;
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
    productName: string,
    productBrand: string,
    quantity: number,
    price: number,
    subtotal: number,
    image_url: string | null,
    db: Pool | PoolClient = pool
): Promise<OrderItemDB | null> {
    const { rows } = await db.query(
        `INSERT INTO order_items (
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
        RETURNING *`,
        [orderId, productId, productName, productBrand, quantity, price, subtotal, image_url]
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

// ✅ Single query for order + items together
export async function getOrderWithItems(
    orderId: string,
    db: Pool | PoolClient = pool
): Promise<{ order: OrderDB | null; items: OrderItemDB[] }> {
    const { rows } = await db.query(
        `SELECT 
            o.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id',               oi.id,
                        'order_id',         oi.order_id,
                        'product_id',       oi.product_id,
                        'product_name',     oi.product_name,
                        'product_brand',    oi.product_brand,
                        'quantity',         oi.quantity,
                        'price_at_purchase',oi.price_at_purchase,
                        'subtotal',         oi.subtotal,
                        'image_url',        oi.image_url,
                        'created_at',       oi.created_at
                    ) ORDER BY oi.created_at ASC
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = $1
        GROUP BY o.id`,
        [orderId]
    );

    if (!rows[0]) return { order: null, items: [] };

    const { items, ...order } = rows[0];
    return { order, items };
}

export async function buyNowProductByid(
    productId: string,
    db: Pool | PoolClient = pool
): Promise<ProductWithImagesResponseDTO | null> {
    const { rows } = await db.query(
        `SELECT p.id, p.productname, p.price, p.brand, pi.image_url
         FROM products p
         LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.isprimary = true
         WHERE p.id = $1 AND p.deleted_at IS NULL`,
        [productId]
    );
    return rows[0] || null;
}