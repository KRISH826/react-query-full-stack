import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";

export class ProductController {
    static async createProductController(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as Express.Multer.File[] | undefined;
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
            const products = await ProductService.findAllProductsService();
            return res.status(200).json({
                products,
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