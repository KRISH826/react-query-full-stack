import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { HttpError } from "../../middlewares/error.middleware";
import { OrderService } from "./order.service";
import { OrderStatus } from "../../models/order";
import { orderQueue } from "../../queue/order/order.queue";

export class OrderController {
    // controllers/order.controller.ts

    static async createOrderController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpError("User not found", 404);

            const { shippingAddress, phone, email } = req.body;
            if (!shippingAddress || !phone || !email) {
                throw new HttpError("All fields are required", 400);
            }

            const order = await OrderService.createOrderFromCart(userId, {
                shippingAddress,
                phone,
                email,
            });

            return res.status(201).json({
                message: "Order created successfully",
                order
            });

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
            const rawPage = Number(req.query.page ?? 1);
            const rawLimit = Number(req.query.limit ?? 10);
            const page = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);
            const limit = Number.isNaN(rawLimit) ? 10 : Math.min(10, Math.max(1, rawLimit));

            const orders = await OrderService.getUSerOrdersService(userId, page, limit);
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
            if (!userId) throw new HttpError("Unauthorized", 401);

            const { productId, shippingAddress, phone, email, variant_id } = req.body;

            const order = await OrderService.buyNowService(
                productId,
                {
                    variant_id,
                    quantity: 1,
                    shippingAddress,
                    phone,
                    email
                },
                userId
            );

            return res.status(201).json({
                message: "Order created successfully",
                order
            });

        } catch (error) {
            next(error);
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
            const order = await OrderService.cancelOrderService(orderId, userId);

            return res
                .status(200)
                .json({ message: "Order cancelled successfully", order });
        } catch (error) {
            next(error);
        }
    }

    static async cancelOrderItemController(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpError("Unauthorized", 401);

            const orderId = req.params.orderId as string;
            const itemId = req.params.itemId as string;

            if (!orderId || !itemId) {
                throw new HttpError("Order Id and Item Id are required", 400);
            }

            const order = await OrderService.cancelOrderItemsService(orderId, userId, [itemId]);

            return res.status(200).json({ message: "Order item cancelled successfully", order });
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

    static async updateOrderItemStatusController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            console.log("BODY:", req.body);
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpError("Unauthorized", 401);
            }
            const orderId = req.params.orderId as string;
            const itemId = req.params.itemId as string;
            const status = req.body.status as OrderStatus;
            console.log("Params:", { orderId, itemId, status });
            if (!orderId || !itemId || !status) {
                throw new HttpError("Order ID, Item ID and status are required", 400);
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
            const order = await OrderService.updateOrderItemStatusService(orderId, itemId, userId, status);
            return res.status(200).json({ message: "Order item status updated successfully", order });
        } catch (error) {
            next(error)
        }
    }

    static async adminGetAllOrdersController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const rawPage = Number(req.query.page ?? 1);
            const rawLimit = Number(req.query.limit ?? 10);
            const page = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);
            const limit = Number.isNaN(rawLimit) ? 10 : Math.min(10, Math.max(1, rawLimit));
            const orders = await OrderService.adminGetAllOrdersService(page, limit);
            return res.status(200).json({ message: "Orders fetched successfully", orders });
        } catch (error) {
            next(error);
        }
    }

    static async deleteOrderController(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.user?.id;
        if (!userId) {
            return next(new HttpError("Unauthorized", 401));
        }
        try {
            const orderId = req.params.orderId as string;
            if (!orderId) {
                throw new HttpError("Order Id is Required", 400);
            }
            await OrderService.adminDeleteFullOrderItems(orderId);
            return res.status(200).json({ message: "Order deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    }

    static async adminOrderSEarchController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            const orders = await OrderService.searchOrdersService(query);
            return res.status(200).json({ message: "Orders fetched successfully", orders });
        } catch (error) {
            next(error);
        }
    }

    static async getOrderJobStatusController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.params;
            const job = await orderQueue.getJob(jobId as string);
            if (!job) {
                throw new HttpError("Job not found", 404);
            }

            const state = await job.getState();

            if (state === "completed") {
                const result = await job.returnvalue;
                return res.status(200).json({ message: "Order processed successfully", order: result });
            } else if (state === "failed") {
                const reason = job.failedReason;
                return res.status(200).json({ message: "Order processing failed", reason });
            }

            return res.status(200).json({ message: "Order is being processed", state });

        } catch (error) {
            next(error);
        }
    }
}
