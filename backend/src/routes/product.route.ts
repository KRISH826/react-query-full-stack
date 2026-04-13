import { Router } from "express";
import { upload } from "../middlewares/upload";
import { ProductController } from "../controllers/products/product.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/", requireAuth, requireRole("admin"), upload.array("images"), ProductController.createProductController);
router.get("/", ProductController.getAllController);
router.get("/search", ProductController.searchProductsController);
router.get("/top-products", ProductController.topProductsController);
router.get("/:id", ProductController.getByIdController);
router.delete("/:id", requireAuth, requireRole("admin"), ProductController.deleteProductController);
router.put("/:id", requireAuth, requireRole("admin"), upload.array("images"), ProductController.updateProductController);
router.delete("/image/:id", requireAuth, requireRole("admin"), ProductController.deleteImageController);


export default router;