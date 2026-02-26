import { NextFunction, Response } from "express";
import { HttpError } from "../../middlewares/error.middleware";
import { CartService } from "./cart.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class CartController {
    static async getCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpError('Unauthorized', 401);

            const cart = await CartService.getUserCart(userId);

            return res.status(200).json({
                success: true,
                data: cart
            });
        } catch (error) {
            next(error);
        }
    }

    static async addCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpError('Unauthorized', 401);

            const { product_id, variant_id, quantity } = req.body;

            if (!product_id || !variant_id || !quantity) {
                throw new HttpError('product_id, variant_id and quantity are required', 400);
            }

            const cart = await CartService.addToCart(userId, {
                product_id,
                variant_id,
                quantity
            });

            return res.status(201).json({
                success: true,
                message: "Item added to cart",
                data: cart
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpError('Unauthorized', 401);

            const { product_id, variant_id, quantity } = req.body;

            if (!product_id || !variant_id || quantity == null) {
                throw new HttpError('product_id, variant_id and quantity are required', 400);
            }

            const cart = await CartService.updateQuantity(userId, {
                cart_id: '', // This will be filled in service layer
                product_id,
                variant_id,
                quantity
            });

            return res.status(200).json({
                success: true,
                message: "Cart updated successfully",
                data: cart
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteItemController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpError('Unauthorized', 401);

            const { variant_id } = req.body;
            if (!variant_id) throw new HttpError('variant_id is required', 400);

            const cart = await CartService.deleteCart(userId, variant_id);

            return res.status(200).json({
                success: true,
                message: "Cart item deleted successfully",
                data: cart
            });
        } catch (error) {
            next(error);
        }
    }

    static async clearCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpError('Unauthorized', 401);

            await CartService.clearCart(userId);

            return res.status(200).json({
                success: true,
                message: "Cart cleared successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}