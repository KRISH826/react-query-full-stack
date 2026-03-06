import { NextFunction, Request, Response } from "express";
import { SearchService } from "./search.service";
import { HttpError } from "../../middlewares/error.middleware";

export class SearchController {
    static async searchProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = (req.query.q as string) || "";
            const products = await SearchService.searchProducts(query)
            if (!products) {
                throw new HttpError("Products not found", 404);
            }
            res.json({
                message: "Products found",
                success: true,
                data: products
            });

        } catch (error) {
            next(error);
        }
    }
}