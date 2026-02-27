import { Pool, PoolClient } from "pg";
import { pool } from "../../db/db";
import { AddToCartResponse, CartDB, CartItemDB, CartItemWithDetailsDB, CartResponseDTO, UpdateCartItemDB } from "../../models/cart";

export async function findCartByUserId(userId: string, db: Pool | PoolClient = pool): Promise<CartDB | null> {
    const { rows } = await db.query(
        `SELECT * FROM carts WHERE user_id=$1`,
        [userId]
    );
    return rows[0] || null;
}

export async function createCart(userId: string, db: Pool | PoolClient = pool): Promise<CartDB | null> {
    const { rows } = await db.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
        [userId]
    );
    return rows[0];
}

export async function findCartItem(cartId: string, variantId: string, db: Pool | PoolClient = pool): Promise<CartItemDB | null> {
    const { rows } = await db.query(
        `SELECT * FROM cart_items WHERE cart_id=$1 AND variant_id=$2`,
        [cartId, variantId]
    );
    return rows[0] || null;
}

export async function createCartItem(data: AddToCartResponse, db: Pool | PoolClient = pool): Promise<CartItemDB | null> {
    const { rows } = await db.query(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price_at_add)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
            data.cart_id,
            data.product_id,
            data.variant_id,
            data.quantity,
            data.price,
        ]
    );
    return rows[0];
}

export async function updateCartItem(data: UpdateCartItemDB, db: Pool | PoolClient = pool): Promise<CartItemDB | null> {
    const { rows } = await db.query(
        `UPDATE cart_items SET quantity=$1 WHERE cart_id=$2 AND variant_id=$3 RETURNING *`,
        [
            data.quantity,
            data.cart_id,
            data.variant_id,
        ]
    );
    return rows[0];
}

export async function deleteCartItem(cartId: string, variantId: string, db: Pool | PoolClient = pool): Promise<CartItemDB | null> {
    const { rows } = await db.query(
        `DELETE FROM cart_items WHERE cart_id=$1 AND variant_id=$2 RETURNING *`,
        [cartId, variantId]
    );
    return rows[0] || null;
}

export async function getCartItems(cartId: string, db: Pool | PoolClient = pool): Promise<CartItemWithDetailsDB[]> {
    const { rows } = await db.query(
        `SELECT
            ci.product_id,
            ci.variant_id,
            ci.quantity,
            ci.price_at_add,
            v.offer_price_override,
            p.productname,
            p.brand,
            pi.image_url,
            v.size
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        JOIN product_variants v ON ci.variant_id = v.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.isprimary = true
        WHERE ci.cart_id = $1`,
        [cartId]
    );
    return rows;
}

export async function getVariantPrice(
    productId: string,
    variantId: string,
    db: Pool | PoolClient = pool
): Promise<number | null> {
    const { rows } = await db.query(
        `SELECT v.price_override AS price
         FROM product_variants v
         WHERE v.id = $1 AND v.product_id = $2`,
        [variantId, productId]
    );
    return rows[0]?.price || null;
}

export async function clearCartItems(cartId: string, db: Pool | PoolClient = pool): Promise<void> {
    await db.query(
        `DELETE FROM cart_items WHERE cart_id = $1`,
        [cartId]
    );
}