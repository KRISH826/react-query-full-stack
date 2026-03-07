import express from "express";
import { SearchController } from "../controllers/search/search.controller";
const router = express.Router();

router.get("/search", SearchController.searchProducts);

export default router;