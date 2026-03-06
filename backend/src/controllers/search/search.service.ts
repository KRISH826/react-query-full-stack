import { parseSearchQuery } from "../../helper/search"
import { searchProductsQuery } from "./search.repository"

export class SearchService {
    static async searchProducts(searchQuery: string = "") {
        const parsed = parseSearchQuery(searchQuery);
        const products = await searchProductsQuery(
            parsed.keyword,
            parsed.gender,
            parsed.max_price,
            parsed.limit
        )
        return products;
    }
}
