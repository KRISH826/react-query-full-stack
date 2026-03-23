import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
import { HttpError } from "../../middlewares/error.middleware";

export class CategoryController {
    static async createCategoryController(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await CategoryService.createCateoryService(req.body);
            res.status(201).json({
                message: "Category created successfully",
                category
            });
        } catch (error) {
            next(error);
        }
    }
    static async getCategoryByIdController(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await CategoryService.getCategoryByidService(req.params.id as string);
            res.status(200).json({
                message: "Category fetched successfully",
                category
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllCategoriesController(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryService.getAllCategoriesService();
            res.status(200).json({
                message: "Categories fetched successfully",
                categories
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateCategoryController(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await CategoryService.updateCategoryService(req.params.id as string, req.body);
            res.status(200).json({
                message: "Category updated successfully",
                category
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProductsByCategoryIdController(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId = (req.query.id as string) || (req.params.id as string);
            const slug = req.query.slug as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 30;
            const products = await CategoryService.getProductByCategoryIdService(slug, categoryId, page, limit);
            if (!products.data.length) {
                throw new HttpError("Products not found", 404);
            }
            res.status(200).json({
                message: "Products fetched successfully",
                products,
                total: products.total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategoryController(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await CategoryService.deleteCategoryService(req.params.id as string);
            res.status(200).json({
                message: "Category deleted successfully",
                category
            });
        } catch (error) {
            next(error);
        }
    }
}
