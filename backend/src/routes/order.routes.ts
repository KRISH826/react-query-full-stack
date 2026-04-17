import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { OrderController } from "../controllers/orders/order.controller";

const router = express.Router();

router.get("/", requireAuth, OrderController.getUserOrdersController);
router.post("/checkout", requireAuth, requireRole("customer"), OrderController.createOrderController);
router.get("/:orderId", requireAuth, OrderController.getOrderByIdController);
router.delete("/:orderId/items/:itemId", requireAuth, OrderController.cancelOrderItemController);
router.patch("/:orderId/cancel", requireAuth, requireRole("customer"), OrderController.cancelOrderController);
router.patch("/:orderId/status", requireAuth, requireRole("admin"), OrderController.updateOrderStatusController);
router.post("/buy-now", requireAuth, requireRole("customer"), OrderController.buyNowController);
router.patch("/:orderId/items/:itemId/status", requireAuth, requireRole("admin"), OrderController.updateOrderItemStatusController);

export default router;

