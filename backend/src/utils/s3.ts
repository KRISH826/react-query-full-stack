import { S3Client } from "@aws-sdk/client-s3";
import { config } from "../config/config";

console.log("DEBUG S3 CREDS:", {
    access: config.s3.access_key,
    secret_length: config.s3.secret_key?.length,
    region: config.s3.region
});

export const s3Client = new S3Client({
    region: config.s3.region,
    credentials: {
        accessKeyId: config.s3.access_key as string,
        secretAccessKey: config.s3.secret_key as string,
    },
})