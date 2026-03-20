import express from "express";
import { CategoryController } from "../controllers/category/category.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

router.post("/", requireAuth, requireRole("admin"), CategoryController.createCategoryController);
router.get("/:id", requireAuth, requireRole("admin", "customer"), CategoryController.getCategoryByIdController);
router.get("/", CategoryController.getAllCategoriesController);
router.get("/:id/products", CategoryController.getProductsByCategoryIdController);
router.put("/:id", requireAuth, requireRole("admin"), CategoryController.updateCategoryController);
router.delete("/:id", requireAuth, requireRole("admin"), CategoryController.deleteCategoryController);

export default router;