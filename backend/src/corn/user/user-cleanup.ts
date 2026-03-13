import { AdminDeleteUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import corn from "node-cron";
import { config } from "../../config/config";
import { deleteExpiredVerificationUsers } from "../../controllers/user/user.repository";


const cognitoClient = new CognitoIdentityProviderClient({
    region: config.cognito.region!,
    credentials: {
        accessKeyId: config.cognito.access_key_id!,
        secretAccessKey: config.cognito.secret_access_key!,
    }
});
corn.schedule("*/15 * * * *", async () => {
    try {
        const deleteUsers = await deleteExpiredVerificationUsers();
        for (const user of deleteUsers) {
            await cognitoClient.send(
                new AdminDeleteUserCommand({
                    UserPoolId: config.cognito.user_pool_id,
                    Username: user.email
                })
            )
            console.log(`Deleted user: ${user.email}`);
        }
    } catch (error) {
        console.error("Cleanup cron error:", error);
    }
})