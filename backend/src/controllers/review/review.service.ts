import { pool } from "../../db/db";
import { HttpError } from "../../middlewares/error.middleware";
import { CreateReviewDTO } from "../../models/review";
import { cache } from "../../utils/cache";
import { UpdateProductRatingReview, createReviewRepo, getProductRatingStars, getReviewProductById } from "./review.repository";

export class ReviewServices {
    static async createReview(userId: string, data: CreateReviewDTO) {
        if (!userId) {
            throw new HttpError("Unauthorized", 401);
        }

        if (!data.product_id || !data.rating) {
            throw new HttpError("product_id and rating required", 400);
        }

        if (data.rating < 1 || data.rating > 5) {
            throw new HttpError("Rating must be between 1 to 5", 400);
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            let review;

            try {
                review = await createReviewRepo(
                    {
                        ...data,
                        user_id: userId
                    },
                    client
                );
            } catch (error: any) {
                if (error.code === "23505") {
                    throw new HttpError("You already reviewed this product", 400);
                }
                throw error;
            }

            await UpdateProductRatingReview(data.product_id, client);
            await client.query("COMMIT");
            await cache.delPattern(`reviews:${data.product_id}:*`);
            return review;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }


    }

    static async getReviewsByProductId(productId: string, page = 1, limit = 10) {
        if (!productId) {
            throw new HttpError("product_id required", 400);
        }

        const cacheKey = `reviews:${productId}:${page}:${limit}`;

        return cache.getOrSet(cacheKey, async () => {
            const offset = (page - 1) * limit;
            const reviews = await getReviewProductById(productId, limit, offset);
            const reviewStats = await getProductRatingStars(productId);

            return {
                reviews,
                reviewStats,
                page,
                limit,
                total: reviewStats.total_reviews,
            };
        });

    }
}