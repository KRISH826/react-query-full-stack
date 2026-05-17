import { pool } from "../../db/db";
import { HttpError } from "../../middlewares/error.middleware";
import { deleteFromS3, extractKeyFromS3Url, uploadSingleImage } from "../../middlewares/upload";
import { CreateProductDTO, ProductDB, ProductStatus, ProductWithImagesDTO, UpdateProductDTO } from "../../models/product";
import { addProductImage, addProductVariant, createProduct, deleteProduct, deleteProductCategories, deleteProductImageByid, deleteProductImages, deleteProductVariants, findAllProducts, findProductById, findProductByid, findProductWithImagesById, getImageById, refreshProductDetailMV, refreshProductFullMV, saveProductAITags, searchProductsByNameAndBrand, topProducts, updateProduct } from "./product.repository";
import { addProductCategory, findCategoryByName } from "../category/category.repository";
import { cache } from "../../utils/cache";
import { AiService } from "../aisearch/ai.service";
import { invalidateCatalogCaches } from "../../utils/catalog-cache";

export class ProductService {
    private static async invalidateProductCache(productId?: string): Promise<void> {
        await invalidateCatalogCaches(productId);
    }


    static async createProductService(product: CreateProductDTO, files?: Express.Multer.File[]): Promise<ProductWithImagesDTO | null> {
        if (
            !product.productname ||
            !product.description ||
            !product.category_names ||
            product.category_names.length === 0 ||
            !product.variants ||
            product.variants.length === 0
        ) {
            throw new HttpError("All fields are required", 400);
        }

        for (const variant of product.variants) {
            if (!variant.price_override) {
                throw new HttpError("price_override is required for each variant", 400);
            }
            if (variant.stock_quantity === undefined || variant.stock_quantity === null) {
                throw new HttpError("stock_quantity is required for each variant", 400);
            }
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const existingProduct = await findProductByid(product.productname, client);
            if (existingProduct) {
                throw new HttpError("Product already exists", 400);
            }

            const categoryIds: string[] = [];
            for (const categoryName of product.category_names) {
                const existingCategory = await findCategoryByName(categoryName, client);
                if (!existingCategory) {
                    throw new HttpError(`Category with name ${categoryName} not found`, 404);
                }
                categoryIds.push(existingCategory.id);
            }

            const created = await createProduct({
                ...product,
                status: product.status || ProductStatus.DRAFT,
                is_track_inventory: product.is_track_inventory ?? true,
                stock_quantity: product.stock_quantity ?? 0,
            }, client);

            for (const variant of product.variants) {
                await addProductVariant({
                    product_id: created.id,
                    size: variant.size,
                    price_override: variant.price_override,
                    offer_price_override: variant.offer_price_override ?? null,
                    stock_quantity: variant.stock_quantity,
                    sku: variant.sku ?? null,
                }, client);
            }

            let aiTags = null;

            if (files?.length) {
                const uploadedImages: string[] = [];
                for (let i = 0; i < files.length; i++) {
                    const uploaded = await uploadSingleImage(files[i]);

                    uploadedImages.push(uploaded.url);
                    await addProductImage({
                        product_id: created.id,
                        image_url: uploaded.url,
                        isprimary: i === 0,
                    }, client);
                }

                const firstFile = files[0];
                const base64ImageString = firstFile.buffer.toString('base64');
                const imageMimeType = firstFile.mimetype; // e.g., 'image/png' ya 'image/jpeg'

                aiTags = await AiService.generateProductTags({
                    description: product.description,
                    brand: product.brand,
                    gender: product.gender,
                    category_names: product.category_names,
                    productname: product.productname,
                    imageBase64: base64ImageString,
                    mimetype: imageMimeType,
                })

                if (aiTags) {
                    await saveProductAITags(created.id, aiTags, client);
                }
            }

            for (const categoryId of categoryIds) {
                await addProductCategory(created.id, categoryId, client);
            }

            await client.query('COMMIT');
            await this.invalidateProductCache(created.id);
            await refreshProductDetailMV();
            await refreshProductFullMV();
            return await findProductWithImagesById(created.id);
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
                brand: (product.brand ?? existingProduct.brand) || undefined,
                gender: product.gender ?? existingProduct.gender,
                stock_quantity: product.stock_quantity ?? existingProduct.stock_quantity,
                is_track_inventory: product.is_track_inventory ?? existingProduct.is_track_inventory,
                status: product.status ?? existingProduct.status,
            }, client);

