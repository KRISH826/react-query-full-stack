import { parseSearchQuery } from "../../helper/parseSearchQuery";
import { SearchParams } from "../../models/search";
import { getFilterOptionsQuery } from "./filter.repository";
import { searchProductsQuery } from "./search.repository";

export class SearchService {
    static async searchProducts(searchQuery: string, extraFilters: Partial<SearchParams> = {}) {
        const parsed = parseSearchQuery(searchQuery);

        const params: SearchParams = {
            ...parsed,
            ...extraFilters
        };

        const [products, filterOptions] = await Promise.all([
            searchProductsQuery(params),
            getFilterOptionsQuery({ keyword: parsed.keyword, gender: parsed.gender }),
        ]);
        return {products, filterOptions};
    }
}