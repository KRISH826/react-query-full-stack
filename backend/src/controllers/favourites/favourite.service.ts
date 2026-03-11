import { HttpError } from "../../middlewares/error.middleware";
import { PaginatedFavouritesDTO } from "../../models/favourite";
import { cache } from "../../utils/cache";
import { findProductById } from "../products/product.repository";
import { addFavourite, findAllFavouritesByUser, findFavourite, removeFavourite } from "./favourite.repository";

export class FavouriteService {
    static async addFavouriteService(userId: string, productId: string) {
        const product = await findProductById(productId);
        if (!product) {
            throw new HttpError("Product not found", 404);
        }

        const existingFavourite = await findFavourite(userId, productId);
        if (!existingFavourite) {
            throw new HttpError("Product already added to favourites", 400);
        }
        const favourite = await addFavourite({ user_id: userId, product_id: productId });
        await cache.delPattern(`favourites:${userId}:*`);
        return favourite;
    }

    static async removeFavouritesService(userId: string, productId: string) {
        const existingFavourites = await findFavourite(userId, productId);
        if (!existingFavourites) {
            throw new HttpError("Favourite not found", 404);
        }
        const favourite = await removeFavourite(userId, productId);
        await cache.delPattern(`favourites:${userId}:*`);

        return favourite;
    }

    static async findAllFavourites(userId: string, limit: number = 20, page: number = 1): Promise<PaginatedFavouritesDTO> {
        const cacheKey = `favourites:${userId}:page:${page}:limit:${limit}`;

        return await cache.getOrSet(
            cacheKey,
            async () => {
                const { data, total } = await findAllFavouritesByUser(userId, page, limit);
                return {
                    data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            }
        );
    }
}