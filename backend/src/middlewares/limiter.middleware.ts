import { Request } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../config/config";

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
    const shouldSkipRateLimit = (req: Request) => {
        if (config.app.env !== "production") {
            return true;
        }

        const forwardedFor = req.headers["x-forwarded-for"];
        const forwardedIp =
            typeof forwardedFor === "string"
                ? forwardedFor.split(",")[0]?.trim()
                : undefined;

        const ips = [req.ip, req.socket.remoteAddress, forwardedIp]
            .filter(Boolean)
            .map((ip) => ip!.replace(/^::ffff:/, ""));

        return ips.some((ip) => ip === "127.0.0.1" || ip === "::1" || ip === "localhost");
    };

    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        skip: shouldSkipRateLimit,
        message: {
            success: false,
            message
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};

// Pre-configured common limiters
export const globalLimiter = createRateLimiter({
    windowMinutes: 5,
    maxRequests: 70,
    message: "Too many requests from this IP, please try again after 5 minutes"
});

export const authLimiter = createRateLimiter({
    windowMinutes: 15,
    maxRequests: 150,
    message: "Too many login attempts, please try again after 15 minutes"
});
