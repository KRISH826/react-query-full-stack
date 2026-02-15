import redis from "../db/redis"

const inFlightRequests = new Map<string, Promise<any>>();

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error("Redis GET Error:", err);
            return null;
        }
    },
    async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
        try {
            await redis.setex(key, ttlSeconds, JSON.stringify(value));
        } catch (err) {
            console.error("Redis SET Error:", err);
        }
    },
    async delete(key: string): Promise<void> {
        try {
            await redis.del(key);
        } catch (err) {
            console.error("Redis DELETE Error:", err);
        }
    },
    async delPattern(pattern: string): Promise<void> {
        try {
            const stream = redis.scanStream({
                match: pattern,
                count: 100,
            })
            const pipeline = redis.pipeline();
            stream.on('data', (keys: string[]) => {
                if (keys.length) {
                    for (const key of keys) {
                        pipeline.del(key);
                    }
                }
            })
            stream.on('end', async () => {
                await pipeline.exec();
            })
        } catch (error) {
            console.error("Redis DEL PATTERN Error:", error);
        }
    },
    async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds = 3600): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached) {
            return cached;
        }
        if (inFlightRequests.has(key)) {
            return inFlightRequests.get(key) as Promise<T>;
        }
        const promise = (
            async () => {
                try {
                    const data = await fetchFn();
                    await this.set(key, data, ttlSeconds);
                    return data;
                } catch (error) {
                    throw error;
                } finally {
                    inFlightRequests.delete(key);
                }
            }
        )();
        inFlightRequests.set(key, promise);
        return promise;
    }
}   