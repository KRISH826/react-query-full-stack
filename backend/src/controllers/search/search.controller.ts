import { NextFunction, Request, Response } from "express";
import { SearchService } from "./search.service";
export class SearchController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q         = "",
        brand, size,
        min_price, max_price,
        rating, page,
      } = req.query;

      const result = await SearchService.searchProducts(q as string, {
        brand     : brand     as string,
        size      : size      as string,
        min_price : min_price ? Number(min_price) : undefined,
        max_price : max_price ? Number(max_price) : undefined,
        rating    : rating    ? Number(rating)    : undefined,
        page      : page      ? Number(page)      : 1,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}