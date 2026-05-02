import { Queue } from "bullmq";
import { redisConnection } from "../../db/redis";

export const refreshProductQueue = new Queue('product-refresh-queue', {
    connection: redisConnection as any,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000
        }
    }
})

export const startProductScheduler = async () => {
    await refreshProductQueue.add(
        'refresh-product-full',
        {},
        {
            jobId: 'refresh-product-full-job',
            repeat: { every: 5 * 60 * 1000 }
        }
    )
    await refreshProductQueue.add(
        'refresh-product-detail',
        {},
        {
            jobId: 'refresh-product-detail-job',
            repeat: { every: 30 * 60 * 1000 }
        }
    );

    await refreshProductQueue.add(
        'deleted-product-cache',
        {},
        {
            jobId: 'deleted-product-cache-job',
            repeat: {
                every: 20 * 60 * 60 * 1000 // 20 hours
            }
        }
    )
    console.log('Product scheduler started ✅')
}
