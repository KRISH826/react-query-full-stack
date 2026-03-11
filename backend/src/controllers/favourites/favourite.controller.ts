import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FavouriteService } from "./favourite.service";
import { HttpError } from "../../middlewares/error.middleware";

export class favouriteController {
    static async addFavouriteController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id as string;
            const productId = req.params.productId as string;
            const favourite = await FavouriteService.addFavouriteService(userId, productId)
            res.status(200).json({
                success: true,
                message: "Favourites Added Successfully",
                favourite
            })
        } catch (error) {
            next(error)
        }
    }

    static async removeFavouriteController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const productId = req.params.productId as string;
            const favourite = await FavouriteService.removeFavouritesService(userId, productId);
            res.status(200).json({
                success: true,
                message: "Favourite Deleted SuccessFully",
                favourite
            })
        } catch (error) {
            next(error)
        }
    }

    static async getFavourites(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 1;

            const favourite = await FavouriteService.findAllFavourites(userId, page, limit);
            res.status(200).json({
                success: true,
                message: "All Favourites Fetch Successfully",
                favourite
            })
        } catch (error) {
            next(error)
        }
    }
}