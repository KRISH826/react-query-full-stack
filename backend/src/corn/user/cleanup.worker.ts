import { AdminDeleteUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { Worker } from "bullmq";
import { config } from "../../config/config";
import { deleteExpiredVerificationUsers } from "../../controllers/user/user.repository";

const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true" ? ({} as const) : undefined,
    maxRetriesPerRequest: null, // required by bullmq
    enableReadyCheck: false,
};

const cognitoClient = new CognitoIdentityProviderClient({
    region: config.cognito.region,
});

export const cleanupWorker = new Worker(
    "cleanup-unverified-users",
    async (job) => {
        console.log(`[Cleanup Worker] Processing job: ${job.id}`);
        try {
            const deletedUsers = await deleteExpiredVerificationUsers();

            for (const user of deletedUsers) {
                await cognitoClient.send(
                    new AdminDeleteUserCommand({
                        UserPoolId: config.cognito.user_pool_id,
                        Username: user.email,
                    })
                );
                console.log(`[Cleanup Worker] Deleted user from Cognito: ${user.email}`);
            }

            console.log(`[Cleanup Worker] Cleaned up ${deletedUsers.length} expired user(s).`);
        } catch (error) {
            console.error("[Cleanup Worker] Error during cleanup:", error);
            throw error;
        }
    },
    { connection: redisConnection }
);