            const validFiles = files?.filter((f) => f.size > 0);
            if (validFiles?.length) {
                const currentImagesCount = existingProduct.images?.length || 0;
                for (let i = 0; i < validFiles.length; i++) {
                    const uploaded = await uploadSingleImage(validFiles[i]);
                    await addProductImage({
                        product_id: id,
                        image_url: uploaded.url,
                        isprimary: currentImagesCount === 0 && i === 0,
                    }, client);
                }
            }

            if (categoryIds.length > 0) {
                await deleteProductCategories(id, client);
                for (const categoryId of categoryIds) {
                    await addProductCategory(id, categoryId, client);
                }
            }

            if (product.variants && product.variants.length > 0) {
                for (const variant of product.variants) {
                    if (!variant.price_override) {
                        throw new HttpError("price_override is required for each variant", 400);
                    }
                    if (variant.stock_quantity === null || variant.stock_quantity === undefined) {
                        throw new HttpError("stock_quantity is required for each variant", 400);
                    }
                }

                await deleteProductVariants(id, client);
                for (const variant of product.variants) {
                    await addProductVariant({
                        product_id: id,
                        size: variant.size,
                        price_override: variant.price_override,
                        offer_price_override: variant.offer_price_override ?? null,
                        stock_quantity: variant.stock_quantity,
                        sku: variant.sku ?? null,
                    }, client);
                }
            }

            await client.query('COMMIT');
            await this.invalidateProductCache(id);
            await refreshProductDetailMV();
            await refreshProductFullMV();
            return await findProductWithImagesById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getById(id: string): Promise<ProductWithImagesDTO> {
        const cacheKey = `product:${id}`;
        return cache.getOrSet(
            cacheKey,
            async () => {
                const product = await findProductWithImagesById(id);
                if (!product) {
                    throw new HttpError("Product not found", 404);
                }
                return product;
            }
        );
    }

    static async findAllProductsService(page: number, limit: number): Promise<{ data: ProductWithImagesDTO[], total: number, page?: number, limit?: number, totalPages?: number }> {
        const cacheKey = `products:page:${page}:limit:${limit}`;
        return cache.getOrSet(
            cacheKey,
            async () => {
                const products = await findAllProducts(page, limit);
                return {
                    data: products.data,
                    total: products.total,
                    page,
                    limit,
                    totalPages: Math.ceil(products.total / limit),
                };
            }
        );
    }

    static async deleteProductService(id: string): Promise<ProductDB | null> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const existingProduct = await findProductWithImagesById(id, client);
            if (!existingProduct) {
                throw new HttpError("Product not found", 404);
            }

            if (existingProduct.images?.length) {
                for (const image of existingProduct.images) {
                    const key = extractKeyFromS3Url(image.image_url);
                    await deleteFromS3(key);
                }
            }

            await deleteProductCategories(id, client);
            const deleted = await deleteProduct(id, client);
            if (!deleted) {
                throw new HttpError("Product not deleted", 404);
            }

            await client.query('COMMIT');
            await this.invalidateProductCache(id);
            await refreshProductDetailMV();
            await refreshProductFullMV();

            return deleted;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async topProductsService(): Promise<ProductWithImagesDTO[]> {
        const cacheKey = `products:top`;

        return cache.getOrSet(
            cacheKey,
            async () => {
                const products = await topProducts();
                if (!products.length) {
                    throw new HttpError("No products found", 404);
                }
                return products;
            },
            60 * 60 * 1
        );
    }

    static async searchProductsByNameAndBrandService(name: string, brand: string): Promise<ProductWithImagesDTO[]> {
        const cacheKey = `products:search:name:${name}:brand:${brand}`;
        return cache.getOrSet(
            cacheKey,
            async () => {
                const products = await searchProductsByNameAndBrand(name, brand);
                if (!products.length) {
                    throw new HttpError("No products found", 404);
                }
                return products;
            },
            60 * 60 * 1 // 1 hour cache for search results
        );
    }

    static async deleteImageService(imageId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const image = await getImageById(imageId, client);
            if (!image) {
                throw new HttpError("Image not found", 404);
            }

            try {
                const key = extractKeyFromS3Url(image.image_url);
                await deleteFromS3(key);
                await deleteProductImages(imageId, client);
            } catch (error) {
                console.error(`S3 deletion failed for key: ${image.image_url}`, error);
            }
            await deleteProductImageByid(imageId, client);
            await client.query('COMMIT');
            await this.invalidateProductCache(image.product_id);
            await refreshProductDetailMV();
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

}

