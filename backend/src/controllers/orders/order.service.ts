import { pool } from "../../db/db";
import { HttpError } from "../../middlewares/error.middleware";
import {
    CreateOrderDTO,
    DirectPurchaseDTO,
    OrderDB,
    OrderItemResponseDTO,
    PaginatedOrdersResponseDTO,
    OrderResponseDTO,
    OrderStatus,
    OrderItemDB,
} from "../../models/order";
import { getCartItems } from "../cart/cart.repository";
import { CartService } from "../cart/cart.service";
import { sendOrderCancellationMail, sendOrderItemsCancellationMail } from "../email/email.service";
import {
    adminGetOrdersAll,
    buyNowProductByid,
    cancelOrderItem,
    createOrder,
    createOrderItem,
    findOrderById,
    findOrderItemById,
    findOrderItems,
    findUsersOrders,
    getOrderWithItems,
    markOrderFailed,
    updateOrderItemStatus,
    updateOrderStatus,
} from "./order.repository";

export class OrderService {

    static async createOrderFromCart(
        userId: string,
        orderData: CreateOrderDTO
    ): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const cart = await CartService.getOrCreateCart(userId, client);
            const cartItems = await getCartItems(cart.id, client);

            if (cartItems.length === 0) {
                throw new HttpError("Cart is empty", 400);
            }

            // ✅ use offer_price if available, else price_at_add
            const totalAmount = cartItems.reduce((sum, item) => {
                const effectivePrice = item.offer_price_override
                    ? Number(item.offer_price_override)
                    : Number(item.price_at_add);
                return sum + item.quantity * effectivePrice;
            }, 0);

            const order = await createOrder(userId, orderData, totalAmount, client);
            if (!order) throw new HttpError("Failed to create order", 500);

            await Promise.all(
                cartItems.map((cartItem) => {
                    const price = Number(cartItem.price_at_add);
                    const offerPrice = cartItem.offer_price_override
                        ? Number(cartItem.offer_price_override)
                        : null;
                    const effectivePrice = offerPrice ?? price;
                    const subtotal = cartItem.quantity * effectivePrice;

                    return createOrderItem(
                        order.id,
                        cartItem.product_id,
                        cartItem.variant_id,
                        cartItem.productname,
                        cartItem.brand,
                        cartItem.quantity,
                        price,
                        offerPrice,
                        subtotal,
                        cartItem.size,
                        order.status,
                        cartItem.image_url,
                        client
                    );
                })
            );

            await CartService.clearCart(userId);
            await client.query("COMMIT");

            return this.getOrderById(order.id, userId);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async getOrderById(
        orderId: string,
        userId: string
    ): Promise<OrderResponseDTO> {
        const { order, items } = await getOrderWithItems(orderId);

        if (!order) throw new HttpError("Order not found", 404);
        if (order.user_id !== userId) throw new HttpError("Order not found", 404);

        return this.formatOrderResponse(order, items);
    }

