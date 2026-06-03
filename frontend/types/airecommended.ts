import { Product } from "./product";

interface AiIntent {
    keyword: string | null;
    gender: string | null;
    age_group: string | null;
    age_raw: string | null;
    style: string | null;
    occasion: string | null;
    season: string | null;
    vibe_keywords: string[];
}
export interface AirecommendationResponse {
    message: string;
    products: Product[];
    intent: AiIntent;
} 