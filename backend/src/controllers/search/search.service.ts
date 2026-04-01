import { parseSearchQuery } from "../../helper/parseSearchQuery";
import { searchProductQuery } from "./search.repository";

export class SearchService {
    static async searchProducts(searchQuery: string = "") {
        const parsed = parseSearchQuery(searchQuery);

        return await searchProductQuery({
            keyword: parsed.keyword,
            gender: parsed.gender,
            max_price: parsed.max_price,
            limit: 40
        });
    }
}