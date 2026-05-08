import { parseSearchQuery } from "../../helper/parseSearchQuery";
import { searchProductQuery } from "./search.repository";
import { cache } from "../../utils/cache";
import { SEARCH_CACHE_TTL_SECONDS } from "../../utils/catalog-cache";

export class SearchService {
    private static buildCacheKey(searchQuery: string, page: number, limit: number) {
        const parsed = parseSearchQuery(searchQuery);

        return {
            parsed,
            cacheKey: `search:keyword:${parsed.keyword || "all"}:gender:${parsed.gender || "all"}:max_price:${parsed.max_price ?? "any"}:page:${page}:limit:${limit}`,
        };
    }

    static async searchProducts(searchQuery: string = "", page: number = 1, limit: number = 30) {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(40, Math.max(1, limit));
        const { parsed, cacheKey } = this.buildCacheKey(searchQuery, safePage, safeLimit);

        return cache.getOrSet(
            cacheKey,
            async () => {
                return searchProductQuery({
                    keyword: parsed.keyword,
                    gender: parsed.gender,
                    max_price: parsed.max_price,
                }, safePage, safeLimit);
            },
            SEARCH_CACHE_TTL_SECONDS
        );
    }
}
