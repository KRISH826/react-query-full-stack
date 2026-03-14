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
    | "traditional";

export interface ProductAITags {
    age_group: AgeGroup;
    style: StyleType;
    gender: "male" | "female" | "unisex";
    vibe?: string[];
}


