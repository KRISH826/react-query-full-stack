import express from "express";
import { ReviewController } from "../controllers/review/review.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/:productId", ReviewController.getReviewsByProductId);
router.post("/", requireAuth, requireRole("customer"), ReviewController.createReview);

export default router;

