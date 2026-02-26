import { pool } from "../../db/db";
import { HttpError } from "../../middlewares/error.middleware";
import { deleteFromS3, extractKeyFromS3Url, uploadSingleImage } from "../../middlewares/upload";
import { CreateProductDTO, ProductDB, ProductStatus, ProductWithImagesDTO, UpdateProductDTO } from "../../models/product";
import { addProductImage, addProductVariant, createProduct, deleteProduct, deleteProductCategories, deleteProductImages, deleteProductVariants, findAllProducts, findById, findProductById, findProductByid, findProductWithImagesById, updateProduct } from "./product.repository";
import { addProductCategory, findCategoryById, findCategoryByName } from "../category/category.repository";
import { cache } from "../../utils/cache";

export class ProductService {
    static async createProductService(product: CreateProductDTO, files?: Express.Multer.File[]): Promise<ProductWithImagesDTO | null> {
        if (!product.productname || !product.description || !product.price || !product.category_names || product.category_names.length === 0 || !product.variants || product.variants.length === 0) {
            throw new HttpError("All fields are required", 400);
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const existingProduct = await findProductByid(product.productname, client);
            if (existingProduct) {
                throw new HttpError("Product already exists", 400);
            }
            const categoryIds: string[] = [];
            if (product.category_names && product.category_names.length > 0) {
                for (const categoryName of product.category_names) {
                    const existingCategory = await findCategoryByName(categoryName, client);
                    if (!existingCategory) {
                        throw new HttpError(`Category with name ${categoryName} not found`, 404);
                    }
                    categoryIds.push(existingCategory.id);
                }
            }

            for (const variant of product.variants) {
                if (variant.stock_quantity === undefined || variant.stock_quantity === null) {
                    throw new HttpError("Stock quantity is required for each variant", 400);
                }
            }

            const created = await createProduct({
                ...product,
                status: product.status || ProductStatus.DRAFT,
                is_track_inventory: product.is_track_inventory || true,
                stock_quantity: product.stock_quantity || 0,
            }, client)

            for (const variant of product.variants) {
                await addProductVariant({
                    product_id: created.id,
                    size: variant.size,
                    price_override: variant.price_override,
                    offer_price_override: variant.offer_price_override,
                    stock_quantity: variant.stock_quantity,
                    sku: variant.sku || null,
                }, client);
            }


            if (files?.length) {
                for (let i = 0; i < files.length; i++) {
                    const uploaded = await uploadSingleImage(files[i]);
                    await addProductImage({
                        product_id: created.id,
                        image_url: uploaded.url,
                        isprimary: i === 0,
                    }, client)
                }
            }
            if (categoryIds.length > 0) {
                for (const categoryId of categoryIds) {
                    await addProductCategory(created.id, categoryId, client)
                }
            }
            await client.query('COMMIT');
            await cache.delPattern(`product:*`);
            await cache.delPattern(`products:*`);
            return await findProductWithImagesById(created.id, client);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async findByProductIdService(id: string): Promise<ProductDB | null> {
        const existingProduct = await findProductById(id);
        if (!existingProduct) {
            throw new HttpError("Product not found", 404);
        }
        return existingProduct;
    }

    static async updateProductService(id: string, product: UpdateProductDTO, files?: Express.Multer.File[]): Promise<ProductWithImagesDTO | null> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const existingProduct = await findProductWithImagesById(id, client);
            if (!existingProduct) {
                throw new HttpError("Product not found", 404);
            }

            const categoryIds: string[] = [];
            if (product.category_names && product.category_names.length > 0) {
                for (const categoryName of product.category_names) {
                    const existingCategory = await findCategoryByName(categoryName, client);
                    if (!existingCategory) {
                        throw new HttpError(`Category with name ${categoryName} not found`, 404);
                    }
                    categoryIds.push(existingCategory.id);
                }
            }

            await updateProduct(id, {
                productname: product.productname ?? existingProduct.productname,
                description: product.description ?? existingProduct.description,
                price: product.price ?? existingProduct.price,
                offer_price: product.offer_price !== undefined ? product.offer_price : existingProduct.offer_price, // ✅
                brand: (product.brand ?? existingProduct.brand) || undefined,
                stock_quantity: product.stock_quantity ?? existingProduct.stock_quantity,
                is_track_inventory: product.is_track_inventory ?? existingProduct.is_track_inventory,
                status: product.status ?? existingProduct.status,
            }, client);
            const validFiles = files?.filter((f) => f.size > 0);
            if (validFiles?.length) {
                if (existingProduct.images?.length) {
                    for (const image of existingProduct.images) {
                        const key = extractKeyFromS3Url(image.image_url);
                        await deleteFromS3(key);
                    }
                }
                await deleteProductImages(id, client);

                for (let i = 0; i < validFiles.length; i++) {
                    const uploaded = await uploadSingleImage(validFiles[i]);
                    await addProductImage({
                        product_id: id,
                        image_url: uploaded.url,
                        isprimary: i === 0,
                    }, client);
                }
            }
            if (categoryIds.length > 0) {
                await deleteProductCategories(id, client);
                for (const categoryId of categoryIds) {
                    await addProductCategory(id, categoryId, client)
                }
            }

            if (product.variants && product.variants.length > 0) {
                for (const variant of product.variants) {
                    if (variant.stock_quantity === null) {
                        throw new HttpError("Stock quantity is required for each variant", 400);
                    }
                }
            }

            if (product.variants) {
                await deleteProductVariants(id, client);

                for (const variant of product.variants) {
                    await addProductVariant({
                        product_id: id,
                        size: variant.size,
                        price_override: variant.price_override,
                        offer_price_override: variant.offer_price_override,
                        stock_quantity: variant.stock_quantity,
                        sku: variant.sku || null,
                    }, client);
                }
            }

            await client.query('COMMIT');
            await cache.delPattern(`product:${id}:*`);
            await cache.delPattern(`products:*`);
            return await findProductWithImagesById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    static async getById(id: string): Promise<ProductWithImagesDTO> {
        const cacheKey = `product:${id}`
        return cache.getOrSet(
            cacheKey,
            async () => {
                const product = await findProductWithImagesById(id);
                if (!product) {
                    throw new HttpError("Product not found", 404);
                }
                return product;
            }
        )
    }

    static async findAllProductsService(page: number, limit: number): Promise<{ data: ProductWithImagesDTO[], total: number, page?: number, limit?: number, totalPages?: number }> {
        const cacheKey = `products:page:${page}:limit:${limit}`
        return cache.getOrSet(
            cacheKey,
            async () => {
                const products = await findAllProducts(page, limit);
                // The check for !products and throwing an error here is redundant
                // because findAllProducts is expected to return an object with data and total,
                // even if data is an empty array. If it truly returns null/undefined,
                // the repository should handle it or return an empty array.
                // For now, removing the explicit throw as per common pattern for list fetches.
                return {
                    data: products.data,
                    total: products.total,
                    page,
                    limit,
                    totalPages: Math.ceil(products.total / limit),
                };
            }
        )
    }

    static async deleteProductService(id: string): Promise<ProductDB | null> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const existingProduct = await findProductWithImagesById(id, client);
            if (!existingProduct) {
                throw new HttpError("Product not found", 404);
            }
            if (existingProduct.images) {
                for (let i = 0; i < existingProduct.images.length; i++) {
                    const key = extractKeyFromS3Url(existingProduct.images[i].image_url);
                    await deleteFromS3(key);
                }
            }
            await deleteProductCategories(id, client);
            const deleted = await deleteProduct(id, client);
            if (!deleted) {
                throw new HttpError("Product not deleted", 404);
            }
            await client.query('COMMIT');
            await cache.delPattern(`product:${id}:*`);
            await cache.delPattern(`products:*`);
            return deleted;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}