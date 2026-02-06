import { PoolClient } from "pg";
import { pool } from "../../db/db";
import { HttpError } from "../../middlewares/error.middleware";
import { AddToCartDTO, AddToCartResponse, CartDB, CartItemDB, CartItemWithDetailsDB, CartResponseDTO, UpdateCartDTO } from "../../models/cart";
import { createCart, createCartItem, deleteCartItem, findCartByUserId, findCartItem, getCartItems, getProductPrice, updateCartItem } from "./cart.repository";

interface CartItemResponseDTO {
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
}


export class CartService {
    static async getOrCreateCart(userId: string, client?: PoolClient): Promise<CartDB> {
        const db = client || pool;
        let cart = await findCartByUserId(userId, db);

        if (!cart) {
            cart = await createCart(userId, db);

            if (!cart) {
                throw new HttpError('failed to create cart', 404);
            }

        }

        return cart;
    }

    static async getUserCart(userId: string): Promise<CartResponseDTO> {
        const cart = await this.getOrCreateCart(userId);
        const items = await getCartItems(cart.id);

        const formattedItems = items.map(
            (item: CartItemWithDetailsDB) => {
                const subtotal = item.quantity * Number(item.price_at_add);

                return {
                    productId: item.product_id,
                    productName: item.productname,
                    brand: item.brand,
                    imageUrl: item.image_url ?? undefined,
                    quantity: item.quantity,
                    price: Number(item.price_at_add),
                    subtotal
                }
            }
        )

        const total = formattedItems.reduce(
            (sum, item) => sum + item.subtotal, 0
        )

        return {
            cartId: cart.id,
            items: formattedItems,
            total,
            updatedAt: cart.updated_at
        }
    }

    static async addToCart(userId: string, data: AddToCartDTO): Promise<CartResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const cart = await this.getOrCreateCart(userId, client);
            const price = await getProductPrice(data.product_id, client);

            if (!price) {
                throw new HttpError('Product not found', 404);
            }

            const existingCart = await findCartItem(cart.id, data.product_id, client);

            if (existingCart) {
                await updateCartItem({
                    cart_id: cart.id,
                    product_id: data.product_id,
                    quantity: data.quantity,
                }, client)
            } else {
                await createCartItem({
                    cart_id: cart.id,
                    product_id: data.product_id,
                    quantity: data.quantity,
                    price: price,
                }, client)
            }
            await client.query('COMMIT');
            return this.getUserCart(userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateQuantity(userId: string, data: UpdateCartDTO): Promise<CartResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const cart = await this.getOrCreateCart(userId, client);
            const item = await findCartItem(cart.id, data.product_id, client);

            if (!item) {
                throw new HttpError('Cart Items Not Found', 404);
            }

            if (data.quantity <= 0) {
                await deleteCartItem(cart.id, data.product_id, client)
            } else {
                await updateCartItem({
                    cart_id: cart.id,
                    product_id: data.product_id,
                    quantity: data.quantity,
                }, client)
            }
            await client.query('COMMIT');
            return this.getUserCart(userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async deleteCart(userId: string, productId: string): Promise<CartResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const cart = await this.getOrCreateCart(userId, client);
            const item = await findCartItem(cart.id, productId, client);

            if (!item) {
                throw new HttpError("Cart item not found", 404);
            }

            await deleteCartItem(cart.id, productId, client);
            await client.query('COMMIT');
            return this.getUserCart(userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async clearCart(userId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const cart = await this.getOrCreateCart(userId, client);
            const items = await getCartItems(cart.id, client);

            await Promise.all(
                items.map((item) =>
                    deleteCartItem(cart.id, item.product_id, client)
                )
            )
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

}