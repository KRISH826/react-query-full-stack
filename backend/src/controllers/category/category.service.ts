import { tryCatch } from "bullmq";
import { pool } from "../../db/db";
import { buildCategoryTree } from "../../helper/helper";
import { HttpError } from "../../middlewares/error.middleware";
import { CategoryCreateDTO, CategoryDb, CategoryResponseDTO, CategoryTree } from "../../models/category";
import { createCateGory, deleteCategory, findCategoryById, findCategoryByName, findCategoryBySlug, getAllCategories, getProductByCategoryId, searchCategory, updateCategory } from "./category.repository";
import { cache } from "../../utils/cache";

export class CategoryService {
    static async createCateoryService(data: CategoryResponseDTO): Promise<CategoryDb | null> {

        if (!data.name) {
            throw new HttpError("Category name is required", 400);
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const existingByName = await findCategoryByName(data.name, client);
            if (existingByName) {
                throw new HttpError("Category name already exists", 400);
            }

            const existingBySlug = await findCategoryBySlug(data.slug, client);
            if (existingBySlug) {
                throw new HttpError("Category slug already exists", 400);
            }
            const category = await createCateGory(data, client);
            await client.query('COMMIT');
            return category;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    }

    static async getCategoryByidService(id: string): Promise<CategoryDb | null> {
        const client = await pool.connect();
        try {
            const category = await findCategoryById(id, client);
            if (!category) {
                throw new HttpError("Category not found", 404);
            }
            return category;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async getAllCategoriesService(): Promise<CategoryTree[] | null> {
        const client = await pool.connect();
        try {
            const categories = await getAllCategories(client);
            const categoriesTree = buildCategoryTree(categories);
            if (categoriesTree.length > 0) {
                return categoriesTree;
            }
            throw new HttpError("Categories not found", 404);
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateCategoryService(id: string, data: CategoryResponseDTO): Promise<CategoryDb | null> {
        if (!data.name) {
            throw new HttpError("Category name is required", 400);
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const existingCategory = await findCategoryById(id, client);
            if (!existingCategory) {
                throw new HttpError("Category not found", 404);
            }

            if (data.name !== existingCategory.name) {
                const existingName = await findCategoryByName(data.name, client);
                if (existingName) {
                    throw new HttpError("Category name already exists", 400);
                }
            }

            if (data.slug !== existingCategory.slug) {
                const existingSlug = await findCategoryBySlug(data.slug, client);
                if (existingSlug) {
                    throw new HttpError("Category slug already exists", 400);
                }
            }

            const updatedCategory = await updateCategory(id, data, client);
            await client.query('COMMIT');
            return updatedCategory;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getProductByCategoryIdService(slug: string, categoryId: string, page: number, limit: number) {
        if (!slug) {
            throw new HttpError("Category slug is required", 400);
        }
        if (!categoryId) {
            throw new HttpError("Category id is required", 400);
        }
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const safePage = Math.max(1, page);
            const safeLimit = Math.min(30, Math.max(1, limit));
            const cacheProducts = cache.getOrSet(
                `category:${categoryId}:slug:${slug}:products:page:${safePage}:limit:${safeLimit}`,
                async () => {
                    const products = await getProductByCategoryId(slug, categoryId, safePage, safeLimit, client);
                    return products;
                }
            )
            await client.query("COMMIT");
            return cacheProducts;

        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async deleteCategoryService(id: string): Promise<CategoryDb | null> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const existingCategory = await findCategoryById(id, client);
            if (!existingCategory) {
                throw new HttpError("Category not found", 404);
            }
            const deletedCategory = await deleteCategory(id, client);
            await client.query('COMMIT');
            return deletedCategory;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async searchCategoryService(name: string): Promise<CategoryDb[]> {
        if (!name) {
            throw new HttpError("Category name is required", 400);
        }
        const client = await pool.connect();
        try {
            const categories = await searchCategory(name, client);
            return categories;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }
}
