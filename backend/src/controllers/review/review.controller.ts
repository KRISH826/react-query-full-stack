import { NextFunction, Request, Response } from "express";
import { ReviewServices } from "./review.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/error.middleware";

export class ReviewController {
    static async createReview(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            if (!userId) {
                throw new HttpError("Unauthorized", 401);
            }
            const review = await ReviewServices.createReview(userId, req.body);
            res.status(201).json({ success: true, message: "Review created successfully", data: review });
        } catch (error) {
            next(error);
        }
    }

    static async getReviewsByProductId(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.productId as string;
            if (!productId) {
                throw new HttpError("product_id required", 400);
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const reviews = await ReviewServices.getReviewsByProductId(productId, page, limit);
            res.status(200).json({ success: true, message: "Reviews fetched successfully", data: reviews });
        } catch (error) {
            next(error);
        }
    }
}