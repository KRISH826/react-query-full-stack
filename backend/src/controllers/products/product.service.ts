import { HttpError } from "../../middlewares/error.middleware";
import { NextFunction, Request, Response } from "express";
import { deleteFromS3, extractKeyFromS3Url, uploadSingleImage } from "../../middlewares/upload";
import { CreateProductDTO, ProductDB, ProductStatus, ProductWithImagesDTO, UpdateProductDTO } from "../../models/product";
import { addProductImage, createProduct, deleteProduct, findAllProducts, findById, findProductById, findProductByid, findProductWithImagesById, updateProduct } from "./product.repository";

export class ProductService {
    static async createProductService(product: CreateProductDTO, files?: Express.Multer.File[]): Promise<ProductWithImagesDTO | null> {
        if (!product.productname || !product.description || !product.price) {
            throw new HttpError("All fields are required", 400);
        }
        const existingProduct = await findProductByid(product.productname);
        if (existingProduct) {
            throw new HttpError("Product already exists", 400);
        }

        const created = await createProduct({
            ...product,
            status: product.status || ProductStatus.DRAFT,
            is_track_inventory: product.is_track_inventory || true,
            stock_quantity: product.stock_quantity || 0,
        })

        if (files?.length) {
            for (let i = 0; i < files.length; i++) {
                const uploaded = await uploadSingleImage(files[i]);
                await addProductImage({
                    product_id: created.id,
                    image_url: uploaded.url,
                    isprimary: i === 0,
                })
            }
        }
        return await findProductWithImagesById(created.id);
    }

    static async findByProductIdService(id: string): Promise<ProductDB | null> {
        const existingProduct = await findProductById(id);
        if (!existingProduct) {
            throw new HttpError("Product not found", 404);
        }
        return existingProduct;
    }

    static async updateProductService(id: string, product: UpdateProductDTO): Promise<ProductDB | null> {
        const existingProduct = await findById(id);
        if (!existingProduct) {
            throw new HttpError("Product not found", 404);
        }
        return await updateProduct(id, product);
    }
    static async getById(id: string): Promise<ProductWithImagesDTO> {
        const product = await findProductWithImagesById(id);
        if (!product) {
            throw new HttpError("Product not found", 404);
        }
        return product;
    }

    static async findAllProductsService(): Promise<ProductDB[] | null> {
        const products = await findAllProducts();
        if (!products) {
            throw new HttpError("Products not found", 404);
        }
        return products;
    }

    static async deleteProductService(id: string): Promise<ProductDB | null> {
        const existingProduct = await findProductWithImagesById(id);
        if (!existingProduct) {
            throw new HttpError("Product not found", 404);
        }
        if (existingProduct.images) {
            for (let i = 0; i < existingProduct.images.length; i++) {
                const key = extractKeyFromS3Url(existingProduct.images[i].image_url);
                await deleteFromS3(key);
            }
        }
        const deleted = await deleteProduct(id);
        if (!deleted) {
            throw new HttpError("Product not deleted", 404);
        }
        return deleted;
    }
}