import { Job, Worker } from "bullmq";
import { OrderData } from "./order.queue";
import { OrderService } from "../../controllers/orders/order.service";
import { redisConnection } from "../../db/redis";

const orderWorker = new Worker<OrderData>('order-queue', async (job: Job<OrderData>) => {
    const data = job.data;
    if(data.type === "cart") {
        const order = await OrderService.createOrderFromCart(data.userId, data.orderData);
        return order;
    }

    if(data.type === "buy-now") {
        const order = await OrderService.buyNowService(data.productId, data.orderData, data.userId);
        return order;
    }
},
    {
        connection: redisConnection,
        concurrency: 20,
        limiter: {
            max: 100,
            duration: 1000
        }
    }
);

orderWorker.on("completed", (job) => {
    console.log(`[OrderWorker] Job ${job.id} completed — order created`);
});
 
orderWorker.on("failed", (job, err) => {
    console.error(`[OrderWorker] Job ${job?.id} failed:`, err.message);
});
 
orderWorker.on("error", (err) => {
    console.error("[OrderWorker] Worker error:", err);
});

export default orderWorker;