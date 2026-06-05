export type AgeGroup =
    | "child"
    | "teen"
    | "young"
    | "adult"
    | "senior";

export type StyleType =
    | "streetwear"
    | "casual"
    | "formal"
    | "sporty"
    | "traditional"
    | "elegant"
    | "bohemian"
    | "vintage"
    | "minimal"
    | "luxury";

export type ProductGender =
    | "male"
    | "female"
    | "unisex";


export interface ProductAITags {
    age_group: AgeGroup;
    style: StyleType;
    gender: ProductGender;
    occasion?: string[];
    season?: string[];
    fit?: string;
    pattern?: string;
    fabric_hint?: string;
    vibe: string[];
    search_keywords: string[];
    image_description?: string; // Vision se aane wala description
    recommended_age_range?: string;
    wearer_profile?: string;
}
