import { ProductWithImagesDTO, ProductWithImagesResponseDTO } from "./product";

export interface ParsedIntentSearch {
    keyword: string | null;
    gender:"MALE" | "FEMALE" | "UNISEX" | null;  // ✅ string se specific union
    age_group:"child" | "teen" | "young" | "adult" | "senior" | null;
    age_raw: number | null;
    style: string | null;
    occasion: string | null;
    season: string | null;
    vibe_keywords: string[]; // Extracted vibe keywords from the message
}

export interface ParsedIntent {
    message: string;
    intent: ParsedIntentSearch;
    filters: {
        max_price: number | null;
        brands: string[];
        categories: string[]
    }
}

export interface AssistantResponse {
    success: boolean;
    message: string;
    products: ProductWithImagesDTO[];
    page: number;
    totalPages: number;
    intent: ParsedIntent;
}