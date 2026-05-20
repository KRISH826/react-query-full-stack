import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FavouriteService } from "./favourite.service";

export class favouriteController {
    static async addFavouriteController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id as string;
            const productId = req.params.productId as string;
            const favourite = await FavouriteService.addFavouriteService(userId, productId);
            res.status(200).json({
                success: true,
                message: "Favourites Added Successfully",
                favourite
            });
        } catch (error) {
            next(error);
        }
    }

    static async removeFavouriteController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id as string;
            const productId = req.params.productId as string;
            const favourite = await FavouriteService.removeFavouritesService(userId, productId);
            res.status(200).json({
                success: true,
                message: "Favourite Deleted Successfully",
                favourite
            });
        } catch (error) {
            next(error);
        }
    }

    static async clearFavouriteController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const productIds = req.body.productIds as string[];
            const favourite = await FavouriteService.clearFavourite(userId, productIds);
            res.status(200).json({
                success: true,
                message: "Favourite Deleted Successfully",
                favourite
            });
        } catch (error) {
            next(error);
        }
    }

    static async getFavourites(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id as string;

            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.max(1, parseInt(req.query.limit as string) || 20);

            const favourite = await FavouriteService.findAllFavourites(userId, page, limit);
            res.status(200).json({
                success: true,
                message: "All Favourites Fetch Successfully",
                favourite
            });
        } catch (error) {
            next(error);
        }
    }
}