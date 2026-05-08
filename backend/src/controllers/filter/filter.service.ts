import { parseSearchQuery } from "../../helper/search";
import { getFilteredProductsQuery } from "./filter.repository";
import { cache } from "../../utils/cache";
import { FILTER_CACHE_TTL_SECONDS } from "../../utils/catalog-cache";

export class FilterService {
    private static buildCacheKey(searchQuery: string) {
        const parsed = parseSearchQuery(searchQuery);

        return {
            parsed,
            cacheKey: `filters:keyword:${parsed.keyword || "all"}:gender:${parsed.gender || "all"}`,
        };
    }

    static async getFilterService(searchQuery: string = "") {
        const { parsed, cacheKey } = this.buildCacheKey(searchQuery);

        return cache.getOrSet(
            cacheKey,
            async () => {
                return getFilteredProductsQuery({
                    keyword: parsed.keyword,
                    gender: parsed.gender,
                });
            },
            FILTER_CACHE_TTL_SECONDS
        );
    }
}
