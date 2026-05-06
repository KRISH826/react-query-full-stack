import { Router } from "express";
import { FilterController } from "../controllers/filter/filter.controller";


const router = Router();


router.get("/", FilterController.getFilteredProducts);

export default router;