    static async getUSerOrdersService(
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedOrdersResponseDTO> {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(10, Math.max(1, limit));
        const { data, total } = await findUsersOrders(userId, safePage, safeLimit);

        const orders = data.map((order) => {
            const { items, ...orderData } = order as any;
            return this.formatOrderResponse(orderData, items ?? []);
        });

        return {
            orders,
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
        };
    }

    static async updateStatusServices(
        orderId: string,
        userId: string,
        status: OrderStatus
    ): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const order = await findOrderById(orderId, client);
            if (!order) throw new HttpError("Order not found", 404);
            if (order.user_id !== userId) throw new HttpError("Unauthorized", 401);

            if (
                status === "cancelled" &&
                ["shipped", "delivered"].includes(order.status)
            ) {
                throw new HttpError("Cannot cancel shipped or delivered orders", 400);
            }

            const updatedOrder = await updateOrderStatus(orderId, status, client);
            if (!updatedOrder) throw new HttpError("Failed to update order", 500);

            const items = await findOrderItems(orderId, client);
            await client.query("COMMIT");

            return this.formatOrderResponse(updatedOrder, items);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateOrderItemStatusService(
        orderId: string,
        itemId: string,
        userId: string,
        status: OrderStatus
    ): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const order = await findOrderById(orderId, client);
            const orderItem = await findOrderItemById(itemId, client);
            if (!order) throw new HttpError("Order not found", 404);
            if (!orderItem) throw new HttpError("Order item not found", 404);
            if (order.user_id !== userId) throw new HttpError("Unauthorized", 401);

            await updateOrderItemStatus(itemId, status, client);

            const items = await findOrderItems(orderId, client);
            await client.query("COMMIT");

            return this.formatOrderResponse(order, items);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async buyNowService(
        productId: string,
        orderData: DirectPurchaseDTO,
        userId: string
    ): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const product = await buyNowProductByid(productId, orderData.variant_id, client);
            if (!product) throw new HttpError("Product not found", 404);

            const price = Number(product.price);
            const offerPrice = product.offer_price ? Number(product.offer_price) : null;
            const effectivePrice = offerPrice ?? price;
            const quantity = Number(orderData.quantity);
            const subtotal = effectivePrice * quantity;

            const order = await createOrder(
                userId,
                {
                    shippingAddress: orderData.shippingAddress,
                    phone: orderData.phone,
                    email: orderData.email,
                },
                subtotal,
                client
            );
            if (!order) throw new HttpError("Failed to create order", 500);

            await createOrderItem(
                order.id,
                product.id,
                product.variant_id,
                product.productname,
                product.brand || "",
                quantity,
                price,
                offerPrice,
                subtotal,
                product.status,
                product.size || null,
                product.image_url || null,
                client
            );

            await client.query("COMMIT");
            return this.getOrderById(order.id, userId);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async cancelOrderService(orderId: string, userId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const order = await findOrderById(orderId, client);
            if (!order) throw new HttpError("Order not found", 404);
            if (order.user_id !== userId) throw new HttpError("Unauthorized", 401);
            if (!["placed", "confirmed"].includes(order.status)) {
                throw new HttpError("Order cannot be cancelled", 400);
            }

            await markOrderFailed(orderId, client);
            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
        const { order, items } = await getOrderWithItems(orderId);
        if (order) {
            setImmediate(() => {
                sendOrderCancellationMail(order, items, order.email).catch((err) =>
                    console.error(
                        `[EmailService] Cancellation email failed — order: ${order.order_number}`, err
                    )
                );
            });
        }
    }

    static async cancelOrderItemsService(orderId: string, userId: string, orderItemsId: string[]): Promise<OrderResponseDTO> {
        const client = await pool.connect();
        const cancelledItems: OrderItemDB[] = [];

        try {
            await client.query("BEGIN");
            const order = await findOrderById(orderId, client);
            if (!order) throw new HttpError("Order not found", 404);
            if (order.user_id !== userId) throw new HttpError("Unauthorized", 401);
            if (!["placed", "confirmed"].includes(order.status)) {
                throw new HttpError("Items cannot be cancelled", 400);
            }

            let totalAmount = Number(order.total_amount);

            for (const itemId of orderItemsId) {
                const cancelled = await cancelOrderItem(itemId, client);
                if (cancelled) {
                    cancelledItems.push(cancelled);
                    totalAmount -= Number(cancelled.subtotal);
                }
            }

            const allItems = await findOrderItems(orderId, client);
            const allCancelled = allItems.every(item => item.status === "cancelled");
            if (allCancelled) {
                await updateOrderStatus(orderId, "cancelled", client);
            }

            await client.query(
                `UPDATE orders SET total_amount = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
                [totalAmount, orderId]
            );

            await client.query("COMMIT");

            // Fetch the updated order for the response
            const updatedOrder = await findOrderById(orderId);

            setImmediate(() => sendOrderItemsCancellationMail(order, cancelledItems, order.email)
                .catch(err => console.error(`[EmailService] Items cancellation email failed — order: ${order.order_number}`, err))
            );

            return this.formatOrderResponse(updatedOrder!, allItems);

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async adminGetAllOrdersService(
    page: number = 1,
    limit: number = 10
): Promise<PaginatedOrdersResponseDTO> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));

    const { data, total } = await adminGetOrdersAll(safePage, safeLimit);

    const orders = data.map((order) => {
        const { items, ...orderData } = order as any;
        return this.formatOrderResponse(orderData, items ?? []);
    });

    return {
        orders,
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    };
}

    private static formatOrderResponse(
        order: OrderDB,
        items: OrderItemDB[]
    ): OrderResponseDTO {
        const formattedItems: OrderItemResponseDTO[] = items.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            productname: item.product_name,
            product_brand: item.product_brand ?? "",
            quantity: item.quantity,
            price: Number(item.price_at_purchase),
            offerPrice: item.offer_price_at_purchase
                ? Number(item.offer_price_at_purchase)
                : null,
            subtotal: Number(item.subtotal),
            size: item.size ?? null,
            image_url: item.image_url ?? null,
            status: item.status as OrderStatus,
        }));

        return {
            id: order.id,
            ordernumber: order.order_number,
            totalamount: Number(order.total_amount),
            status: order.status,
            items: formattedItems,
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
            updated_at: order.updated_at,
            delivered_at: order.delivered_at ?? null,
            cancelled_at: order.cancelled_at ?? null,
        };
    }
}
