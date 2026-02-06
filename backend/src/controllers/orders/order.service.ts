import { PoolClient } from "pg";
import { pool } from "../../db/db";
import { HttpError } from "../../middlewares/error.middleware";
import { CreateOrderDTO, DirectPurchaseDTO, OrderDB, OrderItemResponseDTO, OrderResponseDTO, OrderStatus } from "../../models/order";
import { createCartItem, getCartItems } from "../cart/cart.repository";
import { CartService } from "../cart/cart.service";
import { buyNowProductByid, createOrder, createOrderItem, findOrderById, findOrderItems, findUsersOrders, getOrderWithItems, updateOrderStatus } from "./order.repository";

export class OrderService {
    static async createOrderFromCart(userId: string, orderData: CreateOrderDTO): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const cart = await CartService.getOrCreateCart(userId, client);
            const cartItems = await getCartItems(cart.id, client);
            if (cartItems.length === 0) {
                throw new HttpError('Cart is empty', 400);
            }

            const totalAmount = cartItems.reduce((sum, item) => {
                return sum + (item.quantity * Number(item.price_at_add));
            }, 0);

            const order = await createOrder(userId, orderData, totalAmount, client);

            if (!order) {
                throw new HttpError('Failed to create order', 500);
            }

            const orderItemsPromises = cartItems.map((cartItem) => {
                const price = Number(cartItem.price_at_add);
                const subtotal = cartItem.quantity * price;
                return createOrderItem(
                    order.id,
                    cartItem.product_id,
                    cartItem.productname,
                    cartItem.brand,
                    cartItem.quantity,
                    price,
                    subtotal,
                    cartItem.image_url,
                    client
                )
            });

            await Promise.all(orderItemsPromises);

            await CartService.clearCart(userId);

            await client.query('COMMIT');

            return this.getOrderById(order.id, userId);

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getOrderById(orderId: string, userId: string): Promise<OrderResponseDTO> {
        const { order, items } = await getOrderWithItems(orderId);
        if (!order) {
            throw new HttpError('Order not found', 404);
        }
        if (order.user_id !== userId) {
            throw new HttpError('Order not found', 404);
        }
        return this.formatOrderResponseService(order, items);
    }

    static async getUSerOrdersService(userId: string): Promise<OrderResponseDTO[]> {
        const orders = await findUsersOrders(userId);
        if (!orders) {
            throw new HttpError('Orders not found', 404);
        }
        return Promise.all(
            orders.map(async (order) => {
                const items = await findOrderItems(order.id);
                return this.formatOrderResponseService(order, items);
            })
        )
    }


    static async updateStatusServices(orderId: string, userId: string, status: OrderStatus): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const order = await findOrderById(orderId, client);
            if (!order) {
                throw new HttpError('Order Not Found', 404);
            }

            if (order.user_id !== userId) {
                throw new HttpError('Please Sign In to access this order', 401);
            }

            if (status === 'cancelled' && ['shipped', 'delivered'].includes(order.status)) {
                throw new HttpError('Cannot cancel shipped or delivered orders', 400);
            }

            const updateOrder = await updateOrderStatus(orderId, status, client);
            if (!updateOrder) {
                throw new HttpError('Failed to update order', 500);
            }

            const items = await findOrderItems(orderId, client);
            await client.query('COMMIT');
            return this.formatOrderResponseService(updateOrder, items);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async buyNowService(productId: string, orderData: DirectPurchaseDTO, userId: string): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const product = await buyNowProductByid(productId, client);
            if (!product) {
                throw new HttpError('Product not found', 404);
            }
            const price = Number(product.price);
            const quantity = Number(orderData.quantity);
            const subtotal = price * quantity;
            const order = await createOrder(userId, {
                shippingAddress: orderData.shippingAddress,
                phone: orderData.phone,
                email: orderData.email,
            }, subtotal, client);

            if (!order) {
                throw new HttpError('Failed To Create Error', 401);
            }

            await createOrderItem(
                order.id,
                product.id,
                product.productname,
                product.brand || '',
                quantity,
                price,
                subtotal,
                product.image_url || '',
                client
            )

            await client.query('COMMIT');
            return this.getOrderById(order.id, userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    private static formatOrderResponseService(order: any, items: any[]): OrderResponseDTO {
        const formattedResponse: OrderItemResponseDTO[] = items.map((item) => ({
            order_id: item.order_id,
            product_id: item.product_id,
            productname: item.productname,
            product_brand: item.product_brand,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            image_url: item.image_url,
        }))

        return {
            id: order.id,
            ordernumber: order.order_number,
            totalamount: order.total_amount,
            status: order.status,
            items: formattedResponse,
            shippingaddress: {
                shipping_address: order.shipping_address,
                city: order.shipping_city,
                state: order.shipping_state,
                postalcode: order.shipping_postal_code,
                country: order.shipping_country,
            },
            phone: order.phone,
            email: order.email,
            created_at: order.created_at,
            updated_at: order.updated_at || null,
            delivered_at: order.delivered_at || null,
            cancelled_at: order.cancelled_at || null,
        }
    }
}
