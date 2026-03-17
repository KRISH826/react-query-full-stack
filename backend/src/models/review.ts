export interface ReviewDB {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
}

export interface CreateReviewDTO {
    product_id: string;
    rating: number;
    comment?: string;
}

export interface UpdateReviewDTO {
    rating?: number;
    comment?: string;
}