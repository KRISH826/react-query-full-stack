import { Queue } from "bullmq"
import { redisConnection } from "../../db/redis"

export const refreshProductQueue = new Queue('order-refresh-queue', {
    connection: redisConnection as any,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
        attempts: 1
    }
})

export const startOrderScheduler = async () => {
    await refreshProductQueue.add(
            'pending-order-refresh',
            {},
            {
                jobId: 'pending-order-refresh-job',
                repeat: { every: 12 * 60 * 1000 }
            }
        )
    console.log('Order scheduler started ✅')
}