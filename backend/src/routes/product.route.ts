import { Router } from "express";
import { upload } from "../middlewares/upload";
import { ProductController } from "../controllers/products/product.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/", requireAuth, requireRole("admin"), upload.array("images"), ProductController.createProductController);
router.get("/:id", ProductController.getByIdController);
router.get("/", ProductController.getAllController);
router.delete("/:id", requireAuth, requireRole("admin"), ProductController.deleteProductController);
// router.put("/:id", requireAuth, requireRole("admin"), upload.array("images"), ProductController.updateProductController)


export default router;