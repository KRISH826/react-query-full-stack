import crypto from "crypto";
import { config } from "../config/config";

export const computeSecretHash = (username: string) => {
    return crypto
        .createHmac("SHA256", config.cognito.client_secret!)
        .update(username + config.cognito.client_id)
        .digest("base64");
};