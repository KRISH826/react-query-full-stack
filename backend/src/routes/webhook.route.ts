import express from "express";
import { PaymentController } from "../controllers/payment/payment.controller";
 
const router = express.Router();
 
router.post(
    "/",
    express.raw({ type: "application/json" }),
    PaymentController.webHookController
);
 
export default router;