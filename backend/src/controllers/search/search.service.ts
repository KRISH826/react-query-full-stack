import { parseSearchQuery } from "../../helper/parseSearchQuery";
import { searchProductQuery } from "./search.repository";
import { cache } from "../../utils/cache";
import { SEARCH_CACHE_TTL_SECONDS } from "../../utils/catalog-cache";

export class SearchService {
    private static buildCacheKey(searchQuery: string) {
        const parsed = parseSearchQuery(searchQuery);

        return {
            parsed,
            cacheKey: `search:keyword:${parsed.keyword || "all"}:gender:${parsed.gender || "all"}:max_price:${parsed.max_price ?? "any"}:limit:40`,
        };
    }

    static async searchProducts(searchQuery: string = "") {
        const { parsed, cacheKey } = this.buildCacheKey(searchQuery);

        return cache.getOrSet(
            cacheKey,
            async () => {
                return searchProductQuery({
                    keyword: parsed.keyword,
                    gender: parsed.gender,
                    max_price: parsed.max_price,
                    limit: 40,
                });
            },
            SEARCH_CACHE_TTL_SECONDS
        );
    }
}
