import { Queue } from "bullmq";
import redis from "../../db/redis";

export const refreshProductQueue = new Queue('product-refresh-queue', {
    connection: redis as any,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
        attempts: 1
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
    console.log('Product scheduler started ✅')
}