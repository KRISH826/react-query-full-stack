import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { favouriteController } from "../controllers/favourites/favourite.controller";

const router = express.Router();

router.get("/", requireAuth, requireRole("customer"), favouriteController.getFavourites);
router.post("/:productId", requireAuth, requireRole("customer"), favouriteController.addFavouriteController);
router.delete("/:productId", requireAuth, favouriteController.removeFavouriteController)
router.delete("/", requireAuth, favouriteController.clearFavouriteController);

export default router;