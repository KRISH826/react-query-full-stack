import { Queue } from "bullmq";
import { CreateOrderDTO, DirectPurchaseDTO } from "../../models/order";
import { redisConnection } from "../../db/redis";

export interface CartOrderData {
    type: "cart";
    userId: string;
    orderData: CreateOrderDTO
}

export interface BuyNowOrderData {
    type: "buy-now";
    productId: string;
    orderData: DirectPurchaseDTO
    userId: string;
}

export type OrderData = CartOrderData | BuyNowOrderData;

export const orderQueue = new Queue<OrderData>("order-queue", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000
        },
        removeOnComplete: 1000,
        removeOnFail: 500
    }
});