import { HttpError } from "../../middlewares/error.middleware";
import { AddToCartDTO, CartDB, CartItemDB, CartResponseDTO, UpdateCartDTO } from "../../models/cart";
import { createCart, createCartItem, deleteCartItem, findCartByUserId, findCartItem, getCartItems, updateCartItem } from "./cart.repository";

interface CartItemResponseDTO {
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
}


export class CartService {
    static async getOrCreateCart(userId: string): Promise<CartDB> {
        let cart = await findCartByUserId(userId);

        if (!cart) {
            cart = await createCart(userId);

            if (!cart) {
                throw new HttpError('failed to create cart', 404);
            }

        }

        return cart;
    }

    static async getUserCart(userId: string): Promise<CartResponseDTO> {
        const cart = await this.getOrCreateCart(userId);
        const items = await getCartItems(cart.id);

        const formattedItems: CartItemResponseDTO[] = items.map(
            (item: CartItemDB) => {
                const subtotal = item.quantity * Number(item.price_at_add);

                return {
                    productId: item.product_id,
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
        const cart = await this.getOrCreateCart(userId);

        const existingCart = await findCartItem(cart.id, data.product_id);

        if (existingCart) {
            await updateCartItem({
                cart_id: cart.id,
                product_id: data.product_id,
                quantity: data.quantity,
                price_at_add: data.price_at_add
            })
        } else {
            await createCartItem({
                cart_id: cart.id,
                product_id: data.product_id,
                quantity: data.quantity,
                price_at_add: data.price_at_add
            })
        }

        return this.getUserCart(userId);
    }

    static async updateQuantity(userId: string, data: UpdateCartDTO): Promise<CartResponseDTO> {
        const cart = await this.getOrCreateCart(userId);
        const item = await findCartItem(cart.id, data.product_id);

        if (!item) {
            throw new HttpError('Cart Items Not Found', 404);
        }

        if (data.quantity <= 0) {
            await deleteCartItem(cart.id, data.product_id)
        } else {
            await updateCartItem({
                cart_id: cart.id,
                product_id: data.product_id,
                quantity: data.quantity,
                price_at_add: data.price_at_add
            })
        }

        return this.getUserCart(userId);
    }

    static async deleteCart(userId: string, productId: string): Promise<CartResponseDTO> {
        const cart = await this.getOrCreateCart(userId);
        const item = await findCartItem(cart.id, productId);

        if (!item) {
            throw new HttpError("Cart item not found", 404);
        }

        await deleteCartItem(cart.id, productId);
        return this.getUserCart(userId);
    }

    static async clearCart(userId: string): Promise<void> {
        const cart = await this.getOrCreateCart(userId);

        await getCartItems(cart.id);

        await Promise.all(
            (await getCartItems(cart.id)).map((item) =>
                deleteCartItem(cart.id, item.product_id)
            )
        )
    }

}