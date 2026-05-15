import { NextFunction, Request, Response } from "express";
import { SearchService } from "./search.service";
import { HttpError } from "../../middlewares/error.middleware";

export class SearchController {
    static async searchProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = (req.query.q as string) || "";
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 30;
            const brands = req.query.brands ? (req.query.brands as string).split(",") : undefined;
            const categories = req.query.categories ? (req.query.categories as string).split(",") : undefined;
            const sizes = req.query.sizes ? (req.query.sizes as string).split(",") : undefined;
            const min_rating = req.query.min_rating ? Number(req.query.min_rating) : undefined;

            const products = await SearchService.searchProducts(query, page, limit, { brands, categories, sizes, min_rating });
            if (!products.data) {
                throw new HttpError("Products not found", 404);
            }
            res.json({
                message: "Products found",
                success: true,
                data: products.data,
                total: products.total,
                page: products.page,
                limit: products.limit,
                offset: products.offset,
                totalPages: products.totalPages,
            });

        } catch (error) {
            next(error);
        }
    }
}
