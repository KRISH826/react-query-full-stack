import rateLimit from "express-rate-limit";

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
    message: "Too many requests from this IP, please try again after 15 minutes"
});

export const authLimiter = createRateLimiter({
    windowMinutes: 15,
    maxRequests: 150,
    message: "Too many login attempts, please try again after 15 minutes"
});
