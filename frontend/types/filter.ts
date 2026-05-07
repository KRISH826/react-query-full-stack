export interface FilterItem {
    name: string;
    count: number;
}

export interface SizeFilterItem {
    size: string;
    count: number;
}

export interface RatingFilterItem {
    rating: string;
    count: number;
}

export interface PriceRange {
    min: number;
    max: number;
}

export interface ProductFilterResponse {
    brands: FilterItem[];
    categories: FilterItem[];
    sizes: SizeFilterItem[];
    ratings: RatingFilterItem[];
    priceRange: PriceRange;
}
