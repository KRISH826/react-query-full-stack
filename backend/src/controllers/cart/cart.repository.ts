import { pool } from "../../db/db";
import { AddToCartDTO, AddToCartResponse, CartDB, CartItemDB, CartResponseDTO, UpdateCartDTO } from "../../models/cart";

export async function getProductPrice(productId: string): Promise<number | null> {
    const { rows } = await pool.query(
        `SELECT price FROM products WHERE id=$1`,
        [productId]
    )

    return rows[0]?.price || null;
}

export async function findCartByUserId(userId: string): Promise<CartDB | null> {
    const { rows } = await pool.query(
        `SELECT * from carts WHERE user_id=$1`,
        [userId]
    )

    return rows[0] || null;
}

export async function createCart(userId: string): Promise<CartDB | null> {
    const { rows } = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
        [userId]
    )
    return rows[0]
}


// cart items

export async function findCartItem(cartId: string, productId: string): Promise<CartItemDB | null> {
    const { rows } = await pool.query(
        `SELECT * FROM cart_items WHERE cart_id=$1 AND product_id=$2`,
        [cartId, productId]
    )

    return rows[0] || null
}

export async function createCartItem(data: AddToCartResponse): Promise<CartItemDB | null> {
    const { rows } = await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price_at_add) VALUES ($1, $2, $3, $4) RETURNING *`,
        [
            data.cart_id,
            data.product_id,
            data.quantity,
            data.price,
        ]
    )

    return rows[0];
}

export async function updateCartItem(data: UpdateCartDTO): Promise<CartResponseDTO | null> {
    const { rows } = await pool.query(
        `UPDATE cart_items SET quantity=$1 WHERE cart_id=$2 AND product_id=$3 RETURNING *`,
        [
            data.quantity,
            data.cart_id,
            data.product_id
        ]
    )

    return rows[0]
}

export async function deleteCartItem(cartId: string, productId: string): Promise<CartItemDB | null> {
    const { rows } = await pool.query(
        `DELETE FROM cart_items
        WHERE cart_id=$1 AND product_id=$2 RETURNING *`,
        [cartId, productId]
    )

    return rows[0] || null;
}


export async function getCartItems(cartId: string): Promise<CartItemDB[]> {
    const { rows } = await pool.query(
        `SELECT
    ci.product_id,
    ci.quantity,
    ci.price_at_add,
    p.productname,
    p.brand,
    pi.image_url
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.isprimary = true
WHERE ci.cart_id = $1
    `,
        [cartId]
    )

    return rows;
}