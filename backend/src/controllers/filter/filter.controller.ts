import { NextFunction, Request, Response } from "express";
import { FilterService } from "./filter.service";

export class FilterController {
    static async getFilteredProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = (req.query.q as string) || "";
            const filteredProducts = await FilterService.getFilterService(query);
            return res.json({
                success: true,
                data: filteredProducts,
                message: "Filtered products retrieved successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}