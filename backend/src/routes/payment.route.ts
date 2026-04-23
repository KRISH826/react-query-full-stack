import express from "express"
import { PaymentController } from "../controllers/payment/payment.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
const router = express.Router();

router.post("/create-payment", requireAuth, requireRole("customer"), PaymentController.createPaymentController);
router.post("/verify-payment", requireAuth, requireRole("customer"), PaymentController.verifyPaymentController);
router.post(
    "/webhook",PaymentController.webHookController  // raw() already app.ts mein laga diya)
);

export default router;