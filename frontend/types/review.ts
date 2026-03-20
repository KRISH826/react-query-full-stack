export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: string;       // comes as string from backend ("4.60")
    comment: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user?: {
        name: string;
        profileimage?: string | null;
    };
}

export interface ReviewStats {
    avg_rating: string;   // comes as string from Postgres aggregate
    total_reviews: string;
}

export interface ReviewData {
    reviews: Review[];
    reviewStats: ReviewStats;
    page: number;
    limit: number;
    total: string;
}

export interface CreateReviewPayload {
    product_id: string;
    rating: number;
    comment: string;
}
