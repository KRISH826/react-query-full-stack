import express from "express"
import { PaymentController } from "../controllers/payment/payment.controller"

const webhookRouter = express.Router()

// ✅ raw body chahiye signature verify karne ke liye
webhookRouter.post(
    "/",
    express.raw({ type: "application/json" }),
    PaymentController.webHookController
)

export default webhookRouter