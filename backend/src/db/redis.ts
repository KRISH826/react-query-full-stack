import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: false,
    keepAlive: 10000,
})

redis.on('error', (err) => {
    console.log('Redis Error', err)
})

redis.on('connect', () => {
    console.log('Redis Connected')
})

export default redis


export const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true" ? ({} as const) : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
};