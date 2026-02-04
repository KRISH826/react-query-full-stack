import { NextFunction, Response, Request } from "express";
import { HttpError } from "../../middlewares/error.middleware";
import { CartService } from "./cart.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class CartController {
    static async getCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError('Unauthorized', 401)
            }

            const cart = await CartService.getUserCart(userId);

            return res.status(200).json({
                success: true,
                message: cart
            })

        } catch (error) {
            next(error);
        }
    }

    static async addCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError('Unauthorized', 401);
            }

            const { product_id, quantity } = req.body;

            if (!product_id || !quantity) {
                throw new HttpError('All Fields Are Required', 401);
            }

            const cart = await CartService.addToCart(userId, {
                cart_id: "",
                product_id,
                quantity
            })

            return res.status(200).json({
                message: "Cart SuccessFully Createe",
                data: cart
            })
        } catch (error) {
            next(error);
        }
    }

    static async updateCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError('Unauthorized', 401);
            }

            const { product_id, quantity } = req.body;
            if (!product_id || !quantity) {
                throw new HttpError('Product ID and Quantity are Required', 401);
            }

            const cart = await CartService.updateQuantity(userId, {
                cart_id: "",
                product_id,
                quantity
            });

            return res.status(200).json({
                message: "Cart Updated Successfully",
                data: cart
            })

        } catch (error) {
            next(error);
        }
    }

    static async deleteItemController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError('Unauthorized', 401);
            }

            const { product_id } = req.body;
            if (!product_id) {
                throw new HttpError('Product ID is Required', 401);
            }

            const cart = await CartService.deleteCart(userId, product_id);

            return res.status(200).json({
                message: "Cart Item Deleted Successfully",
                data: cart
            })

        } catch (error) {
            next(error);
        }
    }

    static async clearCartController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError('Unauthorized', 401);
            }

            await CartService.clearCart(userId);

            return res.status(200).json({
                message: "Cart Cleared Successfully",
            })

        } catch (error) {
            next(error);
        }
    }
}