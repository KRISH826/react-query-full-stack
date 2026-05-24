import rateLimit from "express-rate-limit";
import { Request } from "express";
import {RedisReply, RedisStore} from "rate-limit-redis"
import { config } from "../config/config";
import redis from "../db/redis";

interface RateLimitOptions {
    windowMinutes?: number;
    maxRequests?: number;
    message?: string;
}

export const createRateLimiter = ({
    windowMinutes = 5,
    maxRequests = 100,
    message = "Too many requests, please try again later."
}: RateLimitOptions = {}) => {

    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,

        max: maxRequests,

        standardHeaders: true,
        legacyHeaders: false,

                // Skip in development
        skip: () => config.app.env !== "production",

        keyGenerator: (req: Request) => {
            return req.ip || req.socket.remoteAddress || "unknown";
        },

         store: new RedisStore({
            sendCommand: (...args: string[]) => redis.call(args[0], ...args.slice(1)) as Promise<RedisReply>,
            prefix: "rate-limit:"
        }),

        handler: (_req, res) => {
            res.status(429).json({
                success: false,
                message
            });
        }
    });
};



// Global limiter
export const globalLimiter = createRateLimiter({
    windowMinutes: 5,
    maxRequests: 100,
    message: "Too many requests. Please try again later."
});


// Auth limiter
export const authLimiter = createRateLimiter({
    windowMinutes: 15,
    maxRequests: 30,
    message: "Too many login attempts. Please try again after 15 minutes."
});