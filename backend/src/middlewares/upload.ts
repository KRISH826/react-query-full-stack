import multer from "multer";
import crypto from "crypto";
import { s3Client } from "../utils/s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";


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

export const compressImage = async (file: Express.Multer.File) => {
    try {
        console.log('🖼️ Original image size:', Math.round(file.size / 1024), 'KB');
        const compressedBuffer = await sharp(file.buffer)
            .resize(1920, 1080, { // Max dimensions
                fit: 'inside',
                withoutEnlargement: true // Don't enlarge small images
            })
            .webp({ quality: 80 }) // Convert to WebP with 80% quality
            .toBuffer();
        console.log('🖼️ Compressed image size:', Math.round(compressedBuffer.length / 1024), 'KB');
        return compressedBuffer;
    } catch (error) {
        console.error('❌ Image compression failed:', error);
        throw new Error('Failed to compress image');
    }
}

export const uploadSingleImage = async (file: Express.Multer.File): Promise<{ url: string, key: string }> => {
    try {
        const key = `products/${crypto.randomUUID()}.webp`;
        const compressedBuffer = await compressImage(file);
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
                Body: compressedBuffer,
                ContentType: "image/webp"
            })
        )
        return {
            key,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
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
    const region = process.env.AWS_REGION!;
    return url.split(`${bucket}.s3.${region}.amazonaws.com/`)[1];
};
