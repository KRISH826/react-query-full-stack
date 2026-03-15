// search.service.ts
import { parseSearchQuery } from "../../helper/search";
import { searchProductsQuery } from "./search.repository";

export class SearchService {
    static async searchProducts(searchQuery: string = "") {
        const parsed = parseSearchQuery(searchQuery);

        // ✅ Koi AI call nahi — bas DB query
        return await searchProductsQuery({
            keyword: parsed.keyword,
            gender: parsed.gender,
            max_price: parsed.max_price,
        });
    }
}