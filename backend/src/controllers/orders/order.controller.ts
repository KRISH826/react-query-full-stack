import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/error.middleware";
import { OrderService } from "./order.service";
import { OrderStatus } from "../../models/order";
import { ProductService } from "../products/product.service";

export class OrderController {
    static async createOrderController(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError("User not found", 404);
            }
            const { shippingAddress, phone, email } = req.body;
            if (!shippingAddress || !phone || !email) {
                throw new HttpError("All fields are required", 400);
            }
            const order = await OrderService.createOrderFromCart(userId as string, {
                shippingAddress,
                phone,
                email,
            });
            return res
                .status(201)
                .json({ message: "Order created successfully", order });
        } catch (error) {
            next(error);
        }
    }

    static async getUserOrdersController(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError("Unauthorized", 401);
            }
            const orders = await OrderService.getUSerOrdersService(userId);
            return res
                .status(200)
                .json({ message: "Orders fetched successfully", orders });
        } catch (error) {
            next(error);
        }
    }

    static async buyNowController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError('Unauthorized', 401)
            }
            const { productId, shippingAddress, phone, email, variant_id } = req.body;

            if (!productId || !shippingAddress || !phone || !email || !variant_id) {
                throw new HttpError('All fields are required', 400)
            }

            const order = await OrderService.buyNowService(productId, {
                variant_id,
                quantity: 1,
                shippingAddress,
                phone,
                    email,
                }, userId);
            return res.status(201).json({ message: 'Order created successfully', order })
        } catch (error) {
            next(error)
        }
    }

    static async getOrderByIdController(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError("Unauthorized", 401);
            }
            const orderId = req.params.orderId as string;
            if (!orderId) {
                throw new HttpError("Order Id is Required", 400);
            }
            const order = await OrderService.getOrderById(orderId, userId);
            return res
                .status(200)
                .json({ message: "Order fetched successfully", order });
        } catch (error) {
            next(error);
        }
    }

    static async cancelOrderController(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError("Unauthorized", 401);
            }
            const orderId = req.params.orderId as string;
            if (!orderId) {
                throw new HttpError("Order Id is Required", 400);
            }
            const order = await OrderService.updateStatusServices(
                orderId,
                userId,
                "cancelled",
            );

            return res
                .status(200)
                .json({ message: "Order cancelled successfully", order });
        } catch (error) {
            next(error);
        }
    }

    static async updateOrderStatusController(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError("Unauthorized", 401);
            }
            const orderId = req.params.orderId as string;
            const status = req.body.status as OrderStatus;
            if (!orderId || !status) {
                throw new HttpError("Order ID and status are required", 400);
            }

            const validStatuses: OrderStatus[] = [
                "placed",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
                "refunded",
            ];
            if (!validStatuses.includes(status)) {
                throw new HttpError("Invalid status", 400);
            }

            const order = await OrderService.updateStatusServices(
                orderId,
                userId,
                status,
            );
            return res
                .status(200)
                .json({ message: "Order status updated successfully", order });
        } catch (error) {
            next(error);
        }
    }
}
