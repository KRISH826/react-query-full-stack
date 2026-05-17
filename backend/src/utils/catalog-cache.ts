import { cache } from "./cache";

export const SEARCH_CACHE_TTL_SECONDS = 60 * 10;
export const FILTER_CACHE_TTL_SECONDS = 60 * 15;

export async function invalidateCatalogCaches(productId?: string): Promise<void> {
    if (productId) {
        await cache.delete(`product:${productId}`);
        await cache.delPattern(`product:${productId}:*`);
        await cache.delPattern(`reviews:${productId}:*`);
    }

    await Promise.all([
        cache.delPattern("products:*"),
        cache.delPattern("search:*"),
        cache.delPattern("filters:*"),
        cache.delPattern("category:*"),
    ]);
}
