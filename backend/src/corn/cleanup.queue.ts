import { Queue } from "bullmq";

const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true" ? ({} as const) : undefined,
    maxRetriesPerRequest: null, // required by bullmq
    enableReadyCheck: false,
};

export const cleanupQueue = new Queue("cleanup-unverified-users", {
    connection: redisConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3
    }
})

export const startUpCleanScheduler = async () => {
    const repeatInterval = 15 * 60 * 1000;
    const existingJobs = await cleanupQueue.getRepeatableJobs();
    const hasCleanupJob = existingJobs.some(
        (job) => job.name === "cleanup" && Number(job.every) === repeatInterval
    );

    if (!hasCleanupJob) {
        await cleanupQueue.add(
            "cleanup",
            {},
            {
                repeat: { every: repeatInterval }
            }
        );
    }
    console.log("Cleanup scheduler started ✅");
}
