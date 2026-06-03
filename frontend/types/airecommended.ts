import { Product } from "./product";

interface AiIntent {
    keyword: string;
    confidence: number;
}
export interface AirecommendationResponse {
    message: string;
    products: Product[];
    intent: AiIntent;
} 