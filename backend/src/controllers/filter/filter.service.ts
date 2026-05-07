import { parseSearchQuery } from "../../helper/search";
import { getFilteredProductsQuery } from "./filter.repository";

export class FilterService {
    static async getFilterService(searchQuery: string = "") {
        const parsed = parseSearchQuery(searchQuery);
        return await getFilteredProductsQuery({
            keyword: parsed.keyword,
            gender: parsed.gender
        })
    }
}