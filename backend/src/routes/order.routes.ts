import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { OrderController } from "../controllers/orders/order.controller";

const router = express.Router();

router.post("/checkout", requireAuth, requireRole("customer"), OrderController.createOrderController);
router.get("/", requireAuth, OrderController.getUserOrdersController);
router.get("/:orderId", requireAuth, OrderController.getOrderByIdController);
router.patch("/:orderId/cancel", requireAuth, requireRole("customer"), OrderController.cancelOrderController);
router.patch("/:orderId/status", requireAuth, requireRole("admin"), OrderController.updateOrderStatusController);


export default router;
