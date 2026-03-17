import { Pool, PoolClient } from "pg";
import { CreateReviewDTO } from "../../models/review";
import { pool } from "../../db/db";

export async function createReviewRepo(review: CreateReviewDTO & { user_id: string }, db: Pool | PoolClient = pool) {
    const query = `
        INSERT INTO reviews (product_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const result = await db.query(query, [review.product_id, review.user_id, review.rating, review.comment ?? null]);
    return result.rows[0];
}

export async function getReviewProductById(productId: string, limit: number,
    offset: number, db: Pool | PoolClient = pool) {
    const query = `
        SELECT * FROM reviews WHERE product_id = $1 LIMIT $2 OFFSET $3;
    `;
    const result = await db.query(query, [productId, limit, offset]);
    return result.rows;
}

export async function getProductRatingStars(productId: string, db: Pool | PoolClient = pool) {
    const query = `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE product_id = $1;`;
    const result = await db.query(query, [productId]);
    return result.rows[0];
}

export async function UpdateProductRatingReview(productId: string, rating: number, db: Pool | PoolClient = pool) {
    const query = `
        UPDATE products 
        SET total_reviews = total_reviews + 1,
        rating = (rating * total_reviews + $1) / (total_reviews + 1)
        WHERE id = $2
    `;
    const result = await db.query(query, [rating, productId]);
    return result.rows[0];
}