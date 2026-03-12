import { CognitoJwtVerifier } from "aws-jwt-verify";
import { config } from "../config/config";
import { HttpError } from "../middlewares/error.middleware";

// Create the verifier outside the handler for better performance (it caches keys)
const verifier = CognitoJwtVerifier.create({
    userPoolId: config.cognito.user_pool_id!,
    tokenUse: "access",
    clientId: config.cognito.client_id!,
});

export const verifyCognitoToken = async (token: string) => {
    try {
        const payload = await verifier.verify(token);
        return payload;
    } catch (error) {
        console.error("Cognito Token Verification Error:", error);
        throw new HttpError("Invalid or expired Cognito token", 401);
    }
};
