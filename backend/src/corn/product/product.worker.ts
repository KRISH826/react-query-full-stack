import { Worker } from "bullmq";
import { redisConnection } from "../../db/redis";
import { deleteProductFromDb, refreshProductDetailMV, refreshProductFullMV } from "../../controllers/products/product.repository";

export const productWorker = new Worker('product-refresh-queue', async (job) => {
    const startTime = performance.now();
    try {
        if (job.name === 'refresh-product-full') {
            await refreshProductFullMV()
        } else if (job.name === 'refresh-product-detail') {
            await refreshProductDetailMV()
        }else if(job.name === 'deleted-product-cache') {
            await deleteProductFromDb(100);
            await refreshProductDetailMV();
            await refreshProductFullMV();
        }
        const durationSecs = ((performance.now() - startTime) / 1000).toFixed(2);
        console.log(`[Product Worker] Job ${job.name} completed in ${durationSecs} seconds`);
    } catch (error) {
        console.error(`[Product Worker] Job ${job.name} failed:`, error);
        throw error;
    }
},

    {
        connection: redisConnection as any,
        concurrency: 1,

    }
)
