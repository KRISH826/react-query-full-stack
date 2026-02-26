import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";
import { toArray } from "../../utils/helpers";

export class ProductController {
    static async createProductController(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as Express.Multer.File[] | undefined;
            req.body.category_names = toArray(req.body.category_names);
            // ✅ variants comes as JSON string from form-data — parse it
            if (typeof req.body.variants === 'string') {
                try {
                    req.body.variants = JSON.parse(req.body.variants);
                } catch (e) {
                    req.body.variants = [];
                }
            }

            const product = await ProductService.createProductService(req.body, files);
            return res.status(201).json({
                product,
                message: "Product created successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    static async getByIdController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const product = await ProductService.getById(id);
            return res.status(200).json({
                product,
                message: "Product fetched successfully",
            });
        } catch (error) {
            next(error);
        }
    }
    static async getAllController(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const products = await ProductService.findAllProductsService(page, limit);
            return res.status(200).json({
                ...products,
                message: "Products fetched successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteProductController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const product = await ProductService.deleteProductService(id);
            return res.status(200).json({
                product,
                message: "Product deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateProductController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const files = req.files as Express.Multer.File[] | undefined;
            req.body.category_names = toArray(req.body.category_names);
            const product = await ProductService.updateProductService(id, req.body, files);
            return res.status(200).json({
                product,
                message: "Product updated successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}