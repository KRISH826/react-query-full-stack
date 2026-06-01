import { ProductWithImagesResponseDTO } from "./product";

export interface ParsedIntent {
    keyword: string | null;
    gender: string | null;
    age_group: string | null;
    age_raw: number | null;
}

export interface ParsedIntent {
    message: string;
    intent: string;
    filter: {
        max_price: number | null;
        brands: string[];
        categories: string[]
    }
}

export interface AssistantResponse {
    success: boolean;
    message: string;
    products: ProductWithImagesResponseDTO[];
    page: number;
    totalPages: number;
    intent: ParsedIntent;
}