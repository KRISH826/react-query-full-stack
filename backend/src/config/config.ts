import dotenv from "dotenv";
dotenv.config();

export const config = {
    app: {
        env: process.env.NODE_ENV || "development",
        port: process.env.PORT || 4400,
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        max: 10,
        min: 1,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        // connectionString: "postgresql://neondb_owner:npg_lSpAkoNV28QT@ep-billowing-tree-ahpjft4u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"

        connectionString: `postgresql://${process.env.RDS_DB_USER}:${process.env.RDS_DB_PASSWORD}@${process.env.RDS_HOST}:${process.env.RDS_DB_PORT}/${process.env.RDS_DB_NAME}?sslmode=require&uselibpqcompat=true`
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },
    s3: {
        access_key: process.env.AWS_ACCESS_KEY,
        secret_key: process.env.AWS_SECRET_KEY,
        bucket: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION,
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
    razorpay: {
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    },
    deepseek: {
        api_key: process.env.DEEPSEEK_API_KEY,
        api_url: process.env.DEEPSEEK_API_BASEURL
    },
    ses: {
        access_key: process.env.AWS_SES_ACCESS_KEY_ID,
        secret_key: process.env.AWS_SES_SECRET_ACCESS_KEY,
        email_from: process.env.EMAIL_FROM,
    },
    cognito: {
        user_pool_id: process.env.AWS_COGNITO_USER_POOL_ID,
        client_id: process.env.AWS_COGNITO_CLIENT_ID,
        client_secret: process.env.AWS_COGNITO_CLIENT_SECRET,
        region: process.env.AWS_REGION || "us-east-1",
        access_key_id: process.env.AWS_COGNITO_ACCESS_KEY,
        secret_access_key: process.env.AWS_COGNITO_ACCESS_SECRET,
    },
    gemini: {
        api_id: process.env.GEMINI_API_KEY,
        project_id: process.env.GEMINI_PROJECT_ID
    }
}


