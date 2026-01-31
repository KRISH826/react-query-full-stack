import { pool } from "../../db/db";
import { CartDB } from "../../models/cart";

export async function findCartByUserId(userId: string): Promise<CartDB | null> {
    const { rows } = await pool.query(
        "SELECT * from cart where user_id = $1",
        [userId]
    );
    return rows[0] || null;
}

export async function createCart(cart: CartDB): Promise<CartDB> {
    const { rows } = await pool.query(
        "INSERT INTO cart (user_id) VALUES ($1) RETURNING *",
        [cart.user_id]
    );
    return rows[0];
}

// export async function up