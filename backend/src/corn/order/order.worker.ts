import { Worker } from "bullmq";
import { deletePendingOrder } from "../../controllers/orders/order.repository";

export const orderWorker = new Worker('order-refresh-queue', async (job) => {
    const startTime = performance.now();
    try {
        if (job.name === 'pending-order-refresh') {
            await deletePendingOrder();
        }
        const durationSecs = ((performance.now() - startTime) / 1000).toFixed(2);
        console.log(`[Order Worker] Job ${job.name} completed in ${durationSecs} seconds`);
    } catch (error) {
        console.error(`[Order Worker] Job ${job.name} failed:`, error);
        throw error;
    }
})
