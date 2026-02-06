import multer from "multer";
import crypto from "crypto";
import { s3Client } from "../utils/s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "../config/config";


export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 15, // 10 mb
    },
    fileFilter(_, file, callback) {
        if (!file.mimetype.startsWith("image/")) {
            return callback(new Error('Only image files are allowed'))
        }
        callback(null, true)
    },
})

export const uploadSingleImage = async (file: Express.Multer.File): Promise<{ url: string, key: string }> => {
    try {
        const key = `products/${crypto.randomUUID()}`;
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype
            })
        )
        return {
            key,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${key}`,
        };
    } catch (error) {
        throw error;
    }
}


export const deleteFromS3 = async (key: string) => {
    try {
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
            })
        )
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const extractKeyFromS3Url = (url: string): string => {
    const bucket = process.env.AWS_BUCKET_NAME!;
    return url.split(`${bucket}.s3.ap-southeast-2.amazonaws.com/`)[1];
};